# Backlog do Produto - Aceleraí Geographic Impact Hub

Este documento detalha o plano de desenvolvimento do Hub de Impacto Geográfico, dividido em fases evolutivas para transformar o protótipo atual em um ecossistema de dados automatizado.

---

## 🟢 FASE 1: Polimento e Estabilização (Atual)
*Foco em garantir que a experiência visual seja impecável e que o código esteja pronto para receber dados dinâmicos.*

### Épico 1.1: Excelência Visual e UX Cinematográfico
**O que poderá ser feito:**
O dashboard terá transições tão fluidas que parecerão um vídeo pré-renderizado, mantendo a interatividade de dados em tempo real.
**Como validar:**
- Observar a transição entre estados: o mapa deve se afastar totalmente antes de mergulhar no próximo.
- Verificar se a barra de progresso no card de campanha termina exatamente quando a transição começa.
- Garantir que os números do contador de alcance não "saltem", mas sim "corram" suavemente.

**Tarefas:**
- [x] Ajustar curvas de easing do zoom para evitar acelerações bruscas.
- [x] Implementar fade-out sincronizado da UI quando o zoom out inicia.
- [x] Validar o comportamento da barra de progresso em diferentes resoluções de tela.
- [x] Documentar as coordenadas (lat/long) ideais para cada um dos 27 estados em `constants.ts`.

### Épico 1.2: Gestão de Identidade Visual
**O que poderá ser feito:**
Qualquer membro da equipe poderá atualizar a marca do hub apenas trocando um arquivo de imagem, sem mexer no código-fonte.
**Como validar:**
- Colocar um arquivo `logo.png` na pasta `/public` e verificar se ele aparece no topo do dashboard com a proporção correta.
- Deletar o arquivo temporariamente e garantir que o dashboard não quebre (deve apenas esconder o espaço da logo).

**Tarefas:**
- [ ] Criar estrutura de pasta `/public` (Concluído).
- [ ] Substituir logo em texto por referência de imagem dinâmica (Concluído).
- [ ] Adicionar tratamento de erro (fallback) caso a imagem da logo falhe ao carregar.

---

## 🟡 FASE 2: Dinamização e Gestão Manual (Próximo Passo)
*Foco em remover os dados do código e levá-los para um banco de dados onde possam ser editados facilmente.*

### Épico 2.1: Integração com Banco de Dados (Supabase)
**O que poderá ser feito:**
As campanhas serão lidas de uma tabela online. Adicionar um novo cliente ou mudar um número de impacto não exigirá mais um "deploy" de código.
**Como validar:**
- Abrir o dashboard e confirmar que ele carrega as informações vindas da tabela do banco.
- Desconectar a internet e verificar se o sistema exibe uma mensagem amigável ou usa um "cache" local.

**Tarefas:**
- [x] Configurar projeto no Supabase (ou similar).
- [x] Criar a tabela `campaigns` com o schema definido na arquitetura técnica.
- [x] Criar um "Hook" no React (`useCampaigns`) para buscar dados via API.
- [x] Migrar os dados atuais do `constants.ts` para a tabela do banco.

### Épico 2.2: Painel de Manutenção Manual
**O que poderá ser feito:**
Você poderá alterar textos, trocar links de imagens e ajustar o nível de zoom de cada estado através de uma interface administrativa simples.
**Como validar:**
- Alterar a descrição de uma campanha no painel administrativo e ver a mudança refletida no dashboard após o próximo ciclo.
- Atualizar um "alcance estimado" e validar se o contador animado reflete o novo valor.

**Tarefas:**
- [ ] Configurar permissões de edição no banco de dados.
- [ ] Criar campo para upload de imagem no banco (associando a URLs do storage).
- [ ] Adicionar campos de controle de exibição (ex: checkbox "Ativo/Inativo").

---

## 🔵 FASE 3: Automação Total e Conectividade
*Foco em conectar o dashboard ao coração dos dados da Aceleraí, tornando-o 100% autônomo.*

### Épico 3.1: Sincronização em Tempo Real (Real-time)
**O que poderá ser feito:**
O dashboard atualizará os números de impacto instantaneamente assim que novos dados entrarem no sistema principal da empresa, sem necessidade de atualizar a página.
**Como validar:**
- Com o dashboard aberto em uma tela, inserir um dado no banco via API externa e observar o contador ou card mudar "ao vivo".

**Tarefas:**
- [ ] Implementar WebSockets ou Real-time Subscriptions do banco.
- [ ] Criar lógica de "Hot Swapping" (troca quente) de dados sem quebrar a animação em curso.

### Épico 3.2: Inteligência Geográfica Automatizada
**O que poderá ser feito:**
O hub identificará automaticamente quais regiões estão com maior atividade/impacto e priorizará essas campanhas no ciclo de exibição.
**Como validar:**
- Verificar se estados com métricas de impacto maiores aparecem com mais frequência ou em destaque no ciclo.

**Tarefas:**
- [ ] Criar algoritmo simples de ordenação por "Peso de Impacto".
- [ ] Integrar com APIs externas de dados geográficos para enriquecimento de informações.

---
**Legenda de Status:**
- 🟢 Concluído / Em progresso imediato
- 🟡 Planejado para o próximo ciclo
- 🔵 Visão de futuro / Longo prazo
