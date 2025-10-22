---
sidebar_position: 2
---

# Homework 2: Design Patterns in Practice

## Due Date
Monday, February 10, 2026 at 8:00 PM EDT

## Overview

Apply design patterns to build a flexible, extensible notification system. You'll use multiple patterns together to create a well-architected solution.

## Learning Objectives

- Apply design patterns to solve real problems
- Design flexible, extensible systems
- Write code that follows SOLID principles
- Create comprehensive UML diagrams
- Refactor code to improve design

## Project Description

Build a notification system that can:
- Send notifications through multiple channels (Email, SMS, Push)
- Support different notification priorities
- Queue and batch notifications
- Retry failed notifications
- Log all notification attempts

## Required Patterns

### 1. Strategy Pattern (25 points)
Implement different notification strategies for each channel.

### 2. Observer Pattern (25 points)
Allow subscribers to register for specific notification types.

### 3. Factory Pattern (20 points)
Create factories for notification objects and handlers.

### 4. Decorator Pattern (20 points)
Add features like retry logic, logging, and rate limiting.

### 5. Singleton Pattern (10 points)
Implement a NotificationManager as a thread-safe singleton.

## Additional Requirements

- Design must support easy addition of new notification channels
- Include configuration file for notification settings
- Implement proper error handling and logging
- Write comprehensive unit and integration tests
- Create UML class diagrams for your design

## Submission

1. Push code to GitHub repository
2. Submit a design document (PDF) explaining your architecture
3. Include UML diagrams
4. Submit repository URL and PDF on Canvas

## Grading Rubric

- **Design Quality (35%)**: Appropriate pattern usage, SOLID principles
- **Implementation (35%)**: Working code, proper error handling
- **Testing (15%)**: Comprehensive test coverage
- **Documentation (15%)**: UML diagrams, code comments, design document

## Extra Credit (10 points)

Implement a real integration with an email service (SendGrid, Mailgun, etc.)

