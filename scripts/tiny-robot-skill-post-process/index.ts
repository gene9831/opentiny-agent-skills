/**
 * TinyRobot SKILL post-process: compress docs and demo code to reduce token usage
 * and avoid oversized files (e.g. 100-line limits), making content suitable for AI SKILL.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

// Resolve skill dir from this script's location (scripts/tiny-robot-skill-post-process -> skills/tiny-robot-skill)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..', '..', 'skills', 'tiny-robot-skill');

/** Paths relative to skill dir: docs not related to components, excluded from skill (sync still copies them; we remove here) */
const EXCLUDED_FILES = ['src/guide/plugin-badge.md'];

async function compressJsOrTs(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });
    const compact = escodegen.generate(ast, { format: { compact: true } });
    await fs.writeFile(filePath, compact, 'utf8');
    console.log('Compressed', filePath);
  } catch (err) {
    console.error('Failed to compress', filePath, err);
  }
}

/** Collapse excessive newlines and trim lines to reduce markdown token size */
function compressMarkdownContent(content: string): string {
  const lines = content.split('\n').map((line) => line.trimEnd());
  const joined = lines.join('\n');
  return joined.replace(/\n{3,}/g, '\n\n').trim();
}

async function compressMarkdownFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const out = compressMarkdownContent(content);
    await fs.writeFile(filePath, out, 'utf8');
    console.log('Compressed MD', filePath);
  } catch (err) {
    console.error('Failed to compress MD', filePath, err);
  }
}

async function processDirRecursive(
  dir: string,
  options: {
    md?: boolean;
    js?: boolean;
    deleteFilter?: (name: string) => boolean;
  }
) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await processDirRecursive(full, options);
        continue;
      }
      if (!e.isFile()) continue;
      if (options.deleteFilter?.(e.name)) {
        await fs.unlink(full);
        console.log('Deleted', full);
        continue;
      }
      if (options.md && e.name.endsWith('.md')) {
        await compressMarkdownFile(full);
      }
      if (options.js && e.name.endsWith('.js')) {
        await compressJsOrTs(full);
      }
    }
  } catch (err) {
    // ignore missing dirs
  }
}

async function process() {
  const target = SKILL_DIR;

  // 1. themeConfig.ts: compress to single line (reduce tokens)
  const themeConfigPath = path.join(target, 'themeConfig.ts');
  try {
    await fs.access(themeConfigPath);
    await compressJsOrTs(themeConfigPath);
  } catch {
    // file may not exist
  }

  // 2. Remove excluded docs (not component-related; add paths to EXCLUDED_FILES above)
  for (const rel of EXCLUDED_FILES) {
    const fullPath = path.join(target, rel);
    try {
      await fs.unlink(fullPath);
      console.log('Removed', fullPath);
    } catch {
      // file may not exist
    }
  }

  // 3. src/: component/docs markdown + any .js (e.g. public/sw.js). Compress .md and .js
  const srcDir = path.join(target, 'src');
  await processDirRecursive(srcDir, { md: true, js: true });

  // 4. demos/: remove .md and .spec.ts; compress .js only (esprima does not parse TypeScript, so .ts are left as-is)
  const demosDir = path.join(target, 'demos');
  await processDirRecursive(demosDir, {
    deleteFilter: (name) => name.endsWith('.md') || name.endsWith('.spec.ts'),
    js: true,
  });

  console.log('Done.');
}

process().catch((err) => {
  console.error(err);
  process.exit(1);
});
