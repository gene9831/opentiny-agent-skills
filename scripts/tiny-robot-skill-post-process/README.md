# TinyRobot SKILL 后处理脚本

将 tiny-robot 文档同步到 `skills/tiny-robot-skill` 之后，需要对文档和示例代码做**压缩处理**，防止 token 膨胀以及“读取 100 行”等限制带来的问题，使内容适合作为 AI SKILL 使用。

## 处理范围（按当前 tiny-robot 结构）

在 `skills/tiny-robot-skill` 目录下会做以下处理：

1. **src/**（组件与指南的 markdown 文档，以及部分 JS 文件）
   - 对所有 `*.md` 做**文档压缩**：去掉行尾空格、将连续多个空行压成两个空行，保留段落结构。
   - 对 `*.js`做 AST 压缩。

2. **demos/**（组件示例代码）  
   - **删除**：所有 `*.md`、`*.spec.ts`。  
   - **压缩**：递归处理所有 `*.js`，用 AST 压成单行（不修改变量名）。`.ts` 因 esprima 不解析 TypeScript 语法而跳过，保持原样。

## 压缩方式说明

- **JS/TS**：使用 esprima 解析、escodegen 生成，单行输出、加分号，不混淆变量名。  
  对于包含 TypeScript 语法的 `.ts` 文件，若 AST 解析失败，则退化为仅压缩空白，不会抛错。
- **Markdown**：仅做空白压缩（trim 行尾、合并多余空行），不删改正文和 frontmatter。
