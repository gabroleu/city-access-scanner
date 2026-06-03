import {
  LayoutDashboard,
  Flame,
  MapPin,
  BarChart3,
  Settings,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
export function AdminPage() {
  
  const tableHeader = {
  textAlign: 'left' as const,
  padding: '16px 24px',
  borderBottom: '1px solid #e5e7eb',
  color: '#6b7280',
  fontSize: '13px',
};

const tableCell = {
  padding: '16px 24px',
  borderBottom: '1px solid #f1f5f9',
};

const filterStyle = {
  height: '42px',
  padding: '0 14px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  background: '#ffffff',
  fontSize: '14px',
};


  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7fb',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          padding: '24px',
        }}
      >
        <div>
          
  <h2
    style={{
      color: '#0b2050',
      margin: 0,
      fontSize: '22px',
      fontWeight: 700,
    }}
  >
    City Access
  </h2>

  <p
    style={{
      color: '#6b7280',
      fontSize: '13px',
      marginTop: '6px',
    }}
  >
    Dashboard Admin
  </p>
</div>

<nav
  style={{
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }}
>
  {[
  {
    icon: LayoutDashboard,
    label: 'Visão Geral',
  },
  {
    icon: Flame,
    label: 'Mapa de Calor',
  },
  {
    icon: MapPin,
    label: 'Denúncias',
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
  },
  {
    icon: Settings,
    label: 'Configurações',
  },
].map((item) => (
    <button
      key={item.label}
      style={{
        width: '100%',
        height: '48px',

        display: 'flex',
        alignItems: 'center',
        gap: '12px',

        padding: '0 14px',

        background:
          item.label === 'Visão Geral'
            ? '#e0ecff'
            : 'transparent',

        border:
          item.label === 'Visão Geral'
            ? '1px solid #93c5fd'
            : '1px solid transparent',

        borderRadius: '12px',

        color:
          item.label === 'Visão Geral'
            ? '#2563eb'
            : '#374151',

        fontSize: '14px',
        fontWeight: 600,

        cursor: 'pointer',
      }}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </button>
  ))}
</nav>
      </aside>

      {/* Conteúdo */}
      <main
        style={{
          flex: 1,
          padding: '32px',
        }}
      >
        <div
          style={{
            marginBottom: '32px',
          }}
>
  <h1
    style={{
      color: '#f97316',
      fontSize: '32px',
      fontWeight: 700,
      margin: 0,
    }}
  >
    Painel de Gestão de Denúncias
  </h1>

  <p
    style={{
      color: '#6b7280',
      marginTop: '8px',
      fontSize: '15px',
    }}
  >
    Dashboard administrativo do City Access Scanner.
  </p>
</div>

{/* KPIS de denúncias */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  }}
>
  {[
    {
      title: 'Total de Denúncias',
      value: '154',
      color: '#2563eb',
    },
    {
      title: 'Resolvidas',
      value: '89',
      color: '#16a34a',
    },
    {
      title: 'Em Aberto',
      value: '65',
      color: '#f59e0b',
    },
    {
      title: 'Graves',
      value: '12',
      color: '#f97316',
    },
  ].map((card) => (
    <div
      key={card.title}
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <p
        style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '12px',
        }}
      >
        {card.title}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize: '34px',
          fontWeight: 700,
          color: card.color,
        }}
      >
       {card.value}
      </h2>
      </div>
        ))}
      </div>

        <div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '24px',
    alignItems: 'start',
  }}
>

        {/* Lista de denúncias */}
<div
  style={{
    background: '#ffffff',
    borderRadius: '18px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  }}
>
  <div
  style={{
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  }}
>
  <h2
    style={{
      margin: 0,
      marginBottom: '18px',
      fontSize: '20px',
      color: '#0f172a',
    }}
  >
    Lista de Denúncias
  </h2>

  <div
    style={{
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    }}
  >
    <select style={filterStyle}>
      <option>Todos os Tipos</option>
    </select>

    <select style={filterStyle}>
      <option>Todos os Status</option>
    </select>

    <select style={filterStyle}>
      <option>Todas as Gravidades</option>
    </select>

    <input
      placeholder="Pesquisar denúncia..."
      style={{
        ...filterStyle,
        minWidth: '240px',
      }}
    />
  </div>
</div>

  <table
    style={{
      width: '100%',
      borderCollapse: 'collapse',
    }}
  >
    <thead>
      <tr>
        <th style={tableHeader}>Tipo</th>
        <th style={tableHeader}>Status</th>
        <th style={tableHeader}>Gravidade</th>
        <th style={tableHeader}>Data</th>
        <th style={tableHeader}>Ações</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td style={tableCell}>Buraco</td>
        <td style={tableCell}>
  <span
    style={{
      background: '#fef3c7',
      color: '#92400e',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
    }}
  >
    Aberto
  </span>
</td>
        <td style={tableCell}>Grave</td>
        <td style={tableCell}>29/05/2026</td>
        <td style={tableCell}>
  <div
    style={{
      display: 'flex',
      gap: '12px',
    }}
  >
    <Eye
      size={18}
      color="#2563eb"
      style={{ cursor: 'pointer' }}
    />

    <Pencil
      size={18}
      color="#f59e0b"
      style={{ cursor: 'pointer' }}
    />

    <Trash2
      size={18}
      color="#ef4444"
      style={{ cursor: 'pointer' }}
    />
  </div>
</td>
      </tr>

      <tr>
        <td style={tableCell}>Iluminação</td>
        <td style={tableCell}>
  <span
    style={{
      background: '#dbeafe',
      color: '#1d4ed8',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
    }}
  >
    Em análise
  </span>
</td>
        <td style={tableCell}>Moderada</td>
        <td style={tableCell}>28/05/2026</td>
        <td style={tableCell}>
  <div
    style={{
      display: 'flex',
      gap: '12px',
    }}
  >
    <Eye
      size={18}
      color="#2563eb"
      style={{ cursor: 'pointer' }}
    />

    <Pencil
      size={18}
      color="#f59e0b"
      style={{ cursor: 'pointer' }}
    />

    <Trash2
      size={18}
      color="#ef4444"
      style={{ cursor: 'pointer' }}
    />
  </div>
</td>
      </tr>

      <tr>
        <td style={tableCell}>Lixo</td>
        <td style={tableCell}>
  <span
    style={{
      background: '#dcfce7',
      color: '#166534',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
    }}
  >
    Resolvido
  </span>
</td>
        <td style={tableCell}>Leve</td>
        <td style={tableCell}>27/05/2026</td>
        <td style={tableCell}>
  <div
    style={{
      display: 'flex',
      gap: '12px',
    }}
  >
    <Eye
      size={18}
      color="#2563eb"
      style={{ cursor: 'pointer' }}
    />

    <Pencil
      size={18}
      color="#f59e0b"
      style={{ cursor: 'pointer' }}
    />

    <Trash2
      size={18}
      color="#ef4444"
      style={{ cursor: 'pointer' }}
    />
  </div>
</td>
      </tr>
    </tbody>
  </table>
</div>

<div
  style={{
    background: '#ffffff',
    borderRadius: '18px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  }}
>
  <div
    style={{
      padding: '20px',
      borderBottom: '1px solid #e5e7eb',
    }}
  >
    <h3
      style={{
        margin: 0,
        fontSize: '18px',
        color: '#0f172a',
      }}
    >
      Detalhes da Denúncia
    </h3>
  </div>

  <div
    style={{
      padding: '20px',
    }}
  >
    <img
  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
  alt="Denúncia"
  style={{
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '20px',
  }}
/>

    <p><strong>Tipo:</strong> Buraco</p>

    <p><strong>Status:</strong> Aberto</p>

    <p><strong>Gravidade:</strong> Grave</p>

    <p><strong>Localização:</strong></p>

    <p
      style={{
        color: '#6b7280',
      }}
    >
      Rua Exemplo, 369
    </p>
  </div>
</div>
</div>



      </main>
    </div>

  
  );
}