---
  title: "Construindo uma Fila Distribuída em Go"
  date: 2025-12-05
  draft: true
  tags: ["go", "concorrencia", "distributed-systems", "filas", "workers", "engenharia"]
  categories: ["Engenharia", "Estudos"]
  description: "Um projeto de estudo em Go para filas e workers concorrentes, conduzido
  com as mesmas preocupações que eu teria em produção."
  slug: "fila-distribuida-go-estudo"
  readTime: true
---

 ## Repo

  - Código: https://github.com/geiltonxavier/distributed-queue

  ## Por que esse projeto

  Quis demonstrar senioridade sem precisar de um produto completo: pegar um problema
  simples (fila de tarefas + workers concorrentes) e tratá-lo com disciplina de
  engenharia — cancelamento, backpressure, testes, roadmap explícito, e clareza de trade-
  offs. É estudo, não produção, mas com as mesmas perguntas que faço em sistemas reais.

  ## Escopo atual

  - Broker em memória (channel bufferizado) com Enqueue, Dequeue, Close, respeitando
    context.
  - Worker pool fixo com Start/Stop, cancelamento e shutdown limpo.
  - Demo CLI (cmd/demo) que instancia broker, pool, publica tarefas e loga tempos de
    processamento.
  - Testes cobrindo fila (cancelamento/fechamento) e pool (processamento/parada). Uso de
    cache local para rodar go test em ambientes restritos.

  ## Decisões de engenharia

  - Cancelamento/shutdown: tudo passa context.Context; Stop espera handlers terminarem.
  - Backpressure: capacidade do broker configurável; Enqueue bloqueia e respeita
    contexto.
  - Simplicidade intencional: channel como broker para focar no fluxo; API permite trocar
    por backend real depois.
  - Testabilidade: funções pequenas, dependências injetadas (handler, broker), testes
    isolando casos de falha.

  ## Como rodar

  GOCACHE=$(pwd)/.cache/go-build go test ./...
  WORKERS=3 TASKS=10 go run ./cmd/demo

  Env vars:

  - WORKERS: número de workers (default 3)
  - TASKS: quantidade de tarefas a publicar (default 10)

  ## Roadmap de melhoria (o que faria para produção)

  - Retentativas com backoff, DLQ e limites de tentativas por tarefa.
  - Logs estruturados (campos para task_id, tentativa, duração) e correlação via context.
  - Métricas: contadores/latências, expor /metrics para Prometheus.
  - Timeouts por tarefa, limites de concorrência por tipo, idempotência no handler.
  - Simulação de falhas e testes de tolerância; rodar -race e benchmarks no CI.
  - CLI melhor (ex.: publish/run com cobra), Dockerfile/docker-compose para demo e stub
    de broker externo.

  ## O que eu quis mostrar de senioridade

  - Clareza e incrementalismo: commits pequenos, mensagens descritivas, README focado
    no essencial.
  - Preocupação com operação: shutdown limpo, backpressure, espaço para observabilidade
    e métricas.
  - Testes desde cedo: mesmo em demo, cobrir cancelamento e fechamento evita classes de
    bugs comuns.
  - Transparência de riscos: checklist explícito do que falta para produção.

  ## Reflexão pessoal

  Projetos de estudo costumam ser “happy path”. Aqui escolhi trazer o olhar de produção
  para algo simples, porque é assim que trabalho no dia a dia: começo pequeno, valido,
  testo, deixo claro o que ficou de fora e como eu evoluiria. Isso mostra mais sobre meu
  processo do que um repositório enorme sem direção.
