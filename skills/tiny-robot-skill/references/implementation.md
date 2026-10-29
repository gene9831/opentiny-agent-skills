# Application implementation

## Outcome

Produce application code whose imports and behavior are supported by the consumer's installed TinyRobot version and formal 1.0 evidence.

## Evidence order

1. Consumer code and installed package versions.
2. Matching entry in `component-index.json`.
3. Entry `doc`, then only the relevant listed `demos`.
4. Installed root exports and type declarations for exact names and signatures.

## Workflow

1. Use `selection.md` to choose Chat, UI components, or Kit.
2. List the public imports and contracts the change requires.
3. Verify every prop, event, slot, method, option, and type in the evidence order.
4. Reuse the closest documented demo structure, adapting business data rather than copying documentation-site wrappers.
5. Keep data ownership visible: props flow into UI; emitted actions update application state; asynchronous failures have an observable path.
6. Preserve the consumer's language, framework, formatting, tests, and component conventions.
7. Run its focused typecheck/test/build command.

## Code boundaries

- Prefer Chat `ui` options and slots for local customization of a complete chat page.
- Use `Layout` for new layout code.
- Treat ExtensionManager action events as requests for the application to update data; do not assume automatic mutation or persistence.
- Use `useMessage` with a documented `responseProvider` for a single flow. Use `useConversation` when conversation lifecycle or persistence is required.
- Do not invent convenience wrappers, default values, or undocumented two-way bindings.
- A demo proves the pattern shown, not unrelated APIs.

## Output

Name the chosen package/layer and evidence, implement the smallest coherent change, and report validation results. If an API remains unconfirmed, omit that code and state the unresolved contract.
