---
title: "Group Assignment 2: Feature Buffet"
sidebar_position: 10
---

:::warning Preliminary Content

This assignment is preliminary content and is subject to change until the release date of the assignment.

:::

## Overview

In this final implementation assignment, your team selects and implements 2-3 features from a provided menu (or proposes a custom feature with instructor approval). Unlike GA1, this assignment is graded primarily on **process rather than product**—demonstrating thoughtful design iteration, quality code review, and professional documentation matters more than feature completeness.

This approach reflects real-world software development: a well-documented, well-tested partial feature is more valuable than a hastily-implemented complete feature with no documentation or tests.

**Due:** Thursday, April 16, 2026 at 11:59 PM Boston Time

**Prerequisites:** GA1 (Core Features) must be complete. Your core features should be integrated and working.

## Learning Outcomes

By completing this assignment, you will demonstrate proficiency in:

- **Iterative design** through documented design evolution ([L27: User-Centered Design](/lecture-notes/l27-ucd))
- **Professional documentation** of design decisions and implementation choices
- **Quality code review** that improves code and spreads knowledge ([L17: Teams and Collaboration](/lecture-notes/l17-teams))
- **Process reflection** that identifies lessons learned and areas for improvement

## AI Policy for This Assignment

AI tools are **encouraged**, but remember: we're grading process, not just product. AI can help you implement features quickly, but it cannot:
- Make design decisions for your specific users
- Document why you made the choices you made
- Provide meaningful code review
- Reflect on what you learned

Use AI as a tool, but ensure the *thinking* is yours.

## The Feature Buffet

Choose **2-3 features** from the buffet below. Teams may also propose a custom feature (see below).

### Standard Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Recipe Scaling** | Adjust serving sizes with automatic ingredient recalculation | Medium |
| **Shopping List** | Generate aggregated shopping list from selected recipes | Medium |
| **Export to PDF** | Create nicely formatted PDF exports of recipes | Medium |
| **Unit Conversion** | Toggle between metric and imperial throughout the app | Medium |
| **Keyboard Shortcuts** | Comprehensive keyboard navigation and shortcuts | Medium |
| **Dark Mode** | Theme switcher with system preference detection | Low-Medium |
| **Cooking Timer** | Timers linked to recipe instruction steps | Medium-High |

### Advanced Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| **OCR Backend Selection** | Strategy pattern for Tesseract vs. Claude API | High |
| **Meal Planning** | Calendar-based meal planning with recipe scheduling | High |
| **Nutritional Info** | API integration for nutritional data | High |
| **Voice Control** | Hands-free recipe navigation while cooking | High |

### Custom Feature

Teams may propose their own feature. Requirements:
- Submit proposal within 3 days of GA2 start
- Include: user need, scope estimate, integration plan
- Await instructor approval before beginning implementation

## Process Portfolio

For **each feature from the buffet**, your team must submit a Process Portfolio demonstrating thoughtful development. This is the primary grading artifact.

### 1. Design Rationale (10% of feature grade)

Document (1/2 page):
- Why did you choose this feature?
- What user need does it address? (Reference a persona from GA0)
- What alternatives did you consider?

### 2. Design Artifacts (25% of feature grade)

Show your design evolution:
- **Version 1:** Initial wireframe/mockup
- **Version 2+:** At least one iteration with documented changes
- **Rationale:** Why did you change the design? What feedback prompted it?

Photos of whiteboard sketches are fine. The goal is showing *iteration*, not polish.

### 3. Implementation Journal (20% of feature grade)

Document your implementation process:
- **Git history:** Show incremental progress (not one giant commit at the end)
- **PR history:** Link to PRs with meaningful review comments
- **Decision log:** At least one documented technical decision with alternatives considered

### 4. Testing & Quality (20% of feature grade)

- Unit tests for the feature
- Brief accessibility check: Does it support keyboard navigation?
- Known limitations documented

### 5. Demo & Reflection (25% of feature grade)

- **Demo video:** 1-2 minute video showing the feature working
- **What worked well?** What aspects of your process were effective?
- **What would you do differently?** Specific, actionable lessons learned
- **Integration notes:** How does this feature connect to the rest of the app?

## Grading Philosophy

**A well-documented partial feature scores higher than a complete feature with no process evidence.**

| Scenario | Approximate Grade |
|----------|-------------------|
| Feature complete, excellent process documentation, meaningful iteration | A (90-100%) |
| Feature complete, minimal process documentation | B- (75-80%) |
| Feature partially complete, excellent process documentation | B+ (85-88%) |
| Feature partially complete, minimal process documentation | C (70-75%) |
| Feature broken, but excellent documentation of what was attempted | C+ (75-78%) |
| Feature complete, no documentation | C- (70-72%) |

## Grading Rubric

### Per-Feature Grade (applied to each buffet selection)

| Component | Weight | Excellent | Satisfactory | Needs Improvement |
|-----------|--------|-----------|--------------|-------------------|
| **Design Rationale** | 10% | Clear user need, thoughtful alternatives | User need stated | Generic/missing rationale |
| **Design Iteration** | 25% | 3+ versions with clear evolution | 2 versions shown | Single design, no iteration |
| **Implementation Journal** | 20% | Regular commits, quality PRs, decisions documented | Some commits, basic PRs | Large commits, no discussion |
| **Testing & Quality** | 20% | Comprehensive tests, accessibility verified | Basic tests present | Minimal testing |
| **Demo & Reflection** | 25% | Insightful reflection, specific lessons | Generic reflection | Missing or superficial |

### Team Grade Distribution

- **20% Individual:** Each member's contribution evidenced in commits, PRs, reviews
- **80% Team:** Overall quality of process portfolios and feature integration

### Peer Evaluation Adjustment

After submission, each team member completes a peer evaluation survey. This adjusts individual grades by **±10%** based on:
- Contribution relative to other team members
- Quality of code review feedback provided
- Collaboration and communication effectiveness

## Custom Feature Proposal

If proposing a custom feature, submit within 3 days of GA2 start:

```markdown
# Custom Feature Proposal: [Feature Name]

## User Need
What problem does this solve? Who benefits?

## Scope Estimate
- Estimated complexity: Low / Medium / High
- Key technical challenges:
- Dependencies on existing features:

## Integration Plan
How does this connect to existing ViewModels and services?

## Success Criteria
How will you know this feature is "done"?
```

Instructors will respond within 48 hours with: Approved / Approved with modifications / Please choose from menu.

## Submission

### Repository Contents

```
/menu-features/
  /feature-name-1/
    RATIONALE.md
    design/
      v1-wireframe.png
      v2-wireframe.png
      design-evolution.md
    IMPLEMENTATION_JOURNAL.md
    DEMO.md (with link to video)
  /feature-name-2/
    ...
```

### Checklist

- [ ] 2-3 features selected (or custom approved)
- [ ] Process portfolio complete for each feature
- [ ] Demo videos recorded and linked
- [ ] All features integrated into main application
- [ ] Peer evaluation survey completed (separate submission)

### Peer Evaluation

Submit separately via course website:
- Rate each team member's contribution (1-5 scale)
- Provide specific examples of positive contributions
- Note any collaboration challenges (confidential)

---

## Reflection Questions for Team Discussion

Before submitting, discuss as a team:

1. Which feature had the smoothest development process? Why?
2. Where did your GA0 design artifacts help most? Where did they fall short?
3. What would you do differently if starting the group project over?
4. What's one thing each team member learned from another team member?

These don't need to be submitted, but inform your individual reflections in the process portfolios.

---

This assignment emphasizes that **how you work matters as much as what you produce**. The skills of documenting decisions, iterating on designs, and reflecting on process are essential for professional software development—and they're much harder to fake than feature completeness.
