export function AdminPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#111827',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '24px',
        }}
      >
        <h2
          style={{
            color: 'white',
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
          }}
        >
          City Access
        </h2>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '13px',
            marginTop: '6px',
          }}
        >
          Dashboard Admin
        </p>
      </aside>

      {/* Conteúdo */}
      <main
        style={{
          flex: 1,
          padding: '32px',
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '32px',
            margin: 0,
          }}
        >
          Visão Geral
        </h1>

        <p
          style={{
            color: '#94a3b8',
            marginTop: '10px',
          }}
        >
          Estrutura inicial do painel administrativo.
        </p>
      </main>
    </div>
  );
}