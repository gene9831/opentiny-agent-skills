import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { validateTinyRobotSkill } from './validate'

async function write(root: string, relativePath: string, content: string) {
  const target = path.join(root, relativePath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content)
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tiny-robot-skill-validate-'))
  const skillRoot = path.join(root, 'skills/tiny-robot-skill')
  const marketplacePath = path.join(root, '.claude-plugin/marketplace.json')
  const index = {
    schemaVersion: 1,
    tinyRobotVersion: '1.0.x',
    source: { ref: 'release/v1.0.x', commit: 'abc123' },
    entries: [
      {
        id: 'layout',
        names: ['Layout', 'TrLayout'],
        package: '@opentiny/tiny-robot',
        kind: 'component',
        status: 'stable',
        proactive: true,
        scenes: ['布局'],
        doc: 'references/docs/components/layout.md',
        demos: ['examples/demos/layout/basic.vue'],
        exports: ['TrLayout'],
      },
      {
        id: 'container',
        names: ['Container', 'TrContainer'],
        package: '@opentiny/tiny-robot',
        kind: 'component',
        status: 'deprecated',
        proactive: true,
        scenes: ['旧布局'],
        doc: 'references/docs/components/container.md',
        demos: [],
        replacedBy: ['layout'],
      },
    ],
  }

  await write(skillRoot, 'component-index.json', `${JSON.stringify(index, null, 2)}\n`)
  await write(
    skillRoot,
    'references/docs/.snapshot.json',
    `${JSON.stringify({ tinyRobotVersion: '1.0.x', source: index.source, documents: 2, demos: 1 }, null, 2)}\n`,
  )
  await write(skillRoot, 'references/docs/components/layout.md', '# Layout\n')
  await write(skillRoot, 'references/docs/components/container.md', '# Container\n')
  await write(skillRoot, 'examples/demos/layout/basic.vue', '<template />\n')
  await write(
    skillRoot,
    'SKILL.md',
    "---\nname: tiny-robot-skill\ndescription: Use when building TinyRobot applications.\nmetadata:\n  version: '1.0.0'\n---\n",
  )
  await write(skillRoot, '.claude-plugin/plugin.json', '{"name":"tiny-robot-skill","version":"1.0.0"}\n')
  await write(
    root,
    '.claude-plugin/marketplace.json',
    '{"plugins":[{"name":"tiny-robot-skill","source":"./skills/tiny-robot-skill","version":"1.0.0"}]}\n',
  )

  return { root, skillRoot, marketplacePath, index }
}

async function overwriteIndex(skillRoot: string, update: (index: any) => void) {
  const target = path.join(skillRoot, 'component-index.json')
  const index = JSON.parse(await readFile(target, 'utf8'))
  update(index)
  await writeFile(target, `${JSON.stringify(index, null, 2)}\n`)
}

test('accepts a complete snapshot with aligned release metadata', async () => {
  const { skillRoot, marketplacePath } = await createFixture()
  assert.deepEqual(await validateTinyRobotSkill({ skillRoot, marketplacePath, scope: 'full' }), [])
})

test('reports missing docs and demos', async () => {
  const { skillRoot, marketplacePath } = await createFixture()
  await overwriteIndex(skillRoot, (index) => {
    index.entries[0].doc = 'references/docs/components/missing.md'
    index.entries[0].demos = ['examples/demos/layout/missing.vue']
  })

  const issues = await validateTinyRobotSkill({ skillRoot, marketplacePath, scope: 'snapshot' })
  assert.deepEqual(
    issues.map((issue) => issue.code),
    ['missing-doc', 'missing-demo'],
  )
})

test('reports duplicate aliases, invalid statuses, and invalid deprecated entries', async () => {
  const { skillRoot, marketplacePath } = await createFixture()
  await overwriteIndex(skillRoot, (index) => {
    index.entries[0].names.push('TrLayout')
    index.entries[0].status = 'experimental'
    delete index.entries[1].replacedBy
  })

  const issues = await validateTinyRobotSkill({ skillRoot, marketplacePath, scope: 'snapshot' })
  assert.deepEqual(
    issues.map((issue) => issue.code),
    ['duplicate-alias', 'invalid-status', 'deprecated-without-replacement'],
  )
})

test('reports proactive entries without formal docs and provenance mismatches', async () => {
  const { skillRoot, marketplacePath } = await createFixture()
  await overwriteIndex(skillRoot, (index) => {
    index.entries[0].doc = 'references/notes/layout.md'
  })
  await write(skillRoot, 'references/notes/layout.md', '# note only\n')
  const snapshotPath = path.join(skillRoot, 'references/docs/.snapshot.json')
  const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'))
  snapshot.source.commit = 'different'
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)

  const issues = await validateTinyRobotSkill({ skillRoot, marketplacePath, scope: 'snapshot' })
  assert.deepEqual(
    issues.map((issue) => issue.code),
    ['proactive-undocumented', 'source-commit-mismatch'],
  )
})

test('reports inconsistent skill, plugin, and marketplace versions only in full scope', async () => {
  const { skillRoot, marketplacePath } = await createFixture()
  await write(skillRoot, '.claude-plugin/plugin.json', '{"name":"tiny-robot-skill","version":"0.1.0"}\n')
  await write(
    path.dirname(path.dirname(marketplacePath)),
    '.claude-plugin/marketplace.json',
    '{"plugins":[{"name":"tiny-robot-skill","source":"./skills/tiny-robot-skill","version":"0.2.0"}]}\n',
  )

  assert.deepEqual(await validateTinyRobotSkill({ skillRoot, marketplacePath, scope: 'snapshot' }), [])
  const issues = await validateTinyRobotSkill({ skillRoot, marketplacePath, scope: 'full' })
  assert.deepEqual(issues.map((issue) => issue.code), ['version-mismatch'])
})
