---
sidebar_position: 2
lecture_number: 2
title: Inheritance in Java
required_preparation: 
    - Complete sets 1 and 2 of the Java syntax flashcards
optional_preparation:
    - 'Read [Core Java Volume I: Fundamentals, Ch 3](https://learning.oreilly.com/library/view/core-java-volume/9780135328385/v1/ch3/index.xhtml#ch03lev1sec1)'
---

Background material:


## Pre-requisite: Reading Java Syntax (Students should be able to do this *before* the lecture, and we will provide flashcards to help)


Here is a complete example of a Java program:

```java title="HelloWorld.java"
package io.github.neu-pdi.cs3100.lecture2;

import io.github.neu-pdi.cs3100.utils.OtherClass;

/**
 * This is a simple program that prints "Hello, World" 10 times.
 */
public class HelloWorld {
    /**
     * This is the main method that is executed when the program is run.
     * @param args The command line arguments.
     */
    public static void main(String[] args) {
        OtherClass other = new OtherClass(10);
        for (int i = 0; i < 10; i++) {
            // Print a message to the console
            System.out.println("Hello, World #" + i);
        }
        other.doSomething();
    }
}
```

```java title="OtherClass.java"
package io.github.neu-pdp.cs3100.utils;

public class OtherClass {
    private int x;
    public OtherClass(int x) {
        this.x = x;
    }
    public void doSomething() {
        System.out.println("Doing something with x = " + x);
    }
    public int getX() {
        return x;
    }
}
```
Let's break down the syntax of this program, starting with HelloWorld.java.
### Package Declaration
- Code in Java is organized into packages. This is similar to how code in Python is organized into modules.
- It's best practice to use a package that is named after the organization that wrote the code.
- The convention for the package name is to use the reverse domain name of the organization.
    - For example, GitHub user `octocat` would use the package name `io.github.octocat`.
- You can, of course, choose whatever you want that satisfies the JVM's naming conventions.

### Import Declaration
- The `import` keyword is used to import classes from other packages.
- In this case, we are importing the `OtherClass` class from the `io.github.neu-pdp.cs3100.utils` package.
- Note that we are *not* importing the `String` class or the `System` class. These are both classes in the `java.lang` package, that are imported by default. 

### Comments
- Single line comments are denoted by `//`
- Multi-line comments are denoted by `/*` and `*/`
- Documentation comments are denoted by `/**` and `*/`, and are used to generate documentation for the code (more on this in an upcoming lecture)

### Class Declaration
- All code in Java must be contained within a class.
- This class is `public` which means it can be used by other classes.
   - If you don't specify the access modifier, it will default to `package-private` which means it can only be used by classes in the same package.
- This class extends `OtherClass` which means it will inherit all of the methods and fields of `OtherClass`.
- The *contents* of the class are contained within the `{` and `}` braces. This is not Python, where indentation matters.

### Method Declaration
- All code in Java must be contained within a method, which must be declared within a class.
- This method is `public` which means it can be used by other classes. It also could be `private` which means it can only be used by the class itself.
- This method is `static` which means it can be called on the class itself without creating an instance of the class.
- This method is `void` which means it does not return a value.
- This method is named `main` and takes as an argument an array of strings. This is the entry point of the program, as defined by the Java Virtual Machine (JVM). This means that when we run the command `java io.github.neu-pdp.cs3100.lecture2.HelloWorld`, the JVM will look for a `public static void main(String[] args)` method in the `HelloWorld` class and execute it.

### Method Body
- The contents of the method are contained within the `{` and `}` braces. This is not Python, where indentation matters.
- The method creates an instance of `OtherClass` and calls its `doSomething` method.
- The method contains a loop that will print "Hello, World" 10 times.
    - Note how we declare a variable `i` and initialize it to 0, and also how we format a for-loop in Java
    - Again: This is not Python, where indentation matters. `{}` are required to delimit the scope of the loop.
- Let's disect the line `System.out.println("Hello, World #" + i);`:
    - `System` refers to a class: `java.lang.System` (note that we didn't need to import this class since it is part of `java.lang` which is imported by default)
    - `out` is a *static field* of the `System` class. Because it's `static`, we can access it directly on the class without creating an instance of the class.
    - `System.out` is an instance of a class that Java provides called `PrintStream`, used for writing output to streams (more on streams in a few minutes).
    - The string `"Hello, World #"` is concatenated with the value of `i` and the `println` method is called with that string as an argument.
    - Lastly, the line ends with a semicolon, which is required in Java to denote the end of a statement. This is different than Python, where the end of a statement is denoted by a newline.

### OtherClass.java
- This class defines a private field `x` and a constructor that initializes it. Because it's `private`, it cannot be accessed directly from outside the class (it *can* be accessed from within the class, and because the class exposes the method `public int getX()`, we can access it from outside the class indirectly).
- It also defines a `public` method `doSomething` that prints a message to the console.

## Understand why inheritance is a core concept of object-oriented programming (10 minutes)

- A core principle of program design is: make your data mean something.
- We write software that manipulates data in some way, and oftentimes this data is related to some real-world concept.
- When it comes to designing our program, we can leverage our domain knowledge of that real world concept to design a program that is both easy to understand and easy to maintain.
- Inheritance is a core concept of object-oriented programming that allows us to model real-world "is-a" relationships between types.
- Duplicating code is a bad idea, because it makes our program harder to maintain. Inheritance allows us to *reuse* code across multiple classes that have the same behavior.

Here is an example inheritance hierarchy, in the domain of IoT (for brevity, we don't repeat inherited methods in each subtype).

The "base type" is `IoTDevice`. All other types inherit from it.
`IoTDevice` defines two methods, `identify` and `isAvailable`, that all devices must implement.
The `identify` method is intended to help a human identify the device by, e.g., flashing a light on it.
The `isAvailable` method is intended to check if the device is currently available to be used (e.g. if it is reachable over the network).
We declare this type as an `interface` because we don't need to provide a concrete implementation for these methods: different devices will have different ways of identifying themselves and checking availability.

Then we have a type for `Fan` (a class), and `Light` (an interface).
Fan and light both define the same set of methods, but are nonethless declared as different types (can students guess why? a simple answer is that anyone interacting with our program would probably want to be able to distinguish between a fan and a light).

`SwitchedLight` and `DimmableLight` are concrete types that implement the `Light` interface, and we can see that `DimmableLight` extends `Light` to support dimming.
`TunableWhiteLight` is a concrete type that extends `DimmableLight` to support not only dimming, but also adjusting the color temperature.


```mermaid
classDiagram
class IoTDevice {
    <<interface>>
    +identify()
    +isAvailable()
}
class Light {
    <<abstract>>
    +turnOn()
    +turnOff()
    +isOn()
}
class Fan {
    +identify()
    +isAvailable()
}
class SwitchedLight {
    +identify()
    +isAvailable()
    +turnOn()
    +turnOff()
    +isOn()
}

class DimmableLight {
    +identify()
    +isAvailable()
    +turnOn()
    +turnOff()
    +isOn()
    +setBrightness(brightness: int)
    +getBrightness()
}

class TunableWhiteLight {
    +identify()
    +isAvailable()
    +turnOn()
    +turnOff()
    +isOn()
    +setBrightness(brightness: int)
    +getBrightness()
    +setColorTemperature(colorTemperature: int)
    +getColorTemperature()
}
IoTDevice <|-- Light
Light <|-- SwitchedLight
Light <|-- DimmableLight
DimmableLight <|-- TunableWhiteLight
IoTDevice <|-- Fan
```

By structuring our program in this way, we can reuse code across multiple types that have the same behavior.

Every language has its own way of representing type hierarchies.
In Java, type hierarchies are represented using *classes* and *interfaces*.
Next, we'll look at classes, and then at interfaces.

## Define a type hierarchy and understand the relationship between superclasses and subclasses (10 minutes)
Background material:
- [Liskov & Gutag Ch 7](https://learning.oreilly.com/library/view/program-development-in/9780768685299/ch7.html)

- Classes:
    - Can extend exactly one superclass (which may itself extend another class)
    - Can implement multiple interfaces
    - Inherit fields and methods from its superclass, can also *override* methods
    - Can be concrete (provide an implementation for all methods) or abstract (declare methods that must be implemented by subclasses). More on abstract classes later.

Here is how a class is defined in Java:

```java title="TunableWhiteLight.java"
package io.github.neu-pdi.cs3100.iot.lights;

public class TunableWhiteLight extends DimmableLight {
    private int startupColorTemperature;
    public TunableWhiteLight(int startupColorTemperature) {
        this.startupColorTemperature = startupColorTemperature;
    }
    /**
     * Turn on the light.
     * Sets the color temperature to the startup color temperature.
     */
    @Override
    public void turnOn() {
        setColorTemperature(startupColorTemperature);
        // With the color temperature set, we can now turn on the light.
        super.turnOn();
    }
    /**
     * Set the color temperature of the light.
     * @param colorTemperature The color temperature to set the light to, in degrees Kelvin.
     */
    public void setColorTemperature(int colorTemperature) {
        // ...
    }
    /**
     * Get the color temperature of the light.
     * @return The color temperature of the light, in degrees Kelvin.
     */
    public int getColorTemperature() {
        // ...
    }

}
```

This code snippet declares our `TunableWhiteLight` class, which extends `DimmableLight`. Here are some key syntax points to note:
- We specify the superclass of `TunableWhiteLight` with the `extends` keyword.
- We declare a constructor that initializes the `startupColorTemperature` field.
- We declare some new methods (`setColorTemperature` and `getColorTemperature`), and override the `turnOn` method of `DimmableLight`.

- Each of these methods is `public`, which means they can be called by other classes.
- The other visibility modifiers are `private` and `protected`.
    - `private` means the method can only be called by other methods in the class.
    - `protected` means the method can be called by other methods in the class, and by subclasses.
- If you don't specify a visibility modifier, it defaults to `package-private`, which means the method can be called by other methods in the same package. This is generally regarded as a bad practice (and bad language feature) because it makes it hard to reason about the accessibility of methods, and we suggest you avoid it.

Some rules for overriding methods:
- We use the `@Override` annotation to indicate that we are overriding a method from the superclass. This is not strictly required by the JVM, but is helpful for readability. It also allows the compiler to catch some errors: if you put `@Override` on a method that doesn't actually override a superclass method, the compiler will generate an error.

Each type in the hierarchy must satisfy the [Liskov Substitution Principle](https://learning.oreilly.com/library/view/program-development-in/9780768685299/ch7.html#:~:text=Subtypes%20must%20satisfy%20the%20substitution%20principle%20):
- The method signatures (parameters, return type) must be the same as the method it overrides. This is enforced by the compiler.
- The behavior of the method must be the same as the method it overrides. This is not enforced by the compiler, but is a good design principle. 
    - There is an implicit specification that the method `turnOn` must turn on the light. If a subclass overrides this method and does not turn on the light, it is violating the Liskov Substitution Principle.
    - This is important because it allows us to *substitute* a superclass for a subclass in our program.
- Any properties that hold for the superclass must also hold for the subclass.
    - Example property: If the light is on, the method `isOn` must return true. If the light is off, the method `isOn` must return false.
- We'll return to this principle later when we discuss polymorphism and specification.

Java allows assignment of a subclass to a superclass reference:
```java
Light[] lights = new Light[2];
TunableWhiteLight light = new TunableWhiteLight(2700);
lights[0] = light;
TunableWhiteLight light2 = new TunableWhiteLight(2200);
lights[1] = light2;
for (Light l : lights) {
    l.turnOn();
}
```
In this code snippet, we declare an array of `Light` references, and assign a `TunableWhiteLight` to the first element.
This is allowed because a `TunableWhiteLight` is a `Light`, and thus a `Light` is a `TunableWhiteLight`.

We wrote this somewhat verbosely to make it clear that we are assigning a `TunableWhiteLight` to a `Light` reference, but we could have written this more concisely:
```java
Light[] lights = new Light[] {
    new TunableWhiteLight(2700),
    new TunableWhiteLight(2200)
};
for (Light l : lights) {
    l.turnOn();
}
```

To access the `TunableWhiteLight` methods, we need to cast the `Light` reference to a `TunableWhiteLight` reference:
```java
TunableWhiteLight light2 = (TunableWhiteLight) lights[1];
light2.setColorTemperature(2200);
```

This snippet could also be written more concisely:
```java
((TunableWhiteLight) lights[1]).setColorTemperature(2200);
```

## Explain the role of interfaces and abstract classes in a Java class hierarchy (10 minutes)

Sometimes we want to declare a set of behaviors that must be implemented by all subclasses, but we don't want to provide a concrete implementation for those behaviors. There are two ways to do this: interfaces and abstract classes.

### Interfaces
- Interfaces:
    - Define a set of methods that a class must implement.
    - Can extend one or more interfaces.
    - Can be implemented by multiple classes.
    - Can provide a default implementation for some methods (but the semantics are messy and we don't recommend it)
    - Cannot be instantiated directly.

Here is an example of an interface:
```java
public interface Light extends IoTDevice {
    /**
     * Turn on the light.
     */
    public void turnOn();
    /**
     * Turn off the light.
     */
    public void turnOff();
    /**
     * Check if the light is on.
     * @return true if the light is on, false otherwise.
     */
    public boolean isOn();
}
```

### Abstract classes
- Abstract classes:
    - Define a set of methods that a class must implement.
    - Can extend one or more classes.
    - Can provide a default implementation for some methods
    - Cannot be instantiated directly.

Here is an example of an abstract class:

**TODO: Add example**

## Understand the JVM's implementation of dynamic dispatch (10 minutes)

Recall that we can assign a subclass to a superclass reference:
```java
Light[] lights = new Light[] {
    new TunableWhiteLight(2700),
    new TunableWhiteLight(2200)
};
```

We said that this assignment is allowed because a `TunableWhiteLight` is a `Light`, and thus a `Light` is a `TunableWhiteLight`. But, how does the JVM know which method to call?

"Dynamic dispatch" is the process by which the JVM determines which method to call at runtime:
```java
for (Light l : lights) {
    l.turnOn(); // This will call the turnOn method of the actual type of l, which may be TunableWhiteLight or some other subclass.
}
```

Here is how the JVM implements dynamic dispatch to call method $m$ on object $o$ of type $T$:
1. If $T$ contains a declaration of $m$, use that.
2. If $T$ has a superclass $S$ that contains a declaration of $m$, use that. If not, continue recursively with $S$'s superclass.
3. If no other declaration is found, and $m$ is provided as a default interface method, use that.

This is called "dynamic dispatch" because the method to call is determined at runtime, rather than at compile time. Consider the following example:

```java
Light l = new TunableWhiteLight(2700);
l.turnOn(); // This will call the turnOn method of the actual type of l, which is TunableWhiteLight.
((DimmableLight) l).turnOn(); // Still calls turnOn method of TunableWhiteLight, because when it runs, that's the type of l.
```

Regardless of the type of the variable in our code, the actual type at runtime is used to determine which method to call.


## Understand the difference between static methods and instance methods (5 minutes)

Some methods are declared as `static`, which means they are associated with the class itself, rather than an instance of the class.

This is a snippet of code from our `TunableWhiteLight` class, now including a static method:
```java
public class TunableWhiteLight extends DimmableLight {
    //...

    /**
     * Convert a color temperature in degrees Kelvin to a color temperature in mireds.
     * @param degreesKelvin The color temperature in degrees Kelvin.
     * @return The color temperature in mireds.
     */
    public static int degressKelvinToMired(int degreesKelvin) {
        return 1000000 / degreesKelvin;
    }
    //...
}
```

This static method is associated with the `TunableWhiteLight` class, not an instance of the class.
To invoke it, we use the class name:
```java
TunableWhiteLight.degressKelvinToMired(2700);
```

Static methods are statically bound, unlike instance methods which are dynamically bound. At the time that you write and compile your code, the method to call is known (no runtime lookup is needed).

## Describe the JVM exception handling mechanism (5 minutes)

All exceptions in Java are instances of the `Throwable` class. It is important to note that, since Java is a statically typed language, we can distinguish between different kinds of exceptions.

There are two subclasses of `Throwable`: `Exception` and `Error`. 

An `Error` is an exception that is typically fatal, and detected by the JVM itself, although you can also throw them explicitly. For example, the JVM throws an `OutOfMemoryError` if it runs out of memory, or a `StackOverflowError` if the stack overflows (too much recursive function calling). These are not expected to be caught by application code. It is generally bad practice to throw an `Error` in your code.

Exceptions are further divided into two categories: `checked` and `unchecked`.

- `unchecked` exceptions are those that are *not* required to be caught by calling code (all subclasses of `RuntimeException`)
- `checked` exceptions are those that are *required* to be caught by calling code (all subclasses of `Exception` that are not subclasses of `RuntimeException`)

This is different than Python, where all exceptions are unchecked.

By making this distinction, an API can *require* that certain exceptions are caught, and the compiler will enforce that requirement. 

This class diagram shows the relationship between the classes, along with four example exceptions:
```mermaid
classDiagram
    class Throwable {
    }
    class Exception {
    }
    class RuntimeException {
    }
    class Error {
    }
    Throwable <|-- Exception
    Throwable <|-- Error
    Exception <|-- RuntimeException
    Exception <|-- IOException
    RuntimeException <|-- NullPointerException
    RuntimeException <|-- IllegalArgumentException
    RuntimeException <|-- IndexOutOfBoundsException
    
```

You should [only use exceptions for exceptional cases](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch10.xhtml#lev69), for example, this is not a good use of an exception:
```java
try {
    Light[] lights = {
        new TunableWhiteLight(2700),
        new TunableWhiteLight(2200)
    };
    int i = 0;
    while(true){
        lights[i].turnOn();
        i++;
    }
} catch (ArrayIndexOutOfBoundsException e) {
    // Do nothing
}
```

## Recognize common Java exceptions and when to use them (5 minutes)

While you could create a specialized exception for every possible error condition, this would be anithetical to the idea of reusing code. Instead, we [favor the use of standard exceptions](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch10.xhtml#lev72)

Here are some common exceptions and when to use them:
- `IllegalArgumentException`: When a method is passed an illegal or inappropriate argument.
- `NullPointerException`: When a method is passed a null argument that is not expected.
- `IllegalStateException`: When an object is in an inappropriate state for a method to perform its task.
- `IndexOutOfBoundsException`: When an index is out of bounds.
- `UnsupportedOperationException`: When an operation is not supported by an object.

Each method should [check parameters for validity](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch8.xhtml#lev49) and throw an appropriate exception if the parameters are invalid. For example:

```java
/**
 * Set the color temperature of the light.
 * @param colorTemperature The color temperature to set the light to, in degrees Kelvin.
 * @throws IllegalArgumentException if the color temperature is outside the valid range.
 */
public void setColorTemperature(int colorTemperature) {
    if (colorTemperature < 1000 || colorTemperature > 10000) {
        throw new IllegalArgumentException("Color temperature in degrees Kelvin must be between 1,000 and 10,000");
    }
    // ...
}
```
