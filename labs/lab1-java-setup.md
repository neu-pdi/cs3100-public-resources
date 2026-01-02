---
sidebar_position: 1
---

# Lab 1: Java Tooling and Setup

Welcome to CS 3100! In this lab, you'll set up your Java development environment and get familiar with the tools we'll use throughout the course.

## Learning Objectives

By the end of this lab, you will be able to:

- Install and configure Java 21 (Temurin)
- Open and build a Gradle project in VS Code
- Understand basic Java inheritance and interfaces
- Run tests using JUnit 5
- Make commits and push changes to GitHub

## Part 0: Prerequisites

Before starting, ensure you have:
- [ ] A GitHub account
- [ ] git installed on your computer
- [ ] VS Code installed

For help, see the [CS 2100 setup instructions](https://neu-pdi.github.io/cs2100-public-resources/setup).

## Part 1: Install Java 21 (Temurin)

We'll use Eclipse Temurin, a free, open-source distribution of Java.

> ⚠️ **IMPORTANT: You MUST use Java 21, not Java 25!**
>
> Even though Java 25 is newer, **do not install it**. Our build tools (Gradle 8 and, in particular, [the Pitest plugin](https://github.com/szpak/gradle-pitest-plugin/issues/380)) do not yet support Java 25. If you install Java 25, your builds (including in VS Code) will fail with cryptic errors along the lines of "Unsupported class file major version 69". It may be possible to configure a local development environment to use Java 25, but we do not support it.
>
> If you already have Java 25 installed, see the [Troubleshooting](#troubleshooting) section for how to switch to Java 21 (particularly important for Mac users).


### Download the Installer

1. Go to the Adoptium download page: https://adoptium.net/temurin/releases/?version=21
2. Select your operating system:
   - **macOS**: Choose `.pkg` installer (use **aarch64** for Apple Silicon Macs, **x64** for Intel Macs)
   - **Windows**: Choose `.msi` installer (**x64** for most computers)
   - **Linux**: Choose `.tar.gz` or use your distribution's package manager

### Run the Installer

#### macOS
1. Open the downloaded `.pkg` file
2. Follow the installation wizard
3. Click through the prompts and enter your password when asked

#### Windows
1. Open the downloaded `.msi` file
2. Follow the installation wizard
3. **Important:** On the "Custom Setup" screen, make sure these options are enabled:
   - ✅ "Set JAVA_HOME variable"
   - ✅ "Add to PATH"

#### Linux
For Ubuntu/Debian, you can also install via terminal:
```bash
sudo apt update
sudo apt install temurin-21-jdk
```

## Part 2: Set Up VS Code

### Install Required Extensions

1. Open VS Code
2. Go to Extensions (⌘+Shift+X on Mac, Ctrl+Shift+X on Windows/Linux)
3. Install the **Extension Pack for Java** by Microsoft
4. Install **GitHub Pull Requests** by GitHub (for easy commits and pushing)

### Open This Project

1. Clone this repository (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd sp26-lab1-your-username
   ```
2. Open VS Code in this folder:
   ```bash
   code .
   ```
3. VS Code should automatically detect the Gradle project and start downloading dependencies

### Compile the Project

On Windows, you can configure the integrated terminal in VS Code to open either PowerShell, CMD, or Git Bash.
We recommend [setting the default](https://stackoverflow.com/a/45899693/631051) to Git Bash.

   Open the integrated terminal (`⌘+ˋ` or `Ctrl+ˋ`) and run:

```bash
./gradlew compileJava
```

On Windows PowerShell, use:
```cmd
.\gradlew.bat compileJava
```

You should see `BUILD SUCCESSFUL` at the end, but also **4 warnings**! These warnings come from **static analysis tools** that catch common bugs at compile time:

```
warning: [ReferenceEquality] Comparison using reference equality instead of value equality
warning: [NullAway] dereferenced expression managerName is @Nullable
warning: [PatternMatchingInstanceof] This code can be simplified...
```

This project uses two static analysis tools:
- **Error Prone** — catches common Java mistakes (like using `==` instead of `.equals()`)
- **NullAway** — catches potential null pointer exceptions before your code runs

You can also see these warnings in VS Code's **Problems** panel (View → Problems, or ⌘+Shift+M / Ctrl+Shift+M). This panel shows all errors and warnings in your project — it's a great way to find issues!

> 💡 **Your first task will be to fix these warnings.** But first, let's explore the codebase.

## Part 3: Explore the Codebase

This lab uses the **SceneItAll** smart home IoT device universe. Take a moment to explore the code structure:

```
src/
├── main/java/net/sceneitall/iot/
│   ├── IoTDevice.java          # Base interface for all devices
│   ├── Light.java              # Interface for lights
│   ├── Fan.java                # A simple fan device
│   ├── SwitchedLight.java      # A basic on/off light
│   ├── DimmableLight.java      # A light with brightness control
│   ├── TunableWhiteLight.java  # A light with color temperature
│   └── DeviceManager.java      # Device manager (has warnings to fix!)
└── test/java/net/sceneitall/iot/
    └── LightTest.java          # Tests for the light classes
```

Browse through the files to understand the class hierarchy: `IoTDevice` → `Light` → `SwitchedLight` → `DimmableLight` → `TunableWhiteLight`.

### VS Code Navigation Tips

VS Code has powerful navigation features. Try these while exploring:

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| **Go to Definition** | ⌘+Click or F12 | Ctrl+Click or F12 |
| **Peek Definition** (inline preview) | ⌥+F12 | Alt+F12 |
| **Find All References** | ⇧+F12 | Shift+F12 |
| **Go Back** (after jumping) | ⌃+- | Ctrl+Alt+- |
| **Show Type Hierarchy** | Right-click → "Show Type Hierarchy" | Right-click → "Show Type Hierarchy" |

**Try it now:**
1. Open `DimmableLight.java`
2. Hold ⌘ (Mac) or Ctrl (Windows) and click on `SwitchedLight` in the `extends` clause
3. You'll jump to the `SwitchedLight` class! Press ⌃+- (Mac) or Ctrl+Alt+- (Windows) to go back.
4. Try ⇧+F12 (Shift+F12) on the `Light` interface to see everywhere it's used.
5. Right-click on `Light` and select **"Show Type Hierarchy"** — you'll see the full inheritance tree!

## Part 4: Your Tasks

Complete the following tasks. Each task should take just a few minutes.

> 💡 **Even if you already know Java**, pay attention to the VS Code tips in each task! Professional developers spend most of their time *navigating* and *understanding* code, not writing it. Mastering your IDE's keyboard shortcuts and navigation features will make you significantly more productive. You might discover a feature you didn't know existed!

### Task 1: Fix Static Analysis Warnings 🔍

Remember those 4 warnings from compiling? Let's fix them!

1. Open the **Problems panel** (⌘+Shift+M on Mac, Ctrl+Shift+M on Windows) to see all warnings in one place. Click on a warning to jump directly to that line!

2. **Research** each warning by clicking the links in the terminal output or searching online:
   - [ReferenceEquality](https://errorprone.info/bugpattern/ReferenceEquality) — why `==` is wrong for comparing objects
   - [NullAway](https://github.com/uber/NullAway) — catching null pointer exceptions at compile time
   - [PatternMatchingInstanceof](https://errorprone.info/bugpattern/PatternMatchingInstanceof) — a Java 21 feature

3. Fix all 4 issues in `DeviceManager.java`:
   - **ReferenceEquality** (2 places): Replace `==` with `.equals()` for String comparisons
   - **NullAway**: Add a null check before calling `.length()` on the nullable field
   - **PatternMatchingInstanceof**: Use `if (device instanceof Light light)` instead of casting

4. Rebuild to verify **0 warnings**:
   ```bash
   ./gradlew compileJava
   ```

> 🛠️ **VS Code tip:** After fixing each warning, the Problems panel updates automatically. You can also hover over the yellow squiggly underlines in the editor to see the warning message.

### Task 2: Run Tests and Fix the Bug in `Fan.java` 🐛

Now let's run the tests:

```bash
./gradlew test
```

You'll see some tests **fail**! The `Fan` class has a bug — when you create a new fan, it should start in the "off" state, but there's an issue with the `isRunning()` method.

1. Open `src/main/java/net/sceneitall/iot/Fan.java`
2. Find and fix the bug (hint: look at the `isRunning()` method)
3. Run the tests again to verify your fix: `./gradlew test`

> 🛠️ **VS Code tip:** Use **⌘+P** (Mac) or **Ctrl+P** (Windows) to quickly open files by name. Type "Fan" and select `Fan.java` — much faster than clicking through folders! You can also use **⌘+Shift+O** (Mac) or **Ctrl+Shift+O** (Windows) to jump to a specific method within a file.

### Task 3: Implement `TunableWhiteLight.setColorTemperature()` 💡

Some tests are still failing! The `TunableWhiteLight` class is missing the implementation for `setColorTemperature()`.

1. Open `src/main/java/net/sceneitall/iot/TunableWhiteLight.java`
2. Find the `setColorTemperature` method (use **⌘+Shift+O** / **Ctrl+Shift+O** and type "setColor")
3. Implement the method:
   - Validate that the temperature is between 2700K and 6500K
   - If invalid, throw an `IllegalArgumentException`
   - If valid, store the temperature in the `colorTemperature` field
4. Run the tests to verify: `./gradlew test`

> 🛠️ **VS Code tip:** Look at the constructor for an example of validation. Use **F12** on `MIN_COLOR_TEMP` to jump to where the constants are defined. The existing constructor shows exactly how to validate and throw an exception!

### Task 4: Add a New Test ✅

All tests should pass now. Let's add one more test!

Add a test to verify that `DimmableLight` handles invalid brightness values correctly.

1. Open `src/test/java/net/sceneitall/iot/LightTest.java`
2. Use **⌘+G** (Mac) or **Ctrl+G** (Windows) to "Go to Line" — jump to around line 104 where the `TODO` comment is
3. Add a test that verifies:
   - Setting brightness to -1 throws `IllegalArgumentException`
   - Setting brightness to 101 throws `IllegalArgumentException`
4. Run your new test: `./gradlew test`

> 🛠️ **VS Code tip:** Look at the existing `setSpeedRejectsInvalid` test in the Fan tests section for an example of how to use `assertThrows()`. Use **⌘+F** (Mac) or **Ctrl+F** (Windows) to search for "assertThrows" to find examples in the file.

## Part 5: Commit and Push

Once you've completed all tasks:

1. **Format your code** (this project uses automatic formatting):
   ```bash
   ./gradlew spotlessApply
   ```

2. **Check that everything passes**:
   ```bash
   ./gradlew build
   ```

3. **Commit and push using VS Code**:
   - Click the **Source Control** icon in the left sidebar (or press ⌃+Shift+G / Ctrl+Shift+G)
   - You'll see a list of changed files
   - Click the **+** next to each file (or click **+** next to "Changes" to stage all)
   - Type a commit message like "Complete Lab 1 tasks"
   - Click the **✓ Commit** button
   - Click **Sync Changes** to push to GitHub

## Part 6: Complete the Reflection

Open `REFLECTION.md` and answer the questions about your experience with this lab.

Don't forget to commit and push your reflection!

## Submission Checklist

Before submitting, ensure:

- [ ] `./gradlew compileJava` passes with **0 warnings**
- [ ] `./gradlew test` passes with all tests passing
- [ ] You've fixed the static analysis warnings in `DeviceManager.java`
- [ ] You've fixed the bug in `Fan.java`
- [ ] You've implemented `setColorTemperature()` in `TunableWhiteLight.java`
- [ ] You've added the new test in `LightTest.java`
- [ ] You've completed `REFLECTION.md`
- [ ] All changes are committed and pushed to GitHub

## Troubleshooting

### I installed Java 25 instead of Java 21

Java 25 is **not compatible** with our build tools. You need to install Java 21 and set it as your default.

#### macOS

1. Install Java 21 (see instructions above)
2. List your installed Java versions:
   ```bash
   /usr/libexec/java_home -V
   ```
3. Set Java 21 as default by adding this to your `~/.zshrc` (or `~/.bashrc`):
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   ```
4. Reload your shell: `source ~/.zshrc`
5. Verify: `java -version` should show version 21

If you see continued "Java Error" in VS Code, try clearing the Gradle cache:
```bash
./gradlew clean build --refresh-dependencies
```

In extreme cases, you can also try:
- Delete the `~/.gradle` directory
- Uninstall Java 25 (e.g. `rm -rf /Library/Java/JavaVirtualMachines/temurin-25.jdk`)
- Run the "Clean Java Language Server Workspace" command in VS Code
- Reboot your computer after completing these steps

#### Windows

1. Install Java 21 (see instructions above)
2. Open **System Properties** → **Advanced** → **Environment Variables**
3. Edit the `JAVA_HOME` variable to point to your Java 21 installation:
   - Typically: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot`
4. Edit the `Path` variable and move the Java 21 `bin` folder **above** any Java 25 entries
5. Open a **new** Command Prompt and verify: `java -version` should show version 21

#### Linux

1. Install Java 21 (see instructions above)
2. Use `update-alternatives` to switch versions:
   ```bash
   sudo update-alternatives --config java
   ```
3. Select the Java 21 option from the list
4. Verify: `java -version` should show version 21

### "java: command not found"

Make sure you opened a **new** terminal after installing Java. If still not working:
- **macOS/Linux**: Add `export JAVA_HOME=$(/usr/libexec/java_home -v 21)` to your `~/.zshrc` or `~/.bashrc`
- **Windows**: Verify JAVA_HOME is set in System Environment Variables

### VS Code doesn't recognize Java

1. Open Command Palette (⌘+Shift+P / Ctrl+Shift+P)
2. Type "Java: Configure Java Runtime"
3. Make sure Java 21 is detected and selected

### Gradle build fails

Try clearing the Gradle cache:
```bash
./gradlew clean build --refresh-dependencies
```

## Resources

- [Java 21 Documentation](https://docs.oracle.com/en/java/javase/21/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [VS Code Java Guide](https://code.visualstudio.com/docs/java/java-tutorial)
- [Course Website](https://neu-pdi.github.io/cs3100-public-resources/)
