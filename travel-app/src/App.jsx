import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-5xl p-4">
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
          </MapContainer>
        </div>
      </div>
    </div>
  )
}