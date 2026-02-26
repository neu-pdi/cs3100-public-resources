---
title: "Group Assignment 0: Design Sprint"
sidebar_position: 9
---

# Design Sprint

:::warning Preliminary Content

This assignment is preliminary content and is subject to change until the release date of the assignment.

:::

## Overview

With your Team Charter established, it's time to design your group project. In this Design Sprint, your team will apply User-Centered Design principles to create the design artifacts that will guide your implementation in GA1 and GA2.

Each team member will create personas, wireframes, and accessibility considerations for their assigned core feature. You'll also select your **Feature Buffet** items for GA2 and design **"Our Feature"**—a custom feature concept that you'll present (but not implement) in your final presentation.

**Due:** Thursday, March 26, 2026 at 11:59 PM Boston Time

**Prerequisites:** 
- [Team Charter](/assignments/team-charter) must be complete (this established your team's working agreements)
- A5 solution (provided) — you should be familiar with the service layer architecture and CLI implementation

## Learning Outcomes

By completing this assignment, you will demonstrate proficiency in:

- **Applying User-Centered Design** through personas, wireframes, and prototyping ([L27: User-Centered Design](/lecture-notes/l27-ucd))
- **Considering accessibility** in interface design from the start ([L28: Accessibility and Inclusivity](/lecture-notes/l28-accessibility))
- **Evaluating usability** using Nielsen's heuristics ([L24: Usability](/lecture-notes/l24-usability))
- **Connecting design to architecture** by mapping ViewModels to existing services ([L19: Thinking Architecturally](/lecture-notes/l18-architecture-design))

## AI Policy for This Assignment

AI tools are **encouraged** for this assignment, particularly for:
- Generating persona templates and user journey frameworks
- Creating wireframe ideas and layout suggestions
- Brainstorming feature concepts

However, the **substance** must come from your team's discussions and decisions. AI can help you articulate ideas, but the ideas themselves—your understanding of users, your design decisions—must be genuinely yours.

## Feature Assignments

Before starting individual work, your team must assign ownership of the four core features. Update your Team Charter with these assignments:

- **Library View** (Owner: _____): Browse and manage recipe collections
- **Recipe Editor** (Owner: _____): View and edit recipe content
- **Import Interface** (Owner: _____): Import recipes from images via OCR
- **Search & Filter** (Owner: _____): Find recipes across collections

Each team member owns **one** feature and is responsible for the individual deliverables for that feature.

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

### 3. User-Facing Terminology

Establish the terminology users will see in the UI. Consistency in naming reduces confusion:

- **RecipeCollection** → "Cookbook" (Users think in cookbooks, not collections)
- **Library** → "My Cookbooks" (Friendly, possessive)
- **ImportService** → "Add Recipe" (Action-oriented, not technical)
- *(Add terms for all major UI elements)*

This ensures consistency across all four features.

### 4. Feature Buffet Selection

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

### 5. "Our Feature" Concept

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

### Individual Components (15 points)

| Component | Points | Criteria |
|-----------|--------|----------|
| **User Persona** | 5 | Realistic, specific to feature, includes goals/pain points/context |
| **Wireframes** | 6 | Shows key screens, interactions, and connections to other features |
| **Accessibility Plan** | 4 | Addresses keyboard, screen reader, color; references WCAG |

### Team Components (15 points)

| Component | Points | Criteria |
|-----------|--------|----------|
| **Architecture Diagram** | 3 | Shows ViewModel-Service connections, clear and accurate |
| **Integrated Wireframes** | 3 | Shows navigation flow, shared elements, cross-feature decisions |
| **User-Facing Terminology** | 2 | Consistent terminology for all major UI elements |
| **Feature Buffet Selection** | 3 | 2-3 features selected with rationale tied to personas |
| **"Our Feature" Concept** | 4 | Creative, addresses real user need, well-designed, honest assessment |

**Total: 30 points**

## Submission

1. **Feature assignments:** Update your Team Charter with feature ownership
2. **Individual deliverables:** Each member adds their persona, wireframes, and accessibility plan to `design/{username}/` folder
3. **Architecture diagram:** Add to `design/architecture.png` (or PDF)
4. **Integrated wireframes:** Add to `design/integrated-wireframes.md`
5. **User-facing terminology:** Add to `design/ui-terminology.md`
6. **Feature Buffet selection:** Add to `design/buffet-selection.md`
7. **"Our Feature" concept:** Add to `design/our-feature.md`

### Submission Checklist

- [ ] Feature assignments added to Team Charter
- [ ] Each member has persona, wireframes, accessibility plan in their folder
- [ ] Architecture diagram present
- [ ] Integrated wireframes showing navigation and shared elements
- [ ] User-facing terminology table complete
- [ ] Feature Buffet: 2-3 selections with rationale
- [ ] "Our Feature": complete design concept with all 5 sections

---

Good luck! This design phase sets the foundation for everything that follows. Teams that invest in thoughtful design upfront consistently have smoother implementation phases.
