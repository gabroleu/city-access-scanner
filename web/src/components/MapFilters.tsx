type MapFiltersProps = {
  open: boolean;
  onClose: () => void;
};

export function MapFilters({
  open,
  onClose,
}: MapFiltersProps) {
  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'rgba(0,0,0,0.35)',
          backdropFilter:
            'blur(6px)',
          WebkitBackdropFilter:
            'blur(6px)',
          zIndex: 9998,
        }}
      />

      {/* painel */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: '110px',
          transform:
            'translateX(-50%)',

          width: '92%',
          maxWidth: '420px',

          borderRadius: '34px',

          background:
            'linear-gradient(180deg, rgba(22,28,45,0.96), rgba(15,23,42,0.98))',

          border:
            '1px solid rgba(255,255,255,0.08)',

          backdropFilter:
            'blur(30px)',

          WebkitBackdropFilter:
            'blur(30px)',

          boxShadow:
            '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',

          padding: '24px',

          zIndex: 9999,
        }}
      >
        {/* header */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: 'white',
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing:
                '-1px',
            }}
          >
            Filtros
          </h2>

          <button
            onClick={onClose}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '18px',

              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.05)',

              color: 'white',

              fontSize: '24px',

              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* placeholder */}
        <div
          style={{
            color:
              'rgba(255,255,255,0.7)',
            fontSize: '15px',
          }}
        >
          Painel de filtros em construção
        </div>
      </div>
    </>
  );
}