---
sidebar_position: 3
image: /img/labs/web/lab3.png
---

# Lab 3: Specification Detective

![Concept: 'The Specification Detective Agency' (Finding Flaws Before They Become Bugs) - A lo-fi pixel art scene of a cozy detective's office at night, rendered in warm amber desk lamp tones against deep blue shadows. The color palette evokes noir mystery with a technical twist. CENTER: A detective figure (representing the student) sits at a wooden desk covered with magnifying glasses, specification documents, and sticky notes. They're examining a Javadoc comment through a large magnifying glass that reveals hidden problems—the glass shows 'null?' and 'empty list?' annotations appearing over seemingly innocent code. LEFT WALL - 'CASE FILES': Three folders labeled with the crimes: 'TOO VAGUE' (a blurry document), 'TOO RESTRICTIVE' (a document wrapped in chains), 'UNCLEAR' (a document with question marks floating off it). Each has a red 'UNSOLVED' stamp. RIGHT SIDE - 'EVIDENCE BOARD': A corkboard with specification snippets connected by red string. One snippet reads 'Returns the sum...' with an arrow pointing to a photo of a crashed program. Another shows '@Nullable' annotations circled in green as 'CLUES'. DESK ITEMS: A coffee mug reading 'I ♥ @NonNull', a notepad with the feedback form structure (one good thing, one suggestion, one question), and a rubber duck wearing a tiny detective hat. WINDOW: Through the rain-streaked window, city lights show other buildings where bugs lurk, waiting to be caught. A neon sign flickers: 'SPECS REVIEWED WHILE U WAIT'. The message: specifications are mysteries to be solved—find the gaps before your users do. Title at bottom: 'Lab 3: Specification Detective'](/img/labs/web/lab3.png)

In this lab, you'll evaluate and improve method specifications, learning to identify when specs are too vague, too restrictive, or unclear. You'll also practice using nullness annotations to express invariants in code.

:::info Grading: What You Need to Submit

**Due:** At the end of your scheduled lab section. This is automatically enforced with a 10-minute grace period, but **push your work regularly**—don't wait until the end!

**Option 1: Successful Completion**
- Complete Parts 1-3 of the lab
- All code compiles and runs correctly
- Push your completed work to GitHub
- Complete the reflection in `REFLECTION.md`

**Option 2: Partial Credit**
If you're unable to complete everything:
- Submit a `REFLECTION.md` documenting what you completed, where you got stuck, and what you tried
- A TA will review your submission and award credit for good-faith effort

:::

:::warning Attendance Matters

If lab leaders observe that you are **not working on the lab** during the section, or you **leave early** AND do not successfully complete the lab, you will receive **no marks**. However: if you finish the required parts of the lab and want to work on something else, just show the lab leader that you're done, and you'll be all set!

**Struggling? That's okay!** We are here to support you. Ask questions, work with your neighbors, and flag down a lab leader if you're stuck.

:::

## Lab Facilitator Notes

:::tip For TAs: Lab Start (5 minutes)

**Attendance:** Take attendance using the roster in Pawtograder.

**Quick Check-in (2 minutes):** Ask students how Assignment 1 is going. Remind them that office hours are available if they're stuck.

**Student Warm-up (3 minutes):**
- Have students turn to a neighbor
- Share: "What's one thing from Lectures 4-5 that you found surprising or confusing?"
- This surfaces concepts that may need reinforcement during the lab

**During Part 1:** Circulate and ensure students understand the three criteria (restrictiveness, generality, clarity) before they start evaluating specs.

:::

:::note Soft Skill Focus: Giving Specific, Actionable Feedback

This lab builds on Lab 2's "asking clarifying questions" by practicing **giving specific feedback**. When students review each other's specifications, TAs will coach them to:
- Point to a specific part of the spec
- Explain *why* it's problematic (to them)
- Suggest a concrete improvement

**Good feedback:** "In your `scheduleAction` spec, you don't mention what happens if `actionId` already exists. Should it throw an exception or overwrite?"

**Unhelpful feedback:** "Your specs are incomplete."

See the Soft Skill Introduction section after Sync Point 1 for the student-facing framing.

:::

## Learning Objectives

By the end of this lab, you will be able to:

- Evaluate specifications using the criteria of restrictiveness, generality, and clarity
- Identify under-specified behavior and explain its potential consequences
- Write improved specifications that balance all three criteria
- Apply JSpecify nullness annotations (`@NullMarked`, `@Nullable`) to express invariants

## Before You Begin

**Prerequisites:** Complete Lectures 4-5 and Flashcard Sets 3-4.

**Clone the Lab Repository:** Clone your lab3 repository in VSCode (go to clone from GitHub, and select your neu-cs3100/lab3-... repository). The repository includes:

**Core Classes** (`net.sceneitall.iot`):
- `IoTDevice.java`, `Light.java`, `DimmableLight.java`, `TunableWhiteLight.java` — the device hierarchy from previous labs

**Part 1: Specification Evaluation** (`net.sceneitall.iot.lab3.part1`):
- `SpecificationExercises.java` — flawed specifications for you to evaluate

**Part 2: Writing Better Specifications** (`net.sceneitall.iot.lab3.part2`):
- `DeviceScheduler.java` — class with method stubs where you'll write specifications

**Part 3: Nullness Annotations** (`net.sceneitall.iot.lab3.part3`):
- `LightingScene.java` — class where you'll add nullness annotations

---

## Part 1: Evaluating Specifications (15 minutes)

Good specifications are restrictive enough to rule out buggy implementations, general enough to allow correct ones, and clear enough that developers understand them quickly. In this exercise, you'll evaluate specifications that fail one or more of these criteria.

### Exercise 1.1: Identify Specification Flaws

Open `SpecificationExercises.java`. For each method, the specification has a problem. Your task: identify whether the spec fails **restrictiveness**, **generality**, or **clarity**, and explain why.

**Example A: Under-specified behavior**
```java
/**
 * Returns the average brightness of all lights in the list.
 * @param lights the lights to average
 * @return the average brightness
 */
public static int averageBrightness(List<Light> lights) {
    int sum = 0;
    for (Light light : lights) {
        sum += light.getBrightness();
    }
    return sum / lights.size();
}
```

Questions to consider:
- What happens if `lights` is null?
- What happens if `lights` is empty?
- Is this spec restrictive enough to rule out implementations that crash?

**Example B: Over-specified (not general)**
```java
/**
 * Finds a light with the specified brightness.
 * Iterates through the list from index 0 to the end.
 * At each index, checks if the light's brightness equals the target.
 * If found, returns that light. If not found after checking all lights,
 * returns null.
 *
 * @param lights the list of lights to search
 * @param targetBrightness the brightness level to find
 * @return the light with matching brightness, or null if not found
 */
public static Light findByBrightness(List<Light> lights, int targetBrightness)
```

Questions to consider:
- Does it matter *which* light is returned if multiple lights have the target brightness?
- Does the specification allow for a more efficient implementation (e.g., using a HashMap)?
- Is this specification describing *what* the method does or *how* it does it?

**Example C: Unclear specification**
```java
/**
 * Processes the lights appropriately based on the time of day.
 * @param lights the lights to process
 * @param hour the current hour (0-23)
 */
public static void adjustLightsForTime(List<Light> lights, int hour)
```

Questions to consider:
- What does "appropriately" mean?
- What should happen at hour 0 vs hour 12 vs hour 23?
- Could two developers implement this differently and both claim they're correct?

### Exercise 1.2: Document Your Analysis

In `SpecificationExercises.java`, fill in the TODO comments with your analysis. For each method, identify:
1. Which criterion (restrictiveness, generality, or clarity) the spec fails
2. A specific scenario where the flawed spec causes problems
3. A brief description of how you would improve it

```java
// TODO: Example A Analysis
// Criterion failed: _______________
// Problem scenario: _______________
// How to improve: _______________
```

### 🔄 Sync Point 1

**Lab leaders will pause here for discussion (5 minutes):**
- Ask groups: "Which criterion did Example A fail? What bad thing could happen?"
- Ask groups: "Why is Example B too operational? What correct implementations does it rule out?"
- Discuss: "The spec for Example C seems short—isn't shorter better for clarity?"

**Then introduce the soft skill focus for Part 2:**

> "For the rest of this lab, you'll be working with a partner. Today we're practicing *giving specific feedback*.
>
> Vague feedback like 'this spec is confusing' doesn't help anyone improve. Instead:
> - **Point to the specific part** of the spec
> - **Explain *why* it's problematic** (to you)
> - **Suggest a concrete improvement** (if you have one)
>
> **Good example:** 'In your `scheduleAction` spec, you don't mention what happens if `actionId` already exists. Would it throw an exception or overwrite the existing action?'
>
> **Not helpful:** 'Your specs are incomplete.'
>
> You'll each write specs individually first, then exchange and give each other feedback using this structure."

**Pair Formation:** Have students pair with someone nearby they haven't worked with yet. If odd number, form one group of three.

---

## Part 2: Writing & Reviewing Specifications (20 minutes)

Now that you can identify flawed specifications, it's time to write better ones—and practice giving specific feedback to a partner.

### Exercise 2.1: Write Specifications Individually (10 minutes)

Open `DeviceScheduler.java`. The class has method stubs with no documentation. Your task: write Javadoc specifications that are restrictive, general, and clear.

```java
public class DeviceScheduler {
    private Map<String, ScheduledAction> scheduledActions;

    public DeviceScheduler() {
        this.scheduledActions = new HashMap<>();
    }

    // TODO: Write a specification for this method
    public void scheduleAction(String actionId, IoTDevice device,
                               int hour, Runnable action) {
        // Implementation provided
    }

    // TODO: Write a specification for this method
    public void cancelAction(String actionId) {
        // Implementation provided
    }

    // TODO: Write a specification for this method
    public List<ScheduledAction> getActionsForDevice(IoTDevice device) {
        // Implementation provided
    }

    // TODO: Write a specification for this method
    public int countScheduledActions() {
        // Implementation provided
    }
}
```

**Guidelines for your specifications:**
- Specify what happens for edge cases (null inputs, missing IDs, empty states)
- Use `@param`, `@return`, and `@throws` tags appropriately
- Be concise but complete—aim for the "Goldilocks zone"
- Describe *what* the method does, not *how* it does it

### Exercise 2.2: Exchange and Review (10 minutes)

Now exchange your specifications with your partner. For each of their specifications, use the **Feedback Form** below.

:::tip Feedback Form

For each specification your partner wrote, provide:

1. **One thing that works well** — and *why* it works
   - Example: "Your `@throws` for null inputs is good because it tells me exactly what exception to expect."

2. **One specific suggestion** — pointing to a specific gap or issue
   - Example: "For `cancelAction`, what happens if the ID doesn't exist? Should it throw or silently do nothing?"

3. **One clarifying question** — something you'd need answered to implement it
   - Example: "In `getActionsForDevice`, is the returned list a copy or a live view of the internal data?"

:::

**Process:**
1. Read through all four of your partner's specifications
2. Fill out the feedback form (written notes help!)
3. Discuss your feedback with your partner—explain your reasoning
4. Each person should revise at least one specification based on feedback received

### 🔄 Sync Point 2

**Lab leaders will lead discussion (5 minutes):**
- Ask a few pairs: "What's the most useful piece of feedback you received?"
- Ask: "Did anyone's partner catch something you completely missed?"
- Compare different approaches: Did some specify what happens with duplicate IDs? Invalid hours?
- Discuss: "What's the minimum a spec needs to include to be 'restrictive enough'?"

---

## Part 3: Nullness Annotations (10 minutes)

Specifications in comments are helpful, but they're not enforced by the compiler. Nullness annotations let you express invariants about null values directly in your code, and the compiler can catch violations.

**Continue working with your partner** for this section. You can work on the same file together (one person "drives," the other "navigates") or work in parallel and compare solutions.

### Exercise 3.1: Add Nullness Annotations

Open `LightingScene.java`. This class represents a named collection of lights with specific settings. The package is already marked `@NullMarked`, meaning all types are assumed non-null by default.

Your task: Add `@Nullable` annotations where appropriate, and use `Objects.requireNonNull` where needed.

```java
public class LightingScene {
    private String name;
    private String description;  // May be null if no description provided
    private List<Light> lights;

    // TODO: Which parameters can be null? Add @Nullable where appropriate
    public LightingScene(String name, String description, List<Light> lights) {
        this.name = name;
        this.description = description;
        this.lights = new ArrayList<>(lights);
    }

    // TODO: Can this return null? Should it?
    public String getDescription() {
        return description;
    }

    // TODO: Add appropriate annotations and null handling
    public void setDescription(String description) {
        this.description = description;
    }

    // TODO: This method calls List.of() which never returns null,
    // but the nullness checker doesn't know that. How do you handle this?
    public List<Light> getLightsCopy() {
        return List.of(lights.toArray(new Light[0]));
    }
}
```

**Key decisions to make:**
- The `description` field can be null (it's optional). How do you annotate the getter and setter?
- The `name` and `lights` parameters should never be null. The `@NullMarked` package handles this, but should you add validation?
- The `getLightsCopy()` method calls `List.of()`, which never returns null. How do you tell the nullness checker?

### Exercise 3.2: Verify with the Compiler

Run the build to check for nullness errors:

```bash
# macOS/Linux
./gradlew build

# Windows
.\gradlew.bat build
```

If you see nullness-related warnings or errors, fix them by:
- Adding `@Nullable` where values can legitimately be null
- Adding null checks or `Objects.requireNonNull()` where values must not be null

### 🔄 Sync Point 3 & Debrief (10 minutes)

**Lab leaders will discuss nullness (5 minutes):**
- Ask: "What did you annotate as `@Nullable`? Why?"
- Ask: "When did you use `Objects.requireNonNull()`?"
- Discuss the tradeoff: More annotations = more safety but also more code to maintain

**Soft Skill Debrief (5 minutes):**

With your partner, discuss:
- "Which piece of feedback you received was most useful? Why?"
- "What made feedback easier to give or receive?"

Then, whole group discussion:
- Ask a few pairs to share: "What was the most valuable feedback you gave or received today?"
- Discuss: "How is giving feedback on specifications similar to or different from giving feedback on code?"
- Connect to professional practice: "In code review, specific feedback like 'this edge case isn't handled' is much more actionable than 'this needs work.'"

---

## Reflection

Complete the `REFLECTION.md` file with your answers to:

1. **Specification Evaluation:** For one of the flawed specifications in Part 1, explain what real-world bug could occur if a developer misunderstood the spec. Be specific—describe the scenario and consequence.

2. **Writing Specifications:** What was the hardest part of writing specifications in Part 2? Which of the three criteria (restrictiveness, generality, clarity) did you find most challenging to balance?

3. **Nullness Annotations:** In your own words, explain why `@NullMarked` with explicit `@Nullable` is preferred over marking every non-null parameter with `@NonNull`.

4. **Giving Feedback:** Describe one piece of specific feedback you gave your partner. What made it specific (pointed to a particular issue, explained why, suggested improvement)? How did your partner respond?

5. **Receiving Feedback:** What's one thing your partner's feedback revealed that you hadn't considered? How did you revise your specification in response?

---

## Optional Extensions

### Stretch Goal 1: Long-Term Consequences

Revisit Example C from Part 1 (`adjustLightsForTime`). Write two different implementations that both satisfy the vague specification but produce very different user experiences. In `REFLECTION.md`, explain:
- How could this ambiguity lead to bugs reported by users months after deployment?
- How would you improve the specification to prevent this?

### Stretch Goal 2: Specification for equals/hashCode

The `LightingScene` class doesn't override `equals` or `hashCode`. In `REFLECTION.md`:
1. Write a specification for what `equals` should do for `LightingScene`
2. Should two scenes with the same lights but different names be equal? What about same name but different lights?
3. Implement `equals` and `hashCode` based on your specification

### Stretch Goal 3: Functional Interface Specification

Write a specification for this functional interface and implement a method that uses it:

```java
@FunctionalInterface
public interface LightFilter {
    /**
     * TODO: Write a specification for this method
     */
    boolean test(Light light);
}
```

Then implement:
```java
public List<Light> filterLights(List<Light> lights, LightFilter filter) {
    // TODO: Implement using the filter
}
```

---

## Submission Checklist

**Due:** By the end of your lab section (with a 10-minute grace period).

Before your final submission, ensure:

- [ ] Part 1: You've analyzed all three flawed specifications in `SpecificationExercises.java`
- [ ] Part 2: You've written specifications for all four methods in `DeviceScheduler.java`
- [ ] Part 3: You've added nullness annotations to `LightingScene.java`
- [ ] `REFLECTION.md` is complete with all required answers
- [ ] Your code compiles: `./gradlew build` (Windows: `.\gradlew.bat build`)
- [ ] All changes are committed and pushed to GitHub