---
sidebar_position: 19
lecture_number: 19
title: Thinking Architecturally
---

In [L18](./l18-creation-patterns.md), we saw how patterns like Builder, Factory Methods, and Dependency Injection help us create and wire up individual objects. We ended with a glimpse of how these same principles apply at larger scales—services like `ImportService`, `ExportService`, and `LibraryService` that collaborate to form a complete application.

But where do those service boundaries come from? How do we decide that "import" and "library management" should be separate concerns? This lecture is about **thinking architecturally**—stepping back from individual classes to see the shape of the whole system.

## Define software architecture and distinguish it from design (8 minutes)

Software architecture and software design exist on a continuum, but they ask different questions at different scales.

**Architecture** is concerned with the high-level structure of a system:
- What are the major components?
- How do they communicate?
- What are the significant constraints and quality requirements?
- Which decisions are hard to change later?

**Design** is concerned with the internal structure of individual components:
- How is this class organized?
- What data structures should we use?
- How do these methods collaborate?

The boundary between them is fuzzy. 
[Ralph Johnson put it this way: "Architecture is about the important stuff. Whatever that is."](https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf) The "important stuff" varies by project, but it's usually the decisions that constrain many other decisions downstream.
A useful heuristic: **architectural decisions are the ones that are expensive to change**. Choosing to split your system into microservices vs. keeping it as a monolith is architectural—reversing that decision later costs months of work. Choosing between ArrayList and LinkedList is design—you can change it in an afternoon. Most cases, however, are not as clear-cut, and in fact, the goal of a good architect may be to reduce the total number of decisions that will be expensive to change.


:::tip History of Programming
Ralph Johnson is one of the "Gang of Four" (GoF)—the four authors of the seminal 1994 book *Design Patterns: Elements of Reusable Object-Oriented Software*. The others are Erich Gamma, Richard Helm, and John Vlissides. When you hear "GoF patterns," this is the book people mean. The book didn't talk much about software architecture (the field barely existed at the time) - the quote is from nine years later.
:::

### Architecture in CookYourBooks

Even a desktop application like CookYourBooks has architectural decisions:
- Should the application work offline, or require a network connection?
- Should recipe data live in files, a local database, or a cloud service?
- Should OCR processing happen locally or via an API?
- How should the CLI and GUI share logic?

These decisions shape everything else. If we decide recipes live in JSON files, that constrains how we structure and evolve the system. If we decide OCR happens via Claude's API, that requires network handling and API key management. Each choice opens some doors and closes others.

## Identify architectural drivers that shape decisions (10 minutes)

Architecture doesn't happen in a vacuum. Decisions are driven by **architectural drivers**—the forces that push us toward particular solutions.

### Functional Requirements

What must the system do? For CookYourBooks:
- Import recipes from JSON, images (OCR), and markdown
- Organize recipes into cookbooks
- Scale recipes and convert units
- Export recipes in various formats
- Provide both CLI and GUI interfaces

Functional requirements establish what capabilities exist, but they don't dictate *how* to structure them.

### Quality Attributes

How well must the system perform? Quality attributes (also called non-functional requirements or "-ilities") include:

| Quality Attribute | CookYourBooks Implication |
|-------------------|---------------------------|
| **Testability** | Can we test import logic without actual files? Can we test scaling without a GUI? |
| **Changeability** | How hard is it to add a new import format? A new export format? |
| **Performance** | How long can OCR take before users get frustrated? |
| **Maintainability** | When the JSON format changes, how many files need updating? |

Quality attributes often conflict. Optimizing for performance might hurt maintainability. Maximizing changeability might complicate the simple cases. Architecture is about making these tradeoffs consciously.

### Constraints

What limits our choices? Constraints come from many sources:
- **Technology**: "We're using Java and JavaFX"
- **Team**: "Four developers, ten weeks"
- **External dependencies**: "Tesseract for local OCR, Claude API for cloud OCR"
- **Compatibility**: "Must read recipe JSON from Assignment 3"

Constraints aren't negotiable the way quality attributes are. They're the fixed boundaries within which we architect.
## Determine service/module boundaries and design good interfaces (20 minutes)

Now we get to the heart of architectural thinking: **where do we draw the lines?**

### Applying Information Hiding at Scale

:::note Information Hiding In Action
In [Lecture 6](/lecture-notes/l6-immutability-abstraction) and [Lecture 7](/lecture-notes/l7-design-for-change), we learned about information hiding, coupling, and cohesion at the class level. We even previewed how the Java module system scales these ideas to libraries. Now we scale them further—to entire services and systems.
:::

The same principles apply at the service level:

- **High cohesion within**: A service should have a single, well-defined responsibility
- **Low coupling between**: Services should depend on each other through narrow, stable interfaces
- **Information hiding**: Services should hide their implementation details from each other

But how do we find the natural seams in a problem domain?

### Finding Boundaries: The CookYourBooks Case Study

Let's work through how we might arrive at the service boundaries for CookYourBooks. We'll use several heuristics.

**Heuristic 1: Group by rate of change**

Things that change together should live together. Things that change independently should be separate.

In CookYourBooks:
- Import formats (JSON, images, markdown) might each evolve independently
- Export formats might change on a different schedule than import
- The core recipe model is relatively stable
- UI preferences change frequently

This suggests separating import, export, and the core library.

**Heuristic 2: Group by actor**

Different stakeholders care about different parts of the system. In CookYourBooks:
- A "recipe curator" cares about organizing cookbooks
- A "publisher" cares about getting recipes in and out
- A "cook" cares about viewing and scaling recipes

This also suggests separation between library management and import/export.

**Heuristic 3: Apply the Interface Segregation Principle**

No client should be forced to depend on methods it doesn't use. If the CLI only needs to import recipes but the same service that handles import also handles cookbook organization, we've coupled unrelated concerns.

**Heuristic 4: Consider testability**

What would make this easy to test? If importing requires a real file system, that's friction. If scaling requires a running GUI, that's worse. Services should be testable in isolation.

Note: In CookYourBooks, scaling lives in the domain model (`Recipe.scale()`), not in a service. We'll discuss the implications of this choice below.

### Emerging Architecture: Three Services

Applying these heuristics, a natural structure emerges:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI / GUI Controllers                     │
└─────────────────┬───────────────┬───────────────┬───────────┘
                  │               │               │
                  ▼               ▼               ▼
         ┌────────────┐   ┌────────────┐   ┌────────────┐
         │  Import    │   │  Library   │   │  Export    │
         │  Service   │   │  Service   │   │  Service   │
         └──────┬─────┘   └──────┬─────┘   └──────┬─────┘
                │                │                │
                └────────────────┼────────────────┘
                                 ▼
                    ┌─────────────────────┐
                    │    Domain Model     │
                    │ (Recipe, Cookbook,  │
                    │  Quantity, etc.)    │
                    └─────────────────────┘
```

**ImportService**: Handles getting recipes into the system
- Reads from various sources (files, images)
- Delegates to format-specific parsers
- Returns domain objects (doesn't know where they'll be stored)

**LibraryService**: Manages the user's collection
- Stores and retrieves cookbooks
- Organizes recipes within cookbooks
- Handles persistence (but hides *how*)

**ExportService**: Handles getting recipes out of the system
- Transforms recipes to various output formats
- Delegates to format-specific writers
- Takes domain objects (doesn't know where they came from)

### A Design Decision to Reflect On: Where Does Scaling Live?

Notice what's *not* in our service diagram: there's no `ScalingService`. Yet "scale recipes and convert units" is a core functional requirement. In CookYourBooks, scaling and conversion are methods on the `Recipe` domain object itself:

```java
Recipe scaled = recipe.scale(2.0);  // Double the recipe
Recipe converted = recipe.convert(Unit.GRAM, registry);  // Convert to metric
```

This is a deliberate architectural choice—but is it the right one? Let's examine the implications.

**Arguments for keeping scaling in the domain model:**

1. **Rich domain model**: The recipe "knows" how to scale itself. This aligns with Domain-Driven Design principles where domain objects encapsulate their own behavior.
2. **Simplicity**: No need for an extra service layer. Controllers can call `recipe.scale()` directly.
3. **Cohesion**: Scaling is tightly coupled to the recipe's internal structure (ingredients, quantities, servings). Keeping it in `Recipe` keeps related code together.
4. **Immutability**: `Recipe.scale()` returns a new `Recipe`, preserving immutability. This is a domain concern, not a service concern.

**Arguments for extracting a ScalingService:**

1. **Separation of concerns**: Scaling logic might grow complex (handling edge cases, validation, logging). A service can encapsulate this complexity without bloating the domain model.
2. **Rate of change**: Scaling algorithms might evolve independently from the recipe structure. A separate service isolates these changes.
3. **Reusability**: Other parts of the system (batch processing, preview calculations) might need scaling logic without needing full `Recipe` objects.
4. **Interface segregation**: A controller that only needs scaling shouldn't need to know about all of `Recipe`'s other methods.

**The nuanced reality:**

In practice, CookYourBooks uses a hybrid approach:
- Basic scaling (`scale(double factor)`) lives in the domain model—it's simple and intrinsic to recipes
- Complex scaling (`scaleToIngredient()`) takes a `ConversionRegistry` as a parameter—acknowledging that conversion rules are external concerns
- The domain model doesn't know about persistence, file I/O, or UI—those stay in services

**Questions for reflection:**

1. If we later need to add scaling analytics (tracking how often recipes are scaled, by how much), where should that logic live? Does it change your answer about service boundaries?
2. Consider the testability heuristic: Can you test `Recipe.scale()` without a GUI? Without a database? If yes, does that support keeping it in the domain model?
3. What if scaling needed to call an external API (e.g., to fetch nutritional information for scaled quantities)? Would that change where scaling should live?
4. Look at the actor heuristic: "A cook cares about viewing and scaling recipes." Does this suggest scaling should be separate from library management? Or is viewing/scaling part of the same "recipe interaction" concern?

There's no single right answer. The key is recognizing that this *is* an architectural decision with tradeoffs, and being able to articulate why you made the choice you did. In CookYourBooks, keeping basic scaling in the domain model works because:
- The logic is straightforward
- It doesn't require external dependencies beyond what's already injected
- It preserves the mental model that "a recipe can scale itself"

But in a different system with different constraints, extracting a `ScalingService` might be the better choice. Architecture is contextual.

### Interface Design at the Service Level

Once we've identified services, we need to design their interfaces. The same principles from class design apply—and so do the same patterns from L18.

**Dependency Injection at service scale:**

In L18, we passed a `ConversionRegistry` to `Recipe.convert()`. At the service level, the same principle applies—but now we're injecting entire collaborating services:

```java
// Good: LibraryService depends on an abstraction
public class LibraryService {
    private final RecipeRepository repository;
    
    public LibraryService(RecipeRepository repository) {
        this.repository = repository;
    }
}

// RecipeRepository is an interface—we can swap implementations
public interface RecipeRepository {
    void save(Cookbook cookbook);
    Optional<Cookbook> findByName(String name);
    List<Cookbook> findAll();
}
```

**Keep interfaces narrow:**
```java
// ImportService doesn't need to know about library internals
public interface ImportService {
    Recipe importFromJson(Path file) throws ImportException;
    Recipe importFromImage(Path file) throws ImportException;
    Recipe importFromMarkdown(Path file) throws ImportException;
}
```

**Make contracts clear:**
What does `importFromJson` promise? What exceptions can it throw? What happens if the file doesn't exist? These details belong in the interface's documentation, just like method specifications at the class level.

### A Key Design Decision: Who Wires Services Together?

Consider this interaction: user imports a recipe, and it should be added to a cookbook.

**Option A: ImportService calls LibraryService**
```java
public class ImportService {
    private final LibraryService library;
    
    public void importAndAdd(Path file, String cookbookName) {
        Recipe recipe = parseRecipe(file);
        library.addRecipe(cookbookName, recipe);  // ImportService knows about Library
    }
}
```

**Option B: Controller orchestrates both services**
```java
public class ImportController {
    private final ImportService importer;
    private final LibraryService library;
    
    public void handleImport(Path file, String cookbookName) {
        Recipe recipe = importer.importFromJson(file);  // Import returns recipe
        library.addRecipe(cookbookName, recipe);         // Controller adds to library
    }
}
```

**Tradeoffs:**
- Option A is more convenient (one call does everything) but couples Import to Library
- Option B keeps services independent but requires more orchestration code

There's no universally right answer. For CookYourBooks, Option B is probably better because:
- It keeps services independently testable
- It allows the CLI and GUI to orchestrate differently
- It matches the "import" mental model (import gives you a recipe; what you do with it is separate)

This is the kind of decision that feels small but shapes the entire codebase. Architectural thinking means recognizing these decision points and choosing consciously.

## Communicate architecture through diagrams and documentation (12 minutes)

Architecture that exists only in one person's head isn't architecture—it's folklore. We need ways to communicate structural decisions to the team (and to our future selves).

### The C4 Model

The C4 model, created by Simon Brown, provides four levels of abstraction for architectural diagrams:

**Level 1: System Context** — Shows your system as a box, surrounded by users and external systems it interacts with.

For CookYourBooks: The app, the user, Tesseract (local OCR), Claude API (cloud OCR), the file system.

**Level 2: Container** — Zooms into your system to show major deployable units (applications, databases, etc.).

For CookYourBooks (a desktop app): Probably just one container—the application itself. But if we added a cloud sync feature, we'd have multiple containers.

**Level 3: Component** — Zooms into a container to show major structural building blocks.

For CookYourBooks: ImportService, LibraryService, ExportService, CLI Controller, GUI Controller, domain model.

**Level 4: Code** — Zooms into a component to show classes and their relationships.

This is where UML class diagrams live. Most useful for complex components.

The key insight: **use the right level of detail for your audience**. A new team member needs Level 2-3. A developer implementing a feature needs Level 3-4. An executive sponsor needs Level 1.

### Architecture Decision Records (ADRs)

Diagrams show *what* the architecture is. **Architecture Decision Records** capture *why*.

An ADR documents:
- **Context**: What situation prompted the decision?
- **Decision**: What did we decide?
- **Consequences**: What are the implications (good and bad)?

Example ADR for CookYourBooks:

> **ADR-001: Separate Import and Library Services**
>
> **Context**: We need to import recipes from various sources and store them in cookbooks. We could have a single service handle both, or separate them.
>
> **Decision**: We will create separate `ImportService` and `LibraryService` components. `ImportService` returns domain objects; `LibraryService` handles persistence. Controllers orchestrate between them.
>
> **Consequences**:
> - ✅ Services are independently testable
> - ✅ New import formats don't affect library code
> - ✅ CLI and GUI can orchestrate differently
> - ⚠️ More code to wire services together
> - ⚠️ "Import and add to cookbook" requires two service calls

ADRs create institutional memory. Six months from now, when someone asks "why didn't we just put import and library together?", the ADR provides the answer.

## Compare upfront planning with piecemeal growth (10 minutes)

How much architecture should you design before writing code?

### The Temptation of Big Design Up Front

It's tempting to think we should figure everything out before coding. Draw all the diagrams, make all the decisions, then implement.

The problem: **we don't know what we don't know**. Requirements change. We discover technical constraints. Users want different things than we expected. An architecture designed in isolation from implementation often doesn't survive contact with reality.

### Piecemeal Growth

Architect Christopher Alexander, in *The Timeless Way of Building*, observed that the most livable spaces emerge through gradual, adaptive growth rather than master plans. A building's inhabitants discover what they actually need by living in it.

Software has the same property. We discover what the architecture *should* be by building and using the system. This argues for:
- Making decisions as late as responsibly possible
- Keeping options open where uncertainty is high
- Refactoring toward better structure as we learn

### Just Enough Architecture

The pragmatic middle ground: **decide what's hard to change; defer what's easy to change**.

For CookYourBooks:
- **Decide now**: Service boundaries, persistence abstraction, how CLI/GUI share logic
- **Defer**: Specific file formats, exact API signatures, UI layout details

Don't architect for requirements you don't have. But *do* architect for quality attributes you know you need—testability, extensibility, maintainability.

### Architecture Emerges from Constraints

Here's a useful frame: architecture is the shape that emerges when you apply your constraints and quality attributes to your functional requirements.

- Testability constraint → Hexagonal Architecture (from L16)
- Extensibility requirement → Strategy pattern for parsers and exporters
- Team size constraint → Simpler service boundaries, fewer moving parts
- Time constraint → Build the walking skeleton first, flesh out later

The services we identified for CookYourBooks didn't come from a template. They emerged from asking: "Given what this system must do, and how we need it to behave, what structure makes sense?"

---

In the next lecture, we'll examine **architectural patterns**—recurring structures that architects have found useful across many systems. We'll see how patterns like Hexagonal Architecture (which we met in L16 for testability) apply to CookYourBooks' service layer, and explore how architectural choices affect quality attributes like maintainability, scalability, and even energy efficiency.
