---
sidebar_position: 6
lecture_number: 6
title: Hiding and Immutability
---


[CMU CS 17-214 "Responsibility Assignment"](https://docs.google.com/presentation/d/1aAyLLVDZFvaXWzQWzFyWQpBR5U63WNaGY04UX8z0SdQ/edit#slide=id.g2fbdf60e2c4_0_782)
## From concepts to classes (10 minutes)

### Review UML class diagrams

### Review UML interaction diagrams


## Understand the importance of hiding and immutability in achieving modularity (10 minutes)

- Review the importance of method specifications in achieving modularity
- Errors in understanding and using abstractions are a major source of bugs and errors in programs
- The sooner these errors are detected, the better. Bugs that are caught early (e.g. as you are writing the code, and you or the compiler can catch them) are cheaper to fix than those that are caught later (e.g. at runtime, or worse, after the code has been deployed)
- Well-designed classes protect internal details from clients
    - Not just the details of the *implementation* of the class, but also the details of the *state* of the class
    - Hiding the implementation makes it easier to change the implementation without breaking clients. 
    - Hiding the state makes it easier to reason about the class (because the only way to change that state is within the class)
- Today we'll discuss two strategies for making abstractions easier to understand and use correctly:
  - Hide information (encapsulation)
  - Make data immutable where possible
- These are design principles that you can apply at any scale: today, we'll focus on the scale of individual classes. But, later in the semester, we'll apply these principles at the scale of large modules and systems.


## Explain tradeoffs in the accessibility of classes, methods and fields (15 minutes)

- [Minimize accessibility of classes and members](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev15)
- [In public classes, use accessor methods, not public fields](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev16)

## Explain why immutability should be preferred over mutability (15 minutes)

- [Minimize mutability](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev17)

- [Make defensive copies when needed](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch8.xhtml#lev49)

