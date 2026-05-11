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
      notes: '',
      lat: 35.6764,
      lng: 139.6500,
      image: ''
    },
    {
      id: 2,
      name: 'Santorini',
      country: 'Greece',
      category: 'Beach',
      rating: 4,
      visited: true,
      notes: '',
      lat: 36.3932,
      lng: 25.4615,
      image: ''
    }
  ]

  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('travel-destinations')
    return saved ? JSON.parse(saved) : defaultDestinations
  })

  const [search] = useState('')
  const [filter] = useState('All')

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      'travel-destinations',
      JSON.stringify(destinations)
    )
  }, [destinations])

  // Basic filter logic (kept simple for now)
  const filtered = destinations.filter((d) => {
    const matchSearch = d.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchFilter =
      filter === 'All'
        ? true
        : filter === 'Visited'
        ? d.visited
        : !d.visited

    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Travel Tracker
      </h1>

      <div className="rounded-2xl overflow-hidden shadow">
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
                  <h3 className="font-bold">{d.name}</h3>
                  <p>{d.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}