---
sidebar_position: 22
lecture_number: 22
title: Serverless Architecture
---

In [L21](./l21-networks.md), we explored distributed architecture—what changes when components communicate over networks. We saw the Fallacies of Distributed Computing and strategies for building reliable systems despite unreliable networks.

This lecture introduces **serverless architecture**—an architectural style where you write functions that a cloud provider executes on demand, composing managed infrastructure services rather than managing servers yourself. But first, we need vocabulary for those infrastructure services.

## Recognize common infrastructure building blocks (15 minutes)

Cloud platforms provide standardized infrastructure components that solve recurring problems. Just as we have reusable design patterns in code, these "building blocks" appear across architectural styles—serverless, microservices, or traditional deployments. Understanding them helps you read architectural diagrams, evaluate tradeoffs, and communicate design decisions.

### Databases: Structured Data Persistence

A **database** stores and retrieves structured data reliably. When your application needs to remember something across restarts—user accounts, recipe metadata, cookbook indexes—that data lives in a database.

For a more complete treatment of databases, you should consider CS3200/CS4200, but here's what matters most architecturally:

| Type | What It's Good For | Examples |
|------|-------------------|----------|
| **Relational** | Complex queries, relationships between entities, transactions | PostgreSQL, MySQL |
| **Document** | Flexible schemas, JSON-like data, rapid development | MongoDB, Firestore |
| **Key-Value** | Simple lookups by ID, extremely fast reads | DynamoDB, Redis |

The "right" database choice depends heavily on **query patterns**—how you expect to access and search the data. Consider: what if CookYourBooks lets users maintain an ingredient inventory and then query for recipes they can make? Suddenly you need queries like:
- "Find all recipes where every ingredient is in my pantry"
- "Find recipes that require at most 3 additional items"
- "Find recipes that only need dry goods additions (no fresh produce—it's winter)"

These queries involve *relationships* between recipes, ingredients, and inventory—exactly where relational databases shine. A document database that stores each recipe as a blob would struggle with "join all recipes against my inventory and filter." You'd either denormalize everything (duplicating ingredient data) or fetch all recipes and filter in application code (slow and expensive).

The architectural lesson: database choice isn't about "which is best" but "which fits our access patterns." If CookYourBooks only needs "get recipe by ID" and "list recipes in cookbook," a document store is simple and fast. If complex ingredient queries are core to the product, a relational database pays off despite added complexity.

The choice between database types also involves tradeoffs we'll explore more deeply when we cover **concurrency** (L31-32)—questions like "what happens when two users edit the same recipe simultaneously?" For now, just recognize that databases are a fundamental building block for persistent state, and the right choice depends on how you'll query the data.

### Object/Blob Storage: Files and Binary Data

**Object storage** (also called "blob storage", where blob stands for "binary large object") stores and retrieves files at scale: images, PDFs, backups, exports, video. Unlike databases optimized for structured queries, object storage is optimized for storing and retrieving large blobs by name.

| Service | Provider |
|---------|----------|
| S3 | AWS |
| Cloud Storage | Google Cloud |
| Blob Storage | Azure |

*CookYourBooks example*: When a user uploads a photo of a cookbook page for OCR, that image file goes to object storage. The OCR function retrieves it by name, processes it, and might store the result back. You wouldn't put a 5MB image directly in a database—object storage is built for this.

Object storage is typically:
- **Cheap** for large amounts of data, much more so than a database is for the same amount of data
- **Durable** (replicated across multiple locations)
- **Simple** (put, get, delete by key—no complex queries)

### Message Queues: Asynchronous Communication

A **message queue** lets components communicate without being online at the same time. One component puts a message on the queue; another picks it up later. This decouples producers from consumers and buffers work during traffic spikes.

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Producer   │────►│    Queue    │────►│   Consumer   │
│ (Web Server) │     │  (SQS, etc) │     │  (Worker)    │
└──────────────┘     └─────────────┘     └──────────────┘
                     Messages wait here
                     until processed
```

The key architectural property of message queues is **durability**: once the queue confirms receipt of a message, it guarantees eventual delivery. The producer can move on, confident the work will happen—even if the consumer crashes and restarts, or the network hiccups, or traffic spikes. The queue persists the message until a consumer successfully processes it.

*CookYourBooks example*: Imagine users can upload 50 cookbook photos at once. Rather than blocking while all 50 process, the upload handler puts 50 messages on a queue—one per image. OCR workers process them at their own pace. The user gets immediate feedback ("uploads received"), and processing happens in the background. Even if an OCR worker crashes mid-processing, the message returns to the queue and another worker picks it up—no uploads lost.

Examples: AWS SQS, Google Pub/Sub, RabbitMQ, Apache Kafka.

We'll explore event-driven patterns and queues more deeply in **L33 (Event Architecture)**. For now, recognize queues as a tool for decoupling, handling variable load, and ensuring reliable delivery.

### Caches: Fast Access to Hot Data

A **cache** stores copies of frequently-accessed data in memory for speed. Instead of querying the database every time someone searches for "chocolate cake recipes," you cache the result and serve it directly—until the cache expires or the underlying data changes.

*CookYourBooks example*: The ToC Service (from L22) might cache popular cookbook searches. The first search hits the database; subsequent searches within the next few minutes return the cached result instantly.

| Service | What It Does |
|---------|--------------|
| Redis | In-memory key-value store, often used as a cache |
| Memcached | Distributed memory cache |
| CDN (CloudFront, etc.) | Caches static files at edge locations globally |

Caching involves tradeoffs: you gain speed but might serve stale data. When should the cache refresh? What if the underlying recipe changes?

:::note Looking Ahead
These consistency questions—what happens when multiple sources of truth diverge?—are fundamental to distributed systems. We'll explore them in greater depth during our concurrency unit: [Lecture 31 (Concurrency I)](/lecture-notes/l31-concurrency1), [Lecture 32 (Asynchronous Programming)](/lecture-notes/l32-concurrency2), and [Lecture 33 (Event-Driven Architecture)](/lecture-notes/l33-event-architecture).
:::

### API Gateways: Unified Entry Point

An **API Gateway** provides a single entry point for your APIs. Instead of exposing multiple backend services directly, clients talk to the gateway, which routes requests, handles authentication, enforces rate limits, and provides a consistent interface.

```
┌─────────┐      ┌─────────────┐      ┌──────────────────┐
│ Clients │─────►│ API Gateway │─────►│ Backend Services │
└─────────┘      │ • Auth      │      │ • Import Function│
                 │ • Routing   │      │ • Search Function│
                 │ • Rate Limit│      │ • Export Function│
                 └─────────────┘      └──────────────────┘
```

*CookYourBooks example*: If CookYourBooks offers a cloud API (import, search, export), an API gateway provides a single `api.cookyourbooks.com` endpoint. It verifies user tokens before requests reach the functions, prevents abuse with rate limiting, and routes `/import` vs. `/search` to different backend functions.

Examples: AWS API Gateway, Google Cloud Endpoints, Kong.

### Building Blocks Summary

These five building blocks—databases, object storage, queues, caches, and API gateways—appear in nearly every cloud architecture. Serverless architecture is fundamentally about **composing these managed services**: you write functions containing business logic; the cloud provider operates the infrastructure.

With this vocabulary established, let's see how serverless architecture works.

## Define "serverless" architecture and its core concepts (5 minutes)

"Serverless" is a bit of a misnomer—there are still servers, you just don't manage them. The key insight is organizational: serverless is **technical partitioning with a vendor**.

In [L20](./l20-monoliths.md), we discussed technical vs. domain partitioning—whether you organize code (and teams) by technical role (controllers, services, repositories) or by business capability (import, library, export). Serverless takes technical partitioning to the organizational level: a cloud vendor operates the infrastructure layer *as a service*, allowing your team to focus entirely on domain logic.

This is Conway's Law in action. The vendor's organization is structured to specialize in infrastructure—they have teams for container orchestration, auto-scaling, monitoring, security patching. Your organization specializes in your domain—recipes, cookbooks, user workflows. The system boundary (your functions ↔ their infrastructure) mirrors the organizational boundary. The vendor serves thousands of clients, achieving economies of scale that no single team could justify for their own infrastructure.

Of course, this division comes with costs. You gain operational simplicity and scalability, but you lose control: the vendor's abstractions constrain how you build (likely resulting in a much more complex system than you would have built yourself), their pricing model determines your costs at scale, and switching vendors means rewriting infrastructure code. We'll see these tradeoffs concretely when we compare serverless to DIY approaches. This course will not go into the details of how to build your own infrastructure, but interested students should consider CS3650 (Computer Systems), CS3700 (Networks and Distributed Systems), and CS4730 (Distributed Systems).

### Functions as a Service (FaaS)

Instead of deploying an application that runs continuously, you deploy **functions** that execute in response to events:

```java
// A serverless function for CookYourBooks
public class RecipeImportFunction implements RequestHandler<ImportRequest, ImportResponse> {
    
    @Override
    public ImportResponse handleRequest(ImportRequest request, Context context) {
        // This function runs only when triggered
        byte[] imageData = request.getImageData();
        String extractedText = ocrService.extractText(imageData);
        Recipe recipe = recipeParser.parse(extractedText);
        return new ImportResponse(recipe);
    }
}
```

The cloud provider:
- Receives the request
- Spins up a container with your function
- Executes the function
- Returns the response
- Tears down the container (eventually)

You pay only for execution time, not idle time.

### Event-Driven Execution

Serverless functions are triggered by **events**:
- HTTP requests (API Gateway)
- File uploads (S3, Cloud Storage)
- Database changes (DynamoDB Streams)
- Scheduled triggers (cron-like)
- Message queue items (SQS, Pub/Sub)

```
┌──────────────────────────────────────────────────────────────────┐
│                        Event Sources                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │  HTTP   │  │  File   │  │ Database│  │ Schedule│             │
│  │ Request │  │ Upload  │  │ Change  │  │  Timer  │             │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘             │
│       │            │            │            │                   │
│       └────────────┴─────┬──────┴────────────┘                   │
│                          │                                        │
│                          ▼                                        │
│                 ┌─────────────────┐                              │
│                 │   Your Function  │  ◄── Scales automatically   │
│                 └────────┬────────┘                              │
│                          │                                        │
│                          ▼                                        │
│            ┌─────────────────────────────┐                       │
│            │    Other Services           │                       │
│            │  (Database, Storage, APIs)  │                       │
│            └─────────────────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

## Compare serverless to traditional architectures (10 minutes)

Let's compare three approaches to deploying CookYourBooks' recipe import feature:

### Traditional Server (Monolith)

```
┌─────────────────────────────────────────┐
│            Your Server (24/7)           │
│  ┌─────────────────────────────────┐    │
│  │        CookYourBooks App        │    │
│  │  ┌───────────┐ ┌─────────────┐  │    │
│  │  │  Import   │ │   Library   │  │    │
│  │  │  Service  │ │   Service   │  │    │
│  │  └───────────┘ └─────────────┘  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
         Running even when idle
```

- You manage the server
- You pay for idle time
- You handle scaling manually
- All services share the same deployment

### Container-Based (Microservices)

```
┌──────────────────┐    ┌──────────────────┐
│  Import Service  │    │  Library Service │
│    Container     │    │    Container     │
└──────────────────┘    └──────────────────┘
        ▲                       ▲
        │                       │
┌───────┴───────────────────────┴───────────┐
│           Container Orchestrator           │
│           (Kubernetes, etc.)              │
└───────────────────────────────────────────┘
```

- Containers run continuously (or scale to zero with advanced config)
- More operational complexity
- Independent scaling per service
- You manage the orchestrator or use a managed service

### Serverless (FaaS)

```
     HTTP Request
          │
          ▼
┌─────────────────┐
│   API Gateway   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Import Function │────►│   S3 Bucket     │
│  (runs on       │     │ (recipe images) │
│   demand)       │     └─────────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    DynamoDB     │
│ (recipe storage)│
└─────────────────┘
```

- Functions run only when triggered
- Provider handles scaling automatically
- Pay per invocation
- No servers to manage

### Comparison Table

| Aspect | Monolith | Containers | Serverless |
|--------|----------|------------|------------|
| **Scaling** | Manual | Configured | Automatic |
| **Idle cost** | Full | Reduced (with scale-to-zero) | Zero |
| **Cold start** | None | Minimal | Noticeable (100ms-5s) |
| **Complexity** | Low | High | Medium |
| **Vendor lock-in** | Low | Low-Medium | High |
| **State management** | Easy | Medium | Difficult |
| **Long-running tasks** | Fine | Fine | Limited (timeouts) |

Let's unpack each row:

**Scaling**: With a monolith, *you* decide when to add capacity—monitoring traffic, provisioning new servers, configuring load balancers. Containers let you declare scaling rules ("maintain 3 replicas," "scale up when CPU > 70%"), but you configure and tune those rules. Serverless scales invisibly: if 1,000 requests arrive simultaneously, 1,000 function instances spin up. You don't think about it—until you get the bill.

**Idle cost**: A monolith server runs 24/7, whether serving requests or not. Containers can "scale to zero" with advanced configuration, but this is tricky to set up and has its own cold-start implications. Serverless truly charges nothing when idle—if CookYourBooks has no users at 3 AM, you pay $0 during those hours.

**Cold start**: When a monolith is running, every request hits warm code—no startup penalty. Containers have minimal cold starts if already running, but spinning up new instances takes seconds. Serverless cold starts are the most noticeable: when a function hasn't run recently, the provider must allocate a container, load your runtime (JVM, Node.js), initialize dependencies, then execute. This adds 100ms–5s latency on the first request. For user-facing APIs, this can feel sluggish; for background processing, it rarely matters.

**Complexity**: A monolith is one thing to deploy, monitor, and debug—simple. Container orchestration (Kubernetes) is notoriously complex: networking, service discovery, health checks, rolling deployments, secrets management (you would need to take another course to learn about this). Serverless is medium complexity: simpler operationally (no servers to manage), but debugging across many small functions and understanding cold starts introduces its own challenges.

**Vendor lock-in**: A monolith running on a VM can move between cloud providers or on-premises with modest effort. Containers are fairly portable (Docker runs anywhere), though managed Kubernetes services have their quirks. Serverless lock-in is more nuanced than it used to be. Open-source FaaS platforms like Deno Deploy, OpenFaaS, and Knative let you write functions that run on multiple providers or self-hosted infrastructure—if you choose them from the start. However, this varies significantly by ecosystem: JavaScript/TypeScript developers have good portable options, while Java developers (like us in this course) have fewer choices and often end up coupled to AWS Lambda or Google Cloud Functions. The Hexagonal Architecture we learned helps regardless: if domain logic is behind ports, you can swap adapters for different providers, but you'll still rewrite infrastructure code when the underlying services differ.

**State management**: A monolith can hold state in memory—session data, caches, connection pools—because the process runs continuously. Containers can too, though scaling and restarts complicate things. Serverless functions are stateless by design: each invocation may run on a different container, so you *must* externalize state to databases, caches, or session stores. This forces cleaner architecture but adds latency and complexity.

**Long-running tasks**: A monolith can run a task for hours if needed. Containers can too. Serverless functions typically timeout after 15 minutes (AWS Lambda) or less. Processing a 1,000-page cookbook? You'll need to chunk the work, use queues, or accept that serverless isn't the right tool.

## Requirements suited (and unsuited) for serverless (10 minutes)

### Good Fit for Serverless

**Event-driven, stateless operations:**
```java
// Good: Process uploaded image, return result
public Recipe handleImageUpload(ImageUploadEvent event) {
    byte[] image = storageService.getObject(event.getBucket(), event.getKey());
    String text = ocrService.extractText(image);
    return recipeParser.parse(text);
}
```

**Variable or unpredictable workloads:**
- Recipe imports might spike when a cooking blog links to CookYourBooks
- Pay for actual usage, not provisioned capacity

**Glue code and integrations:**
- Transform data between services
- Respond to webhooks
- Scheduled tasks (daily recipe backup)

**APIs with moderate traffic:**
- REST/GraphQL endpoints that don't need sub-10ms latency
- Traffic patterns with idle periods

### Poor Fit for Serverless

**Long-running computations:**
```java
// Bad: This might timeout (typically 15 min max)
public void processEntireCookbook(CookbookId id) {
    List<Recipe> recipes = library.getAllRecipes(id);  // 1000 recipes
    for (Recipe r : recipes) {
        // Heavy processing...
    }
}
```

**Stateful operations:**
- Serverless functions are stateless by design
- State must be stored externally (database, cache)
- In-memory caching doesn't work well

**Low-latency requirements:**
- Cold starts add 100ms-5s latency
- For real-time applications, this may be unacceptable

**High-throughput, sustained load:**
- Per-invocation pricing can exceed server costs at high volume
- Better to run your own servers for predictable, sustained load

### CookYourBooks: What Would Go Serverless?

If CookYourBooks had a cloud component, serverless would fit well for:

| Feature | Why Serverless Works |
|---------|---------------------|
| **Recipe OCR API** | Stateless, event-driven, variable load |
| **Recipe sharing endpoint** | Low traffic, don't need 24/7 server |
| **Daily backup job** | Scheduled task, runs briefly |
| **Webhook for cookbook updates** | Sporadic events, quick processing |

Serverless would fit poorly for:

| Feature | Why Serverless Doesn't Work |
|---------|---------------------------|
| **Real-time collaborative editing** | Needs persistent connections, low latency |
| **Large cookbook migration** | Long-running, might timeout |
| **Recipe search with complex ranking** | Needs in-memory indexes, stateful |

## Connection to Earlier Concepts (5 minutes)

:::note Information Hiding In Action
The principles from [Lecture 6 (Information Hiding)](/lecture-notes/l6-immutability-abstraction) scale all the way up to cloud architecture. A serverless function hides its implementation behind an event interface—callers don't know (or care) whether it's running on AWS Lambda, Google Cloud Functions, or a container. The ports-and-adapters pattern means your domain logic doesn't know it's running serverless at all. Information hiding isn't just about `private` fields; it's a fractal principle that applies at every level of system design.
:::

Serverless isn't a departure from what we've learned—it's an application of the same principles at a different scale:

| Course Concept | Serverless Application |
|----------------|----------------------|
| **Hexagonal Architecture** (L16, L21) | Domain logic behind ports; cloud services are adapters |
| **Dependency Injection** (L18) | Functions receive dependencies through configuration |
| **Information Hiding** (L6) | Each function hides its implementation behind an event interface |
| **Fallacies of Distributed Computing** (L22) | Serverless makes network calls explicit—can't hide them |
| **Quality Attributes** (L21) | Serverless optimizes for scalability and cost; trades off latency |

The architectural thinking is the same. Serverless is one point in the design space—sometimes the right choice, sometimes not.

---

After spring break, we'll shift focus to **user-centered design**—how to build software that users can actually use. We'll explore usability heuristics, user testing, and accessibility. The architecture we've been building needs to serve real people, and that's what the next unit addresses.
