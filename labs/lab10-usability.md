---
sidebar_position: 10
---

# Lab 10: Usability Heuristic Evaluation

## Learning Objectives

- Understand what a heuristic evaluation is and why it's useful
- Apply Nielsen's 10 Usability Heuristics to evaluate a real software system
- Identify specific usability problems and connect them to heuristic violations
- Communicate usability findings clearly in a written report

## What Is Usability?

**Usability** is a measure of how well a software system supports humans in achieving their goals. It's not a single property — it's a collection of related qualities:

- **Learnability:** Can users figure out how to use it the first time?
- **Effectiveness:** Can they successfully complete their intended tasks?
- **Productivity:** Once they know the system, how efficiently can they work?
- **Retainability:** If they come back after time away, do they remember how to use it?
- **Satisfiability:** Do they actually enjoy the experience?

These five aspects often trade off against each other. A dense, information-packed interface might boost productivity for experts but tank learnability for newcomers. A guided tutorial helps new users learn but frustrates experienced ones. Good usability design means making these trade-offs intentionally — for specific users, doing specific tasks, in specific contexts.

## Overview

In this lab, you'll conduct a **heuristic evaluation** of a software system you use regularly: **Pawtograder**. You've been using Pawtograder all semester to submit assignments, view grades, and check autograder results — which makes you an experienced user with real opinions about what works and what doesn't.

A heuristic evaluation is a structured inspection method where evaluators examine an interface against a set of established usability principles (heuristics). Unlike user testing — where you observe real users completing tasks — a heuristic evaluation is done by reviewers who systematically check whether the interface follows best practices. It's fast, doesn't require recruiting participants, and can be done at any stage of development (even on paper prototypes).

:::info Why heuristic evaluation?
Research shows that 3–5 evaluators using heuristic evaluation can identify roughly 75% of usability problems in an interface. It's one of the most cost-effective usability methods available — and a skill you can apply immediately in your own projects.
:::

### What you'll need

- A computer with a browser (to use Pawtograder)
- Your lab repository cloned from Pawtograder

### Format

This is a **pair activity**. You'll work with a partner, but each person submits their own evaluation. The comparison step at the end is where the most learning happens — different evaluators almost always find different problems.

---

## Part 1: Nielsen's 10 Usability Heuristics (10 min)

Before you start evaluating, read through the 10 heuristics below. These were developed by Jakob Nielsen in the 1990s, and they remain the most widely used framework for heuristic evaluation. They work because they're based on how humans think — not on any particular technology.

For each heuristic, we've included a question you can ask yourself while evaluating.

| # | Heuristic | Ask yourself... |
|---|-----------|----------------|
| H1 | **Visibility of System Status** | Does the system keep me informed about what's happening? (Progress bars, loading indicators, confirmation messages) |
| H2 | **Match Between System and Real World** | Does it use language I understand, or developer jargon? Do things appear in a natural order? |
| H3 | **User Control and Freedom** | Can I undo mistakes? Is there a clear way to go back or cancel? |
| H4 | **Consistency and Standards** | Does the same action work the same way everywhere? Does it follow platform conventions? |
| H5 | **Error Prevention** | Does the design prevent me from making errors in the first place? (Grayed-out invalid options, confirmation dialogs) |
| H6 | **Recognition Over Recall** | Can I see my options, or do I have to remember things? Is current state visible? |
| H7 | **Flexibility and Efficiency of Use** | Are there shortcuts for experienced users? Can I work efficiently once I know the system? |
| H8 | **Aesthetic and Minimalist Design** | Is the interface cluttered? Does every visible element earn its place? |
| H9 | **Help Users Recognize, Diagnose, and Recover from Errors** | When something goes wrong, does the error message explain what happened and what I can do? |
| H10 | **Help and Documentation** | Is help available where and when I need it? Is it task-focused? |

:::tip
A single usability problem can violate multiple heuristics — that's fine. If a confusing error message violates both H9 (error recovery) and H2 (match real world), note both.
:::

---

## Part 2: Explore Pawtograder (10 min)

Before you start formally evaluating, spend 10 minutes **using Pawtograder with fresh eyes**. You use it regularly, but you probably don't think critically about the interface while you're rushing to submit an assignment.

Walk through these common tasks and pay attention to the experience:

1. **Navigate to a course** and find a specific assignment
2. **View your submission history** for a past assignment
3. **Check autograder results** — can you understand what passed and what failed?
4. **Find your grade** for a completed assignment
5. **Look at any feedback** left by a TA or grader
6. **Try to find something you've never looked for before** — a setting, a page, a feature you haven't used

As you explore, jot down anything that strikes you — moments of confusion, pleasant surprises, things that feel clunky. Don't worry about mapping to heuristics yet.

**Exercise 2.1:** In your repository, open `EXPLORATION_NOTES.md` and write down 5–8 brief observations from your exploration. These can be positive or negative. Examples:
- "I couldn't figure out how to get back to the course list from an assignment page"
- "The submission confirmation was clear and immediate"
- "I don't know what the difference between 'grade' and 'score' is"

---

## Part 3: Conduct Your Heuristic Evaluation (25 min)

Now it's time to do the formal evaluation. Go through each of Nielsen's 10 heuristics and evaluate Pawtograder against it.

**Exercise 3.1:** Open `EVALUATION.md` in your repository. For **each of the 10 heuristics**, fill in the following:

```
## H[number]: [Heuristic Name]

**Rating:** [No issues / Minor issue / Major issue]

**Observations:**
[What did you notice? Be specific — reference particular screens, buttons, messages, or workflows.]

**Evidence:**
[Describe the specific moment or interaction that led to your rating. What were you trying to do? What happened?]

**Suggestion (if applicable):**
[If you found an issue, what would you change?]
```

### Guidelines for a good evaluation

- **Be specific.** "The interface is confusing" is not useful. "On the assignment page, the 'Submit' button is below the fold and I didn't realize I needed to scroll" is useful.
- **Evaluate the interface, not the concept.** You might dislike autograding as a concept — that's not a usability issue. But if autograder output is unreadable, that is.
- **Note positive findings too.** If Pawtograder does something well for a heuristic, say so. Good design is worth documenting.
- **Rate honestly.** If you don't see a problem for a heuristic, say "No issues" — don't invent problems.

:::warning Common mistake
Don't just skim through and write "looks fine" for every heuristic. Spend at least 1–2 minutes on each one. If you think there are no issues, explain what the interface does well for that heuristic.
:::

---

## Part 4: Compare Findings (10 min)

Pair up with your partner and compare your evaluations.

**Exercise 4.1:** In `COMPARISON.md`, answer these questions:

1. **What did your partner find that you missed?** List 2–3 problems or observations from your partner's evaluation that you didn't notice.

2. **Where did you disagree?** Did you and your partner rate any heuristic differently? What's the source of the disagreement — different tasks, different expectations, different experience levels?

3. **Top 3 issues.** Together, agree on the 3 most important usability problems you found. For each one:
   - Which heuristic(s) does it violate?
   - How severe is it? (Cosmetic / Minor / Major / Catastrophic)
   - What would you recommend to fix it?

:::info Severity scale
- **Cosmetic**: Noticed only by careful evaluation; fix if time allows
- **Minor**: Causes minor delays or confusion; users can work around it
- **Major**: Causes significant difficulty; some users may fail at the task
- **Catastrophic**: Prevents users from completing their task; must be fixed
:::

---

## Part 5: Reflection

**Exercise 5.1:** Open `REFLECTION.md` and answer the following:

1. Which heuristic was **easiest** to evaluate, and why?
2. Which heuristic was **hardest** to evaluate, and why?
3. How did your findings change after comparing with your partner? What does this tell you about the value of multiple evaluators?
4. If you could fix **one thing** about Pawtograder's usability, what would it be and why?
5. Think about a project you've built (an assignment, a personal project, anything). What's one usability heuristic it probably violates?

---

## Submission

Submit the following files through your Pawtograder lab repository:

- `EXPLORATION_NOTES.md` (Part 2)
- `EVALUATION.md` (Part 3)
- `COMPARISON.md` (Part 4)
- `REFLECTION.md` (Part 5)

## Grading

:::info
**Option 1:** Complete all parts and submit all files → full credit.

**Option 2:** Submit whatever you complete along with `REFLECTION.md` documenting your progress, what you found challenging, and what you learned → good-faith credit available. Attendance and genuine engagement matter more than perfection.
:::

## Resources

- [Nielsen Norman Group: 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Nielsen Norman Group: How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/)
