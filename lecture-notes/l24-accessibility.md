---
sidebar_position: 24
lecture_number: 24
title: Accessibility and Inclusivity
---

## Describe common accessibility and inclusivity requirements and their importance (25 minutes)

In the previous two lectures, we explored usability—how well software supports humans in achieving their goals—and user-centered design—a process for ensuring we build software that truly serves users. We examined Nielsen's heuristics and learned techniques for prototyping and evaluating interfaces with real users.

But there's a critical question we haven't yet addressed: **which users?**

When we design software, we inevitably make assumptions about who will use it. We assume users can see the screen, use a mouse, read English, and process information in certain ways. These assumptions are so embedded in our mental models that we often don't notice them—until someone who doesn't fit those assumptions tries to use our software and can't.

This lecture extends our usability framework to explicitly consider **accessibility** (ensuring software works for users with disabilities) and **inclusivity** (ensuring software works for users across all dimensions of human diversity). These aren't separate concerns from usability—they're essential aspects of building software that actually works for the people who need to use it.

### The Spectrum from Accessibility to Inclusivity

**Accessibility** traditionally focuses on users with disabilities: visual impairments, hearing loss, motor difficulties, cognitive differences. Accessibility is a legal requirement in many jurisdictions (such as the United States).

**Inclusivity** broadens this lens to consider all dimensions of human diversity that might affect how people interact with software: age, gender, cultural background, language, education level, technical expertise, and situational factors like stress or distraction. Inclusivity is not a common legal requirement, but may be a social requirement. Moroever, it may be a business requirement for many companies that seek to market to the broadest market.

These concepts exist on a spectrum rather than as distinct categories. Consider a few scenarios:

| Scenario | Accessibility or Inclusivity? |
|----------|------------------------------|
| A blind user navigating SceneItAll with a screen reader | Accessibility |
| An elderly user struggling with small touch targets | Both |
| A user in bright sunlight who can't see their phone screen | Situational accessibility |
| A user who prefers step-by-step instructions over exploratory learning | Inclusivity |
| A non-native English speaker confused by idiomatic button labels | Inclusivity |

The **curb cut effect** illustrates why this distinction matters less than we might think. Curb cuts—the small ramps at street corners—were originally mandated for wheelchair users. But they benefit everyone: people pushing strollers, pulling luggage, riding bikes, or simply walking without having to step up. Similarly, accessibility features in software often improve the experience for all users:

- Captions help deaf users *and* people watching videos in noisy environments
- Keyboard navigation helps users with motor impairments *and* power users who prefer not to use a mouse
- Clear, simple language helps users with cognitive disabilities *and* non-native speakers *and* users in a hurry
- High-contrast interfaces help users with low vision *and* anyone using their phone outdoors

When we design for the margins, we often improve the experience for everyone.

### Accessibility Requirements: The POUR Principles

The Web Content Accessibility Guidelines (WCAG), maintained by the World Wide Web Consortium (W3C), provide the most widely-adopted framework for accessibility. While originally focused on web content, WCAG's principles apply broadly to software interfaces.

WCAG organizes accessibility around four principles, remembered by the acronym **POUR**:

**Perceivable**: Information and interface components must be presentable to users in ways they can perceive.

Users interact with software through their senses—primarily vision and hearing. If information is only available through one sense, users who lack that sense are excluded.

*SceneItAll example*: The app shows device status using colored icons—green for "on," red for "off." A colorblind user cannot distinguish these states. **Fix**: Add text labels ("On"/"Off") or use shapes in addition to colors (filled circle for on, empty circle for off).

*SceneItAll example*: When a Scene fails to activate, the app plays an error sound but shows no visual indicator. A deaf user misses this feedback entirely. **Fix**: Always pair audio feedback with visual feedback.

**Operable**: Interface components and navigation must be operable by users.

Users interact with software through input devices—mice, keyboards, touchscreens, voice commands, switches. If the interface only responds to one input method, users who can't use that method are excluded.

*SceneItAll example*: Scene activation requires a precise double-tap gesture. A user with tremors cannot reliably perform this gesture. **Fix**: Provide alternative activation methods (single tap with confirmation, long press, or voice command).

*SceneItAll example*: The app has no keyboard navigation—every interaction requires a mouse or touch. A user who cannot use a pointing device cannot use the app at all. **Fix**: Ensure all functionality is accessible via keyboard (Tab to navigate, Enter to activate, Escape to cancel).

**Understandable**: Information and operation of the interface must be understandable.

Even if users can perceive and physically interact with an interface, they must also be able to understand what they're perceiving and predict what their actions will do.

*SceneItAll example*: The app uses technical terminology ("Execute AreaScene with cascade propagation") instead of user-friendly language ("Turn on Evening mode for the whole house"). **Fix**: Use plain language that matches users' mental models.

*SceneItAll example*: The Scene button has hidden functionality—a short press activates the Scene, but a long press opens the Scene editor. Nothing in the interface indicates this distinction. A user who accidentally holds the button too long finds themselves in an unfamiliar editing screen with no idea how they got there or how to get back. Worse, a user who *wants* to edit a Scene has no way to discover this feature exists. **Fix**: Make all actions discoverable. If a single element supports multiple actions, provide visual affordances (like an edit icon) or use progressive disclosure (show an "Edit" option after activation).

**Robust**: Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies.

Software doesn't exist in isolation—it runs on various devices, operating systems, and browsers, and may be accessed through assistive technologies like screen readers. Robust software works correctly across this ecosystem.

*SceneItAll example*: The mobile app works on iOS but crashes on Android. Users with Android phones are excluded. **Fix**: Test across platforms and follow platform-agnostic development practices.

*SceneItAll example*: Custom UI components don't expose their role and state to the accessibility API, so screen readers can't announce them properly. A button is announced as "clickable" rather than "Activate Movie Night, button." **Fix**: Use semantic UI widgets or properly configure accessibility attributes.

### Inclusivity Requirements: Diversity Dimensions

Accessibility addresses disability-related barriers, but software can also fail users along other dimensions of diversity. Research in human-computer interaction has identified several **diversity dimensions** where individual differences affect how people interact with technology.

The **InclusiveMag** framework, developed by researchers at Oregon State University and City, University of London, provides a systematic approach to identifying and addressing inclusivity concerns. The core idea is that for any diversity dimension—age, cognitive ability, technical background, cultural context—we can identify **facets**: categories of individual differences that affect how people interact with software.

#### Identifying Facets

Facets emerge from research into how different populations approach technology. For a given diversity dimension and software type, researchers ask: *What individual differences between the under-served population and mainstream users affect how they use this kind of software?*

This research might include literature reviews, interviews with domain experts, observations of users, and empirical studies. The goal is to find well-established differences that:
1. Are relevant to the software type being designed
2. Cluster differently between the under-served and mainstream populations
3. Can be addressed through design choices

For example, research into problem-solving with software has identified facets like:

| Facet | Description | How It Affects Software Use |
|-------|-------------|----------------------------|
| **Motivation** | Why does the user engage with technology? | Task-focused users want to accomplish their goal and leave; exploration-oriented users enjoy discovering features. Interfaces that require exploration frustrate task-focused users. |
| **Information Processing Style** | How does the user gather information before acting? | Comprehensive processors read all options before deciding; selective processors act on the first promising option. Long option lists overwhelm selective processors; hidden options frustrate comprehensive processors. |
| **Self-Efficacy** | How confident is the user in their ability to succeed? | Users with low self-efficacy blame themselves for software failures and give up easily. Users with high self-efficacy persist through difficulties and try alternative approaches. |
| **Risk Tolerance** | How does the user respond to uncertain outcomes? | Risk-averse users avoid actions with unknown consequences; risk-tolerant users are willing to try and see what happens. Irreversible actions without previews exclude risk-averse users. |
| **Learning Style** | How does the user prefer to learn new features? | Process-oriented learners follow step-by-step instructions; tinkering learners explore through trial and error. Software that only supports one style excludes users who prefer the other. |

These facets apply across multiple diversity dimensions. For instance, lower self-efficacy with technology is more common among older adults, people with less technical education, and people from groups historically underrepresented in computing—not because of inherent differences, but because of differential exposure and social messaging about "who computers are for."

#### Applying Facets to Design

Once we've identified relevant facets, we can evaluate our designs by considering users at different points along each facet. Consider SceneItAll:

**A task-focused user** opens the app to turn off the living room lights before bed. They don't want to browse features or learn about Scenes—they want to accomplish one thing and put their phone down. If the interface buries basic device control under layers of Scene management, this user is poorly served. **Design implication**: Make the most common tasks immediately accessible; don't force users through feature-rich workflows for simple goals.

**A user with low self-efficacy** activates "Away Mode" but nothing seems to happen—no confirmation, no visual change. They assume they did something wrong and try again, accidentally toggling the mode off. Or they give up, concluding the app is "too complicated for me." **Design implication**: Provide clear feedback for all actions; distinguish between user errors and system states; use encouraging language that doesn't blame users.

**A risk-averse user** sees "Away Mode" but hesitates. What exactly will this do? Will it lock the doors while they're still inside? Will it turn off the refrigerator? They decide not to risk it. **Design implication**: Preview consequences before actions execute; provide clear descriptions of what each feature does; make actions reversible where possible.

**A process-oriented learner** wants to create their first Scene. They look for a tutorial or guided workflow but find only a blank editor. They don't know where to start and feel overwhelmed. **Design implication**: Offer optional guided experiences for complex features; provide templates and examples; include contextual help that explains concepts as users encounter them.

**A tinkering learner** clicks through a mandatory tutorial, annoyed at being forced through steps they want to discover themselves. They learn better by doing than by reading. **Design implication**: Make tutorials skippable; support safe exploration with robust undo; provide informative feedback when users try things.

The power of this approach is that it moves beyond vague concerns about "diverse users" to specific, actionable design considerations. Instead of asking "is this inclusive?" we can ask "does this design work for users who are task-focused? risk-averse? learning through exploration?" Each facet becomes a lens for evaluating our designs.

### Supporting Assistive Technologies

Users with disabilities often rely on **assistive technologies** to interact with software:

**Screen readers** convert visual interfaces to audio. They read aloud the content of the screen, announce interactive elements, and allow navigation via keyboard commands. For screen readers to work, software must provide semantic information about its structure and state. 

**Keyboard navigation** allows users to operate software without a mouse. Users press Tab to move between interactive elements, Enter to activate buttons, arrow keys to navigate within components, and Escape to dismiss dialogs. Many users with motor impairments, as well as power users, rely on keyboard navigation.

**Voice control** allows users to operate software through speech. Users can speak commands like "Click Submit" or "Press Tab three times." Voice control works best when interactive elements have visible, speakable labels.

**Switch devices** allow users with severe motor impairments to operate software through one or two buttons. The interface scans through options, and the user activates their switch when the desired option is highlighted. Supporting switch access requires that all functionality be accessible through sequential navigation.

For SceneItAll, supporting assistive technologies means:

1. **Using semantic structure**: Screen readers understand that Button widgets are clickable. Custom UI widgets with click handlers are invisible to assistive technology unless properly labeled with accessibility attributes.

2. **Providing text alternatives**: Images need `alt` text. Icons need accessible labels. Status conveyed through color needs text equivalents.

3. **Ensuring keyboard operability**: Every action possible with a mouse must also be possible with a keyboard. Focus must be visible and move in a logical order.

4. **Managing focus**: When a dialog opens, focus should move into it. When it closes, focus should return to the element that opened it. Screen reader users who can't see the screen depend on focus management to understand where they are.

5. **Announcing dynamic changes**: When content updates without a page reload (common in modern apps), screen readers need to be notified. Live regions announce changes to users who can't see them happen.

The technical details of implementing accessibility are beyond the scope of this lecture, but the principle is straightforward: **don't assume how users will interact with your software**. Build interfaces that communicate their structure and state through multiple channels, so users can choose the channel that works for them.

## Evaluate the validity of an accessibility evaluation (20 minutes)

Suppose a company claims their software is "fully accessible" or "WCAG compliant." How would you know if that claim is credible? Accessibility evaluations vary enormously in rigor and validity. Some provide genuine assurance that software works for diverse users; others are superficial exercises that miss critical problems.

While designing a comprehensive accessibility evaluation is beyond the scope of this course, you should be able to recognize when an evaluation is likely to be valid—and when it's not.

### Types of Accessibility Evaluation

Accessibility evaluations fall into three broad categories, each with different strengths and limitations:

**Automated Testing**: Software tools that scan code or interfaces for accessibility violations. Examples include axe, WAVE, and Lighthouse.

| Strengths | Limitations |
|-----------|-------------|
| Fast and cheap | Catches only ~30% of accessibility issues |
| Consistent and repeatable | Cannot assess user experience |
| Good for catching obvious errors | May produce false positives |
| Scales to large codebases | Cannot evaluate dynamic or context-dependent behavior |

Automated testing is valuable for catching low-hanging fruit—missing alt text, insufficient color contrast, missing form labels. But passing automated tests does not mean software is accessible. A page could pass every automated check while being completely unusable for a screen reader user due to confusing navigation or poorly structured content.

**Expert Heuristic Evaluation**: Trained evaluators review software against accessibility guidelines (like WCAG's POUR principles) and use assistive technologies to test key workflows.

| Strengths | Limitations |
|-----------|-------------|
| Catches issues automated tools miss | Requires trained evaluators |
| Can assess user experience and workflows | Evaluators may not share users' disabilities |
| Provides actionable recommendations | May miss issues that only emerge with extended use |
| More comprehensive than automated testing | Quality depends heavily on evaluator expertise |

Expert evaluation is more thorough than automated testing, but experts—even those who use assistive technologies themselves—cannot anticipate every way that diverse users will interact with software. An expert might navigate a form successfully using keyboard-only interaction while a user with a different disability or different assistive technology configuration struggles.

**Evaluation with Disabled Users**: Real users with disabilities attempt to complete tasks with the software, while evaluators observe and gather feedback.

| Strengths | Limitations |
|-----------|-------------|
| Reveals actual user experience | Time-consuming and expensive |
| Catches issues experts miss | Requires recruiting participants |
| Provides ground truth about accessibility | Small samples may not represent all users |
| Surfaces unexpected problems | Cannot test every feature or workflow |

Evaluation with disabled users provides the highest-fidelity evidence about accessibility, but it comes with significant challenges—which we'll discuss shortly.

### Challenges of Evaluating with Disabled Users

If evaluation with disabled users provides the best evidence, why isn't it always done? Several factors make it challenging:

**Specific disabilities are rare.** While disability overall is common (~20% of the population), specific conditions are individually rare. Finding enough participants with a particular disability for a statistically meaningful study can be difficult, especially for rare conditions.

**Individual presentation varies.** Two people with "the same" disability may have very different experiences. Blindness exists on a spectrum; motor impairments manifest differently in each person; cognitive disabilities affect individuals in unique ways. A small sample may not capture this variation.

**Populations are overburdened.** Disabled people are frequently asked to participate in research and testing. This creates fatigue and can make recruitment difficult. It also raises ethical questions about whether the burden of improving accessibility falls disproportionately on the people most affected by inaccessibility.

**Standard statistical methods may not apply.** Many evaluation methods assume large, representative samples and normally distributed outcomes. These assumptions often don't hold for accessibility research, requiring alternative approaches like case studies, qualitative analysis, or meta-analysis of existing research.

### What Doesn't Count as Accessibility Evaluation

Some practices that might seem like accessibility evaluation provide little or no valid evidence:

**Compliance checklists without testing**: Marking checkboxes on a WCAG compliance form doesn't demonstrate that software is accessible—only that someone believes specific guidelines were followed. Guidelines can be followed technically while violating their spirit.

**Simulation or empathy exercises**: Valuable for building awareness, but not evidence of accessibility. "We had everyone on the team try using the app blindfolded" tells you how sighted people experience artificial vision loss, not how blind users experience your software.

**Testimonials without methodology**: "A blind user said they could use it" is anecdotal, not evaluation. Without systematic task completion, multiple participants, and consideration of diverse experiences, individual testimonials don't generalize.

### For more information

Consider enrolling in CS 4973: "Accessibility and Disability"