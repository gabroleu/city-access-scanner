import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import {
  Camera,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Accessibility,
  Construction,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  LocateFixed,
  Loader2,
} from 'lucide-react';
import {  } from './types/issue';

type Issue = {
  id: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  severity: number;
};


// correção global dos ícones do Leaflet (que estavam quebrados)

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// aqui eu forço todos os markers a usarem isso
L.Marker.prototype.options.icon = DefaultIcon;



// controla zoom + centralização
function MapController({
  position,
  hasCentered,
  followUser,
}: {
  position: [number, number];
  hasCentered: React.MutableRefObject<boolean>;
  followUser: boolean;
}) {
  const map = useMap();
  const lastPositionRef = useRef<[number, number] | null>(null);
  


  useEffect(() => {
    if (!hasCentered.current) {
      map.setView(position, 18, {
        animate: true,
      });

      hasCentered.current = true;
      return;
    }

    if (followUser) {
  const lastPosition = lastPositionRef.current;

  if (lastPosition) {
    const distance = map.distance(lastPosition, position);

    if (distance < 10) return;
  }

  lastPositionRef.current = position;

  map.flyTo(position, map.getZoom(), {
    animate: true,
    duration: 1.2,
  });
}
  }, [position, map, hasCentered, followUser]);

  return null;
}




  function MapEvents({
  setFollowUser,
}: {
  setFollowUser: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const map = useMap();

  useEffect(() => {
    const disableFollow = () => {
      setFollowUser(false);
    };

    map.on('dragstart', disableFollow);
    map.on('zoomstart', disableFollow);

    return () => {
      map.off('dragstart', disableFollow);
      map.off('zoomstart', disableFollow);
    };
  }, [map, setFollowUser]);

  return null;
}



// heatmap
function Heatmap({ issues }: { issues: Issue[] }) {
  const map = useMap();

  const HeatLayer = (L as any).heatLayer;
  useEffect(() => {
    if (!issues.length) return;

    const points = issues.map(issue => [
      issue.latitude,
      issue.longitude,
      0.5,
    ]);

    const heat = HeatLayer(points, {
      
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
//App aqui
function App() {
  console.log('BUILD NOVO RODAND...');

  const [issues, setIssues] = useState<Issue[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(18);
  const [heading, setHeading] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState<number | ''>('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('0');
  const [menuOpen, setMenuOpen] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const hasCentered = useRef(false);
  const fileInputRef =
  useRef<HTMLInputElement | null>(null);

  


  const API_URL = import.meta.env.VITE_API_URL; 

 //fundo botão semi-transparente, efeito blur, borda suave e aparência flutuante
  



  function getMarkerColor(severity: number) {
  if (severity === 1) return 'green';
  if (severity === 2) return 'orange';
  if (severity === 3) return 'red';

  return 'blue';
}

function createCustomIcon(color: string) {
  const colors = {
    green: {
      primary: '#34d399',
      glow: 'rgba(52,211,153,0.22)',
    },
    orange: {
      primary: '#fbbf24',
      glow: 'rgba(251,191,36,0.22)',
    },
    red: {
      primary: '#f87171',
      glow: 'rgba(248,113,113,0.22)',
    },
    blue: {
      primary: '#60a5fa',
      glow: 'rgba(96,165,250,0.22)',
    },
  };

  const selected =
    colors[color as keyof typeof colors] ||
    colors.blue;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        width: 20px;
        height: 20px;

        display:flex;
        align-items:center;
        justify-content:center;
      ">

        <!-- glow -->
        <div style="
          position:absolute;
          width:34px;
          height:34px;
          border-radius:50%;

          background:${selected.glow};
          filter: blur(6px);
        "></div>

        <!-- ponto -->
        <div style="
          width:14px;
          height:14px;

          border-radius:50%;

          background:
          linear-gradient(
            180deg,
            ${selected.primary},
            ${selected.primary}
          );

          border:2.5px solid rgba(255,255,255,0.92);

          box-shadow:
            0 4px 12px rgba(0,0,0,0.18),
            inset 0 1px 1px rgba(255,255,255,0.25);
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}


function createUserIcon(rotation: number) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        width: 22px;
        height: 22px;

        display:flex;
        align-items:center;
        justify-content:center;

        transform: rotate(${rotation}deg);
        transition: transform 0.35s ease;
      ">

        <!-- glow -->
        <div style="
          position:absolute;
          width:28px;
          height:28px;
          border-radius:50%;

          background:
          radial-gradient(
            rgba(59,130,246,0.22),
            rgba(59,130,246,0.02)
          );

          filter: blur(5px);
        "></div>

        <!-- seta -->
        <div style="
          position:absolute;
          top:-7px;

          width:0;
          height:0;

          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-bottom:12px solid #60a5fa;

          filter: drop-shadow(
            0 2px 6px rgba(59,130,246,0.25)
          );
        "></div>

        <!-- ponto central -->
        <div style="
          width:16px;
          height:16px;

          background:
          linear-gradient(
            180deg,
            #60a5fa,
            #2563eb
          );

          border:3px solid rgba(255,255,255,0.95);
          border-radius:50%;

          box-shadow:
            0 2px 10px rgba(37,99,235,0.20),
            inset 0 1px 1px rgba(255,255,255,0.35);
        "></div>

      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}



  // buscar dados
  const fetchIssues = () => {
    console.log('Buscando Issues...')
    fetch(`${ API_URL}/issues`) //troca      
    .then(res => res.json())
      .then(data => {
        console.log(data);
        setIssues(data);
      });
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // geolocalização - teste ao vivo
 useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const accuracy = pos.coords.accuracy;
      const gpsHeading = pos.coords.heading;

      let zoomLevel = 18;

      if (accuracy > 100) zoomLevel = 16;
      if (accuracy > 500) zoomLevel = 14;

      const newPosition: [number, number] = [
        pos.coords.latitude,
        pos.coords.longitude,
      ];

      setPosition(newPosition);
      setZoom(zoomLevel);

      if (gpsHeading !== null) {
      setHeading(gpsHeading);
}
    },

    (error) => {
      console.error('Erro ao obter localização:', error);

      setPosition([-3.119, -60.0217]);
      setZoom(14);
    },

    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, []);

  if (!position) return <p>Carregando localização...</p>; //mapa renderiza depois da geolocalização




  const filteredIssues = issues.filter(issue => {
    const matchesType = 
      filterType === 'all' || issue.type === filterType;
    const matchesSeverity = 
      filterSeverity === '0' || issue.severity.toString() === filterSeverity;
    
      return matchesType && matchesSeverity;
  });


  //estatísticas aqui

  const total = filteredIssues.length;
  
  const statsByType = {
    buraco: filteredIssues.filter(issue => issue.type === 'buraco_calcada').length,
    iluminacao: filteredIssues.filter(issue => issue.type === 'iluminacao').length,
    lixo: filteredIssues.filter(issue => issue.type === 'lixo').length,
    acessibilidade: filteredIssues.filter(issue => issue.type === 'acessibilidade').length,
  };

  const statsBySeverity = {
    leve: filteredIssues.filter(issue => issue.severity === 1).length,
    media: filteredIssues.filter(issue => issue.severity === 2).length,
    grave: filteredIssues.filter(issue => issue.severity === 3).length,
  };


 <style>
  {`
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }

      100% {
        background-position: -200% 0;
      }

      @keyframes popupEnter {
        0% {          
          opacity: 0;
          transform: translateY(0)
          scale(1);
        }
        100% {
          opacity: 1;
          translalteY(0);
          scale(1);
        }
      }

    }
  `}
  
</style>



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
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2000,

  width: '230px',

  background: 'rgba(10, 15, 30, 0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',

  border: '1px solid rgba(255,255,255,0.08)',

  borderRadius: '999px',

  padding: '8px 13px',

  boxShadow: `
    0 8px 24px rgba(0,0,0,0.35),
    inset 0 1px 1px rgba(255,255,255,0.08)
  `,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}}
>
  {/* linha principal */}
  <div
    style={{
      display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '8px',
fontSize: '15px',
fontWeight: '600',
color: 'white',
textAlign: 'center',
    }}
  >
    <span
      style={{
        color: '#f9fbfd',
        fontWeight: '500',
        fontSize: '18px',
      }}
    >
      {filteredIssues.length}
    </span>

    <span>problemas encontrados</span>
  </div>

  {/* subtítulo */}
  <div
    style={{
      display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '6px',
fontSize: '12px',
color: 'rgba(255,255,255,0.72)',
textAlign: 'center',
    }}
  >
    <span style={{ color: '#67ff5f' }}>●</span>
    <span>Atualizado agora</span>
  </div>
</div>



{/* botões tipo e gravidade */}
   
{!menuOpen && (
  <div
    style={{
      position: 'fixed',
      bottom: '128px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2500,

      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    }}
  >
    {/* botão tipo */}
    
    <button
  onClick={() => {
    if (type === '') {
      setType('buraco_calcada');
    } else if (type === 'buraco_calcada') {
      setType('iluminacao');
    } else if (type === 'iluminacao') {
      setType('lixo');
    } else if (type === 'lixo') {
      setType('acessibilidade');
    } else {
      setType('');
    }
  }}
  style={{
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '999px',

    background:
type === 'buraco_calcada'
? 'linear-gradient(180deg, rgba(120,86,38,0.92), rgba(84,63,33,0.92))'

: type === 'iluminacao'
? 'linear-gradient(180deg, rgba(187, 156, 70, 0.92), rgba(150, 128, 77, 0.92))'

: type === 'lixo'
? 'linear-gradient(180deg, rgba(74,61,116,0.92), rgba(54,44,88,0.92))'

: type === 'acessibilidade'
? 'linear-gradient(180deg, rgba(47,96,112,0.92), rgba(36,71,84,0.92))'

: 'linear-gradient(180deg, rgba(55,65,92,0.94), rgba(37,45,68,0.94))',

    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',

    padding: '7px 12px',

    display: 'flex',
    alignItems: 'center',
    gap: '8px',

    boxShadow:
type === 'buraco_calcada'
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(180,120,40,0.12)
`

: type === 'iluminacao'
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(180,150,50,0.12)
`

: type === 'lixo'
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(120,90,180,0.12)
`

: type === 'acessibilidade'
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(80,170,200,0.12)
`

: `
  inset 0 1px 1px rgba(255,255,255,0.14),
  0 10px 28px rgba(15,23,42,0.35)
`,

    cursor: 'pointer',

    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform:
      type !== ''
        ? 'translateY(-1px)'
        : 'translateY(0)',
  }}
>
  {/* Ícone */}
  <div
  style={{
  width: '30px',
  height: '30px',

  borderRadius: '999px',

  background:
    type === 'buraco_calcada'
      ? 'linear-gradient(180deg, rgba(6,182,212,0.22), rgba(8,145,178,0.16))'

      : type === 'iluminacao'
      ? 'linear-gradient(180deg, rgba(245,158,11,0.22), rgba(217,119,6,0.16))'

      : type === 'lixo'
      ? 'linear-gradient(180deg, rgba(147,51,234,0.22), rgba(126,34,206,0.16))'

      : type === 'acessibilidade'
      ? 'linear-gradient(180deg, rgba(20,184,166,0.22), rgba(15,118,110,0.16))'

      : 'rgba(255,255,255,0.08)',

  border: '1px solid rgba(255,255,255,0.08)',

  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  boxShadow: `
    inset 0 1px 1px rgba(255,255,255,0.10),
    0 4px 12px rgba(0,0,0,0.18)
  `,
}}
>
  {type === 'buraco_calcada' ? (
    <Construction size={16} 
    strokeWidth={2.1} 
    color="white" />
  ) : type === 'iluminacao' ? (
    <Lightbulb size={16}
    strokeWidth={2.1}
    color="white" />
  ) : type === 'lixo' ? (
    <Trash2 size={16} strokeWidth={2.1} color="white" />
  ) : type === 'acessibilidade' ? (
    <Accessibility size={16} strokeWidth={2.1} color="white" />
  ) : (
    <Construction size={16} strokeWidth={2.1} color="white" />
  )}
</div>

  {/* Texto */}
  <span
    style={{
      color: 'rgba(255,255,255,0.96)',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '-0.3px',
    }}
  >
    {type === ''
      ? 'Tipo'
      : type === 'buraco_calcada'
      ? 'Buraco'
      : type === 'iluminacao'
      ? 'Iluminação'
      : type === 'lixo'
      ? 'Lixo'
      : 'Acessibilidade'}
  </span>

  {/* seta */}
  <span
    style={{
      color: 'rgba(255,255,255,0.8)',
      fontSize: '12px',
    }}
  >
    <ChevronDown size={14} color="rgba(255,255,255,0.75)" />

  </span>
</button>

    {/* botão gravidade */}
    <button
  onClick={() => {
    if (severity === '') {
      setSeverity(1);
    } else if (severity === 1) {
      setSeverity(2);
    } else if (severity === 2) {
      setSeverity(3);
    } else {
      setSeverity('');
    }
  }}
  style={{
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '999px',

    background:
severity === 1
? 'linear-gradient(180deg, rgba(44,94,67,0.92), rgba(31,68,49,0.92))'

: severity === 2
? 'linear-gradient(180deg, rgba(112,84,40,0.92), rgba(80,60,30,0.92))'

: severity === 3
? 'linear-gradient(180deg, rgba(108,48,48,0.92), rgba(78,34,34,0.92))'

: 'linear-gradient(180deg, rgba(67,78,110,0.95), rgba(46,54,82,0.95))',

    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',

    padding: '7px 12px',

    display: 'flex',
    alignItems: 'center',
    gap: '8px',

    boxShadow:
severity === 1
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(50,160,90,0.12)
`

: severity === 2
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(180,130,40,0.12)
`

: severity === 3
? `
  inset 0 1px 1px rgba(255,255,255,0.10),
  0 0 18px rgba(180,70,70,0.12)
`

: `
  inset 0 1px 1px rgba(255,255,255,0.14),
  0 10px 28px rgba(0,0,0,0.35)
`,

    cursor: 'pointer',

    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    transform:
    severity !== ''
    ? 'translateY(-1px)'
    : 'translateY(0)',
  }}
>
  {/* Ícone */}
  <div
  style={{
  width: '30px',
  height: '30px',

  borderRadius: '999px',

  background:
    severity === 1
      ? 'linear-gradient(180deg, rgba(34,197,94,0.22), rgba(22,163,74,0.16))'

      : severity === 2
      ? 'linear-gradient(180deg, rgba(245,158,11,0.22), rgba(217,119,6,0.16))'

      : severity === 3
      ? 'linear-gradient(180deg, rgba(239,68,68,0.22), rgba(185,28,28,0.16))'

      : 'rgba(255,255,255,0.08)',

  border: '1px solid rgba(255,255,255,0.08)',

  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  boxShadow: `
    inset 0 1px 1px rgba(255,255,255,0.10),
    0 4px 12px rgba(0,0,0,0.18)
  `,
}}
>
  {severity === 3 ? (
    <ShieldAlert size={16} strokeWidth={2.1} color="white" />
  ) : severity === 2 ? (
    <AlertTriangle size={16} strokeWidth={2.1} color="white" />
  ) : (
    <ShieldCheck size={16} strokeWidth={2.1}color="white" />
  )}
</div>

  {/* Texto */}
  <span
    style={{
      color: 'white',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '-0.2px',
    }}
  >
    {severity === ''
      ? 'Severidade'
      : severity === 1
      ? 'Leve'
      : severity === 2
      ? 'Moderada'
      : 'Grave'}
  </span>

  {/* seta */}
  <span
    style={{
      color: 'rgba(255,255,255,0.8)',
      fontSize: '12px',
    }}
  >
    ▼
  </span>
</button>
    
  </div>
)}

  


          {/* aqui está o mapa, pra facilitar na pesquisa -- mapa */}
      <MapContainer
        
        center={position}
        zoom={zoom}
        ref={mapRef}
        zoomControl={false}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        style={{ height: '100vh', width: '100%' }}
      >
        <MapController
          position={position}
          hasCentered={hasCentered}
          followUser={followUser}
        />

      <MapEvents setFollowUser={setFollowUser} />

        

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* marcador do usuário */}
        <Marker
          position={position}
          icon={createUserIcon(heading) /* ícone personalizado que gira conforme a direção do GPS */}
          >
            <Popup>Você está aqui</Popup>
        </Marker>



        {/* ponto selecionado */}
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>Ponto da denúncia</Popup>
          </Marker>
        )}

        <LocationSelector setSelectedPosition={setSelectedPosition} />

        <Heatmap issues={issues} />

        

        <MarkerClusterGroup
  key={issues.length}
  iconCreateFunction={(cluster: any) => {
    const count = cluster.getChildCount();

    let background = '';
    let glow = '';

    if (count < 5) {
      background =
        'linear-gradient(180deg,#4ade80,#22c55e)'
      glow = 'rgba(52,211,153,0.22)';
    } else if (count < 15) {
      background =
        'linear-gradient(180deg,#fbbf24,#f59e0b)'
      glow = 'rgba(251,191,36,0.22)';
    } else {
      background =
        'linear-gradient(180deg,#fb7185,#f43f5e)'
      glow = 'rgba(248,113,113,0.22)';
    }
//bolinhas do cluster, com contagem e efeito de brilho que varia conforme a quantidade de pontos agrupados, antes 52px
    return L.divIcon({
      html: `
        <div style="
          width:38px; 
          height:38px;
          border-radius:50%;

          display:flex;
          align-items:center;
          justify-content:center;

          background:${background};

          border:2px solid rgba(255,255,255,0.88);

          color:white;
          font-weight:700;
          font-size:13px;

          box-shadow:
            0 8px 24px rgba(0,0,0,0.18),
            0 0 12px ${glow},
            inset 0 1px 1px rgba(255,255,255,0.22);
        ">
          ${count}
        </div>
      `,
      className: '',
      iconSize: [52, 52],
    });
  }}
>

          {filteredIssues.map(issue => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomIcon(getMarkerColor(issue.severity))}
            >
              <Popup
  maxWidth={280}
  className="custom-popup"
>

   

  <div
    style={{
      width: '240px',
      overflow: 'hidden',
      borderRadius: '22px',
      background: 'linear-gradient(180deg, rgba(15,23,42,0.98), rgba(17,24,39,0.96))',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(18px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.05)',
      color: 'white',
      animation: 'popupEnter 22ms ease',
      transformOrigin: 'bottom center',
    }}
  >
    {/* imagem */}
    <div
  style={{
    width: '100%',
    height: '150px',
    overflow: 'hidden',
    position: 'relative',
    background: '#111827',
  }}
>
  {/* skeleton */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }}
  />

  <img
  src={issue.imageUrl}
  alt="denúncia"
  onLoad={(e) => {
    const target =
      e.currentTarget;

    target.style.opacity = '1';
    target.style.filter =
      'blur(0px)';
    target.style.transform =
      'scale(1)';
  }}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',

    position: 'relative',
    zIndex: 1,

    opacity: 0,
    filter: 'blur(12px)',
    transform: 'scale(1.04)',

    transition:
      'opacity 400ms ease, filter 500ms ease, transform 500ms ease',
  }}
/>
</div>

    {/* conteúdo */}
    <div
      style={{
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* badges */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            padding: '6px 10px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.08)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {issue.type === 'buraco_calcada'
            ? 'Buraco'
            : issue.type === 'iluminacao'
            ? 'Iluminação'
            : issue.type === 'lixo'
            ? 'Lixo'
            : 'Acessibilidade'}
        </div>

        <div
          style={{
            padding: '6px 10px',
            borderRadius: '999px',
            background:
              issue.severity === 1
              ? 'rgba(16,185,129,0.10)'
              : issue.severity === 2
              ? 'rgba(245,158,11,0.10)'
              : 'rgba(239,68,68,0.10)',

            border:
              issue.severity === 1
              ? '1px solid rgba(52,211,153,0.18)'
              : issue.severity === 2
              ? '1px solid rgba(251,191,36,0.18)'
              : '1px solid rgba(248,113,113,0.18)',

            color:
              issue.severity === 1
              ? '#6ee7b7'
              : issue.severity === 2
              ? '#fcd34d'
              : '#fca5a5',

            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {issue.severity === 1
            ? 'Leve'
            : issue.severity === 2
            ? 'Moderada'
            : 'Grave'}
        </div>
      </div>

      {/* descrição */}
      <p
        style={{
          margin: 0,
          color: 'rgba(255,255,255,0.78)',
          fontSize: '13px',
          lineHeight: 1.5,
        }}
      >
        {issue.description}
      </p>
    </div>
  </div>
</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>


  <button
  onClick={() => {
    if (!mapRef.current || !position) return;

    setFollowUser(true);

    mapRef.current.flyTo(position, 18, {
      animate: true,
      duration: 1.5,
    });
  }}
  style={{
  position: 'fixed',
  bottom: '190px',
  right: '18px',
  zIndex: 2500,

  width: '44px',
  height: '44px',

  borderRadius: '999px',

  border: '1px solid rgba(255,255,255,0.08)',

  background: 'rgba(255,255,255,0.08)',

  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',

  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  cursor: 'pointer',

  transition: 'all 0.2s ease',
}}
>
  <LocateFixed
    size={22}
    color="rgba(145, 130, 130, 0.82)"
    strokeWidth={2.2}
  />
</button>

    


      {/* botão abrir menu */}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 2000,
          fontSize: '26px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
        >
        ☰
      </button>


      {menuOpen && (
  <div
    onClick={() => setMenuOpen(false)}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(3px)',
      zIndex: 2500,
    }}
  />
)}


      {/* aqui é o menu lateral */}
      <div style={{
  position: 'fixed',
  top: '12px',
  bottom: '16px',
  left: menuOpen ? '12px' : '-320px',

  width: '260px',
  

  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',

  border: '1px solid rgba(255,255,255,0.2)',

  borderRadius: '28px',

  boxShadow: `
    0 8px 32px rgba(0,0,0,0.18),
    inset 0 1px 1px rgba(255,255,255,0.15)
  `,

  transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',

  zIndex: 3000,

  padding: '24px 18px 80px 18px',

  display: 'flex',
  flexDirection: 'column',
  gap: '15px',

  overflowY: 'auto',
}}
      >


        {/*header*/}

        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
             alignItems: 'center',
             marginBottom: '20px',
             }}
        >

          <h3
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              letterSpacing: '-1px',
            }}
          >
            Filtros
          </h3>



          <button
  onClick={() => setMenuOpen(false)}
  style={{
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    fontSize: '22px',
    fontWeight: '300',
    color: '#444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }}
>
  ✕
</button>

          
        </div>


        {/* filtro tipo aqui*/}
        <label>Tipo</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            fontSize: '16px',
            }}
          >
            <option value="all">Todos</option>
            <option value="buraco_calcada">Buraco</option>
            <option value="iluminacao">Iluminação</option>
            <option value="lixo">Lixo</option>
            <option value="acessibilidade">Acessibilidade</option>
        </select>



        {/* filtro severidade aqui */}
        <label>Severidade</label>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)} //alterei porque tava passando number
          style={{
            padding: '8px',
            borderRadius: '6px',
            fontSize: '16px',
            width: '100%',
            }}
          >
            <option value="0">Todas</option>
            <option value="1">Leve</option>
            <option value="2">Média</option>
            <option value="3">Grave</option>
          </select>



          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)' }} />

<h3
  style={{
    marginTop: '10px',
    fontSize: '24px',
    fontWeight: '700',
  }}
>
  Estatísticas
</h3>

<div
  style={{
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '16px',
    padding: '14px',
    marginTop: '10px',
    backdropFilter: 'blur(10px)',
  }}
>
  <p style={{ fontSize: '16px', fontWeight: '700' }}>
    Total: {total}
  </p>

  <div style={{ marginTop: '18px' }}>
    <p style={{ fontWeight: '700', marginBottom: '10px' }}>
      Por tipo
    </p>
    {/* não esquecer de colocar ícones nos problemas aqui depois */}
    <p> Buraco: {statsByType.buraco}</p>
    <p>Iluminação: {statsByType.iluminacao}</p>
    <p>Lixo: {statsByType.lixo}</p>
    <p>Acessibilidade: {statsByType.acessibilidade}</p>
  </div>

  <div style={{ marginTop: '18px' }}>
    <p style={{ fontWeight: '700', marginBottom: '10px' }}>
      Por severidade
    </p>
{/* não esquecer de colocar ícones de gravidade aqui depois */}
    <p>Leve: {statsBySeverity.leve}</p>
    <p>Média: {statsBySeverity.media}</p>
    <p>Grave: {statsBySeverity.grave}</p>
  </div>
</div>
          

      </div>


      <div
  style={{
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '92%',
    maxWidth: '420px',
    zIndex: 3000,
  }}
>
  <div
    style={{
      background:
        'linear-gradient(135deg, rgba(67,56,202,0.96), rgba(37,99,235,0.96))',

      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',

      borderRadius: '34px',

      padding: '14px 16px',

      boxShadow: `
        0 12px 40px rgba(0,0,0,0.35),
        inset 0 1px 1px rgba(255,255,255,0.15)
      `,

      border: '1px solid rgba(255,255,255,0.12)',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    }}
  >
    {/* LADO ESQUERDO */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* BOTÃO DA CÂMERA */}
<label
  style={{
    minWidth: '58px',
    width: '58px',
    height: '58px',

    borderRadius: '20px',

    background: 'rgba(255,255,255,0.12)',

    border: '1px solid rgba(255,255,255,0.12)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    cursor: 'pointer',
  }}
>
  {imageLoading ? (
    <Loader2
      size={24}
      color="white"
      className="animate-spin"
    />
  ) : preview ? (
    <img
      src={preview}
      alt="preview"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  ) : (
    <Camera
      color="white"
      size={28}
    />
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      setImageLoading(true);

      const img = new Image();

      img.onload = () => {
        const imageUrl =
          URL.createObjectURL(file);

        setSelectedImage(file);
        setPreview(imageUrl);

        setTimeout(() => {
          setImageLoading(false);
        }, 500);
      };

      img.src =
        URL.createObjectURL(file);
    }}
  />
</label>

      {/* TEXTO ENVIAR DENÚNCIA */}
      <div>
        <h3
          style={{
            margin: 0,
            color: 'white',
            fontSize: '22px',
            fontWeight: 700,
          }}
        >
          Enviar denúncia
        </h3>

        <p
          style={{
            margin: 0,
            marginTop: '4px',
            color: 'rgba(255,255,255,0.82)',
            fontSize: '13px',
          }}
        >
          {selectedPosition
            ? 'Ponto selecionado no mapa'
            : 'Selecione um ponto no mapa'}
        </p>
      </div>
    </div>

    {/* BOTÃO ENVIAR */}
    <button
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

        if (!type) {
          toast.error('Selecione um tipo de denúncia!');
          return;
        }

        if (!severity) {
          toast.error('Selecione a severidade da denúncia!');
          return;
        }

        const formData = new FormData();

        formData.append('type', type);
        formData.append('description', 'denúncia via mapa');
        formData.append(
          'latitude',
          selectedPosition[0].toString()
        );
        formData.append(
          'longitude',
          selectedPosition[1].toString()
        );
        formData.append('image', selectedImage);
        formData.append(
          'severity',
          severity.toString()
        );

        setLoading(true);

        try {
          await fetch(`${API_URL}/issues`, {
            method: 'POST',
            body: formData,
          });

          fetchIssues();

          toast.success(
            'Denúncia enviada com sucesso!'
          );
        } catch (error) {
          console.error(error);

          toast.error(
            'Erro ao enviar denúncia!'
          );
        } finally {
          setLoading(false);

          setSelectedImage(null);
          setPreview(null);
          setImageLoading(false);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

        }
      }}
      style={{
        minWidth: '64px',
        width: '64px',
        height: '64px',

        borderRadius: '22px',

        border: 'none',

        background:
          'rgba(255,255,255,0.14)',

        color: 'white',

        fontSize: '28px',
        fontWeight: 300,

        cursor: 'pointer',

        transition: '0.2s ease',
      }}
    >
      ➤
    </button>
  </div>
</div>




    </div>
  );
}

export default App;
