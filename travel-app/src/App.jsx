import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function App() {
  const defaultDestinations = [
    {
      id: 1,
      name: 'Tokyo',
      country: 'Japan',
      lat: 35.6764,
      lng: 139.6500,
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

  const [form, setForm] = useState({
    name: '',
    country: '',
    lat: '',
    lng: ''
  })

  useEffect(() => {
    localStorage.setItem(
      'travel-destinations',
      JSON.stringify(destinations)
    )
  }, [destinations])

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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Travel Tracker
      </h1>

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
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {destinations.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
          >
            <Popup>
              <b>{d.name}</b>
              <br />
              {d.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}