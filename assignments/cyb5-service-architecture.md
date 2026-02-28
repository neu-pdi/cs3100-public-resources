---
title: "Assignment 5: Interactive CLI"
sidebar_position: 6
image: /img/assignments/web/a5.png
---

## Overview

In this assignment, you'll build an **interactive command-line interface (CLI)** for CookYourBooks — a rich, command-oriented terminal application that lets users manage their recipe library, import recipes, scale and convert ingredients, generate shopping lists, and follow recipes step-by-step while cooking.

The CLI is your first **driving adapter** in the hexagonal architecture. But here's the twist: you won't use the `RecipeService` from A4. Instead, you'll design your own service layer — one that's actually well-suited for *multiple* user interfaces. In A4, we told you `RecipeService` was not ideal design. Now you get to prove you understand *why* by building something better.

Your assignment has two parts:
1. **Design and implement CLI-oriented services** that coordinate the domain model and repositories for what your CLI needs
2. **Build a rich interactive CLI** on top of those services — with command parsing, tab completion, interactive cooking mode, and interactive scaling

This is a **design-heavy assignment.** We provide the commands your CLI must support at a high level, and we provide explicit guidance on service boundaries through user personas and the L18 heuristics. But *how* you decompose the service layer — which specific methods each service exposes, how they coordinate, and where you draw the lines — requires you to apply those heuristics thoughtfully. You'll document your decisions using Architecture Decision Records (ADRs) from [L18: Thinking Architecturally](/lecture-notes/l18-boundaries).

:::danger Design Quality Is the Primary Learning Outcome

This assignment shifts emphasis from automated correctness testing to **design quality**. Unlike previous assignments:

- **We provide the majority of the test suite** with the handout. You can run tests locally to verify functionality.
- **Manual grading can deduct up to 45 points** for poor design, architecture, or code quality issues. This is a significant increase from past assignments.
- **We strongly encourage the use of AI coding assistants to implement your design.** The key learning objectives are to apply architectural thinking to create a design that is well-suited for the requirements specified in this writeup. You have already had considerable practice implementing pre-designed Java classes in this course. Spend more time thinking about your design, and rely on AI to help you implement it quickly.
- **Design documents are required** and graded, for a total of 20 points. You must capture your architectural decisions in ADRs using the techniques from L18-L19.

The goal is to demonstrate that you can apply the architectural thinking from lectures — not just make tests pass. A submission that passes all tests but demonstrates poor service decomposition, tight coupling, or no separation of concerns will receive substantial deductions.

:::

**Due:** Thursday, March 19, 2026 at 11:59 PM Boston Time

**Prerequisites:** This assignment builds on the A4 sample implementation (provided). You should be familiar with `RecipeRepository`, `RecipeCollectionRepository`, `ConversionRegistry`, and the domain model. You should also understand why the A4 `RecipeService` interface was problematic — that understanding drives your service design in this assignment.

### At a Glance

**What you'll build:** A CLI-oriented service layer (your design) and a rich interactive CLI with command parsing, navigation, collection/recipe management (create, rename, delete, edit), and two interactive modes (cook mode and scaling mode).

**The main challenge:** Designing services that serve your CLI's needs *and* will be reusable for a GUI in Group Deliverable 1 (unlike the A4 facade), applying the four service boundary heuristics from L18, and documenting your decisions in ADRs.

**What you'll test:** End-to-end CLI behavior using JLine's dumb terminal mode. The provided test suite covers core functionality; you'll add tests for your specific design choices.

**How you'll be graded:** 70 pts automated (command correctness via provided tests), 30 pts design documentation and reflection (ADRs, reflection questions), minus up to 45 pts for design quality issues. A submission passing all tests with excellent design earns 70/70; poor design can drop that significantly. See [Grading Rubric](#grading-rubric).

## Learning Outcomes

By completing this assignment, you will demonstrate proficiency in:

- **Applying service boundary heuristics** — using the four heuristics from [L18: Thinking Architecturally](/lecture-notes/l18-boundaries) (rate of change, actor, interface segregation, testability) to decompose your service layer
- **Writing Architecture Decision Records (ADRs)** — documenting the *why* behind your service boundaries and design choices ([L18](/lecture-notes/l18-boundaries))
- **Designing a UI-agnostic service layer** — creating application services that can be consumed by multiple driving adapters (CLI now, GUI in A6), informed by what you learned about bad service design in A4 ([L17: From Code Patterns to Architecture Patterns](/lecture-notes/l17-creation-patterns))
- **Building a driving adapter** — implementing the CLI as a hexagonal driving adapter that consumes your services without leaking domain logic into the presentation layer; preparing for a second adapter (GUI) in the next assignment
- **Designing a command architecture** — creating an extensible system for dispatching, parsing, and executing commands
- **Designing a completer architecture** — applying the same boundary heuristics to tab completion, separating argument type declarations from value suppliers and presentation logic
- **End-to-end testing with JLine** — writing integration tests using dumb terminal mode to verify CLI behavior
- **Interactive UX for terminals** — building rich interactions including step-by-step cooking mode, interactive scaling, tab completion, and contextual help

## AI Policy for This Assignment

**AI coding assistants continue to be encouraged.** This assignment offers a variety of AI collaboration opportunities. **You must document your AI usage** in the [Reflection](#reflection) section.

:::tip Using AI as a Thinking Tool for Design

One valuable use of AI is **visualizing your own ideas** to help you think through them. Instead of asking "How should I design my service layer?", try:

> "I'm thinking of having three services: a RecipeLibraryService that handles browsing and CRUD, a TransformService for scaling and conversion, and a CookingSessionService that manages state during cook mode. Generate a Mermaid diagram showing these services and their dependencies on the repositories."

Seeing your ideas as a diagram helps you spot issues: Does this service have too many responsibilities? Are there circular dependencies? Does this boundary align with the rate-of-change heuristic? Use this to think through your design, and as you evaluate the artifacts, ask the AI chat agent to refine the design until you are satisfied

**The key difference:** You're asking AI to visualize YOUR design and expand it into a diagram (and perhaps into code), not to design FOR you. The thinking is still yours; AI is just helping you externalize it.

:::

:::warning AI and Design Decisions

AI tools can generate plausible-looking ADRs and service decompositions, but they often miss the nuances of your specific context. If your ADRs read like generic templates without specific references to your code and the L18 heuristics, graders will notice.

The design decisions are yours to make. AI can help implement them, but the architectural thinking is the learning outcome.

:::

:::tip Use AI to Implement Your Design

You are encouraged to use AI to implement your design. As-per our 6-step [AI workflow](/lecture-notes/l13-intro-ai-agents), the most effective way to use AI is to:
1. Identify the task you need to complete
2. Engage the AI with a prompt that describes the task
3. Evaluate the output of the AI
4. Calibrate the AI to your desired outcomes
5. Tweak the output of the AI to your desired outcomes
6. Finalize the output of the AI

The ADRs and design documentation that you must generate for this assignment are great inputs to provide to an AI coding assistant to help you implement it in code. Use the "Plan" mode in your Copilot or Cursor chat to generate an implementation plan from your design. Review it and refine it with the chat agent. Once you are satisfied with the plan, use the "Build" mode to generate the code from the plan.

An ideal design might require you to create dozens of new classes. While you certainly *can* do this by hand, our expectation is that you spend most of your time focusing on the design, and learn to leverage AI to help you implement it quickly.
:::

:::danger AI Resource Consumption — Use "Auto" Mode Only

**Do not manually select expensive AI models** (like Claude Opus, GPT-5, or other premium models) for coursework in this class. **Always use "Auto" mode** in Copilot or Cursor.

:::

## Technical Specifications

### Command Summary

Your CLI must support these commands. Click any command for detailed documentation.

| Category | Command | Description |
|----------|---------|-------------|
| **Library** | [`collections`](#collections--list-collections) | List all recipe collections |
| | [`collection create <name>`](#collection-create-name--create-a-personal-collection) | Create a new personal collection |
| | [`collection create cookbook <name>`](#collection-create-cookbook-name--create-a-cookbook-collection) | Create a cookbook collection (with author, publisher) |
| | [`collection create web <name> <url>`](#collection-create-web-name-url--create-a-web-collection) | Create a web collection from a URL |
| | [`collection rename <old> <new>`](#collection-rename-old-new--rename-a-collection) | Rename a collection |
| | [`collection delete <name>`](#collection-delete-name--delete-a-collection) | Delete a collection |
| | [`collection add <coll> <recipe>`](#collection-add-collection-recipe--add-recipe-to-collection) | Add a recipe to a collection |
| | [`collection remove <coll> <recipe>`](#collection-remove-collection-recipe--remove-recipe-from-collection) | Remove a recipe from a collection |
| | [`recipes <collection>`](#recipes-collection--list-recipes-in-a-collection) | List recipes in a collection |
| **Conversions** | [`conversions`](#conversions--list-house-conversions) | List all house conversion rules |
| | [`conversion add`](#conversion-add--add-a-house-conversion) | Add a house conversion rule (interactive) |
| | [`conversion remove <rule>`](#conversion-remove-rule--remove-a-house-conversion) | Remove a house conversion rule |
| **Recipe** | [`show <recipe>`](#show-recipe--display-a-recipe) | Display a recipe's details |
| | [`search <ingredient>`](#search-ingredient--search-recipes-by-ingredient) | Find recipes containing an ingredient |
| | [`import json <file> <coll>`](#import-json-file-collection--import-recipe-from-json) | Import recipe from JSON file |
| | [`import text <collection>`](#import-text-collection--import-recipe-from-text) | Import recipe from text (multi-line input) |
| | [`edit <recipe>`](#edit-recipe--edit-a-recipe) | Edit a recipe (multi-line input) |
| | [`delete <recipe>`](#delete-recipe--delete-a-recipe) | Delete a recipe |
| **Tools** | [`scale <recipe>`](#scale-recipe--interactive-scaling-mode) | Interactive scaling mode |
| | [`convert <recipe> <unit>`](#convert-recipe-unit--convert-recipe-units) | Convert recipe to different units |
| | [`shopping-list <r1> [r2] ...`](#shopping-list-recipe1-recipe2---generate-shopping-list) | Generate shopping list from recipes |
| | [`cook <recipe>`](#cook-recipe--interactive-cooking-mode) | Step-by-step cooking mode |
| | [`export <recipe> <file>`](#export-recipe-file--export-recipe-to-markdown) | Export recipe to Markdown |
| **General** | [`help [command]`](#help--contextual-help) | Show help (or help for a specific command) |
| | [`quit` / `exit`](#quit--exit--exit-the-application) | Exit the application |

### Data Persistence

The CLI automatically persists all data to a JSON file named `cyb-library.json` in the current working directory:

- **On startup:** If the file exists, load all collections, recipes, and house conversion rules
- **On changes:** Save automatically after any modification (recipe import/edit/delete, collection changes, conversion rule changes)
- **File not found:** Start with an empty library (no error)

**File contents include:**
- All recipe collections (with their type: personal, cookbook, or web)
- All recipes
- All house conversion rules

:::tip Why automatic persistence?
This design keeps the CLI simple while ensuring data isn't lost. Users don't need to remember to save — the library is always up to date. The single-file approach also makes backups trivial (just copy the file).
:::

### Designing Your Service Layer

You must design and implement **your own application service(s)** for the CLI. You are expected to use the domain classes as they are in the handout, and may make use of any of the other code in the handout.

**Your design challenge:** Look at the CLI commands below and determine what service capabilities you need. We provide explicit signposts — user personas and the L18 heuristics — to guide your decomposition, but figuring out *how* to apply them to create well-bounded services is the core learning outcome.

#### User Personas

Think of CookYourBooks as serving three distinct user personas, each representing a different way people interact with recipe software:

| Persona | Goals | Key Commands |
|---------|-------|--------------|
| **The Librarian** | Organizes and curates their recipe collection. Imports new recipes, creates collections, searches for recipes, manages metadata. | `collections`, `collection *`, `recipes`, `import *`, `search`, `edit`, `delete` |
| **The Cook** | Follows recipes step-by-step while cooking. Needs hands-free navigation, on-the-fly scaling for different serving sizes, clear ingredient lists. | `cook`, `show`, `scale` (within cook mode) |
| **The Planner** | Plans meals and shopping trips. Aggregates ingredients across multiple recipes, generates shopping lists, exports recipes to share. | `shopping-list`, `export`, `scale`, `convert` |

**The Converter** (scaling and unit conversion) is a **cross-cutting capability** that serves both the Cook (scaling mid-recipe) and the Planner (converting units for shopping or dietary calculations). This suggests it may warrant its own service boundary.

Your architecture should support building "product stacks" for each persona — cohesive feature sets that can evolve together. In your group project, your four-member team will divide the GUI work by persona: one teammate builds the Cook's step-by-step interface, another builds the Librarian's collection management views, etc. If your service boundaries align with personas, teammates can work in parallel without stepping on each other's code. A change to how the Cook experiences step navigation shouldn't require touching the Librarian's import logic.

:::warning Persona-Aligned Services Required

Your service layer **must** have separate services aligned with the three user personas, plus a cross-cutting Converter capability. This is not optional — it's the core design constraint of the assignment.

A monolithic "CookYourBooksService" that handles all functionality in one class will receive significant design quality deductions, regardless of how well it's documented in ADRs. The architectural learning outcome is practicing decomposition along persona boundaries.

:::

#### Applying the L18 Heuristics

**Apply the four service boundary heuristics from L18:**

1. **Rate of Change** — Things that change at different speeds should be separate. In CLI applications, **UI formatting typically changes fastest** — how recipes are displayed, how comparisons are rendered, what hints appear in interactive modes. Domain operations (scaling math, aggregation logic) change less frequently. Infrastructure (persistence, parsing) changes rarely.

2. **Actor** — Different user personas should inform different service boundaries. The Librarian's workflows (CRUD, search, organization) have different stability characteristics than the Cook's workflows (step-by-step navigation, session state).

3. **Interface Segregation** — Each command (and mode controller) should depend only on the capabilities it needs. The `CookModeController` needs recipe lookup and scaling — it doesn't need import/export or shopping list generation. The `ShoppingListCommand` needs aggregation and recipe lookup — it doesn't need scaling or cook mode state. Avoid fat service interfaces that force clients to depend on methods they don't use.

4. **Testability** — Things that need independent testing should be separable. Can you test your scaling logic without involving file I/O? Can you test your command dispatcher without a real terminal? Pure transformation logic (scaling, conversion) should be testable with just domain objects. Formatting logic should be testable with sample data and string assertions.

### JLine: Rich Terminal Interaction

Your CLI must use [JLine 3](https://github.com/jline/jline3) for terminal interaction. JLine provides:

- **Line editing** — arrow keys, backspace, home/end, etc.
- **Command history** — up/down arrows to recall previous commands
- **Tab completion** — auto-complete command names, collection names, recipe titles
- **Styled output** — colors and formatting for readable output

JLine is already included as a dependency in the provided starter code. Here's a minimal setup:

```java
Terminal terminal = TerminalBuilder.builder().system(true).build();
LineReader reader = LineReaderBuilder.builder()
    .terminal(terminal)
    .completer(yourCompleter)  // Tab completion
    .build();

while (true) {
    String line = reader.readLine("cyb> ");
    // Parse and execute command...
}
```

:::tip JLine Resources

- [JLine Wiki](https://github.com/jline/jline3/wiki) — comprehensive documentation
- The provided starter includes a `JLineExample.java` you can run to see basic JLine features in action
- AI assistants are very good at helping with JLine configuration — this is a great use case for Copilot

:::

### Application Wiring

The provided starter includes a `CookYourBooksApp` main class that creates the repositories and conversion registry. **You are responsible for wiring your own services** and launching the CLI. Modify the `main` method to construct your services and pass them to your CLI:

```java
public class CookYourBooksApp {
    public static void main(String[] args) {
        // Infrastructure (provided) — single-file persistence
        Path libraryPath = Path.of("cyb-library.json");
        CybLibrary library = CybLibrary.load(libraryPath); // loads or creates empty
        
        // Repositories backed by the unified library
        RecipeRepository recipeRepo = library.getRecipeRepository();
        RecipeCollectionRepository collRepo = library.getCollectionRepository();
        ConversionRegistry registry = library.getConversionRegistry();

        // YOUR services — design and wire these yourself
        // Your services should align with the three user personas:
        // - Librarian: collection/recipe CRUD, import, search, organization
        // - Cook: step-by-step navigation, session state, on-the-fly scaling
        // - Planner: shopping lists, export, batch operations
        // Plus a cross-cutting Converter capability for scaling/unit conversion

        // Launch CLI (you implement this)
        CookYourBooksCli cli = new CookYourBooksCli(/* your services */);
        cli.run();
        
        // Save on exit
        library.save();
    }
}
```

### Command Reference

Your CLI must support the following commands. Each command has a required syntax, behavior, and output format. Where output format is specified, your CLI must match it closely enough for automated testing (exact whitespace is not tested, but structure and content are).

#### `help` — Contextual Help

```
cyb> help
```

Displays a list of all available commands with brief descriptions. When given a command name, shows detailed help for that command including syntax, arguments, and examples.

```
cyb> help scale
```

**Requirements:**
- `help` with no arguments lists all commands grouped by category (Library, Recipe, Tools, General)
- `help <command>` shows detailed usage for a specific command
- Unknown command names produce a helpful message: `Unknown command: '<name>'. Type 'help' for a list of commands.`

#### `collections` — List Collections

```
cyb> collections
```

Lists all recipe collections (cookbooks, personal collections, web collections) from the `RecipeCollectionRepository`. Display each collection's title, source type, and recipe count.

**Example output:**
```
Collections:
  1. Holiday Favorites        [Personal]   12 recipes
  2. Joy of Cooking           [Cookbook]     8 recipes
  3. Budget Bytes             [Web]         5 recipes
```

#### `collection create <name>` — Create a Personal Collection

```
cyb> collection create "Holiday Favorites"
```

Creates a new personal collection with the given title and saves it to the repository.

**On success:** `Created personal collection 'Holiday Favorites'.`

**Error handling:**
- Blank or empty name: Display a helpful message

#### `collection create cookbook <name>` — Create a Cookbook Collection

```
cyb> collection create cookbook "Joy of Cooking"
```

Enters an **interactive prompt** to gather cookbook metadata, then creates and saves the collection.

**Example interaction:**
```
cyb> collection create cookbook "Joy of Cooking"
Author: Irma S. Rombauer
Publisher (optional): Scribner
ISBN (optional): 978-1501169717

Created cookbook collection 'Joy of Cooking' by Irma S. Rombauer.
```

**Requirements:**
- Author is required
- Publisher and ISBN are optional (press Enter to skip)

#### `collection create web <name> <url>` — Create a Web Collection

```
cyb> collection create web "Budget Bytes" "https://www.budgetbytes.com"
```

Creates a new web collection with the given title and source URL.

**On success:** `Created web collection 'Budget Bytes' from https://www.budgetbytes.com.`

**Error handling:**
- Missing URL: `Usage: collection create web <name> <url>`
- Invalid URL format: Display a helpful message

#### `collection rename <old> <new>` — Rename a Collection

```
cyb> collection rename "Holiday Favorites" "Holiday Recipes"
```

Renames the specified collection. Collection is identified by title (case-insensitive).

**On success:** `Renamed 'Holiday Favorites' to 'Holiday Recipes'.`

**Error handling:**
- Collection not found: `Collection not found: 'Unknown Collection'. Use 'collections' to see available collections.`
- Multiple matches: Display using the standard [ambiguous match format](#ambiguous-match-format)

#### `collection delete <name>` — Delete a Collection

```
cyb> collection delete "Holiday Favorites"
```

Deletes the specified collection from the repository. The recipes in the collection remain in the recipe repository; only the collection grouping is removed.

**Confirmation required:** `Delete collection 'Holiday Favorites'? (y/n): `

**On success:** `Deleted collection 'Holiday Favorites'.`

**Error handling:**
- Collection not found: `Collection not found: 'Unknown Collection'. Use 'collections' to see available collections.`

#### `collection add <collection> <recipe>` — Add Recipe to Collection

```
cyb> collection add "Holiday Favorites" "Grandma's Apple Pie"
```

Adds an existing recipe to the specified collection. The recipe must already exist in the recipe repository.

**On success:** `Added 'Grandma's Apple Pie' to 'Holiday Favorites'.`

**Error handling:**
- Collection not found: `Collection not found: 'Unknown Collection'. Use 'collections' to see available collections.`
- Recipe not found: `Recipe not found: 'Unknown Recipe'. Use 'search' to find recipes.`
- Recipe already in collection: `'Grandma's Apple Pie' is already in 'Holiday Favorites'.`

#### `collection remove <collection> <recipe>` — Remove Recipe from Collection

```
cyb> collection remove "Holiday Favorites" "Grandma's Apple Pie"
```

Removes a recipe from the specified collection. The recipe remains in the recipe repository; only the collection membership is removed.

**On success:** `Removed 'Grandma's Apple Pie' from 'Holiday Favorites'.`

**Error handling:**
- Collection not found: `Collection not found: 'Unknown Collection'. Use 'collections' to see available collections.`
- Recipe not in collection: `'Grandma's Apple Pie' is not in 'Holiday Favorites'.`

#### `recipes <collection>` — List Recipes in a Collection

```
cyb> recipes "Joy of Cooking"
```

Lists all recipes in the specified collection. Collection can be identified by title (case-insensitive). If the title contains spaces, it must be quoted.

**Example output:**
```
Joy of Cooking (8 recipes):
  1. Chocolate Chip Cookies          Serves 24 cookies
  2. Classic Pancakes                Serves 4
  3. Beef Stew                       Serves 6
  ...
```

**Error handling:**
- Collection not found: `Collection not found: 'Unknown Collection'. Use 'collections' to see available collections.`

#### `conversions` — List House Conversions

```
cyb> conversions
```

Lists all house conversion rules that have been defined. House conversions are custom unit equivalences for your kitchen (e.g., how much a "stick" of butter weighs, or how many grams are in your "cup" of flour).

**Example output:**
```
House Conversions (3 rules):
  1. 1 stick butter = 113 g
  2. 1 cup flour = 120 g
  3. 1 cup sugar = 200 g
```

If no house conversions are defined:
```
No house conversions defined. Use 'conversion add' to add one.
```

#### `conversion add` — Add a House Conversion

```
cyb> conversion add
```

Interactively prompts the user to define a new house conversion rule.

**Example interaction:**
```
cyb> conversion add
Add House Conversion
From amount: 1
From unit: stick
Ingredient (or 'any'): butter
To amount: 113
To unit: g

Added: 1 stick butter = 113 g
```

The `Ingredient` field allows conversions to be ingredient-specific (e.g., 1 cup flour vs 1 cup sugar weigh differently). Use `any` for universal conversions (applies to any ingredient).

**Conversion rule identifiers:** Each conversion rule has a unique identifier formed by `{from-unit} {ingredient}` (e.g., `stick butter`, `cup flour`). For universal conversions, the identifier is just `{from-unit} any` (e.g., `tbsp any`).

**Error handling:**
- Invalid numbers: `Invalid amount. Please enter a number.`
- Duplicate rule: `A conversion for 'stick butter' already exists. Remove it first to replace.`

#### `conversion remove <rule>` — Remove a House Conversion

```
cyb> conversion remove "stick butter"
```

Removes a house conversion rule by its identifier.

**On success:**
```
Removed conversion: 1 stick butter = 113 g
```

**Examples:**
- `conversion remove "stick butter"` — removes the ingredient-specific rule for stick of butter
- `conversion remove "tbsp any"` — removes a universal tablespoon conversion

**Error handling:**
- Rule not found: `No conversion found for 'stick butter'. Use 'conversions' to see existing rules.`

#### `show <recipe>` — Display a Recipe

```
cyb> show "Chocolate Chip Cookies"
```

Displays the full recipe details: title, servings, all ingredients with quantities, and all instructions. Recipe is looked up by title (case-insensitive) across all collections in the repository.

**Example output:**
```
═══════════════════════════════════════
  Chocolate Chip Cookies
  Serves 24 cookies
═══════════════════════════════════════

Ingredients:
  • 2 cups flour
  • 1 cup sugar
  • 1/2 cup butter, softened
  • 2 eggs
  • 1 tsp vanilla extract
  • chocolate chips to taste

Instructions:
  1. Preheat oven to 350°F
  2. Mix dry ingredients
  3. Cream butter and sugar
  4. Combine and fold in chocolate chips
  5. Bake for 12 minutes
```

**Error handling:**
- Recipe not found: `Recipe not found: 'Unknown Recipe'. Use 'search' to find recipes by ingredient.`
- Multiple matches: Display using the standard [ambiguous match format](#ambiguous-match-format)

#### `search <ingredient>` — Search Recipes by Ingredient

```
cyb> search chicken
```

Finds all recipes containing the specified ingredient (case-insensitive substring matching). Displays matching recipe titles with their collection. Your service layer should provide this search capability.

**Example output:**
```
Recipes containing 'chicken':
  1. Chicken Tikka Masala         (Joy of Cooking)
  2. Grilled Chicken Salad        (Holiday Favorites)
  3. Chicken Noodle Soup          (Budget Bytes)

Found 3 recipes.
```

**When no results:** `No recipes found containing 'artichoke'.`

#### `import json <file> <collection>` — Import Recipe from JSON

```
cyb> import json /path/to/recipe.json "Holiday Favorites"
```

Imports a recipe from a JSON file and adds it to the specified collection. Your service layer should handle JSON deserialization, saving the recipe, and updating the collection.

**On success:** Displays a confirmation with the imported recipe's title.
```
Imported 'Grandma's Apple Pie' into 'Holiday Favorites'.
```

**Error handling:**
- File not found or unreadable: Display the error message from `ImportException`
- Collection not found: Display a helpful message suggesting `collections` command
- Parse/format errors: Display the error message from the exception

#### `import text <collection>` — Import Recipe from Text

```
cyb> import text "Holiday Favorites"
```

Enters a **multi-line input mode** where the user types or pastes a recipe in plain text. The input ends when the user types `END` on a line by itself (case-sensitive, no leading/trailing whitespace). The text is passed to your service layer for parsing.

**Example interaction:**
```
cyb> import text "Holiday Favorites"
Enter recipe text (end with END on its own line):
> Simple Salad
>
> Serves 2
>
> Ingredients:
> 1 head lettuce
> 2 cups cherry tomatoes
> 1/4 cup olive oil
>
> Instructions:
> 1. Wash and chop lettuce
> 2. Halve tomatoes
> 3. Toss with olive oil
> END
Imported 'Simple Salad' into 'Holiday Favorites'.
```

**Error handling:**
- Collection not found: Display message *before* prompting for text input
- Parse errors: Display the error message from `ParseException`

#### `edit <recipe>` — Edit a Recipe

```
cyb> edit "Chocolate Chip Cookies"
```

Enters a **multi-line input mode** where the user types or pastes the updated recipe in plain text. The input ends when the user types `END` on a line by itself (case-sensitive, no leading/trailing whitespace). The text is parsed and replaces the existing recipe, preserving its ID so that collections that contain it remain valid.

**Example interaction:**
```
cyb> edit "Chocolate Chip Cookies"
Enter updated recipe text (end with END on its own line):
> Chocolate Chip Cookies
>
> Serves 24 cookies
>
> Ingredients:
> 2 cups flour
> 1 cup brown sugar
> ...
> END
Updated 'Chocolate Chip Cookies'.
```

**Error handling:**
- Recipe not found: `Recipe not found: 'Unknown Recipe'. Use 'search' to find recipes by ingredient.` — display *before* prompting for text input
- Multiple matches: Display using the standard [ambiguous match format](#ambiguous-match-format) *before* prompting for text input
- Parse errors: Display the error message from `ParseException`

#### `delete <recipe>` — Delete a Recipe

```
cyb> delete "Chocolate Chip Cookies"
```

Deletes the specified recipe from the repository and removes it from all collections that contain it.

**Confirmation required:** `Delete recipe 'Chocolate Chip Cookies'? (y/n): `

**On success:** `Deleted recipe 'Chocolate Chip Cookies'.`

**Error handling:**
- Recipe not found: `Recipe not found: 'Unknown Recipe'. Use 'search' to find recipes by ingredient.`
- Multiple matches: Display using the standard [ambiguous match format](#ambiguous-match-format)

#### `scale <recipe>` — Interactive Scaling Mode

```
cyb> scale "Chocolate Chip Cookies"
```

Enters **interactive scaling mode** for the specified recipe. This mode shows the current recipe with its servings, prompts the user for a target serving size, and displays a side-by-side comparison of original and scaled quantities before asking whether to save.

**Example interaction:**
```
cyb> scale "Chocolate Chip Cookies"

Scaling: Chocolate Chip Cookies (currently serves 24 cookies)

Enter target servings (or 'cancel'): 48

Scaled to 48 servings (2.0x):
  Ingredient                Original        Scaled
  ─────────────────────────────────────────────────
  flour                     2 cups       →  4 cups
  sugar                     1 cup        →  2 cups
  butter                    1/2 cup      →  1 cup
  eggs                      2            →  4
  vanilla extract           1 tsp        →  2 tsp
  chocolate chips           to taste        to taste

Save scaled recipe? (y/n): y
Saved scaled recipe 'Chocolate Chip Cookies (scaled to 48)'.

Scale again or 'done': done
```

**Requirements:**
- Show original recipe with current servings
- Prompt for target servings (accept positive integers, or `cancel` to exit)
- Display side-by-side comparison of original and scaled ingredients
- VagueIngredients display unchanged (e.g., "to taste")
- Ask whether to save (persists the scaled recipe as a new recipe via your service layer)
- Allow scaling again with a different target, or `done` to exit
- If the recipe has no servings information, display an error and exit: `Cannot scale 'Recipe Name': no serving information available.`

#### `convert <recipe> <unit>` — Convert Recipe Units

```
cyb> convert "Beef Stew" gram
```

Converts all measured ingredients to the specified unit. Displays the converted recipe and asks whether to save. The conversion should happen through your service layer — the CLI sees the result and decides whether to persist it.

**Example interaction:**
```
cyb> convert "Beef Stew" gram

Converted 'Beef Stew' to GRAM:
  Ingredient                Original        Converted
  ───────────────────────────────────────────────────
  flour                     2 cups       →  240 g
  butter                    1/2 cup      →  113.5 g
  salt                      to taste        to taste

Save converted recipe? (y/n): y
Saved converted recipe 'Beef Stew (converted to GRAM)'.
```

**Valid unit names:** Any string accepted by `Unit.parse(String s)`. This includes unit names like `gram`, `cup`, `tsp`, `oz`, etc. Invalid unit names throw `IllegalArgumentException`.

**Error handling:**
- Recipe not found: Display helpful error
- Invalid unit: `Unknown unit: 'foo'. Valid units include: gram, cup, tsp, tbsp, oz, lb, ml, l.`
- Unsupported conversion: Display the error from `UnsupportedConversionException` — e.g., `Cannot convert 'eggs' (WHOLE) to GRAM: no conversion rule available. Tip: use 'conversion add' to define a house conversion.`

#### `shopping-list <recipe1> [recipe2] ...` — Generate Shopping List

```
cyb> shopping-list "Chocolate Chip Cookies" "Classic Pancakes"
```

Aggregates ingredients across the specified recipes into a shopping list. Recipes are identified by title. Your service layer should handle the lookup and aggregation.

**Aggregation behavior:** Use the same ingredient aggregation logic from A4 — ingredients with the same name and compatible units are combined; incompatible units (e.g., cups and grams of flour) are listed separately; vague ingredients are deduplicated by name.

**Example output:**
```
Shopping List (2 recipes):
═══════════════════════════
  Measured Items:
    • 5 cups flour
    • 2 cups sugar
    • 10 tbsp butter
    • 4 eggs
    • 2 tsp vanilla extract
    • 2 cups milk
    • 1 tsp baking powder

  Also needed:
    • salt
    • chocolate chips

Total: 7 measured items, 2 vague items
```

#### `cook <recipe>` — Interactive Cooking Mode

```
cyb> cook "Chocolate Chip Cookies"
```

Enters **interactive cooking mode** — a step-by-step walkthrough designed for use while actually cooking. This is the signature feature of your CLI. The mode shows one instruction at a time, with the relevant ingredients visible, and supports navigation and on-the-fly scaling.

**Example interaction:**
```
cyb> cook "Chocolate Chip Cookies"

══════════════════════════════════════════
  🍳 COOKING: Chocolate Chip Cookies
  Serves 24 cookies
══════════════════════════════════════════

Ingredients:
  • 2 cups flour              • 2 eggs
  • 1 cup sugar               • 1 tsp vanilla extract
  • 1/2 cup butter, softened  • chocolate chips to taste

──────────────────────────────────────────
  Step 1 of 5
──────────────────────────────────────────
  Preheat oven to 350°F


[next] [prev] [ingredients] [scale] [quit]
cook> next

──────────────────────────────────────────
  Step 2 of 5
──────────────────────────────────────────
  Mix dry ingredients


[next] [prev] [ingredients] [scale] [quit]
cook> scale
Enter target servings: 48

  ✓ Scaled to 48 servings. Ingredients updated:
  • 4 cups flour              • 4 eggs
  • 2 cups sugar              • 2 tsp vanilla extract
  • 1 cup butter, softened    • chocolate chips to taste

cook> ingredients

Ingredients (scaled to 48 servings):
  • 4 cups flour
  • 2 cups sugar
  • 1 cup butter, softened
  • 4 eggs
  • 2 tsp vanilla extract
  • chocolate chips to taste

cook> next
...

──────────────────────────────────────────
  Step 5 of 5
──────────────────────────────────────────
  Bake for 12 minutes


[done] [prev] [ingredients] [scale] [quit]
cook> done

  Finished cooking Chocolate Chip Cookies! Enjoy!
```

**Cook mode commands:**

| Command | Action |
|---------|--------|
| `next` or `n` | Advance to the next step |
| `prev` or `p` | Go back to the previous step |
| `ingredients` or `i` | Show the full ingredient list (reflects any scaling) |
| `scale <servings>` or `scale` | Scale the recipe to new servings for this session only |
| `goto <step>` | Jump to a specific step number |
| `quit` or `q` | Exit cooking mode (returns to main prompt) |
| `done` | Complete cooking (shown on last step) |

**Requirements:**
- Display one instruction at a time with step number and total count
- Show ingredients at the start and on demand
- `scale` within cook mode is **session-only** — it adjusts displayed quantities for the remainder of the cooking session but does **not** offer to save. This is different from the top-level `scale` command which offers to persist the scaled recipe.
- Pressing `next` on the last step shows a completion message
- Pressing `prev` on the first step shows a message that you're already at the beginning
- The prompt changes to `cook>` to indicate cooking mode
- Display available commands as hints at the bottom of each step

#### `export <recipe> <file>` — Export Recipe to Markdown

```
cyb> export "Chocolate Chip Cookies" ~/cookies.md
```

Uses the `MarkdownExporter` to export a recipe to a Markdown file.

**On success:** `Exported 'Chocolate Chip Cookies' to /Users/you/cookies.md`
**On error:** Display the file I/O error message.

#### `quit` / `exit` — Exit the Application

```
cyb> quit
Goodbye!
```

Exits the application gracefully.

### Tab Completion

Your CLI must provide tab completion for:

1. **Command names** — For example, typing `sc` + Tab should suggest `scale`, `search`; `col` should suggest `collection`, `collections`; `con` should suggest `conversion`, `conversions`, `convert`
2. **Collection subcommands** — after `collection`, Tab should suggest `create`, `rename`, `delete`, `add`, `remove`; after `collection create`, Tab should suggest `cookbook`, `web`
3. **Conversion subcommands** — after `conversion`, Tab should suggest `add`, `remove`
4. **Collection names** — any command that takes a collection parameter must offer tab completion for available collection titles:
   - `recipes <collection>`
   - `collection rename <old>` (first argument)
   - `collection delete <name>`
   - `collection add <collection>` (first argument)
   - `collection remove <collection>` (first argument)
   - `import json <file> <collection>` (second argument)
   - `import text <collection>`
5. **Recipe titles** — any command that takes a recipe parameter must offer tab completion for available recipe titles:
   - `show <recipe>`
   - `edit <recipe>`
   - `delete <recipe>`
   - `scale <recipe>`
   - `convert <recipe>`
   - `cook <recipe>`
   - `export <recipe>`
   - `shopping-list <recipe1> [recipe2] ...` (all recipe arguments)
   - `collection add <collection> <recipe>` (second argument)
   - `collection remove <collection> <recipe>` (second argument)
6. **Unit names** — after `convert <recipe>`, Tab should suggest valid unit names (the names accepted by `Unit.parse()`: `gram`, `cup`, `tsp`, `tbsp`, `oz`, `lb`, `ml`, `l`, etc.)

Use JLine's [`Completer` interface](https://jline.org/docs/tab-completion#custom-completers) to implement this. You may find a combination of the built-in completers to be helpful (e.g. `AggregateCompleter`, `FileNameCompleter`, `StringsCompleter`).

#### Designing Your Completer Architecture

Just like command dispatch, tab completion requires thoughtful design. **A giant if-else chain in a single completer class is the same anti-pattern as a giant switch in command dispatch** — it violates the rate-of-change and actor heuristics and makes the system brittle.

Tab completion involves three distinct concerns with different rates of change and different owners:

| Concern | Question | Example |
|---------|----------|---------|
| **What arguments does a command need?** | Which argument positions expect which types? | `scale` needs a recipe at position 1; `collection add` needs a collection at position 1 and a recipe at position 2 |
| **What values are available?** | Where do the actual collection names, recipe titles, unit names come from? | Collection titles from services, recipe titles from the repository |
| **How to format completions?** | How are candidates presented? Quoted strings? Descriptions? Grouping? | Names with spaces need quotes; candidates can have tooltips |

**Apply the L18 heuristics to decide where each concern belongs.** Which heuristic tells you who should own argument type declarations? Who should provide available values? Who should handle presentation formatting? Document your reasoning in the required tab completion ADR.

### Error Handling and Usability

Your CLI should follow Nielsen's usability heuristics wherever applicable:

| Heuristic | Application |
|-----------|-------------|
| **Visibility of system status** | Confirm actions ("Imported...", "Saved..."), show progress for long operations |
| **Match between system and real world** | Use cooking terminology, natural command names |
| **User control and freedom** | `cancel` in interactive modes, `prev` in cook mode, confirm before saving |
| **Consistency and standards** | Consistent command syntax, consistent error message format |
| **Error prevention** | Validate arguments before calling services; confirm destructive actions |
| **Recognition rather than recall** | Show available commands as hints, tab completion |
| **Help and documentation** | `help` command, contextual hints in interactive modes |

**Error messages must be actionable.** Don't just say "Error" — tell the user what went wrong and what they can do about it:

```
// BAD
Error: not found

// GOOD
Collection not found: 'Desert Recipes'. Did you mean 'Dessert Recipes'?
Use 'collections' to see available collections.
```

#### Ambiguous Match Format

When a user-provided name matches multiple items (collections or recipes), display the matches and prompt the user to be more specific. Use this exact format:

**For recipes:**
```
Multiple recipes match 'Cookies':
  1. Chocolate Chip Cookies       (Holiday Favorites)
  2. Oatmeal Raisin Cookies       (Joy of Cooking)
  3. Sugar Cookies                (Holiday Favorites)
Please specify the full recipe name.
```

**For collections:**
```
Multiple collections match 'Favorites':
  1. Holiday Favorites            [Personal]
  2. Family Favorites             [Cookbook]
Please specify the full collection name.
```

The command is **not re-prompted** — the user must re-enter the entire command with a more specific name. This keeps the CLI stateless and simplifies testing.

### Design Requirements

This assignment emphasizes design quality. You have freedom in *how* you structure both your service layer and CLI code, but your design must demonstrate thoughtful application of the principles from L17-L18.

#### Design Documentation (Required)

You must submit design documentation that captures your architectural decisions. ADRs are graded positively as part of the [Design Documentation](#design-documentation-20-points) section (20 points total).

**Required: Architecture Decision Records (ADRs)**

Create exactly **4 ADRs** in a `docs/adr/` folder. Each ADR documents a significant design decision using the format from [L18](/lecture-notes/l18-boundaries):

```markdown
# ADR-001: [Title of Decision]

## Context
[What is the situation? What forces are at play?]

## Decision
[What did you decide to do?]

## Consequences
[What are the tradeoffs? List both positive and negative consequences.]
```

**Required ADR topics** (exactly 4 ADRs required):

1. **Service boundary decomposition** — How did you decompose your service layer to align with the three user personas (Librarian, Cook, Planner)? Which L18 heuristics drove your boundary decisions? How did you handle the Converter as a cross-cutting capability?
2. **Transformation vs. persistence separation** — How does your design handle "preview before save" workflows? How is this different from A4's `RecipeService`?
3. **Command architecture** — How did you design your command dispatch system? What responsibilities does each component have? Which heuristics informed these assignments?
4. **Tab completion architecture** — How did you design your completer? What concerns did you identify, and how did you assign responsibility for each? Which heuristics drove those assignments?

#### Service Layer Design

- **Services depend only on port interfaces** (`RecipeRepository`, `RecipeCollectionRepository`, `ConversionRegistry`) — never on concrete adapter classes
- **Dependency injection** — services receive their dependencies through constructors
- **Separation of transformation from persistence** — your design should enable "preview before save" workflows (this should be documented in an ADR)
- **Immutability** — transformations return new `Recipe` objects; don't mutate the original

#### Separation of Concerns

- **Services** coordinate domain operations (scaling, conversion, aggregation, search, persistence) — they do NOT contain formatting or I/O logic
- **Controllers** handle command parsing and dispatch — they do NOT contain formatting logic or domain logic mixed together
- **Views / Formatters** handle output — recipe display, table formatting, error messages. They should be reusable (e.g., the same recipe formatter is used by `show`, `cook`, and `scale`)
- **The CLI layer never performs domain logic** — no ingredient parsing, no quantity arithmetic, no conversion math. If you're doing math or parsing in a command class, move it to a service.

#### Command Architecture

Design an extensible command system. You don't need to use any specific pattern, but you must have *some* principled command architecture. Putting all commands in one giant `switch` or `if-else` statement is not acceptable.

#### Testability

Your design should support testing without requiring a real terminal:
- The CLI should work with JLine's dumb terminal (TYPE_DUMB) for testing
- Service dependencies should be injected (not constructed internally)
- Interactive modes should work with piped input/output

### Testing Requirements

**We provide the majority of the test suite.** The handout includes end-to-end tests that verify CLI command behavior. You can run these tests locally before submitting — no need to wait for the autograder.

#### End-to-End Testing with JLine Dumb Terminal

All CLI testing uses **JLine's dumb terminal mode** — no mocks. This approach tests your CLI as users will actually experience it:

```java
class CookYourBooksCliTest {

    private Terminal terminal;
    private ByteArrayOutputStream output;
    private PipedInputStream pipedIn;
    private PipedOutputStream commandInput;

    @BeforeEach
    void setUp() throws Exception {
        output = new ByteArrayOutputStream();
        pipedIn = new PipedInputStream();
        commandInput = new PipedOutputStream(pipedIn);

        // Create a dumb terminal for testing — no escape sequences, no special handling
        terminal = TerminalBuilder.builder()
            .type(Terminal.TYPE_DUMB)
            .streams(pipedIn, output)
            .build();
    }

    @Test
    void collectionsCommand_listsAllCollections() throws Exception {
        // Arrange: set up test data in repositories
        setupTestCollections();

        // Act: send command to CLI
        sendCommand("collections\n");
        sendCommand("quit\n");
        runCli();

        // Assert: verify output
        String result = output.toString();
        assertThat(result).contains("Holiday Favorites");
        assertThat(result).contains("Joy of Cooking");
    }

    @Test
    void cookMode_navigatesThroughSteps() throws Exception {
        setupRecipeWithSteps("Pancakes", 4);

        sendCommands(
            "cook \"Pancakes\"\n",
            "next\n",
            "next\n",
            "prev\n",
            "quit\n",
            "quit\n"
        );
        runCli();

        String result = output.toString();
        assertThat(result).contains("Step 1 of 4");
        assertThat(result).contains("Step 2 of 4");
        assertThat(result).contains("Step 3 of 4");
        assertThat(result).contains("Step 2 of 4"); // After prev
    }

    private void sendCommand(String command) throws IOException {
        commandInput.write(command.getBytes());
        commandInput.flush();
    }

    private void sendCommands(String... commands) throws IOException {
        for (String cmd : commands) {
            sendCommand(cmd);
        }
    }
}
```

:::tip Why E2E Testing Instead of Mocks?

Unit testing CLIs with mocks is often a waste of time:
- You end up testing that your mock setup is correct, not that your CLI works
- Real terminal behavior (escape sequences, line editing, buffering) is hard to mock accurately
- Integration bugs slip through because the mocked layers never actually talk to each other

E2E tests with a dumb terminal are **simpler and catch more bugs**. The provided test suite uses this approach — study the examples.

:::

#### Provided Test Suite

The handout includes tests for:
- Basic command execution (help, collections, recipes, show, search)
- Collection CRUD operations (create, rename, delete)
- Recipe operations (import, edit, delete, scale, convert)
- Interactive modes (cook mode navigation, scale mode workflow)
- Shopping list generation
- Error handling and edge cases

Run the tests locally with `./gradlew test`. **Passing these tests is necessary but not sufficient** — the manual grading evaluates your design quality independently.

#### Your Additional Tests

You should add tests for:
- Edge cases specific to your implementation
- Your service layer's internal behavior (if you want to verify specific design choices)
- Any additional commands or features you implement

#### Test Organization

```
src/test/java/app/cookyourbooks/
├── cli/
│   └── CookYourBooksCliTest.java   (provided E2E tests)
└── ... (your additional tests — organize as you prefer)
```

### Example Session

Here's a complete example session showing the CLI in action:

```
$ java -jar cookyourbooks.jar

Welcome to CookYourBooks! Type 'help' to get started.

cyb> help

CookYourBooks Commands:
  Library:
    collections                       List all recipe collections
    collection create <name>          Create a personal collection
    collection create cookbook <name> Create a cookbook (prompts for author)
    collection create web <name> <url> Create a web collection
    collection rename <old> <new>     Rename a collection
    collection delete <name>          Delete a collection
    collection add <coll> <recipe>    Add a recipe to a collection
    collection remove <coll> <recipe> Remove a recipe from a collection
    recipes <collection>              List recipes in a collection
    conversions                       List house conversion rules
    conversion add                    Add a house conversion (interactive)
    conversion remove <rule>          Remove a house conversion
    show <recipe>                     Display a recipe
    search <ingredient>               Find recipes by ingredient
    edit <recipe>                     Edit a recipe (multi-line input)
    delete <recipe>                   Delete a recipe

  Import/Export:
    import json <file> <collection>   Import recipe from JSON file
    import text <collection>          Import recipe from text input
    export <recipe> <file>            Export recipe to Markdown

  Tools:
    scale <recipe>           Interactively scale a recipe
    convert <recipe> <unit>  Convert recipe to different units
    shopping-list <r1> [r2]  Generate aggregated shopping list
    cook <recipe>            Step-by-step cooking mode

  General:
    help [command]           Show help (or help for a specific command)
    quit                     Exit CookYourBooks

cyb> collections

Collections:
  1. Holiday Favorites        [Personal]   12 recipes
  2. Joy of Cooking           [Cookbook]     8 recipes
  3. Budget Bytes             [Web]         5 recipes

cyb> recipes "Joy of Cooking"

Joy of Cooking (8 recipes):
  1. Chocolate Chip Cookies          Serves 24 cookies
  2. Classic Pancakes                Serves 4
  3. Beef Stew                       Serves 6
  ...

cyb> cook "Classic Pancakes"

══════════════════════════════════════════
  COOKING: Classic Pancakes
  Serves 4
══════════════════════════════════════════

Ingredients:
  • 1 1/2 cups flour           • 1 egg
  • 1 cup milk                 • 2 tbsp butter, melted
  • 1 tbsp sugar               • 1 tsp baking powder

──────────────────────────────────────────
  Step 1 of 4
──────────────────────────────────────────
  Whisk together flour, sugar, and baking powder in a large bowl.

[next] [prev] [ingredients] [scale] [quit]
cook> scale
Enter target servings: 8

  Scaled to 8 servings. Ingredients updated:
  • 3 cups flour               • 2 eggs
  • 2 cups milk                • 4 tbsp butter, melted
  • 2 tbsp sugar               • 2 tsp baking powder

cook> next

──────────────────────────────────────────
  Step 2 of 4
──────────────────────────────────────────
  In a separate bowl, whisk egg, milk, and melted butter.

[next] [prev] [ingredients] [scale] [quit]
cook> next

──────────────────────────────────────────
  Step 3 of 4
──────────────────────────────────────────
  Pour wet ingredients into dry and stir until just combined.
  Do not overmix.

[next] [prev] [ingredients] [scale] [quit]
cook> next

──────────────────────────────────────────
  Step 4 of 4
──────────────────────────────────────────
  Cook on a griddle over medium heat until bubbles form,
  then flip. Cook until golden brown.

[done] [prev] [ingredients] [scale] [quit]
cook> done

  Finished cooking Classic Pancakes! Enjoy!

cyb> shopping-list "Classic Pancakes" "Chocolate Chip Cookies"

Shopping List (2 recipes):
═══════════════════════════
  Measured Items:
    • 5 cups flour
    • 17 tbsp sugar
    • 1 cup milk
    • 4 eggs
    • 1 tsp vanilla extract
    • 10 tbsp butter
    • 1 tsp baking powder

  Also needed:
    • chocolate chips

Total: 7 measured items, 1 vague item

cyb> quit
Goodbye!
```

## Reflection

Update `REFLECTION.md` to address:

1. **Applying Boundary Heuristics:** Which of the four L18 heuristics (rate of change, actor, interface segregation, testability) most influenced your service layer design? Give a concrete example: describe a specific boundary you drew (or chose not to draw) and explain which heuristic(s) informed that decision. How did the user personas (Librarian, Cook, Planner) influence your thinking? If multiple heuristics pointed in different directions, how did you resolve the tension?

2. **ADR Writing Experience:** Reflect on writing your ADRs. Did documenting your decisions change how you thought about them? Was there a moment where writing the "Consequences" section made you reconsider a choice? How useful do you think ADRs would be on a team project vs. a solo assignment?

3. **Transformation vs. Persistence:** A4's `RecipeService.scaleRecipe()` always saved. Your design needed to support "preview before save." Describe concretely how your service layer handles this differently. What methods exist? How does the CLI compose them? What would break if you tried to bolt this capability onto A4's interface?

4. **Cook Mode State Management:** Interactive cooking mode tracks state (current step, scaled ingredients, original recipe). Where does this state live in your architecture — in the CLI controller, in a service, in a dedicated session object? What tradeoffs did you consider? The Cook persona has different needs than the Librarian — how did this influence where you placed cook mode state? Could the same state management approach work for a future "meal planning session" for the Planner persona?

5. **E2E Testing Experience:** This assignment used E2E tests with a dumb terminal instead of mocks. Compare this to A4's mock-based approach. Which bugs did E2E testing catch (or would catch) that mocks might miss? Were there situations where you wished you had finer-grained unit tests? What's your takeaway about when to use each approach?

6. **AI Collaboration:** Which parts of the CLI did AI help you build most effectively? Where did you need to think independently about design? Did AI help or hinder your architectural thinking — for example, did it suggest designs that violated the boundary heuristics, or did it help you apply them?

## Quality Requirements

Your submission should demonstrate:

- **Architectural Thinking:** Service boundaries informed by the L18 heuristics and user personas (Librarian, Cook, Planner); ADRs that show you considered tradeoffs, not just picked the first option
- **Service Design:** Well-decomposed service layer that separates transformation from persistence; clear alignment with persona-driven workflows; UI-agnostic (ready for GUI reuse in A6); a clear improvement over A4's `RecipeService`
- **Correctness:** All provided tests pass; interactive modes behave correctly
- **Separation of Concerns:** Clean boundaries between services, controllers, and formatters; no domain logic in CLI layer; UI formatting separated from domain operations (rate of change heuristic)
- **Testability:** Design supports E2E testing with dumb terminal; piped input/output works correctly
- **Code Quality:** Clear naming; Javadoc on public classes; no dead code

## Grading Rubric

**Total: 100 points** (70 automated + 30 design documentation & reflection), minus design quality deductions (up to -45).

This rubric emphasizes design quality. Passing all tests is necessary but not sufficient — the manual review can significantly impact your score if your design doesn't demonstrate the architectural thinking from L18-L19.

### Automated Testing (70 points)

**We provide the test suite.** Run `./gradlew test` locally to verify functionality before submitting.

| Component | Points |
|-----------|--------|
| `help` (list and per-command) | 2 |
| `collections` (correct listing) | 2 |
| `collection create/rename/delete` (correct behavior + error handling) | 5 |
| `collection add/remove` (correct behavior + error handling) | 3 |
| `conversions` / `conversion add/remove` (correct behavior) | 2 |
| Data persistence (`cyb-library.json` load/save) | 2 |
| `recipes <collection>` (correct listing + error handling) | 2 |
| `show <recipe>` (correct display + error handling) | 5 |
| `search <ingredient>` (correct results + no results) | 4 |
| `import json` (success + error cases) | 2 |
| `import text` (success + error cases) | 2 |
| `edit <recipe>` (multi-line input, replace, preserve ID) | 2 |
| `delete <recipe>` (remove from repo + all collections) | 2 |
| `export <recipe>` (correct Markdown output) | 2 |
| `scale` interactive mode (comparison display, save, cancel) | 8 |
| `convert` (display + save + error cases) | 5 |
| `shopping-list` (correct aggregation display) | 4 |
| `cook` mode (navigation, scale, ingredients, done/quit) | 8 |
| Tab completion (commands, collections, recipes, units) | 8 |

### Manual Grading — Design Quality (up to -45 points)

:::danger Design Is the Primary Focus

Unlike previous assignments, manual grading can significantly impact your score. A submission that passes all automated tests but demonstrates poor design can lose up to **45 points**. The deductions below are cumulative.

:::

#### Service Layer Design (up to -20)

| Issue | Max Deduction | Description |
|-------|---------------|-------------|
| **Just wrapping A4 `RecipeService`** | -12 | Thin wrapper around `RecipeService` instead of a redesigned service layer |
| **Bundled transformation + persistence** | -10 | Service methods that always save results (same problem as A4) — no "preview before save" capability |
| **No dependency injection** | -6 | Services construct their own dependencies instead of receiving them |
| **Tight coupling to adapters** | -4 | Services depend on concrete classes (`JsonRecipeRepository`) instead of port interfaces |
| **Monolithic service** | -6 | All functionality in one class with no coherent decomposition rationale; no alignment with user personas or rate-of-change boundaries |

#### CLI Architecture (up to -15)

| Issue | Max Deduction | Description |
|-------|---------------|-------------|
| **Giant switch/if-else dispatcher** | -8 | All commands in one method instead of a principled command architecture |
| **Giant if-else completer** | -6 | All completion logic in one method with hardcoded command patterns instead of command-driven completion |
| **Domain logic in CLI layer** | -8 | CLI code creates domain objects, does arithmetic, parses ingredients, etc. |
| **No separation of formatting** | -4 | Output formatting mixed into command logic instead of dedicated formatters/views |
| **Copy-paste code** | -4 | Same formatting or error handling logic duplicated across commands |

#### Code Quality (up to -10)

| Issue | Max Deduction | Description |
|-------|---------------|-------------|
| **No tab completion** | -4 | Missing or non-functional tab completion |
| **Poor error messages** | -3 | Generic errors without actionable guidance |
| **Missing Javadoc** | -3 | Public classes and methods lack documentation |
| **Poor naming/style** | -2 | Unclear variable names; inconsistent formatting |

### Reflection (30 points)

#### Design Documentation (20 points)

Your ADRs are graded positively for quality and depth of architectural thinking:

| Criterion | Points | Description |
|-----------|--------|-------------|
| **ADR Coverage** | 5 | Exactly 4 ADRs covering service boundaries, transformation/persistence separation, command architecture, and tab completion |
| **Heuristic application** | 6 | ADRs explicitly reference and apply the L18 heuristics (rate of change, actor/persona, ISP, testability) to justify decisions |
| **Tradeoff analysis** | 5 | "Consequences" sections thoughtfully discuss both benefits and drawbacks of each decision |
| **Concern identification** | 2 | ADRs identify the relevant concerns and alternatives considered |
| **ADRs match implementation** | 2 | What's documented reflects what was actually built |

#### Reflection Questions (10 points)

See [Reflection](#reflection) for the 6 questions. Answers should demonstrate genuine reflection on your design process, not just describe what you built.

## Submission

Submit via Gradescope. The autograder will run the provided test suite against your CLI.

**Required submission structure:**

```
├── docs/
│   └── adr/
│       ├── ADR-001-service-boundaries.md
│       ├── ADR-002-transformation-persistence.md
│       ├── ADR-003-command-architecture.md
│       └── ADR-004-tab-completion.md
├── src/
│   ├── main/java/app/cookyourbooks/...
│   └── test/java/app/cookyourbooks/...
└── REFLECTION.md
```

**Submission limits:** You can submit up to **15 times per rolling 24-hour period.**

Ensure `./gradlew build` and `./gradlew test` succeed before submitting. The autograder runs the provided tests plus additional verification.
