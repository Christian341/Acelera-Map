# Plano de Otimização Extrema (Fase 2) - Foco em Dispositivos Low-End

## 🚨 Diagnóstico Crítico
A otimização anterior focou em efeitos visuais (CSS/GPU), mas o gargalo principal persiste: **Carga de CPU na renderização do SVG**.
O `react-simple-maps` (baseado em d3-geo) recalcula matematicamente os caminhos (paths) de todo o mapa do Brasil a cada frame da animação de zoom. Em dispositivos fracos, a CPU não consegue manter 60fps fazendo milhares de cálculos de projeção geográfica por segundo.

---

## 🚀 Estratégia "Zero-CPU": CSS Transforms

Ao invés de pedir para o React/D3 recalcular a geometria do mapa durante o zoom, vamos renderizar o mapa **uma única vez** e usar a GPU para dar zoom apenas na "imagem" dele usando CSS Transforms (`scale` e `translate`).

### 1. Mudança na Estratégia de Zoom (Otimização Massiva)
*   **Atual (CPU Heavy)**: Alterar prop `zoom` do componente -> D3 recalcula projeção -> React atualiza DOM do SVG.
*   **Nova (GPU Fast)**: Manter prop `zoom={1}` fixa -> Aplicar `style={{ transform: scale(ZOOM_LEVEL) }}` no container.
*   **Impacto**: Transfere o trabalho da CPU (cálculo matemático) para a GPU (textura/vetor), que é infinitamente mais rápida para isso.

### 2. Simplificação do TopoJSON (Redução de Vértices)
*   Os mapas detalhados possuem milhares de pontos (nós) para desenhar o litoral.
*   **Ação**: Implementar uma versão "Low Poly" do mapa do Brasil para o modo de performance.
*   **Técnica**: Usar `presimplify` ou carregar um JSON alternativo com menos detalhes quando `isLowPower` for true.

### 3. Remoção Total de Framer Motion no Mapa (Modo Low-End)
*   O Framer Motion adiciona overhead de Javascript a cada frame.
*   **Ação**: No modo `low-end`, substituir a animação JS por **CSS Transitions** puras.
    ```css
    .map-container.low-end {
        transition: transform 3s cubic-bezier(0.45, 0, 0.55, 1);
        /* O navegador gerencia essa animação em uma thread separada */
    }
    ```

### 4. Controle de Renderização (Throttling)
*   Evitar que o React tente renderizar quadros desnecessários se o dispositivo estiver engasgando.
*   **Ação**: Reduzir a taxa de atualização de coordenadas em dispositivos móveis.

---

## 📋 Tarefas Fase 2

### Prioridade Máxima (Core Performance)
- [x] **Implementar Zoom via CSS Transform**: (Concluído)
    - Refatorar `MapChart` para aceitar zoom via prop `transform` CSS ao invés de recalcular projeção.
    - Manter a renderização do SVG estática após o primeiro load.
- [ ] **Criar Adaptador CSS-Only para Animação**:
    - Se `isLowPower` for ativado, desativar listeners do Framer Motion e aplicar classes CSS para mover o mapa.

### Prioridade Média (Visual/Dados)
- [ ] **Separar Camadas de Renderização**:
    - O fundo (background) e os efeitos devem ser divs separadas que não sofrem repaint quando o mapa move.
- [ ] **Simplificar Geometria (Opcional)**:
    - Se o CSS Transform não for suficiente, reduzir a precisão do `constants.ts` (BR_TOPO_JSON).

### Prioridade Baixa (Ajustes Finos)
- [ ] **Desativar Tooltips/Interações no Zoom**:
    - Bloquear `pointer-events` durante a animação para evitar cálculos de hover.

---

## 📉 Meta de Resultado
- **Frames por Segundo (FPS)**: Subir de ~15-20fps (atual em low-end) para estáveis 60fps usando aceleração de hardware nativa.
- **Uso de CPU**: Reduzir em 80% durante as transições.

**Status**: Pronto para Implementação
