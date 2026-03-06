---
title: TinyRobot Code Generation Rules
impact: HIGH
---

# TinyRobot Code Generation Rules

When generating TinyRobot code, follow these rules.

## Prefer Demo Implementations

Always prefer demo code from:

```
demos/
```

Demo implementations show the correct usage pattern.

## Do Not Invent APIs

Avoid creating:

- new props
- new events
- new slot names

Only use APIs found in:

- component documentation
- demo implementations

## Vue Style

TinyRobot demos use:

```
<script setup>
```

Prefer this style when generating code.

## Error and State Handling

When adding loading or error handling:

- keep the logic minimal and focused on what the user asked for
- follow any existing patterns shown in TinyRobot demos
- avoid introducing complex state machines or unnecessary abstractions

Prefer small, readable examples over fully abstracted production-ready code.

## Code Style Details

When generating TinyRobot examples:

- prefer Vue single-file components (`.vue`) when appropriate
- follow the structure, prop order, and slot usage shown in demos
- keep code short and focused on demonstrating TinyRobot behavior
- write all code comments in **English**
- use the user's language for visible UI text (labels, messages, button text, etc.)

## Streaming Messages

For AI responses:

- Bubble components may render streaming text
- message management may use tools in `tools/message`

Check demos before implementing streaming logic.

## Avoid Overengineering

Generated examples should:

- remain simple
- match demo patterns
- focus on UI behavior
