/**
 * TinyRobot SKILL 后处理：压缩文档与 demo 代码以降低 token 占用，
 * 避免文件过大（如 100 行限制），使内容适合作为 AI SKILL 使用。
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

// 根据本脚本路径解析 skill 目录（scripts/tiny-robot-skill-post-process -> skills/tiny-robot-skill）
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..', '..', 'skills', 'tiny-robot-skill');

/** 相对 skill 目录的路径：与组件无关的文档，从 skill 中排除（同步仍会复制，在此删除） */
const EXCLUDED_FILES = ['src/guide/plugin-badge.md'];

/** 仅压缩空白（不解析 AST）。在 esprima 无法解析（如 TypeScript）时使用。 */
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
 * 压缩 .ts 文件。esprima 仅解析 JavaScript；若文件含 TypeScript 语法（类型注解等），
 * 则回退为仅压缩空白，仍能减少 token，并避免在 CI 中静默无操作。
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

/** 合并多余换行并修剪行尾，减少 markdown 的 token 体积 */
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
    // readdir may fail if the directory doesn't exist; log other errors
    const code = err?.code;
    if (code !== 'ENOENT') {
      console.error('Error processing directory', dir, err);
    }
  }
}

async function run() {
  const target = SKILL_DIR;

  // 1. themeConfig.ts：压缩为单行以减 token。走 TS 安全路径：能当 JS 解析则用 AST，否则仅压空白。
  const themeConfigPath = path.join(target, 'themeConfig.ts');
  try {
    await fs.access(themeConfigPath);
    await compressTsWithFallback(themeConfigPath);
  } catch {
    // 文件可能不存在
  }

  // 2. 删除排除的文档（非组件相关；需排除的路径见上方 EXCLUDED_FILES）
  for (const rel of EXCLUDED_FILES) {
    const fullPath = path.join(target, rel);
    try {
      await fs.unlink(fullPath);
      console.log('Removed', fullPath);
    } catch {
      // 文件可能不存在
    }
  }

  // 3. src/：组件文档 markdown 及任意 .js（如 public/sw.js），压缩 .md 与 .js
  const srcDir = path.join(target, 'src');
  await processDirRecursive(srcDir, { md: true, js: true });

  // 4. demos/：删除 .md 和 .spec.ts；仅压缩 .js（esprima 不解析 TypeScript，.ts 保持原样）
  const demosDir = path.join(target, 'demos');
  await processDirRecursive(demosDir, {
    deleteFilter: (name) => name.endsWith('.md') || name.endsWith('.spec.ts'),
    js: true,
  });

  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
