import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup  from 'react-leaflet-cluster';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';


type Issue = {
  id: string;
  type: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
};

function Heatmap({ issues }: { issues: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!issues.length) return;

    const points = issues.map(issue => [
      issue.latitude,
      issue.longitude,
      0.5,
    ]);

    const heat = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [issues, map]);

  return null;
}

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
  fetch('http://localhost:3333/issues')
    .then(res => res.json())
    .then(data => {
      console.log(data); // 👈 AQUI
      setIssues(data);
    });
}, []);

  return (
    <MapContainer
      center={[-3.1019, -60.025]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

     <Heatmap issues={issues} />

      <MarkerClusterGroup>
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
</MarkerClusterGroup>
    </MapContainer>
  );
}

export default App;