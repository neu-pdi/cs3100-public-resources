---
title: "Final Project Report"
sidebar_position: 11
---

:::warning Preliminary Content

This assignment is preliminary content and is subject to change until the release date of the assignment.

:::

## Overview

The final project report is your opportunity to document the complete CookYourBooks application your team has built. You'll create a written report covering your architecture decisions, team collaboration, and lessons learned, along with an infographic poster that visually showcases your work.

This is not a separately graded assignment—instead, it serves as a capstone deliverable and provides an opportunity for peer learning across teams through the infographic gallery.

**Due:** Week 15 (see course schedule for exact date)

## Deliverables

### 1. Written Report (3-4 pages)

Your team submits a single written report (PDF) containing the following sections:

#### Project Summary (1/2 page)

- What you built: List all core features and Feature Buffet selections implemented
- Key accomplishments: What are you most proud of?
- Application overview: Brief description of the user experience

#### Architecture Highlights (1 page)

Present 2-3 key architectural decisions your team made:

**For each decision, include:**
- The problem you were solving
- Alternatives you considered
- Why you chose your approach
- A brief diagram or code snippet illustrating the decision

**Possible topics:**
- How MVVM enabled testability and individual accountability
- How you integrated the Gemini API for recipe import
- How you handled async operations and UI updates
- How your team's lexicon evolved during development
- A refactoring that improved code quality

#### "Our Feature" Design Concept (1 page)

Present the custom feature your team designed in GA0—the one you **didn't** implement:

- What user need does it address?
- Show your wireframes/design concept
- Brief technical considerations
- Why you chose not to build it (honest assessment of scope/complexity)

This demonstrates your ability to think beyond implementation to **product vision**. Great "Our Feature" sections show creative thinking constrained by realistic engineering judgment.

#### Team Reflection (1/2-1 page)

Honest reflection on collaboration:

- What worked well in your team process?
- What would you do differently?
- One thing each team member learned from this experience
- Advice for future students tackling this project

#### Sustainability Assessment (1/2 page)

As discussed in [L36: Sustainability](/lecture-notes/l36-sustainability), software sustainability has four dimensions:

| Dimension | Consider |
|-----------|----------|
| **Technical** | Is the code maintainable? What technical debt exists? |
| **Economic** | What would it cost to continue development? |
| **Social** | Does the app serve diverse users well? Accessibility status? |
| **Environmental** | Energy efficiency? Data storage implications? |

Address:
1. Current state of your application across these dimensions
2. Top 3 improvements you'd prioritize for a "v2.0"
3. Potential risks if the application were deployed to real users

### 2. Infographic Poster (single landscape page)

Create a single-page visual summary of your project. This is your "elevator pitch" in visual form—something that could hang on a wall and communicate your project's essence at a glance.

**Required elements:**
- Application screenshots demonstrating key features
- High-level architecture diagram
- Team member names and primary contributions
- Key metrics (e.g., tests written, PRs merged, lines of code, features implemented)

**Design tips:**
- Use a landscape orientation (11x8.5" or A4 landscape)
- Prioritize visual clarity over text density
- Use consistent colors and typography
- Include your team name/number prominently

All infographics will be compiled into a gallery for asynchronous viewing by other teams and course staff.

### 3. Demo Video (2-3 minutes)

Record a brief screen capture demonstrating your application:

**Suggested flow:**
1. Start with an empty or minimal library
2. Import a recipe from an image (show Gemini API in action)
3. Browse the library, search for something
4. Edit a recipe, scale ingredients
5. Demonstrate 1-2 of your Feature Buffet selections
6. Show any unique or polished aspects of your UI

**Tips:**
- Use realistic recipe data (not "Test Recipe 1")
- Show both happy path and one error handling scenario
- Add brief narration or captions explaining what you're demonstrating

## Public Showcase (Optional)

Teams may opt-in to have their infographic featured on a **public showcase** on the course website. This is entirely optional and does not impact your grade.

If you opt in:
- Your infographic will be displayed on the public course website
- Your team members' names will be visible
- You're giving permission for the work to be shared publicly

This is a great opportunity to build your portfolio and share your work with future students, employers, or anyone interested in the course.

**To opt in:** Include a statement in your report submission: "We consent to having our infographic displayed on the public course showcase."

## Submission

Submit to the course website:

1. **Written Report** (PDF, 3-4 pages)
2. **Infographic Poster** (PDF or PNG, single landscape page)
3. **Demo Video** (MP4 or link to unlisted YouTube/Vimeo)
4. **Public showcase opt-in** (if desired, include statement in report)

### Checklist

- [ ] Written report includes all 5 sections
- [ ] Infographic is single landscape page with required elements
- [ ] Demo video is 2-3 minutes showing key functionality
- [ ] All team members contributed to and reviewed the deliverables

## Peer Review

After all reports are submitted, you'll have access to other teams' infographics in the gallery. Take time to review what other teams built—this is a valuable learning opportunity.

We'll provide a brief survey to capture:
- Which infographics were most effective at communicating project scope
- What you learned from seeing other teams' approaches
- Any standout features or designs you noticed

This is for feedback purposes and does not affect grades.

---

Congratulations on completing CookYourBooks! This project has taken you from basic domain modeling through hexagonal architecture, testing with mocks, CLI and GUI development, team collaboration, and user-centered design. These skills form the foundation for professional software development.

Good luck with your final reports!
