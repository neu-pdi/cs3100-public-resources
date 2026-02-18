---
sidebar_position: 8
image: /img/labs/web/lab8.png
---

# Lab 8: Architecture

![Lo-fi pixel art showing two developers at a large table covered with a messy sprawl of tangled class diagrams, spaghetti arrows, and sticky notes labeled with feature names: 'Devices', 'Rules', 'Notifications', 'Analytics', 'Users'. The mess represents SceneItAll's current monolith. One developer holds a pair of large scissors, about to cut along dotted lines that carve the mess into clean, color-coded regions. The other developer holds a magnifying glass with four colored lenses labeled 'Rate of Change', 'Actor', 'ISP', 'Testability' — the boundary-finding heuristics. On a corkboard behind them: a clean C4 component diagram showing the proposed modular structure with hexagonal modules and labeled interfaces between them, alongside a pinned index card titled 'ADR-001' with checkmarks and warning symbols. A whiteboard in the corner shows a simple System Context diagram with stick figures and boxes. On the table, a coffee mug reads 'It Depends' — the architect's motto. Title: 'Lab 8: Architecture'. Warm evening lighting, cozy collaborative workspace atmosphere.](/img/labs/web/lab8.png)

In this lab, you'll step back from writing code and think like a software architect. The SceneItAll monolith is growing — it started as a handful of classes, and now it has five feature areas that are starting to step on each other. Your job is to figure out how to organize this codebase into well-structured **modules** with clean boundaries between them. You'll apply the boundary-finding heuristics, quality attribute vocabulary, and communication tools (C4 diagrams, ADRs) from Lectures 16–19 to make — and justify — real design decisions.

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
- "Today you're thinking like software architects — no code, all reasoning."
- "You'll take the SceneItAll codebase — which has been a single ball of classes — and figure out how to carve it into well-structured modules."
- "This builds directly on Lectures 16–19: testability, DI, architectural drivers, boundary heuristics, C4, and ADRs."

**Soft Skill Focus — Justifying Design Decisions (3 minutes):**

Read this to students:

> "Architects don't just make decisions — they justify them. Today, practice making your reasoning explicit:
>
> - **State your position with evidence:** 'I think X should be a separate module because it changes at a different rate than Y'
> - **Use the vocabulary:** Coupling type, quality attribute, boundary heuristic — not just gut feeling
> - **Acknowledge tradeoffs:** 'This adds an interface, but the testability gain is worth it because...'
> - **Push back constructively:** 'I see why you'd separate those, but wouldn't that create stamp coupling between them?'
>
> In Part 4, you'll compare your architecture with another pair. Strong reasoning matters more than the 'right answer.'"

**Pair Formation (3 minutes):**
- Have students pair up with someone they haven't worked with recently
- If odd number, form one group of three
- **Step 1:** Introduce yourself to your partner. Ask what part of the architecture lectures they found most interesting or confusing. Note your partner's name in `REFLECTION.md`.

:::

## Learning Objectives

By the end of this lab, you will be able to:

- Identify **architectural drivers** (functional requirements, quality attributes, and constraints) that shape how a codebase should be organized
- Apply **boundary-finding heuristics** (rate of change, actor, interface segregation, testability) to determine where to draw module boundaries within a monolithic application
- Sketch **C4 diagrams** at the System Context (Level 1) and Component (Level 3) levels to communicate a modular architecture
- Write an **Architecture Decision Record** (ADR) that captures the context, decision, and consequences of a boundary choice
- Evaluate how a boundary decision affects **quality attributes** like testability, changeability, and simplicity

## Before You Begin

**Prerequisites:** Complete Lectures 16–19. You should be familiar with:
- Observability, controllability, and hexagonal architecture (Lecture 16)
- Dependency injection and the singleton anti-pattern (Lecture 17)
- Architectural drivers, boundary heuristics, C4 model, and ADRs (Lecture 18)
- Quality attributes and architectural styles (Lecture 19)

**Clone the Lab Repository:** Clone your lab8 repository from Pawtograder.

The repository includes:
- `REFLECTION.md` — where all your written analysis goes
- `diagrams/` — folder for your C4 diagrams (hand-drawn photos or Mermaid files)

**No code this week!** This lab is entirely about analysis, reasoning, and communication. All deliverables go in `REFLECTION.md` and `diagrams/`.

---

## The Scenario: SceneItAll's Growing Monolith

SceneItAll has been a single Java application — one `build.gradle`, one `src/` tree, one deployment. It started small, but now it has five feature areas that are starting to tangle:

1. **Device Management** — Adding, removing, and configuring IoT devices (cameras, thermostats, lights, sensors). Checking device health. Processing firmware update requests.
2. **Automation Rules** — Users create rules like "if motion detected after 10pm, turn on porch light and send alert." Rules reference devices, user preferences, and time.
3. **Notification System** — Sends alerts via push, email, SMS. Supports quiet hours, batching, and user channel preferences. (You analyzed three implementations of this in Lab 4!)
4. **Analytics & Reporting** — Historical device data, energy usage reports, trend analysis. Read-heavy — it queries data but rarely writes.
5. **User & Home Management** — User accounts, home configurations, device groups, sharing permissions between household members.

Right now, these features are all jumbled together — classes from different features import each other freely, there's a `DatabaseConnection` singleton that everything uses, and adding a new notification channel required touching files in four different packages. It's becoming a maintenance headache.

### The Constraints

- This is a **single deployable application** — one JAR, one `main()`. We're not splitting into separate servers.
- The codebase must be **testable without real IoT hardware** — you need to be able to test business logic (e.g., "should this automation rule fire?") with test doubles.
- There are **8 developers** on the team. Two people shouldn't need to coordinate just because their features happen to share a file.
- All dependencies between modules should flow through **interfaces**, not concrete classes (DIP from L8, DI from L17).

### The Question

**How should the SceneItAll codebase be organized into modules?** Which classes belong together? What interfaces should sit between modules? Where do the package boundaries go?

A "module" here means a **cohesive group of classes** behind a well-defined interface — think of it as a package (or package tree) that exposes a public API and hides its internals. Same principles as class-level information hiding (L6), but applied at a bigger scale.

---

## Part 1: Identifying Architectural Drivers (15 minutes)

Before drawing any boxes, you need to understand the forces that will shape the module structure.

### Exercise 1.1: Functional Requirements

Review the five feature areas listed above. With your partner, answer in `REFLECTION.md`:

1. Which features **share data** most heavily? (e.g., automation rules need to know about devices — what else is tightly connected?)
2. Which features could **function independently** if other modules were broken? (e.g., should analytics still work if the notification system has a bug?)
3. Where does **the Lab 4 notification system** fit? You analyzed three implementations of notification logic — which module does it belong in, and what does it need from other modules?

### Exercise 1.2: Quality Attributes

For each quality attribute below, rate its importance to SceneItAll (High / Medium / Low) and note which feature areas it affects most:

| Quality Attribute | Importance (H/M/L) | Which features does it affect most? |
|-------------------|--------------------|------------------------------------|
| **Testability** | ? | ? |
| **Changeability** | ? | ? |
| **Simplicity** | ? | ? |
| **Modularity** | ? | ? |
| **Maintainability** | ? | ? |

**Discuss with your partner:** Do any quality attributes **conflict**? For example, maximizing modularity (more interfaces, more packages) might hurt simplicity (more indirection to understand). Where's the sweet spot?

### Exercise 1.3: Constraints as Architecture

Look at the four constraints listed above. For each one, discuss:
- Does this constraint **force** a particular design choice?
- Does it **eliminate** an option you might otherwise consider?

For example: "testable without real IoT hardware" means device interactions must go through injectable interfaces — that's hexagonal architecture (L16) applied inside the device management module. And the `DatabaseConnection` singleton? That's the L17 anti-pattern. It needs to become an injected dependency.

**Record your analysis in `REFLECTION.md`** (Questions 1–3).

### 🔄 Sync Point 1

**Lab leaders will facilitate a brief discussion (5 minutes):**
- "Which quality attributes did most pairs rate as High? Did anyone rate Simplicity higher than Modularity?"
- "What constraints felt most constraining? Did anyone find that a constraint essentially made a decision for them?"
- Highlight: "Remember from L18 — architectural decisions are the ones that are *expensive to change*. Rearranging your package structure after the whole team has been building features for six months is painful. Getting module boundaries roughly right early saves a lot of refactoring later."

---

## Part 2: Finding Module Boundaries (20 minutes)

Now apply the four boundary-finding heuristics from L18 to decide how to partition SceneItAll's code.

### Exercise 2.1: Rate of Change

Think about how often each feature area is likely to change:

| Feature Area | How often does it change? | Why? |
|-------------|--------------------------|------|
| Device Management | ? | ? |
| Automation Rules | ? | ? |
| Notification System | ? | ? |
| Analytics & Reporting | ? | ? |
| User & Home Management | ? | ? |

**Discussion prompt:** Should features that change at very different rates live in the same module? If notification logic changes weekly but user account management changes twice a year, what happens when they're tangled together?

### Exercise 2.2: Actor Analysis

Different people (or teams) care about different parts of the system. Map the actors to the feature areas they'd primarily work on:

- **Frontend developer** building the user dashboard — which modules do they interact with?
- **IoT integration developer** adding support for a new device brand — which modules do they touch?
- **Developer improving notification delivery** — which modules do they need?
- **Developer building a new analytics report** — which modules do they query?

Does this suggest natural boundaries? If two developers can work on their features without coordinating or merging conflicts, that's a sign the modules are well-separated.

### Exercise 2.3: Apply All Four Heuristics

Now consider **interface segregation** and **testability** alongside the first two heuristics:

- **Interface segregation:** Would a single `SceneItAllFacade` class that exposes everything force clients to depend on methods they don't use? What interfaces would let each module get only what it needs from other modules?
- **Testability:** Which module groupings let you test business logic (e.g., "should this automation rule fire?") without setting up the notification system, the analytics pipeline, *and* the device hardware?

### Exercise 2.4: Draw Your Boundaries

Based on your analysis, decide on your module structure. You might keep some features together or separate them differently from the five listed above. There's no single right answer — but you need to **justify your choices using the heuristics**.

For each module, also think about:
- **What interface does this module expose to the rest of the application?** (This is the "port" in hexagonal architecture.)
- **What does this module need from other modules?** (These are its dependencies — which should be injected, not reached for via singletons.)

In `REFLECTION.md` (Question 4), describe:
- How many modules did you identify?
- What is each one responsible for?
- Which heuristic(s) most strongly influenced each boundary?
- What are the key interfaces between modules? (e.g., "Automation Rules depends on a `DeviceController` interface provided by Device Management")

### 🔄 Sync Point 2

**Lab leaders will facilitate a discussion (5 minutes):**
- "How many modules did your pair identify? Did anyone keep two feature areas together? Did anyone split a feature area into two modules?"
- "For pairs that chose different structures: what drove the difference? Was it a quality attribute tradeoff?"
- Key insight: "More modules = better changeability and testability, but more interfaces to define and more indirection to trace. Fewer modules = simpler, but harder to work on independently. This is the fundamental tension."

---

## Part 3: Communicating Your Architecture (20 minutes)

Architecture that only exists in your head is folklore (L18). Now communicate your design using C4 diagrams and an ADR.

### Exercise 3.1: C4 Level 1 — System Context

Draw a **System Context diagram** (C4 Level 1) showing:
- The SceneItAll application as a single box
- The actors who use it (end users, power users, the operations team)
- External systems it interacts with (IoT devices, email/SMS providers, a database)

This is the "elevator pitch" diagram — someone unfamiliar with the system should understand what it does and who uses it.

You can draw this:
- **On paper** and photograph it (put the photo file in `diagrams/`)
- **As a Mermaid diagram** in a file in `diagrams/` (see the hint below)

> 💡 **Mermaid hint:** You can write diagrams as text that render as graphics. Here's a starter:
> ```
> graph TD
>     User([End User]) -->|"manages devices,<br/>creates rules"| System[SceneItAll]
>     System -->|"sends alerts"| Email[Email/SMS Provider]
>     System -->|"controls"| Devices[IoT Devices]
> ```
> Add the other actors and external systems.

### Exercise 3.2: C4 Level 3 — Component Diagram

Now zoom *inside* the SceneItAll application and draw a **Component diagram** (C4 Level 3) showing:
- Each module you identified in Exercise 2.4
- The interfaces each module exposes (its public API)
- The dependency arrows showing which modules depend on which interfaces
- The direction of those arrows — remember DIP: arrows should point toward abstractions

**Important design decision:** How does data flow between modules? Do they share one database connection (common coupling) or does each module define its own repository interface (data coupling)? This is the same question from L18 — Pawtograder's narrow API vs. Bottlenose's shared database — but applied inside a single application.

> 💡 **Mermaid hint for class/component diagrams:**
> ```
> graph TD
>     subgraph Automation["Automation Rules Module"]
>         RuleEngine[Rule Engine]
>     end
>     subgraph Devices["Device Management Module"]
>         DeviceController[Device Controller]
>     end
>     RuleEngine -->|"uses DeviceControlPort"| DeviceController
> ```

### Exercise 3.3: Write an ADR

Pick the **most consequential** boundary decision you made — the one where the tradeoffs were most interesting — and write an Architecture Decision Record.

Use this template in `REFLECTION.md` (Question 5):

```
**ADR-001: [Title — describe the decision]**

**Context:** [What situation prompted this decision? What requirements or
constraints are relevant?]

**Decision:** [What did you decide? Be specific.]

**Consequences:**
- ✅ [Positive consequence — which quality attribute improves?]
- ✅ [Another positive consequence]
- ⚠️ [Negative consequence or tradeoff — what gets harder?]
- ⚠️ [Another tradeoff]
```

**Examples of good ADR topics:**
- "Separate Notification module vs. embedding notification logic in each module that needs to send alerts"
- "Shared repository layer vs. each module owning its own data access"
- "Automation Rules as its own module vs. part of Device Management"
- "Replacing the DatabaseConnection singleton with injected repository interfaces"

### 🔄 Sync Point 3

**Lab leaders will check in:**
- "Did anyone struggle with Level 1 vs. Level 3? What's the difference in what you show?"
- "For the ADR: what decision did you find most interesting to write about?"
- "Did the act of writing the ADR change your mind about anything? Sometimes formalizing tradeoffs reveals something you hadn't considered."

---

## Part 4: Architecture Comparison (10 minutes)

### Exercise 4.1: Compare with Another Pair

Find another pair and share your Component diagrams and ADRs. As you compare:

1. **Where do your boundaries differ?** Did the other pair combine things you separated, or vice versa?
2. **What heuristic drove the difference?** Did they prioritize a different quality attribute?
3. **Read each other's ADR.** Is the reasoning convincing? Would you push back on anything?

### Exercise 4.2: What Would You Change?

After seeing the other pair's architecture, would you change anything about your own? Record in `REFLECTION.md` (Question 7):
- What was the most interesting difference between your architectures?
- Did the other pair's reasoning change your mind about anything?
- If you could revise your module structure, what (if anything) would you change?

### 🔄 Sync Point 4

**Lab leaders will facilitate a final discussion (5 minutes):**

*Technical debrief:*
- "Did any pair end up with the same module structure as another pair? Why or why not?"
- "What was the most controversial boundary? Where did pairs disagree most?"
- Key insight: "Architecture is about tradeoffs, not right answers. Two teams can make different decisions and both be correct — as long as each can justify their choice in terms of quality attributes, constraints, and heuristics."

*Soft skill debrief:*
- "When you compared architectures with the other pair, did anyone find it hard to explain *why* they made a particular choice? That's exactly why ADRs exist."
- "In industry, you'll often inherit a codebase someone else structured. Being able to read an ADR and understand *why* a decision was made — even if you disagree — is a critical skill."

---

## Reflection

You should have been writing in `REFLECTION.md` throughout the lab. Before submitting, make sure you've answered all of these questions:

### Partner Introduction

**Partner's Name:** Record your partner's name here.

### Part 1: Architectural Drivers

1. **Data Dependencies:** Which feature areas share data most heavily? Which could function independently?

2. **Quality Attribute Ratings:** Copy your completed quality attributes table. For two attributes you rated "High," explain *why* they're critical for SceneItAll.

3. **Constraints:** Which constraint had the biggest impact on your architectural thinking? How did it eliminate or force a specific choice?

### Part 2: Boundaries

4. **Your Boundaries:** How many modules did you identify? List each one, its responsibilities, the key interface(s) it exposes, and which heuristic(s) most strongly influenced that boundary.

### Part 3: Communication

5. **Your ADR:** The full ADR from Exercise 3.3.

6. **Diagram Reflection:** Was it harder to draw the Level 1 (System Context) or Level 3 (Component) diagram? Why?

### Part 4: Comparison

7. **Architecture Comparison:** What was the most interesting difference between your module structure and the other pair's? Did their reasoning change your mind about anything?

### Meta

8. **Connections:** Pick one of your boundary decisions and explain how it connects to a specific concept from an earlier lecture (e.g., a coupling type from L7, DIP from L8, observability from L16, DI vs. singleton from L17). Be specific — name the concept and explain the connection.

9. **Personal Takeaway:** What's one thing about architectural thinking that you'll carry into your next assignment or project?

---

## Optional Extensions

### Stretch Goal 1: C4 Level 4 — Code Diagram for One Module

Pick one of your modules and draw a Level 4 (Code) diagram showing the actual classes and interfaces inside it. Show:
- The public interface the module exposes
- The internal classes that implement it
- Any ports and adapters (hexagonal architecture from L16)
- How dependencies would be injected (L17)

### Stretch Goal 2: Quality Attribute Scenarios

For two quality attributes, write a concrete **quality attribute scenario** (from L19). A scenario specifies:

| Element | Description |
|---------|------------|
| **Stimulus** | What event triggers the scenario? |
| **Source** | Where does the stimulus come from? |
| **Environment** | What's the system state when it happens? |
| **Response** | What should the system do? |
| **Response Measure** | How do we know it succeeded? |

Example: "When a developer adds support for a new notification channel (stimulus), only the Notification module needs to change (response), and no tests in other modules break (measure)."

### Stretch Goal 3: Second ADR

Write a second ADR for a different decision. Good candidates:
- How automation rules reference devices (direct dependency vs. event-based)
- Whether analytics queries the same database tables as device management or reads from a separate view/cache
- How user preferences are accessed by modules that need them (shared service vs. passed as parameters)

---

## Submission Checklist

**Due:** By the end of your lab section (with a 10-minute grace period).

Before your final submission, ensure:

- [ ] Part 1: You've analyzed drivers, quality attributes, and constraints
- [ ] Part 2: You've applied the four heuristics and identified module boundaries
- [ ] Part 3: You have a Level 1 diagram, a Level 3 diagram, and an ADR
- [ ] Part 4: You've compared your architecture with another pair
- [ ] `REFLECTION.md` is complete with all 9 questions answered
- [ ] Diagrams are in `diagrams/` (photos or Mermaid files)
- [ ] All changes are committed and pushed to GitHub
