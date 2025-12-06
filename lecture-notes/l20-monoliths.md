---
sidebar_position: 20
lecture_number: 20
title: Architectural Qualities
---

In [L16 (Design for Testability)](./l16-testing2.md), we introduced **Hexagonal Architecture** (Ports and Adapters) as a way to separate domain logic from infrastructure, making code testable. That was architecture in service of a specific quality attribute: testability. In [L19](./l19-architecture-design.md), we identified service boundaries for CookYourBooks—`ImportService`, `LibraryService`, and `ExportService`—by applying heuristics about cohesion, coupling, and change.

Now we zoom out to look at architectural styles more broadly—recurring structures that help organize entire applications. We'll see how these styles apply to CookYourBooks and how they affect quality attributes beyond just testability. 

Architecture is fundamentally about tradeoffs. Every architectural choice affects multiple quality attributes: maintainability (how easy is it to change?), scalability (how does it handle growth?), performance (how fast is it?), and increasingly, energy efficiency (how much power does it consume?). There's no universally "best" architecture—only architectures that are better or worse fits for particular constraints and priorities. Our goal is to develop vocabulary for discussing these tradeoffs and intuition for recognizing them.

## Architectural Styles vs. Patterns (3 minutes)

Before diving into specific examples, let's clarify vocabulary that architects use (and sometimes confuse).

An **architectural style** describes a bundle of characteristics about a system. When we name a style, we're capturing several dimensions at once: how components and their dependencies are organized (the *component topology*), whether the system runs as a single deployment unit or as multiple networked services (the *physical architecture*), how frequently and in what pieces the system gets deployed, how components communicate with each other (method calls? REST? message queues?), and whether data is centralized or spread across multiple stores.

Naming a style gives us shorthand for this complex bundle. When you say "microservices," other architects immediately understand implications about deployment, communication, team structure, and more. When you say "layered architecture," they picture horizontal strata with rules about which layers can call which. The name is a handle for a whole worldview.

An **architectural pattern**, by contrast, is a contextualized solution to a recurring problem. Patterns are more specific and tactical. "Circuit Breaker" is a pattern for handling failures in distributed systems. "Repository" is a pattern for abstracting data access. You might use many patterns within a single architectural style.

The distinction matters: styles describe the overall shape and constraints of a system; patterns are reusable solutions you apply within that system.

:::tip Where Do Architectural Styles Come From?
There's no official committee that decides what architectural styles exist. Styles emerge from practice. A clever architect notices that new ecosystem capabilities—better DevOps tooling, reliable containers, domain-driven design principles—enable new ways to solve old problems. They combine these capabilities, others copy the approach, and eventually it gets a name.

**Microservices** is a perfect example: the name emerged as a reaction to the "big service" architectures that preceded it, not as a prescription to build the smallest services possible. The style became possible because of improvements in deployment automation, container orchestration, and API design practices.

This is the software engineering version of [piecemeal growth](./l19-architecture-design.md)—Christopher Alexander's observation that good architecture emerges through gradual adaptation rather than top-down master plans. Architectural styles aren't invented in ivory towers; they evolve from the ecosystem.
:::

## CookYourBooks: Applying Architecture to a Familiar Domain (5 minutes)

We've been building CookYourBooks throughout the course. In [L18](./l18-creation-patterns.md), we saw how object-level patterns (Builder, Factory Methods, Dependency Injection) help construct and wire individual objects. In [L19](./l19-architecture-design.md), we identified service boundaries based on cohesion, coupling, and change vectors.

Now let's see how architectural patterns help us structure the application as a whole.

As a reminder, CookYourBooks:
- Manages **Recipes** (with ingredients, instructions, notes, and conversion rules)
- Organizes recipes into **Cookbooks** within a **UserLibrary**
- Imports recipes from various sources (JSON, images via OCR, markdown)
- Exports recipes to various formats (markdown, JSON)
- Provides both **CLI** and **GUI** interfaces
- Integrates with external services (Tesseract for local OCR, Claude API for cloud OCR)

These requirements create architectural challenges:
- Multiple input/output formats behind unified interfaces
- Multiple user interfaces sharing the same logic
- External service integration that shouldn't pollute domain code
- Testability requirements (we need to test without real files or APIs)

Let's see how Hexagonal Architecture—which we first met in L16—addresses these challenges.

## Hexagonal Architecture Applied to CookYourBooks (15 minutes)

In L16, we saw Hexagonal Architecture (Ports and Adapters) applied to a smart home energy optimizer. The pattern separated domain logic from infrastructure, making the code testable. Now let's apply the same pattern to CookYourBooks.

### The Core Domain

CookYourBooks' domain logic doesn't care *how* recipes are stored or *where* they come from—it only cares about recipes, cookbooks, and the operations on them:

```java
// Domain: Pure business logic, no infrastructure
public class RecipeScaler {
    private final ConversionRegistry conversions;
    
    public RecipeScaler(ConversionRegistry conversions) {
        this.conversions = conversions;
    }
    
    public Recipe scaleToServings(Recipe recipe, int targetServings) {
        double scaleFactor = (double) targetServings / recipe.getServings();
        List<Ingredient> scaledIngredients = recipe.getIngredients().stream()
            .map(ing -> scaleIngredient(ing, scaleFactor))
            .toList();
        return recipe.withIngredients(scaledIngredients)
                     .withServings(targetServings);
    }
    
    public Recipe convertToSystem(Recipe recipe, UnitSystem targetSystem) {
        List<Ingredient> converted = recipe.getIngredients().stream()
            .map(ing -> convertIngredient(ing, targetSystem))
            .toList();
        return recipe.withIngredients(converted);
    }
}
```

This code knows nothing about JSON files, OCR APIs, or database connections. It's pure domain logic: given a recipe, scale it or convert its units.

### Ports Define What the Domain Needs

Ports are interfaces that describe what the application needs from the outside world—without specifying how:

```java
// Port: How do we load recipes? (not HOW they're stored)
public interface RecipeRepository {
    Optional<Recipe> findById(RecipeId id);
    List<Recipe> findByCookbook(CookbookId cookbookId);
    void save(Recipe recipe);
    void delete(RecipeId id);
}

// Port: How do we import recipes? (not WHICH format)
public interface RecipeImporter {
    Recipe importRecipe(Path source) throws ImportException;
    boolean canHandle(Path source);
}

// Port: How do we export recipes? (not WHICH format)
public interface RecipeExporter {
    void export(Recipe recipe, Path destination) throws ExportException;
    String getFormatName();
}

// Port: How do we perform OCR? (not WHICH service)
public interface OcrService {
    String extractText(Path imagePath) throws OcrException;
}
```

### Adapters Connect to Real Infrastructure

Adapters implement the ports for specific technologies:

```java
// Adapter: JSON file storage
public class JsonRecipeRepository implements RecipeRepository {
    private final Path storageDirectory;
    private final ObjectMapper mapper;
    
    public JsonRecipeRepository(Path storageDirectory, ObjectMapper mapper) {
        this.storageDirectory = storageDirectory;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<Recipe> findById(RecipeId id) {
        Path file = storageDirectory.resolve(id.value() + ".json");
        if (!Files.exists(file)) return Optional.empty();
        return Optional.of(mapper.readValue(file.toFile(), Recipe.class));
    }
    
    @Override
    public void save(Recipe recipe) {
        Path file = storageDirectory.resolve(recipe.getId().value() + ".json");
        mapper.writeValue(file.toFile(), recipe);
    }
}

// Adapter: Tesseract OCR (local)
public class TesseractOcrAdapter implements OcrService {
    private final Tesseract tesseract;
    
    public TesseractOcrAdapter(String tessDataPath) {
        this.tesseract = new Tesseract();
        tesseract.setDatapath(tessDataPath);
    }
    
    @Override
    public String extractText(Path imagePath) throws OcrException {
        try {
            return tesseract.doOCR(imagePath.toFile());
        } catch (TesseractException e) {
            throw new OcrException("Tesseract failed", e);
        }
    }
}

// Adapter: Claude API OCR (cloud)
public class ClaudeOcrAdapter implements OcrService {
    private final HttpClient client;
    private final String apiKey;
    
    @Override
    public String extractText(Path imagePath) throws OcrException {
        // Encode image, call Claude API, parse response
        byte[] imageBytes = Files.readAllBytes(imagePath);
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        // ... HTTP request to Claude API ...
    }
}

// Adapter: Markdown export
public class MarkdownExportAdapter implements RecipeExporter {
    @Override
    public void export(Recipe recipe, Path destination) throws ExportException {
        StringBuilder md = new StringBuilder();
        md.append("# ").append(recipe.getTitle()).append("\n\n");
        md.append("*Servings: ").append(recipe.getServings()).append("*\n\n");
        md.append("## Ingredients\n\n");
        for (Ingredient ing : recipe.getIngredients()) {
            md.append("- ").append(ing.format()).append("\n");
        }
        // ... instructions, notes ...
        Files.writeString(destination, md.toString());
    }
    
    @Override
    public String getFormatName() { return "Markdown"; }
}
```

### Services Orchestrate Domain and Adapters

The services we identified in L20 coordinate between domain logic and infrastructure:

```java
public class ImportService {
    private final List<RecipeImporter> importers;
    private final OcrService ocrService;
    private final RecipeParser recipeParser;
    
    public ImportService(List<RecipeImporter> importers, 
                         OcrService ocrService,
                         RecipeParser recipeParser) {
        this.importers = importers;
        this.ocrService = ocrService;
        this.recipeParser = recipeParser;
    }
    
    public Recipe importFromFile(Path file) throws ImportException {
        // Find appropriate importer
        RecipeImporter importer = importers.stream()
            .filter(i -> i.canHandle(file))
            .findFirst()
            .orElseThrow(() -> new ImportException("No importer for: " + file));
        return importer.importRecipe(file);
    }
    
    public Recipe importFromImage(Path imagePath) throws ImportException {
        // Use OCR to extract text, then parse
        String extractedText = ocrService.extractText(imagePath);
        return recipeParser.parse(extractedText);
    }
}

public class LibraryService {
    private final RecipeRepository recipeRepository;
    private final CookbookRepository cookbookRepository;
    
    public LibraryService(RecipeRepository recipeRepository,
                          CookbookRepository cookbookRepository) {
        this.recipeRepository = recipeRepository;
        this.cookbookRepository = cookbookRepository;
    }
    
    public void addRecipeToCookbook(Recipe recipe, CookbookId cookbookId) {
        Cookbook cookbook = cookbookRepository.findById(cookbookId)
            .orElseThrow(() -> new CookbookNotFoundException(cookbookId));
        recipeRepository.save(recipe);
        cookbook.addRecipe(recipe.getId());
        cookbookRepository.save(cookbook);
    }
    
    public List<Recipe> getRecipesInCookbook(CookbookId cookbookId) {
        return recipeRepository.findByCookbook(cookbookId);
    }
}
```

### Why This Structure Matters

| Concern | Where It Lives | Can Change Without Affecting... |
|---------|----------------|--------------------------------|
| "Scale recipe to 8 servings" | Domain (RecipeScaler) | Any adapter |
| "Recipes stored as JSON files" | Adapter (JsonRecipeRepository) | Domain logic, other adapters |
| "OCR via Tesseract" | Adapter (TesseractOcrAdapter) | Domain logic, can swap to Claude |
| "Export as Markdown" | Adapter (MarkdownExportAdapter) | Domain logic, import adapters |
| "CLI commands" | Adapter (CliController) | Domain logic, GUI |

This is the payoff of Hexagonal Architecture: the business rules are protected from infrastructure churn. When we add a new export format, we add an adapter—the domain never changes. When we switch from local OCR to cloud OCR, we swap an adapter—the import service never knows.

## Read Architectural Diagrams and Recognize Common Patterns

Now that we've seen Hexagonal Architecture in depth, let's survey several other foundational architectural styles. As you read architectural diagrams and documentation, you'll encounter these patterns constantly.

### Layered Architecture (5 minutes)

The **layered architecture** organizes code into horizontal strata, each with a distinct responsibility. The classic formulation has four layers: Presentation (user interface), Application/Service (orchestration and use cases), Domain (business logic and rules), and Infrastructure (databases, external services, file I/O).

The key rule is that dependencies flow downward: Presentation can call Service, Service can call Domain, Domain can call Infrastructure—but not the reverse. This creates clear separation of concerns. You can swap your database without touching your business rules. You can change your UI framework without rewriting your services.

How does this relate to Hexagonal Architecture? Both achieve separation of domain logic from infrastructure, but through different lenses. Hexagonal emphasizes the *direction of dependencies* (domain at the center, infrastructure at the edges). Layered emphasizes *horizontal strata* with strict rules about which layer can call which. In practice, you'll often see both perspectives applied to the same system.

In CookYourBooks, we can identify these layers:
- **Presentation**: CLI commands, JavaFX views
- **Application/Service**: ImportService, LibraryService, ExportService
- **Domain**: Recipe, Cookbook, Ingredient, ConversionRegistry
- **Infrastructure**: JsonRecipeRepository, TesseractOcrAdapter, MarkdownExportAdapter

The benefits are clear: separation of concerns, improved testability, and the ability to replace components. But layered architectures have pitfalls too. Changes that span multiple layers (adding a new field to Recipe that flows from UI to database) require touching every layer. Hence, while the layered architecture is an important style to study, it should not be blindly and strictly applied—the hexagonal architecture is often a better way to think about the problem.

### Pipelined Architecture (5 minutes)

The **pipelined architecture** (sometimes called "pipes and filters") organizes processing as a series of stages. Data flows through the pipeline, with each stage transforming its input into output for the next stage. Stages are independent and composable—you can add, remove, or reorder them without rewriting the whole system.

Compilers are classic examples: source code flows through lexing, parsing, type checking, optimization, and code generation stages. Data processing workflows (ETL jobs, stream processing) often follow this pattern.

In CookYourBooks, recipe import could be implemented as a pipeline:

```
Image File → [OCR Extract] → Raw Text → [Text Cleanup] → Clean Text 
    → [Recipe Parser] → Unvalidated Recipe → [Validator] → Recipe
```

Each stage can be developed and tested independently. Adding support for a new preprocessing step (say, spell correction) means adding a stage, not rewriting the whole flow.

The benefits are modularity and flexibility. The constraint is that the pattern works best when data truly flows in one direction—it's awkward for interactive or bidirectional workflows.

### Client-Server Architecture (5 minutes)

The **client-server architecture** separates systems into two roles: clients make requests, servers respond to them. The server centralizes data and logic; multiple clients can connect simultaneously. This is perhaps the most ubiquitous architectural style—every web application, every mobile app talking to a backend, every database connection follows this pattern.

CookYourBooks is primarily a desktop application, but it has client-server relationships too:
- The application (client) calls the Claude API (server) for cloud OCR
- If we added cloud sync, the desktop app (client) would sync with a cloud service (server)
- Even locally, JavaFX views (clients) request data from services (servers within the same process)

The benefits are centralized control, shared state across clients, and easier updates (change the server once, all clients benefit). The constraints are significant: the server becomes a single point of failure, and network latency affects every operation. For CookYourBooks, this is why we support both local and cloud OCR—users shouldn't be unable to import recipes just because their internet is down.

Client-server introduces **distributed architecture**—systems where components run on different machines and communicate over networks. This introduces challenges that don't exist in single-process applications. CookYourBooks hits these challenges when using cloud OCR! What happens when the API call times out? When the user's WiFi drops mid-upload?

In the next lecture, we'll explore these challenges in depth: the **Fallacies of Distributed Computing**, security as an architectural concern, and patterns for building reliable distributed systems.

## Architecture and Quality Attributes (10 minutes)

Now that we've seen several architectural styles, let's examine how they affect three critical quality attributes: maintainability, scalability, and energy efficiency. These aren't abstract concerns—they have real consequences for teams, users, and the environment.

### Maintainability

Maintainability is about how easily a system can be changed over time. This includes fixing bugs, adding features, updating dependencies, and adapting to new requirements.

Hexagonal and layered architectures excel at maintainability *within* their boundaries. Because the domain is isolated from infrastructure, you can swap storage mechanisms or update API clients without rewriting business logic. The tradeoff is that changes spanning multiple layers (a new field flowing from UI to storage) touch many files.

Pipelined architectures are highly maintainable for their intended use case—adding a new processing stage is straightforward. But if you need to add cross-cutting concerns (logging, error handling, transactions), you may need to modify every stage.

In CookYourBooks, maintainability matters because:
- New recipe formats will emerge (we might want to import from Paprika, Cookmate, or other apps)
- Export requirements will change (PDF export? Print formatting?)
- OCR services will evolve (better models, new APIs)

An architecture that isolates format-specific code (like our `RecipeImporter` and `RecipeExporter` ports) makes it possible to add Paprika support without touching JSON import logic.

### Scalability

Scalability is about handling growth—more users, more data, more requests. Systems can scale *vertically* (bigger hardware) or *horizontally* (more instances).

For CookYourBooks as a desktop application, scalability has a different meaning than for web services:
- **Data scalability**: Can the app handle a user with 10,000 recipes? 100 cookbooks?
- **Feature scalability**: Can we add new capabilities without the codebase becoming unmanageable?

Our Hexagonal Architecture helps with feature scalability: new import/export formats are isolated adapters. The clean separation of concerns means the codebase can grow without becoming tangled.

When CookYourBooks becomes a cloud service, the architecture will need to change. The services we've designed could run on separate servers, but we'll need to address state management, caching, and other challenges of distributed computing.

### Energy Efficiency

Energy efficiency is an increasingly important quality attribute that architects often overlook. Software doesn't consume energy directly, but the hardware it runs on does—and architectural choices determine how much.

For CookYourBooks:
- **Local-first processing** (using Tesseract for OCR) consumes energy on the user's machine but avoids network transmission costs
- **Cloud processing** (using Claude API) offloads computation but requires network round-trips and data center energy
- **Efficient algorithms** in recipe scaling and search affect battery life on laptops

The choice between local and cloud OCR isn't just about accuracy or cost—it's also about energy. A user processing a hundred cookbook photos locally might drain their laptop battery; the same work via API might use less local energy but more total energy (network + data center).

For a cookbook app, these concerns are modest. But the principle applies broadly: architectural decisions have energy implications that compound across millions of users.

### The Tradeoffs Are Real

These quality attributes often conflict:
- A highly maintainable architecture with clean abstractions may be less efficient than hand-optimized code
- An energy-efficient local-first design may sacrifice features that require cloud infrastructure
- A horizontally scalable distributed system is harder to maintain than a monolith (we'll see this in the coming lectures)

There's no free lunch. The architect's job is to understand the priorities for a particular system and make informed tradeoffs. For CookYourBooks, we prioritize maintainability (new formats are inevitable) and testability (we want confidence in our code) over extreme performance optimization.

## Compare Technical Partitioning vs. Domain Partitioning (10 minutes)

Beyond choosing an architectural style, we face another fundamental question: how do we organize our code into modules or packages? There are two dominant approaches, and the choice has implications for how teams work.

**Technical partitioning** organizes code by its technical role. All controllers go in one package, all services in another, all repositories in a third:

```
cookYourBooks/
├── controllers/
│   ├── CliController.java
│   ├── ImportController.java
│   └── ExportController.java
├── services/
│   ├── ImportService.java
│   ├── LibraryService.java
│   └── ExportService.java
├── repositories/
│   ├── RecipeRepository.java
│   └── CookbookRepository.java
└── domain/
    ├── Recipe.java
    ├── Cookbook.java
    └── Ingredient.java
```

**Domain partitioning** organizes code by business capability. Everything related to importing goes in an `import/` module—the controller, service, and format-specific adapters:

```
cookYourBooks/
├── import/
│   ├── ImportService.java
│   ├── ImportController.java
│   ├── JsonImporter.java
│   ├── MarkdownImporter.java
│   └── OcrImporter.java
├── library/
│   ├── LibraryService.java
│   ├── RecipeRepository.java
│   └── CookbookRepository.java
├── export/
│   ├── ExportService.java
│   ├── MarkdownExporter.java
│   └── JsonExporter.java
└── domain/
    ├── Recipe.java
    ├── Cookbook.java
    └── Ingredient.java
```

The tradeoffs become clear when you ask practical questions:

**Where do you look to understand "how import works"?**
- Technical: Jump between `controllers/`, `services/`, and multiple adapter packages
- Domain: Everything is in `import/`

**Which approach minimizes cross-package changes?**
- Technical: Adding a new import format requires edits in `controllers/`, `services/`, and a new adapter package
- Domain: All changes stay within `import/`

**Which supports team independence?**
- Technical: Every feature requires coordination between "controller team," "service team," and "adapter team"
- Domain: An "import team" can own their vertical slice independently

When moving away from a "monolithic" architecture, where services are separated by technical boundaries, these tradeoffs become more pronounced (we'll see this in the coming lectures).

### Architecture and Team Topologies

In [L17 (Teams and Collaboration)](./l17-teams.md), we discussed Brooks' Law and how communication overhead grows quadratically with team size. Architecture decisions directly affect how teams can be organized—and vice versa.

For CookYourBooks with a four-person team, domain partitioning works well:
- One person owns import (all formats, CLI and GUI integration)
- One person owns library management and storage
- One person owns export (all formats)
- One person owns the GUI shell and coordinates

Each person can work relatively independently, with well-defined interfaces between their domains.

This brings us back to **Conway's Law**:
> "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."

Your system's architecture will tend to mirror your team's communication structure. If you want clean domain boundaries, organize your team around those domains. If you want clean platform boundaries for your team (e.g. "frontend" vs. "backend"), organize your team around those boundaries, and a layered architecture will naturally emerge.

## Recognize the Big Ball of Mud Anti-pattern (5 minutes)

Not every system has a discernible architecture. Some systems grow organically without any guiding structure, accumulating features and fixes until no one understands how the pieces fit together. Architects call this a **Big Ball of Mud**. Brian Foote and Joseph Yoder named this antipattern in their famous 1997 paper:

> "A Big Ball of Mud is a haphazardly structured, sprawling, sloppy, duct-tape-and-baling-wire, spaghetti-code jungle. These systems show unmistakable signs of unregulated growth, and repeated, expedient repair. Information is shared promiscuously among distant elements of the system, often to the point where nearly all the important information becomes global or duplicated."

The real cost isn't aesthetics—it's changeability. Eventually, the system reaches a critical point where it's cheaper to rewrite than to maintain.

What would a Big Ball of Mud version of CookYourBooks look like?
- The CLI directly parses JSON files instead of going through ImportService
- Recipe scaling logic is duplicated in both CLI and GUI code
- OCR results are cached in a global variable that both import and export code read
- Adding a new export format requires changes in six different classes
- Tests are impossible because everything depends on real files and network calls

How do you prevent this decay?
- **Discipline and code review** catch architectural violations early
- **Continuous refactoring** pays down technical debt incrementally
- **The coupling and cohesion metrics** from L7-L8 serve as early warning systems
- **Clear ownership** gives someone an incentive to keep each module clean
- **Tests that enforce boundaries** fail when code bypasses the intended architecture

## Preview: MVC and GUI Patterns (3 minutes)

We've focused on backend architecture in this lecture, but similar patterns apply to user interfaces. The most famous is **Model-View-Controller (MVC)**, which separates domain logic (the Model) from presentation (the View) and user interaction handling (the Controller).

We'll cover MVC in detail in the GUI lectures (L29-L30), where you'll apply it hands-on to build the CookYourBooks interface. For now, just recognize that layered architecture and MVC are complementary. MVC typically lives within or across the Presentation and Application layers of a layered architecture. The patterns reinforce each other: layered architecture tells you to separate presentation from domain; MVC tells you how to structure the presentation layer itself.

In CookYourBooks:
- **Model**: Recipe, Cookbook, and the services that manage them
- **View**: JavaFX FXML layouts and the visual components
- **Controller**: Classes that handle user actions and update the view

The Hexagonal Architecture we've been discussing ensures that the Model (domain + services) is completely independent of the View—exactly what MVC prescribes.
