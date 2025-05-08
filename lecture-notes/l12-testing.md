---
sidebar_position: 12
lecture_number: 12
title: Testing I
---

## Introduction

Testing is a critical part of software development. In this lecture, we explore two key aspects of testing:

* **Unit Testing with Mock Objects**: Isolating individual components using *mock objects* (with a focus on Java's JUnit and Mockito libraries).
* **Integration Testing**: Understanding when to test interactions between components instead of testing components in isolation.

By the end of this lecture, you will understand how to use mocks in JUnit tests, the trade-offs involved in mocking, and how to decide when an integration test is more appropriate than a unit test.

## A Brief Note on Test-Driven Development (TDD)

Before diving into the mechanics of writing tests with tools like JUnit and Mockito, it's helpful to understand a popular methodology that guides *when* and *how* tests are written: **Test-Driven Development (TDD)**.

TDD is a software development practice where you write an automated test *before* you write the production code that satisfies that test. This is in contrast to traditional methods where code is written first and tests are added later (if at all).

The core of TDD is a short, repetitive cycle known as **Red-Green-Refactor**:

1. **Red**: Write a test for a small, specific piece of desired functionality. Since the functionality doesn't exist yet, this test should run and **fail** (hence, "Red").
2. **Green**: Write the *minimum amount of production code* necessary to make the failing test pass. The focus here is on getting to a passing state quickly, not necessarily writing the most elegant code yet.
3. **Refactor**: With the safety of a passing test, improve the design of the production code (and potentially the test code itself). This could involve removing duplication, improving clarity, or optimizing performance, all while ensuring all tests continue to pass.

This cycle is repeated for each new bit of functionality, gradually building up the software. Many of the unit tests you'll see, like those for `UserService` in the upcoming examples, could be developed using this TDD approach.

**Key Benefits of TDD include:**

* **Improved Code Design**: Writing tests first forces you to think about how a unit of code will be used and what its interface should look like.
* **Comprehensive Regression Suite**: TDD naturally produces a thorough set of automated tests that can catch regressions if future changes break existing functionality.
* **Living Documentation**: The tests themselves act as executable documentation, demonstrating how different parts of the system are intended to work.
* **Increased Confidence**: Developers can refactor and add new features with more confidence, knowing that the test suite will alert them to problems.
* **Reduced Debugging Time**: Issues are often caught very early in the development process.

While TDD requires discipline, many teams find that it leads to higher-quality software that is easier to maintain and evolve. The unit testing techniques discussed in this lecture are fundamental tools for practicing TDD effectively.

## Utilize mocks to write unit tests for a class that depends on other classes (15 minutes)

Unit tests verify the behavior of a small "unit" of code (often a single class or method) in isolation. To isolate a unit of code (the *class under test*), we often replace its *collaborators* or *dependencies* (other classes or services it relies on to do its job) with *mock objects*. A mock object is a fake implementation of a class or interface that allows us to simulate specific behavior and verify interactions. It is one type of *test double* (a generic term for any stand-in used in place of a real component during testing). Mocks are a specific kind of test double that not only provide canned responses (like stubs) but can also verify that certain interactions occurred. By using mocks, we can test a unit without relying on external systems or complex setups.

For example, consider a `UserService` class that depends on a `UserRepository` (for database operations) and an `EmailService` (for sending notifications). In a unit test for `UserService`, we can use mock versions of `UserRepository` and `EmailService` so that:

* The test can simulate various scenarios (e.g., "user already exists" or "email service fails") by controlling the mock behavior.
* We can verify that `UserService` calls the repository and email service correctly (for example, ensuring an email is sent when a new user registers), without actually hitting a database or sending an email as that would test other units of code.

### Setting up Mockito in JUnit 5

We use the Mockito library to create and manage mock objects easily. JUnit 5 provides integration with Mockito through an extension. To set this up:

* Annotate the test class with `@ExtendWith(MockitoExtension.class)` to enable Mockito support in JUnit 5. This tells JUnit 5 to activate Mockito's capabilities, such as processing annotations like `@Mock` and `@InjectMocks` to create and inject mock objects.
* Use `@Mock` to create mock instances of classes (or interfaces) that our class under test depends on.
* Use `@InjectMocks` on the class under test to automatically inject the annotated mocks into it.

Below is an example test class for the `UserService` scenario:

```java
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;

// Simple definitions for demonstration purposes
class UserRepository { 
    User findByEmail(String email) { /* In a real app, this would query a database */ return null; }
    boolean save(User user) { /* In a real app, this would save to a database */ return true; }
}
class EmailService {
    void sendWelcomeEmail(User user) { /* In a real app, this would send an actual email */ }
}
class User {
    String email;
    User(String email) { this.email = email; }
    String getEmail() { return email; }
}
class UserService {
    private UserRepository repo;
    private EmailService emailService;
    // Constructor injection for dependencies
    UserService(UserRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }
    boolean registerUser(User user) {
        if (repo.findByEmail(user.getEmail()) != null) {
            return false; // user already exists
        }
        // Save user and send welcome email
        boolean saved = repo.save(user);
        if (saved) {
            emailService.sendWelcomeEmail(user);
        }
        return saved;
    }
}

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository repo;               // mock dependency
    @Mock
    EmailService emailService;         // mock dependency

    @InjectMocks
    UserService userService;           // class under test, with mocks injected

    @Test
    void testRegisterUser_NewUser() {
        // Arrange: set up test data and mock behavior
        User newUser = new User("alice@example.com");
        when(repo.findByEmail("alice@example.com")).thenReturn(null);  // user doesn't exist
        when(repo.save(newUser)).thenReturn(true);                     // simulate successful save

        // Act: call the method under test
        boolean result = userService.registerUser(newUser);

        // Assert: verify outcomes and interactions
        assertTrue(result, "New user should be registered successfully");
        verify(repo, times(1)).findByEmail("alice@example.com");
        verify(repo, times(1)).save(newUser);
        verify(emailService, times(1)).sendWelcomeEmail(newUser);
    }

    @Test
    void testRegisterUser_UserAlreadyExists() {
        User existingUser = new User("bob@example.com");
        // Simulate that the user is already in the repository
        when(repo.findByEmail("bob@example.com")).thenReturn(existingUser);

        boolean result = userService.registerUser(new User("bob@example.com"));

        // Assert: the user should not be saved again or emailed
        assertFalse(result, "Registration should fail for an existing user");
        verify(repo, never()).save(any(User.class));
        verify(emailService, never()).sendWelcomeEmail(any(User.class));
    }
}
```

In the code above:

* We set up `UserServiceTest` with Mockito's extension and define `repo` and `emailService` as mocks.
* The `userService` under test is automatically constructed with those mocks.
* In `testRegisterUser_NewUser`, we **stub** the behavior of `repo.findByEmail` and `repo.save` using `when(...).thenReturn(...)` to simulate conditions for a new user. Then, after calling `registerUser`, we use `verify(...)` to ensure that the repository and email service methods were called exactly once as expected.
* In `testRegisterUser_UserAlreadyExists`, we stub `repo.findByEmail` to return an existing user, then call `registerUser`. We check that `save` and `sendWelcomeEmail` are never called when the user already exists.

Using `@InjectMocks` saves us from manually constructing `UserService` with its dependencies; Mockito handles the injection. The test focuses on how `UserService` behaves under different conditions, with the external interactions controlled by mocks.

### Stubbing and Verification with Mockito

Mockito provides a fluent API for configuring mocks and verifying interactions:

* **Stubbing methods**: Use `when(mock.method(args)).thenReturn(value)` for methods that return values. For void methods (like `emailService.sendWelcomeEmail`), you can use `doNothing().when(mock).voidMethod(args)` (though by default Mockito does nothing on void methods unless stubbed to throw; `doNothing()` is mostly used for explicitness or to override a previous stubbing that might throw an exception). You can also use `thenThrow` to simulate exceptions or `thenAnswer` for custom behavior. Stubbing allows the test to control the return values or effects of methods on the mocks, setting up the scenario for the unit under test.
* **Verifying interactions**: Use `verify(mock).method(args)` to check that a method was called with specific arguments. The `verify` call can be augmented with `times(n)` to check the number of invocations, or `never()` to ensure a method was not called at all. This is crucial for testing side effects and interactions in behavior-driven tests.

**Example of stubbing and verifying:**

```java
// Stubbing a method that returns a value
when(repo.findByEmail("charlie@example.com")).thenReturn(null);

// Exercise the unit under test
userService.registerUser(new User("charlie@example.com"));

// Verify that save was called once, and an email was sent
verify(repo, times(1)).save(any(User.class));
verify(emailService).sendWelcomeEmail(any(User.class));  // times(1) is the default for verify
```

In this snippet, `repo.findByEmail` is stubbed to return `null` (meaning no existing user found). After executing `registerUser`, we verify that `repo.save` and `emailService.sendWelcomeEmail` were invoked. We used `any(User.class)` as an *argument matcher* to verify the methods were called with a `User` object, without specifying the exact user. Mockito's argument matchers (like `any()`, `eq()`) are helpful when the specific object instance isn't important to the test or not easily available. (Note: If you use an argument matcher for one argument in a method call, you must use argument matchers for all arguments in that call, e.g., `verify(repo).someMethod(any(User.class), eq("someValue"))`.) However, to keep tests readable, use real values or simple matchers whenever possible.

**Partial mocks and spies (advanced):** Mockito allows *spying* on real objects using `@Spy` or the `spy()` method. A spy is a partial mock: you can stub some methods of a real object while others use the actual implementation. This can be useful for testing a complex class by mocking out just a part of its behavior. However, use spies sparingly—partial mocking can make tests more brittle and often indicates the code under test might be doing too much (violating single-responsibility, for instance). Prefer redesigning the code or using real objects over heavy use of spies.

## Describe the tradeoffs of using mocks in test suites (10 minutes)

Mock objects are powerful for isolating units and simulating scenarios, but they come with trade-offs:

* **Isolation vs. Realism**: Using mocks, you isolate the unit from real dependencies, leading to faster and more focused tests. But this isolation means you might not catch issues that would occur when the real components interact. For example, two classes might have a mismatch in how they handle data (say, one expects a non-null field that the other never sets). A unit test with mocks could pass (because the mock was told to provide the "perfect" data, e.g., a mock might be told to return a `User` object with a perfectly formatted, non-null email, while the real database might occasionally return a `User` with a missing or malformed email due to an old data import, which your code might not handle gracefully), whereas the real integration might fail.
* **Brittle tests**: If overused, mocks can make tests brittle. Tests might become tightly coupled to the implementation details of the code under test. For instance, if you verify that a certain method was called, a harmless refactoring (changing *how* the code is structured internally to achieve the same outcome) might cause the test to fail even though the outward behavior (the *what*) remains correct. In other words, tests could start failing not because the functionality is wrong, but because the way it's achieved changed.
* **False sense of security**: 100% passing unit tests (with everything mocked) doesn't guarantee the system works in reality. If the mocks don't accurately mimic the real interactions, the code could still fail when integrated. For example, you might mock a database repository to return a hardcoded value, but the real database could behave differently or throw an error your test never considered. It's important to remember that mocks remove the actual complexities of systems, so some bugs will only surface with real integration.
* **Maintenance overhead**: Every time the behavior of a dependency changes, you may need to update the test stubs and expectations. For instance, if `UserRepository.save()` changes to return an object instead of a boolean, many tests with stubs expecting a boolean will break. With many mocks, tests can require a lot of upkeep as the code evolves. Well-structured tests aim to minimize how often they need changes when production code changes (unless that change affects the external behavior or contract).

Given these trade-offs, it's important to use mocks judiciously. Mocks solve specific problems (like simulating failures or verifying side effects) but should not be the default for every test scenario. Often, using a simple fake or even the real class is easier and more robust if the dependency is not complex. For example, instead of mocking a repository for an in-memory data structure, you might just use a real instance of a repository class that uses a simple in-memory list for data. This is often called a *fake* implementation and can make the test more realistic while still avoiding external dependencies.

### Best Practices for Using Mocks

* **Do** use mock objects to isolate external dependencies (e.g., databases, web services, file I/O). This keeps unit tests fast and avoids unpredictable side effects from those external systems.
* **Do** keep each unit test focused on one logical behavior or scenario. Each test should verify one thing (a specific outcome or interaction of the unit under test) to make debugging easier and ensure clarity of what failed.
* **Don't** test internal implementation details that don't affect the unit's outward behavior. For example, avoid verifying that a private helper method was called or the exact sequence of internal calls, unless that sequence is part of the specification. For instance, if `userService.registerUser` internally calls a private helper `private boolean isValidEmail(String email)`, don't try to verify that `isValidEmail` was called. Instead, test `registerUser` with an invalid email and assert that registration fails. This ensures tests don't break due to harmless refactoring.
* **Do** prefer real instances or simple fake implementations when they suffice. If using the real class in a test is straightforward and doesn't involve external resources or complex setup, use it instead of a mock. Save mocks for cases where you need to control behavior (e.g., force errors) or observe interactions that a real object wouldn't easily let you see.
* **Don't** overspecify interactions by verifying every minor call. Only use `verify` for interactions that are part of the contract or important side effects of the unit. Verifying lots of internal calls (that aren't part of the public outcome) can make tests brittle and tied to the implementation.
* **Don't** mock value objects or data model classes. For example, do not mock a `User` object that is simply a data container. Use real instances of such classes in your tests. Mocking these classes hides their own (albeit simple) behavior, provides little benefit, and can make tests harder to understand. This ensures you're working with actual values and that if those classes have any simple logic (like getters/setters or validation), it's not bypassed.
* **Do** utilize Mockito's annotations to reduce boilerplate. Use `@InjectMocks` to automatically create the class under test with its dependencies, and use `@Captor` (Mockito's argument captor) if you need to capture and assert on arguments passed to mocks. These features make tests cleaner and more readable.
* **Do** stub method calls with clear intent. Ensure that the return values or exceptions you simulate with `when(...).thenReturn(...)` (or `thenThrow(...)`) match the scenario you're testing. For example, if you're testing a "save failure" path, have the stub return `false` or throw an exception to mimic a failure, and then verify that your code handled it correctly.
* **Do** assert results and verify side effects. After exercising the unit under test, use assertions to check the state or output it produces *and* use `verify` to check interactions with collaborators. For instance, assert that a method returned the expected value or that an object's state changed, and also verify that a dependent method (like sending an email or writing to a log) was invoked. This ensures the unit did what it was supposed to do and interacted with other components properly.

By following these practices, you can write unit tests that are robust, readable, and maintainable, making effective use of mock objects without falling into common pitfalls.

## Identify circumstances where integration tests are more appropriate than unit tests (10 minutes)

Unit tests (with or without mocks) validate individual components in isolation. **Integration tests**, on the other hand, validate the cooperation between multiple components or systems. Instead of isolating everything, an integration test might involve real implementations of modules (and sometimes external resources) working together as they would in a production scenario or a close approximation of it.

For example, after thoroughly unit-testing `UserService` with mocks, you might write an integration test that involves `UserService` running with a real database and a real email service (perhaps a test version that logs emails instead of actually sending them). This integration test would ensure that the pieces fit together: the `UserService` can actually talk to the database and the email component as expected. If there's a misconfiguration (like the database not saving correctly or the email service not being triggered due to an annotation or wiring issue), a unit test with mocks wouldn't catch it, but an integration test would.

### What is an Integration Test?

An integration test checks how different units work in combination:

* It often involves multiple classes or modules from the application working together (for instance, the real `UserService`, `UserRepository`, and `EmailService` all interacting as in a real registration flow).
* It might include external systems or resources, such as a database, file system, or network communication, depending on what the components under test need.
* It exercises the program in a more end-to-end way than a single unit test, though usually not as fully as a UI end-to-end test. For example, an integration test might call a repository method and verify it actually updated the database, without going through a web interface. While an integration test exercises a broader scope than a unit test, it's typically not as comprehensive as a full end-to-end (E2E) test which might simulate user interaction through a GUI and test the entire application stack from the UI to the database.

Integration tests are closer to real-world usage. They don't replace unit tests; instead, they complement them by catching issues at the boundaries between units. Integration testing often requires more setup: e.g., starting up a database or using an in-memory database, preparing test data, or configuring multiple components to talk to each other.

### Unit Tests vs. Integration Tests: Key Differences

* **Scope**: A unit test focuses on one component at a time (a specific function, method, or class), using test doubles (mocks, stubs, fakes) for its collaborators. An integration test covers a broader scope, combining two or more components to test their interaction. For example, a unit test might test `UserService.registerUser` logic in isolation, while an integration test might test the entire user registration process hitting the database and verifying an email was "sent" via the email service.
* **Dependencies**: Unit tests replace or simulate dependencies to isolate the behavior of the unit under test. Integration tests, by definition, use real dependencies or a production-like environment for those components. In a unit test, you might mock a database repository; in an integration test, you might use a real database (or a realistic in-memory database) with the real repository class.
* **Execution Speed**: Unit tests are typically very fast and run entirely in memory, allowing dozens or hundreds of unit tests to execute in seconds. Integration tests tend to be slower because they may involve I/O operations (database writes, network calls) or initialization of subsystems. This means integration tests are often fewer in number and might be run in a separate phase of development (for example, as part of a continuous integration (CI/CD) pipeline or a nightly build) rather than on every code change.
* **Complexity and Maintenance**: Writing integration tests can be more complex since you need to set up the environment and manage the interactions of multiple parts. They can also be harder to debug when they fail—since the failure could originate from any of the interacting components, their configurations, or the underlying environment. Unit tests, by contrast, are easier to write and usually pinpoint issues to a specific function or class, because everything else is mocked or simplified.
* **Feedback and Confidence**: Unit tests provide quick feedback to developers, catching issues early in the development process (often during coding). They are great for checking the correctness of logic and for regression testing small pieces of code. Integration tests provide confidence that the system works as a whole, catching issues that unit tests might miss (like mismatched assumptions between modules, or misconfigurations in how components are wired together). While they run slower, their value is in validating that the major pieces of the application can work together correctly.
* **System configuration and wiring**: Many frameworks (like Spring in Java) use configuration files or annotations to wire components together. Integration tests are useful to ensure that the configuration is correct and that, for instance, `UserService` is using the real `UserRepository` bean at runtime. Unit tests with manually injected mocks *cannot* catch these kinds of wiring or configuration errors. If someone changes a configuration or an interface, unit tests might still pass (because they use mocks that were manually set up), but an integration test will catch that the system as a whole is misconfigured.
* **Avoiding over-mocking**: If you find that to test something thoroughly at the unit level you would need to mock a large portion of the application, it's a sign that an integration test might be more suitable. For instance, testing a complex business transaction might involve multiple repository calls and external service calls. Rather than mocking every single one (which can be error-prone and difficult to manage), it might be easier to set up a test scenario with those components running together and verify the end result.

However, integration tests should not be used for everything. If something can be tested quickly and sufficiently with a unit test, it's often better to do so (for speed and ease of debugging). Integration tests come with overhead, so we use them primarily to cover the gaps that unit tests inherently have — namely, the interactions between units.

In practice, teams employ a **mix** of both types of tests:

* Write plenty of unit tests for core business logic, computations, and each component's internal behavior. These catch bugs early and make refactoring safer.
* Write a smaller number of integration tests for the important flows and interactions between components (for example, user registration end-to-end, data retrieval through all layers, third-party API integration).
* Use the results of integration tests to improve unit tests. If an integration test catches an issue, consider if a unit test could have caught it earlier. Sometimes this leads to adding a new unit test or improving an existing one.

This balanced approach aligns with the common "Test Pyramid" concept: a wide base of many unit tests, a middle layer of some integration tests, and a thin top of a few end-to-end tests (such as UI tests). (Visually, imagine a pyramid with a large base for Unit tests, a smaller middle section for Integration tests, and a tiny top for E2E tests: `/\\_\  <- E2E /-----\\ <- Integration /---------\\ <- Unit`). The idea is to get broad coverage and quick feedback through unit tests, while still having integration tests to verify that the system works when all pieces are put together.

### Best Practices: Unit vs. Integration Testing

* **Do** ensure a strong base of unit tests first. Unit tests should cover the majority of code paths and edge cases in individual components. They are faster and easier to debug, forming a safety net for small-scale regressions.
* **Do** use integration tests strategically for critical workflows and integration points. Focus on scenarios like database operations, service-to-service communication, or other subsystems working together, especially where a failure would be severe or not observable in a unit test.
* **Do** keep integration tests isolated and reproducible. Each integration test should set up its own data and environment and clean up afterward. For example, use a fresh database state for each test (or a test transaction that rolls back), so tests don't interfere with each other. This isolation makes your integration tests more reliable and easier to troubleshoot.
* **Don't** let integration tests slow down your development cycle too much. Because integration tests are slower, consider not running all of them on every local build. Mark integration tests (e.g., with a JUnit tag or separate Maven/Gradle task) so that you can run them separately from the fast unit tests. For instance, run unit tests on every commit, and run the full integration test suite in your Continuous Integration (CI) pipeline or at least before a release. This way you get quick feedback from unit tests and still catch issues with integration tests without constantly waiting on them.
* **Don't** use integration tests to re-test trivial logic already covered by unit tests. Avoid duplicating the same assertions in an integration test that you have in a unit test. For example, if you have thoroughly tested input validation logic with unit tests, you don't need an integration test solely for that. Save integration tests for things unit tests can't verify (like whether the layers connect correctly, or whether the system works with actual data and configurations).
* **Do** use realistic test data and configurations in integration tests. Populate test databases with sample data that resembles production (in terms of formats and variety), use configuration settings as they would be in production (with maybe only minor tweaks like using test URLs or credentials). This increases the chance of catching issues that only appear with real-world data or settings (for example, a different character encoding, or a field that is optional in real data but your unit tests always set it).
* **Do** limit the scope of an integration test to a specific set of components, if possible. It's often better to have several narrow integration tests (each focusing on one subsystem interaction) than one giant end-to-end test that touches everything. For example, you might have one integration test for "Service + Repository + Database", and another for "Service + External API", rather than one test that does "Controller + Service + Repository + Database + External API + ...". Smaller integration tests are easier to debug when they fail, because you can more quickly pinpoint which integration point is broken.
* **Don't** rely on actual third-party services or unstable external systems in your integration tests. If your code integrates with an external API, use a local mock server (e.g., WireMock) or a stub for that API in your integration test environment. This makes the tests deterministic (they produce the same result every time) and not reliant on external network connectivity, third-party service availability, or API rate limits, which can all cause tests to fail unpredictably (flaky tests). For example, if `EmailService` in an integration test would normally send a real email, in the test you might configure it to use a local SMTP capture server or a dummy implementation that records the email request for verification.
* **Do** include diagnostic information to aid debugging of integration failures. Because it can be harder to figure out why an integration test failed, write tests in a way that they provide insight. This might mean adding assertions throughout the test (to check that intermediate state is as expected) or logging key events (like the data retrieved from the database) when running in a test mode. That way, if a test fails, you get clues about where the failure occurred (e.g., "user was saved to DB but email count was 0, so maybe the email service didn't get called").
* **Do** continuously evaluate and refine your test suite. As the software grows, new integration points may emerge that warrant new tests. Likewise, if some integration tests become redundant (due to changing architecture or more fine-grained tests being added), refactor or remove them to keep the suite efficient. Aim for a good balance: enough integration testing to be confident in the system, but not so much that it slows development or creates excessive overlap with unit tests.

## Conclusion

In summary, **unit tests** (often with the help of mock objects) and **integration tests** are both essential tools in a developer's testing strategy. Unit tests allow us to verify the correctness of individual components quickly and in isolation, with mocks helping to simulate interactions and external conditions. Integration tests step back and exercise the system at a higher level, ensuring that components work together as expected in a realistic environment. A well-rounded test suite will include a strong base of unit tests for fast feedback and thorough coverage of logic, complemented by targeted integration tests for the critical paths and interactions. By understanding the purpose of each type of test and following best practices for mocking and integration, we can achieve high confidence in our software's reliability without sacrificing development speed. Ultimately, the goal is to catch bugs as early as possible with unit tests, and to not be caught off guard by issues that only appear when everything is put together – that's where integration tests have our back. Investing in a solid testing strategy empowers developers to build more robust and maintainable software with greater confidence.
