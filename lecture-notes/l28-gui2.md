---
sidebar_position: 28
lecture_number: 28
title: GUI Patterns and Testing
---

## Define the Model-View-ViewModel (MVVM) pattern (15 minutes)

In the previous lecture, we introduced Model-View-Controller (MVC) as a way to separate concerns in GUI applications. MVC has served developers well for decades, but as applications grew more complex—and as testability became more critical—limitations emerged.

Consider our SceneItAll device panel. In the MVC implementation, the Controller does a lot of manual work:

```java
// MVC Controller: lots of manual synchronization
@FXML
private void handlePowerToggle() {
    model.setOn(powerToggle.isSelected());
    updatePowerToggleText();  // Manual View update
}

private void updatePowerToggleText() {
    powerToggle.setText(powerToggle.isSelected() ? "On" : "Off");  // More manual work
}
```

Every time the Model changes, we must remember to update the View. Every time the View changes, we must update the Model. This manual synchronization is tedious and error-prone. Worse, testing the Controller requires a running UI—the Controller has low *observability* and low *controllability* in the terms we introduced in [Lecture 16](./l16-testing2.md).

**Model-View-ViewModel (MVVM)** evolved from MVC to address these problems. MVVM was developed by Microsoft architects in 2005 for Windows Presentation Foundation (WPF), but the pattern has spread to virtually every modern UI framework.

### The Three Components

```
┌──────────────────────────────────────────────────────────────┐
│                          USER                                │
│                            │                                 │
│                      sees  │  interacts                      │
│                            ▼                                 │
│    ┌────────────┐    ┌───────────┐    ┌───────────────┐     │
│    │   MODEL    │◄───│ VIEWMODEL │◄══►│     VIEW      │     │
│    │            │    │           │    │               │     │
│    │ - data     │    │ - UI state│    │ - display     │     │
│    │ - business │───►│ - commands│    │ - widgets     │     │
│    │   logic    │    │ - binding │    │ - data binding│     │
│    │ - state    │    │   props   │    │   declarations│     │
│    └────────────┘    └───────────┘    └───────────────┘     │
│                            ▲                                 │
│                      ══════╩══════                           │
│                      TWO-WAY DATA BINDING                    │
└──────────────────────────────────────────────────────────────┘
```

**Model**: Same as in MVC—the application's data and business logic. Pure Java classes with no UI dependencies.

**View**: The visual representation, but now *declaratively bound* to the ViewModel. The View contains no logic—it simply declares "this label displays the `deviceName` property" and "this toggle is bound to the `isOn` property."

**ViewModel**: The crucial innovation. The ViewModel exposes *UI-friendly properties* that the View can bind to. It transforms Model data into exactly what the View needs and translates user actions into Model operations. Critically, **the ViewModel has no reference to the View**—it doesn't know or care how (or if) it's being displayed.

### The Power of Data Binding

The key insight of MVVM is **data binding**: a declarative mechanism that automatically synchronizes properties between the ViewModel and View.

```java
// MVVM ViewModel: exposes bindable properties
public class DevicePanelViewModel {
    private final StringProperty deviceName = new SimpleStringProperty();
    private final BooleanProperty on = new SimpleBooleanProperty();
    private final IntegerProperty brightness = new SimpleIntegerProperty();
    private final StringProperty powerButtonText = new SimpleStringProperty("Off");
    
    private SmartLight model;
    
    public void setModel(SmartLight model) {
        this.model = model;
        deviceName.set(model.getName());
        on.set(model.isOn());
        brightness.set(model.getBrightness());
        
        // Automatically update button text when 'on' changes
        on.addListener((obs, oldVal, newVal) -> {
            powerButtonText.set(newVal ? "On" : "Off");
            model.setOn(newVal);  // Sync to Model
        });
    }
    
    // Property accessors for binding
    public StringProperty deviceNameProperty() { return deviceName; }
    public BooleanProperty onProperty() { return on; }
    public IntegerProperty brightnessProperty() { return brightness; }
    public StringProperty powerButtonTextProperty() { return powerButtonText; }
}
```

```xml
<!-- MVVM View: declarative bindings, no logic -->
<VBox>
    <Label text="${viewModel.deviceName}"/>
    <ToggleButton text="${viewModel.powerButtonText}" 
                  selected="${viewModel.on}"/>
    <Slider value="${viewModel.brightness}"/>
</VBox>
```

When `on` changes (either from user interaction or programmatically), the binding system automatically:
1. Updates the ToggleButton's `selected` state
2. Triggers the listener that updates `powerButtonText`
3. Updates the ToggleButton's `text`
4. Syncs the change to the Model

No manual `updatePowerToggleText()` calls. No forgetting to synchronize. The framework handles it.

### JavaFX Properties

JavaFX provides a rich property system for implementing MVVM:

```java
// Simple properties
StringProperty name = new SimpleStringProperty("Initial value");
IntegerProperty count = new SimpleIntegerProperty(0);
BooleanProperty enabled = new SimpleBooleanProperty(true);

// Reading and writing
String currentName = name.get();
name.set("New value");

// Listening for changes
name.addListener((observable, oldValue, newValue) -> {
    System.out.println("Name changed from " + oldValue + " to " + newValue);
});

// Binding (one-way)
label.textProperty().bind(name);  // Label always shows current name

// Bidirectional binding
textField.textProperty().bindBidirectional(name);  // Changes flow both ways
```

## Compare and contrast MVC with MVVM patterns (10 minutes)

Both patterns separate concerns, but they do so differently. Understanding when to use each helps you make better architectural decisions.

### Structural Differences

| Aspect | MVC | MVVM |
|--------|-----|------|
| **View ↔ Logic coupling** | Controller references View directly | ViewModel has no View reference |
| **Synchronization** | Manual (Controller updates View) | Automatic (data binding) |
| **View's role** | Passive (waits for Controller) | Active (binds to ViewModel) |
| **State location** | Split between View and Model | Centralized in ViewModel |

### Testability

This is where MVVM shines—it dramatically improves *observability* (we can inspect ViewModel properties) and *controllability* (we can set properties directly without simulating clicks). Consider testing "when the power button is toggled, the button text changes to 'On'":

**MVC Testing** requires UI infrastructure:
```java
// Must create actual UI components
ToggleButton powerToggle = new ToggleButton();
DevicePanelController controller = new DevicePanelController();
// Somehow inject the toggle into the controller...
// Simulate click...
// Assert on the actual UI component...
```

**MVVM Testing** is pure Java:
```java
@Test
void togglePower_updatesButtonText() {
    // Arrange
    DevicePanelViewModel viewModel = new DevicePanelViewModel();
    viewModel.setModel(new SmartLight("Test Light"));
    
    // Act
    viewModel.onProperty().set(true);  // No UI needed!
    
    // Assert
    assertEquals("On", viewModel.powerButtonTextProperty().get());
}
```

The ViewModel test runs in milliseconds, requires no UI toolkit initialization, and verifies exactly the logic we care about. This is a dramatic improvement for unit testing.

### The Spectrum of Patterns

In practice, you'll see many variations:

- **MVP (Model-View-Presenter)**: Like MVC, but the Presenter handles all View logic. The View is completely passive.
- **MVI (Model-View-Intent)**: Popular in Android. User actions become "Intents" that transform the Model.
- **Flux/Redux**: Unidirectional data flow. Popular in React applications.

These all share the core insight from [Lecture 7](./l7-design-for-change.md): **separate what you display from how you compute what to display** to achieve high cohesion and low coupling. The differences are in how they manage state flow and synchronization. We will not cover these patterns in this course, but you may encounter them in your future career and think of how they relate to the principles covered in this course.

## Explain why separation of concerns makes GUIs testable units (10 minutes)

In [Lecture 16](./l16-testing2.md), we introduced the testing pyramid and two key properties for testable code: **observability** (can we see what happened?) and **controllability** (can we set up the test scenario?). We also covered **Hexagonal Architecture**, which separates domain logic from infrastructure through ports and adapters.

MVC and MVVM are the GUI-specific application of these same principles:

| L16 Concept | GUI Application |
|-------------|-----------------|
| Domain code (easy to test) | Model and ViewModel |
| Infrastructure code (needs test doubles) | View (widgets, rendering) |
| Ports (interfaces to external systems) | Callbacks, property bindings |
| Adapters (concrete implementations) | JavaFX controls, FXML loaders |

The Model in MVC/MVVM plays the same role as the "Application Core" in Hexagonal Architecture—it contains pure business logic with no dependencies on UI infrastructure. The ViewModel adds *observability* by exposing bindable properties we can inspect in tests without rendering any UI.

Consider the testability difference:

**Without separation** (low observability, low controllability):
```java
// Logic embedded in UI handler - must render UI to test
button.setOnAction(e -> {
    if (device.isOn()) {
        device.turnOff();
        button.setText("Off");
        showNotification("Device turned off");
    }
});
```

**With MVVM** (high observability, high controllability):
```java
// ViewModel: test by setting properties and checking results
@Test
void togglePower_updatesButtonText() {
    viewModel.onProperty().set(true);
    assertEquals("On", viewModel.powerButtonTextProperty().get());
}
```

The goal remains the same as in L16: push testing down the pyramid. Test business logic in the Model with unit tests. Test UI state transformations in the ViewModel with unit tests. Reserve E2E tests for verifying that the actual UI correctly binds to the ViewModel and handles user interactions.

## Write end-to-end tests for a GUI application using TestFX (20 minutes)

### When E2E Tests Are Worth the Cost

Despite pushing tests down the pyramid, E2E tests remain essential—but only for the right things. E2E tests are expensive: slow to run, prone to flakiness, and high-maintenance. Every E2E test you write is a commitment to maintain it as the UI evolves.

**Write E2E tests for:**
- **Critical user journeys**: The paths that, if broken, would make the application unusable. For SceneItAll: "User can turn a light on/off." Not: "User sees correct hover animation on button."
- **Integration boundaries**: Where multiple components come together in ways that unit tests can't verify. Does clicking the button actually update the model *and* refresh the view?

**Don't write E2E tests for:**
- **Business logic**: If you can test it in the Model or ViewModel, do that instead.
- **Every UI permutation**: Test the happy path and critical error cases. Edge cases belong in faster tests.


A healthy GUI test suite might have hundreds of Model/ViewModel unit tests, dozens of integration tests, and only 10-20 carefully chosen E2E tests covering critical journeys. Each E2E test can also be used to create a visual regression test suite that flags changes to the UI for human review.

### The Core Problem: Element Location

Every GUI E2E test has the same fundamental structure:
1. **Locate** a UI element
2. **Act** on it (click, type, drag)
3. **Assert** something about the result

Steps 2 and 3 are straightforward once you've solved step 1. The hard problem is *locating elements reliably*.

Consider how you might identify "the power toggle button" in code:

| Strategy | Example | Problem |
|----------|---------|---------|
| **By ID** | `#powerToggle` | Breaks if developer renames the fx:id |
| **By CSS class** | `.toggle-button` | Breaks if styling changes; may match multiple elements |
| **By position** | `lookup(".button").nth(2)` | Breaks if layout changes |
| **By visible text** | `"Off"` | Breaks when state changes; may match multiple elements |

All of these strategies are tied to *implementation details*. When a developer refactors the UI—renaming IDs, reorganizing layouts, changing CSS classes—tests break even though the functionality is unchanged. This "test brittleness" is the primary reason teams abandon E2E testing.

### The Solution: Accessibility Locators

There's one identifier that describes *what an element is* rather than *how it's implemented*: the **accessibility label**.

Remember those `accessibleText` attributes we added in L21? They exist so screen readers can announce elements to users who can't see the screen. But they also serve as **stable, semantic identifiers for testing**:

```xml
<ToggleButton fx:id="powerToggle" text="Off"
              accessibleText="Power toggle for Living Room Light"
              onAction="#handlePowerToggle"/>
```

The accessibility label describes the element's *purpose*, not its implementation. When you refactor the UI—changing IDs, CSS classes, or layout—the element is still "the power toggle for the living room light."

This creates a virtuous cycle:
1. You add accessibility labels to make your app accessible (L20)
2. Those same labels make your E2E tests robust
3. If a test can't find an element by its accessibility label, you've discovered an accessibility bug

### TestFX: The JavaFX E2E Testing Library

[TestFX](https://github.com/TestFX/TestFX) provides the infrastructure for GUI testing in JavaFX. It handles the hard parts—launching the application, running on the JavaFX thread, simulating input—so you can focus on the test logic.

Here's a basic test structure:

```java
import org.testfx.framework.junit5.ApplicationTest;
import static org.testfx.api.FxAssert.verifyThat;
import static org.testfx.matcher.control.LabeledMatchers.hasText;

public class DevicePanelE2ETest extends ApplicationTest {
    
    private SmartLight testLight;
    
    @Override
    public void start(Stage stage) throws Exception {
        // Set up the application before each test
        FXMLLoader loader = new FXMLLoader(
            getClass().getResource("/device-panel.fxml"));
        stage.setScene(new Scene(loader.load()));
        
        testLight = new SmartLight("Living Room Light");
        DevicePanelController controller = loader.getController();
        controller.setModel(testLight);
        
        stage.show();
    }
    
    // Helper method for accessibility-based location
    private Matcher<Node> hasAccessibleText(String text) {
        return node -> text.equals(node.getAccessibleText());
    }
    
    @Test
    void clickingPowerToggle_turnsLightOn() {
        // Locate by accessibility label - stable!
        clickOn(hasAccessibleText("Power toggle for Living Room Light"));
        
        // Assert - UI updated
        verifyThat(hasAccessibleText("Power toggle for Living Room Light"), 
                   hasText("On"));
        
        // Assert - Model updated (verifies integration)
        assertTrue(testLight.isOn());
    }
}
```

Key TestFX methods:
- `clickOn(matcher)`: Click on the first element matching the matcher
- `write(text)`: Type text into the focused element
- `drag(node).dropBy(x, y)`: Drag an element
- `verifyThat(matcher, condition)`: Assert a condition about an element
- `lookup(matcher).query()`: Find an element for further inspection

### Putting It Together: A Complete Test Suite

Here's a realistic E2E test class for SceneItAll's device panel:

```java
public class DevicePanelE2ETest extends ApplicationTest {
    
    private SmartLight testLight;
    
    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader loader = new FXMLLoader(
            getClass().getResource("/device-panel.fxml"));
        stage.setScene(new Scene(loader.load()));
        
        testLight = new SmartLight("Living Room Light");
        DevicePanelController controller = loader.getController();
        controller.setModel(testLight);
        
        stage.show();
    }
    
    private Matcher<Node> hasAccessibleText(String text) {
        return node -> text.equals(node.getAccessibleText());
    }
    
    // Critical journey: User can control a light
    @Test
    void userCanToggleLightOnAndOff() {
        // Initially off
        verifyThat(hasAccessibleText("Power toggle for Living Room Light"), 
                   hasText("Off"));
        assertFalse(testLight.isOn());
        
        // Turn on
        clickOn(hasAccessibleText("Power toggle for Living Room Light"));
        verifyThat(hasAccessibleText("Power toggle for Living Room Light"), 
                   hasText("On"));
        assertTrue(testLight.isOn());
        
        // Turn off
        clickOn(hasAccessibleText("Power toggle for Living Room Light"));
        verifyThat(hasAccessibleText("Power toggle for Living Room Light"), 
                   hasText("Off"));
        assertFalse(testLight.isOn());
    }
    
    // Critical journey: User can adjust brightness
    @Test
    void userCanAdjustBrightness() {
        Node slider = lookup(hasAccessibleText("Brightness for Living Room Light"))
                        .query();
        
        drag(slider).dropBy(50, 0);  // Drag right to increase
        
        // Verify model updated (exact value depends on slider width)
        assertTrue(testLight.getBrightness() > 50);
    }
    
    // Accessibility verification: Elements are properly labeled
    @Test
    void allControlsHaveAccessibleLabels() {
        // If these lookups succeed, the elements are accessible
        verifyThat(hasAccessibleText("Power toggle for Living Room Light"), 
                   isVisible());
        verifyThat(hasAccessibleText("Brightness for Living Room Light"), 
                   isVisible());
    }
}
```

Notice what's *not* tested here:
- The exact pixel position of elements
- CSS styling details
- Animation timing
- Internal method calls

These tests verify *user-visible behavior*. If a user can turn a light on and off, the test passes—regardless of how the UI is implemented internally.
