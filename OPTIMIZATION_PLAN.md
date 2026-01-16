# Plano de Otimização de Performance (Low-End Devices)

## 🎯 Objetivo
Melhorar drasticamente a performance de renderização e animação do dashboard em dispositivos com hardware gráfico limitado (laptops antigos, tablets, celulares), mantendo a integridade visual da estética "War Room" sempre que possível.

---

## 🔍 Diagnóstico de Gargalos (Bottlenecks)

1.  **Glassmorphism (Backdrop Filter)**: O uso intensivo de `backdrop-filter: blur()` em `CampaignCard`, `ImpactFooter` e `AdminPanel` é extremamente custoso para a GPU, pois exige reprocessamento de pixels a cada frame de animação.
2.  **Sombras e Glows (Drop Shadow)**: O efeito `.active-state-glow` e as sombras dos cards usam raios largos de desfoque, o que soma carga à GPU.
3.  **Overlays de Tela Cheia**: Os efeitos de "Grain" e "Scanlines" (`index.html`) cobrem 100% da viewport e forçam o navegador a recompor a tela inteira a cada frame.
4.  **Mapa SVG (React Simple Maps)**: A re-renderização de todos os caminhos SVG durante o zoom, somada aos efeitos de filtro no estado ativo, causa quedas de FPS.

---

## 🛠️ Estratégia de Implementação

### 1. Sistema de "Lite Mode" (Modo Leve)
Implementar uma detecção de capacidade de hardware ou media query para reduzir efeitos.

*   **Ação**: Adicionar classe `.low-end` ao body baseada em detecção simples (ex: `navigator.hardwareConcurrency` baixo ou flag manual).
*   **Redução**:
    *   Substituir `backdrop-filter: blur(24px)` por background semi-transparente sólido (`rgba(10, 10, 10, 0.95)`).
    *   Desativar animações de pulso (`animate-pulse`) em elementos não críticos.

### 2. Otimização dos Efeitos Globais
Refinar os efeitos de pós-processamento para serem menos agressivos.

*   **Grain & Scanlines**: Usar `translateZ(0)` ou `will-change: transform` para promover camadas para a GPU, ou desabilitá-los completamente em telas menores que 1024px.
*   **CSS**:
    ```css
    /* Otimização para scanlines */
    .scanlines {
        /* Se possível, renderizar em canvas ou usar imagem estática ao invés de gradientes complexos repetidos */
        will-change: opacity; 
    }
    ```

### 3. Otimização do Mapa (MapChart.tsx)
O mapa é o componente mais pesado durante a animação de zoom.

*   **Memoização**: Garantir que `<Geography />` componentes que não mudaram de estado não sejam re-renderizados. Usar `React.memo` no componente interno do mapa.
*   **Redução de Filtros no SVG**:
    *   O estilo `filter: drop-shadow(...)` no estado ativo é pesado quando o objeto escala.
    *   *Solução*: Usar uma `div` absoluta atrás do mapa para fazer o "glow" apenas na posição aproximada, ou reduzir a qualidade do shadow durante a animação.

### 4. Otimização de Imagens
Garantir que as imagens grandes dos cards não estejam forçando decoding excessivo.

*   **Ação**: Adicionar `loading="eager"` para a imagem ativa e `loading="lazy"` para as demais (embora o carrossel atual pré-carregue, verificar tamanhos).
*   **Formato**: Garantir uso de WebP (já feito via Supabase/CDN geralmente, mas vale validar).

---

## 📋 Tarefas (Backlog Técnico)

- [x] **Criar Hook `usePerformanceMode`**: Detectar se o dispositivo precisa de modo leve. (Concluído)
- [x] **Refatorar CSS Global**: Criar variaveis CSS para Blur e Opacidade que mudam baseadas na classe `.low-power`. (Concluído)
- [x] **Otimizar `MapChart`**: Envolver `Geography` em `React.memo` e comparas props rigorosamente. (Concluído)
- [ ] **Ajustar `CampaignCard`**: Reduzir blur e sombras quando em modo de economia.
- [ ] **Toggle Manual**: Adicionar botão nas configurações (Admin) para forçar "Modo Alta Performance" vs "Modo Cinematográfico".

---

**Status**: Planejado
**Prioridade**: Alta (Bloqueador para dispositivos móveis/básicos)
