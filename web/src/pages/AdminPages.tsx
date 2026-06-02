import {
  LayoutDashboard,
  Flame,
  MapPin,
  BarChart3,
  Settings,
} from 'lucide-react';
export function AdminPage() {
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
      color: '#111827',
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
      </main>
    </div>
  );
}