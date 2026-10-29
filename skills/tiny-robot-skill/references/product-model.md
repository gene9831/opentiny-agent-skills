# TinyRobot product model

## Outcome

Assign each application responsibility to one TinyRobot layer before choosing individual APIs.

## Package ownership

| Layer | Package | Owns | Does not own |
| --- | --- | --- | --- |
| Chat suite | `@opentiny/tiny-robot-chat` | Complete chat page/UI, Chat Runtime wiring, conversation/message/composer integration | The application's authentication, authorization, durable backend, or secret storage |
| UI components | `@opentiny/tiny-robot` | Reusable chat UI regions such as Layout, Bubble, Sender, History, ModelSelector, and extension UI | Model requests, durable extension installation, or application data persistence |
| State toolkit | `@opentiny/tiny-robot-kit` | Message/request state, response consumption, tool-call coordination, conversations, and storage strategies | Rendering the application's UI |

`@opentiny/tiny-robot-chat` composes the other concerns into a product-level chat experience. Its presence is not interchangeable with the components package.

## State ownership

- `TrChat` receives a Chat Runtime; `useChatRuntime` is the default owner of its chat behavior.
- `TrChatUI` receives display state and callbacks from the application when the application already owns the data layer.
- `useMessage` owns one message flow and request state. Tool execution, approval, permissions, and side effects remain application responsibilities.
- `useConversation` owns a collection of conversations and one message engine per conversation. A configured storage strategy persists them.
- UI components may keep local presentation state documented for that component. Events do not imply that the component persisted or mutated the application's source data.

## Extension architecture

`ExtensionManager` is the generic browse/filter/section/action surface. MCP and Skill form/detail components provide specialized UI. The host application loads and normalizes extension data, handles install/uninstall/enable/disable/navigation events, persists results, and hosts forms/details in its chosen page, Dialog, or Drawer.

Read `references/docs/best-practices/extension-manager-integration.md` for the documented composition.

## 1.0 replacements

- `Container` is deprecated: use `Layout` for new page, embedded, or floating layouts.
- `McpServerPicker` is deprecated: use `ExtensionManager` plus the required MCP/Skill specialized components and application-owned operations.

Use the migration documents for behavior mapping; do not perform a name-only replacement.
