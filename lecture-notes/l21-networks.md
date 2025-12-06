---
sidebar_position: 21
lecture_number: 21
title: Distributed Architecture, Networks, and Security
---

In [L20](./l20-monoliths.md), we explored architectural patterns for applications that run as a single process—Hexagonal Architecture, Layered Architecture, Pipelined Architecture. These patterns help organize code within a single deployment unit.

But CookYourBooks doesn't live in isolation. When users can share the Table of Contents for their cookbooks, and potentially even share recipes, notes and reviews, we're suddenly dealing with a fundamentally different kind of system: one where components communicate over networks. This lecture explores what changes—and what stays the same—when we move from monolithic to distributed architecture.

## Client-Server Architecture (10 minutes)

The **client-server architecture** separates systems into two roles: clients make requests, servers respond to them. The server centralizes data and logic; multiple clients can connect simultaneously. This is perhaps the most ubiquitous architectural style—every web application, every mobile app talking to a backend, every database connection follows this pattern.

CookYourBooks has a natural client-server relationship: the **CYB Table of Contents Service**. This is a cloud service that maintains a central catalog of cookbook tables of contents. Once one user imports the recipe list from a cookbook, that table of contents becomes searchable by all users. Think of it as a collaborative index—you benefit from everyone else's work.

- The desktop application (client) queries the ToC Service (server) to search for recipes across all known cookbooks
- When a user imports a cookbook, the app can upload its table of contents to the shared service
- Even locally, JavaFX views (clients) request data from services (servers within the same process)

The benefits are clear: centralized data, shared state across users, and network effects (the more users contribute, the more valuable the service becomes). The constraints are significant: the server becomes a single point of failure, and network latency affects every search. For CookYourBooks, this is why local recipe management works offline—users shouldn't be unable to view their own recipes just because their internet is down.

## The Fallacies of Distributed Computing (15 minutes)

When components communicate over a network, everything gets harder. Peter Deutsch and others at Sun Microsystems identified eight assumptions that developers make about networks—assumptions that are false and lead to bugs, outages, and frustrated users.

### The Eight Fallacies

**1. The network is reliable**

Networks fail. Cables get unplugged, routers crash, cloud providers have outages. Code that assumes `httpClient.send()` will always succeed is fragile code.

*CookYourBooks example*: User searches the ToC Service for "chocolate soufflé recipes." The request times out. What happens? If we assumed reliability, maybe the app hangs forever or crashes. A robust design shows an error message and offers retry—or degrades gracefully to searching only local recipes.

**2. Latency is zero**

Every network call takes time. Local method calls take nanoseconds; network calls take milliseconds to seconds. Code that makes many sequential network calls will be slow.

*CookYourBooks example*: When uploading a cookbook's table of contents, suppose we upload each recipe entry as a separate API call. If the cookbook has 200 recipes and each call takes 100ms, that's 20 seconds of waiting. Better: batch the entire ToC in one request, or provide progress feedback.

**3. Bandwidth is infinite**

Networks have limited capacity. Sending a 10MB payload over a mobile connection is different from sending it over fiber.

*CookYourBooks example*: When uploading a table of contents, should we include thumbnail images of each recipe? That might be nice for search results, but it dramatically increases upload size. The tradeoff: richer data vs. faster transfers.

**4. The network is secure**

Data crossing networks can be intercepted, modified, or spoofed. Every network boundary is a potential attack surface.

*CookYourBooks example*: If users can contribute to the ToC Service, how do we prevent spam or malicious entries? If we use API keys to identify users, those keys are sensitive. We need to think about where secrets live and how authentication happens.

**5. Topology doesn't change**

Network paths change. IP addresses change. Servers move. DNS entries update. Code that caches network locations can break when things move.

*CookYourBooks example*: What happens if we need to move the ToC service to a new host?

**6. There is one administrator**

In distributed systems, different parts are controlled by different organizations. You can't control what the intermediate service operators do with their servers, what your user's ISP does with traffic, or what corporate firewalls block.

*Northeastern University Example:* Northeastern University contracts with the firm [Palo Alto Networks](https://www.paloaltonetworks.com/) to filter all campus network traffic (both inbound and outbound) for malware and other security threats. When Palo Alto Networks arbitrarily decides that CookYourBooks is malware, student learning is disrupted and the university claims no responsibility for the outage, for repairing it, or for preventing similar situations from recurring. 

**7. Transport cost is zero**

Network calls have costs: computational (serialization, encryption), monetary (API pricing, bandwidth fees), and energy (radio transmission, data center processing).

*CookYourBooks example*: If the ToC Service is hosted in the cloud, every API call costs the service operators money. A design that queries on every keystroke (instead of waiting for the user to press Enter) likely makes the service unsustainably expensive.

**8. The network is homogeneous**

Networks involve many different technologies, protocols, and vendors. Your carefully-tested code might behave differently on a user's unusual network configuration.

### Designing for an Unreliable World

These fallacies aren't reasons to avoid distributed systems—they're reasons to design carefully. Key strategies:

**Timeouts and retries**: Never wait forever. Set reasonable timeouts and implement retry logic with exponential backoff.

```java
// Bad: waits forever
Response response = client.send(request);

// Better: timeout and retry
Response response = null;
int attempts = 0;
while (response == null && attempts < 3) {
    try {
        response = client.send(request, Duration.ofSeconds(10));
    } catch (TimeoutException e) {
        attempts++;
        Thread.sleep(1000 * attempts);  // Exponential backoff
    }
}
if (response == null) {
    return searchLocalRecipesOnly(query);
}
```

**Graceful degradation**: When a service is unavailable, offer reduced functionality rather than complete failure. CookYourBooks can search only local recipes when the ToC Service is unreachable—not ideal, but better than nothing.

**Idempotent operations**: Design requests so that retrying them is safe. If the user clicks "Import" and the network fails mid-request, can they safely click again without creating duplicate recipes?

## Network-Related Requirements and Patterns (10 minutes)

When designing distributed systems, several quality attributes become critical. This course does *not* go into significant depth of how to *achieve* these qualities, but we'll provide a taste of common requirements and patterns. For more details, see:
- CS4530: Fundamentals of Software Engineering
- CS4700: Network Fundamentals
- CS4730: Distributed Systems

### Performance: Latency, Throughput, and Resource Utilization

- **Latency**: Time for a single operation to complete. Users notice latency above ~100ms.
- **Throughput**: Operations per unit time. Can the system handle peak load?
- **Resource utilization**: How efficiently are compute, memory, and bandwidth used?

Strategies:

- **Caching**: Store frequently-accessed data closer to where it's needed. The ToC Service might cache popular cookbook searches in memory rather than querying the database every time. CookYourBooks could cache recent search results locally. This improves latency but may result in users seeing stale data.
- **Request batching**: Combine multiple small requests into one larger request. Instead of 100 API calls for 100 recipes, send one call with all 100. This improves throughput, but may result in increased latency for the first response.
- **Asynchronous processing**: Don't block the UI while waiting for network responses. Fire off the request, let the user continue working, update when the response arrives.
- **Load balancing**: Distribute requests across multiple servers. If the ToC Service has three servers, a load balancer can route each request to the least-busy one.

### Reliability: Fault Tolerance, Availability, and Recoverability

- **Fault tolerance**: System continues operating when components fail
- **Availability**: Percentage of time the system is operational (e.g., "99.9% uptime")
- **Recoverability**: How quickly the system returns to normal after failure

Strategies:

- **Redundancy**: Run multiple instances of critical components. If one ToC Service server crashes, others continue serving requests. Data is replicated across multiple storage systems. Replication is harder than it seems (more next lecture).
- **Health checks**: Regularly verify that components are functioning. A load balancer pings each server every few seconds; if a server stops responding, it's removed from rotation. 
- **Circuit breakers**: When a service is failing, stop sending it requests temporarily. If the ToC Service returns errors 50% of the time, "trip the circuit" and fail fast locally rather than overwhelming a struggling service.
- **Failover mechanisms**: Automatically switch to backup systems when primary systems fail. If the primary database becomes unavailable, promote the replica to primary.

### Scalability: Horizontal and Vertical

- **Vertical scaling**: Bigger machines (more CPU, RAM)
- **Horizontal scaling**: More machines (distribute load)

Strategies:

- **Stateless services**: Design services so any instance can handle any request. No "sticky sessions" that tie a user to a specific server. This makes horizontal scaling straightforward—just add more instances.
- **Database sharding**: Maintain stateful services, but split data across multiple instances of the service. Cookbooks A-M on one server, N-Z on another. Increases capacity but adds complexity.
- **CDN (Content Delivery Network)**: For static content (images, CSS, JS), use globally-distributed edge servers. Users download from nearby servers rather than a single origin.

For CookYourBooks as a desktop app, scalability is less about handling millions of users and more about handling large libraries (thousands of recipes) efficiently on typical hardware. But if the ToC Service becomes popular, these strategies might become more important.

## Security as an Architectural Concern (15 minutes)

Security isn't a feature you bolt on at the end—it's an architectural concern that shapes design decisions throughout.

### Authentication and Authorization

**Authentication**: Proving identity. "Who are you?"
**Authorization**: Checking permissions. "What are you allowed to do?"

*CookYourBooks example*: The ToC Service might require users to create an account (authentication). Free-tier users might be limited to 100 searches per day, while contributors who've uploaded ToCs get unlimited searches (authorization). Where do credentials live? How do we prevent them from leaking?

### Trust Boundaries

A **trust boundary** is a line in your architecture where you stop trusting data. Anything crossing that boundary must be validated.

```
┌─────────────────────────────────────────────────────────┐
│                    User's Machine                        │
│   ┌─────────────┐      ┌─────────────────────────┐      │
│   │ User Input  │─────►│     CookYourBooks       │      │
│   └─────────────┘      │                         │      │
│   TRUST BOUNDARY       │  ┌─────────────────┐    │      │
│   ==================   │  │  Recipe Parser   │    │      │
│                        │  └────────┬────────┘    │      │
│                        │           │             │      │
│                        └───────────┼─────────────┘      │
└────────────────────────────────────┼────────────────────┘
                                     │ TRUST BOUNDARY
                     ================│=================
                                     ▼
                        ┌─────────────────────────┐
                        │    CYB ToC Service       │
                        │   (External Service)     │
                        └─────────────────────────┘
```

Code that runs in an untrusted environment (like the desktop application) cannot be implicitly trusted, as users may be able to tamper with it. Hence, the ToC service **must not** rely on the desktop application to, for example:
- Report that a given user is logged in
- Report that a recipe is in a given user's library
- Produce authentic recipe data

Data from users (file uploads, text input) crosses a trust boundary—it could be malicious. When the ToC service receives data from the desktop application, it must validate it to ensure it is authentic and not malicious.

### The CIA Triad

Security requirements are often expressed in terms of three properties:

**Confidentiality**: Sensitive information is only accessible to authorized parties.
- User credentials must not leak
- A user's personal notes and ratings shouldn't be visible to others
- Uploaded ToC data should only be attributed to users who opt in

**Integrity**: Data is accurate and hasn't been tampered with.
- Recipe data shouldn't be corrupted in transit
- Import/export should preserve recipe content exactly
- Users should be able to trust that their recipes weren't modified

**Availability**: Systems are accessible when users need them.
- The app should work offline for core functionality
- Network issues shouldn't corrupt local data
- Cloud service outages shouldn't brick the application

### Practical Security for CookYourBooks

1. **Credential management**: Store user tokens securely (not in source code), use the OS credential store or secure storage
2. **Input validation**: Never trust data from files, user input, or API responses. Validate and sanitize.
3. **HTTPS everywhere**: All network communication should be encrypted
4. **Minimal data transmission**: Don't send more data than necessary to the ToC Service
5. **Error messages**: Don't leak sensitive information in error messages

## CookYourBooks: Local vs. Cloud Search as Architectural Decision (5 minutes)

Our `RecipeSearchService` port abstracts over local search (just your recipes) and cloud search (the ToC Service). This architectural decision has network implications:

| Concern | Local Search | Cloud ToC Service |
|---------|--------------|-------------------|
| Network dependency | None | Full |
| Latency | Consistent (~10ms) | Variable (100ms-2s) |
| Coverage | Only your recipes | All contributed cookbooks |
| Cost | CPU time only | Service hosting costs |
| Privacy | Data stays local | Queries visible to service |
| Availability | Always | Depends on service |

The Hexagonal Architecture we discussed in L21 makes this choice swappable—users can search locally when offline and benefit from the cloud service when connected. But the *architectural thinking* that led us to create that abstraction was informed by understanding network tradeoffs.

---

In the next lecture, we'll explore **Serverless Architecture**—an architectural style that embraces distributed computing fully, letting cloud providers manage infrastructure while you focus on business logic. Serverless pushes many of the concerns we discussed today (scaling, availability, security) to the platform level—with its own tradeoffs.

