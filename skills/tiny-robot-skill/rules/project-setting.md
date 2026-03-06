---
title: TinyRobot Project Setup
impact: HIGH
---

# TinyRobot Project Setup

This document explains how the TinyRobot documentation project is structured.

The documentation is built using **VitePress**.

## Guide Documentation

Project setup and configuration are documented in:

```
guide/
```

Important files:

```
guide/quick-start.md
guide/theme-config.md
guide/update-log.md
```

These files describe:

- installation
- component import
- theme configuration

## Example Applications

Complete UI examples are located in:

```
examples/
```

Example:

```
examples/assistant.md
```

These show how multiple components work together.

# Utilities

TinyRobot provides helper utilities documented in:

```
tools/
```

Examples:

```
tools/message.md
tools/conversation.md
tools/utils.md
```

These utilities help manage:

- AI messages
- conversations
- model requests (via the current recommended APIs in message and conversation tools)

---

## Docs Project vs User Project

The TinyRobot documentation project is built with **VitePress** and its file structure (for example `guide/`, `examples/`, `tools/`) may not match the structure of a user's own application.

When a user asks how to integrate TinyRobot into their project:

- read `guide/quick-start.md` and adapt the steps to the user's framework or build setup
- do not assume that the user's project is a VitePress site
- apply only the relevant configuration and import steps to the user's context

## Common Questions and Where to Look

Use the following mapping to locate the right documentation quickly:

- installation or first-time setup → `guide/quick-start.md`
- theme, appearance, and style configuration → `guide/theme-config.md`
- message and conversation state management → `tools/message.md` and `tools/conversation.md`
- how to call AI models or backends → use the patterns documented in `tools/message.md` and `tools/conversation.md` (for example `useMessage` + `responseProvider`)
