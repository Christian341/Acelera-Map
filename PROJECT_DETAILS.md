# Aceleraí Geographic Impact Hub - Documentação do Projeto

Este projeto é um dashboard de alto impacto visual desenvolvido para visualização geográfica de campanhas e métricas de alcance no Brasil. Ele utiliza animações cinematográficas e uma interface moderna baseada em Glassmorphism para proporcionar uma experiência de "Data Storytelling".

---

## 🚀 Tecnologias Core

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema Frontend:

- **React 18**: Biblioteca base para construção da interface.
- **Vite**: Build tool ultra-rápida para desenvolvimento.
- **TypeScript**: Garantia de tipagem e robustez do código.
- **Framer Motion**: Engine de animação responsável pelos movimentos cinematográficos de zoom e transições de UI.
- **React Simple Maps**: Componente base para renderização do GeoJSON do Brasil.
- **Tailwind CSS**: Sistema de estilização utilitário (via CDN no `index.html`).
- **Lucide React**: Biblioteca de ícones minimalistas.

---

## 🏗️ Arquitetura e Componentes

### 1. `App.tsx` (Orquestrador)
É o "cérebro" da aplicação. Ele gerencia o ciclo de vida das animações e a troca de dados das campanhas.
- **Ciclo de 14 segundos**: Dividido em fases de Zoom Out (visão geral), Troca de Dados, Zoom In (foco no estado) e Revelação de UI.
- **Estados de Animação**: Controla a visibilidade da interface (`uiVisible`) e o brilho dos estados no mapa (`isLightingUp`).

### 2. `MapChart.tsx`
Responsável pela renderização do mapa e as transições de câmera.
- **Animações Manuais**: Utiliza o `animate` do Framer Motion para interpolar coordenadas e zoom, superando limitações nativas da biblioteca de mapas.
- **Transições Dinâmicas**: 1.5s para afastamento (Zoom Out) e 4.0s para aproximação (Zoom In) com curvas de easing `easeInOutCubic` e `easeOutExpo`.

### 3. `CampaignCard.tsx`
Apresenta os detalhes da campanha ativa.
- **Layout Sincronizado**: Agora alinhado na base do dashboard para simetria visual.
- **Progress Bar**: Barra minimalista na base do card que indica o tempo restante antes da próxima transição.
- **Aspect Ratio**: Imagens em 16:9 (`aspect-video`) para melhor adaptação de criativos.

### 4. `ImpactFooter.tsx`
Exibe métricas de alcance com contadores animados.
- **AnimatedCounter**: Incrementa os números de forma fluida durante a transição para gerar sensação de atualização em tempo real.

---

## 🎨 Design System

- **Aesthetics**: Glassmorphism (efeito vidro fosco com blur profundo).
- **Cores**: 
  - Fundo: `#050505` (Deep Black)
  - Destaque: `#FF2D55` (Pinkish Red)
  - Bordas/Vidro: Branco com baixa opacidade (`white/5` a `white/10`).
- **Imagens**: Utiliza gradientes de overlay pretos nas imagens para garantir legibilidade dos textos em cima dos criativos.

---

## 🛠️ Guia de Customização

### Trocar a Logo
1. Vá até a pasta `public/` na raiz do projeto.
2. Adicione sua logo com o nome exato `logo.png`.
3. O sistema aplicará a imagem automaticamente no cabeçalho com altura de 48px e proporção preservada.

### Adicionar/Mudar Campanhas
Os dados estão centralizados em `constants.ts`. Para cada campanha, você pode configurar:
- `coordinates`: O centro geográfico do mergulho no mapa.
- `zoom`: O nível de proximidade do zoom (ex: 2.0 para estados maiores, 4.0 para menores).
- `impact`: O valor numérico de alcance que será animado no contador.

---

## ⚙️ Execução e Build

- **Desenvolvimento**: `npm run dev` (Porta 3000)
- **Build de Produção**: `npm run build`
- **Variáveis de Ambiente**: Arquivo `.env.local` preparado para receber `GEMINI_API_KEY` para futuras integrações de IA.

---

**Desenvolvido com foco em Visual Excellence e Performance.**
