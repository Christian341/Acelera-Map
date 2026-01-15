# Documento de Arquitetura Técnica - Aceleraí Geographic Impact Hub

## 1. Introdução
Este documento descreve a infraestrutura técnica, os padrões de design e a estratégia de evolução da plataforma, com foco na transição de dados estáticos para um ecossistema dinâmico alimentado por bancos de dados.

## 2. Visão Geral da Arquitetura
A aplicação segue uma arquitetura baseada em **Componentes Reativos** com uma camada de animação desacoplada da lógica de dados.

### Fluxo de Dados Atual (Fase 1: Estática)
- **Store**: `constants.ts` (JSON/TS).
- **Consumo**: Componentes React importam diretamente as constantes.
- **Sync**: Ciclo de vida gerenciado por `setInterval` no `App.tsx`.

### Fluxo de Dados Futuro (Fase 2 & 3: Dinâmica)
O sistema foi projetado para evoluir para o seguinte modelo:
1.  **Backend/Database**: Inicialmente Supabase ou similar para gestão manual.
2.  **API Layer**: Fetch de dados na inicialização do app.
3.  **Real-time Sync**: Atualização automática quando novos dados forem inseridos no banco.

---

## 3. Modelo de Dados (Schema Sugerido)
Para suportar o gerenciamento manual via banco de dados e a futura automação, o schema da tabela `campaigns` deve seguir esta estrutura:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único. |
| `client_name` | String | Ex: "Eco Power". |
| `category` | String | Ex: "Energia Solar". |
| `description` | Text | Detalhamento do projeto/criativo. |
| `image_url` | String | Link da imagem (S3, Supabase Storage, etc). |
| `state_id` | String | Nome do estado para o mapa (Ex: "Minas Gerais"). |
| `state_name` | String | Nome exibido na UI (Ex: "MINAS GERAIS"). |
| `impact_value` | BigInt | Valor numérico para o contador (Ex: 542310). |
| `coord_lat` | Float | Longitude para foco do mapa (padrão rsm). |
| `coord_long` | Float | Latitude para foco do mapa (padrão rsm). |
| `zoom_level` | Float | Nível de zoom específico para a região (1.0 a 5.0). |
| `is_active` | Boolean | Controle de exibição no dashboard. |

---

## 4. Evolução da Infraestrutura

### Fase 2: Gestão Manual via Banco (Próximo Passo)
- **Tecnologia**: Supabase (PostgreSQL + Auth + Storage).
- **Implementação**: 
    - Substituir o array `CAMPAIGNS` por um `useEffect` que realiza um `fetch` ao carregar o dashboard.
    - Utilização do painel do Supabase para adicionar/editar criativos e métricas manualmente.

### Fase 3: Integração e Automação Total
- **Conectividade**: O banco de dados do Dashboard se conectará ao banco de dados principal do ecossistema Aceleraí por meio de:
    - **Webhooks**: Notificar o dashboard sobre novas campanhas.
    - **Edge Functions**: Processar e sanitizar dados antes de chegarem à UI.
- **Fluxo**: Entrada de dados automática -> Atualização de métricas -> Reflexo imediato no mapa sem refresh de página.

---

## 5. Padrões de Animação e Performance
A arquitetura garante que, mesmo com dados vindo de APIs externas, a performance se mantenha:
- **Interpolation UI**: O `MapChart` utiliza *display states* intermediários para garantir que, se houver latência na rede, o mapa ainda se mova de forma fluida.
- **Asset Preloading**: Implementação futura de um buffer para carregar a próxima imagem (`image_url`) enquanto a atual ainda está em exibição.

---

## 6. Stack Tecnológica Detalhada
- **Frontend**: React 18, Vite.
- **Styling**: Tailwind CSS + Custom CSS Modules (Glassmorphism).
- **Motion**: Framer Motion (Orquestração de Timings).
- **Mapping**: React Simple Maps (SVG Path Rendering).
- **Hosting Sugerido**: Vercel / Netlify (CI/CD integrado com GitHub).

---
**Data:** 15/01/2026  
**Autor:** Antigravity AI Engineering
