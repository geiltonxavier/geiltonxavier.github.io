---
title: If You Started Coding After the AI Boom, Read the 12-Factor App
date: 2026-08-27T12:08:00Z
draft: false
---
I didn't write this for experienced software engineers.

If you've spent years building and running production systems, you probably already know the [**12-Factor App**](https://12factor.net/). Maybe you don't remember all twelve factors by number, but most of the ideas will be familiar.

This post is for people who started coding more recently, especially after ChatGPT, GitHub Copilot, Claude, Codex and similar tools made it ridiculously easy to generate working code.

I love these tools. I use them a lot. They made creating software much easier, but understanding why a production system is built in a certain way is still something we have to learn.

There is another side to this that I think we are still learning. AI gives us leverage, and leverage works in both directions. If you understand the fundamentals, AI can multiply what you are able to build. If you don't, it can also help you produce a much larger amount of bad decisions in a very short time.

A junior developer used to be able to write a few hundred questionable lines of code in an afternoon. Now the same person can generate an API, a worker, Terraform, Docker, CI/CD, queues and Kubernetes manifests before lunch. The problem is not that AI always generates bad code. The problem is that it can scale whatever engineering judgement you bring to it, good or bad.

## Making something work is surprisingly easy now

You can ask an LLM to create an API in Python with PostgreSQL, Redis, Docker and authentication. A few minutes later, something is running. That is honestly amazing.

Then the questions begin.

Where should the database password live? What happens when you deploy the application three times? Can you run five instances of it? What happens to the local files when one container disappears? Can you replace PostgreSQL without changing half of the application?

And there are more. What happens when the process receives a shutdown signal? Where do the logs go? Why does production behave differently from your laptop? How do you reproduce the exact version that is running right now?

At this point, generating more code is no longer the difficult part. You are dealing with engineering, and this is why I think people starting in software today should read about the 12-Factor App.

## The funny part is that this thing is old

The [12-Factor App](https://12factor.net/) existed long before the current AI boom. It came before AI agents generating entire applications and before "vibe coding" became a thing.

Still, the problems it tries to prevent feel very current. AI helps us create things fast, and working fast makes it easy to accumulate decisions we never stopped to think about.

The application works. Great. But the configuration is hardcoded. Secrets are sitting in configuration files. Dependencies are implicit. Development and production barely look like the same system. Important state lives on the local disk. Logs go into random files. Deployment means copying something somewhere and restarting it. Background processes do not shut down correctly.

None of this looks too serious on the first day. Months later, someone asks why the application is so painful to operate. The answer usually started much earlier.

## 1. Codebase: one codebase, many deployments

The first factor sounds almost boring: one codebase tracked in version control, with many deployments.

Development, QA and production should be deployments of the same application. They should not slowly become three different applications that happen to share some files.

This is worth saying when AI is generating the code because it is very easy to end up with `app-final.py`, `app-final-v2.py`, `app-prod.py`, `app-prod-working.py` and `app-prod-working-final.py`.

Please don't do that. Git exists for a reason. The codebase represents the application. The environment tells you where that application is running. Those are separate concerns.

## 2. Dependencies: be explicit

Does the application depend on something? Declare it.

Do not assume the machine already has a library installed. Do not assume a package will magically be there. And do not build a deployment around some random binary that somebody installed manually on the server six months ago.

When I clone a repository, I should be able to see what the application needs. That may be in `requirements.txt`, `pyproject.toml`, `package.json`, `go.mod` or `.csproj`. Use whatever makes sense for the ecosystem, but do not leave dependencies inside someone's head or laptop.

It sounds obvious until you inherit an application whose deployment documentation says, "install these three packages manually on the server."

## 3. Config: stop putting secrets in code

This may be the most important factor for people generating applications with AI.

Configuration belongs in the environment. Values such as `DATABASE_URL`, `API_KEY`, `SERVICE_ENDPOINT` and `CLIENT_ID` should not force you to change the source code for each environment. Dev may use one database, QA another and production another. The application is still the same.

Also, `password = "SuperSecret123"` is not configuration management. It is a future incident.

AI often generates examples like this because hardcoded values make a demo easier to understand. Our job is to remember that a demo and a production system have different requirements.

## 4. Backing services: databases are resources

A database, cache, message queue, object storage, email provider or search engine is a backing service. The application should treat it as an attached resource.

Suppose the application uses PostgreSQL and tomorrow I give you another PostgreSQL instance with a different connection string. Ideally, you change the resource instead of rewriting the application.

This happens all the time on cloud platforms. Databases and Redis instances are replaced. Storage accounts, queues and endpoints change. The application should not have an existential crisis every time one of them does.

## 5. Build, release, run: these are different things

This factor is easy to ignore while deployment is simple. Once deployment becomes painful, it suddenly makes a lot more sense.

Building the software is one step. Creating a release is another. Running that release is another. When everything is mixed together, deployment turns into magic, and magic stops being fun when production breaks.

A healthy pipeline has a traceable flow. Code becomes a build, the build becomes an artifact, the artifact becomes a release, and the release runs.

What matters here is reproducibility. If version 1.4.2 is running in production, I want to know exactly what version 1.4.2 contains. I do not want the answer to be, "I think João changed something directly on the server Tuesday." That sentence should terrify you.

## 6. Processes: assume your application can disappear

Application processes should be stateless. Important information should not depend on the local memory or filesystem of one specific process surviving forever.

A request may arrive at instance A. The next one may go to instance C. Instance B may disappear completely, and a new instance D may show up.

That is normal with containers, Kubernetes, serverless platforms and autoscaling. Important state belongs in something built to hold state, such as a database, cache, storage service or another external resource.

Your process is temporary. Design it with that in mind.

## 7. Port binding

Traditionally, port binding means the application exposes its service through a port, for example `http://localhost:8080`.

The implementation may look different with containers, Kubernetes, Azure Functions, AWS Lambda or another platform. The useful mental model is still the same: the application has a clear interface with the world around it and does not need mysterious configuration inside a giant application server just to exist.

## 8. Concurrency: scale by adding processes

Imagine the API is overloaded and you want to turn one instance into five. That is horizontal scaling.

It works much better when the earlier factors are already in place. If the application depends heavily on local state, adding instances becomes complicated very quickly. If the processes are independent, scaling is much easier.

These architecture principles are connected. One factor often makes the next one possible.

## 9. Disposability: start and die gracefully

Cloud applications die. Containers die. Virtual machines restart. Deployments replace processes, autoscaling removes instances and networks fail. This is normal.

The application should start quickly and shut down properly. When a process receives a shutdown signal, it should finish whatever can be finished safely, stop accepting new work and exit cleanly.

The alternative is a process still trying to handle 400 messages while Kubernetes wants it dead. Graceful shutdown matters a lot when you work with queues, background jobs and distributed systems.

## 10. Dev/prod parity

One of the oldest jokes in software is still, "it works on my machine."

Development, staging and production will never be completely identical. But the bigger the gap between them, the more surprises you create.

If development uses SQLite, QA uses PostgreSQL 15 and production uses an ancient PostgreSQL instance that nobody wants to touch, you are asking for interesting evenings.

Keep the environments conceptually close. Containers helped with this. Infrastructure as code helped too, as did CI/CD. The principle is older than all of them.

## 11. Logs: streams of events

Please do not design the application's logging around a file called `C:\MyApp\logs\production-final-2.txt`.

The application produces events. Another system can collect them, whether that is Application Insights, CloudWatch, Datadog, Grafana Loki, Splunk, ELK or something else that fits the environment.

The application does not need to know where someone will search the logs later. It needs to produce useful, structured information and let the platform handle collection and storage.

This becomes especially important when you have several instances. Connecting through SSH to five containers and hunting for a text file is not observability. It is archaeology.

## 12. Admin processes

Sometimes you need to run a task once: a database migration, data repair, user import, cleanup, reindexing job or backfill.

These administrative tasks should use the same code, configuration and environment assumptions as the application. They should not depend on a mysterious script sitting on someone's desktop called `fix-production-real-final-v3.py`.

I have seen enough versions of this pattern to know how it ends. Nobody deletes the script. Nobody understands the script. Somehow, the company depends on it. Usually, everyone is afraid to touch it.

## Why should someone starting today care about this?

AI made code much faster and cheaper to produce. It did not stop databases from failing, networks from failing or processes from crashing.

Deployments still need to be reproducible. Credentials still leak. Applications still need to scale. Logs still need to be searchable. Configuration still changes between environments. Distributed systems are still distributed systems.

An LLM can generate a controller, service, repository, Dockerfile, Terraform, pipeline, database, queue and cache in a ridiculously short amount of time. That is useful, but those files are only the beginning. You still need to understand why the system has that structure.

This is where old, foundational material becomes useful again.

## What I would add if this was written today

I would not try to turn the 12-Factor App into a 17-Factor App. The original list is useful partly because it is small and easy to remember. But there are a few things I would put next to it if I were explaining production systems to someone starting today.

### Observability is more than logs

Logs are only one part of observability. In production, you will usually also care about metrics and traces. A request may cross an API, a queue, three services and a database before it fails. A log entry from one process may not tell you the whole story.

This is where correlation IDs, distributed tracing and metrics start becoming useful.

### Idempotency

This one becomes very important as soon as queues, retries and distributed systems enter the picture.

If a message is delivered twice, does your system create two users? Charge someone twice? Send the same email five times? Networks time out. Queues redeliver messages. Clients retry requests after the server may already have completed them.

Designing operations so they can safely happen more than once saves a lot of pain.

### Identity and secrets

Moving a password out of source code and into an environment variable is better, but it is not the end of the security discussion.

When the platform supports it, prefer things such as managed identities, workload identities, short-lived credentials and secret stores. A `.env` file is useful. It is not the final form of security.

### Infrastructure should be reproducible too

If the application is perfectly versioned but production depends on somebody clicking through twenty screens in a cloud portal, part of the system still exists only in someone's head.

Tools such as Terraform, Bicep and CloudFormation bring the same idea of reproducibility to infrastructure. I want to know not only which application version is running, but also how the environment around it was created.

### Partial failure is normal

Distributed systems also force you to accept that failure is not always binary. The API may be healthy while Redis is down. The database may be healthy while the network between the application and the database is not. A dependency may be responding, just much more slowly than usual.

Timeouts, retries, backoff and circuit breakers make much more sense once you accept that parts of a system can fail independently.

None of these ideas make the original twelve factors obsolete. If anything, they sit naturally next to them.

## Don't treat the 12 factors like religion

The 12-Factor App is not a checklist from God.

Technology changed. Containers became mainstream. Kubernetes happened. Serverless happened. Managed cloud services exploded, and platform engineering became a discipline. Some factors need a modern interpretation, which is fine.

The useful part is the instinct behind the list. A hardcoded password should make you uncomfortable. So should manual changes in production, critical state stored locally, completely different dependencies in each environment, or a scaling plan that requires rewriting half the system.

That instinct is worth much more than memorizing twelve definitions.

## AI can write the code. You still need to understand the system

AI coding tools are incredible. Use them. I do. Just do not hand your engineering judgement over to them.

Ask AI to generate Dockerfiles, write Terraform, create APIs, refactor code and build pipelines. Then look at what it generated and ask a few uncomfortable questions.

Why is this here? Where does the configuration live? Where does the state live? What happens if this process dies? Can I run ten instances? Can I reproduce this deployment? Can I replace this dependency? Can I understand what happened in production?

Being able to answer those questions means you understand more than the generated files. You are starting to understand the system.

For someone who started coding during the AI boom, the 12-Factor App is still one of the simplest places to begin building that mindset.

Read it. It is short. You will probably spend the rest of your career rediscovering why those boring little principles matter.
