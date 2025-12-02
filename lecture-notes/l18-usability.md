---
sidebar_position: 18
lecture_number: 18
title: Usability
---

## Define usability and describe the five key aspects of usability (15 minutes)

There's a significant gap between software that *works* and software that people *want to use*. You can build a system that passes every test, implements every requirement, and never crashes—and still end up with software that users hate, avoid, or misuse. This gap is what usability addresses.

Consider our SceneItAll IoT platform. From a purely functional perspective, we might say it "works" if:
- Users can create Scenes that control multiple devices
- AreaScenes correctly cascade to nested areas
- Device states update when Scenes are activated

But working correctly is table stakes. The real questions are: Can a homeowner figure out how to create their first Scene without reading a manual? Can they quickly activate "Movie Night" when guests are waiting? Will they remember how to adjust settings a month from now? Do they *enjoy* using the app, or do they dread it?

**Usability** is a measure of how well an artifact (software, device, interface) supports humans in achieving their goals. It's not a single property but rather a collection of related qualities that together determine whether software serves its users well.

### The Five Aspects of Usability

Usability researchers have identified five key aspects that together capture what makes software usable:

**1. Learnability**: How easy is it for users to accomplish tasks the first time they encounter the system?

A highly learnable interface allows new users to become productive quickly. For SceneItAll, high learnability might mean a new user can figure out how to turn on the living room lights within seconds of opening the app—without any tutorial or documentation.

Learnability often depends on how well the interface matches users' existing mental models. If SceneItAll uses terminology and interactions that feel natural based on users' experience with physical light switches and other apps, it will be more learnable.

**2. Effectiveness**: Can users successfully complete their intended tasks?

An effective system allows users to achieve their goals. This sounds obvious, but it's surprisingly easy to build interfaces where users *think* they've completed a task but haven't, or where certain tasks are technically possible but practically impossible to discover.

For SceneItAll, effectiveness means: Can a user actually set up an AreaScene that cascades "Nighttime" settings from the top-level "House" area down to "Bedroom" and "Living Room"? If users consistently fail at this task—even when they're trying—the system has an effectiveness problem.

**3. Productivity**: How efficiently can users accomplish tasks once they've learned the system?

Productivity measures the ongoing cost of using the system. Even if users *can* accomplish tasks, how much time and effort does it take? A productive interface minimizes unnecessary steps, provides shortcuts for common operations, and doesn't waste users' time.

Consider two SceneItAll interfaces for dimming all lights in the Living Room to 50%:
- **Interface A**: Open app → Navigate to Areas → Select Living Room → Select each light individually → Adjust each dimmer → Confirm each change (12+ taps)
- **Interface B**: Open app → Long-press Living Room → Drag brightness slider (3 actions)

Both are *effective* (the task gets done), but Interface B is far more *productive*.

**4. Retainability**: How well do users maintain their proficiency over time?

Users don't interact with most software constantly. They learn it, then come back days, weeks, or months later. Retainable interfaces are ones where users can pick up where they left off without having to re-learn the system.

If a SceneItAll user sets up their home in September, then tries to add a new Scene in December, will they remember how? Retainability is closely related to learnability—interfaces that match natural mental models tend to be both easier to learn initially and easier to remember later.

**5. Satisfiability**: How pleasant is the experience of using the system?

Satisfiability captures the subjective, emotional response to using software. Do users enjoy the experience? Do they feel confident and in control, or frustrated and confused? Would they recommend the app to a friend?

This might seem "soft" compared to the other aspects, but it matters enormously. Users who find software satisfying will use it more, explore its features, and forgive occasional problems. Users who find it frustrating will use it minimally, miss useful features, and switch to alternatives at the first opportunity.

### Trade-offs Between Aspects

These five aspects don't always align. Design decisions that improve one aspect may harm another:

| Decision | Helps | Hurts |
|----------|-------|-------|
| Add a detailed tutorial on first launch | Learnability | Satisfiability (for impatient users) |
| Provide keyboard shortcuts for power users | Productivity | Learnability (more to discover) |
| Use creative, app-specific icons | Satisfiability (distinctive brand) | Learnability (unfamiliar symbols) |
| Show all device options on one screen | Productivity (fewer navigations) | Learnability (overwhelming for beginners) |

Good usability design requires understanding which aspects matter most for your users and your context—which depends on understanding who your stakeholders are.

### Example: CLI vs. GUI for SceneItAll

Imagine two hypothetical interfaces for SceneItAll:

**Command-Line Interface (CLI)**:
```
> scene activate "Movie Night" --area "Living Room" --cascade
Scene "Movie Night" activated for Living Room and 2 nested areas.
```

**Graphical Interface (GUI)**: A mobile app with touch-friendly buttons, visual device status indicators, and drag-and-drop Scene editing.

How do these score across the five aspects?

| Aspect | CLI | GUI |
|--------|-----|-----|
| Learnability | Low (must learn commands) | High (visual, explorable) |
| Effectiveness | High (if you know commands) | High (guided interactions) |
| Productivity | Very high (for experts) | Medium (more taps, but discoverable) |
| Retainability | Low (easy to forget syntax) | High (visual cues aid memory) |
| Satisfiability | Varies (some love CLIs) | Generally higher for most users |

Neither is universally "better"—it depends on who's using it and for what. A home automation installer who configures dozens of homes might prefer the CLI for its productivity. A homeowner who interacts with the app a few times a week would likely prefer the GUI for its learnability and retainability.

This analysis also suggests a possible design direction: provide both, with the GUI as the default and a CLI or "expert mode" available for power users. This is an example of *flexibility*, which we'll see again when we discuss Nielsen's heuristics.

### Mental Models: Why Usability Depends on User Expectations

We've mentioned "mental models" several times. A **mental model** is a user's internal representation of how something works—their understanding of the system's structure and behavior. Usability problems often arise when the system's actual behavior diverges from the user's mental model.

Consider a classic example from household appliances: a refrigerator with separate freezer and refrigerator compartments, each with its own temperature dial.

Most users form a mental model like this:
- The freezer dial controls the freezer temperature
- The refrigerator dial controls the refrigerator temperature
- The two controls are independent

But many refrigerators actually work differently: there's only a single cooling system with one temperature sensor. One dial controls the *overall* cooling power, while the other controls *how that cooling is distributed* between the two compartments. The controls interact in non-obvious ways—turning up the freezer might actually make the refrigerator warmer.

The result? Users who want a colder freezer turn up the freezer dial, find their refrigerator getting warmer, turn up the refrigerator dial to compensate, and end up in a frustrating cycle of adjustments. The system *works correctly*—it does exactly what it's designed to do—but it violates users' mental models, making it difficult to use effectively. Higher-end residential refrigerators have *two* cooling units, allowing for independent control of the freezer and refrigerator temperatures, but at a greater manufacturing and maintenance cost.

**SceneItAll mental model example**: Suppose a user creates a Scene called "Movie Night" that dims the Living Room lights to 20%. They also have an AreaScene called "Evening" on the parent "Downstairs" area that sets all lights to 50%. 

The user activates "Movie Night," sees the lights dim to 20%, and is satisfied. Later, someone else activates "Evening" on "Downstairs." What should happen to the Living Room lights?

Different users might have different mental models:
- "AreaScenes cascade down, so Evening should override Movie Night → lights go to 50%"
- "I explicitly set Movie Night, so it should stick → lights stay at 20%"
- "The most recent action wins → lights go to 50%"
- "Device-level Scenes take precedence over AreaScenes → lights stay at 20%"

Whatever behavior SceneItAll actually implements, it will violate *someone's* mental model. Good usability design means either (a) choosing behavior that matches the most common mental model, (b) making the actual behavior clearly visible in the interface, or (c) both.

## Identify stakeholders and their usability concerns (10 minutes)

We've been talking about "users" as if they're a single, homogeneous group. But real software serves multiple stakeholders with different goals, contexts, and usability needs. Failing to identify all relevant stakeholders—especially indirect ones—is a common source of usability failures.

### Who Are the Stakeholders?

A **stakeholder** is anyone who is affected by the system or has an interest in its success. For usability purposes, we care about anyone who *interacts* with the system or is *impacted* by others' interactions with it.

**Direct stakeholders** interact with the software themselves:
- **Primary users**: People who use the system regularly to accomplish their main goals
- **Secondary users**: People who use the system occasionally or for specific tasks
- **Operators/administrators**: People who configure, maintain, or support the system

**Indirect stakeholders** don't use the software but are affected by it:
- People in the environment where the software is used
- People whose data is managed by the system
- People who depend on the system's outputs

### SceneItAll Stakeholders

Let's enumerate SceneItAll's stakeholders:

| Stakeholder | Type | Primary Goals | Key Usability Concerns |
|-------------|------|---------------|------------------------|
| Homeowner (daily) | Primary user | Control devices, activate Scenes | Productivity, satisfiability |
| Homeowner (setup) | Secondary user | Configure Areas, create Scenes | Effectiveness, learnability |
| Guest | Secondary user | Basic device control | Learnability (extreme) |
| Professional installer | Operator | Initial configuration, troubleshooting | Productivity, effectiveness |
| Family members | Indirect | Live in the home | Safety, not being disrupted by others' actions |
| Neighbors | Indirect | Live nearby | Not affected by outdoor lighting/sound |

Notice that "family members who don't use the app" are stakeholders—if one person's Scene activation plunges the whole house into darkness, non-users are affected. Neighbors are stakeholders if SceneItAll controls outdoor lighting or audio systems.

### Different Stakeholders, Different Priorities

Each stakeholder group may prioritize the five usability aspects differently:

**Guest** (extreme learnability): A guest has never seen SceneItAll before and may never use it again. They just want to turn on a light. If the interface requires any learning at all, they'll give up and ask the homeowner for help (or fumble for a physical switch). For this stakeholder, *learnability* dominates everything else.

**Professional installer** (productivity over learnability): An installer configures dozens of homes. They'll invest time learning the system because that investment pays off repeatedly. They want keyboard shortcuts, batch operations, and power-user features. *Productivity* matters far more than learnability. Observing the current trends in this industry, it is likely that professional installers also have values in direct conflict with homeowners: if the installer gets an hourly fee for updating the system, they may prefer that the homeowner *can not* update the system at all!

**Homeowner** (balanced, but retainability matters): The homeowner uses the app regularly but not constantly. They need to remember how things work between sessions. They want a satisfying experience because they chose this product. *Retainability* and *satisfiability* matter more than for other stakeholders.

### Methods for Identifying Stakeholders

How do you make sure you've identified all relevant stakeholders? Several techniques help:

**Stakeholder mapping**: Start with the obvious users, then systematically ask: "Who else interacts with this system? Who is affected by its outputs? Who is in the environment where it's used? Who provides inputs or data? Who maintains or supports it?"

**Personas**: Create detailed fictional characters representing each stakeholder type. Give them names, backgrounds, goals, and frustrations. This makes abstract stakeholder categories concrete and helps the team empathize with different perspectives.

**User journey mapping**: Trace the complete path of interaction with your system. At each step, ask: "Who else is involved or affected here?" This often reveals stakeholders you'd miss by thinking only about the core interaction.

**"Who could be harmed?"**: Especially important for safety-related usability. Ask explicitly: if this system is misused or fails, who could be harmed? This surfaces indirect stakeholders who might otherwise be overlooked.

### Competing Concerns and Trade-offs

Stakeholder needs often conflict. A design that maximizes productivity for the installer (dense screens, technical terminology, minimal confirmation dialogs) may be unusable for guests or occasional users.

When conflicts arise, you must make deliberate trade-offs:
- **Prioritize by frequency and impact**: How often does each stakeholder use the system? What's the cost of poor usability for each?
- **Segment the interface**: Provide different modes or views for different stakeholders (expert mode vs. simple mode)
- **Find designs that satisfy multiple concerns**: Sometimes creative solutions serve everyone (progressive disclosure shows simple options first, with advanced options available but not prominent)

The key is to make these trade-offs *consciously*, with awareness of who is affected—not accidentally, by only considering the stakeholders who were obvious from the start.

## Recognize the relationship between usability and safety (5 minutes)

**Safety** is a property of a system that ensures it does not cause unacceptable harm to people, property, or the environment. More formally, a system is safe if it remains free from conditions that can cause death, injury, occupational illness, damage to equipment or property, or environmental harm.

Note that safety is defined in terms of *harm*, not *correctness*. A system can be correct (doing exactly what it was specified to do) and still be unsafe. Conversely, a system can have bugs but still be safe if those bugs don't lead to harmful outcomes.

This distinction matters for usability: software can be *correct* (it does what it was programmed to do), but the interaction between the software and human users can still lead to *unsafe outcomes*. Consider SceneItAll: if a confusing interface leads a user to believe they've armed "Vacation Mode" for their entire home when they've actually only set up lighting automation, the software worked correctly—but the user's home may be at risk.

Poor usability increases the probability that humans will make errors. Users might:
- **Slip**: Intend to do the right thing but accidentally do something else (tap "Unlock" instead of "Lock" because the buttons are adjacent)
- **Lapse**: Forget to complete an action due to interruption (start configuring "Away Mode," get distracted, leave it incomplete)
- **Mistake**: Intentionally take an action that's wrong for their goal due to a mismatched mental model (assume AreaScenes include locks when they only control lights)

In safety-critical domains—medical devices, aviation, industrial control systems—usability isn't a nice-to-have; it's a safety requirement. Confusing interfaces have contributed to radiation overdoses, plane crashes, and nuclear accidents. These systems are also typically regulated (by the government, or by an industry standard organization) with formal processes to evaluate their safety.

We'll return to safety in more depth toward the end of the course, when we examine larger-scale systems where the safety implications of software design decisions become even more apparent. For now, keep in mind that when we discuss heuristics like "Error Prevention" and "Help users recognize, diagnose, and recover from errors," we're not just talking about user satisfaction—we're talking about preventing harm.

## Introduce approaches to evaluating usability (5 minutes)

So we want usable software. How do we know if we have it?

There's a fundamental tension in evaluating usability: we want to find problems *early* (when they're cheap to fix), but the best evidence about usability comes from *real users* interacting with *real software* (which comes late). Different evaluation approaches navigate this trade-off differently:

**User studies and usability testing**: Observe actual users attempting real tasks with your software. This provides the highest-fidelity feedback—you see exactly where users struggle, what confuses them, and how they actually behave (as opposed to how they *say* they behave). The downsides: you need working software, recruiting users takes time and money, and you can only test with a limited number of people.

**Surveys and feedback mechanisms**: Ask users about their experience through questionnaires, interviews, or in-app feedback tools. This scales better than observation and can capture subjective satisfaction. The downside: users often can't articulate *why* something is hard to use, and self-reported behavior doesn't always match actual behavior.

**Heuristic evaluation**: Have experts (or even non-expert reviewers following a checklist) examine the interface against established usability principles. This can be done early—even on paper prototypes or wireframes—without recruiting users. The downside: experts may miss problems that real users would encounter, or flag issues that don't actually matter in practice.

In the next lecture, we'll explore **user-centered design**—a process that integrates user feedback throughout development using techniques like prototyping and iterative testing. That approach emphasizes getting real user input as early and often as possible.

For the remainder of *this* lecture, we'll focus on **heuristic evaluation**: a technique you can apply right now, on any interface, without needing to recruit users. It won't catch everything, but it's a practical tool that every developer should have in their toolkit.

## Apply Nielsen's 10 Usability Heuristics to evaluate an interface (15 minutes)

Jakob Nielsen's 10 usability heuristics are a widely-used checklist for evaluating interfaces. They were developed in the 1990s but remain remarkably relevant. When conducting a heuristic evaluation, you systematically examine an interface against each principle, noting violations and their severity.

### H1: Visibility of System Status

The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.

*SceneItAll example*: When a user activates a Scene, does the app immediately show which devices are being controlled and their target states? If the user taps "Movie Night" and nothing visibly changes for several seconds, they don't know if the command was received, is in progress, or failed.

### H2: Match Between System and the Real World

The system should speak the users' language, with words, phrases, and concepts familiar to the user, rather than system-oriented terms.

*SceneItAll example*: Does the app use "Scene" and "AreaScene" (developer concepts) or more natural terms like "Preset" and "Room Settings"? Are lights described by their technical capabilities ("TunableWhiteLight") or by their location and purpose ("Kitchen pendant")?

### H3: User Control and Freedom

Users often choose system functions by mistake and need a clearly marked "emergency exit" to leave the unwanted state without having to go through an extended dialogue.

*SceneItAll example*: If a user accidentally activates "Party Mode" at 11 PM, is there an obvious way to quickly undo it? A prominent "Restore Previous" or "All Off" button provides that emergency exit (but "All Off" might also be a dangerous action!).

### H4: Consistency and Standards

Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.

*SceneItAll example*: If swiping left on a device in one screen deletes it, swiping left should do the same thing everywhere—not sometimes delete and sometimes edit. If the app uses a gear icon for settings in one place, it shouldn't use a hamburger menu elsewhere.

### H5: Error Prevention

Even better than good error messages is a careful design which prevents a problem from occurring in the first place.

*SceneItAll example*: When creating a Scene, can the user accidentally exclude devices they meant to include? A design that shows all available devices with checkboxes (opt-in) prevents errors better than one that requires users to remember and manually add each device.

### H6: Recognition Rather Than Recall

Minimize the user's memory load by making objects, actions, and options visible. The user should not have to remember information from one part of the dialogue to another.

*SceneItAll example*: When editing a Scene, does the user have to remember which devices are in the Living Room, or does the app show them? When setting a brightness level, does the user have to recall that their preferred "dim" setting is 35%, or can they pick from labeled presets like "Dim," "Medium," "Bright"?

### H7: Flexibility and Efficiency of Use

Accelerators—unseen by the novice user—may often speed up the interaction for the expert user such that the system can cater to both inexperienced and experienced users.

*SceneItAll example*: A novice might navigate through menus to find and activate a Scene. An expert might use a home screen widget, a voice command, or a keyboard shortcut. The interface should support both without forcing experts through the novice flow every time.

### H8: Aesthetic and Minimalist Design

Dialogues should not contain information which is irrelevant or rarely needed. Every extra unit of information in a dialogue competes with the relevant units of information and diminishes their relative visibility.

*SceneItAll example*: The main screen should emphasize the most common actions (activate Scenes, control devices) rather than cluttering it with rarely-used options like "Export Configuration" or "View API Logs." Advanced features can live in secondary menus.

### H9: Help Users Recognize, Diagnose, and Recover from Errors

Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution.

*SceneItAll example*: **Bad**: "Error 0x4F: Device communication timeout." **Good**: "Couldn't reach the Living Room lamp—it may be unplugged or offline. Check the lamp's power connection, or remove it from this Scene to continue."

### H10: Help and Documentation

Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation. Any such information should be easy to search, focused on the user's task, list concrete steps, and not be too large.

*SceneItAll example*: When a user is setting up their first AreaScene with cascading behavior, contextual help ("What does 'cascade to nested areas' mean?") is more useful than a 50-page PDF manual. The help should explain the concept in one paragraph with a concrete example.

---

These heuristics overlap and reinforce each other. An interface that violates H1 (visibility) often also violates H9 (error recovery)—if users can't see what's happening, they can't tell when something goes wrong. Use the heuristics as a systematic checklist, but don't treat them as completely independent concerns.
