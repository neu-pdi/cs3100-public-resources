---
sidebar_position: 1
---

# Cook Your Books: Project Overview

Throughout this semester, you will build CookYourBooks, a comprehensive desktop application for managing digital cookbooks and recipes. This real-world application addresses a common problem: how to efficiently digitize, organize, and use recipes from physical cookbooks and websites. The final product will feature OCR-powered recipe extraction from images, a rich domain model for representing complex recipe structures, intelligent scaling and unit conversion, and both command-line and graphical user interfaces. By the end of the course, you'll have created a fully-functional application that could genuinely be used by home cooks and professional chefs alike—something substantial enough for your portfolio that demonstrates your ability to design and implement complex software systems. For inspiration on what a real-world application might look like, refer to existing products [EatYourBooks](https://eatyourbooks.com/), [ChefSteps' Recipe Interface](https://www.chefsteps.com/activities/skillet-apple-pie), and [CookShelf](https://www.cookshelf.app/). 

The project follows a carefully scaffolded approach where each weekly assignment builds upon the previous one, with our solution to each assignment provided as the foundation for the next. You'll begin in Module 1 by implementing the core domain model—learning to design rich object hierarchies for ingredients, quantities, and recipes while practicing fundamental OO principles like inheritance, polymorphism, and encapsulation. As you progress into Module 2, you'll add persistence through custom JSON serialization, build comprehensive test suites with mocking, and create service layers that separate business logic from infrastructure concerns. Starting in Week 5, you'll incorporate AI coding assistants into your workflow, learning to leverage these tools effectively while maintaining code quality and understanding.

The final phase of the project emphasizes real-world development practices and user-centered design. You'll implement both CLI and GUI interfaces, focusing on usability and user experience while managing the complexity of asynchronous operations like OCR processing. Working in teams of four during the last module, you'll tackle architectural challenges including integrating multiple external services (Tesseract and Claude API for OCR), implementing design patterns like Strategy and Builder, and handling the complexities of concurrent operations in a desktop application. Throughout this journey, you'll not only master Java and JavaFX, but also develop crucial software engineering skills: interpreting requirements, designing for change, writing maintainable code, and collaborating effectively in a team.

**Notes:**
- Each assignment builds on the provided solution from the previous week. Students are trusted to not share these solutions, or to seek them out.
- AI coding assistants are introduced in Week 5 and encouraged thereafter. Students are strongly discouraged from using them in the first four assignments.
- Group work begins in Week 10 (teams formed in Week 8)
- Labs complement but don't depend on the main project assignments - they always build on a solution from a week earlier.


## **Module 1: Design Principles and Patterns**

### **Week 1: Java Fundamentals & Domain Modeling**
- [**Assignment 1: Recipe Domain Model**](/assignments/cyb1-recipes) (Due Week 2, Thursday)
  - Implement basic domain classes: `Ingredient`, `MeasuredIngredient`, `VagueIngredient`
  - Implement `Quantity` hierarchy: `ExactQuantity`, `FractionalQuantity`, `RangeQuantity`
  - Practice inheritance and polymorphism
- [**Lab 1: Java Tooling and Setup**](/labs/lab1-java-setup)
  - Set up development environment, practice with Gradle, Git

### **Week 2: Specifications and Contracts**
- [**Assignment 2: Unit Conversion**](/assignments/cyb2-unit-conversion) (Due Week 3, Thursday)
  - Build on A1 solution (provided)
  - Implement `equals()`, `hashCode()`, `toString()`
  - Write specifications (Javadoc), handle edge cases
  - Implement unit conversions
- [**Lab 2: Java Abstraction and Data Types**](/labs/lab2-java-abstraction)
  - Practice with abstract classes vs interfaces

### **Week 3: Modularity and Information Hiding**
- [**Assignment 3: Recipe and Instruction Classes**](/assignments/cyb3-recipe-instruction) (Due Week 4, Thursday)
  - Build on A2 solution (provided)
  - Implement `Recipe`, `Instruction`, `RecipeNote` classes
  - Focus on encapsulation, information hiding
  - Design immutable objects where appropriate
- [**Lab 3: Readability and Modularity**](/labs/lab3-readability)
  - Refactoring exercise on provided "bad" code

### **Week 4: Object Creation Patterns**
- [**Assignment 4: Builder Patterns and Factory Methods**](/assignments/cyb4-builders-factories) (Due Week 5, Thursday)
  - Build on A3 solution (provided)
  - Implement builders for `Recipe` and complex ingredients
  - Create factory methods for parsing ingredient strings
  - Focus on fluent interfaces
- [**Lab 4: Changeability**](/labs/lab4-changeability)
  - Analyze coupling/cohesion in provided code samples

### **Week 5: Exam Week & Introduction to AI Tools**
- [**Assignment 5: JSON Serialization Layer**](/assignments/cyb5-json-serialization) (Due Week 6, Thursday)
  - Build on A4 solution (provided)
  - Implement custom Jackson serializers/deserializers
  - Handle polymorphic serialization
  - First assignment where AI assistants are allowed/encouraged
- [**Lab 5: Object Creation Patterns**](/labs/lab5-patterns)
  - Practice with various creation patterns

## **Module 2: Development Practices and User-Centered Design**

### **Week 6: Testing and Mocking**
- [**Assignment 6: Comprehensive Testing Suite**](/assignments/cyb6-testing) (Due Week 7, Thursday)
  - Build on A5 solution (provided)
  - Write unit tests with JUnit
  - Mock external dependencies (file system, OCR services)
  - Achieve 80%+ code coverage
  - AI assistants encouraged for test generation
- [**Lab 6: AI Coding Agents**](/labs/lab6-copilot)
  - Learn to effectively prompt AI for code generation

### **Week 7: Domain Modeling & Requirements**
- [**Assignment 7: Cookbook and Library Model**](/assignments/cyb7-cookbook-library) (Due Week 8, Thursday)
  - Build on A6 solution (provided)
  - Implement `Cookbook`, `UserLibrary`, `TableOfContents`
  - Implement recipe scaling
  - Parse and interpret requirements documents
  - Design for extensibility
- [**Lab 7: Requirements Interpretation**](/labs/lab7-requirements)
  - Practice translating user stories to technical specs

### **Week 8: Architecture and MVC**
- [**Assignment 8: Service Layer Architecture**](/assignments/cyb8-service-architecture) (Due Week 10, Thursday - after break)
  - Build on A7 solution (provided)
  - Implement service interfaces: `ImportService`, `ExportService`, `LibraryService`
  - Apply MVC pattern
  - Design service contracts
  - **Team Formation**: Find your group of 4
- [**Lab 8: Dependencies**](/labs/lab8-dependencies)
  - Dependency injection exercise

### **Week 9: Spring Break**
- No assignments

### **Week 10: Usability and User-Centered Design**
- [**Assignment 9: CLI Interface**](/assignments/cyb9-cli-interface) (Due Week 11, Thursday)
  - Build on A8 solution (provided)
  - Implement interactive CLI with autocomplete, supporting recipe export and import
  - Focus on usability and user feedback
  - Error handling and recovery
- [**Lab 10: Architecture**](/labs/lab10-architecture)
  - Design architecture diagrams for recipe system

### **Week 11: GUI Development**
- [**Assignment 10: Basic JavaFX GUI**](/assignments/cyb10-javafx-gui) (Due Week 12, Thursday)
  - Build on A9 solution (provided)
  - Create main window with tabs
  - Implement recipe list view
  - Basic navigation
- [**Lab 11: Heuristic Evaluation**](/labs/lab11-heuristic-eval)
  - Conduct heuristic evaluation on a strawman GUI for CookYourBooks

## **Module 3: Design in the Large (Group Work Begins)**

### **Week 12: GUI Patterns and Concurrency**
- [**Group Assignment 1: Advanced GUI Features**](/assignments/cyb11-gui-advanced) (Due Week 13, Thursday)
  - Build on A10 solution (provided)
  - Implement async image loading
  - Add recipe editing dialogs
  - Implement drag-and-drop for images
  - Handle long-running operations (OCR) with progress indicators
- [**Lab 12: GUI Programming**](/labs/lab12-gui)
  - JavaFX workshop

### **Week 13: Distributed Systems and Events**   
- [**Group Assignment 2: OCR Service Integration**](/assignments/cyb12-ocr-integration) (Due Week 14, Thursday)
  - Integrate multiple OCR backends (Tesseract, Claude API)
  - Implement strategy pattern for OCR parsing
  - Add event-driven updates to the GUI
  - Performance optimization for batch processing
- [**Lab 13: Asynchronous Programming**](/labs/lab13-async)
  - Practice with CompletableFutures

### **Week 14: Safety, Reliability, and Polish**
- [**Group Assignment 3: Final Integration and Polish**](/assignments/cyb13-final-integration) (Due Week 15, Thursday)
  - Complete integration of all components
  - Report on the safety and reliability requirements for the next iteration of CookYourBooks
  - Conduct performance profiling and optimization
- [**Lab 14: Networks and Distributed Systems**](/labs/lab14-networks)
  - Implement simple client-server recipe sharing

### **Week 15: Final Report**
- [**Final Project Report**](/assignments/cyb14-final-report) 
  - Reflect on the project as a whole
  - Discuss challenges and solutions
  - Provide recommendations for future iterations of CookYourBooks
- [**Lab 15: Serverless Architecture**](/labs/lab15-serverless)
  - Deploy recipe API to cloud platform