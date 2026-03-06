---
title: TinyRobot Tool Usage Rules
impact: HIGH
---

# TinyRobot Tool Usage Rules

This document defines how AI agents should use TinyRobot tools such as message and conversation utilities.

Always follow the workflow below when generating code that interacts with TinyRobot tools.

---

## Step 1 — Identify the Question Type

Before using any tool, classify the user's request:

- **UI-only**: the user only needs component layout or styling (for example "create a chat layout with Bubble and Sender").
- **Message state**: the user asks about adding, updating, or managing chat messages.
- **Conversation state**: the user asks about sessions, histories, or multi-turn conversations.
- **AI requests**: the user asks how to call AI models or backends from TinyRobot UI.

Only use TinyRobot tools when the request involves **message or conversation logic**, or when they are clearly required by TinyRobot docs. For pure UI questions, follow the component rules without introducing tools.

---

## Step 2 — Locate Tool Documentation

Tool documentation is located under:

```
tools/
```

Important files:

```
tools/message.md
tools/conversation.md
tools/utils.md
```

Use the question type to choose the right docs:

- message state → `tools/message.md`
- conversation state → `tools/conversation.md`
- shared helpers → `tools/utils.md`

Always read the relevant tool documentation before generating code.

---

## Step 3 — Inspect Examples That Use Tools

When tool documentation or component docs reference demos or examples, follow those links and inspect the real code:

- search for demos or examples that import TinyRobot tools
- copy the overall usage pattern (imports, function calls, data structures)
- keep your generated code consistent with those patterns

Prefer existing usage in demos and examples over inventing new integration patterns.

---

## Step 4 — Generate Code Following Existing APIs

When generating code that uses TinyRobot tools:

- **only** use functions, types, and fields explicitly documented in `tools/*.md` or shown in demos/examples
- keep the integration surface minimal and focused on the user's request
- reuse existing helpers instead of reimplementing similar logic
- keep examples small, readable, and easy to adapt

Do **not**:

- invent new tool functions or methods
- invent new fields on message or conversation objects
- guess enum values, status codes, or request/response shapes
- change the meaning of existing tool APIs

If something is not documented, treat it as unavailable.

---

## Step 5 — Keep Responsibilities Clear

When combining tools with TinyRobot components:

- let components handle **rendering and UI interactions**
- let tools handle **message data and conversation state**
- avoid mixing unrelated responsibilities in a single example

Examples should show a clear separation between:

- UI components (such as `container`, `bubble`, `sender`, `prompts`)
- data and state helpers from `tools/`

---

## Uncertain or Missing APIs

If you are unsure how a tool works, or if the required API is not documented:

- explain the uncertainty in natural language
- avoid guessing function names, parameters, or data shapes
- suggest that the user check or extend their TinyRobot tool layer explicitly

It is always better to acknowledge missing APIs than to generate incorrect tool usage.

