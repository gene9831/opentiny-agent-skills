---
name: tiny-robot-skill
description: TinyRobot component library **code generation** and **implementation guidance**. Use when analyzing, planning, or generating TinyRobot (AI chat UI) components. This skill provides API constraints, doc/example lookup flow, and code conventions.
license: MIT
metadata:
  author: opentiny
  version: '1.0.0'
---

# TinyRobot Component Library Assistant

This skill helps generate **correct TinyRobot UI code** by providing:

- component documentation
- demo implementations
- project configuration guides
- code generation rules

TinyRobot is a Vue-based component library designed for **AI chat interfaces**.

Typical UI includes:

- chat container
- message bubbles
- message input
- suggestion prompts
- welcome screens

## When to use

Use this skill when the user:

- builds an AI chat UI
- uses TinyRobot components
- asks for TinyRobot examples
- needs TinyRobot project setup
- wants demo implementations

Example requests:

- "Create a chat UI using TinyRobot"
- "How to use Bubble component"
- "Show Sender example"
- "How to configure TinyRobot theme"

## When NOT to use

Avoid using this skill when:

- the project is **not a Vue-based UI**
- the user does **not** mention TinyRobot and there is **no** TinyRobot docs or components in the current repo
- the user only asks for **general AI UX/product design** without needing concrete TinyRobot components or code

## Skill Resources

Main documentation directories:

```
components/
demos/
guide/
migration/
tools/
examples/
```

Rules:

```
rules/component-use.md
rules/project-setting.md
rules/code-generation.md
rules/tool-use.md
```

## Recommended Workflow

When generating TinyRobot code, follow this order.

### 1 Identify component

Identify which TinyRobot component the user needs.
The full component list and supported features are defined by the markdown files under:

```
components/
```

### 2 Read component documentation

Load documentation from:

```
components/<component>.md
```

The `<component>` part is the component key (for example `bubble`, `sender`).

### 3 Check demo implementations

Find examples in:

```
demos/<component>/
```

Always prefer demos when generating code.

### 4 Check full examples

For complete chat layouts or multi-component pages, read:

```
examples/
```

Example:

```
examples/assistant.md
```

These examples show how multiple components and utilities work together in real UI pages.

### 4 Follow code generation rules

Read:

```
rules/code-generation.md

```

to ensure the generated code follows TinyRobot patterns.

### 5 Check project configuration and utilities

If the user asks about setup or theme configuration, read:

```
rules/project-setting.md
```

If the user asks about message/conversation management or AI client utilities, read:

```
tools/
```

For detailed rules on how to safely use TinyRobot tools (message, conversation, AI client, and utils) in generated code, read:

```
rules/tool-use.md
```

## Important Principles

When generating TinyRobot code:

Prefer:

- demo implementations
- real component APIs
- simple component composition

Avoid:

- inventing component props
- guessing slot names
- creating components not listed in the component index
