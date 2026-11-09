import { useEffect, useState } from 'react';

import {
  LayoutDashboard,
  Flame,
  MapPin,
  BarChart3,
  Settings,
  Eye,
  Pencil,
  Trash2,
  Users,
  Archive,
} from 'lucide-react';

const API_URL = 'http://localhost:3333';

async function updateIssueStatus(
  issueId: string,
  status: string
) {
  const response = await fetch(
    `${API_URL}/issues/${issueId}/status`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      'Erro ao atualizar status'
    );
  }

  return response.json();
}

async function updateIssue(
  issueId: string,
  deviceId: string,
  data: {
    type: string;
    severity: number;
    description: string;
  }
) {
  const response = await fetch(
    `${API_URL}/issues/${issueId}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        ...data,
        deviceId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      'Erro ao editar denúncia'
    );
  }

  return response.json();
}

export function AdminPage() {

  const [selectedIssue, setSelectedIssue] = useState<any>({
  id: '',
  type: '',
  status: 'Aberto',
  severity: 1,
  description: '',
  imageUrl: '',
  latitude: 0,
  longitude: 0,
  createdAt: '',
  updatedAt: '',
  deviceId: '',
});

  const [selectedIssueId, setSelectedIssueId] =
  useState('');
  
  const tableHeader = {
  textAlign: 'left' as const,
  padding: '16px 24px',
  borderBottom: '1px solid #e5e7eb',
  color: '#6b7280',
  fontSize: '13px',
};

const [issues, setIssues] = useState<any[]>([]);

const [currentPage, setCurrentPage] =
  useState<
    | 'overview'
    | 'heatmap'
    | 'activeIssues'
    | 'teams'
    | 'resolvedIssues'
    | 'reports'
    | 'settings'
  >('overview');

useEffect(() => {
  const fetchIssues = async () => {
    try {
      const response = await fetch(
        `${API_URL}/issues`
      );

      const data = await response.json();
      console.log(data);

      setIssues(data);
    } catch (error) {
      console.error(
        'Erro ao buscar denúncias:',
        error
      );
    }
  };

  fetchIssues();
}, []);

useEffect(() => {
  if (issues.length > 0 && !selectedIssue.id) {
    setSelectedIssue(issues[0]);
    setSelectedIssueId(issues[0].id);
  }
}, [issues]);

const [showStatusModal, setShowStatusModal] = useState(false);

const [showDeleteModal, setShowDeleteModal] = useState(false);

const [showEditModal, setShowEditModal] = useState(false);

const [editType, setEditType] = useState('');

const [editSeverity, setEditSeverity] = useState('');const [editDescription, setEditDescription] =
  useState('');



const tableCell = {
  padding: '16px 24px',
  borderBottom: '1px solid #f1f5f9',
};

const [newStatus, setNewStatus] = useState('Aberto');

const [filterType, setFilterType] =
  useState('Todos');

const [filterStatus, setFilterStatus] =
  useState('Todos');

const [filterSeverity, setFilterSeverity] =
  useState('Todos');

const [searchTerm, setSearchTerm] =
  useState('');


const filterStyle = {
  height: '42px',
  padding: '0 14px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  background: '#ffffff',
  fontSize: '14px',
};


const totalIssues = issues.length;

const resolvedIssues = issues.filter(
  (issue) => issue.status === 'Resolvido'
).length;

const openIssues = issues.filter(
  (issue) => issue.status === 'Aberto'
).length;

const severeIssues = issues.filter(
    (issue) => issue.severity === 3
).length;

const filteredIssues = issues.filter(
  (issue) => {
    const matchesType =
      filterType === 'Todos' ||
      issue.type === filterType;

    const matchesStatus =
      filterStatus === 'Todos' ||
      issue.status === filterStatus;

    const matchesSeverity =
      filterSeverity === 'Todos' ||
      issue.severity === filterSeverity;

    const matchesSearch =
      issue.type
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    return (
      matchesType &&
      matchesStatus &&
      matchesSeverity &&
      matchesSearch
    );
  }
);

function formatIssueType(type: string) {
  const types: Record<string, string> = {
    buraco_calcada: 'Buraco na Calçada',
    iluminacao: 'Iluminação',
    acessibilidade: 'Acessibilidade',
    lixo: 'Lixo',
  };

  return types[type] ?? type;
}

function formatSeverity(severity: number) {
  switch (severity) {
    case 1:
      return '🟢 Leve';

    case 2:
      return '🟡 Moderada';

    case 3:
      return '🔴 Grave';

    default:
      return 'Não informado';
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR');
}

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
    separator: true,
    title: 'OPERAÇÃO',
  },

  {
    icon: MapPin,
    label: 'Denúncias Ativas',
  },
  {
    icon: Users,
    label: 'Equipes',
  },

  {
    separator: true,
    title: 'HISTÓRICO',
  },

  {
    icon: Archive,
    label: 'Ocorrências Resolvidas',
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
  },

  {
    separator: true,
    title: 'ADMINISTRAÇÃO',
  },

  {
    icon: Settings,
    label: 'Configurações',
  },
].map((item, index) => {
  if ('separator' in item) {
    return (
      <div
        key={index}
        style={{
          marginTop: '18px',
          marginBottom: '6px',
          padding: '0 14px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        {item.title}
      </div>
    );
  }

  return (

    /* ===========================================================
   MENU LATERAL - BOTÕES DE NAVEGAÇÃO DO DASHBOARD
   Cada botão altera a página exibida através do currentPage.
=========================================================== */


    <button
    key={item.label}

    onClick={() => {

      switch (item.label) {

        case 'Visão Geral':
          setCurrentPage('overview');
          break;

        case 'Mapa de Calor':
          setCurrentPage('heatmap');
          break;

        case 'Denúncias Ativas':
          setCurrentPage('activeIssues');
          break;

        case 'Equipes':
          setCurrentPage('teams');
          break;

        case 'Ocorrências Resolvidas':
          setCurrentPage('resolvedIssues');
          break;

        case 'Relatórios':
          setCurrentPage('reports');
          break;

        case 'Configurações':
          setCurrentPage('settings');
          break;

      }

    }}

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

        transition: 'all .2s ease',
      }}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </button>
  );
})}
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
      value: totalIssues,
      color: '#2563eb',
    },
    {
      title: 'Resolvidas',
      value: resolvedIssues,
      color: '#16a34a',
    },
    {
      title: 'Em Aberto',
      value: openIssues,
      color: '#f59e0b',
    },
    {
      title: 'Graves',
      value: severeIssues,
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
    <select
  value={filterType}
  onChange={(e) =>
    setFilterType(e.target.value)
  }
  style={filterStyle}
>
  <option value="Todos">
    Todos os Tipos
  </option>

  <option value="Buraco">
    Buraco
  </option>

  <option value="Iluminação">
    Iluminação
  </option>

  <option value="Lixo">
    Lixo
  </option>
</select>

    <select
  value={filterStatus}
  onChange={(e) =>
    setFilterStatus(e.target.value)
  }
  style={filterStyle}
>
  <option value="Todos">
    Todos os Status
  </option>

  <option value="Aberto">
    Aberto
  </option>

  <option value="Em análise">
    Em análise
  </option>

  <option value="Resolvido">
    Resolvido
  </option>
</select>

    <select
  value={filterSeverity}
  onChange={(e) =>
    setFilterSeverity(e.target.value)
  }
  style={filterStyle}
>
  <option value="Todos">
    Todas as Gravidades
  </option>

  <option value="Grave">
    Grave
  </option>

  <option value="Moderada">
    Moderada
  </option>

  <option value="Leve">
    Leve
  </option>
</select>

    <input
      placeholder="Pesquisar denúncia..."
      value={searchTerm}
onChange={(e) =>
  setSearchTerm(e.target.value)
}
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
        <th style={tableHeader}>Foto</th>
        <th style={tableHeader}>Tipo</th>
        <th style={tableHeader}>Status</th>
        <th style={tableHeader}>Gravidade</th>
        <th style={tableHeader}>Data</th>
        <th style={tableHeader}>Ações</th>
      </tr>
    </thead>

    <tbody>
      {filteredIssues.map((issue) => (
  <tr
    key={issue.id}
    onClick={() => {
      setSelectedIssue(issue);
      setSelectedIssueId(issue.id);
    }}
    style={{
      cursor: 'pointer',

      background:
        selectedIssueId === issue.id
          ? '#eff6ff'
          : 'transparent',

      boxShadow:
        selectedIssueId === issue.id
          ? 'inset 4px 0 0 #2563eb'
          : 'none',

      transition: 'all 0.2s ease',
    }}
  >
    <td style={tableCell}>
      <img
        src={issue.imageUrl}
onError={() => console.log(issue.imageUrl)}
        alt="Denúncia"
        style={{
          width: '48px',
          height: '48px',
          objectFit: 'cover',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
        }}
      />
    </td>

    <td style={tableCell}>
  {formatIssueType(issue.type)}
</td>

    <td style={tableCell}>
      <span
        style={{
          background:
            issue.status === 'Aberto'
              ? '#fef3c7'
              : issue.status === 'Em análise'
              ? '#dbeafe'
              : '#dcfce7',

          color:
            issue.status === 'Aberto'
              ? '#92400e'
              : issue.status === 'Em análise'
              ? '#1d4ed8'
              : '#166534',

          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {issue.status}
      </span>
    </td>

    <td style={tableCell}>
      {formatSeverity(issue.severity)}
    </td>

    <td style={tableCell}>
      {formatDate(issue.createdAt)}
    </td>

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
          onClick={(e) => {
            e.stopPropagation();

            setEditType(issue.type);
            setEditSeverity(issue.severity);
            setEditDescription(issue.description);

            setShowEditModal(true);
          }}
        />

        <Trash2
          size={18}
          color="#ef4444"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
        }}
        />
      </div>
    </td>
  </tr>
))}
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
  src={selectedIssue.imageUrl}
  alt="Denúncia"
  style={{
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '20px',
  }}
/>

    <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  }}
>
  <div>
    <p
      style={{
        margin: 0,
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}
    >
      Tipo
    </p>

   <p
  style={{
    margin: '6px 0 0',
    color: '#0f172a',
    fontWeight: 600,
  }}
>
  {formatIssueType(selectedIssue.type)}
</p>
  </div>

  <div>
    <p
      style={{
        margin: 0,
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}
    >
      Status
    </p>

    <span
      style={{
        display: 'inline-block',
        marginTop: '6px',
        padding: '6px 12px',
        borderRadius: '999px',
        background: '#fef3c7',
        color: '#b45309',
        fontSize: '13px',
        fontWeight: 700,
      }}
    >
      {selectedIssue.status}
    </span>
  </div>

  <div>
    <p
      style={{
        margin: 0,
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}
    >
      Gravidade
    </p>

    <p
      style={{
        margin: '6px 0 0',
        color: '#ef4444',
        fontWeight: 700,
      }}
    >
      {formatSeverity(selectedIssue.severity)}
    </p>
  </div>


{/*acidionando a descrição da denúncia no painel de detalhes */}
<div>
  <p
    style={{
      margin: 0,
      fontSize: '12px',
      color: '#94a3b8',
      textTransform: 'uppercase',
      fontWeight: 700,
    }}
  >
    Descrição
  </p>

  <p
    style={{
      margin: '6px 0 0',
      color: '#475569',
      lineHeight: '22px',
    }}
  >
    {selectedIssue.description || 'Nenhuma descrição informada.'}
  </p>
</div>

{/*aqui a localização da denúncia no painel de detalhes com lat e long */}

  <div>
    <p
      style={{
        margin: 0,
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}
    >
      Localização
    </p>

    <p
  style={{
    margin: '6px 0 0',
    color: '#475569',
    lineHeight: '22px',
  }}
>

  Latitude: {selectedIssue.latitude}
  <br />
  Longitude: {selectedIssue.longitude}
</p>
  </div>

  <button
  onClick={() =>
    window.open(
      `https://www.google.com/maps?q=${selectedIssue.latitude},${selectedIssue.longitude}`,
      '_blank'
    )
  }
  style={{
    height: '46px',
    border: '1px solid #2563eb',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#2563eb',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  }}
>
  Abrir no Google Maps
</button>

  <button
  onClick={() =>
    setShowStatusModal(true)
  }
  style={{
    height: '46px',
    border: 'none',
    borderRadius: '12px',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  }}
>
  Atualizar Status
</button>

</div>
  </div>
</div>
</div>



      </main>

      {showStatusModal && (
        
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: '420px',
        background: '#fff',
        borderRadius: '18px',
        padding: '24px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
        }}
      >
        Atualizar Status
      </h3>

      <p>Selecione o novo status:</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '16px',
        }}
      >
        {['Aberto', 'Em análise', 'Resolvido'].map(
  (status) => (
    <button
      key={status}
      onClick={() =>
        setNewStatus(status)
      }
      style={{
        height: '46px',
        borderRadius: '12px',
        border:
          newStatus === status
            ? '2px solid #2563eb'
            : '1px solid #e5e7eb',

        background:
          newStatus === status
            ? '#eff6ff'
            : '#fff',

        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {status}

      
    </button>
  )
)}
      </div>

      <div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  }}
>
  <button
  onClick={() => {
    setShowStatusModal(false);
  }}
  style={{
    height: '42px',
    padding: '0 16px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
  }}
>
  Cancelar
</button>

  <button
  onClick={async () => {
    try {

      const updatedIssue =
        await updateIssueStatus(
          selectedIssue.id,
          newStatus
        );

      const updatedIssues =
        issues.map((issue) =>
          issue.id === updatedIssue.id
            ? updatedIssue
            : issue
        );

      setIssues(updatedIssues);

      setSelectedIssue(updatedIssue);

      setShowStatusModal(false);

    } catch (error) {

      console.error(error);

      alert(
        'Erro ao atualizar o status da denúncia.'
      );

    }
  }}
  style={{
    height: '42px',
    padding: '0 16px',
    borderRadius: '10px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  }}
>
  Salvar
</button>
</div>
    </div>
  </div>
)}

{showDeleteModal && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >

    
    <div
      style={{
        width: '420px',
        background: '#fff',
        borderRadius: '18px',
        padding: '24px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: '#dc2626',
        }}
      >
        Confirmar Exclusão
      </h3>

      <p>
        Esta ação não poderá ser desfeita.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px',
        }}
      >
        <button
          onClick={() =>
            setShowDeleteModal(false)
          }
          style={{
            height: '42px',
            padding: '0 16px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>

        <button
          onClick={() => {
  const filteredIssues = issues.filter(
    (issue) =>
      issue.id !== selectedIssue.id
  );

  setIssues(filteredIssues);

  if (filteredIssues.length > 0) {
    setSelectedIssue(filteredIssues[0]);
    setSelectedIssueId(
      filteredIssues[0].type
    );
  }

  setShowDeleteModal(false);
}}
          style={{
            height: '42px',
            padding: '0 16px',
            borderRadius: '10px',
            border: 'none',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
)}



{showEditModal && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: '500px',
        background: '#fff',
        borderRadius: '18px',
        padding: '24px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
        }}
      >
        Editar Denúncia
      </h3>

      <div
  style={{
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '14px',
    marginTop: '16px',
    marginBottom: '20px',
  }}
>
  <strong>
    {formatIssueType(selectedIssue.type)}
  </strong>

  <p
    style={{
      margin: '8px 0',
      color: '#64748b',
      fontSize: '14px',
    }}
  >
    Status:
    {' '}
    {selectedIssue.status}
  </p>

  <p
    style={{
      margin: 0,
      color: '#64748b',
      fontSize: '14px',
      lineHeight: '22px',
    }}
  >
    {selectedIssue.description}
  </p>
</div>

      <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  }}
>
  <div>
    <label
      style={{
        display: 'block',
        marginBottom: '6px',
        fontWeight: 600,
      }}
    >
      Tipo
    </label>

    <input
      value={editType}
      onChange={(e) =>
        setEditType(e.target.value)
      }
      style={{
        width: '100%',
        height: '44px',
        padding: '0 12px',
        borderRadius: '10px',
        border: '1px solid #d1d5db',
      }}
    />
  </div>

  <div>
    <label
      style={{
        display: 'block',
        marginBottom: '6px',
        fontWeight: 600,
      }}
    >
      Gravidade
    </label>

    <input
      value={editSeverity}
      onChange={(e) =>
        setEditSeverity(e.target.value)
      }
      style={{
        width: '100%',
        height: '44px',
        padding: '0 12px',
        borderRadius: '10px',
        border: '1px solid #d1d5db',
      }}
    />
  </div>
</div>

<div>
  <label
    style={{
      display: 'block',
      marginBottom: '6px',
      fontWeight: 600,
    }}
  >
    Descrição
  </label>

  <textarea
    value={editDescription}
    onChange={(e) =>
      setEditDescription(e.target.value)
    }
    rows={4}
    style={{
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #d1d5db',
      resize: 'vertical',
      fontFamily: 'inherit',
      fontSize: '14px',
    }}
  />
</div>

      <div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  }}
>
  <button
    onClick={() =>
      setShowEditModal(false)
    }
    style={{
      height: '42px',
      padding: '0 16px',
      borderRadius: '10px',
      border: '1px solid #d1d5db',
      background: '#fff',
      cursor: 'pointer',
    }}
  >
    Cancelar
  </button>

  <button
  onClick={async () => {
  try {
    const updatedIssue =
      await updateIssue(
        selectedIssue.id,
        selectedIssue.deviceId,
        {
          type: editType,
          severity: Number(editSeverity),
          description: editDescription,
        }
      );

    const updatedIssues =
      issues.map((issue) =>
        issue.id === updatedIssue.id
          ? updatedIssue
          : issue
      );

    setIssues(updatedIssues);

    setSelectedIssue(updatedIssue);

    setSelectedIssueId(updatedIssue.id);

    setShowEditModal(false);

  } catch (error) {

    console.error(error);

    alert(
      'Erro ao editar a denúncia.'
    );

  }
}}
>
  Salvar
</button>
</div>
    </div>
  </div>
)}



    </div>

  
  );
}