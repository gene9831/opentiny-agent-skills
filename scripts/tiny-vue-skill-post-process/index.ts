import fs from 'fs/promises';
import path from 'path';
import * as esprima from 'esprima';
import * as estraverse from 'estraverse';
import * as escodegen from 'escodegen';

async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function compressFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    // use AST-based compression
    const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });
    // attach comments (preserve but we will drop them in generation)
    const compact = escodegen.generate(ast, { format: { compact: true } });
    await fs.writeFile(filePath, compact, 'utf8');
    console.log('Compressed', filePath);
  } catch (err) {
    console.error('Failed to compress', filePath, err);
  }
}

async function compressJsRecursive(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await compressJsRecursive(full);
        continue;
      }
      if (e.isFile() && e.name.endsWith('.js')) {
        await compressFile(full);
      }
    }
  } catch (err) {
    // ignore missing dirs
  }
}

async function removeFilesByFilter(dir: string, filter: (name: string) => boolean) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        continue;
      }
      if (filter(e.name)) {
        await fs.unlink(full);
        console.log('Deleted', full);
      }
    }
  } catch (err) {
    // ignore if dir missing
  }
}

async function removeFilesByFilterRecursive(dir: string, filter: (name: string) => boolean) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await removeFilesByFilterRecursive(full, filter);
        continue;
      }
      if (filter(e.name)) {
        await fs.unlink(full);
        console.log('Deleted', full);
      }
    }
  } catch (err) {
    // ignore if dir missing
  }
}

// ********** Process APIs **********
async function processApis(apisDir: string) {
  try {
    const entries = await fs.readdir(apisDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith('.js')) continue;
      const full = path.join(apisDir, e.name);
      let content = await fs.readFile(full, 'utf8');

      try {
        // Parse the JS content to get the data structure
        const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });

        // Extract the default export object
        let exportData: any = null;
        estraverse.traverse(ast, {
          enter(node) {
            if (node.type === 'ExportDefaultDeclaration' && node.declaration) {
              // Evaluate the AST to get the actual data
              const code = escodegen.generate(node.declaration);
              try {
                // eslint-disable-next-line no-new-func
                exportData = new Function('return ' + code)();
              } catch (err) {
                console.error('Failed to evaluate', full, err);
              }
            }
          },
        });

        if (!exportData || !exportData.apis) {
          // eslint-disable-next-line no-console
          console.log('Skipping', full, '- no apis found');
          continue;
        }

        // Convert to markdown format
        const mdContent = convertToMarkdown(exportData);

        // Save as .md file
        const mdPath = full.replace(/\.js$/, '.md');
        await fs.unlink(full);
        await fs.writeFile(mdPath, mdContent, 'utf8');

        // eslint-disable-next-line no-console
        console.log('Processed API', full, '->', mdPath);
      } catch (parseErr) {
        console.error(
          'Failed to process',
          full,
          '-',
          parseErr instanceof Error ? parseErr.message : parseErr
        );
      }
    }
  } catch (err) {
    console.error('processApis failed', apisDir, err);
  }
}

function convertToMarkdown(data: any): string {
  const lines: string[] = [];

  // // Add mode info if exists
  // if (data.mode && data.mode.length > 0) {
  //   lines.push(`**支持模式**: ${data.mode.join(', ')}`);
  //   lines.push('');
  // }

  // Process each API component
  if (data.apis && Array.isArray(data.apis)) {
    for (const api of data.apis) {
      lines.push(`## ${api.name}`);
      lines.push('');

      // Props table
      if (api.props && api.props.length > 0) {
        lines.push('### Props');
        lines.push('');
        lines.push('| 属性名 | 类型 | 默认值 | 说明 |');
        lines.push('|--------|------|--------|------|');
        for (const prop of api.props) {
          const name = prop.name || '';
          const type = prop.type || '';
          const defaultValue = prop.defaultValue !== undefined ? prop.defaultValue : '';
          const desc = prop.desc && prop.desc['zh-CN'] ? prop.desc['zh-CN'] : '';
          lines.push(
            `| ${escapeTableCell(name)} | ${escapeTableCell(type)} | ${escapeTableCell(
              String(defaultValue)
            )} | ${escapeTableCell(desc)} |`
          );
        }
        lines.push('');
      }

      // Events table
      if (api.events && api.events.length > 0) {
        lines.push('### Events');
        lines.push('');
        lines.push('| 事件名 | 回调参数 | 说明 |');
        lines.push('|--------|----------|------|');
        for (const event of api.events) {
          const name = event.name || '';
          const type = event.type || '';
          const desc = event.desc && event.desc['zh-CN'] ? event.desc['zh-CN'] : '';
          lines.push(
            `| ${escapeTableCell(name)} | ${escapeTableCell(type)} | ${escapeTableCell(desc)} |`
          );
        }
        lines.push('');
      }

      // Methods table
      if (api.methods && api.methods.length > 0) {
        lines.push('### Methods');
        lines.push('');
        lines.push('| 方法名 | 返回值 | 说明 |');
        lines.push('|--------|--------|------|');
        for (const method of api.methods) {
          const name = method.name || '';
          const type = method.type || '';
          const desc = method.desc && method.desc['zh-CN'] ? method.desc['zh-CN'] : '';
          lines.push(
            `| ${escapeTableCell(name)} | ${escapeTableCell(type)} | ${escapeTableCell(desc)} |`
          );
        }
        lines.push('');
      }

      // Slots table
      if (api.slots && api.slots.length > 0) {
        lines.push('### Slots');
        lines.push('');
        lines.push('| 插槽名 | 说明 |');
        lines.push('|--------|------|');
        for (const slot of api.slots) {
          const name = slot.name || '';
          const desc = slot.desc && slot.desc['zh-CN'] ? slot.desc['zh-CN'] : '';
          lines.push(`| ${escapeTableCell(name)} | ${escapeTableCell(desc)} |`);
        }
        lines.push('');
      }
    }
  }

  // Process types
  if (data.types && Array.isArray(data.types)) {
    lines.push('## Types');
    lines.push('');
    for (const type of data.types) {
      lines.push(`### ${type.name}`);
      lines.push('');
      if (type.code) {
        lines.push('```typescript');
        lines.push(type.code.trim());
        lines.push('```');
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

function escapeTableCell(text: string): string {
  if (!text) return '';
  // Escape pipe characters and newlines in table cells
  return String(text).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

// ***************** 正式处理逻辑 ******************
async function process() {
  const target = '../skills/tiny-vue-skill';

  // 1. compress menus.js (not mangling variable names)
  const menusPath = path.join(target, 'menus.js');

  if (await fileExists(menusPath)) {
    await compressFile(menusPath);
  }

  // 2. webdoc: delete *-en.md and files starting with changelog, aui, introduce
  const webdocDir = path.join(target, 'webdoc');
  await removeFilesByFilter(webdocDir, (name) => {
    if (name.endsWith('-en.md')) return true;
    const lower = name.toLowerCase();
    return (
      lower.startsWith('changelog') || lower.startsWith('aui') || lower.startsWith('introduce')
    );
  });

  // 3. apis: remove en-US in desc and compress js files
  const apisDir = path.join(target, 'apis');
  await processApis(apisDir);

  // 4. demos: delete all *.md and *.spec.ts files (recursive)
  const demosDir = path.join(target, 'demos');
  await removeFilesByFilterRecursive(
    demosDir,
    (name) => name.endsWith('.md') || name.endsWith('.spec.ts')
  );

  // 5. demos: recursively compress all *.js files
  await compressJsRecursive(demosDir);

  // 6. compress demos/icon/iconGroups.js
  const iconGroups = path.join(demosDir, 'icon', 'iconGroups.js');
  if (await fileExists(iconGroups)) {
    await compressFile(iconGroups);
  }

  console.log('Done.');
}

process().catch((err) => {
  console.error(err);
  process.exit(1);
});
