---
date: '2026-03-31T18:41:48Z'
draft: false
title: 'System Design não tem resposta certa. E ninguém assume isso.'
---

*Uma reflexão sobre ambiguidade, critério invisível e o que a gente realmente avalia numa entrevista.*

---

Já participei de entrevistas de system design dos dois lados. E o que me incomoda não é a dificuldade, é que ninguém na sala sabe exatamente o que está sendo medido. O candidato não sabe. O entrevistador, na maioria das vezes, também não. E mesmo assim a conversa acontece como se existisse um destino certo.

Não existe.

## A solução final depende de quem está na sala

System design opera num espaço de trade-offs. Consistência versus disponibilidade. Latência versus throughput. Complexidade operacional versus flexibilidade futura. A resposta certa depende do contexto, das restrições, do que você está disposto a sacrificar.

O problema é que essas restrições raramente são colocadas na mesa antes da entrevista começar. O entrevistador chega com o contexto do sistema que ele opera, as dores do time dele, as decisões que tomou recentemente. Sem perceber, ele usa isso como régua. Quando o candidato escolhe um caminho diferente, a avaliação interna não é "essa escolha é defensável?" mas "ele teria feito o que nós fizemos?"

Isso é mais comum do que parece. E é um problema sério, porque o entrevistador está cobrando uma solução para um problema interno que o candidato nunca conheceu.

## Alto nível ou detalhe: os dois demandam tempos diferentes

Essa tensão nunca é resolvida antes de começar. Você vai alto nível ou vai fundo?

Se vai alto demais, parece superficial. Se vai fundo demais, não fecha o sistema e parece que não enxerga o todo. E 45 minutos não comporta os dois com profundidade real, não importa o quanto você seja bom.

O sinal que cada caminho emite é diferente. Alto nível mostra visão arquitetural, capacidade de abstração. Detalhe mostra profundidade técnica, consciência das peças. Nenhum é mais correto. São dimensões diferentes, e o entrevistador quase nunca diz qual ele quer ver.

A estratégia que funciona melhor na prática: começa alto nível, deixa o entrevistador puxar para onde ele tem interesse. Você economiza tempo onde ele não vai avaliar e descobre onde estão os critérios reais. O problema é que isso depende de um entrevistador engajado. Se ele é passivo, você navega sem referência nenhuma.

## O entrevistador que não consegue sair do próprio contexto

É difícil ser genérico quando você vive dentro de um sistema específico. É difícil avaliar "esse candidato raciocina bem sobre trade-offs" quando você tem na memória como aquele trade-off específico explodiu em produção às 3 da manhã.

Então o entrevistador cobra uma tecnologia não porque seja a melhor escolha no problema proposto, mas porque é a que o time usa. Penaliza uma decisão perfeitamente razoável porque vai contra uma cicatriz que ele carrega. Isso não é maldade, é viés situado. O conhecimento que ele tem é real, mas ele opera como se fosse universal, e não é.

## O que eu acho que seria justo

Se o problema é ambiguidade de critério e tempo, a solução não é filosófica, é contratual. Antes de começar, as duas partes precisam alinhar o que vai acontecer nos próximos 60 minutos.

Minha proposta, para quem entrevista:

Diga explicitamente qual dimensão você quer explorar: disponibilidade, escalabilidade, consistência, custo, o que for. Diga se prefere amplitude ou profundidade. Se tiver uma restrição de contexto que importa para a vaga, coloque na mesa antes, não depois. E separe o tempo em blocos: 10 minutos para o candidato entender o problema e fazer perguntas, 30 minutos para o design em si, 20 minutos para você aprofundar onde tem interesse real. Sem esse contrato mínimo, você está avaliando quem adivinha melhor, não quem pensa melhor.

Para quem é entrevistado:

Pergunte antes de desenhar qualquer coisa. Qual nível de detalhe é esperado? Quais dimensões importam mais? Essa não é fraqueza, é o comportamento exato de um engenheiro sênior diante de um problema mal definido. Se o entrevistador não souber responder, você já aprendeu algo importante sobre como aquele time toma decisões.

O formato atual funciona quando as duas partes são explícitas sobre o que querem. O problema é que quase ninguém é. E aí o que deveria ser uma conversa técnica vira um jogo de adivinhação com critério invisível.

Isso dá pra mudar. Basta alguém começar.

---

## Se você ainda está construindo a base

Tudo que discuti aqui pressupõe que você já tem vocabulário técnico para raciocinar sobre trade-offs. Se ainda está nessa fase, não tem atalho: você precisa construir referência antes de conseguir navegar a ambiguidade.

Dois recursos que eu indicaria para quem está nesse caminho:

- [System Design Workbook, Edição 2026 - Matheus Fidelis](https://leanpub.com/system-design-workbook-2026) - em português, direto ao ponto, com foco em trade-offs reais de produção. É o tipo de livro que você lê e sente que alguém já passou pelo problema antes de escrever.
- [Playlist: System Design na prática](https://www.youtube.com/watch?v=fhdPyoO6aXI&list=PL5q3E8eRUieWtYLmRU3z94-vGRcwKr9tM) - casos concretos que tornam os conceitos mais tangíveis do que qualquer definição teórica. Bom ponto de partida antes de encarar uma entrevista de verdade.
