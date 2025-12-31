---
title: "Group Assignment 0: Design Sprint"
sidebar_position: 8
---

:::warning Preliminary Content

This assignment is preliminary content and is subject to change until the release date of the assignment.

:::

## Overview

This assignment marks the beginning of your group project. Before writing any GUI code, your team will establish the foundation for effective collaboration and create the design artifacts that will guide your implementation in GA1 and GA2.

You'll create two key team documents—a **Team Charter** and a **Team Lexicon**—that establish working agreements and shared vocabulary. Each team member will then apply User-Centered Design principles to create personas, wireframes, and accessibility considerations for their assigned core feature. You'll also select your **Feature Buffet** items for GA2 and design **"Our Feature"**—a custom feature concept that you'll present (but not implement) in your final presentation.

**Due:** Thursday, April 2, 2026 at 11:59 PM Boston Time

**Prerequisites:** This assignment builds on the A5 solution (provided). You should be familiar with the service layer architecture and CLI implementation from A5.

## Learning Outcomes

By completing this assignment, you will demonstrate proficiency in:

- **Establishing team working agreements** through explicit discussion of communication norms, availability, and conflict resolution ([L17: Teams and Collaboration](/lecture-notes/l17-teams))
- **Creating shared vocabulary** through a team lexicon that ensures consistent naming conventions ([L5: Functional Programming and Readability](/lecture-notes/l5-fp-readability-reusability))
- **Applying User-Centered Design** through personas, wireframes, and prototyping ([L27: User-Centered Design](/lecture-notes/l27-ucd))
- **Considering accessibility** in interface design from the start ([L28: Accessibility and Inclusivity](/lecture-notes/l28-accessibility))
- **Evaluating usability** using Nielsen's heuristics ([L24: Usability](/lecture-notes/l24-usability))

## AI Policy for This Assignment

AI tools are **encouraged** for this assignment, particularly for:
- Generating persona templates and user journey frameworks
- Creating wireframe ideas and layout suggestions
- Drafting team charter sections

However, the **substance** must come from your team's discussions and decisions. AI can help you articulate ideas, but the ideas themselves—your team's working agreements, your understanding of users, your design decisions—must be genuinely yours.

## Team Foundation Deliverables

### Team Charter (`TEAM_CHARTER.md`)

Create a markdown file in your repository root that addresses the following sections:

#### 1. Team Information & Communication
- Team name
- Member names, preferred contact methods, pronouns
- Primary communication channel (Discord? Slack? Group chat?)
- Response time expectations (e.g., "respond within 24 hours on weekdays")

#### 2. Availability & Working Styles
- Each member's weekly availability (specific hours, not just "whenever")
- Preferred working style: early starter vs. deadline-driven (acknowledge the difference!)
- Meeting cadence: when and how often will you sync?

#### 3. Roles & Responsibilities
- Feature assignments (who owns which core feature: Library View, Recipe Editor, Import Interface, Search & Filter)
- Rotating roles: meeting facilitator, note-taker, PR merge coordinator
- Backup plan: who covers if someone is sick/overwhelmed?

#### 4. Technical Agreements
- Git branching strategy (feature branches? naming conventions?)
- PR requirements: minimum reviewers, approval policy, merge strategy
- Definition of "done" for a feature (tests pass? reviewed? documented?)

#### 5. Decision-Making & Conflict Resolution
- How do you make decisions? (Consensus? Majority vote? Feature owner decides for their area?)
- What do you do when you disagree? (Reference HRT pillars from L17)
- When do you escalate to course staff?

#### 6. Accountability
- How will you track progress? (GitHub Projects? Issues? Stand-ups?)
- What happens if someone isn't contributing? (Explicit, frank discussion of this upfront)
- How will you handle peer evaluation? (Discuss that it exists and affects grades)

### Team Lexicon (`TEAM_LEXICON.md`)

Create a markdown file that documents your team's shared vocabulary. This applies the name molds concept from L5. Consistency in naming—both in code and in the UI—reduces confusion for developers and users alike.

#### 1. Code Vocabulary

| Concept | Canonical Term | Avoid |
|---------|---------------|-------|
| A book of recipes | `RecipeCollection` | Cookbook, RecipeBook, Collection |
| The user's set of all collections | `Library` | Repository, Database, Store |
| *Add 10+ domain terms* | | |

#### 2. User-Facing Terminology

Decide what users will see in the UI. Code terms and UI terms may differ!

| Concept | UI Label | Notes |
|---------|----------|-------|
| RecipeCollection | "Cookbook" | Users think in cookbooks, not collections |
| Library | "My Cookbooks" | Friendly, possessive |
| ImportService | "Add Recipe" | Action-oriented, not technical |
| *Add terms for all major UI elements* | | |

**Why this matters:** If your code says `RecipeCollection` but buttons say "Cookbook," "Collection," and "Recipe Book" inconsistently, users get confused. Decide once, document it, use it everywhere.

#### 3. Naming Conventions (Code)

Document patterns your team will follow:
- ViewModels: `{Feature}ViewModel` (e.g., `LibraryViewModel`)
- Properties: `{noun}Property()` (e.g., `selectedCollectionProperty()`)
- Commands: `{verb}{Noun}()` (e.g., `deleteCollection()`)
- Boolean properties: `is{Adjective}Property()` (e.g., `isDirtyProperty()`)

#### 4. Package Structure

```
app.cookyourbooks.gui.viewmodels/   - ViewModel implementations
app.cookyourbooks.gui.views/        - FXML controllers
app.cookyourbooks.gui.components/   - Reusable UI components
```

## Individual Deliverables

Each team member creates the following for **their assigned core feature**:

### 1. User Persona

Create a realistic persona (1 page) for a user who primarily uses your feature. Include:
- Name, background, technical comfort level
- Goals: What are they trying to accomplish with CookYourBooks?
- Pain points: What frustrates them about existing solutions?
- Context: When/where/how do they use the app?

### 2. Low-Fidelity Wireframes

Create hand-drawn or simple digital wireframes (3-5 screens) showing:
- The main view for your feature
- Key interactions and state changes
- How your feature connects to/transitions from other features

Photos of whiteboard sketches are acceptable. The goal is rapid ideation, not polish.

### 3. Accessibility Considerations

Write a brief document (1/2 page) addressing:
- How will your feature support keyboard navigation?
- What screen reader announcements are needed?
- How will you handle color/contrast for visual accessibility?
- What WCAG guidelines are most relevant to your feature?

## Team Deliverables

### 1. Architecture Diagram

Create a diagram showing:
- How your ViewModels connect to the existing services from A5
- The relationship between Views, ViewModels, and Services
- Any new components your team plans to add

### 2. Integrated Wireframe Document

Combine individual wireframes into a single document (`design/integrated-wireframes.md`) showing:
- How navigation flows between the four features
- Shared UI elements (header, navigation, common buttons)
- Any design decisions that affect multiple features

This doesn't need to be high-fidelity—annotated sketches showing how features connect are sufficient.

### 3. Feature Buffet Selection

Select **2-3 features** from the Feature Buffet that your team will implement in GA2. Document your selection in `design/buffet-selection.md`:

**Available options:**
- Recipe scaling calculator with serving size adjustment
- Shopping list generation from selected recipes
- Export to formatted PDF or styled Markdown
- Unit conversion toggle (metric ↔ imperial throughout app)
- Keyboard shortcuts and accessibility polish
- Dark mode / theme customization
- Cooking timer integration for recipe steps
- OCR backend selection (Tesseract vs. Claude API) with Strategy pattern

For each selected feature, briefly explain (2-3 sentences):
- Why your team chose this feature
- Which persona(s) from your individual deliverables would benefit most
- Any concerns or risks you anticipate

### 4. "Our Feature" Concept

Design a **custom feature** that is NOT on the Feature Buffet—something your team thinks would genuinely improve CookYourBooks. This feature will be **designed but not implemented**; you'll present it as a design concept in your final presentation.

This is your chance to exercise full UCD creativity without implementation constraints!

**Deliverable:** `design/our-feature.md` containing:

1. **Feature Name & Tagline** (one sentence describing value to users)

2. **User Need** (1/2 page)
   - What problem does this solve?
   - Which persona(s) would benefit?
   - How do users currently work around not having this feature?

3. **Design Concept** (1 page)
   - Wireframes or sketches (3-5 screens)
   - Key user interactions
   - How it integrates with existing features

4. **Technical Considerations** (1/2 page)
   - What services/APIs would be needed?
   - What's the rough implementation complexity?
   - Any architectural changes required?

5. **Why We Didn't Build It** (2-3 sentences)
   - Scope? Complexity? Time? Dependencies?
   - This honest assessment demonstrates mature engineering judgment

**Examples of good "Our Feature" ideas:**
- Voice-controlled recipe reading for hands-free cooking
- Recipe version history with diff view
- Collaborative cookbook sharing with permissions
- Ingredient substitution suggestions
- Integration with grocery delivery APIs
- Nutritional goal tracking across meal plans

## Grading Rubric

### Individual Components (60%)

| Component | Points | Criteria |
|-----------|--------|----------|
| **User Persona** | 10 | Realistic, specific to feature, includes goals/pain points |
| **Wireframes** | 15 | Shows key screens, interactions, and connections to other features |
| **Accessibility Plan** | 10 | Addresses keyboard, screen reader, color; references WCAG |
| **Charter Participation** | 10 | Evidence of contribution to charter discussions |
| **Lexicon Contribution** | 5 | Added domain terms (code and user-facing) relevant to your feature |

### Team Components (40%)

| Component | Points | Criteria |
|-----------|--------|----------|
| **Team Charter** | 8 | All 6 sections complete, specific (not vague), signed by all |
| **Team Lexicon** | 8 | 10+ code terms, user-facing terminology table, naming conventions |
| **Architecture Diagram** | 6 | Shows ViewModel-Service connections, clear and accurate |
| **Integrated Wireframes** | 6 | Shows navigation flow, shared elements, cross-feature decisions |
| **Feature Buffet Selection** | 4 | 2-3 features selected with rationale tied to personas |
| **"Our Feature" Concept** | 8 | Creative, addresses real user need, well-designed, honest assessment |

**Total: 50 points**

## Submission

1. **Repository setup:** Accept the GitHub Classroom assignment to create your team repository
2. **Team documents:** Add `TEAM_CHARTER.md` and `TEAM_LEXICON.md` to repository root
3. **Individual deliverables:** Each member adds their persona, wireframes, and accessibility plan to `design/{username}/` folder
4. **Architecture diagram:** Add to `design/architecture.png` (or PDF)
5. **Integrated wireframes:** Add to `design/integrated-wireframes.md`
6. **Feature Buffet selection:** Add to `design/buffet-selection.md`
7. **"Our Feature" concept:** Add to `design/our-feature.md`

### Submission Checklist

- [ ] Team Charter complete with all 6 sections
- [ ] Team Lexicon with code vocabulary, user-facing terminology, and naming conventions
- [ ] Each member has persona, wireframes, accessibility plan in their folder
- [ ] Architecture diagram present
- [ ] Integrated wireframes showing navigation and shared elements
- [ ] Feature Buffet: 2-3 selections with rationale
- [ ] "Our Feature": complete design concept with all 5 sections

---

Good luck! This design phase sets the foundation for everything that follows. Teams that invest in clear communication agreements and thoughtful design upfront consistently have smoother implementation phases.

