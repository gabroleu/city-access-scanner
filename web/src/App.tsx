import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
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

// aqui eu controlo o mapa (zoom + centralização)
function MapController({ position, zoom }: { position: [number, number], zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [position, zoom, map]);

  return null;
}

// HEATMAP
function Heatmap({ issues }: { issues: Issue[] }) {
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

// aqui eu seleciono no mapa onde quero colocar o marker (clique no mapa)
function LocationSelector({ setPosition }: { setPosition: any }) {
  const map = useMap();

  useEffect(() => {
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    });
  }, [map, setPosition]);

  return null;
}

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(18);

  // busca os dados
  useEffect(() => {
    fetch('http://localhost:3333/issues')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setIssues(data);
      });
  }, []);

  // geolocalização com precião alta -- preciso verificar 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const accuracy = pos.coords.accuracy;
        console.log('ACCURACY:', accuracy);

        let zoomLevel = 18;
        if (accuracy > 100) zoomLevel = 16;
        if (accuracy > 500) zoomLevel = 14;

        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);

        setZoom(zoomLevel);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // evita renderizar antes da localização
  if (!position) return <p>Carregando localização...</p>;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '100vh', width: '100%' }}
    >
      <MapController position={position} zoom={zoom} />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* posição do usuário */}
      <Marker position={position}>
        <Popup>Você está aqui (aproximado)</Popup>
      </Marker>

      {/*permite clicar e ajustar posição */}
      <LocationSelector setPosition={setPosition} />

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