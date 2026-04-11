import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type Issue = {
  id: string;
  type: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
};

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetch('http://localhost:3333/issues')
      .then(res => res.json())
      .then(data => setIssues(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <MapContainer
      center={[-3.10, -60.02]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {issues.map(issue => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
        >
          <Popup>
            <strong>{issue.type}</strong>
            <br />
            {issue.description}
            <br />
            <img
              src={issue.imageUrl}
              alt="denúncia"
              style={{ width: '200px', marginTop: '10px' }}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;