# Product Requirements Document (PRD) - Aceleraí Geographic Impact Hub

## 1. Visão Geral do Produto
O **Aceleraí Geographic Impact Hub** é um dashboard de visualização de alto impacto projetado para demonstrar o alcance geográfico e o sucesso de campanhas de marketing/investimento em tempo real. O foco principal é o "Data Storytelling" visual, utilizando um mapa interativo do Brasil para conectar métricas de impacto a regiões específicas de forma cinematográfica.

## 2. Objetivos Estratégicos
*   **Impressionar Stakeholders**: Fornecer uma interface "uau" para apresentações e salas de controle (war rooms).
*   **Clareza de Dados**: Traduzir métricas complexas de alcance em uma visualização geográfica intuitiva.
*   **Fortalecimento de Marca**: Utilizar uma estética premium (Glassmorphism e Dark Mode) para posicionar o Aceleraí como uma empresa de tecnologia de ponta.

## 3. Personas
*   **Executivos/Diretores**: Que precisam de uma visão macro e rápida do impacto da marca no território nacional.
*   **Gerentes de Marketing**: Que utilizam o dashboard para validar a performance geográfica de campanhas específicas.
*   **Equipes de Vendas/Parcerias**: Que usam a ferramenta como material de apoio visual para demonstrar capilaridade a possíveis clientes.

## 4. Requisitos Funcionais

### RF01: Ciclo de Campanha Automatizado
O sistema deve alternar automaticamente entre diferentes campanhas cadastradas em um intervalo pré-definido (atualmente 14 segundos), sem necessidade de interação humana.

### RF02: Navegação Geográfica Cinematográfica (Zoom In/Out)
O mapa deve realizar um movimento de "Zoom Out" para a visão geral do Brasil e um "Zoom In" focado no estado da campanha ativa, utilizando transições suaves e fluidas.

### RF03: Feedback Visual de Progresso
Cada card de campanha deve exibir uma barra de progresso minimalista indicando quanto tempo falta para a próxima transição.

### RF04: Contador de Impacto Animado
Os números de alcance/impacto devem possuir uma animação de incremento (count-up) toda vez que uma nova campanha for carregada, reforçando a ideia de "dados vivos".

### RF05: Customização de Marca
O administrador deve ser capaz de alterar a logo do sistema apenas substituindo um arquivo na pasta de recursos estáticos (`/public/logo.png`).

### RF06: Destaque visual (Glow Effect)
O estado (UF) relacionado à campanha ativa deve ficar iluminado no mapa com uma cor de destaque e efeito de brilho (glow).

## 5. Requisitos Não Funcionais

### RNF01: Performance de Animação
As transições devem rodar a 60 FPS estáveis, utilizando aceleração de hardware via Framer Motion para evitar engasgos visuais.

### RNF02: Estética "Premium"
O design deve seguir estritamente os princípios de Glassmorphism (transparências, blur de fundo e bordas finas) e paleta Dark Mode.

### RNF03: Responsividade de Layout
Embora focado em grandes telas e dashboards, o layout deve se adaptar para manter a legibilidade em diferentes proporções de monitores.

### RNF04: Facilidade de Manutenção (JSON-Driven)
A inclusão de novas campanhas deve ser feita via configuração de constantes (JSON/Typescript), sem necessidade de alterar a lógica principal de renderização do mapa.

## 6. User Experience (UX) - O Fluxo Cinematográfico
1.  **Afastamento**: A interface some e o mapa volta para a visão Brasil (1.5s).
2.  **Transição**: Os dados da campanha anterior são trocados pelos novos no "ponto cego" do afastamento.
3.  **Mergulho**: O mapa foca no novo estado com um movimento rápido porém suave (4.0s).
4.  **Revelação**: O card com a imagem do criativo e os dados de impacto aparecem com um efeito de fade e blur reverso.

## 7. Critérios de Sucesso
*   Tempo de carregamento inicial menor que 2 segundos.
*   Sincronização perfeita entre o movimento do mapa e a exibição dos cards.
*   Feedback positivo de stakeholders quanto à facilidade de leitura e impacto visual da ferramenta.

---
**Versão:** 1.0  
**Status:** Em Desenvolvimento / Versão Estável 1.0  
**Proprietário:** Aceleraí Technology Department
