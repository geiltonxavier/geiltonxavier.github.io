---
date: '2026-03-31T18:41:48Z'
draft: false
title: 'System Design não tem resposta certa. Poucos tratam assim.'
---

*Uma reflexão sobre ambiguidade, critério invisível e o que a gente realmente avalia numa entrevista.*

---

Já participei de entrevistas de system design dos dois lados, como candidato e como entrevistador. E o padrão que mais se repete não é a dificuldade do problema. É que ninguém na sala sabe exatamente o que está sendo medido. O candidato não sabe. O entrevistador, na maioria das vezes, também não. Mesmo assim a conversa acontece como se existisse um destino certo a ser encontrado.

Não existe.

## A solução final depende de quem está na sala

System design opera num espaço de trade-offs. Consistência versus disponibilidade. Latência versus throughput. Complexidade operacional versus flexibilidade futura. A resposta certa depende do contexto, das restrições, do que você está disposto a sacrificar.

O problema é que essas restrições raramente são colocadas na mesa antes da entrevista começar. O entrevistador chega com o contexto do sistema que ele opera, as dores do time dele, as decisões que tomou recentemente. Sem perceber, ele usa isso como régua. Quando o candidato escolhe um caminho diferente, a pergunta interna deixa de ser "essa escolha é defensável?" e vira "ele teria feito o que nós fizemos?"

Isso é mais comum do que parece, e é um problema sério: o entrevistador acaba cobrando uma solução para um problema interno que o candidato nunca conheceu.

## Alto nível ou detalhe: os dois pedem tempos diferentes

Essa tensão quase nunca é resolvida antes de começar. Você vai alto nível ou vai fundo?

Alto nível demais parece superficial. Fundo demais não fecha o sistema e passa a impressão de que falta visão do todo. E 45 minutos não comportam os dois com profundidade real, por melhor que o candidato seja.

O sinal que cada caminho emite é diferente. Alto nível mostra visão arquitetural, capacidade de abstração. Detalhe mostra profundidade técnica, consciência das peças. Nenhum é mais correto, são dimensões diferentes, e o entrevistador quase nunca diz qual delas quer ver.

A estratégia que funciona melhor na prática é começar alto nível e deixar o entrevistador puxar para onde ele tem interesse. Isso economiza tempo em pontos que não serão avaliados e revela onde estão os critérios reais. O limite dessa estratégia é que ela depende de um entrevistador engajado. Se ele é passivo, o candidato navega sem nenhuma referência.

## O contexto que o entrevistador não consegue deixar de lado

É difícil ser genérico quando se vive dentro de um sistema específico. É difícil avaliar se um candidato raciocina bem sobre trade-offs quando você tem na memória como aquele trade-off específico explodiu em produção às 3 da manhã.

O resultado é que o entrevistador cobra uma tecnologia não porque seja a melhor escolha para o problema proposto, mas porque é a que o time dele usa. Penaliza uma decisão razoável porque ela esbarra numa cicatriz que ele carrega. Não é má-fé, é viés de contexto: o conhecimento que ele tem é real, mas ele opera como se fosse universal, e não é. Vale reconhecer isso antes de entrar na sala, dos dois lados da mesa.

## O que seria justo

Se o problema é ambiguidade de critério e de tempo, a solução não é filosófica, é contratual. Antes de começar, as duas partes precisam alinhar o que vai acontecer nos próximos 60 minutos.

Para quem entrevista:

Diga explicitamente qual dimensão quer explorar: disponibilidade, escalabilidade, consistência, custo, o que for. Diga se prefere amplitude ou profundidade. Se existe uma restrição de contexto que importa para a vaga, coloque isso na mesa antes, não depois. E divida o tempo em blocos: 10 minutos para o candidato entender o problema e fazer perguntas, 30 minutos para o design em si, 20 minutos para aprofundar onde há interesse real.

Para quem é entrevistado:

Pergunte antes de desenhar qualquer coisa. Qual nível de detalhe é esperado? Quais dimensões importam mais? Isso não é fraqueza, é o comportamento de um engenheiro sênior diante de um problema mal definido. Se o entrevistador não souber responder, isso já diz algo sobre como aquele time toma decisões.

Sem esse contrato mínimo, o que se avalia não é quem pensa melhor, é quem adivinha melhor o que a outra pessoa tinha em mente.

O formato atual funciona quando as duas partes são explícitas sobre o que querem. O problema é que quase ninguém é. E o que deveria ser uma conversa técnica vira um jogo de adivinhação com critério invisível.

---

## Se você ainda está construindo a base

Tudo que discuti aqui pressupõe que você já tem vocabulário técnico para raciocinar sobre trade-offs. Se ainda está nessa fase, não tem atalho: você precisa construir referência antes de conseguir navegar a ambiguidade.

Dois recursos que eu indicaria para quem está nesse caminho:

- [System Design Workbook, Edição 2026 - Matheus Fidelis](https://leanpub.com/system-design-workbook-2026) - em português, direto ao ponto, com foco em trade-offs reais de produção. É o tipo de livro que você lê e sente que alguém já passou pelo problema antes de escrever.
- [Playlist: System Design na prática](https://www.youtube.com/watch?v=fhdPyoO6aXI&list=PL5q3E8eRUieWtYLmRU3z94-vGRcwKr9tM) - casos concretos que tornam os conceitos mais tangíveis do que qualquer definição teórica. Bom ponto de partida antes de encarar uma entrevista de verdade.