import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function App() {
  const defaultDestinations = [
    {
      id: 1,
      name: 'Tokyo',
      country: 'Japan',
      category: 'City',
      rating: 5,
      visited: false,
      notes: 'Visit Akihabara and Shibuya',
      lat: 35.6764,
      lng: 139.65,
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Santorini',
      country: 'Greece',
      category: 'Beach',
      rating: 4,
      visited: true,
      notes: 'Beautiful sunset views',
      lat: 36.3932,
      lng: 25.4615,
      image:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop'
    }
  ]

  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('travel-destinations')
    return saved ? JSON.parse(saved) : defaultDestinations
  })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [darkMode, setDarkMode] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [locationResults, setLocationResults] = useState([])
  const [locationQuery, setLocationQuery] = useState('')

  const [form, setForm] = useState({
    name: '',
    country: '',
    category: 'City',
    rating: 3,
    notes: '',
    image: '',
    lat: '',
    lng: ''
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('travel-theme')
    if (savedTheme === 'dark') setDarkMode(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('travel-destinations', JSON.stringify(destinations))
  }, [destinations])

  useEffect(() => {
    localStorage.setItem('travel-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const scrollToList = () => {
    const el = document.getElementById('destination-list-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const searchLocation = async () => {
    if (!locationQuery.trim()) return

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        locationQuery
      )}`
    )

    const data = await res.json()
    setLocationResults(data)
  }

  // FIXED Wikipedia image fetch (no broken thumbnails)
  const fetchPlaceImage = async (name) => {
    try {
      const clean = name.split(',')[0]

      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(clean)}`
      )

      const data = await res.json()
      return data?.thumbnail?.source || null
    } catch {
      return null
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.country) return

    const imageValue =
      form.image && form.image.length > 0
        ? form.image
        : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'

    if (editingId) {
      setDestinations(
        destinations.map((d) =>
          d.id === editingId
            ? {
                ...d,
                ...form,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                image: imageValue
              }
            : d
        )
      )
      setEditingId(null)
    } else {
      setDestinations([
        {
          id: Date.now(),
          ...form,
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
          image: imageValue,
          visited: false
        },
        ...destinations
      ])
    }

    setForm({
      name: '',
      country: '',
      category: 'City',
      rating: 3,
      notes: '',
      image: '',
      lat: '',
      lng: ''
    })

    setLocationQuery('')
    setLocationResults([])
  }

  const removeDestination = (id) => {
    setDestinations(destinations.filter((d) => d.id !== id))
  }

  const toggleVisited = (id) => {
    setDestinations(
      destinations.map((d) =>
        d.id === id ? { ...d, visited: !d.visited } : d
      )
    )
  }

  const startEdit = (d) => {
    setEditingId(d.id)
    setForm(d)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({
      name: '',
      country: '',
      category: 'City',
      rating: 3,
      notes: '',
      image: '',
      lat: '',
      lng: ''
    })
  }

  const filtered = destinations.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filter === 'All'
        ? true
        : filter === 'Visited'
        ? d.visited
        : !d.visited

    return matchSearch && matchFilter
  })

  return (
    <div className={darkMode ? 'bg-zinc-950 text-white min-h-screen' : 'bg-slate-100 text-slate-900 min-h-screen'}>
      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold">Travel Tracker</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* FORM */}
        <div className={`p-6 rounded-3xl mb-8 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Destination' : 'Add Destination'}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 border rounded bg-transparent"
            />

            <input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="p-3 border rounded bg-transparent"
            />

            {/* LOCATION */}
            <div className="md:col-span-2">
              <input
                placeholder="Search location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="p-3 border rounded w-full"
              />

              <button
                type="button"
                onClick={searchLocation}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Search
              </button>

              {locationResults.map((p) => (
                <button
                  key={p.place_id}
                  type="button"
                  onClick={async () => {
                    const name = p.display_name.split(',')[0]
                    const country = p.display_name.split(',').slice(-1)[0]
                    const image = await fetchPlaceImage(name)

                    setForm({
                      ...form,
                      name,
                      country,
                      lat: p.lat,
                      lng: p.lon,
                      image: image || ''
                    })

                    setLocationResults([])
                    setLocationQuery(p.display_name)
                  }}
                  className="block w-full text-left p-2 border-b"
                >
                  {p.display_name}
                </button>
              ))}
            </div>

            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="p-3 border md:col-span-2 rounded bg-transparent"
            />

            {/* IMAGE PREVIEW FIXED */}
            {form.image && (
              <img
                src={form.image}
                className="md:col-span-2 h-48 object-cover rounded"
              />
            )}

            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="p-3 border md:col-span-2 rounded bg-transparent"
            />

            <button className="bg-indigo-600 text-white p-3 rounded">
              {editingId ? 'Update' : 'Add'}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit} className="bg-gray-600 text-white p-3 rounded">
                Cancel
              </button>
            )}

          </form>
        </div>

        {/* MAP */}
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={6}
          worldCopyJump={false}
          maxBounds={[
            [-85, -180],
            [85, 180]
          ]}
          maxBoundsViscosity={1.0}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap
          />

          {filtered.map((d) =>
            d.lat && d.lng ? (
              <Marker key={d.id} position={[d.lat, d.lng]}>
                <Popup>
                  <b>{d.name}</b>
                  <br />
                  {d.country}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>

        {/* SEARCH + FILTER */}
        <div className="flex gap-4 mt-8">
          <input
            className="p-3 border flex-1"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 border"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Visited</option>
            <option>Wishlist</option>
          </select>
        </div>

        {/* LIST */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {filtered.map((d) => (
            <div key={d.id} className="bg-white rounded-xl overflow-hidden shadow">

              <img src={d.image} className="h-52 w-full object-cover" />

              <div className="p-4">
                <h3 className="font-bold">{d.name}</h3>
                <p>{d.country}</p>

                <button onClick={() => toggleVisited(d.id)} className="bg-green-600 text-white px-3 py-1 rounded mt-2">
                  {d.visited ? 'Visited' : 'Wishlist'}
                </button>

                <button onClick={() => startEdit(d)} className="bg-blue-600 text-white px-3 py-1 rounded ml-2">
                  Edit
                </button>

                <button onClick={() => removeDestination(d.id)} className="bg-red-600 text-white px-3 py-1 rounded ml-2">
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}