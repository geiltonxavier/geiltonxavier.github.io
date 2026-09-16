---
title: Working is not the criterion
date: 2026-09-13T16:47:13.000Z
draft: false
description: A patch rejected on a coding platform and merged in rqlite. The
  platform measured if the task was hard, the maintainer measured if the patch
  was good.
tags:
  - ai
  - open-source
  - rqlite
  - software-engineering
translationKey: funciona-nao-e-o-criterio
---
I have a patch [merged in rqlite](https://github.com/rqlite/rqlite/pull/2779) and a rejected challenge on a coding platform, both with the same bugfix. Both verdicts are correct, and the difference between them is one question.

{{< rawhtml >}}

<article class="memory-note">  <figure>    <img src="/img/it-works-is-it-good.png" alt="It works versus is it good">  </figure></article>

{{< /rawhtml >}}

The platform asked if the problem was hard. The maintainer asked if the patch was good.

rqlite is an open-source distributed relational database built on SQLite and Raft. It is a real project, used in real systems, with a codebase that has accumulated years of engineering decisions. That context matters for what happened next.

{{< rawhtml >}}

<article class="memory-note">  <figure>    <img src="/img/rqlite.png" alt="rqlite GitHub repository">    <figcaption>      The rqlite repository on GitHub.    </figcaption>  </figure></article>

{{< /rawhtml >}}

Before going on, the obvious part: the analysis came from a coding agent, and the rqlite repository asks for that disclosure. What matters here is not who found the bug, but who judged the quality of what came out. That becomes clear at the end.



## The bug

rqlite is a distributed SQLite. Its `Dump` accepts a table filter, and the filtered dump does not load into an empty database:

```bash
curl -G 'localhost:4001/db/backup?fmt=sql&tables=t1'

$ sqlite3 new.db < dump.sql
Parse error near line 6: no such table: main.t2
```

Asking only for `t1`, the dump brings the index and the trigger of the other tables as well. The reason is written in the code itself:

```go
// For indexes, triggers, and views, we could add more sophisticated filtering
// based on the table they relate to, but for now include all of them
```

A real bug, reproducible, with the location pointed out by the code comment itself. Keep that last part in mind, because it is what brought me down.

## Why it was rejected

On the platform you deliver the tests and the problem description, and coding agents try to solve it. The difficulty is the pass rate: less than half of the attempts may solve it.

Three attempts, three solved it.

I looked at "real bug" and read "hard problem". I was wrong. A real bug is not a hard problem. If the location of the fix is signposted in the code and there is no design decision to make, it is an easy task, no matter how annoying the effect in production is.

Difficulty is not declared, it is measured. And the meter is the run, which costs. That is the frustrating part: there is no way to know before spending.

## Why it was merged

If a well specified bugfix is bad for measuring agent difficulty, it is good for the project. I opened an issue in rqlite with the reproduction, the maintainer answered "Good catch" and asked for a PR with indexes and triggers only, leaving views for a separate conversation.

Then started the part that taught me the most, and notice something: at no point did he say my code was wrong. The tests were passing, the dump was loading, the behaviour was what he had asked for.

The whole review was about quality.

First: do not create a new file for the code. It was around 80 lines in a `dump_schema.go`, and in his words "I see Agents do it all the time". He was right. Eight lines of logic do not become a module just because they fit in a file, and an invented boundary inside a package is exactly what makes a maintainer suspicious of a patch written by an agent.

Then, in a test I wrote: "Surely this test was already present effectively." Right again. There was already a `Test_DB_Dump` doing a full dump round trip. Its fixture just had no index, trigger or view, so the only case worth adding was that one. A test that repeats existing coverage protects nothing, it only takes space.

And the third one changed the design: if you created a type, then use the type system. The filtering is not a database operation, it is a rule about a collection of objects. So the collection gets a name and the rule gets a method:

```go
type schemaObjects []schemaObject

func (s schemaObjects) Filter(tables []string) schemaObjects {
	// an index or trigger is kept when its table is selected,
	// a view is always kept
}
```

Reading that three times, I understood what he was saying. With `Filter` as a method, the rule becomes pure, testable without opening any database, and the decision "a view is always kept" lives in one place, with the limitation documented on `Dump`. Before that, every check of that rule needed a database, a dump and a load into another one.

My diff shrank on every round: from 237 inserted lines to 193, and from 3 database tests to 1 pure test plus 1 integration test.

## Working is the floor

Here is the part I wanted to write since the beginning, and it applies to anyone using agents every day.

A green test is not quality, it is the floor. An agent reaches the floor fast, and it does it well: my code was passing everything, the dump was loading, nothing broke. What it does not deliver on its own is the judgement about what came out. Whether the new file should exist, whether the new test says something the old one did not say, whether that logic lives in the right place. That comes from someone reading the diff and asking if it is good.

Notice the alignment: the platform measured if the task was hard, the maintainer measured if the patch was good. Neither asked if it works, because that was the minimum. In my case "it works" was solved from the first version, and it was quality that took four rounds.

Whoever uses an agent and only checks the green is outsourcing the question that matters. It is yours.

The patch went into rqlite with 2 files and 193 lines, and there is a line in the [CHANGELOG of v10.3.3](https://github.com/rqlite/rqlite/blob/master/CHANGELOG.md#v1033-september-13th-2026) with my name. But what I really took from it was the question I was not asking: this works, ok. And is this good?

Well, that is it.
