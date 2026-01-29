---
sidebar_position: 5
image: /img/labs/web/lab5.png
---

![Lo-fi pixel art showing a central scene of a developer at a desk, puzzling over a short requirements document titled 'OFFICE HOURS SYSTEM'. The document is small and sparse—just a few bullet points visible. Around the developer's head, multiple translucent thought bubbles float outward like branching possibilities: one shows a video call interface, another shows a chat window, another shows a physical queue of students, another shows a ticket system with numbers. Each bubble is equally vivid, equally plausible. On the desk, a highlighter rests on phrases circled with question marks. A sticky note reads 'What does this MEAN?' In the background, a whiteboard shows the three risk dimensions: 'Understanding? Scope? Volatility?' with arrows pointing to a large question mark. Title: 'Lab 5: Requirements Engineering'. Warm evening lighting, cozy study room atmosphere.](/img/labs/web/lab5.png)

# Lab 5: Requirements Engineering

In this lab, you'll experience firsthand why requirements analysis matters. You and a partner will interpret an intentionally ambiguous project brief, then discover how dramatically your interpretation differs from another pair's—even though you read the exact same words. This "parallel universe" exercise demonstrates the critical importance of building shared understanding before writing code.

:::info Grading: What You Need to Submit

**Due:** At the end of your scheduled lab section. This is automatically enforced with a 10-minute grace period, but **push your work regularly**—don't wait until the end!

**Option 1: Complete entire lab**
- Complete Parts 1-5 of the lab
- Complete the reflection in `REFLECTION.md`
- Push your completed work to GitHub
- You may leave the lab after confirming with a TA that you're done

**Option 2: Complete what you are able and ask for help**
If you're unable to complete everything:
- Submit a `REFLECTION.md` documenting what you completed, where you got stuck, and what you tried
- A TA will review your submission and award credit for your good-faith effort

:::

:::warning Attendance Matters

If lab leaders observe that you are **not working on the lab** during the section, or you **leave early** AND do not successfully complete the lab, you will receive **no marks**. However: if you finish the required parts of the lab and want to work on something else, just show the lab leader that you're done, and you'll be all set!

**Struggling? That's okay!** We are here to support you. If you're putting in effort and engaging with the material, we will give you credit. Ask questions, work with your neighbors, and flag down a lab leader if you're stuck.

:::

## Lab Facilitator Notes

:::tip For TAs: Lab Start (10 minutes)

**Attendance** (2 min): Take attendance using the roster in Pawtograder.

**Brief Intro** (3 min):
- "Today we're exploring why requirements analysis matters through a hands-on experiment"
- "You'll interpret a project brief, negotiate with a partner, then discover how different your interpretation is from another pair's"
- "This connects directly to Lecture 9—understanding, scope, and volatility risk"

**Soft Skill Focus — Building Shared Understanding** (5 min):

Read this to students:

> "Today we're practicing *building shared understanding*. You'll discover firsthand how two people can read the same requirements and reach completely different conclusions.
>
> During pair work:
> - **Explain your interpretation and the reasoning behind it**
> - **Listen to understand** (not to argue)
> - **Identify where your interpretations differ**
> - **Create a merged understanding** that incorporates both perspectives
>
> **Critical rule:** During Parts 1 and 2, do NOT communicate with other pairs. We'll explain why later. Trust us—this is important for the exercise to work."

**Pair and Quad Formation** (3 min):
- Have students form pairs (A+B, C+D, etc.)
- Assign pairs to quads (Pair AB will later merge with Pair CD)
- **Physically separate pairs if possible**—they should not overhear each other's discussions
- **Step 1:** Introduce yourself to your partner. Record their name in `REFLECTION.md`.

:::

## Learning Objectives

By the end of this lab, you will be able to:

- Experience how the same requirements text can lead to dramatically different interpretations
- Identify ambiguous terms and hidden assumptions in requirements documents
- Apply the three risk dimensions (understanding, scope, volatility) to analyze requirements divergence
- Practice building shared understanding through structured negotiation
- Develop questions that would clarify ambiguous requirements

## Before You Begin

**Prerequisites:** Complete Lecture 9 (Interpreting Requirements). You should be familiar with:
- The three dimensions of requirements risk (understanding, scope, volatility)
- Stakeholder analysis and conflicting interests
- Requirements elicitation techniques

**Clone the Lab Repository:** Clone your lab5 repository from Pawtograder.

The repository includes:
- `REFLECTION.md` — where you'll record your interpretations, analysis, and reflections
- This lab has **no coding exercises**—it's entirely about requirements analysis

---

## The Scenario: Office Hours System

You've been hired to build a system for the CS department. Here's the brief you received:

:::note Project Brief

**OFFICE HOURS SYSTEM**

The CS department needs a system to help students get help from TAs.

Key points:
- Students can request help with course material
- TAs provide assistance during their scheduled hours
- The system should support both live help and leaving questions for later
- Students should know when they can expect a response
- TAs need to manage their workload fairly

Build something that works for a course with 300 students and 10 TAs.

:::

That's it. That's all you get.

Your job in this lab is to turn this vague brief into a concrete specification—and then discover what happens when different people interpret the same brief differently.

---

## Part 1: Individual Interpretation (15 minutes)

**Work alone for this part.** Do not discuss with your partner yet.

Read the project brief carefully. Then, working independently, complete the following exercises in your `REFLECTION.md`.

### Exercise 1.1: Your Requirements

List **5-7 specific requirements** you believe the system needs. For each requirement:
- State it clearly enough that another engineer could implement it
- Note any assumptions you're making
- Identify which stakeholder (student, TA, instructor, department) it primarily serves

**Example format:**
> **Requirement:** Students can join a virtual queue and see their position in real-time.
> **Assumption:** "Live help" means real-time chat or video, not in-person.
> **Stakeholder:** Students (reduces uncertainty about wait times)

### Exercise 1.2: Ambiguity Identification

List **3 or more terms or phrases** from the brief that you found unclear or ambiguous. For each:
- Quote the exact phrase
- Explain why it's ambiguous
- State what you *assumed* it means for your requirements above

**Example format:**
> **Phrase:** "live help"
> **Why ambiguous:** Could mean video call, text chat, screen sharing, or managing an in-person queue
> **My assumption:** Video call with screen sharing capability

**Write your answers in the "Part 1: Individual Interpretation" section of `REFLECTION.md` before proceeding.**

---

## Part 2: Pair Negotiation (20 minutes)

**Now work with your partner. Still no communication with other pairs!**

### Exercise 2.1: Share Interpretations (10 minutes)

Take turns sharing your individual interpretations from Part 1:
- Read your requirements aloud to your partner
- Discuss: Where do you agree? Where do you disagree?
- Identify: What assumptions did each of you make?

**Pay attention to moments where you made different assumptions about the same phrase.** These are the most interesting findings.

### Exercise 2.2: Joint Specification (10 minutes)

Together, create a **joint specification of exactly 8 requirements**:
- Each requirement must be specific enough that a developer could test whether it's been implemented correctly
- Both partners must agree on the exact wording
- Document any assumptions you're both making

**Write your joint specification in the "Part 2: Pair Specification" section of `REFLECTION.md`.**

The goal is consensus—you should both be able to defend every requirement as the "right" interpretation of the brief.

---

## Sync Point 1

:::tip For TAs: Sync Point 1 (5 minutes)

**Check progress:**
- "Is everyone finished with their joint specification of 8 requirements?"
- "Remember: still no talking to other pairs. The reason will become clear very shortly."

**Build anticipation:**
- "Take a moment to re-read your 8 requirements."
- "Ask yourself: Am I confident that another engineering team could build the right system from this spec alone?"
- "We're about to find out."

:::

---

## Part 3: The Reveal (20 minutes)

**Now pairs combine into quads. This is where it gets interesting.**

### Exercise 3.1: Specification Comparison (10 minutes)

**Do NOT debate yet—just observe.**

1. Pair AB reads their 8 requirements aloud, one at a time
2. Pair CD reads their 8 requirements aloud, one at a time
3. As you listen, note every difference you hear—big or small

You'll likely discover that despite reading the **exact same brief**, your specifications describe **different systems**.

### Exercise 3.2: Divergence Catalog (10 minutes)

As a quad, create a table documenting **every significant difference** between the two specifications:

| Topic | Pair AB's Interpretation | Pair CD's Interpretation | Impact if Built Wrong |
|-------|-------------------------|-------------------------|----------------------|
| Example: "Live help" | Video calls with screen share | Text-based chat queue | Completely different tech stack |
| Example: "Response time" | 24-hour SLA for async questions | Real-time queue position display | Different user expectations |
| ... | ... | ... | ... |

Aim for **at least 4 divergences**. You'll probably find more.

**Record your divergence table in the "Part 3-4: The Reveal" section of `REFLECTION.md`.**

---

## Part 4: Root Cause Analysis (15 minutes)

### Exercise 4.1: Apply the Risk Framework (10 minutes)

For your **top 3 divergences**, classify each by the risk dimension from Lecture 9:

| Divergence | Risk Type | Why This Classification? |
|------------|-----------|-------------------------|
| Video vs. Chat | **Understanding Risk** | The term "live help" was genuinely ambiguous |
| Queue system vs. Ticketing | **Scope Risk** | Each interpretation implies very different feature sets |
| Response time expectations | **Volatility Risk** | This is likely to change based on actual usage patterns |

For each, explain:
- Why does this divergence fall into this risk category?
- What would happen if you built one interpretation and the client wanted the other?

### Exercise 4.2: What Would Have Helped? (5 minutes)

For each of your top 3 divergences, identify which **elicitation technique** from Lecture 9 could have prevented it:

| Divergence | Elicitation Technique | Specific Action |
|------------|----------------------|-----------------|
| Video vs. Chat | **Interview** | Ask the department head: "When you say 'live help,' what does that look like?" |
| Queue vs. Tickets | **Observation** | Shadow TAs during current office hours to see how they work |
| Response times | **Prototype** | Show mockups of both approaches and ask which matches expectations |

**Record your analysis in `REFLECTION.md`.**

---

## Sync Point 2

:::tip For TAs: Sync Point 2 (10 minutes)

**Facilitate class discussion:**

- "What was your most surprising divergence?" (Ask 2-3 quads to share)
- "Did any quad have *identical* specifications?" (Almost certainly not—make this point!)
- "How much would it cost if you built Pair AB's system and the client actually wanted Pair CD's?"
- "Which risk type caused the most divergences in this room?"

**Key insight to emphasize:**

> "You all read the same brief. You're all competent engineers. And yet your specifications diverged dramatically. This is why requirements analysis matters—and why *building shared understanding* is a professional skill, not just a nice-to-have."

**Connect to the real world:**
- "In professional work, who plays the role we just simulated with the 'reveal'?" (The client, after you've already built the wrong thing)
- "What's the cost of discovering divergence at that point vs. discovering it today?"

:::

---

## Part 5: Unified Specification (10 minutes)

### Exercise 5.1: Negotiate Quad Agreement

As a quad, produce **ONE specification of 8 requirements** that all 4 members agree on:
- You'll need to make choices where interpretations diverged
- For each choice, briefly note which interpretation you chose and why
- All 4 members must be able to defend this specification

This is harder than it sounds. You're now resolving the divergences you cataloged earlier.

### Exercise 5.2: Questions for the Client

List **3 questions** you would need to ask the client before building this system:
- For each question, note which divergence it would resolve
- Frame questions to get useful answers (avoid yes/no questions)

**Example:**
> **Question:** "When a student leaves a question for later, what's a reasonable response time? Same day? Same week? Before the next assignment is due?"
> **Resolves:** The divergence about async response expectations

**Record your unified specification and questions in `REFLECTION.md`.**

---

## Debrief

:::tip For TAs: Final Debrief (5 minutes)

**Wrap up the lab:**

- "What soft skill did you practice today? How did it go?"
- "Building shared understanding isn't just about being nice to your teammates—it directly prevents expensive rework."

**Preview future work:**
- "In your assignments, you'll receive requirements that are intentionally ambiguous."
- "Your job is to resolve that ambiguity *before* you start coding—not after you've built the wrong thing."
- "Today's exercise showed you what's at stake when you skip that step."

**Acknowledge the discomfort:**
- "It can feel uncomfortable to realize you've been 'wrong' about something you were confident about."
- "That feeling is valuable—it builds the habit of questioning assumptions early."

:::

---

## Reflection

Your `REFLECTION.md` should include all of the following sections. Make sure you've completed each one before submitting:

### Partner Information
- **Your Pair Partner:** [Name]
- **Your Quad Partners:** [Names from the other pair]

### Part 1: Individual Interpretation
- Your 5-7 initial requirements (with assumptions and stakeholders)
- Your 3+ identified ambiguities (with your assumptions)

### Part 2: Pair Specification
- Your joint 8 requirements
- Assumptions you both made

### Part 3-4: The Reveal
- Divergence table (at least 4 rows)
- Risk classification table (top 3 divergences)
- "What would have helped" table

### Part 5: Unified Specification
- Final 8 requirements (quad agreement)
- 3 questions for the client

### Meta Reflection
Answer these questions thoughtfully:

1. **Most Surprising Divergence:** What difference between the pairs surprised you most? Why didn't you anticipate it?

2. **Shared Understanding Process:** How did building shared understanding with your partner (in Part 2) help or hinder the quad merge (in Part 5)?

3. **Future Behavior:** What will you do differently when reading requirements for your next assignment or project?

---

## Submission Checklist

**Due:** By the end of your lab section (with a 10-minute grace period).

Before your final submission, ensure:

- [ ] Part 1: You completed your individual interpretation (5-7 requirements, 3+ ambiguities)
- [ ] Part 2: You and your partner created a joint specification of exactly 8 requirements
- [ ] Part 3: Your quad cataloged at least 4 divergences between the pair specifications
- [ ] Part 4: You classified your top 3 divergences by risk type and identified elicitation techniques
- [ ] Part 5: Your quad produced a unified specification and 3 questions for the client
- [ ] `REFLECTION.md` is complete with all sections filled in
- [ ] All changes are committed and pushed to GitHub
