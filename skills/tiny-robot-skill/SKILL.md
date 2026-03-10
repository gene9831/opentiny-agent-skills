---
name: tiny-robot-skill
description: Guides TinyRobot Vue AI chat UI implementation, setup, and code generation. Use when the user mentions TinyRobot, OpenTiny TinyRobot, Bubble, Sender, Prompts, chat container, message list, conversation tools, or asks to build chat interfaces with TinyRobot components.
license: MIT
metadata:
  author: opentiny
  version: '1.0.0'
---

# TinyRobot Component Library Assistant

Use this skill to produce accurate TinyRobot guidance and code with the smallest necessary context.

TinyRobot is a Vue-oriented component library for AI chat interfaces.

## When to use this skill

Use this skill when the user:

- explicitly mentions TinyRobot or OpenTiny TinyRobot
- asks about `Bubble`, `Sender`, `Prompts`, chat containers, or similar TinyRobot components
- asks for TinyRobot component usage or examples
- wants to build an AI chat UI with TinyRobot
- needs TinyRobot setup, import, or theme guidance
- asks about TinyRobot message, conversation, or AI request integration

Example requests:

- "Create a chat UI using TinyRobot"
- "How do I use the Bubble component?"
- "Show a Sender example"
- "How do I configure TinyRobot theme?"
- "How should I manage conversation state with TinyRobot?"

## When not to use this skill

Do not use this skill when:

- the task is not related to TinyRobot
- the user only wants generic AI UX advice without TinyRobot code
- the project is not using Vue and the user does not want TinyRobot-specific adaptation

## Quick Routing

Start by classifying the request, then read only the relevant rule file.

| Request type                               | Read first                 | Use for                                                                |
| ------------------------------------------ | -------------------------- | ---------------------------------------------------------------------- |
| Component usage or page composition        | `rules/component-use.md`   | Component lookup, composition, demos, missing component handling       |
| Project setup or theme configuration       | `rules/project-setting.md` | Installation, integration, theme, adapting docs setup to user projects |
| Code generation                            | `rules/code-generation.md` | Output style, Vue SFC conventions, simplicity, comment language        |
| Message, conversation, or AI request logic | `rules/tool-use.md`        | Safe tool usage, state separation, API uncertainty handling            |

For most implementation tasks, read `rules/code-generation.md` after the task-specific rule file.

## Resources in This Skill

This skill is organized around these resource layers:

- `components/` for component documentation
- `demos/` for working component demos
- `examples/` for full page or multi-component usage
- `guide/` for setup and configuration guidance
- `tools/` for message, conversation, and helper utilities
- `migration/` for version migration notes when relevant
- `rules/component-use.md`
- `rules/project-setting.md`
- `rules/code-generation.md`
- `rules/tool-use.md`

Use the smallest relevant layer first, then expand only when the task needs more context.

## Execution Rules

Follow this order:

1. use the routing table above to pick the minimum relevant rule files
2. read the matching source files before generating code
3. prefer this skill's docs and demos first, then existing TinyRobot usage in the user's project
4. use only confirmed props, slots, events, functions, and patterns

If the relevant files are missing or do not document the requested API:

- do not guess
- do not invent new TinyRobot APIs
- explain what is missing
- offer the closest documented alternative when possible

## Output Principles

- prefer existing demos or in-repo usage over invented patterns
- prefer small Vue single-file component examples
- prefer `<script setup>` unless the user's project clearly uses another style
- write code comments in English
- keep visible UI text in the user's language when appropriate
- keep examples minimal and directly runnable
- separate UI rendering from message or conversation state logic
- avoid overengineering or abstract wrappers
- stay aligned with the user's requested scope
