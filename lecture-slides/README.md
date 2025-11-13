# Lecture Slides

This directory contains RevealJS presentations for CS 3100 lectures.

## Creating a New Presentation

1. Create a new `.mdx` file in this directory
2. Import the RevealJS components
3. Use the `RevealJS` wrapper with `Slide` components

### Example

```mdx
---
sidebar_position: 3
title: My Presentation
---

import RevealJS, { Slide } from '@site/src/components/RevealJS';

<RevealJS theme="white" transition="slide">
  <Slide>
    <h1>Title Slide</h1>
    <p>Welcome to my presentation</p>
  </Slide>
  
  <Slide>
    <h2>Content Slide</h2>
    <ul>
      <li>Point 1</li>
      <li>Point 2</li>
      <li>Point 3</li>
    </ul>
  </Slide>
</RevealJS>
```

## Configuration Options

### RevealJS Component Props

- `theme`: Presentation theme (`white`, `black`, `league`, `beige`, `sky`, `night`, `serif`, `simple`, `solarized`, `blood`, `moon`)
- `transition`: Slide transition (`none`, `fade`, `slide`, `convex`, `concave`, `zoom`)
- `controls`: Show navigation controls (default: `true`)
- `progress`: Show progress bar (default: `true`)
- `center`: Center slides vertically (default: `true`)
- `touch`: Enable touch navigation (default: `true`)
- `loop`: Loop presentation (default: `false`)
- `keyboard`: Enable keyboard navigation (default: `true`)
- `overview`: Enable overview mode (default: `true`)
- `hash`: Enable hash-based navigation (default: `true`)

### Slide Component Props

- `className`: Additional CSS classes for the slide

## Navigation

- **Arrow keys**: Navigate slides (← → ↑ ↓)
- **Space**: Next slide
- **ESC**: Overview mode
- **Touch gestures**: Navigate on mobile devices

## Features

- Full-screen presentations
- Math support (LaTeX via KaTeX)
- Code syntax highlighting
- Multiple themes
- Smooth transitions
- Responsive design

