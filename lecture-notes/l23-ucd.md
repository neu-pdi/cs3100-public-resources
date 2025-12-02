---
sidebar_position: 23
lecture_number: 23
title: User-Centered Design
---

## Describe the value of user-centered design in software development (10 minutes)

In the previous lecture, we introduced usability and heuristic evaluation—a technique for finding usability problems by examining an interface against established principles. Heuristic evaluation is valuable because you can do it early, without users. But it has a fundamental limitation: **experts evaluating against heuristics are not the same as real users trying to accomplish real goals**.

Heuristic evaluation catches obvious violations, but it misses problems that emerge from the gap between the designer's mental model and the user's mental model. An expert might look at SceneItAll's Scene creation flow and find no heuristic violations—while a real homeowner struggles for ten minutes trying to figure out how to include their bedroom lights.

**User-Centered Design (UCD)** is a design philosophy and process that addresses this limitation by putting real users at the center of the design process. The core principle is simple: **design *with* users, not *for* users**.

### The Participatory Approach, Revisited

This idea should sound familiar. In [Lecture 9](l9-requirements.md), we contrasted the extractive approach to requirements ("What features do you need?") with the participatory approach ("Tell me about your grading challenges. Can you show me?"). We argued that treating users as design partners rather than requirement sources leads to better solutions—ones that neither party would have imagined alone.

UCD extends this participatory philosophy beyond initial requirements gathering into the entire design and development process. Users aren't consulted once at the beginning and then again at the end for acceptance testing. Instead, they're involved continuously: reviewing designs, testing prototypes, and providing feedback at every stage.

### The Timing Problem

There's a fundamental tension in software development:

- **We want to find problems early**, when they're cheap to fix
- **The best evidence about usability comes from real users with real software**, which comes late

If we wait until we have working software to get user feedback, we've already invested significant effort. Discovering at that point that users can't figure out the basic workflow means expensive rework.

UCD's answer to this tension is **iterative development with increasing fidelity**. We get user feedback throughout development using prototypes of increasing realism:

| Stage | Prototype Fidelity | Investment to Create | Cost to Change |
|-------|-------------------|---------------------|----------------|
| Early | Paper sketches | Minutes | Zero |
| Middle | Interactive mockups | Hours | Low |
| Late | Working prototypes | Days | Medium |
| Final | Production software | Weeks/Months | High |

By testing with users at each stage, we catch problems when they're still cheap to fix. A paper prototype might reveal that our entire approach to Scene creation is confusing—better to discover that before writing any code.

## Describe the UCD process: prototyping and evaluation for usability (20 minutes)

UCD follows an iterative cycle: **Understand → Design → Prototype → Evaluate → Repeat**. Each iteration increases our understanding of users' needs and moves us closer to a solution that truly serves them.

### The Iterative Cycle

**1. Understand**: Who are the users? What are their goals? What's their context? This builds on the stakeholder analysis from [Lecture 18](l18-usability.md)—we need to know who we're designing for before we can design effectively.

**2. Design**: Based on our understanding, create a design that addresses user needs. Early designs might be conceptual ("the user will create Scenes by selecting devices and setting their states"); later designs become specific interface layouts.

**3. Prototype**: Build a representation of the design that users can interact with. This doesn't need to be working software—even paper sketches can be "interactive" if a facilitator simulates system responses.

**4. Evaluate**: Put the prototype in front of real users and observe what happens. Where do they struggle? What surprises them? What do they try to do that the design doesn't support?

**5. Repeat**: Incorporate findings into the next iteration. Maybe we need to go back to understanding (we discovered a stakeholder we missed), or just refine the design based on specific feedback.

### Prototyping Approaches

Different prototype fidelities serve different purposes:

#### Paper Prototypes (Low Fidelity)

Hand-drawn sketches of screens, with a human "playing computer" to respond to user actions.

**How it works**: The facilitator shows a paper screen. When the user "taps" a button, the facilitator swaps in a new paper screen showing the result. The facilitator can simulate any system behavior—including behaviors that haven't been implemented or even fully designed.

**SceneItAll paper prototype session**:

> *Facilitator shows sketch of main screen with device list*
> 
> "You want to create a new Scene for movie night. What would you do?"
> 
> *User*: "I'd tap... is this a menu? Or do I tap on one of these devices?"
> 
> *Facilitator*: "What would you expect each to do?"
> 
> *User*: "If I tap the menu, maybe there's a 'Create Scene' option? If I tap a device, maybe it lets me control just that device?"
> 
> *Facilitator shows menu paper*: "You tapped the menu. Here's what you see."
> 
> *User*: "Oh, 'New Scene' is here. I'll tap that."
> 
> *Facilitator shows Scene creation screen*

**What we learn**: Users expected "Create Scene" in the menu (good, that's where we put it). But the hesitation about device taps reveals confusion—users aren't sure what's a Scene operation vs. a device operation. Maybe we need clearer visual separation.

**Advantages**: 
- Extremely fast to create (minutes)
- Easy to modify during the session ("What if it looked like this instead?")
- Users feel comfortable criticizing paper ("This is just a sketch")
- Forces focus on concepts, not visual polish

**Limitations**:
- Can't test detailed interactions (drag-and-drop feel, animation timing)
- Facilitator responses may not match what software would actually do
- Some users have trouble imagining the paper as real software

#### Wizard-of-Oz Prototypes (Medium Fidelity)

The interface looks realistic, but a human behind the scenes simulates system responses.

**How it works**: The user sees what appears to be a working app (could be a clickable mockup, a slide deck, or even a real UI). But instead of actual code processing their inputs, a hidden "wizard" observes and triggers appropriate responses.

**SceneItAll Wizard-of-Oz example**:

The user sees a realistic-looking tablet interface. They tap "Create Scene," select devices, set brightness levels, and tap "Save." Behind a partition, a facilitator watches via screen share and manually updates a shared display to show the Scene being added to the list.

The user can even "activate" the Scene—the wizard manually triggers smart bulbs in the test room to change.

**What we learn**: With realistic-looking interfaces, users behave more naturally. We can test whether the actual terminology and visual design work. The realistic environment (actual lights responding) reveals whether users trust the feedback they're seeing.

**Advantages**:
- More realistic user behavior than paper
- Can test detailed visual design decisions
- Users experience actual physical feedback (lights change, etc.)
- Good for testing complex flows that are hard to "paper simulate"

**Limitations**:
- Takes longer to create than paper
- Wizard may introduce inconsistencies (responds differently each time)
- Harder to modify mid-session
- Can be awkward if the wizard is slow or makes mistakes

#### Working Prototypes (High Fidelity)

Real code that implements the user interface, but with limited or simulated backend functionality.

**How it works**: The UI is fully implemented and responsive. But instead of connecting to real device APIs, it might use mock data, hardcoded responses, or simplified logic.

**SceneItAll working prototype**:

A real mobile app that lets users create Scenes, select devices, and set states. The device list comes from a hardcoded JSON file (not actual device discovery). "Activating" a Scene updates the UI but doesn't control real devices—or controls one demo bulb in the test room.

**What we learn**: Working prototypes reveal issues that only emerge with real interaction—animation timing, scroll performance, gesture recognition. They also test whether the implementation matches the design intent.

**Advantages**:
- Most realistic user experience
- Tests actual interaction patterns
- Reveals implementation-specific issues
- Can be deployed for remote testing

**Limitations**:
- Significant development investment
- Harder to change based on feedback
- Users may not distinguish prototype limitations from design decisions
- Risk of "throwaway code" becoming production code

#### Using AI as a Prototyping Accelerator

AI tools can significantly speed up prototype creation—but with important caveats aligned with our course principles about thoughtful AI usage.

What AI is good for:

- Generating UI code quickly: "Create an HTML/CSS mockup of a mobile app screen with a list of smart home devices and a floating 'Create Scene' button"
- Creating realistic sample data: "Generate 20 realistic smart home device names for a prototype, including lights, thermostats, and blinds"
- Producing design variations: "Show me three different layouts for a Scene creation wizard"
- Writing Wizard-of-Oz scripts: "Write a simple server that returns mock device status data"
- Drafting user test scenarios: "Suggest 5 task-completion scenarios for testing a Scene management interface"

What AI cannot do:

- Replace actual user testing: AI can generate prototypes, but it cannot tell you whether real users will understand them. The entire point of UCD is that *you can't predict user behavior from first principles*—you must observe it.
- Know your specific users: AI generates "average" designs based on training data. Your users (professional installers? elderly homeowners? tech enthusiasts?) have specific needs AI doesn't know.
- Evaluate its own output for usability: AI can check heuristics mechanically, but it lacks the human judgment to weigh trade-offs or recognize when a "violation" is actually fine in context.

A suggested workflow:
1. Use AI to generate prototype artifacts quickly (mockups, sample data, test scripts)
2. Critically review the output for domain accuracy and alignment with your understanding
3. Put the prototype in front of real users—this step cannot be AI-assisted
4. Incorporate findings manually—AI can help implement changes, but you decide what changes to make based on user feedback

### User Evaluation Methods

Once we have a prototype, how do we learn from users interacting with it?

#### Think-Aloud Protocol

Users verbalize their thoughts while using the prototype.

**How it works**: "As you use this, please tell me what you're thinking. What are you looking at? What are you trying to do? What do you expect to happen?"

**Example think-aloud transcript**:

> "OK, I want to make a movie night Scene... I see this menu button... I'll tap it... 'New Scene,' that makes sense... Now it's asking for a name, I'll type 'Movie Night'... Now I see devices... I need to find my living room lights... these are sorted alphabetically? I wish they were grouped by room... OK, I found 'Living Room Lamp'... I'll tap it... nothing happened? Oh wait, there's a checkbox, I need to tap the checkbox not the name... that's confusing..."

**What we learn**: Think-aloud reveals the user's mental model in real-time. We hear their expectations ("grouped by room"), confusions ("nothing happened?"), and workarounds ("I need to tap the checkbox not the name").

#### Task Completion Testing

Give users specific tasks and observe whether they can complete them.

**Example tasks for SceneItAll**:
1. Create a Scene called "Morning" that turns on the kitchen lights to 75%
2. Edit the "Movie Night" Scene to also close the living room blinds
3. Delete a Scene you no longer need
4. Activate a Scene from the home screen widget

**Metrics**:
- **Success rate**: What percentage completed the task?
- **Time on task**: How long did it take?
- **Error rate**: How many wrong paths did they try?
- **Assistance needed**: Did they ask for help?

**What we learn**: Quantitative data on where users succeed and fail. If 80% can create a Scene but only 30% can edit one, we know where to focus improvement.

#### A/B Testing

Compare two design alternatives with different user groups.

**Example**: We're unsure whether Scene creation should start with "name the Scene" or "select devices." We create two versions:

- **Version A**: Name → Select Devices → Set States → Save
- **Version B**: Select Devices → Set States → Name → Save

Half our test users get Version A, half get Version B. We measure task completion time, error rate, and user satisfaction.

**What we learn**: Data to resolve design debates. If Version B users are faster and make fewer errors, we have evidence (not just opinions) for that approach.

### Incorporating Findings

Evaluation produces findings. Turning findings into improvements requires:

**1. Prioritization**: Not every problem is equally important. Prioritize by:
- Severity (prevents task completion vs. minor annoyance)
- Frequency (affects most users vs. rare edge case)
- Cost to fix (quick change vs. architectural restructure)

**2. Root cause analysis**: Users said "the checkbox is confusing." But why? Options:
- The checkbox is too small (visual design fix)
- Users expect tapping the row to select (interaction pattern fix)
- Users don't understand they need to select devices (conceptual model fix)

**3. Solution design**: Multiple solutions might address the same problem:
- Make the whole row tappable (interaction fix)
- Add a "Select devices" header (label fix)
- Use a different selection pattern entirely (redesign)

**4. Validation**: After implementing changes, test again to confirm the fix works without introducing new problems.

## Apply UCD as a requirements elicitation technique (15 minutes)

Here's the insight that elevates UCD from "usability technique" to "essential development practice": **when you put real users in front of real (or simulated) interfaces, you discover all kinds of requirements—not just usability concerns**.

### Revisiting Requirements Elicitation

In [Lecture 9](l9-requirements.md), we covered multiple requirements elicitation methods:
- Interviews (hear what people say they need)
- Observation (see what people actually do)
- Workshops (resolve conflicts between stakeholders)
- **Prototyping** (make ideas concrete and get specific feedback)
- Document analysis (understand existing constraints)
- Scenarios (trace through specific use cases)

Prototyping was listed as one method among several. But UCD shows why prototyping is uniquely powerful: **it reveals requirements that no other method can surface**.

### What UCD Reveals

#### Functional Requirements

During a SceneItAll prototype session:

> *User tries to create a Scene*
> 
> "Wait, I want this Scene to only run at night. Like, if I accidentally hit 'Movie Night' during the day, I don't want it to close all the blinds."
> 
> *Facilitator*: "So you want Scenes to have conditions for when they run?"
> 
> *User*: "Yes! Or maybe just a confirmation? 'You're activating Movie Night during daytime. Are you sure?'"

This is a functional requirement (conditional Scene execution or confirmation dialogs) that emerged only because the user was actually trying to create a Scene. No interview question about "what features do you need?" would have surfaced this.

#### Edge Cases and Error Handling

> *User activates a Scene*
> 
> *System shows "Scene activated" but user looks confused*
> 
> "The lights didn't change. Did it work?"
> 
> *Facilitator*: "What would you expect to see if it didn't work?"
> 
> *User*: "Some kind of error? Like 'Couldn't reach Living Room Lamp'? Right now I have no idea if it worked or if something's broken."

This reveals a requirement for device-level feedback and error reporting—not just "Scene activated" but status per device.

#### Workflow Mismatches

> *User creates a Scene with 8 devices*
> 
> "This is taking forever. I have to set each light individually?"
> 
> *Facilitator*: "How would you prefer to do it?"
> 
> *User*: "Well, these are all in the living room. I should be able to say 'all living room lights to 50%' in one step."

This reveals that the design assumes per-device configuration, but users think in terms of rooms and groups. This is more than a usability issue—it's a fundamental workflow mismatch that might require rethinking the domain model.

#### Hidden Assumptions

> *Two users happen to be testing at the same time*
> 
> User A activates "Movie Night." User B (different room) says "Hey, my lights just changed!"
> 
> "Is this a shared house? What if my roommate has their own Scenes?"

The prototype assumed single-user households. Multi-user scenarios introduce entirely new requirements: user accounts, permissions, Scene ownership, conflict resolution.

### UCD Reduces All Three Risk Dimensions

In [Lecture 9](l9-requirements.md), we identified three dimensions of requirements risk:

**Understanding Risk** (How well do we understand what's needed?): UCD directly reduces understanding risk. Instead of interpreting requirements documents, you watch users interpret your interface. When User A says "I expected this to group by room" and User B says "Why aren't these alphabetical?", you've learned that users have different mental models—and you've learned it concretely, not abstractly. Having a representative set of users test your prototype is key to reducing this risk.

**Scope Risk** (How much are we trying to build?): Prototyping reveals hidden complexity. The "simple" Scene feature turns out to need conditional execution, per-device feedback, multi-user support, and room-level grouping. Better to discover this scope expansion during paper prototyping than during implementation.

**Volatility Risk** (How likely are requirements to change?): Early user feedback lets you pivot before committing. If prototype testing reveals that users fundamentally misunderstand your Scene/AreaScene model, you can redesign the concept before building it. Discovering this after implementation means expensive rework.

Requirements documents describe what people say they need; prototypes reveal what they actually need. Both are valuable, but prototypes with real users provide a kind of ground truth that discussion alone cannot achieve.

When done well, UCD creates a continuous feedback loop between users, requirements, domain understanding, and implementation. The result isn't just more usable software—it's software that more accurately solves the real problem.