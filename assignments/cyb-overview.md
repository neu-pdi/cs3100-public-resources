---
sidebar_position: 1
---

# Cook Your Books: Project Overview

Throughout this semester, you will build CookYourBooks, a comprehensive desktop application for managing digital cookbooks and recipes. This real-world application addresses a common problem: how to efficiently digitize, organize, and use recipes from physical cookbooks and websites. The final product will feature OCR-powered recipe extraction from images, a rich domain model for representing complex recipe structures, intelligent scaling and unit conversion, and both command-line and graphical user interfaces. By the end of the course, you'll have created a fully-functional application that could genuinely be used by home cooks and professional chefs alike—something substantial enough for your portfolio that demonstrates your ability to design and implement complex software systems. For inspiration on what a real-world application might look like, refer to existing products [EatYourBooks](https://eatyourbooks.com/), [ChefSteps' Recipe Interface](https://www.chefsteps.com/activities/skillet-apple-pie), and [CookShelf](https://www.cookshelf.app/). 

The project follows a carefully scaffolded approach where each weekly assignment builds upon the previous one, with our solution to each assignment provided as the foundation for the next. You'll begin in Module 1 by implementing the core domain model—learning to design rich object hierarchies for ingredients, quantities, and recipes while practicing fundamental OO principles like inheritance, polymorphism, and encapsulation. As you progress into Module 2, you'll add persistence through custom JSON serialization, build comprehensive test suites with mocking, and create service layers that separate business logic from infrastructure concerns. Starting in Assignment 3 (Week 4-5), you'll incorporate AI coding assistants into your workflow, learning to leverage these tools effectively while maintaining code quality and understanding.

The final phase of the project emphasizes real-world development practices and user-centered design. You'll implement both CLI and GUI interfaces, focusing on usability and user experience while managing the complexity of asynchronous operations like OCR processing. Working in teams of four during the last module, you'll tackle architectural challenges including integrating multiple external services (Tesseract and Claude API for OCR), implementing design patterns like Strategy and Builder, and handling the complexities of concurrent operations in a desktop application. Throughout this journey, you'll not only master Java and JavaFX, but also develop crucial software engineering skills: interpreting requirements, designing for change, writing maintainable code, and collaborating effectively in a team.

Assignments are structured to provide a steady, manageable pace throughout the semester. Each assignment is due on a Thursday at 11:59 PM, with a minimum of 3-4 days between assignment due dates to ensure adequate time for implementation, testing, and reflection. Some weeks' tasks have been intentionally merged to combine related concepts and create more substantial programming tasks that better reflect real-world development work. 

**Notes:**
- Each assignment builds on the provided solution from the previous week. Students are trusted to not share these solutions, or to seek them out.
- AI coding assistants are introduced in Week 5 (Assignment 3) and encouraged thereafter. Students are strongly discouraged from using them in the first two assignments.
- Group work begins in Week 10 (teams formed by Week 8)
- Labs complement but don't depend on the main project assignments - they always build on a solution from a week earlier.


## **Module 1: Design Principles and Patterns**

### **Week 1: Java Fundamentals & Domain Modeling**
- [**Assignment 1: Recipe Domain Model**](/assignments/cyb1-recipes) (Due 2026-01-15)
  - Implement `Unit`, `UnitSystem`, `UnitDimension` enums with fields and methods
  - Implement `Quantity` hierarchy: `ExactQuantity`, `FractionalQuantity`, `RangeQuantity`
  - Implement `Ingredient` hierarchy: `MeasuredIngredient`, `VagueIngredient`
  - Practice inheritance, polymorphism, and composition
  - Write Javadoc specifications with preconditions and postconditions
  - Write comprehensive unit tests with JUnit 5
- [**Lab 1: Java Tooling and Setup**](/labs/lab1-java-setup)
  - Set up development environment, practice with Gradle, Git

### **Week 2-3: Specifications, Contracts, and Information Hiding**
- [**Assignment 2: Unit Conversion, Recipe and Instruction Classes**](/assignments/cyb2-unit-conversion) (Due 2026-01-29)
  - Build on A1 solution (provided)
  - Implement `ConversionRule` record and `ConversionRegistry` interface with `LayeredConversionRegistry`
  - Implement priority-based unit conversion (house > recipe-specific > global)
  - Implement `Recipe` (with scaling and conversion), `Instruction`, and `RecipeBuilder`
  - Design recipe note representation (internal design decision left to students)
  - Implement `equals()` and `hashCode()` for value objects
  - Focus on immutable transformations, encapsulation, and information hiding
  - Practice making principled design decisions with documented tradeoffs
- [**Lab 2: Java Abstraction and Data Types**](/labs/lab2-java-abstraction)
  - Practice with abstract classes vs interfaces
- [**Lab 3: Readability and Modularity**](/labs/lab3-readability)
  - Refactoring exercise on provided "bad" code

### **Week 4: Exam Week**
- No homework assignment
- [**Lab 4: Changeability**](/labs/lab4-changeability)
  - Analyze coupling/cohesion in provided code samples

### **Weeks 5-6: Domain Extensions, Hexagonal Persistence & AI Workflow**
- [**Assignment 3: Domain Extensions and Hexagonal Persistence**](/assignments/cyb3-json-serialization) (Due 2026-02-12)
  - Build on A2 solution (provided)
  - **Domain Modeling:**
    - Implement `Cookbook`, `UserLibrary`, `TableOfContents`
    - Design relationships between recipes, cookbooks, and the user library
  - **Hexagonal Architecture - Driven Ports (Persistence):**
    - Define `RecipeRepository` and `CookbookRepository` ports (interfaces)
    - Implement `JsonRecipeRepository` and `JsonCookbookRepository` adapters
    - Implement custom Jackson serializers/deserializers for domain hierarchy
    - Handle polymorphic serialization (Quantity types, Ingredient types)
  - **Factory Methods and Parsing:**
    - Create factory methods for parsing ingredient strings from text
    - Implement builders for complex ingredient construction
  - **Export Adapter:**
    - Implement `MarkdownExporter` adapter for recipe export
  - **First assignment where AI assistants are allowed/encouraged**
    - Practice using AI for boilerplate generation and serialization code
    - Reflect on AI strengths/weaknesses for different task types
- [**Lab 5: Domain Modeling**](/labs/lab5-domain-modeling)
  - Create a domain model for Pawtograder course operations platform
- [**Lab 6: AI Coding Agents**](/labs/lab6-copilot)
  - Learn to effectively prompt AI for code generation


## **Module 2: Development Practices and User-Centered Design**

### **Week 7-8: Services, OCR Integration, and Testing**
- [**Assignment 4: Services, OCR, and Testing**](/assignments/cyb4-testing) (Due 2026-02-26)
  - Build on A3 solution (provided)
  - **Application Services (Hexagonal Core):**
    - Implement `ImportService`, `ExportService`, `LibraryService`
    - Design service contracts with clear preconditions and postconditions
    - Wire services using dependency injection (constructor injection)
    - Services depend only on ports, never on concrete adapters
  - **OCR Integration (Tesseract):**
    - Define `OcrService` port (interface) for text extraction
    - Implement `TesseractOcrAdapter` using Tess4J library
    - Create `RecipeParser` to extract structured recipes from OCR text
    - Handle OCR errors gracefully (blurry images, partial text)
  - **Exception Handling Strategy:**
    - Design application-wide exception hierarchy
    - Implement error recovery patterns
    - Create a comprehensive logging system
  - **Comprehensive Testing:**
    - Write unit tests with JUnit 5 parameterized tests
    - Test `ImportService` with mock `OcrService` (no real Tesseract needed)
    - Test `RecipeParser` with sample OCR output texts
    - Demonstrate how Hexagonal Architecture enables testability
  - **Architecture Documentation:**
    - Write 2-3 Architecture Decision Records (ADRs)
    - Create C4 component diagram showing ports and adapters
  - **Requirements Interpretation:**
    - Parse and interpret requirements documents with ambiguities
    - Document design decisions and rationale
  - AI assistants encouraged
- [**Lab 7: Requirements Interpretation**](/labs/lab7-requirements)
  - Practice translating user stories to technical specs
- [**Lab 8: Dependencies**](/labs/lab8-dependencies)
  - Dependency injection exercise
- [**Team Formation**](/assignments/team-forming) (Due 2026-02-26)
  - Find your group of 4

### **Week 9: Spring Break**
- No assignments, prepare for group project to begin next week

### **Week 10-11: Rich Command-Line Interface**
- [**Assignment 5: Interactive CLI**](/assignments/cyb5-service-architecture) (Due 2026-03-19)
  - Build on A4 solution (provided)
  - **CLI as a Driving Adapter:**
    - Implement the CLI as a Hexagonal "driving adapter"
    - CLI controller depends on application services, not domain directly
    - Apply MVC pattern: CLI views, controllers, and service-backed model
  - **Rich Interactive Features:**
    - Multi-level command hierarchy (library → cookbook → recipe navigation)
    - Tab completion for commands, cookbook names, recipe titles
    - Command history and editing (JLine or similar library)
    - Contextual help system (`help`, `help <command>`)
    - Progress indicators for long-running operations
  - **Usability and Polish:**
    - Apply Nielsen's usability heuristics to CLI design
    - Consistent command grammar and feedback patterns
    - Graceful error handling with actionable error messages
    - Support for both interactive and scripted (non-interactive) modes
  - **Import/Export Workflows:**
    - Import recipes from JSON files and images (via OCR) through CLI
    - Export recipes and cookbooks to markdown
    - Batch operations (import directory of images, export entire cookbook)
- [**Lab 10: Architecture**](/labs/lab10-architecture)
  - Design architecture diagrams for recipe system

## **Module 3: Design in the Large (Group Work Begins)**

### **Week 12-13: GUI Patterns and Concurrency**
- [**Group Assignment 1: GUI**](/assignments/cyb11-gui-advanced) (Due 2026-04-02)
  - Build on A5 solution (provided)
  - Create main window with tabs
  - Implement recipe list view
  - Basic navigation
  - Implement async image loading
  - Add recipe editing dialogs
  - Implement drag-and-drop for images
  - Handle long-running operations (OCR) with progress indicators
- [**Lab 11: Usability Testing**](/labs/lab11-heuristic-eval)
  - Conduct usability tests on classmates' interfaces
- [**Lab 12: GUI Programming**](/labs/lab12-gui)
  - JavaFX workshop

### **Week 12: OCR Integration**
- [**Group Assignment 2: OCR Service Integration**](/assignments/cyb12-ocr-integration) (Due 2026-04-09)
  - Integrate multiple OCR backends (Tesseract, Claude API)
  - Implement strategy pattern for OCR parsing
  - Add event-driven updates
  - Develop shared table of contents service
  - Add license and citation support to recipes
  - Performance optimization for batch processing
- [**Lab 13: Asynchronous Programming**](/labs/lab13-async)
  - Practice with CompletableFutures

### **Week 13: Final Integration and Polish**
- [**Group Assignment 3: Final Integration and Polish**](/assignments/cyb13-final-integration) (Due 2026-04-16)
  - Basic social features: recipe rating, commenting, and sharing if licensed for redistribution
  - Reflect on the sustainability of the application
  - Report on the safety and reliability requirements for the next iteration of CookYourBooks
- [**Lab 14: Networks and Distributed Systems**](/labs/lab14-networks)
  - Implement simple client-server recipe sharing

### **Week 14: Final Presentations**
- **Final Project Presentation**
  - Demo full CookYourBooks application
  - Present architecture decisions
  - Discuss challenges and solutions
  - Provide recommendations for future iterations of CookYourBooks
- [**Lab 15: Serverless Architecture**](/labs/lab15-serverless)
  - Deploy recipe API to cloud platform