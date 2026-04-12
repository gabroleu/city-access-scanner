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

// controla zoom + centralização
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

// heatmap
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

// clique no mapa para selecionar ponto
function LocationSelector({ setSelectedPosition }: { setSelectedPosition: any }) {
  const map = useMap();

  useEffect(() => {
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedPosition([lat, lng]);
    });
  }, [map, setSelectedPosition]);

  return null;
}

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(18);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // busca dados
  const fetchIssues = () => {
    console.log('Buscando Issues...')
    
  fetch('http://localhost:3333/issues')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setIssues(data);
    });
};

useEffect(() => {
  fetchIssues();
}, []);

  // geolocalização
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

  if (!position) return <p>Carregando localização...</p>;

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        key={issues.length}
        center={position}
        zoom={zoom}
        style={{ height: '100vh', width: '100%' }}
      >
        <MapController position={position} zoom={zoom} />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* marcador do usuário */}
        <Marker position={position}>
          <Popup>Você está aqui (aproximado)</Popup>
        </Marker>

        {/* ponto selecionado */}
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>Ponto da denúncia</Popup>
          </Marker>
        )}

        <LocationSelector setSelectedPosition={setSelectedPosition} />

        <Heatmap issues={issues} />

        <MarkerClusterGroup key={issues.length}>
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



      <input
  type="file"
  accept="image/*"
  style={{
    position: 'fixed',
    bottom: '80px',
    left: '20px',
    zIndex: 2000,
    background: 'white',
    padding: '10px',
    borderRadius: '8px',
  }}
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (file) {
      console.log('📸 IMAGEM:', file);
      setSelectedImage(file);
    }
  }}
/>

      {/* botão enviar */}
      <div
  style={{
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
  }}
>
  <button
    style={{
      padding: '12px 16px',
      fontSize: '14px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    }}
    onClick={async () => {
      if (!selectedPosition) {
        alert('Selecione um ponto no mapa!');
        return;
      }

      const formData = new FormData();
      formData.append('type', 'buraco_calcada');
      formData.append('description', 'denúncia via mapa');
      console.log('📍 ENVIANDO POSIÇÃO:', selectedPosition);
      formData.append('latitude', selectedPosition[0].toString());
      formData.append('longitude', selectedPosition[1].toString());

      if (!selectedImage) {
  alert('Selecione uma imagem!');
  return;
}

formData.append('image', selectedImage);

      await fetch('http://localhost:3333/issues', {
  method: 'POST',
  body: formData,
});

// 🔥 NOVO
fetchIssues();

alert('Denúncia enviada!');
    }}
  >
    Enviar denúncia
  </button>
</div>
    </div>
  );
}

export default App;