---
sidebar_position: 8
image: /img/labs/web/lab8.png
---

# Lab 8: Hexagonal Architecture

![Lo-fi pixel art showing two developers at a large table covered with a messy sprawl of tangled class diagrams, spaghetti arrows, and sticky notes labeled with feature names: 'Devices', 'Rules', 'Notifications', 'Analytics', 'Users'. The mess represents SceneItAll's current monolith. One developer holds a pair of large scissors, about to cut along dotted lines that carve the mess into clean, color-coded regions. The other developer holds a magnifying glass with four colored lenses labeled 'Rate of Change', 'Actor', 'ISP', 'Testability' — the boundary-finding heuristics. On a corkboard behind them: a clean C4 component diagram showing the proposed modular structure with hexagonal modules and labeled interfaces between them, alongside a pinned index card titled 'ADR-001' with checkmarks and warning symbols. A whiteboard in the corner shows a simple System Context diagram with stick figures and boxes. On the table, a coffee mug reads 'It Depends' — the architect's motto. Title: 'Lab 8: Architecture'. Warm evening lighting, cozy collaborative workspace atmosphere.](/img/labs/web/lab8.png)

In this lab, you'll refactor a tangled monolith into a clean hexagonal architecture — and practice explaining your design decisions clearly. The core skills here are architectural analysis, port and adapter design, and the ability to articulate *why* you made the choices you did.

**GitHub Copilot is available as an optional tool during Parts 2 and 3.** Using Copilot is not required — manual refactoring is equally valid. If you use Copilot, part of the work is evaluating whether its output actually follows hexagonal principles (which requires real design judgment). If you work manually, you'll document your reasoning instead. Either way, you'll explain your decisions to your partner using a structured format introduced after Part 1.

SceneItAll has five feature areas that are stepping on each other: infrastructure tangled with business logic, a `DatabaseConnection` singleton that everything reaches for, and code that requires a running IoT network just to run a test. Your job is to apply hexagonal architecture to untangle this — using whatever tools work best for you.

:::info Grading: What You Need to Submit

**Due:** At the end of your scheduled lab section. This is automatically enforced with a 10-minute grace period, but **push your work regularly**—don't wait until the end!

**Option 1: Complete entire lab**
- Complete Parts 1-4 of the lab
- Complete the reflection in `REFLECTION.md`
- Push your completed work to GitHub
- You may leave the lab after confirming with a TA that you're done

**Option 2: Complete what you are able and ask for help**
If you're unable to complete everything:
- Submit a `REFLECTION.md` documenting what you completed, where you got stuck, and what you tried
- A TA will review your submission and award credit for your good-faith effort

The **Optional Extensions** are not required for full credit but are excellent practice if you finish early.

:::

:::warning Attendance Matters

If lab leaders observe that you are **not working on the lab** during the section, or you **leave early** AND do not successfully complete the lab, you will receive **no marks**. However: if you finish the required parts of the lab and want to work on something else, just show the lab leader that you're done, and you'll be all set!

**Struggling? That's okay!** We are here to support you. If you're putting in effort and engaging with the material, we will give you credit. Ask questions, work with your neighbors, and flag down a lab leader if you're stuck.

:::

## Lab Facilitator Notes

:::tip For TAs: Lab Start (8 minutes)

**Attendance:** Take attendance using the roster in Pawtograder.

**Brief Intro (2 minutes):**
- "Today you'll analyze SceneItAll's messy codebase and apply hexagonal architecture — separating domain logic from infrastructure and replacing singletons with dependency injection."
- "You'll work individually for the first 15 minutes to form your own analysis of the code. Then you'll pair up."
- "GitHub Copilot is available as an optional design aid in Parts 2 and 3. It's not required — working manually is equally valid. What matters is that you understand your design and can explain it."

**Soft Skill Focus — Communicating Technical Decisions (3 minutes):**

Read this to students:

> "In professional software work, it's not enough to make a good design decision — you also need to be able to explain it clearly to teammates, to code reviewers, and to people who weren't in the room when you made it.
>
> Today you'll practice a structured format for this:
> **'I chose X because Y. I considered Z, but X is better for this situation because...'**
>
> This isn't just for presentations — it's how you'll explain your port interface choices to your partner, how you'll justify removing the singleton, how you'll communicate in a real code review. We'll use this format explicitly in Part 2 onward."

**Pair Formation (3 minutes):**
- Have students pair up with someone they haven't worked with recently
- If odd number, form one group of three
- **Step 1:** Introduce yourself to your partner. Each person shares one key observation from Part 1 in one sentence, using the format: *"I noticed X in the code, which made me think Y."*
- Note your partner's name in `REFLECTION.md`

:::

## Learning Objectives

By the end of this lab, you will be able to:

- Identify what belongs in the **domain** versus **infrastructure** within a feature area, and explain *why* mixing them hurts testability
- Design **port interfaces** that use only domain types and can be trivially stubbed for tests
- Critically evaluate code (whether AI-generated or manually written) using [L16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2) vocabulary: observability, controllability, ports, adapters
- Explain how **dependency injection** eliminates the `DatabaseConnection` singleton and what the resulting composition root looks like
- Communicate design decisions using a structured narrative: *"I chose X because Y. I considered Z, but X is better for this situation because..."*

## Before You Begin

**Prerequisites:** Complete Lectures 16 and 17. You should be familiar with:
- Observability, controllability, and hexagonal architecture ([Lecture 16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2))
- Separating infrastructure from domain code ([Lecture 16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2))
- Dependency injection, singleton anti-pattern, and composition roots ([Lecture 17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns))

**Clone the Lab Repository:** Clone your lab8 repository from Pawtograder.

The repository includes:
- `src/` — starter Java files with the current tangled SceneItAll code
- `REFLECTION.md` — where all your written analysis goes
- `diagrams/` — folder for your port/adapter diagrams

:::tip GitHub Copilot (Optional)

GitHub Copilot is available as an optional tool during Parts 2 and 3. You can use both **inline completions** (Tab to accept) and **Copilot Chat** (`Ctrl+I` / `Cmd+I` or the chat panel). [GitHub Copilot Chat](https://github.com/copilot) is also available in a browser.

**You are not required to use Copilot.** If you prefer to work through the design manually, that is equally valid — you'll document your reasoning instead of recording prompts.

:::

---

## Prompting Copilot for Design Tasks (Optional Reference)

If you choose to use Copilot, here's the key difference between a weak prompt and a strong one for architectural work:

| Weak Prompt | Why It Fails | Stronger Prompt |
|-------------|-------------|-----------------|
| "Extract an interface from this class" | Copilot will mirror the class's current methods, including infrastructure-specific ones | "Extract an interface that represents what the *domain* needs from device state — use only domain types, not Zigbee SDK types" |
| "Refactor to use dependency injection" | Copilot may add DI but leave singletons or add a service locator | "Refactor to use constructor injection. Remove all calls to `getInstance()`. The class should not access any global state." |
| "Generate a repository interface" | May expose storage-specific implementation details in the interface | "Generate a repository interface using only domain types. The interface should have no knowledge of how data is stored." |

**The pattern:** Specify the *design goal* (what principle you're following), the *constraints* (what should be absent from the output), and the *vocabulary* (domain types, not infrastructure types).

---

## The Scenario: SceneItAll's Growing Monolith

SceneItAll has been a single Java application — one `build.gradle`, one `src/` tree, one deployment. It started small, but now it has five feature areas that are starting to tangle:

1. **Device Management** — Adding, removing, and configuring IoT devices (cameras, thermostats, lights, sensors). Checking device health. Processing firmware update requests.
2. **Automation Rules** — Users create rules like "if motion detected after 10pm, turn on porch light and send alert." Rules reference devices, user preferences, and time.
3. **Notification System** — Sends alerts via push, email, SMS. Supports quiet hours, batching, and user channel preferences. (You analyzed three implementations of this in Lab 4!)
4. **Analytics & Reporting** — Historical device data, energy usage reports, trend analysis. Read-heavy — it queries data but rarely writes.
5. **User & Home Management** — User accounts, home configurations, device groups, sharing permissions between household members.

Right now, these features are all jumbled together — classes from different features import each other freely, there's a `DatabaseConnection` singleton that everything uses, and the `AutomationRuleEngine` reaches directly into a hardware SDK to check device states. Adding a new notification channel required touching files in four different packages.

Here's an example of what a piece of the current code looks like (also in `src/AutomationRuleEngine.java` in your repo):

```java
public class AutomationRuleEngine {
    public void evaluate(String homeId) {
        // Infrastructure: data access via singleton
        List<AutomationRule> rules = DatabaseConnection.getInstance()
            .loadRules(homeId);

        // Infrastructure: IoT hardware SDK call
        ZigbeeGateway gateway = ZigbeeGateway.getGlobalInstance();

        for (AutomationRule rule : rules) {
            // Domain: business logic (buried in the middle!)
            DeviceState state = gateway.readState(rule.getTriggerDeviceId());
            if (rule.conditionMet(state)) {
                // Infrastructure: direct HTTP call to notification service
                HttpClient client = HttpClient.newHttpClient();
                HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("http://notif-service/send"))
                    .POST(BodyPublishers.ofString(rule.getAlertMessage()))
                    .build();
                client.send(req, BodyHandlers.discarding());
            }
        }
    }
}
```

### The Constraints

- This is a **single deployable application** — one JAR, one `main()`. We're not splitting into separate servers.
- The codebase must be **testable without real IoT hardware** — you need to be able to test business logic (e.g., "should this automation rule fire?") with test doubles, not a live Zigbee network.
- All dependencies between modules should flow through **interfaces**, not concrete classes or singletons (DIP from [L8](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l8-design-for-change-2), DI from [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns)).

---

## Part 1: Understand the Architecture — Individual Work (15 minutes)

Before forming pairs, work through these exercises **on your own**. The goal is to develop your own analysis of the code — you'll bring these observations to your partner when you pair up.

### Exercise 1.1: Dissect AutomationRuleEngine

Look at the `AutomationRuleEngine.evaluate()` code above. Annotate each block manually (no Copilot yet):

1. Which lines are **domain logic** — the actual business decision being made?
2. Which lines are **infrastructure** — database access, hardware calls, HTTP?
3. The `conditionMet(state)` method is on `AutomationRule`. Is that domain or infrastructure? Why?
4. What makes this code **hard to test**? Apply the [L16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2) vocabulary: which parts hurt *controllability*? Which parts hurt *observability*?

Record your annotations in `REFLECTION.md` (Question 1). **Do this before pairing up** — having your own analysis first is how you'll know what's worth discussing with your partner.

### Exercise 1.2: What Would You Need to Stub?

The goal of hexagonal architecture is to make each feature's core logic testable *in isolation* — without spinning up real hardware, real network services, or a real data store.

For each of the five feature areas, complete this sentence:

> **"To test [feature]'s core business logic in isolation, I would need to stub out _____ ."**

For example: *"To test Automation Rules in isolation, I would need to stub out device state reads and outgoing notifications."*

Write your answer for each feature area in `REFLECTION.md` (Question 2) — just a sentence each. Then answer one more:

> **Which feature area would be hardest to test in isolation, and why?**

### 🔄 Sync Point 1

**Lab leaders will facilitate a brief discussion (5 minutes):**
- "What domain logic did you find in AutomationRuleEngine? What made it hard to see?"
- "Which feature area did most people identify as hardest to untangle? Why?"
- Key insight: "When domain logic is buried between infrastructure calls, you can't test the business rule without also setting up the database and the hardware. Hexagonal architecture extracts the domain so it can be tested in isolation."

*After the sync point: form pairs and read the soft skill introduction below before starting Part 2.*

---

## Pair Formation and Soft Skill Introduction

Find a partner you haven't worked with recently. Before starting Part 2, spend 2 minutes on this:

**Share your Part 1 observation** using this sentence frame:
> *"In AutomationRuleEngine, I noticed [X], which means [consequence for testability]."*

**Soft skill for today: Communicating Technical Decisions**

Throughout Parts 2 and 3, whenever you make or defend a design choice, practice this format:
> *"I chose [design element] because [reason]. I considered [alternative], but [my choice] is better for this situation because [specific reason]."*

Your partner's job when listening: ask *"Why did you prioritize that?"* — not to challenge, but to draw out more of your reasoning.

Record your partner's name in `REFLECTION.md`.

---

## Part 2: Design Ports (20 minutes)

Now define the **ports** — the interfaces that express what the domain needs from the outside world.

**Copilot is optional here.** You may:
- Use Copilot Chat to generate port interfaces and then evaluate the output against hexagonal architecture principles (see the prompting reference above)
- Design the interfaces manually using what you know from [L16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2)
- Use both — start manually, then check your design with Copilot (or vice versa)

Either way, record what you tried and what decisions you made.

### What Makes a Good Port (Review from [L16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2))

```java
// Good port: uses domain types, defined by what the DOMAIN needs
public interface DeviceStatePort {
    DeviceState getCurrentState(String deviceId);
}

// Bad port: leaks infrastructure types into the interface
public interface ZigbeeInterface {
    ZigbeeFrame sendFrame(byte[] payload);  // What the heck is a "ZigbeeFrame"???? It must be infrastructure!
}
```

A good port: uses **domain types** not infrastructure types; is **narrow** (only what's needed); can be **trivially stubbed** for tests.

### Exercise 2.1: Design Ports for AutomationRuleEngine

Design port interfaces for the three external dependencies in `AutomationRuleEngine`: data access, device state reads, and notification sending.

**If using Copilot**, start with a prompt like:
> *"I'm applying hexagonal architecture to this class. Identify the external dependencies and generate Java interface definitions for each one as ports. Each interface should use only domain types — no SDK types like ZigbeeFrame, no infrastructure types like HttpResponse."*

Then evaluate the output: Does each interface use domain types or infrastructure types? Is it narrow enough to be stubbed with a lambda in a test? If Copilot gets it wrong, write a follow-up prompt — for example:
> *"The `readState` method returns a `ZigbeeFrame`. That's an infrastructure type. Rewrite the interface so it returns `DeviceState` instead, where `DeviceState` is a domain object."*

**If working manually**, look at each external call in `evaluate()` and ask: "What does the domain *need* here, expressed purely in domain terms?" For example, the domain doesn't need to know about Zigbee protocols — it just needs to know about device states.

**Either way**, for each interface you decide to keep, record this in `REFLECTION.md` (Question 3):
> *"I defined [InterfaceName] as [brief description] because [reason]. I considered [alternative], but [my choice] is better here because [specific reason]."*

If you used Copilot, also note: your initial prompt, any problems in the first response, and follow-up prompts if needed.

### Exercise 2.2: Design Ports for One More Feature Area

Pick **one other feature area** (your choice) and repeat the process — Copilot-assisted, manual, or a mix.

In `REFLECTION.md` (Question 4), record your approach and the final port interfaces you chose, with at least one decision explained using the structured format.

### Exercise 2.3: Diagram Your Ports

For **one** feature area, create a diagram showing the hexagonal architecture — the domain, port interfaces, at least one production adapter, and one test double.

You can produce this in any way that works for you:
- Ask Copilot to generate a Mermaid diagram (see hint below)
- Draw it on paper and take a photo
- Sketch it in any diagramming tool

Save the result in `diagrams/automation-rules.md` (or a photo if paper). Check that your diagram correctly shows:
- Adapters depending on ports (arrows point inward)
- Test doubles implementing the same ports as production adapters
- The domain depending only on port interfaces, not on adapters

> 💡 **Mermaid hint** if you want to generate a diagram with Copilot:
> ```
> graph LR
>     subgraph Domain["Automation Rules Domain"]
>         RE[AutomationRuleEngine]
>         RP[RuleRepositoryPort <<interface>>]
>         DS[DeviceStatePort <<interface>>]
>     end
>     ...
> ```

Record what you produced and whether it correctly shows the hexagonal pattern in `REFLECTION.md` (Question 5).

### 🔄 Sync Point 2

**Before the group discussion:** Share one port design decision with your partner using the structured format — "I defined X as Y because..."

**Lab leaders will facilitate a discussion (5 minutes):**
- "What was the trickiest port to design — Copilot-generated or manual? Why?"
- "Did anyone get a port that leaked infrastructure types? What was the fix?"
- Key insight: "Whether you used Copilot or not, the same question applies: does this interface describe *what the domain needs*, or *how infrastructure works*? That's the test. Copilot often generates ports that reflect patterns from training data — including legacy code that violates exactly the principles you're learning. Manual design forces you to reason from first principles, which is a different (and complementary) skill."

---

## Part 3: Fix the DatabaseConnection Singleton (15 minutes)

The `DatabaseConnection` singleton is SceneItAll's biggest design problem. Every feature area reaches for it directly, which means nothing can be tested in isolation.

```java
// Current code — in src/DatabaseConnection.java
public class DatabaseConnection {
    private static DatabaseConnection instance;

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection(); // connects to production data store
        }
        return instance;
    }

    // Methods for every feature area — one giant object everyone shares:
    public List<AutomationRule> loadRules(String homeId) { /* ... */ }
    public void saveRule(AutomationRule rule) { /* ... */ }
    public List<IoTDevice> loadDevices(String homeId) { /* ... */ }
    public void saveDevice(IoTDevice device) { /* ... */ }
    public List<NotificationPreference> loadNotificationPreferences(String userId) { /* ... */ }
    public UsageReport loadUsageReport(String homeId, DateRange range) { /* ... */ }
    // ... and many more
}
```

### Exercise 3.1: Diagnose the Problem (No Copilot)

With your partner, answer in `REFLECTION.md` (Question 6) **before designing any replacement**:

1. From [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns): what are the **three problems** with singletons? Give a concrete example of each in the context of `DatabaseConnection`.
2. From [L16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2): does this singleton hurt **observability**, **controllability**, or both? Explain specifically.
3. If two tests run concurrently and both call `DatabaseConnection.getInstance()`, what could go wrong?

### Exercise 3.2: Design Repository Interfaces

For **two** of the five feature areas, design repository interfaces (ports for data access) that replace the singleton.

**If using Copilot**, try this prompt as a starting point:
> *"The `DatabaseConnection` singleton needs to be replaced with dependency injection. For the Automation Rules feature area, generate a `RuleRepository` interface that expresses what the domain needs for data access. The interface should use only domain types — the caller shouldn't know or care how data is stored. Also generate an `InMemoryRuleRepository` class that implements it using a `HashMap` for use in tests."*

**If working manually**, look at the `DatabaseConnection` methods for each feature area and design a focused interface that contains only what that feature needs. Use only domain types. Then sketch an in-memory implementation using a `HashMap`.

For each of the two feature areas, evaluate your result:
- Does the interface expose any storage-specific implementation details to callers? (It shouldn't.)
- Does the in-memory implementation actually implement the interface cleanly?
- Does the in-memory implementation have any calls to `DatabaseConnection`? (It shouldn't — that's the whole point.)

Record your approach (and Copilot prompts if applicable) and evaluations in `REFLECTION.md` (Question 7).

### Exercise 3.3: Design the Composition Root

If we inject all these dependencies, *someone* has to wire them up. In [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns) we called this the **composition root**.

**If using Copilot**, try this prompt:
> *"Show me what `SceneItAllApplication.main()` should look like after applying dependency injection throughout. It should create all the production adapter implementations, then wire them into the domain objects via constructor injection. There should be no calls to any `getInstance()` methods anywhere."*

**If working manually**, think through the full dependency graph: which domain objects need which ports, and which concrete adapters implement each port? Sketch the construction sequence in `main()`.

Either way, evaluate the result:
- Does it still contain any `getInstance()` calls? (Flag them if so.)
- Is it clear that this is the **only** place in the codebase that knows about concrete implementations?
- Does it look like the [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns) composition root pattern?

Record the composition root design and your evaluation in `REFLECTION.md` (Question 8).

### 🔄 Sync Point 3

**Lab leaders will check in:**
- "Did anyone's composition root have surprising complexity? What caused it?"
- "For those who used Copilot on 3.3 — did it remove all singleton calls, or miss some?"
- "For those who designed manually — what was the trickiest dependency chain to untangle?"
- Key insight: "The composition root reveals the full dependency graph of your system at a glance. If it's hard to read, your system might have too much coupling. If it's clean and linear, your hexagonal architecture is working."

---

## Part 4: Design Review and Debrief (10 minutes)

### Exercise 4.1: Explain a Decision to Another Pair

Find another pair and share screens or swap `REFLECTION.md` files. Each person explains **one key design decision** using the structured format:

> *"I chose [design element] because [reason]. I considered [alternative], but my choice is better for this situation because [specific reason connecting to testability or hexagonal architecture principles]."*

The listener's role: ask *"Why did you prioritize that quality attribute?"* and *"What would break if you'd gone with the alternative?"*

### Exercise 4.2: Technical Review

With the other pair, review each other's port interfaces:

1. **Infrastructure leakage check:** Do any port interfaces mention infrastructure types (HTTP, Zigbee, AWS, SMTP, or storage-specific details)?
2. **Singleton check:** Does the composition root have any `getInstance()` calls remaining?
3. **Testability check:** For each port, ask: "Could this be stubbed with a lambda or a simple in-memory class?" If not, what makes it hard to stub?

Record one observation from the review (for either pair's work) in `REFLECTION.md` (Question 9).

### 🔄 Sync Point 4 (Final Debrief)

*Soft skill debrief:*
- "What made your partner's explanation of a design decision convincing — or not?"
- "Did the structured format ('I chose X because Y') change how you thought about your own decision while explaining it?"

*Technical debrief:*
- "What was the trickiest port to design today, regardless of how you approached it?"
- "Did Copilot and manual approaches produce noticeably different results? What were the differences?"
- Key insight: "The ability to explain *why* you made a design decision is as important as making the right one. Code reviewers, teammates, and future-you all need the reasoning — not just the code."

---

## Reflection

You should have been writing in `REFLECTION.md` throughout the lab. Before submitting, make sure you've answered all of these questions:

### Partner Introduction

**Partner's Name:** Record your partner's name here.

### Part 1: Understanding the Code

1. **AutomationRuleEngine dissection:** Which lines are domain logic? Which are infrastructure? What hurts controllability? What hurts observability?

2. **Feature area stubs:** Your completed sentences about what would need to be stubbed for each feature area. Which area is hardest to untangle, and why?

### Part 2: Port Design

3. **AutomationRuleEngine port decisions:** For each port interface you designed, describe how you approached the design (Copilot-assisted, manual, or both) and explain your decision: *"I chose [interface design] because [reason]. I considered [alternative], but my choice is better here because [reason]."* If you used Copilot, include your initial prompt and any follow-up prompts.

4. **Second feature area port decisions:** Same analysis for your chosen second feature area.

5. **Diagram:** What you produced for the hexagonal architecture diagram, and whether it correctly shows the pattern (or what was off).

### Part 3: Fixing the Singleton

6. **Singleton diagnosis:** The three singleton problems (from [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns)) applied to `DatabaseConnection`. Whether it hurts observability, controllability, or both.

7. **Repository interface decisions:** Your approach to designing the interfaces (Copilot, manual, or both), and whether each result correctly avoids exposing storage details to callers.

8. **Composition root:** Your `main()` design and evaluation — any remaining `getInstance()` calls? Does it match the [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns) pattern?

### Part 4: Design Review

9. **Review observation:** One thing you noticed during the peer review — an infrastructure leak, a leftover singleton call, or a particularly clean port design. What would you change (or keep), and why?

### Meta

10. **Connections:** Pick one of your port design decisions and explain how it connects to a specific concept from an earlier lecture — a coupling type from [L7](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l7-design-for-change), DIP from [L8](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l8-design-for-change-2), observability/controllability from [L16](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l16-testing2), or DI vs. singleton from [L17](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l17-creation-patterns). Be specific: name the concept and explain the connection.

11. **Communication reflection:** Think about the structured decision format you practiced today — *"I chose X because Y. I considered Z, but X is better because..."* Was there a moment where articulating the reasoning out loud changed or clarified your thinking? What's one design decision from today that you could explain convincingly to a teammate who wasn't here?

12. **AI tool reflection:** If you used Copilot during this lab: what worked? What didn't? Would you use it differently for this type of design task in the future? If you worked manually: how did working without AI assistance affect your process compared to how you expected it to feel?

---

## Optional Extensions

### Stretch Goal 1: Write a Meaningful Unit Test

Using the port interfaces you designed in Part 2, write a JUnit 5 test for the `AutomationRuleEngine` that:
- Stubs all port interfaces using either lambdas or simple `InMemory*` implementations
- Tests a specific business scenario (e.g., "rule fires when motion is detected after 10pm")
- Runs in under 100ms with no real hardware, database, or network

Was writing the test easier or harder with the new port-based design than it would have been with the original singleton-based code?

### Stretch Goal 2: Compare Copilot vs. Manual Design

Design the same port interface for the Notification System feature **twice** — once using Copilot and once without looking at Copilot's output first (or without using Copilot at all if you used it earlier). Compare the results:
- Which approach produced a cleaner interface?
- What did Copilot get right? What did it miss?
- What does the comparison tell you about when AI tools are helpful for design work versus when they're likely to mislead?

Document both interfaces and your analysis in `REFLECTION.md`.

### Stretch Goal 3: Notification Port Design Challenge

Ask Copilot to generate a `NotificationPort` interface (or design one manually), then evaluate the result against these two competing designs:

**Option A:**
```java
public interface NotificationPort {
    void sendAlert(String userId, String message, NotificationChannel channel);
}
```

**Option B:**
```java
public interface NotificationPort {
    void sendAlert(AlertRequest request);
}
// where AlertRequest contains userId, message, channel, priority, quietHoursOverride, ...
```

Which design does Copilot naturally gravitate toward? Which better follows Interface Segregation ([L8](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l8-design-for-change-2))? Which creates data coupling vs. stamp coupling ([L7](https://neu-pdi.github.io/cs3100-public-resources/lecture-notes/l7-design-for-change))?

---

## Submission Checklist

**Due:** By the end of your lab section (with a 10-minute grace period).

Before your final submission, ensure:

- [ ] Part 1: You've classified infrastructure vs. domain for each feature area (individual work)
- [ ] Part 2: You've designed port interfaces (Copilot-assisted, manual, or both) with your design decisions recorded in `REFLECTION.md`
- [ ] Part 3: You've diagnosed the `DatabaseConnection` singleton and designed repository interfaces + composition root
- [ ] Part 4: You've explained at least one design decision to another pair using the structured format
- [ ] `REFLECTION.md` is complete with all 12 questions answered
- [ ] Your diagram is in `diagrams/` (Mermaid, photo of paper, or any other format)
- [ ] All changes are committed and pushed to GitHub
