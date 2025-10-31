---
sidebar_position: 1
---

# Cook Your Books: Project Overview

Throughout this semester, you will build CookYourBooks, a comprehensive desktop application for managing digital cookbooks and recipes. This real-world application addresses a common problem: how to efficiently digitize, organize, and use recipes from physical cookbooks and websites. The final product will feature OCR-powered recipe extraction from images, a rich domain model for representing complex recipe structures, intelligent scaling and unit conversion, and both command-line and graphical user interfaces. By the end of the course, you'll have created a fully-functional application that could genuinely be used by home cooks and professional chefs alike—something substantial enough for your portfolio that demonstrates your ability to design and implement complex software systems. For inspiration on what a real-world application might look like, refer to existing products [EatYourBooks](https://eatyourbooks.com/), [ChefSteps' Recipe Interface](https://www.chefsteps.com/activities/skillet-apple-pie), and [CookShelf](https://www.cookshelf.app/). 

The project follows a carefully scaffolded approach where each weekly assignment builds upon the previous one, with our solution to each assignment provided as the foundation for the next. You'll begin in Module 1 by implementing the core domain model—learning to design rich object hierarchies for ingredients, quantities, and recipes while practicing fundamental OO principles like inheritance, polymorphism, and encapsulation. As you progress into Module 2, you'll add persistence through custom JSON serialization, build comprehensive test suites with mocking, and create service layers that separate business logic from infrastructure concerns. Starting in Week 5, you'll incorporate AI coding assistants into your workflow, learning to leverage these tools effectively while maintaining code quality and understanding.

The final phase of the project emphasizes real-world development practices and user-centered design. You'll implement both CLI and GUI interfaces, focusing on usability and user experience while managing the complexity of asynchronous operations like OCR processing. Working in teams of four during the last module, you'll tackle architectural challenges including integrating multiple external services (Tesseract and Claude API for OCR), implementing design patterns like Strategy and Builder, and handling the complexities of concurrent operations in a desktop application. Throughout this journey, you'll not only master Java and JavaFX, but also develop crucial software engineering skills: interpreting requirements, designing for change, writing maintainable code, and collaborating effectively in a team.

**License:** The project code is Copyright (c) 2025 Jonathan Bell and contributors. Students are permitted to use the code that they are provided for the purpose of completing the assignments in this course, but are expressly prohibited from distributing the code in any way without express written permission from the instructor.

## Summary of Deliverables

## **Assignment Schedule and Learning Objectives**

| Week | Assignment | Learning Objectives |
|------|------------|-------------------|
| 1 | **A1: Recipe Domain Model** — Implement `Ingredient` hierarchy and basic domain classes | Inheritance and polymorphism in Java, implementing core Object methods (`equals`, `hashCode`, `toString`), domain modeling fundamentals |
| 2 | **A2: Quantity System** — Build quantity types with unit conversion support | Design by contract and specifications, handling edge cases and validation, creating type hierarchies for flexibility, unit conversion logic |
| 3 | **A3: Recipe and Instruction Classes** — Complete core recipe model with proper encapsulation | Information hiding and encapsulation, designing immutable objects, managing object relationships, modularity principles |
| 4 | **A4: Builder Patterns and Factory Methods** — Add creation patterns for complex objects | Object creation patterns, fluent interfaces and method chaining, factory methods for parsing, managing construction complexity |
| 5 | **A5: JSON Serialization Layer** — Custom Jackson serializers for polymorphic types | Polymorphic serialization strategies, working with external libraries (Jackson), **first use of AI coding assistants**, data persistence patterns |
| 6 | **A6: Comprehensive Testing Suite** — Unit tests with mocking and 80%+ coverage | Unit testing with JUnit, mocking external dependencies, test coverage and quality metrics, AI-assisted test generation |
| 7 | **A7: Cookbook and Library Model** — Implement cookbook organization and library management | Requirements interpretation, designing for extensibility, complex domain relationships, aggregate design patterns |
| 8 | **A8: Service Layer Architecture** — Create service interfaces with MVC pattern; **Team Formation** | Service-oriented architecture, MVC pattern implementation, separation of concerns, interface design and contracts |
| 9 | *Spring Break* | *No assignment* |
| 10 | **A9: CLI Interface** — Interactive command-line interface with autocomplete | User-centered design principles, CLI usability patterns, error handling and recovery, interactive user feedback |
| 11 | **A10: Basic JavaFX GUI** — Main window with navigation and list views | GUI programming with JavaFX, event-driven programming, MVC in desktop applications, basic layout and navigation |
| 12 | **Group A1: Advanced GUI Features** — Async operations, editing dialogs, drag-and-drop | Asynchronous UI operations, advanced JavaFX components, progress indication patterns, team collaboration with Git |
| 13 | **Group A2: OCR Service Integration** — Multiple OCR backends with strategy pattern | Strategy pattern implementation, external API integration, event-driven architecture, performance optimization |
| 14 | **Group A3: Final Integration and Polish** — Complete application with advanced features | System integration, error handling at scale, performance profiling, data safety and recovery |
| 15 | **Final Presentation** — Demo and architecture discussion | Technical presentation skills, architecture documentation, reflecting on design decisions, professional software delivery |

**Notes:**
- Each assignment builds on the provided solution from the previous week
- AI coding assistants are introduced in Week 5 and encouraged thereafter
- Group work begins in Week 10 (teams formed in Week 8)
- Labs complement but don't depend on the main project assignments