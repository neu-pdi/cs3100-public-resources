---
sidebar_position: 6
lecture_number: 6
title: "Changeability I: Modularity and Information Hiding"
---

## Understand the importance of changeability as a goal of program design and implementation (10 minutes)

* Review the systematic program design and implementation process
* We haven't yet gone into significant detail on the "requirements gathering" step. 
* When considering the total cost of software, it is important to consider how much effort it will take to truly get the software to meet the needs of the customer.
* Put another way: the majority of the cost of software is not in the initial development, but in the maintenance and evolution of the software.

* Show the tire swing meme (use scan from A Pattern Language, see also [history of the tire swing](https://www.businessballs.com/amusement-stress-relief/tree-swing-cartoon-pictures-early-versions/))

* Here is an example of a simple requirement and how difficult it may be to implement:
    * Requirement: The Pawtograder platform should allow graders to annotate student submissions with feedback on the quality of the code.
* At a high level, this may seem like a simple requirement. However, as we start to design the system, we will likely start to make choices that we will be force to make without necessarily knowing whether or not they are the best choices.
    * Brainstorm types of choices that we might make:
        * Do annotations directly effect the score? If so, is it "positive" scoring or "negative" scoring?
        * Is there a rubric for the annotations? If so, how detailed is the rubric? Is it structured with categories and levels?
        * Are annotations associated with part of a line, or the whole line?
        * How does the grader specify which lines to annotate?
        * ...
* A core principle of modern software design is to favor rapid prototyping and iteration over getting the requirements perfect.
* However, throwing away a design and starting over is expensive.
* Instead, our goal is to instill a sense of **changeability** in our designs.

* One design is more changeable than another if it is easier to make changes to it.
* Note that to concretize this definition, we need to consider a specific possible change in a specific design. For the time being, we'll be specifying the kinds of changes that your designs should be able to adapt to.
    * NB: Anticipating ALL kinds of changes is impossible, and likely a waste of time.
    * In the next module (after the first exam), we will focus more on requirements analysis and user centered design: the methods that you will use to identify the kinds of changes that your designs should be able to adapt to.

Today, we will focus on a low-level aspect of changeability: **information hiding**. Over the next few lectures, we will also revisit principles of object oriented design that are core to changeability.

## Describe the relevance of modularity to changeability (10 minutes)

* The core idea to information hiding is that we should design our system so that it is broken into "modules" that are relatively independent. 
* What is a module?
    * A module is a self-contained unit of code. More specifically:
        * Each module should have a well-defined interface that specifies the behavior of the module. That specification should be restrictive, general and clear (Lecture 4)
        * The implementation of the module should be hidden from other modules and can be independently compiled.
        * Each module should be self-contained and should not depend on the implementation details of other modules.
    * A module could be a class, a package, or even a whole program. Modules can be composed together to form larger modules.

* Discuss for a few minutes: What could modularity help us achieve?
    * Efficiency of implementation: Different teams can work on different modules in parallel *without* needing to coordinate with each other (Brooks' law)
    * Readability and reusability: Modules are easier to understand and reuse if they are independent. This is particularly important when time has passed and it's a different set of developers working on the code.
    * Changeability: We can change one module without affecting the others.
    * Testability: Modules are easier to test if they are independent - they can be tested in isolation. This makes the tests easier to write, and more importantly, easier to debug when they fail.
    * Performance: Modules are easier to optimize if they are independent.
* Note that for any of these goals, it is essential that modules are *independent* as much as possible.
* For the next few lectures, we will focus on evaluating designs that have already been decomposed into modules. Once we have a good understanding of how to evaluate designs, we will look at how to decompose a system into modules.

## Describe the role of information hiding and immutability in enabling effective modularity (5 minutes)
* Today's principle is: **information hiding**.
* When information hiding was first proposed in the 1970s (by a software engineering researcher named David Parnas), there was little support for it from programming languages. As a designer, you could organize your code into modules, but there was very limited support to enforce that organization, or to prevent other parts of the code from accessing the implementation details of a module.
* Why do we need information hiding?
  * Even if you have a good design that separates concerns into modules, some other developer might innevitably come along and find other ways to use your module in a way that was not anticipated. 
  * See [Hyrum's Law](https://www.hyrumslaw.com): "With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of a system will be depended on by somebody."
    * See also [XKCD #1172](https://xkcd.com/1172/)
  * So, insofar as a programming language can support information hiding, it is important to use it in order to ensure that our modules are used as anticipated.

* We have already seen a core approach to achieve information hiding: creating *interfaces* that specify the behavior of a module without regard to its implementation.
   * The interface *hides* the implementation details of the module.
   * Changing *how* the interface is implemented can be done without affecting the code that uses the interface.
* We will now look at some Java language features that help us achieve information hiding and immutability. In the context of object oriented design, these features are collectively known as enabling *encapsulation*.

## Be able to apply Java language features to achieve information hiding and immutability 

### Access modifiers (15 minutes)

* Each class, method, and field in Java has an *access modifier* that controls its accessibility.
* The four access modifiers are:
  * `public`: The class, method, or field is accessible from anywhere.
  * `protected`: The class, method, or field is accessible from the package and any subclasses.
  * `package-private`: The class, method, or field is accessible from other code written in the same package. This is the default if no access modifier is specified.
  * `private`: The class, method, or field is accessible only from within the class.
* The rule of thumb is that we should [minimize accessibility of classes and members](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev15)

* You should think carefully before declaring a class or member `public`. Everything that is `public` is part of your module's interface. 

* Note that if you begin your module design by enumerating the public interfaces (that specify the behavior of a module) and the classes that represent your data, you will naturally minimize the accessibility of the classes and members when it comes time to implement them.

* In Java, it is particularly important to minimize the accessibility of the *fields* of a class, such that the class can enforce invariants on its state.
    * For example, if a class has a `public` field, then any code can set that field to a value that violates the class's invariants.
    * By contrast, if a class has a `private` field, then the class can enforce the invariants on that field by *not* allowing code outside the class to set it to a value that violates the invariants. Outside code that wants to set the field must use the class's public methods, which can check the value and throw an exception if it is invalid.

As a simple example, consider this class:
```java
/**
 * A simple counter that can be incremented. 
 * The count is always non-negative, and increments monotonically.
 */
public class Counter {
    public int count;

    /**
     * Increment the count by 1.
     */
    public void increment() {
        count++;
    }
}
```

Clients of the `Counter` class can use the `increment` method to change the count, but could also directly change the `count` field.

```java
Counter c = new Counter();
c.increment(); // count is now 1
c.count = 0; // count is now 0 (surprise!)
```

Notice that, considering the specification of the `Counter` class, the assignment to `c.count` is a violation of the class's invariants. 

By contrast, a `Counter` using a private field would have prevented the assignment to `c.count` by enforcing the invariant that the count is always monotonically increasing.

```java
/**
 * A simple counter that can be incremented. 
 * The count is always non-negative, and increments monotonically.
 */
public class Counter {
    private int count;

    public int getCount() {
        return count;
    }

    public void increment() {
        count++;
    }
}
```

Even if you do not have an invariant in mind that you want to enforce, it is still a good idea to make fields private. You might discover an invariant to enforce later, or might encounter a change in requirements that you need to support.

While it is the case that [in public classes, use accessor methods, not public fields](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev16), it is worth noting that in some cases, non-public classes might benefit from having public fields.

Consider the following example taken from [Josh Bloch's Effective Java Item 16](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev16):

```java
// Note: This is a package-private class, not visible outside of the package.
class Point {
    public double x;
    public double y;
}
```

This class is a simple data structure to represent a point in 2D space. Note that the fields are `public`, allowing them to be accessed directly. This class does not benefit from the additional safety and flexibility that would be gained by using private fields and accessor methods. Here is the alternative:

```java
class Point {
    private double x;
    private double y;

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }
}
```

This variation follows the rule of thumb that we should [minimize accessibility of classes and members](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev15). However, it is also considerably longer than the original version.

Since the class is not visible outside of its package, it is a reasonable assumption that the class is not exposed by the module that contains it. In this case, any possible changes that we would want to make to the behavior of the class would be limited to changes within the module. Hence, it is not necessary to use accessor methods, and the original version is more concise.

### Immutable objects and fields (20 minutes)

Immutable classes are those whose instances cannot be changed after they are created. Immutable classes are simpler to reason about, as their behavior can be determined by their constructor and public methods. This is particularly important for classes that are passed between modules, as it provides a strong guarantee that the behavior of an object won't be changed by another module. When you design a class, you should [Minimize Mutability](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch4.xhtml#lev17): make it immutable by default, only making it mutable if there is a good reason to.  

For example, consider a class for storing a [North American Dialing Plan phone number](https://en.wikipedia.org/wiki/North_American_Numbering_Plan) (e.g. a phone number that uses the country code `+1` and is followed by a 3 digit area code, 3 digit central office code and a 4 digit number). When we contstruct an instance of the class, that instance will represent a specific phone number, and as such, we should ensure that the instance cannot be changed.

```java
public final class PhoneNumber {
    private final short areaCode;
    private final short centralOfficeCode;
    private final short number;

    public PhoneNumber(short areaCode, short centralOfficeCode, short number) {
        this.areaCode = areaCode;
        this.centralOfficeCode = centralOfficeCode;
        this.number = number;
    }
    // ... getters and other methods ...
}
```

We make the class immutable by declaring the fields `final`. This ensures that the fields cannot be changed after the instance is constructed, and also ensures that the value is set upon construction. Even for non-`final` fields, it is important to ensure that they are set when an instance is constructed, ensuring that the object is always in a valid state.

We also declare the class `final` to prevent subclasses from changing the behavior of the class - otherwise, a subclass could violate the immutability of the class by overriding its behavior.

If a class has *reference* fields (e.g. fields that are objects or arrays), then there is one additional consideration that we must take into account in order to ensure that the class is immutable. Consider this alternative implementation of the `PhoneNumber` class that supports variable-length numbers (e.g. not only supporting NADP numbers):

```java
public final class PhoneNumber{
    private final short[] number;

    public PhoneNumber(short[] number) {
        this.number = number;
    }

    public String getNumber() {
        return number;
    }
    // ... getters and other methods ...
}
```

On first glance, this implementation seems to be immutable. However, consider the following code:

```java
short[] number = {1, 2, 3};
PhoneNumber pn = new PhoneNumber(number);
number[0] = 4; // pn is now {4, 2, 3}
```

Recall that reference types in Java are passed by reference, which means that the `number` array passed to the constructor is the same exact array that is stored in the `pn` instance. Hence, if the caller modifies the `number` array, the change is reflected in the `pn` instance. Despite the fact that the `number` field is declared as `final`, the immutability of the class is violated.

Hence, in order to ensure that the class is immutable, we must [make defensive copies when needed](https://learning.oreilly.com/library/view/effective-java-3rd/9780134686097/ch8.xhtml#lev49). In this case, we can make a defensive copy of the `number` array in the constructor:

```java
public PhoneNumber(short[] number) {
    this.number = new short[number.length];
    System.arraycopy(number, 0, this.number, 0, number.length); // equivalent to setting each element individually
}
```

Here is the general recipe for making a class immutable:
- Do not provide any mutators (methods that change the state of the object).
- Make the class `final` to prevent subclasses from changing the behavior of the class (and possibly making it mutable).
- Make all fields `final` to ensure that the state of the object cannot be changed after it is constructed.
- Make all fields private to control access to the state of the object.
- If the class has reference fields, make defensive copies of the fields when needed.
