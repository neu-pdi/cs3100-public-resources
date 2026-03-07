---
title: "Group Assignment 1: Core Features"
sidebar_position: 10
---

:::warning Preliminary Content

This assignment is preliminary content and is subject to change until the release date of the assignment.

:::

## Overview

In this assignment, your team implements the four core GUI features for CookYourBooks. Each team member owns one feature and is individually accountable for their ViewModel implementation, which must pass the provided automated test suite. Teams collaborate on shared infrastructure, integration, and code review.

The key architectural insight of this assignment is that **ViewModels are the testable "brains" of GUI features**. By implementing against provided ViewModel interfaces, your individual work is independently gradeable while still requiring integration with your team's shared codebase.

**Due:** Thursday, April 9, 2026 at 11:59 PM Boston Time

**Prerequisites:** This assignment builds on GA0 (Design Sprint). You should have your team charter and design artifacts complete.

## Learning Outcomes

By completing this assignment, you will demonstrate proficiency in:

- **Implementing the MVVM pattern** with ViewModels that expose observable state and commands ([L30: GUI Patterns and Testing](/lecture-notes/l30-gui2))
- **Creating JavaFX interfaces** that bind to ViewModel properties ([L29: GUIs in Java](/lecture-notes/l29-gui1))
- **Handling asynchronous operations** in a GUI context ([L31-32: Concurrency](/lecture-notes/l31-concurrency1))
- **Practicing effective code review** with HRT principles ([L22: Teams and Collaboration](/lecture-notes/l22-teams))
- **Integrating multiple features** into a cohesive application

## AI Policy for This Assignment

AI tools are **encouraged** for this assignment. Effective uses include:
- Generating JavaFX boilerplate and FXML layouts
- Implementing ViewModel property bindings
- Writing unit tests
- Debugging async/threading issues

Remember: the ViewModel interfaces are your contract. AI can help you implement them, but you must understand the code well enough to debug and extend it.

## TA Mentor Meetings

Throughout GA1, your team will have **weekly 30-minute meetings** with your assigned TA mentor. **These meetings are an accountability mechanism, not just a scheduling requirement.** If you cannot attend, notify your TA *before* the meeting and provide a written update on your work status—this demonstrates accountability. Missing a meeting without prior notice signals a lack of accountability and will likely result in a grade of zero for that week's individual accountability component. These meetings serve multiple purposes:

- **Code walks:** Each team member explains what they worked on and their design choices
- **Progress check-ins:** Are you on track? Stuck anywhere?
- **Collaboration verification:** Is the team working well together?
- **Debugging support:** Your TA can help unblock technical issues

These meetings are also an opportunity to demonstrate your understanding of your code. If you used AI tools to help with implementation, you should still be able to explain how the code works and why you made certain design decisions.

## Provided Materials

You will receive:

1. **ViewModel Interfaces**: Four Java interfaces defining the contract for each core feature
2. **Automated Test Suite**: JUnit tests that verify your ViewModel implementations
3. **Starter FXML Templates**: Optional starting points for your Views
4. **A5 Solution**: The complete service layer your ViewModels will use

## Core Features

Each team member implements **one** of these features:

### 1. Library View (`LibraryViewModel`)

Browse and manage the user's recipe collections.

**Key Functionality:**
- Display list of collections with titles and recipe counts
- Select a collection to view its recipes
- Create new collections
- Delete collections (with confirmation)
- Navigate to Recipe Details when a recipe is selected

**Observable State:**
- `ObservableList<RecipeCollectionSummary> collections`
- `ObjectProperty<RecipeCollectionSummary> selectedCollection`
- `ObservableList<RecipeSummary> recipesInSelectedCollection`

### 2. Recipe Details/Editor (`RecipeEditorViewModel`)

View and edit recipe content.

**Key Functionality:**
- Display recipe title, description, ingredients, instructions
- Edit mode toggle
- Add/remove/reorder ingredients
- Validate changes before saving
- Track dirty state (unsaved changes)

**Observable State:**
- `ObjectProperty<Recipe> currentRecipe`
- `BooleanProperty editMode`
- `BooleanProperty isDirty`
- `BooleanProperty isValid`
- `ObservableList<Ingredient> ingredients`

### 3. Import Interface (`ImportViewModel`)

Import recipes from images using the provided Gemini API integration for OCR and recipe parsing. The Gemini API service layer is provided in the reference implementation—you build the ViewModel and UI that connects to it.

**Key Functionality:**
- Select image file(s) for import
- Display import progress with cancellation support
- Show extracted recipe for review/editing before saving
- Handle Gemini API errors gracefully (network issues, parsing failures, rate limits)
- Select target collection for imported recipe

**Observable State:**
- `ObjectProperty<ImportState> state` (IDLE, PROCESSING, REVIEW, ERROR)
- `DoubleProperty progress`
- `StringProperty statusMessage`
- `ObjectProperty<Recipe> importedRecipe`

### 4. Search & Filter (`SearchViewModel`)

Find recipes across all collections.

**Key Functionality:**
- Search by title (real-time filtering)
- Filter by tags/categories
- Display search results with collection context
- Navigate to selected result
- Keyboard navigation support

**Observable State:**
- `StringProperty searchQuery`
- `ObservableList<RecipeSummary> searchResults`
- `ObservableList<String> availableTags`
- `ObservableList<String> selectedTags`
- `BooleanProperty isSearching`

## Individual Deliverables

### ViewModel Implementation

- Implement your assigned ViewModel interface
- All provided automated tests must pass
- Use dependency injection to receive services (constructor injection)
- Follow your team's user-facing terminology for naming

### View Implementation

- Create FXML layout for your feature
- Implement the FXML controller that binds to your ViewModel
- Follow accessibility guidelines from your GA0 plan
- Support keyboard navigation

### Additional Unit Tests

- Write at least 5 additional unit tests beyond the provided suite
- Focus on edge cases and error conditions
- Test async behavior where applicable

## Team Deliverables

### Integrated Application

- All four features working together in one application
- Consistent navigation between features
- Shared application state where appropriate

### Shared Infrastructure

- Navigation component (how do users move between features?)
- Theming/styling (consistent look and feel)
- Error handling (how are errors displayed to users?)
- Application startup and shutdown

### Integration Tests

- At least 3 integration tests verifying feature interactions
- Example: "User searches for recipe → selects result → recipe displays in editor"

### Code Review Evidence

- Each PR must have at least one substantive review comment
- Reviews should demonstrate HRT principles
- Include at least one example of design discussion in PR comments

## Technical Specifications

### ViewModel Interface Example

```java
public interface LibraryViewModel {
    // Observable state for JavaFX binding
    ObservableList<RecipeCollectionSummary> getCollections();
    ObjectProperty<RecipeCollectionSummary> selectedCollectionProperty();
    ObservableList<RecipeSummary> getRecipesInSelectedCollection();
    
    // Commands
    void selectCollection(String collectionId);
    void createCollection(String title, SourceType sourceType);
    void deleteCollection(String collectionId);
    
    // For grading: non-JavaFX accessors for testing
    List<String> getCollectionIds();
    String getSelectedCollectionId();
}
```

### Testing Your ViewModel

```java
@Test
void selectCollection_updatesRecipeList() {
    // Arrange
    LibraryViewModel vm = new LibraryViewModelImpl(mockLibraryService);
    
    // Act
    vm.selectCollection("desserts-id");
    
    // Assert
    assertThat(vm.getSelectedCollectionId()).isEqualTo("desserts-id");
    assertThat(vm.getRecipesInSelectedCollection()).hasSize(5);
}
```

## Grading Rubric

**Total: 50 points** — 35 points individual (ViewModel + View) + 15 points team (integration).

### Individual Components (35 points)

| Component | Points | Criteria |
|-----------|--------|----------|
| **ViewModel Tests Pass** | 20 | All provided automated tests pass |
| **View Implementation** | 8 | FXML + controller binds correctly, follows design |
| **Additional Tests** | 5 | 5+ meaningful tests covering edge cases |
| **Code Quality** | 2 | Follows UI terminology, clean code, appropriate documentation |
| **Total** | **35** | |

### Team Components (15 points)

| Component | Points | Criteria |
|-----------|--------|----------|
| **Integration Works** | 5 | All features work together, navigation functions |
| **Shared Infrastructure** | 4 | Consistent theming, navigation, error handling |
| **Integration Tests** | 4 | 3+ tests verifying cross-feature behavior |
| **Code Review Quality** | 2 | PRs have substantive reviews, HRT evident |
| **Total** | **15** | |

### Individual Accountability Adjustment

TA meeting observations, collaboration surveys, and peer evaluation can adjust an individual's final grade by **±20 points**. If a team member cannot explain their code in TA meetings while the rest of the team succeeds, their grade may be reduced. Teammates who compensate may receive a small boost. The weekly collaboration surveys (due Mar 16, Mar 23, Mar 30, Apr 6, Apr 13) and peer evaluation submitted after the assignment inform this adjustment.

## Submission

Your team repository should follow this structure (plan it from day one):

```
/design/                        ← GA0 artifacts (personas, wireframes, etc.)
/src/                           ← application source code
/menu-features/                 ← GA2 process portfolios (one subfolder per feature)
```

1. **Push to team repository:** All code in your team's GitHub repository
2. **Tag release:** Create a git tag `ga1-submission` on your final commit
3. **Individual reflection:** Each member submits a brief reflection (see below)

### Individual Reflection (submitted separately)

Answer these questions (1-2 paragraphs each):

1. What was the most challenging aspect of implementing your ViewModel?
2. How did your GA0 design artifacts help (or not help) during implementation?
3. Describe one code review interaction that improved your code or understanding.
4. What would you do differently in GA2 based on this experience?