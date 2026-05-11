import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function App() {
  const defaultDestinations = [
    {
      id: 1,
      name: 'Tokyo',
      country: 'Japan',
      lat: 35.6764,
      lng: 139.65,
      visited: false
    },
    {
      id: 2,
      name: 'Santorini',
      country: 'Greece',
      lat: 36.3932,
      lng: 25.4615,
      visited: true
    }
  ]

  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('travel-destinations')
    return saved ? JSON.parse(saved) : defaultDestinations
  })

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('travel-theme') === 'dark'
  })

  const [form, setForm] = useState({
    name: '',
    country: '',
    lat: '',
    lng: ''
  })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  // persist destinations
  useEffect(() => {
    localStorage.setItem(
      'travel-destinations',
      JSON.stringify(destinations)
    )
  }, [destinations])

  // persist theme
  useEffect(() => {
    localStorage.setItem(
      'travel-theme',
      darkMode ? 'dark' : 'light'
    )
  }, [darkMode])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.country) return

    const newDestination = {
      id: Date.now(),
      name: form.name,
      country: form.country,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      visited: false
    }

    setDestinations([newDestination, ...destinations])

    setForm({
      name: '',
      country: '',
      lat: '',
      lng: ''
    })
  }

  const removeDestination = (id) => {
    setDestinations(
      destinations.filter((d) => d.id !== id)
    )
  }

  const toggleVisited = (id) => {
    setDestinations(
      destinations.map((d) =>
        d.id === id
          ? { ...d, visited: !d.visited }
          : d
      )
    )
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
    <div
      className={`min-h-screen transition-colors ${
        darkMode
          ? 'bg-zinc-900 text-white'
          : 'bg-slate-100 text-black'
      }`}
    >
      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Travel Tracker
          </h1>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-2 mb-4 max-w-md">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-2 flex-1 text-black"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="border p-2 text-black"
          >
            <option>All</option>
            <option>Visited</option>
            <option>Wishlist</option>
          </select>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-2 mb-6 max-w-md"
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Country"
            value={form.country}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
          />

          <input
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) =>
              setForm({ ...form, lat: e.target.value })
            }
          />

          <input
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) =>
              setForm({ ...form, lng: e.target.value })
            }
          />

          <button className="bg-blue-600 text-white p-2 rounded">
            Add Destination
          </button>
        </form>

        {/* MAP */}
        <div className="rounded-xl overflow-hidden shadow">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {filtered.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
              >
                <Popup>
                  <div>
                    <b>{d.name}</b>
                    <br />
                    {d.country}
                    <br /><br />

                    <button
                      onClick={() =>
                        toggleVisited(d.id)
                      }
                    >
                      {d.visited
                        ? 'Visited'
                        : 'Mark Visited'}
                    </button>

                    <br />

                    <button
                      onClick={() =>
                        removeDestination(d.id)
                      }
                      style={{ color: 'red' }}
                    >
                      Delete
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}