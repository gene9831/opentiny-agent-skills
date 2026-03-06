---
title: TinyRobot Component Lookup Rules
impact: HIGH
---

# TinyRobot Component Lookup Rules

This document defines how AI agents should locate and understand TinyRobot components.

Always follow the lookup workflow below when generating TinyRobot component code.

---

## Step 1 — Identify the Component

Locate available components by inspecting the markdown files under:

```

components/

```

Each file name (without extension) is the **component key**.

Examples:

```

components/bubble.md   → component key: bubble
components/sender.md   → component key: sender
components/container.md → component key: container

```

The component key is used to locate both documentation and demo implementations.

---

## Step 2 — Read Component Documentation

Component documentation is located in:

```

components/<component-key>.md

```

Examples:

```

components/bubble.md
components/sender.md
components/prompts.md

```

Documentation usually contains:

- component description
- props
- slots
- usage examples
- API constraints

Always use documented APIs when generating code.

---

## Step 3 — Locate Demo Implementations

Demo code is stored in:

```

demos/<component-key>/

```

Examples:

```

demos/bubble/basic.vue
demos/bubble/streaming.vue
demos/sender/word-limit.vue
demos/prompts/basic.vue

```

Demos provide **working Vue implementations** and represent the recommended usage patterns.

---

## Step 4 — Follow Demo and Example Patterns

When generating TinyRobot code:

- follow the structure used in demos
- reuse props shown in demos
- reuse slots demonstrated in demos
- prefer minimal and working examples

Do **not invent**:

- component props
- slot names
- events
- usage patterns

Only use APIs confirmed in documentation or demos.

For full chat layouts or multi-component pages, also inspect:

```
examples/
```

for higher-level usage patterns and page compositions.

---

## Additional Notes

Documentation files may reference demos using the following syntax:

```

<demo vue="../demos/bubble/basic.vue"/>
```

These paths refer to files inside the `demos/` directory.

When such references appear, always inspect the corresponding demo file to understand the real implementation.

---

## Component Composition

When composing multiple TinyRobot components (for example `container`, `bubble`, `sender`, and `prompts`) into a full chat UI:

- first look for existing combinations in `examples/` or component-specific demos
- follow the layout and nesting patterns used in those examples
- avoid inventing new layout patterns unless clearly requested by the user

If no suitable example exists, keep the composition simple and explain any assumptions in natural language.

---

## Missing Components

If the user asks for a component whose key cannot be found under `components/`:

- do **not** invent a new TinyRobot component
- tell the user that this component does not exist in the TinyRobot documentation
- suggest the closest existing components when appropriate (for example `bubble`, `sender`, `container`, `prompts`)

Always be explicit about uncertainty instead of guessing component names or APIs.
