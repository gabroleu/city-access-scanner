import toast, { Toaster } from 'react-hot-toast';
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
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('buraco_calcada');
  const [severity, setSeverity] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('0');



  function getMarkerColor(severity: number) {
  if (severity === 1) return 'green';
  if (severity === 2) return 'orange';
  if (severity === 3) return 'red';

  return 'blue';
}

function createCustomIcon(color: string) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}



  function getMarkerColor(severity: number) {
  if (severity === 1) return 'green';
  if (severity === 2) return 'orange';
  if (severity === 3) return 'red';

  return 'blue';
}

function createCustomIcon(color: string) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

  // buscar dados
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




  const filteredIssues = issues.filter(issue => {
    const matchesType = 
      filterType === 'all' || issue.type === filterType;
    const matchesSeverity = 
      filterSeverity === '0' || issue.severity.toString() === filterSeverity;
    
      return matchesType && matchesSeverity;
  });




  //facilitando a pesquisa >>>>>>>>> return do app
  return (
    <div style={{ position: 'relative' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      {/* aqui eu etô colocando o contador */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 2000,
          background: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          fontWeight: 'bold',
        }}
      >
      {/* lembrar de colocar uma lupinha aqui */}  {filteredIssues.length} problema(s) encontrado(s)
        </div>




          {/* aqui está o mapa, pra facilitar na pesquisa -- mapa */}
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
          {filteredIssues.map(issue => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(getMarkerColor(issue.severity))}
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


      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          zIndex: 2000,
          padding: '10px',
          borderRadius: '8px',
        }}
      >

          <option value="buraco_calcada">Buraco na calçada</option>
          <option value="iluminacao">Iluminação Pública</option>
          <option value="lixo">Acúmulo de lixo</option>
          <option value="acessibilidade">Problema de acessibilidade</option>
      </select>

      <select
        value={severity}
        onChange={(e) => setSeverity(Number(e.target.value))}
        style={{
          position: 'fixed',
          top: '70px',
          left: '20%',
          zIndex: 2000,
          padding: '10px',
          borderRadius: '8px',
        }}
      >
          <option value={1}>🟢 Leve</option>
          <option value={2}>🟡 Moderada</option>
          <option value={3}>🔴 Grave</option>
      </select>


      // filtro de tipos e severidade


      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
          style={{
          position: 'fixed',
          top: '120px',
          left: '20px',
          zIndex: 2000,
          padding: '10px',
          borderRadius: '8px',
      }}
      >
            <option value="all">Todos</option>
            <option value="buraco_calcada">Buraco</option>
            <option value="iluminacao">Iluminação</option>
            <option value="lixo">Lixo</option>
            <option value="acessibilidade">Acessibilidade</option>
        </select>

    

        <select
        value={filterSeverity}
        onChange={(e) => setFilterSeverity(Number(e.target.value))}
            style={{
            position: 'fixed',
            top: '170px',
            left: '20px',
            zIndex: 2000,
            padding: '10px',
            borderRadius: '8px',
      }}
      >
            <option value={0}>Todas</option>
            <option value={1}>Leve</option>
            <option value={2}>Média</option>
            <option value={3}>Grave</option>
          </select>


      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{
            position: 'fixed',
            bottom: '140px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '12px',
            zIndex: 2000,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        />
      )}

      <label
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'white',
          padding: '10px 16px',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(231, 83, 14, 0.77)',
          cursor: 'pointer',
          fontWeight: '500',
        }}
      >
        Selecionar imagem
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedImage(file);
              const imageUrl = URL.createObjectURL(file);
              setPreview(imageUrl);
              console.log(' PREVIEW:', imageUrl);
            }
          }}
        />
      </label>

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
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
          onClick={async () => {
            if (!selectedPosition) {
              toast.error('Selecione um ponto no mapa!');
              return;
            }

            if (!selectedImage) {
              toast.error('Selecione uma imagem!');
              return;
            }

            const formData = new FormData();
            formData.append('type', type);
            formData.append('description', 'denúncia via mapa');
            formData.append('latitude', selectedPosition[0].toString());
            formData.append('longitude', selectedPosition[1].toString());
            formData.append('image', selectedImage);
            formData.append('severity', severity.toString());

            setLoading(true);

            try {
              await fetch('http://localhost:3333/issues', {
                method: 'POST',
                body: formData,
              });

              fetchIssues();
              toast.success('Denúncia enviada com sucesso!');
            } catch (error) {
              console.error(error);
              toast.error('Erro ao enviar denúncia!');
            } finally {
              setLoading(false);
              setPreview(null);
              setSelectedImage(null);
            }
          }}
        >
          {loading ? 'Enviando...' : 'Enviar denúncia'}
        </button>
      </div>
    </div>
  );
}

export default App;
