/**
 * TinyRobot SKILL 后处理：
 * 在同步文档到 `skills/tiny-robot-skill` 后，
 * 对文档和 demo 代码进行压缩，减少 token 占用，
 * 让内容更适合 AI SKILL 场景。
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

// 根据当前脚本路径解析 skill 目录：
// scripts/tiny-robot-skill-post-process -> skills/tiny-robot-skill
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..', '..', 'skills', 'tiny-robot-skill');

/**
 * 相对 SKILL_DIR 的路径。
 * 某些非组件文档在同步时仍会被复制，在此步骤中删除。
 */
const EXCLUDED_FILES = ['guide/plugin-badge.md'];
const DOC_DIRS = ['components', 'examples', 'guide', 'migration', 'tools'];

/** AST 无法解析时，回退为仅压缩空白。 */
function minifyWhitespaceOnly(content: string): string {
  return content
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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

/**
 * 压缩 .ts 文件（带回退）。
 * Esprima 只支持 JavaScript；遇到 TS 语法时回退为仅压缩空白。
 */
async function compressTsWithFallback(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    try {
      const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });
      const compact = escodegen.generate(ast, { format: { compact: true } });
      await fs.writeFile(filePath, compact, 'utf8');
      console.log('Compressed (AST)', filePath);
    } catch {
      const minified = minifyWhitespaceOnly(content);
      await fs.writeFile(filePath, minified, 'utf8');
      console.log('Compressed (whitespace-only; file has TS syntax)', filePath);
    }
  } catch (err) {
    console.error('Failed to compress', filePath, err);
  }
}

/** 合并多余空行并裁剪 markdown 行尾空白。 */
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
    ts?: boolean;
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
      if (options.ts && e.name.endsWith('.ts')) {
        await compressTsWithFallback(full);
      }
    }
  } catch (err) {
    // 目录可能不存在，仅记录非 ENOENT 的异常。
    const code = err?.code;
    if (code !== 'ENOENT') {
      console.error('Error processing directory', dir, err);
    }
  }
}

async function run() {
  const target = SKILL_DIR;

  // 1) 删除排除文档（路径见 EXCLUDED_FILES）。
  for (const rel of EXCLUDED_FILES) {
    const fullPath = path.join(target, rel);
    try {
      await fs.unlink(fullPath);
      console.log('Removed', fullPath);
    } catch {
      // 在某些同步状态下，文件可能不存在。
    }
  }

  // 2) 处理文档目录：递归压缩 .md 和 .js。
  for (const docDir of DOC_DIRS) {
    await processDirRecursive(path.join(target, docDir), { md: true, js: true });
  }

  // 3) 处理 demos/：删除 .md 和 .spec.ts；压缩 .js 与 .ts。
  const demosDir = path.join(target, 'demos');
  await processDirRecursive(demosDir, {
    deleteFilter: (name) => name.endsWith('.md') || name.endsWith('.spec.ts'),
    js: true,
    ts: true,
  });

  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
