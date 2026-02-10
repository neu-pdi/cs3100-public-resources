---
title: "Team Charter"
sidebar_position: 8
---

:::warning Preliminary Content

This assignment is preliminary content and is subject to change until the release date of the assignment.

:::

## Overview

Your team has been formed. Before diving into your group project, you'll establish the foundation for effective collaboration by creating a **Team Charter**—a document that captures your working agreements, communication norms, and strategies for handling the inevitable challenges of teamwork.

This isn't busywork. Research consistently shows that teams who explicitly discuss expectations upfront navigate conflict more effectively than teams who assume everyone is "on the same page." The charter you create here becomes a reference document you'll return to throughout the project.

**Released:** Wednesday, February 25, 2026 (when teams are announced)

**Due:** Thursday, March 12, 2026 at 11:59 PM Boston Time

**Prerequisites:** Attend or review [L17: Teams and Collaboration](/lecture-notes/l17-teams) from the previous week. You'll apply concepts from that lecture directly in this assignment.

## Learning Outcomes

By completing this assignment, you will demonstrate proficiency in:

- **Applying team formation strategies** by explicitly discussing working styles, availability, and expectations ([L17: Teams and Collaboration](/lecture-notes/l17-teams))
- **Establishing productive working agreements** through a team charter that addresses communication, conflict resolution, and accountability ([L17](/lecture-notes/l17-teams))
- **Recognizing cognitive diversity as a strength** by identifying complementary skills within your team ([L17](/lecture-notes/l17-teams))
- **Preparing for conflict constructively** by discussing how your team will handle disagreements before they arise ([L17](/lecture-notes/l17-teams))
- **Practicing feedback skills** by establishing norms for giving and receiving feedback ([L17](/lecture-notes/l17-teams))

## Why This Matters

Remember Tuckman's stages from L17: Forming → Storming → Norming → Performing.

You're currently in **Forming**—everyone's polite, expectations are unclear, and you're figuring each other out. **Storming** is coming, whether you plan for it or not. Teams that discuss potential conflicts upfront move through storming faster and less painfully.

This charter is your team's first collaborative artifact. How you create it—the discussions you have, the honesty you bring—sets the tone for everything that follows.

## Team Charter (`TEAM_CHARTER.md`)

Create a markdown file in your repository root that addresses the following sections. **Every team member must contribute to the discussion**—this document should reflect genuine conversation, not one person's assumptions.

### 1. Team Information & Communication

- Team name (optional but fun)
- Member names, preferred contact methods, pronouns
- Primary communication channel (Discord? Slack? WhatsApp? Group chat?)
- Response time expectations (e.g., "respond within 24 hours on weekdays, best effort on weekends")

**Verification:** Include a screenshot or link showing your communication channel exists and has messages from all team members.

### 2. Availability & Working Styles

- Each member's weekly availability (specific hours, not just "whenever")
- Time zone differences (if any)
- Preferred working style: Do you start early or work best under deadline pressure? Be honest—it's better to know now.
- Meeting cadence: When and how often will you sync? (Weekly video call? Async standups?)

### 3. Skills & Growth Map

This section applies the concept of **cognitive diversity** from L17. Nobody is an expert in everything—teams succeed when members contribute different strengths.

For each team member, document:

- **[Name]**
  - Strengths I bring: ...
  - Areas I want to grow: ...

Example:
- **Alice**
  - Strengths I bring: Strong testing skills, good at breaking down problems
  - Areas I want to grow: Frontend/UI work

Then discuss as a team:
- How do our skills complement each other?
- Where are our collective gaps? How will we address them?
- Who might mentor whom on specific skills?

### 4. Roles & Responsibilities

- Rotating roles: Who facilitates meetings this week? Who takes notes? Who merges PRs?
- How will you rotate these roles?
- Backup plan: What happens if someone is sick, overwhelmed, or has a personal emergency?

*Note: Feature assignments will come in the Design Sprint. For now, focus on team process roles.*

### 5. Technical Agreements

- Git branching strategy: Feature branches? What naming convention? (e.g., `feature/add-search`, `fix/login-bug`)
- PR requirements: How many reviewers? Who can merge? Squash or merge commits?
- Definition of "done": What must be true before a feature is considered complete? (Tests pass? Code reviewed? Documentation updated?)

*Note: You'll set up GitHub repositories, Project boards, and PR templates when each group assignment is released. For now, just agree on the strategy.*

### 6. Decision-Making & Conflict Resolution

- How do you make decisions? (Consensus? Majority vote? Relevant expertise decides?)
- What do you do when you disagree?

**Storming Prep:** Conflict is normal—it's a sign your team cares enough to have opinions. Discuss:

1. What might cause conflict in our team? (Be specific: different working styles? Technical disagreements? Unequal contribution?)
2. When conflict happens, we will... (Reference the conflict resolution steps from L17)
3. If we can't resolve it ourselves, we will escalate to course staff when...

Write explicit answers to these questions. When storming happens (and it will), you'll have a playbook.

### 7. Accountability

- How will you track progress? (GitHub Issues? Kanban board? Daily standups in chat?)
- What happens if someone consistently isn't contributing? (Be frank—it's easier to discuss this now than in the middle of the project.)
- How will you handle peer evaluation? (Acknowledge that it exists and affects grades. Discuss what "fair contribution" looks like.)

### 8. Feedback Norms

Good feedback is a skill. Discuss and document:

**Giving feedback:**
- How will you ask for feedback from teammates? (Remember from L17: specific questions get better answers than "what do you think?")
- When will you give feedback? (After every PR? In weekly syncs? Both?)

**Receiving feedback:**
- How will you receive feedback? (Commit to "thank you first" before explaining or defending)
- What's the expectation for acting on feedback?

**Practice exercise:** Each team member writes one example of feedback they might give to a teammate, using this format:

> "I noticed [specific observation]. I'm wondering if [question or suggestion]. What do you think?"

Include these examples in your charter. This isn't about judging each other—it's practice articulating feedback constructively.

### 9. Knowledge Sharing

From L17: "If you've explained something to more than two people, write it down."

- Where will you document decisions and knowledge? (Wiki? `docs/` folder? README sections?)
- What warrants written documentation vs. a quick chat message?
- How will you keep documentation up to date?

## Team Lexicon (`TEAM_LEXICON.md`)

Create a separate markdown file documenting your team's shared vocabulary. Consistency in naming—both in code and in the UI—reduces confusion for developers and users alike.

### 1. Code Vocabulary

For each domain concept, document the canonical term and terms to avoid. Include 10+ terms.

- **A book of recipes**: Use `RecipeCollection`. Avoid: Cookbook, RecipeBook, Collection
- **The user's set of all collections**: Use `Library`. Avoid: Repository, Database, Store
- **A single recipe**: Use `Recipe`. Avoid: Dish, Item
- *(Add 8+ more domain terms)*

### 2. Naming Conventions

Document patterns your team will follow:

- Classes: `PascalCase` (e.g., `RecipeCollection`)
- Methods: `camelCase`, verb-first (e.g., `addRecipe()`, `findById()`)
- Test classes: `{ClassName}Test` (e.g., `RecipeCollectionTest`)
- Test methods: `{methodName}_{scenario}_{expectedResult}` or descriptive names
- Packages: lowercase, domain-based (e.g., `app.cookyourbooks.domain`)

Add any team-specific conventions you agree on.

## Grading Rubric

This assignment is graded primarily on completeness and evidence of genuine team discussion. We're not judging whether your agreements are "right"—we're checking that you actually discussed them.

### Team Charter (14 points)

| Section | Points | Criteria |
|---------|--------|----------|
| Team Info & Communication | 1 | Complete info, communication channel verified |
| Availability & Working Styles | 2 | Specific hours listed, working styles honestly discussed |
| Skills & Growth Map | 2 | Each member's strengths/growth areas, team discussion of gaps |
| Roles & Responsibilities | 1 | Rotation plan, backup plan addressed |
| Technical Agreements | 2 | Branching/PR/done criteria specified |
| Decision-Making & Conflict | 3 | Storming prep questions answered specifically |
| Accountability | 2 | Progress tracking and contribution issues addressed |
| Feedback Norms | 1 | Giving/receiving norms documented, practice examples included |

### Team Lexicon (4 points)

| Component | Points | Criteria |
|-----------|--------|----------|
| Code Vocabulary | 2 | 10+ domain terms with canonical names and terms to avoid |
| Naming Conventions | 2 | Documented patterns for classes, methods, tests, packages |

### Participation (2 points)

Evidence that all team members contributed to discussions. This can be shown through:
- Git history showing commits from multiple members
- Screenshots of discussion in your communication channel
- Meeting notes with attendee lists

**Total: 20 points**

## Submission

1. Accept the GitHub Classroom assignment to create your team repository
2. Add `TEAM_CHARTER.md` to the repository root
3. Add `TEAM_LEXICON.md` to the repository root
4. Submit the repository link on Canvas

### Submission Checklist

- [ ] `TEAM_CHARTER.md` with all 9 sections complete
- [ ] `TEAM_LEXICON.md` with vocabulary and naming conventions
- [ ] Communication channel set up with evidence (screenshot in charter)
- [ ] Evidence of participation from all team members

---

This charter is a living document. You can (and should) update it as you learn more about working together. But having this foundation now—before the pressure of implementation—gives you something to return to when things get hard.

Good luck, and remember: the goal isn't a perfect document. The goal is the conversations you have while creating it.
