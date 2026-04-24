# 🏙️ City Access Scanner (Crowdsourcing de Infraestrutura)

O **City Access Scanner** é uma plataforma de dados georreferenciados que transforma o relato de cidadãos em mapas de calor acionáveis. O objetivo é permitir que qualquer pessoa mapeie problemas de acessibilidade urbana (calçadas danificadas, ausência de rampas ou semáforos sonoros com defeito) em tempo real.

---

## 💡 A Inovação
Diferente de canais de reclamação tradicionais, o projeto foca em **dados estruturados**. Ele agrupa denúncias próximas para evitar duplicidade e gera visualizações de impacto (Heatmaps) que auxiliam a gestão pública na priorização de reformas.

## 🛠️ Stack Tecnológica

### Backend (Node.js + TypeScript)
- **Processamento de Imagens:** Gerenciamento de uploads de evidências das irregularidades.
- **Geoprocessamento:** Algoritmos para agrupamento (clustering) de denúncias por proximidade geográfica.
- **Armazenamento:** Integração com **Amazon S3** (ou similar) para persistência de arquivos.
- **Banco de Dados:** PostgreSQL com suporte a coordenadas geográficas.

### Frontend (React + TypeScript)
- **Mobile First:** Interface otimizada para uso em campo via navegador.
- **PWA Features:** Acesso à Câmera e GPS do dispositivo.
- **Mapas Interativos:** Implementação de **Heatmaps** utilizando `react-leaflet` para visualização de densidade de problemas.

## 🚀 Funcionalidades Principais
- [x] **Reporte com Foto e GPS:** Captura automática da localização ao enviar uma foto.
- [ ] **Heatmap de Acessibilidade:** Visualização das áreas críticas da cidade em tempo real.
- [ ] **Desduplicação Inteligente:** Backend agrupa múltiplos relatos sobre o mesmo problema.
- [ ] **Painel de Gestão:** Filtros por tipo de ocorrência (calçada, semáforo, rampa).


## 🚀 Vercel
https://manaus-scanner.vercel.app/ (front)