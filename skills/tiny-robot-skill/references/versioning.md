# Versioning and migration

## Outcome

Keep distribution version, documentation compatibility, snapshot provenance, and consumer dependencies distinct.

## Four version facts

| Fact | Source | Meaning |
| --- | --- | --- |
| Skill release | `SKILL.md`, plugin metadata, marketplace entry | Version of this packaged agent skill |
| Snapshot compatibility | `component-index.json.tinyRobotVersion` | TinyRobot release line the guidance targets (`1.0.x`) |
| Snapshot provenance | `component-index.json.source` and `references/docs/.snapshot.json` | Exact TinyRobot ref and commit used to generate bundled docs/demos |
| Consumer version | consumer manifest, lockfile, installed package metadata | API actually available to the application |

Never use the Skill release number as proof of a consumer API.

## Compatibility procedure

1. Identify packages required by the requested feature, then read their resolved versions. Ignore a stale root manifest range when installed/lockfile evidence is available.
2. Report missing packages separately from version mismatches.
3. If required installed TinyRobot packages use different release lines, report all versions and align or verify published peer/dependency compatibility before target-version-sensitive code generation.
4. If the consumer is not on `1.0.x`, use installed declarations and matching migration/release material; do not apply this snapshot as exact source-version API evidence.
5. For an explicit migration, analyze the old source and provide the documented 1.0 mapping. Delay only target code that depends on uninstalled or unverified target APIs.
6. If the consumer is on a newer 1.0 commit than the snapshot, use installed declarations for exact signatures and report any drift.

## 0.5 to 1.0 migration

Read the relevant files under `references/docs/migration/` before editing. For the two 1.0 deprecations:

- map Container layout mode, visibility, sidebars, and host behavior to Layout rather than renaming the tag;
- map McpServerPicker data and operations to ExtensionManager tabs/items/actions, specialized MCP UI, and application-owned host/persistence behavior.

## Stopping condition and output

Do not generate target-version-sensitive code while required target compatibility is unresolved. Return the detected matrix, snapshot provenance, missing dependencies versus mismatches, required alignment/evidence, and migration docs. Once aligned, resume with installed public declarations as final authority.
