---
title: If You Started Coding After the AI Boom, Read the 12-Factor App
date: 2026-08-27T12:08:00Z
draft: false
---
I didn't write this for experienced software engineers. If you have spent years building and running production systems, you probably know the [12-Factor App](https://12factor.net/) already. Maybe you cannot list all twelve factors by heart, but the ideas will sound familiar.

This post is for people who started coding more recently, after tools like ChatGPT, GitHub Copilot, Claude and Codex made it ridiculously easy to generate code that works.

I like these tools and I use them every day. They made building software much faster. What they did not do is teach you why a production system is designed the way it is. That part you still have to learn on your own.

There is another side to this that we are still figuring out, I think. AI gives you leverage, and leverage amplifies whatever you bring to it. If you understand the fundamentals, it multiplies what you can build. If you do not, it helps you produce bad decisions much faster than you ever could on your own.

A junior developer used to be able to write a few hundred questionable lines of code in an afternoon. Today, the same person can get an API, a worker, Terraform files, Docker, CI/CD, queues and Kubernetes manifests before lunch. AI does not always generate bad code. It just scales whatever engineering judgment you bring to it. If that judgment is weak, the problems scale too.

## Making something work is surprisingly easy now

You can ask an LLM for an API in Python with PostgreSQL, Redis, Docker and authentication. A few minutes later, something is running. I still find that amazing, honestly.

Then the questions start. Where does the database password live? What happens when you deploy the application three times? Can you run five instances of it? What happens to the local files when one container disappears? Can you replace PostgreSQL without changing half of the application? And there is more where that came from: what happens when the process gets a shutdown signal, where do the logs go, why does production behave differently from your laptop, how do you reproduce the exact version that is running right now?

At that point, generating more code is not the hard part anymore. You are dealing with engineering, and that is why I think people starting today should read the 12-Factor App.

## The funny part is that this thing is old

The 12-Factor App was published in 2011, long before the AI boom. It is older than agents that generate entire applications and older than the term "vibe coding".

The problems it tries to prevent did not go anywhere, though. AI lets you build fast, and building fast is a great way to accumulate decisions you never stopped to think about.

The application runs. Great. The configuration is hardcoded, secrets sit in configuration files, dependencies are implicit, development and production barely look like the same system, important state lives on the local disk, logs go to random files, and deployment means copying something to a server and restarting it. Background processes do not shut down correctly either.

None of that looks serious on the first day. Months later, someone asks why the application is so painful to operate. The answer usually started much earlier, with a decision that looked harmless at the time.

## 1. Codebase: one codebase, many deployments

The first factor sounds almost boring. One codebase tracked in version control, many deployments.

Development, QA and production should be deployments of the same application. What often happens instead is the opposite: they slowly turn into three different applications that happen to share some files.

With AI in the picture, this is worth saying out loud. It is very easy to end up with `app-final.py`, `app-final-v2.py`, `app-prod.py`, `app-prod-working.py` and `app-prod-working-final.py`. I have seen files with names like that in real repositories, and I have probably created a few myself when I was starting out.

Please do not do that. Git exists for a reason. The codebase represents the application, the environment tells you where it is running, and those are separate concerns.

## 2. Dependencies: be explicit

Does your application depend on something? Declare it. Do not assume the machine already has a library installed. Do not assume a package will magically be there. And do not build a deployment around some binary that somebody installed manually on the server six months ago.

When I clone a repository, I want to see what the application needs. That can be `requirements.txt`, `pyproject.toml`, `package.json`, `go.mod` or `.csproj`, whatever makes sense for the ecosystem. Just do not leave the dependency list inside someone's head, or on someone's laptop.

It sounds obvious until you inherit an application whose deployment documentation says "install these three packages manually on the server", and nobody remembers which versions.

## 3. Config: stop putting secrets in code

For people generating applications with AI, this is probably the most important factor.

Configuration belongs in the environment. Values like `DATABASE_URL`, `API_KEY`, `SERVICE_ENDPOINT` and `CLIENT_ID` should not force you to change source code to run in a different environment. Dev can use one database, QA another, production another, and the application stays the same.

And no, `password = "SuperSecret123"` is not configuration management. I have found real passwords committed to real repositories more than once, and it never ends well.

AI generates examples like this all the time because hardcoded values make a demo easier to read. That is fine for a demo. Production has different requirements, and keeping those two apart is part of the job.

## 4. Backing services: databases are resources

A database, a cache, a message queue, object storage, an email provider or a search engine. Those are backing services, and the application should treat them as attached resources.

Say your application uses PostgreSQL. Tomorrow I hand you another PostgreSQL instance with a different connection string. The ideal change is a different resource, not a rewrite of the application.

This happens all the time on cloud platforms. Databases and Redis instances get replaced, storage accounts change, queues and endpoints move. The application should not have a crisis every time one of them does.

## 5. Build, release, run: these are different things

This factor is easy to ignore while deployment is simple. It starts making a lot of sense the first time deployment becomes painful.

Building the software is one step. Creating a release is another one. Running that release is a third. When everything is mixed together, deployment becomes a magic trick, and magic stops being fun when production breaks and nobody can tell what is actually running.

A healthy pipeline is traceable. Code becomes a build, the build becomes an artifact, the artifact becomes a release, and the release is what runs.

What matters here is reproducibility. If version 1.4.2 is running in production, I want to know exactly what is inside version 1.4.2. I do not want the answer to be "I think João changed something directly on the server on Tuesday". I have answered with that sentence myself, more than once, and I regret every time.

## 6. Processes: assume your application can disappear

Application processes should be stateless. Important information should not depend on the memory or the filesystem of one specific process surviving forever.

A request can arrive at instance A. The next one goes to instance C. Instance B disappears, and a new instance D shows up to replace it.

That is normal with containers, Kubernetes, serverless platforms and autoscaling. State belongs in something built to hold state: a database, a cache, an object store, any external resource.

Your process is temporary. Design it as if you know it will be replaced at any moment, because it will.

## 7. Port binding

Traditionally, port binding means the application exposes its service through a port, like `http://localhost:8080`.

With containers, Kubernetes, Azure Functions, AWS Lambda or any other platform, the implementation looks different. The mental model is still the same: the application has a clear interface with the world around it, and it does not need mysterious configuration inside a giant application server just to exist.

## 8. Concurrency: scale by adding processes

Imagine your API is overloaded and you want to go from one instance to five. That is horizontal scaling.

It works much better when the earlier factors are in place. If the application depends heavily on local state, adding instances gets complicated very quickly. If the processes are independent, scaling gets much easier, and the factors turn out to be connected: one makes the next one possible.

## 9. Disposability: start and die gracefully

Cloud applications die. Containers die. Virtual machines restart. Deployments replace processes, autoscaling removes instances, and networks fail. This is normal, not an exception.

The application should start quickly and shut down properly. When a process receives a shutdown signal, it should finish what can be finished safely, stop accepting new work and exit cleanly.

The alternative is a process still trying to handle 400 messages while Kubernetes wants it dead. If you work with queues and background jobs, you learn to care about graceful shutdown quickly, usually after it bites you once.

## 10. Dev/prod parity

"Works on my machine" is one of the oldest jokes in software, and it stops being funny the day it happens to you.

Development, staging and production will never be completely identical. The bigger the gap, the more surprises you create for yourself.

If development uses SQLite, QA uses PostgreSQL 15 and production runs an ancient PostgreSQL instance that nobody wants to touch, you are going to have interesting evenings. I know, because I have been there.

Keep the environments close. Containers helped with this. Infrastructure as code helped. CI/CD helped. The principle is older than all of them.

## 11. Logs: streams of events

Please do not design your logging around a file called `C:\MyApp\logs\production-final-2.txt`. I have debugged problems with log files in that spirit, and they never contain what you need when you need it.

The application produces events. Another system collects them: Application Insights, CloudWatch, Datadog, Grafana Loki, Splunk, ELK, whatever fits your environment.

The application does not need to know where someone will search the logs later. It needs to produce useful, structured events and let the platform handle collection and storage.

This matters even more when you have several instances. SSH into five containers hunting for a text file is not observability.

## 12. Admin processes

Sometimes you need to run a task once: a database migration, a data repair, a user import, a cleanup, a reindexing job or a backfill.

These tasks should use the same code, the same configuration and the same environment assumptions as the application. They should not depend on a mysterious script sitting on someone's desktop called `fix-production-real-final-v3.py`.

I have seen enough versions of this pattern to know how it ends. Nobody deletes the script. Nobody understands it. At some point the company depends on it, and everyone is afraid to touch it. Until the day someone has to, and that is usually a bad day.

## Why should someone starting today care about this?

AI made code much faster and cheaper to produce. That is real. But databases still fail, networks still fail, and processes still crash, exactly like before.

Deployments still need to be reproducible. Credentials still leak. Applications still need to scale, and logs still need to be searchable. Configuration still changes between environments, and distributed systems are still distributed. None of that changed because a model can write your Dockerfile.

An LLM can generate a controller, a service, a repository, a Dockerfile, Terraform, a pipeline, a database, a queue and a cache in an absurdly short time. Useful, sure. But those files are only the beginning. You still need to understand why the system has that structure.

That is where old, foundational material becomes useful again.

## What I would add if this was written today

I would not turn the 12-Factor App into a 17-Factor App. Part of why the list works is that it is small enough to remember. But if I were explaining production systems to someone starting today, I would put a few more things next to it.

### Observability is more than logs

Logs are one part of observability, not the whole thing. In production you usually also care about metrics and traces. A request can cross an API, a queue, three services and a database before it fails. A log entry from one process will not tell you the whole story.

Correlation IDs, distributed tracing and metrics are the tools for that. They feel like overhead at first, and then you need them at 2am and they save you.

### Idempotency

This one becomes very important as soon as queues, retries and distributed systems enter the picture.

If a message is delivered twice, does your system create two users? Charge someone twice? Send the same email five times? Networks time out, queues redeliver messages, and clients retry requests after the server may have already completed them.

Designing operations so they can safely happen more than once saves a lot of pain. It is one of those things you only learn to appreciate after a double charge or a duplicated migration.

### Identity and secrets

Moving a password out of source code and into an environment variable is better. It is not the end of the security discussion, though.

When the platform supports it, prefer managed identities, workload identities, short-lived credentials and secret stores. A `.env` file is useful. It is just not the final form of security.

### Infrastructure should be reproducible too

Your application can be perfectly versioned while production depends on somebody clicking through twenty screens in a cloud portal. In that case, part of the system still exists only in someone's head.

Tools like Terraform, Bicep and CloudFormation bring the same idea of reproducibility to infrastructure. I want to know which application version is running, and I want to know how the environment around it was created. Both things.

### Partial failure is normal

Distributed systems force you to accept that failure is not always binary. The API can be healthy while Redis is down. The database can be healthy while the network between it and the application is not. A dependency can be responding, just much slower than usual.

Timeouts, retries, backoff and circuit breakers make much more sense once you accept that parts of a system can fail independently.

None of these ideas makes the original twelve factors obsolete. They sit next to them pretty naturally.

## Don't treat the 12 factors like religion

The 12-Factor App is not a sacred text.

Technology changed since 2011. Containers became mainstream, Kubernetes happened, serverless happened, managed cloud services exploded and platform engineering became a discipline. Some factors need a modern interpretation, and that is fine.

What is useful is the instinct behind the list. A hardcoded password should make you uncomfortable. Manual changes in production should make you uncomfortable. Critical state stored on a local disk, completely different dependencies in each environment, a scaling plan that requires rewriting half of the system: all of that should make you uncomfortable.

That instinct is worth more than memorizing twelve definitions.

## AI can write the code. You still need to understand the system

AI coding tools are incredible. Use them. I do. Just do not hand your engineering judgment over to them.

Ask AI to generate Dockerfiles, write Terraform, create APIs, refactor code and build pipelines. Then look at what it generated and ask yourself the uncomfortable questions: why is this here, where does the configuration live, where does the state live, what happens if this process dies, can I run ten instances, can I reproduce this deployment, can I replace this dependency, can I understand what happened in production?

Being able to answer those questions means you understand more than the generated files. You are starting to understand the system.

If you started coding during the AI boom, the 12-Factor App is still one of the simplest places to begin building that understanding. It is short. I re-read it every few years, and I always find something I have been doing wrong.
