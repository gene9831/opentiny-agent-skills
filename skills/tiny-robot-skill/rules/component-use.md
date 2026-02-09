---
title: TinyRobot component usage
impact: HIGH
tags: TinyRobot component index, API docs, demo code
---

# TinyRobot component usage

## Component index

Component list is in [themeConfig.ts](../themeConfig.ts) from the source repo. The `sharedSidebarItems` array has groups: 指南 (guide), 组件 (components), 工具 (tools). Each group has `text` (e.g. "组件") and `items`: `{ text: 'Bubble 气泡', link: 'bubble' }`. Use `link` as the **key** to find the component folder under `demos/` (e.g. `demos/bubble/`).

Example (from themeConfig.ts):

```
{
  text: '组件',
  base: '/components/',
  items: [
    { text: 'Bubble 气泡', link: 'bubble' },
    { text: 'Sender 消息输入框', link: 'sender' }
  ]
}
```

Use `item.link` as the demo folder name under `../demos/` and the component doc under `../src/components/{link}.md`.

## Component docs (src/)

Component markdown docs are under `../src/`:

- **Component API/usage**: `../src/components/{link}.md` (e.g. `bubble.md` for link `bubble`). Contains props, events, slots, examples.
- **Guide**: `../src/guide/` (quick-start.md, theme-config.md, update-log.md).
- **Tools**: `../src/tools/` (ai-client.md, message.md, conversation.md, utils.md).
- **Examples / migration**: `../src/examples/`, `../src/migration/`.

## Demo index (demos/)

Under `../demos`, each folder is one component’s demos:

- `{link}/` – folder for component (e.g. `bubble/`, `sender/`)
- Inside: demo sources (`.vue`, `.ts`, `.js`; post-process removes `.md` and `.spec.ts`)

Look up demos by component `link` from themeConfig.ts sharedSidebarItems, then open the matching folder under `demos/`.

## Lookup order (do not skip)

1. **Component name** – Resolve from `../themeConfig.ts` (sharedSidebarItems, items[].link).
2. **Component doc** – In `../src/components/{link}.md` for API/usage; `../src/guide/` for project setup.
3. **Demos** – In `../demos/{link}/` and use file names to find example source.

### Rules

1. Always correlate by component name/key; do not guess from other libraries.
2. Prefer Chinese descriptions in props/docs when available; ignore en-US-only text when zh-CN exists.
3. If a prop or example is missing, do not invent or substitute.
4. On errors, do not guess; report or ask.
