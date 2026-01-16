# 📺 Plano de Super Otimização para TV (24/7 Operation)

## 🚨 Diagnóstico: Desafios Específicos de TV

### Problemas Identificados
1. **Hardware Limitado**: TVs possuem processadores muito mais fracos que PCs/smartphones
2. **Memória RAM Restrita**: Navegadores de TV têm limites agressivos de memória (geralmente 512MB-1GB)
3. **GPU Básica**: Aceleração de hardware limitada ou inexistente
4. **Memory Leaks**: Execução 24/7 expõe vazamentos de memória que causam travamentos progressivos
5. **Garbage Collection**: GC frequente causa "stuttering" visível
6. **Renderização SVG**: Mapas vetoriais complexos são extremamente pesados para TVs

---

## 🎯 Estratégia de Otimização Multi-Camadas

### **Camada 1: Redução Drástica de Complexidade DOM**
O navegador da TV não consegue lidar com milhares de nós DOM do SVG do mapa.

#### Ações Críticas:
- [ ] **Substituir SVG por Canvas Estático** (Prioridade MÁXIMA)
  - Renderizar o mapa do Brasil uma única vez em um `<canvas>` no carregamento
  - Usar `OffscreenCanvas` para pré-renderizar estados em background
  - Aplicar zoom/pan via CSS Transform no canvas (GPU-accelerated)
  - **Impacto**: Redução de 90% no uso de CPU durante animações

- [ ] **Simplificar Geometria do Mapa**
  - Reduzir vértices do TopoJSON de ~5000 para ~500 pontos
  - Usar ferramenta `mapshaper` para simplificação: `mapshaper -simplify 10% keep-shapes`
  - Criar versão "TV Mode" do mapa com detalhes mínimos

- [ ] **Remover Elementos Decorativos**
  - Desabilitar gradientes de fundo complexos
  - Remover sombras e blurs (muito pesados para GPU fraca)
  - Substituir glassmorphism por backgrounds sólidos com opacidade

---

### **Camada 2: Gerenciamento de Memória Agressivo**
Evitar que o app "inche" e trave após horas de execução.

#### Ações Críticas:
- [ ] **Implementar Auto-Reload Preventivo**
  ```typescript
  // Recarregar página a cada 6 horas para limpar memória
  useEffect(() => {
    const reloadTimer = setTimeout(() => {
      window.location.reload();
    }, 6 * 60 * 60 * 1000); // 6 horas
    return () => clearTimeout(reloadTimer);
  }, []);
  ```

- [ ] **Limpar Listeners e Timers**
  - Auditar todos os `setInterval`/`setTimeout` para garantir cleanup
  - Remover event listeners não utilizados
  - Usar `AbortController` para cancelar fetch requests pendentes

- [ ] **Lazy Loading Agressivo**
  - Carregar imagens de campanhas apenas quando visíveis
  - Usar `loading="lazy"` em todas as imagens
  - Implementar cache de imagens com limite de tamanho

- [ ] **Limitar Cache de Imagens**
  ```typescript
  const imageCache = new Map();
  const MAX_CACHE_SIZE = 5;
  
  function cacheImage(url: string, blob: Blob) {
    if (imageCache.size >= MAX_CACHE_SIZE) {
      const firstKey = imageCache.keys().next().value;
      imageCache.delete(firstKey);
    }
    imageCache.set(url, blob);
  }
  ```

---

### **Camada 3: Otimização de Animações**
Framer Motion é pesado demais para TVs.

#### Ações Críticas:
- [ ] **Substituir Framer Motion por CSS Puro**
  - Usar `@keyframes` para animações de entrada/saída
  - Aplicar `will-change: transform` apenas durante animações
  - Remover biblioteca Framer Motion completamente (economia de ~100KB)

- [ ] **Reduzir FPS de Animações**
  ```css
  @media (max-width: 1920px) {
    .map-container {
      animation-timing-function: steps(30); /* 30fps ao invés de 60fps */
    }
  }
  ```

- [ ] **Desabilitar Animações Secundárias**
  - Remover counter animations (AnimatedCounter)
  - Usar transições instantâneas para textos
  - Manter apenas zoom do mapa (essencial)

---

### **Camada 4: Modo "TV Kiosk"**
Criar um modo específico para TVs com recursos mínimos.

#### Ações Críticas:
- [ ] **Detector de Ambiente TV**
  ```typescript
  function isTVBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return /tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast/i.test(ua) ||
           window.innerWidth >= 1920 && window.innerHeight >= 1080;
  }
  ```

- [ ] **Configuração TV Mode**
  ```typescript
  const TV_CONFIG = {
    useCanvas: true,              // Canvas ao invés de SVG
    disableBlur: true,            // Sem blur effects
    disableGradients: true,       // Backgrounds sólidos
    reducedAnimations: true,      // Animações simplificadas
    imageQuality: 'low',          // Imagens comprimidas
    autoReloadInterval: 6 * 3600, // Reload a cada 6h
    maxCampaigns: 10,             // Limitar campanhas carregadas
    preloadImages: false,         // Carregar sob demanda
  };
  ```

- [ ] **UI Simplificada para TV**
  - Aumentar tamanho de fontes (legibilidade a distância)
  - Remover hover effects (TVs não têm mouse)
  - Usar cores mais contrastadas
  - Remover admin panel (não necessário em TV)

---

### **Camada 5: Otimização de Rede**
Reduzir dependência de conexão durante operação.

#### Ações Críticas:
- [ ] **Service Worker para Cache Offline**
  ```typescript
  // sw.js
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('tv-dashboard-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/logo.png',
          '/brazil-map-simplified.json'
        ]);
      })
    );
  });
  ```

- [ ] **Comprimir Imagens Automaticamente**
  - Converter todas as imagens para WebP
  - Redimensionar para máximo 1920x1080
  - Usar qualidade 70% (imperceptível em TV)

- [ ] **Pré-carregar Dados Críticos**
  - Fazer fetch de todas as campanhas no boot
  - Armazenar em `localStorage` com TTL de 24h
  - Modo offline completo após primeiro carregamento

---

### **Camada 6: Monitoramento e Auto-Recuperação**
Sistema de watchdog para detectar e corrigir problemas automaticamente.

#### Ações Críticas:
- [ ] **Performance Monitor**
  ```typescript
  useEffect(() => {
    const monitor = setInterval(() => {
      const memory = (performance as any).memory;
      if (memory && memory.usedJSHeapSize > 100 * 1024 * 1024) {
        console.warn('[TV Mode] High memory usage detected, reloading...');
        window.location.reload();
      }
    }, 60000); // Check a cada minuto
    
    return () => clearInterval(monitor);
  }, []);
  ```

- [ ] **FPS Monitor**
  ```typescript
  let lastFrameTime = performance.now();
  let lowFPSCount = 0;
  
  function checkFPS() {
    const now = performance.now();
    const fps = 1000 / (now - lastFrameTime);
    lastFrameTime = now;
    
    if (fps < 20) {
      lowFPSCount++;
      if (lowFPSCount > 30) { // 30 frames ruins consecutivos
        console.error('[TV Mode] Persistent low FPS, reloading...');
        window.location.reload();
      }
    } else {
      lowFPSCount = 0;
    }
    
    requestAnimationFrame(checkFPS);
  }
  ```

- [ ] **Error Boundary com Auto-Reload**
  ```typescript
  class TVErrorBoundary extends React.Component {
    componentDidCatch(error: Error) {
      console.error('[TV Mode] Fatal error:', error);
      setTimeout(() => window.location.reload(), 3000);
    }
  }
  ```

---

## 📋 Plano de Implementação (Ordem de Prioridade)

### **Sprint 1: Fundação (Crítico - 2 dias)** ✅ CONCLUÍDO
1. ✅ Criar hook `useTVMode` para detectar ambiente
2. ✅ Implementar configuração TV_CONFIG
3. ✅ Adicionar auto-reload preventivo (6h)
4. ✅ Implementar Performance Monitor básico
5. ✅ Criar Error Boundary com auto-reload
6. ✅ Integrar hooks no App.tsx
7. ✅ Adicionar estilos CSS para TV Mode
8. ✅ Adicionar meta tags para TV

**Status**: ✅ Implementado e testado
**Data de Conclusão**: 2026-01-16
**Documentação**: Ver `SPRINT_1_COMPLETED.md`

### **Sprint 2: Renderização (Crítico - 3 dias)** 🔄 PRÓXIMO
5. ⚠️ Criar componente `CanvasMapChart` (substitui MapChart)
6. ⚠️ Simplificar TopoJSON do Brasil
7. ⚠️ Implementar zoom via CSS Transform
8. ⚠️ Remover Framer Motion, usar CSS animations

### **Sprint 3: Memória (Alto - 2 dias)**
9. 🔄 Implementar cache de imagens com limite
10. 🔄 Auditar e limpar todos os listeners
11. 🔄 Adicionar lazy loading de imagens
12. 🔄 Implementar Service Worker para cache offline

### **Sprint 4: UI/UX TV (Médio - 2 dias)**
13. 📱 Criar layout específico para TV
14. 📱 Aumentar tamanhos de fonte
15. 📱 Remover elementos interativos (hover, admin)
16. 📱 Simplificar glassmorphism

### **Sprint 5: Monitoramento (Médio - 1 dia)**
17. 📊 Implementar FPS Monitor
18. 📊 Adicionar Error Boundary com auto-reload
19. 📊 Criar dashboard de health (opcional)

---

## 🎯 Metas de Performance

| Métrica | Atual (Desktop) | Meta TV | Como Medir |
|---------|----------------|---------|------------|
| **FPS durante zoom** | 60fps | 30fps estáveis | Chrome DevTools Performance |
| **Memória inicial** | ~80MB | <50MB | `performance.memory.usedJSHeapSize` |
| **Memória após 6h** | ~200MB+ | <100MB | Monitor contínuo |
| **Tempo de carregamento** | 2s | <3s | Lighthouse |
| **Tamanho do bundle** | ~500KB | <200KB | `npm run build` |
| **Nós DOM** | ~3000 | <500 | DevTools Elements |

---

## 🔧 Configuração de Build para TV

```typescript
// vite.config.ts - TV Mode
export default defineConfig({
  build: {
    target: 'es2015', // Compatibilidade com TVs antigas
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single bundle para cache
      },
    },
  },
  optimizeDeps: {
    exclude: ['framer-motion'], // Remover se não usado
  },
});
```

---

## 🧪 Testes Essenciais

### Antes de Deploy
- [ ] Testar em navegador de TV real (Samsung Tizen, LG webOS)
- [ ] Executar por 12h contínuas e monitorar memória
- [ ] Simular conexão lenta (3G) e verificar cache offline
- [ ] Testar em resolução 1920x1080 e 4K
- [ ] Verificar legibilidade de textos a 3 metros de distância

### Ferramentas de Teste
```bash
# Simular TV no Chrome DevTools
# 1. F12 > Performance > CPU: 6x slowdown
# 2. Network: Slow 3G
# 3. Rendering > Paint flashing: ON

# Lighthouse CI para TV
lighthouse --preset=desktop --throttling.cpuSlowdownMultiplier=6
```

---

## 🚀 Checklist de Deploy

- [ ] Ativar modo TV automaticamente em user-agents de TV
- [ ] Configurar CDN para servir assets otimizados
- [ ] Habilitar compressão Brotli/Gzip no servidor
- [ ] Configurar headers de cache agressivos (1 ano para assets)
- [ ] Adicionar meta tag para fullscreen: `<meta name="mobile-web-app-capable" content="yes">`
- [ ] Desabilitar zoom do navegador: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`

---

## 📊 Monitoramento Pós-Deploy

### Métricas para Acompanhar
1. **Uptime**: Tempo sem crashes (meta: >99%)
2. **Memory Growth**: Taxa de crescimento de memória/hora (meta: <5MB/h)
3. **FPS Average**: Média de FPS durante 24h (meta: >25fps)
4. **Reload Frequency**: Quantos auto-reloads por dia (meta: 4x = a cada 6h)

### Logs Remotos (Opcional)
```typescript
// Enviar logs críticos para servidor
function logToServer(level: string, message: string) {
  if (level === 'error' || level === 'warn') {
    fetch('/api/tv-logs', {
      method: 'POST',
      body: JSON.stringify({ level, message, timestamp: Date.now() }),
    }).catch(() => {}); // Fail silently
  }
}
```

---

## 🎬 Resultado Esperado

Após implementação completa:
- ✅ **Execução estável 24/7** sem travamentos
- ✅ **Consumo de memória controlado** (<100MB mesmo após horas)
- ✅ **Animações fluidas** (30fps mínimo)
- ✅ **Carregamento rápido** (<3s)
- ✅ **Modo offline funcional** (continua rodando sem internet)
- ✅ **Auto-recuperação** de erros sem intervenção manual

---

**Status**: 🟡 Aguardando Implementação  
**Prioridade**: 🔴 CRÍTICA  
**Estimativa**: 10 dias de desenvolvimento  
**ROI**: Alto - Elimina necessidade de reiniciar TV manualmente
