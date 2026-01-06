---
sidebar_position: 2
image: /img/labs/web/lab2.png
---

# Lab 2: Polymorphism and Collections

![oncept A: 'The Universal Remote' (Polymorphism in Action)
The visual is a lo-fi pixel art living room scene with a figure holding a single universal remote control. The color palette is cozy domestic tones: warm lamp light, evening blues through windows, with glowing LEDs from smart devices providing accents. The key visual: one remote, many devices. The remote has a single 'IDENTIFY' button being pressed, and radiating from it are command waves reaching every device in the room—a ceiling fan that starts spinning slowly, a dimmable desk lamp that pulses, a tunable white light that cycles through color temperatures, a smart thermostat that beeps. Each device responds differently to the same command. The remote doesn't have separate buttons for 'identify fan' vs 'identify light'—it just says 'identify' and each device figures out what that means. Small code snippets float near the remote: for (IoTDevice d : devices)  d.identify();  and near the devices: No instanceof checks!
The message is the power of polymorphism: write code once, and it works with any type that implements the interface—even types that don't exist yet. A small 'future zone' in the corner shows ghosted outlines of devices not yet invented (a robot vacuum, a smart mirror, a window shade) with dotted lines showing they could also respond to the same remote. The banner: 'One command, infinite implementations.' The visual helps students see that SmartHomeController isn't checking device types—it's trusting the interface contract, and dynamic dispatch handles the rest.
Title at bottom: 'Lab 2: Polymorphism and Collections'](/img/labs/web/lab2.png)
In this lab, you'll implement code that uses polymorphism, select appropriate collection types, and measure performance differences between data structures.

:::info Grading: What You Need to Submit

**Due:** At the end of your scheduled lab section. This is automatically enforced with a 10-minute grace period (in case you finish at the last minute), but **push your work regularly**—don't wait until the end!

**Option 1: Successful Completion**
- Complete Parts 1-3 of the lab
- All code compiles and runs correctly
- Push your completed work to GitHub
- Complete the reflection in `REFLECTION.md`

**Option 2: Partial Credit**
If you're unable to complete everything:
- Submit a `REFLECTION.md` documenting what you completed, where you got stuck, and what you tried
- A TA will review your submission and award partial credit for good-faith effort

The **Optional Extensions** are not required for full credit but are excellent practice if you finish early. You may also resubmit this lab *after* the due date for feedback (but your grade will not change).

:::

:::warning Attendance Matters

If lab leaders observe that you are **not working on the lab** during the section, or you **leave early** AND do not successfully complete the lab, you will receive **no marks**.

**Struggling? That's okay!** We are here to support you. If you're putting in effort and engaging with the material, we will give you credit. Ask questions, work with your neighbors, and flag down a lab leader if you're stuck.

:::

## Learning Objectives

By the end of this lab, you will be able to:

- Implement methods that use polymorphism to operate on objects through supertype references
- Select appropriate collection types (List, Set, Map) based on access patterns
- Measure and compare performance characteristics of different collection implementations

## Before You Begin

**Prerequisites:** Complete Lectures 2-3 and Flashcard Sets 1-2.

**Clone the Lab Repository:** Get the starter code from the link on Canvas/Pawtograder. The repository includes:
- `IoTDevice.java` — interface from lecture
- `BaseIoTDevice.java` — abstract class with shared implementation
- `Light.java`, `DimmableLight.java`, `TunableWhiteLight.java` — the light hierarchy
- `Fan.java` — a separate device type
- `SmartHomeController.java` — controller class with method stubs (Part 1)
- `SmartHomeControllerTest.java` — test file with starter test (Part 1)
- `DeviceGenerator.java` — generates test devices for performance measurement
- `Lab2Exercises.java` — where you'll write code for Parts 2-3

---

## Part 1: Polymorphism in Action (10 minutes)

The power of polymorphism is writing code that works with *any* subtype—even ones that don't exist yet. In this exercise, you'll implement a smart home controller that operates on devices without knowing their concrete types.

### Exercise 1.1: Implement a Device Controller

The starter code includes a `SmartHomeController` class with method stubs. Your task: implement methods that work with **any** `IoTDevice` using polymorphism.

```java
public class SmartHomeController {
    private List<IoTDevice> devices;
    
    public SmartHomeController() {
        this.devices = new ArrayList<>();
    }
    
    /**
     * Adds any IoT device to the controller.
     */
    public void addDevice(IoTDevice device) {
        // TODO: Implement this
    }
    
    /**
     * Calls identify() on ALL devices in the home.
     * Each device type will identify itself differently (lights flash, fans spin, etc.)
     */
    public void identifyAllDevices() {
        // TODO: Implement this
        // Hint: You don't need to know what type each device is!
    }
    
    /**
     * Returns a count of how many devices are currently available (connected).
     */
    public int countAvailableDevices() {
        // TODO: Implement this
        // Use the isAvailable() method from IoTDevice
    }
}
```

### Exercise 1.2: Write JUnit Tests for Your Controller

In `SmartHomeControllerTest.java`, write JUnit 5 tests that verify your implementation works with a mix of device types. Your tests should:

```java
@Test
void identifyAllDevices_worksWithMixedDeviceTypes() {
    SmartHomeController controller = new SmartHomeController();
    
    // Add different device types - they should all work!
    controller.addDevice(new Fan("ceiling-fan"));
    controller.addDevice(new DimmableLight("desk-lamp", 75));
    controller.addDevice(new TunableWhiteLight("living-room", 2700, 100));
    
    // This should not throw any exceptions
    assertDoesNotThrow(() -> controller.identifyAllDevices());
}

@Test
void countAvailableDevices_countsAllDeviceTypes() {
    // TODO: Write a test that verifies countAvailableDevices works
    // with a mix of Fans, DimmableLights, and TunableWhiteLights
}
```

Run your tests with `./gradlew test` to verify your implementation.

**Key insight:** Your `identifyAllDevices()` method doesn't contain any `if (device instanceof Fan)` checks—it just calls `identify()` and the JVM figures out which implementation to run. That's polymorphism at work.

### Exercise 1.3: Discussion — What Makes a "Device"?

With a neighbor, discuss the assumptions built into the `IoTDevice` interface:

1. **What capabilities does `IoTDevice` assume all devices have?** (Look at the interface methods)

2. **What new device types could easily fit this interface?** Think about: smart thermostats, door locks, security cameras, robot vacuums...

3. **What might be awkward or out of scope?** Consider: Does a smart speaker "identify" itself the same way? What about a device that's always on (like a router)? What about a device with multiple components (like a washer/dryer combo)?

### 🔄 Sync Point 1

**Lab leaders will pause here for a brief discussion:**
- Ask groups to share: "What device types did you think would fit well? What seemed awkward?"
- Discuss: The interface defines what's *possible* to model. Anything outside those methods requires changing the interface—which affects ALL existing code.
- Preview: In upcoming homework assignments, you'll design your own class hierarchies. Thinking about edge cases *now* saves refactoring *later*.

---

## Part 2: Collections Selection (10 minutes)

Choosing the right collection type makes your code clearer and faster. In this section, you'll practice matching problems to collections.

### Exercise 2.1: Fix the Generics Bug

The starter code contains this problematic snippet in `Lab2Exercises.java`:

```java
// This code has a bug! Fix it using generics.
public static void demonstrateGenericsBug() {
    List devices = new ArrayList();  // Raw type warning!
    devices.add(new DimmableLight("test", 100));
    devices.add("oops, this is a string");  // No compile error...
    
    // This will crash at runtime!
    for (Object obj : devices) {
        Light light = (Light) obj;
        light.turnOn();
    }
}
```

**Your task:** Fix this code so the compiler catches the bug. The string should cause a compile-time error, not a runtime crash.

### Exercise 2.2: Choose the Right Collection

For each scenario below, choose the appropriate collection type and implement a solution in `Lab2Exercises.java`.

**Scenario A: Device Registry**

You're building a smart home system that stores devices by their unique ID (like `"living-room-main"` or `"bedroom-fan"`). You need to quickly look up a device by its ID.

```java
// TODO: Implement createDeviceRegistry()
// - Choose the right collection type
// - Add at least 3 devices with meaningful IDs
// - Return the collection
```

Questions to consider:
- Do you need to look up by key or by position?
- Do keys need to be unique?

**Scenario B: Devices by Room**

You want to track all devices in each room. A room can have multiple devices, and you need to find all devices in a given room quickly.

```java
// TODO: Implement groupDevicesByRoom()
// - What should the key type be?
// - What should the value type be?
// - Add devices to at least 2 rooms
```

**Scenario C: Online Device Tracking**

You're tracking which devices are currently online. When a device comes online, you add it. When it goes offline, you remove it. You frequently need to check "is this device online?"

```java
// TODO: Implement createOnlineDeviceTracker()
// - Choose a collection that efficiently answers "contains?" queries
// - Order doesn't matter
```

### 🔄 Sync Point 2

**Lab leaders will pause here:**
- Ask groups: "What collection did you use for Scenario A? B? C?"
- Discuss tradeoffs: HashMap vs TreeMap, HashSet vs ArrayList
- Quick poll: "Who had a different approach that also works?"

---

## Part 3: Performance Showdown (10 minutes)

Let's measure the performance difference between collection types. You'll compare how long it takes to **build** different collections and to **look up** elements in them.

### The Challenge

With 10,000 devices:
1. How long does it take to **build** each collection type?
2. How long does it take to **find** a device by ID?

### Exercise 3.1: Implement the Collection Builders

Complete these methods in `Lab2Exercises.java`:

**Build an ArrayList:**
```java
public static ArrayList<IoTDevice> buildArrayList(List<IoTDevice> devices) {
    ArrayList<IoTDevice> list = new ArrayList<>();
    // TODO: Add all devices to the ArrayList
    return list;
}
```

**Build a LinkedList:**
```java
public static LinkedList<IoTDevice> buildLinkedList(List<IoTDevice> devices) {
    LinkedList<IoTDevice> list = new LinkedList<>();
    // TODO: Add all devices to the LinkedList
    return list;
}
```

**Build a HashMap:**
```java
public static HashMap<String, IoTDevice> buildHashMap(List<IoTDevice> devices) {
    HashMap<String, IoTDevice> map = new HashMap<>();
    // TODO: Add all devices, using device ID as the key
    return map;
}
```

### Exercise 3.2: Implement the Lookup Methods

```java
public static IoTDevice findInArrayList(ArrayList<IoTDevice> devices, String targetId) {
    // TODO: Loop through the list, check each device's ID
    // Return the device if found, null otherwise
}

public static IoTDevice findInLinkedList(LinkedList<IoTDevice> devices, String targetId) {
    // TODO: Loop through the list, check each device's ID
    // Return the device if found, null otherwise
}

public static IoTDevice findInHashMap(HashMap<String, IoTDevice> deviceMap, String targetId) {
    // TODO: Look up the device directly by ID
}
```

### Exercise 3.3: Run the Performance Test

The starter code includes a `runPerformanceComparison()` method that:
1. Generates 10,000 devices using `DeviceGenerator`
2. Times how long it takes to build each collection
3. Performs 1,000 lookups and measures the time

Run the performance test:
```bash
./gradlew run
```

**Record your results:**

| Collection | Time to Build (10K devices) | Time for 1,000 Lookups |
|------------|-----------------------------|-----------------------|
| ArrayList  | ___ ms | ___ ms |
| LinkedList | ___ ms | ___ ms |
| HashMap    | ___ ms | ___ ms |

### Exercise 3.4: Analyze the Results

Answer these questions in your `REFLECTION.md`:
1. Which was fastest to **build**? Which was fastest to **look up**?
2. Why is HashMap lookup faster than ArrayList/LinkedList?
3. For the build times: Were ArrayList and LinkedList similar? Why or why not?
4. If you only needed to look up devices **once**, would a HashMap still be worth it?

### 🔄 Sync Point 3

**Lab leaders will lead a discussion:**
- Share results across the room—are they consistent?
- Discuss Big-O: O(n) vs O(1) lookup, O(n) build for all

---

## Reflection

Complete the `REFLECTION.md` file with your answers to:

1. **Polymorphism:** In your `SmartHomeController`, why didn't you need to write any `instanceof` checks? What would happen if a new device type (like `SmartThermostat`) were added to the codebase?

2. **Collections:** For one of the scenarios in Part 2, explain why your chosen collection type was the best fit.

3. **Performance:** Record your timing results table from Exercise 3.3, and answer the analysis questions from Exercise 3.4.

4. **Collaboration:** Did you and your neighbor have different approaches in today's lab? How did you resolve disagreements? What did you learn from discussing with someone who thought differently?

---

## Optional Extensions

If you finish early, try one or more of these challenges:

### Stretch Goal 1: Performance Deep Dive

Modify the performance test to explore further:

1. **Vary collection size:** Test with 1,000, 10,000, and 100,000 devices. How does each approach scale? Does the relative performance change?

2. **Insertion at different positions:** Measure time to insert 1,000 devices at the *beginning* vs the *end* of an ArrayList vs a LinkedList. Explain the differences.

3. **Iteration performance:** Measure how long it takes to iterate through all 10,000 devices in ArrayList vs LinkedList. Which is faster? Why? (Hint: think about memory layout)

Add your findings to `REFLECTION.md` under "Optional: Performance Deep Dive."

### Stretch Goal 2: Design Patterns Analysis

The starter code includes a `CeilingFanWithLight` class that uses **composition**—it *has* a Light and *has* a Fan rather than trying to *be* both.

1. Read through `CeilingFanWithLight.java`
2. Answer in `REFLECTION.md`:
   - Why doesn't `CeilingFanWithLight` extend both `Light` and `Fan`?
   - What's the advantage of the composition approach?
   - What's a disadvantage?
   - When would inheritance be a better choice than composition?

### Stretch Goal 3: Generic Methods

Implement this generic method in `Lab2Exercises.java`:

```java
/**
 * Filters a list of devices to return only those of a specific type.
 * 
 * Example usage:
 *   List<Light> lights = filterByType(allDevices, Light.class);
 *   List<Fan> fans = filterByType(allDevices, Fan.class);
 *
 * @param devices the list of devices to filter
 * @param type the class object representing the desired type
 * @return a new list containing only devices of the specified type
 */
public static <T extends IoTDevice> List<T> filterByType(
        List<IoTDevice> devices, 
        Class<T> type) {
    // TODO: Implement this method
    // Hint: Use type.isInstance(device) to check if a device matches
}
```

Test your implementation:
```java
List<IoTDevice> allDevices = DeviceGenerator.generateMixedDevices(100);
List<Light> lights = filterByType(allDevices, Light.class);
List<Fan> fans = filterByType(allDevices, Fan.class);
System.out.println("Found " + lights.size() + " lights and " + fans.size() + " fans");
```

---

## Submission Checklist

Before submitting, ensure:

- [ ] Part 1: You've implemented `SmartHomeController` and written JUnit tests for it
- [ ] Part 2: You've fixed the generics bug and implemented all 3 collection scenarios
- [ ] Part 3: You've implemented the build and lookup methods, and recorded timing results
- [ ] `REFLECTION.md` is complete with all required answers
- [ ] All tests pass: `./gradlew test`
- [ ] Your code compiles: `./gradlew build`
- [ ] All changes are committed and pushed to GitHub

---

## Why This Matters

The patterns you practiced today connect directly to your homework assignments:

- **Polymorphism and class hierarchies:** In your assignments, you'll design your own type hierarchies. The same principle applies: code that works with the supertype works with *any* subtype.

- **Choosing the right collection:** When storing and retrieving domain objects, the collection you choose affects both code clarity and performance. You'll make these decisions throughout your assignments.

- **Testing with JUnit:** Every assignment requires tests. Writing tests that verify polymorphic behavior (like we did with `SmartHomeController`) is a skill you'll use repeatedly.

- **Measuring before assuming:** When you need to justify design decisions, actual measurements beat intuition. If a TA asks "why did you use a HashMap here?", you'll have the vocabulary and experience to explain.
