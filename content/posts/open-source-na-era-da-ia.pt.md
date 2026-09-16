---
date: '2026-09-13T16:47:13Z'
draft: false
title: 'Open source na era da IA'
description: 'Contribuir com open source quando agentes escrevem patch. Um bugfix reprovado como fácil demais para treino de IA e mergeado por um mantenedor que julgou qualidade.'
aliases:
  - /pt/posts/funciona-nao-e-o-criterio/
tags: ['ai', 'open-source', 'rqlite', 'engenharia-de-software']
translationKey: 'funciona-nao-e-o-criterio'
---

Faz anos que contribuo para projetos open source. Uma dessas contribuições, de muito tempo atrás, acabou chamando atenção do pessoal da shipd.ai e virou um convite para colaborar num projeto ligado a modelos de linguagem: avaliar a complexidade de tarefas reais de código.

O critério ali não é código certo ou errado, é complexidade. A tarefa só vale se desafiar de verdade um agente de IA, e isso vai muito além de achar um bug.

Foi assim que saí olhando projetos relevantes no GitHub atrás de uma tarefa difícil o bastante para ensinar algo novo a um modelo. E foi assim que cheguei no rqlite.

## O que é o rqlite

O [rqlite](https://github.com/rqlite/rqlite) é o SQLite em versão distribuída. O mesmo SQL que você já conhece, replicado entre nós com consenso Raft, então dá para ter um relacional tolerante a falhas sem operar um bancão. Tem mais de 17 mil estrelas no GitHub e é usado onde o pessoal quer a semântica do SQLite com clustering e alta disponibilidade.

Achei um bug real lá, abri o patch, e aqui a história muda de direção. A minha intenção era aprovar uma tarefa válida no processo da shipd.ai, mas é um processo complicado: para valer no treinamento de LLM, o modelo precisa não conseguir resolver o problema a cada tentativa. Se ela resolve o mesmo problema que eu resolvi, significa que não estou ensinando nada de novo para a IA.

Bom, ainda não consegui passar na shipd.ai. Mas saí de lá com um patch mergeado no rqlite e um challenge reprovado na mesma plataforma, os dois com o mesmo bugfix. Os dois veredictos estão certos, e a diferença entre eles é uma pergunta só.

A plataforma perguntou se o problema era difícil. O mantenedor perguntou se o patch estava bom.

Antes de continuar, o óbvio: a análise saiu de um agente de código, e o repositório do rqlite pede essa declaração. A parte que interessa não é quem achou o bug, é quem julgou a qualidade do que saiu. Isso fica claro no final.

## O bug

O rqlite é um SQLite distribuído. O `Dump` dele aceita filtro de tabelas, e o dump filtrado não carrega num banco vazio:

```bash
curl -G 'localhost:4001/db/backup?fmt=sql&tables=t1'

$ sqlite3 new.db < dump.sql
Parse error near line 6: no such table: main.t2
```

Pedindo só a `t1`, o dump leva junto o índice e o trigger das outras tabelas. A causa está escrita no próprio código:

```go
// For indexes, triggers, and views, we could add more sophisticated filtering
// based on the table they relate to, but for now include all of them
```

Bug real, reproduzível, com a localização apontada pelo próprio comentário. Guarda essa última parte, porque é ela que me derrubou.

## Por que reprovou

Na plataforma, você entrega os testes e a descrição do problema, e agentes de código tentam resolver. A dificuldade é a taxa de acerto: menos da metade das tentativas pode resolver.

Três tentativas, três resolveram.

Eu olhei "bug real" e li "problema difícil". Errei. Bug real não é problema difícil. Se a localização do fix está sinalizada no código e não existe decisão de desenho para tomar, é tarefa fácil, por mais chato que seja o efeito em produção.

Dificuldade não se declara, se mede. E o medidor é a rodada, que custa. Essa é a parte frustrante: não tem como saber antes de gastar.

## Por que mergeou

Se um bugfix bem especificado é ruim para medir dificuldade de agente, ele é bom para o projeto. Abri uma issue no rqlite com o repro, o mantenedor respondeu "Good catch" e pediu um PR só com índices e triggers, deixando views para uma conversa separada.

Aí começou a parte que me ensinou mais, e repara numa coisa: em nenhum momento ele disse que o meu código estava errado. Os testes passavam, o dump carregava, o comportamento era o que ele tinha pedido.

A revisão inteira foi sobre qualidade.

Primeiro: não criar arquivo novo para o código. Eram umas 80 linhas num `dump_schema.go`, e nas palavras dele "I see Agents do it all the time". Estava certo. Oito linhas de lógica não viram módulo só porque cabem num arquivo, e fronteira inventada num pacote é exatamente o que faz um mantenedor desconfiar de patch feito por agente.

Depois, num teste que eu escrevi: "Surely this test was already present effectively." Também certo. Já existia um `Test_DB_Dump` fazendo round trip de dump completo. O fixture dele só não tinha índice, trigger nem view, então o único caso que valia adicionar era esse. Um teste que repete cobertura existente não protege nada, só ocupa espaço.

E o terceiro mudou o desenho: se eu criei um tipo, use o sistema de tipos. A filtragem não é uma operação de banco, é uma regra sobre uma coleção de objetos. Então a coleção ganha nome e a regra ganha método:

```go
type schemaObjects []schemaObject

func (s schemaObjects) Filter(tables []string) schemaObjects {
	// índice ou trigger entra se a tabela dele está na seleção,
	// view entra sempre
}
```

Lendo isso três vezes, entendi o que ele estava dizendo. Com o `Filter` como método, a regra fica pura, testável sem abrir banco nenhum, e a decisão "view entra sempre" mora num lugar só, com a limitação documentada no `Dump`. Antes disso, toda verificação dessa regra exigia subir banco, dar dump e carregar em outro.

O meu diff encolheu a cada rodada: de 237 linhas de inserção para 193, e de 3 testes de banco para 1 puro mais 1 de integração.

## Teste verde não é qualidade

Aqui está a parte que eu queria escrever desde o começo, e que vale para qualquer um que use agente no dia a dia.

Teste verde não é qualidade, é só o começo. Um agente chega lá rápido, e chega bem: o meu código passava em tudo, o dump carregava, nada quebrou. O que ele não entrega sozinho é o julgamento sobre o que saiu. Se o arquivo novo deveria existir, se o teste novo diz algo que o antigo não dizia, se aquela lógica mora no lugar certo. Isso sai de alguém lendo o diff e perguntando se está bom.

Repara no alinhamento: a plataforma mediu se a tarefa era difícil, o mantenedor mediu se o patch estava bom. Nenhum dos dois perguntou se funciona, porque isso era o mínimo. No meu caso o "funciona" estava resolvido desde a primeira versão, e foi a qualidade que precisou de quatro rodadas.

Quem usa agente e só confere o verde está terceirizando a pergunta que importa. Ela é sua.

O patch entrou no rqlite com 2 arquivos e 193 linhas, e ficou uma linha no CHANGELOG da v10.3.3 com o meu nome. Mas o que eu levei de verdade foi a pergunta que eu não estava fazendo: isso funciona, ok. E isso está bom?

Bom pessoal, é isso.
