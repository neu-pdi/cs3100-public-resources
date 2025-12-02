---
sidebar_position: 21
lecture_number: 21
title: GUIs in Java
---

## Describe the historical context of GUI development in Java (10 minutes)

Java has been through three major GUI toolkits, each representing different eras of thinking about how to build graphical interfaces:

### AWT: The Platform-Native Approach (1995)

The **Abstract Window Toolkit (AWT)** was Java's original GUI toolkit, released with Java 1.0. AWT took a "lowest common denominator" approach: it provided Java wrappers around each platform's native GUI components. When you created an AWT `Button`, Java asked Windows/Mac/Linux to create a native button.

```java
// AWT example - uses native platform widgets
Button button = new Button("Click me");
button.addActionListener(e -> System.out.println("Clicked!"));
```

This approach had a critical problem: **platform inconsistency**. A button might be 80 pixels wide on Windows but 95 pixels on Mac. Layouts that looked perfect on one platform broke on another. And AWT could only offer features that existed on *all* platforms—the intersection of capabilities rather than the union.

### Swing: The Pure-Java Approach (1997)

**Swing** solved AWT's consistency problems by abandoning native widgets entirely. Instead of asking the operating system to draw a button, Swing drew its own buttons using Java 2D graphics. Every Swing application looked identical across platforms (for better or worse).

```java
// Swing example - draws its own widgets
JButton button = new JButton("Click me");
button.addActionListener(e -> System.out.println("Clicked!"));
```

Swing dominated Java GUI development for over a decade. It's still widely used in legacy applications, IDE plugins, and tools where platform-native appearance isn't critical. However, Swing showed its age: it predated modern UI concepts like CSS styling, hardware-accelerated graphics, and declarative UI definitions.

### JavaFX: The Modern Approach (2008/2014)

**JavaFX** represents somewhat more modern GUI thinking. Key innovations include:

- **Scene Graph Architecture**: UIs are trees of nodes that can be transformed, animated, and styled. This matches how modern graphics hardware thinks about rendering.
- **Declarative UI with FXML**: Separate UI structure (FXML/XML) from behavior (Java), similar to how web development separates HTML from JavaScript.
- **CSS Styling**: Style your entire application with CSS, just like web pages (for better or worse).
- **Property Binding**: Automatically synchronize UI elements with data—when your model changes, the UI updates automatically.

```java
// JavaFX example - modern scene graph approach
Button button = new Button("Click me");
button.setOnAction(e -> System.out.println("Clicked!"));
```

JavaFX was initially bundled with the JDK, then unbundled in Java 11 (2018) into a separate project called [OpenJFX](https://openjfx.io/). While Oracle has reduced its investment in JavaFX, the community continues active development. For learning GUI concepts, JavaFX remains an acceptable choice because its architecture reflects patterns used across modern platforms (React, SwiftUI, Flutter all use similar concepts).

Understanding this evolution helps you:
1. Read legacy code: You'll encounter Swing in many existing applications
2. Recognize patterns: Scene graphs and declarative UI appear everywhere in modern development

## Review event-driven programming and the callback model (10 minutes)

GUI programming requires a fundamentally different mental model than the sequential code you've written so far. In sequential programming, *your code* controls execution flow:

```java
// Sequential: your code is in control
System.out.println("Enter your name:");
String name = scanner.nextLine();  // Program waits here
System.out.println("Hello, " + name);
```

In GUI programming, the *framework* controls execution. Your code responds to events—user clicks, key presses, timers firing—whenever they happen to occur:

```java
// Event-driven: framework is in control, your code responds
button.setOnAction(event -> {
    // This runs sometime later, when the user clicks
    System.out.println("Button was clicked!");
});
// Code continues immediately - doesn't wait for click
```

This **inversion of control** is the defining characteristic of event-driven programming. You register *callbacks* (also called *handlers* or *listeners*)—functions that the framework will call when specific events occur. Then you yield control to the framework's *event loop*, which waits for events and dispatches them to your callbacks.

### The Event Loop

Every GUI framework has an event loop at its core:

```
while (application is running) {
    event = waitForNextEvent()      // Block until something happens
    handler = findHandlerFor(event)  // Look up registered callback
    handler.handle(event)            // Call your code
}
```

In JavaFX, this loop runs on a dedicated thread called the **JavaFX Application Thread**. All UI updates must happen on this thread—if you try to modify the UI from another thread, you'll get exceptions or undefined behavior.

### Callback Styles in JavaFX

JavaFX supports several ways to register callbacks:

**Lambda expressions** (most common for simple handlers):
```java
button.setOnAction(event -> handleButtonClick());
```

**Method references** (when you have an existing method):
```java
button.setOnAction(this::handleButtonClick);
```

**Anonymous classes** (if you need to provide a handler with more than one method):
```java
button.setOnMouseClicked(new EventHandler<MouseEvent>() {
    @Override
    public void handle(MouseEvent event) {
        if (event.getClickCount() == 2) {
            handleDoubleClick();
        }
    }
});
```

You've already used callbacks earlier this semester—in Java streams (`list.forEach(item -> ...)`), in comparators (`list.sort((a, b) -> ...)`), and potentially in testing frameworks. GUI callbacks follow the same pattern, just with different event types.

## Define the Model-View-Controller (MVC) pattern (15 minutes)

As GUIs grew more complex, developers discovered that mixing UI code with business logic created unmaintainable tangles. Click handlers that directly modified databases. Display code scattered with business rules. Changes to the UI broke core functionality; changes to business logic broke the display. In the language of [Lecture 7](./l7-design-for-change.md), this code had *low cohesion* (mixing unrelated responsibilities) and *high coupling* (UI and business logic depending on each other's implementation details).

The **Model-View-Controller (MVC)** pattern, originating at Xerox PARC in the 1970s, provides a principled separation:

```
┌─────────────────────────────────────────────────────────────┐
│                        USER                                 │
│                          │                                  │
│                    sees  │  interacts                       │
│                          ▼                                  │
│  ┌────────────┐    ┌─────────────┐    ┌──────────────┐     │
│  │   MODEL    │◄───│    VIEW     │◄───│  CONTROLLER  │     │
│  │            │    │             │    │              │     │
│  │ - data     │    │ - display   │    │ - handles    │     │
│  │ - business │───►│ - widgets   │    │   user input │     │
│  │   logic    │    │ - layout    │───►│ - updates    │     │
│  │ - state    │    │             │    │   model      │     │
│  └────────────┘    └─────────────┘    └──────────────┘     │
│        │                 ▲                    │             │
│        │    notifies     │      updates       │             │
│        └─────────────────┘◄───────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### The Three Components

**Model**: The application's data and business logic. The Model knows nothing about how it will be displayed—it could be shown in a GUI, a command-line interface, or a web API. For SceneItAll, the Model includes:
- The list of smart home devices and their states
- Scene definitions (which devices, what settings)
- Business rules (e.g., "Away Mode" turns off all lights and locks all doors)

**View**: The visual representation of the Model. The View displays data and provides widgets for user interaction, but contains no business logic. For SceneItAll, the View includes:
- Device cards showing on/off status and brightness sliders
- Scene buttons with icons and labels
- The layout and styling of all visual elements

**Controller**: The intermediary that handles user input and coordinates between Model and View. When the user clicks a button, the Controller decides what to do—typically updating the Model, which then notifies the View to refresh. For SceneItAll, the Controller:
- Responds to "Activate Scene" button clicks
- Validates user input (e.g., brightness must be 0-100)
- Coordinates multi-step operations

### Why MVC Matters

This separation provides the same benefits we discussed in [Lecture 6](./l6-immutability-abstraction.md) and [Lecture 7](./l7-design-for-change.md) when we covered modularity, coupling, and cohesion:

**Low coupling**: The Model has no knowledge of the View—it could be displayed in a GUI, CLI, or web API. This is *data coupling* at most (passing primitives or simple types), avoiding the *stamp coupling* that would occur if the Model depended on UI widget types.

**High cohesion**: Each component has a single responsibility. The Model exhibits *functional cohesion* (all code related to business logic), the View exhibits *communication cohesion* (all code operating on the same visual representation), and the Controller exhibits *sequential cohesion* (coordinating the flow from user input to model update to view refresh).

**Testability**: As we discussed in [Lecture 16](./l16-testing2.md), separating infrastructure from domain code is the key to testability. The Model *is* your domain code—pure business logic with no UI dependencies. You can test it with simple unit tests: create a Model, call `activateAwayMode()`, and verify device states. No GUI required. The View and Controller are infrastructure that we'll test with E2E tests in the next lecture.

### MVC in JavaFX

JavaFX naturally supports MVC through its architecture:

- **Model**: Plain Java classes (POJOs) or classes using JavaFX properties for data binding
- **View**: FXML files defining UI structure + CSS for styling
- **Controller**: Java classes referenced in FXML via `fx:controller`

```xml
<!-- View: scene-panel.fxml -->
<VBox fx:controller="sceneitall.ScenePanelController">
    <Button fx:id="activateButton" text="Activate Scene" 
            onAction="#handleActivate"/>
</VBox>
```

```java
// Controller: ScenePanelController.java
public class ScenePanelController {
    @FXML private Button activateButton;
    
    private SceneModel model;  // Reference to Model
    
    @FXML
    private void handleActivate(ActionEvent event) {
        model.activateCurrentScene();  // Delegate to Model
    }
}
```

```java
// Model: SceneModel.java
public class SceneModel {
    private List<SmartDevice> devices;
    private Scene currentScene;
    
    public void activateCurrentScene() {
        for (DeviceSetting setting : currentScene.getSettings()) {
            setting.apply();  // Pure business logic, no UI
        }
    }
}
```

In the next lecture, we'll examine the Model-View-ViewModel (MVVM) pattern, which evolved from MVC to better support data binding and improve testability further.

## Create a simple GUI application using JavaFX and Scene Builder (20 minutes)

Let's build a simplified SceneItAll device control panel. We'll create the View using Scene Builder, implement a Controller, and connect it to a Model.

### Setting Up Scene Builder

[Scene Builder](https://gluonhq.com/products/scene-builder/) is a visual design tool for creating FXML files. You drag and drop components, set properties, and Scene Builder generates the XML. This is similar to Interface Builder (iOS), Android Studio's Layout Editor, or web-based UI builders.

Download Scene Builder from Gluon and configure your IDE to open `.fxml` files with it.

### Building the View

Create a new FXML file `device-panel.fxml`. In Scene Builder:

1. **Add a container**: Drag a `VBox` as the root element
2. **Add a label**: Drag a `Label` to show the device name
3. **Add controls**: Drag a `ToggleButton` for on/off and a `Slider` for brightness
4. **Set fx:id values**: Select each control and set its `fx:id` in the Code section (right panel)

The generated FXML might look like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>

<VBox spacing="10" xmlns:fx="http://javafx.com/fxml" 
      fx:controller="sceneitall.DevicePanelController">
    
    <Label fx:id="deviceNameLabel" text="Living Room Light"/>
    
    <ToggleButton fx:id="powerToggle" text="Off"
                  onAction="#handlePowerToggle"/>
    
    <Slider fx:id="brightnessSlider" min="0" max="100" value="50"/>
    
    <Label fx:id="brightnessLabel" text="50%"/>
</VBox>
```

### Adding Accessibility Labels

This is critical: every interactive widget needs an **accessible label** that assistive technologies can announce. In L20, we discussed how screen readers need semantic information. Here's how to provide it:

```xml
<ToggleButton fx:id="powerToggle" text="Off"
              accessibleText="Power toggle for Living Room Light"
              accessibleHelp="Press to turn the light on or off"
              onAction="#handlePowerToggle"/>

<Slider fx:id="brightnessSlider" min="0" max="100" value="50"
        accessibleText="Brightness for Living Room Light"
        accessibleHelp="Adjust brightness from 0 to 100 percent"/>
```

The `accessibleText` property provides the label announced by screen readers. The `accessibleHelp` property provides additional context. These accessibility labels serve double duty:

1. **Accessibility**: Screen reader users hear "Power toggle for Living Room Light, button, off" instead of just "Off, button"
2. **Testing**: As we'll see in L22, accessibility locators make tests more robust than CSS selectors or position-based queries

### Implementing the Controller

```java
package sceneitall;

import javafx.fxml.FXML;
import javafx.scene.control.*;

public class DevicePanelController {
    
    @FXML private Label deviceNameLabel;
    @FXML private ToggleButton powerToggle;
    @FXML private Slider brightnessSlider;
    @FXML private Label brightnessLabel;
    
    private SmartLight model;  // Our Model
    
    public void setModel(SmartLight model) {
        this.model = model;
        
        // Initialize View from Model
        deviceNameLabel.setText(model.getName());
        powerToggle.setSelected(model.isOn());
        updatePowerToggleText();
        brightnessSlider.setValue(model.getBrightness());
        updateBrightnessLabel();
        
        // Update accessible text with device name
        powerToggle.setAccessibleText("Power toggle for " + model.getName());
        brightnessSlider.setAccessibleText("Brightness for " + model.getName());
    }
    
    @FXML
    private void handlePowerToggle() {
        // Controller updates Model
        model.setOn(powerToggle.isSelected());
        updatePowerToggleText();
    }
    
    @FXML
    private void initialize() {
        // Called automatically after FXML loads
        // Set up listener for slider changes
        brightnessSlider.valueProperty().addListener((obs, oldVal, newVal) -> {
            if (model != null) {
                model.setBrightness(newVal.intValue());
            }
            updateBrightnessLabel();
        });
    }
    
    private void updatePowerToggleText() {
        powerToggle.setText(powerToggle.isSelected() ? "On" : "Off");
    }
    
    private void updateBrightnessLabel() {
        brightnessLabel.setText((int) brightnessSlider.getValue() + "%");
    }
}
```

### The Model

```java
package sceneitall;

public class SmartLight {
    private String name;
    private boolean on;
    private int brightness;
    
    public SmartLight(String name) {
        this.name = name;
        this.on = false;
        this.brightness = 100;
    }
    
    // Pure business logic - no UI dependencies
    public void turnOn() {
        this.on = true;
    }
    
    public void turnOff() {
        this.on = false;
    }
    
    public void setBrightness(int brightness) {
        if (brightness < 0 || brightness > 100) {
            throw new IllegalArgumentException("Brightness must be 0-100");
        }
        this.brightness = brightness;
    }
    
    // Getters
    public String getName() { return name; }
    public boolean isOn() { return on; }
    public int getBrightness() { return brightness; }
    public void setOn(boolean on) { this.on = on; }
}
```

### Launching the Application

```java
package sceneitall;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class SceneItAllApp extends Application {
    
    @Override
    public void start(Stage primaryStage) throws Exception {
        FXMLLoader loader = new FXMLLoader(
            getClass().getResource("/device-panel.fxml"));
        
        Scene scene = new Scene(loader.load(), 300, 200);
        
        // Get controller and inject model
        DevicePanelController controller = loader.getController();
        controller.setModel(new SmartLight("Living Room Light"));
        
        primaryStage.setTitle("SceneItAll");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}
```

### Key Takeaways

1. **Separation of concerns**: FXML defines structure, Controller handles events, Model contains logic
2. **Accessibility from the start**: Every widget gets meaningful `accessibleText`
3. **MVC in action**: The Controller mediates between View (FXML/widgets) and Model (SmartLight)
4. **Testability preview**: Because our Model is a plain Java class with no UI dependencies, we can unit test it easily. In the next lecture, we'll see how to E2E test the full UI using TestFX—and those accessibility labels we added will make our tests more robust.