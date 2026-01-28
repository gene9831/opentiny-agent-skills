# SKILLS 集合

本仓库包含`TinyVue`组件开发等技能工具。

## 安装使用

1. 克隆复制式使用

克隆仓库到本地，然后将`skills` 文件夹复制到用户工程或都用户全局配置的指定路径中,具体位置请参考各IDE/CLI 的官方文档。以下为部分工具的安装位置：

<!-- available-agents:start -->

| Agent          | `--agent`        | 项目内路径          | 全局路径                        |
| -------------- | ---------------- | ------------------- | ------------------------------- |
| Amp            | `amp`            | `.agents/skills/`   | `~/.config/agents/skills/`      |
| Antigravity    | `antigravity`    | `.agent/skills/`    | `~/.gemini/antigravity/skills/` |
| Claude Code    | `claude-code`    | `.claude/skills/`   | `~/.claude/skills/`             |
| Clawdbot       | `clawdbot`       | `skills/`           | `~/.clawdbot/skills/`           |
| Codex          | `codex`          | `.codex/skills/`    | `~/.codex/skills/`              |
| Cursor         | `cursor`         | `.cursor/skills/`   | `~/.cursor/skills/`             |
| Droid          | `droid`          | `.factory/skills/`  | `~/.factory/skills/`            |
| Gemini CLI     | `gemini-cli`     | `.gemini/skills/`   | `~/.gemini/skills/`             |
| GitHub Copilot | `github-copilot` | `.github/skills/`   | `~/.copilot/skills/`            |
| Goose          | `goose`          | `.goose/skills/`    | `~/.config/goose/skills/`       |
| Kilo Code      | `kilo`           | `.kilocode/skills/` | `~/.kilocode/skills/`           |
| Kiro CLI       | `kiro-cli`       | `.kiro/skills/`     | `~/.kiro/skills/`               |
| OpenCode       | `opencode`       | `.opencode/skills/` | `~/.config/opencode/skills/`    |
| Roo Code       | `roo`            | `.roo/skills/`      | `~/.roo/skills/`                |
| Trae           | `trae`           | `.trae/skills/`     | `~/.trae/skills/`               |
| Windsurf       | `windsurf`       | `.windsurf/skills/` | `~/.codeium/windsurf/skills/`   |

<!-- available-agents:end -->

2. 使用 `add-skill` 工具安装

   `add-skill` 是 vercel-labs 提供的一个npm 工具命令，辅助我们安装skill到本地环境上，详细内容请参见其[README.md](https://github.com/vercel-labs/add-skill/tree/main)。 它支持列出 github 仓库中的 skills, 以及自动安装到用户工程或用户全局的位置。

```bash
  # 列出所有的可能技能
  npx skills add opentiny/agent-skills --list

  # 全局安装 tiny-vue-skill， 支持 claude-code/vs code
  npx skills add opentiny/agent-skills -g --skill tinyvue-develop-helper --agent claude-code

  # 项目级安装 tiny-vue-skill， 支持 claude-code/vs code
  npx skills add opentiny/agent-skills --skill tinyvue-develop-helper --agent claude-code

```

> IMPORTANT: 不同的AI IDE/CLI， 对skill的配置可能不同，请严格参考其文档进行配置路径。

> IMPORTANT: TinyVue组件也会定期升级，需要重新复制或重新执行 skills add 命令来更新Skill 。

## 在 vscode 中启用skill

按快捷键 `ctrl + ,` 打开设置界面，搜索 `useagentskills` 会看到实验性支持`Use Agent Skills`功能， 勾选启用即可。

## 同步最新的TinyVue文档/示例

随着TinyVue的不断开发，此仓库的Skill资源肯定会落后于主仓库。需要同步时，手工执行一下”同步TinyVue仓库“的Github Action即可！

## 使用示例

使用以下语句测试：

1. 在test目录中，新建一个vue工程，然后安装TinyVue组件，使用Grid组件开发一个中国省级信息查询的表格，要求有：序号，省名，人口，面积，GDP等信息，这些信息要支持排序的功能，省名的列要冻结在最左边。 表格的顶部有过滤查询省名的功能。

2. 为当前TinyVue的工程增加深色模式的能力
