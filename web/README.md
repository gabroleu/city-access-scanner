# 🌍 City Access Scanner — Frontend

Interface web do **City Access Scanner**, uma plataforma de mapeamento colaborativo de problemas de acessibilidade urbana.

---

## 🎯 Objetivo

Permitir a visualização, em mapa interativo, das denúncias registradas pelos usuários, transformando dados georreferenciados em insights visuais (heatmaps e marcadores).

---

## 🛠️ Stack Tecnológica

* React + TypeScript
* Vite
* React Leaflet
* Leaflet (mapas interativos)

---

## 🚀 Funcionalidades

* 📍 Visualização de denúncias em mapa
* 🗺️ Renderização de marcadores por coordenadas (latitude/longitude)
* 🖼️ Exibição de imagens das irregularidades
* 📊 Base para implementação de heatmaps
* 🔗 Integração com API backend (`/issues`)

---

## 🔌 Integração com Backend

O frontend consome a API do backend:

```
GET http://localhost:3333/issues
```

Retorno esperado:

```json
[
  {
    "id": "string",
    "type": "string",
    "description": "string",
    "imageUrl": "string",
    "latitude": number,
    "longitude": number
  }
]
```

---

## ⚙️ Como rodar o projeto

```bash
# entrar na pasta
cd web

# instalar dependências
npm install

# rodar aplicação
npm run dev
```

Aplicação disponível em:

```
http://localhost:5173
```

---

## 📂 Estrutura do Projeto

```
web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.tsx
├── public/
└── index.html
```

---

## 🧠 Próximos Passos

* Implementação de heatmaps
* Filtros por tipo de ocorrência
* Agrupamento de pontos (clustering)
* Interface mobile-first otimizada
* Integração com geolocalização em tempo real

---

## 💡 Visão

Este frontend é a camada visual de um sistema de inteligência urbana baseado em dados crowdsourced, com potencial de apoio à gestão pública e tomada de decisão em infraestrutura urbana.

---

## 👨‍💻 Autor

Projeto desenvolvido como parte de um sistema fullstack para portfólio e aplicações reais em smart cities.
