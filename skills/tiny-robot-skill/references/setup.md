# Application setup

## Outcome

Integrate the selected TinyRobot layer into the consumer's existing Vue application without assuming the documentation site's build setup.

## Evidence to load

1. Consumer `package.json`, lockfile, entry file, bundler config, and installed package metadata.
2. `component-index.json` entries for the selected layer.
3. `references/docs/suites/quick-start.md` for Chat, or `references/docs/guide/quick-start.md` for base components.
4. `references/docs/guide/theme-config.md` only when theme setup is requested.

## Procedure

1. Confirm Vue and Node requirements from the formal quick start.
2. Determine which packages required by the task are installed; recommend adding only the missing selected package(s).
3. Keep required TinyRobot packages on a compatible `1.0.x` line. Do not silently update the consumer.
4. Import styles documented by the selected layer. A Chat setup normally needs both component and Chat styles; a component-only setup does not gain Chat exports.
5. Adapt imports to the consumer's entry and bundler. Do not copy VitePress-only syntax or aliases.
6. For complete Chat, begin with the formal `TrChat` + runtime example before adding customization.
7. Keep production API keys out of browser code; use the application's server-side proxy or credential boundary.

## Output

Provide the detected state, dependency delta, exact imports/styles, the smallest integration change, and a verification command appropriate to the consumer repository.

Stop when a required version or installed export cannot be confirmed. Report the missing evidence instead of guessing.
