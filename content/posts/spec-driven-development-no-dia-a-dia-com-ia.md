---
date: '2026-03-26T23:01:14Z'
draft: false
title: 'Spec-driven development no dia a dia com IA'
---

Nos últimos meses tenho incorporado inteligência artificial no meu fluxo de trabalho de desenvolvimento. Não no sentido de "delegar tudo pra IA e ver o que sai", mas de usar como ferramenta dentro de um processo que já funciona.

E o que ficou claro pra mim é que o ganho de produtividade não vem da IA em si. Vem de como você usa.

Eu tenho muitos anos de desenvolvimento antes dessa onda toda de IA. Passei por problemas reais em produção, lidei com código ruim, aprendi da forma difícil o que funciona e o que não funciona. Hoje, quando olho para um código gerado por IA, eu não aceito na primeira leitura. Eu avalio. Questiono. Comparo com padrões que já tenho internalizados. Esse repertório é o que faz a diferença.

![Fluxo de trabalho: pensar, especificar, implementar](/img/sdd.png)

O que tem funcionado pra mim é trabalhar orientado por especificação antes de qualquer linha de código. Antes de abrir o editor, eu paro e penso no problema. Quais são as regras? Quais os cenários? Quais as limitações? Isso nem sempre vira documento formal, mas precisa estar claro na minha cabeça.

Quando essa parte está resolvida, a IA entra como suporte à execução, não como tomadora de decisão.

Todo código que eu produzo, com ou sem IA, segue algumas premissas que pra mim não são negociáveis: segurança, simplicidade, baixo acoplamento, extensibilidade, reutilização. Quando a complexidade precisa existir, ela precisa estar controlada. Essas coisas não vêm da IA. Vêm de anos trabalhando com engenharia de software.

Isso ficou bem claro numa situação no meu próprio time.

Eu tinha uma tarefa que envolvia criar Azure Functions em C#. Passei para um developer que já tinha boa base técnica — não era júnior, eu diria mid-level — mas sem experiência com C# e com a stack em questão.

Dei uma direção inicial sobre arquitetura, falei sobre organização, responsabilidades. E aí cometi um erro que hoje reconheço como ingênuo: achei que, com ajuda da IA, ele conseguiria chegar num resultado de qualidade mesmo sem experiência na stack.

Depois de uma semana, o código existia. Mas não tinha estrutura. Não tinha consistência. As decisões não se sustentavam. Era o tipo de coisa que funciona em cenário simples, mas não aguenta evolução.

Ficou evidente: a IA não resolve falta de experiência. Ela ajuda a produzir alguma coisa, mas não garante que essa coisa seja bem feita.

Esse é o ponto que eu acho mais importante. A IA é muito boa em gerar algo que parece correto. Parecer correto e ser bem feito são coisas diferentes. Se você não tem repertório para avaliar o output, você não consegue filtrar. O que acontece então é que você produz código rápido com baixa qualidade. No longo prazo, isso vira dívida técnica.

Olhando pra trás, eu faria diferente. Investiria mais tempo na especificação junto com essa pessoa. Garantiria que a base arquitetural estivesse muito clara antes de qualquer código. Faria checkpoints mais próximos no início. Deixaria explícito o que é esperado em termos de qualidade.

No meu dia a dia, o que funciona é exatamente isso: entender bem o problema, especificar antes de codar, usar a IA como apoio e revisar tudo com senso crítico.

A IA amplifica o que você já é como engenheiro. Se você tem base, ela te deixa mais rápido. Se não tem, ela só acelera o caminho errado.

A produtividade não vem de escrever código mais rápido. Vem de tomar decisões melhores desde o começo.
