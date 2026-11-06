# Webreel 录制与字幕

先找项目已有的 Webreel 配置、预览命令和版本。从配置所在目录执行 `webreel validate` 和 `webreel record <scene>`，用项目实际提供的命令调用 Webreel。如果项目未配置，按所用版本核对 schema 和 CLI。下面的骨架来自 0.1.4 的实录，`pnpm dlx webreel@0.1.4` 可作为该版本的调用方式，未缓存时会下载依赖。

```json
{
  "$schema": "https://webreel.dev/schema/v1.json",
  "baseUrl": "http://127.0.0.1:5182",
  "outDir": "./output",
  "viewport": { "width": 864, "height": 560 },
  "videos": {
    "keyboard": {
      "url": "/record.html?scene=keyboard",
      "waitFor": "[data-demo-ready]",
      "output": "keyboard-source.mp4",
      "fps": 24,
      "thumbnail": { "enabled": false },
      "steps": [
        { "action": "pause", "ms": 2000 },
        { "action": "key", "key": "Tab", "delay": 1200 }
      ]
    }
  }
}
```

将 URL、就绪信号和动作替换为实际场景。就绪信号应覆盖数据和初始焦点。鼠标场景可用 `hover`、`scroll`、`click` 和 `moveTo`。如果用内置键盘提示就保留 HUD；如果字幕自带键帽，可以在 0.1.4 的场景配置中用 `"theme": {"hud": {"background": "transparent", "color": "transparent"}}` 隐藏重复提示。

短场景可以直接录制为 GIF。需要字幕时先录 MP4。用 `.webreel/timelines/<scene>.timeline.json` 中的 `events[].timeMs` 找已记录的按键或点击时间，以秒填写字幕。以 MP4 的实际画面确认动作生效时刻，尤其是悬停、滚动和动画。重录后重新校对时间。

字幕文件中 `start` 包含、`end` 不包含，`key` 用于可选的键帽。只填 `text` 可显示普通字幕。

```json
[
  { "start": 2.1, "end": 3.4, "key": "Tab", "text": "焦点移到第一项，目录展开" },
  { "start": 3.4, "end": 4.8, "text": "列表内容保持原位" }
]
```

### 能力标签与示例说明

适合面向读者介绍组件能力的演示。每条字幕用 `label` 给能力命名，脚本会在左侧渲染浅色粗体标签。右侧的 `text` 写当前画面能验证的示例或结果。能力名用「标签筛选」「安装进度可视化」这类短语，示例说明筛选后剩下什么或进度条如何更新。多个镜头展示同一能力时沿用标签，随画面更新说明。开场标题可用普通字幕，键盘操作可用键帽。

```json
[
  { "start": 0, "end": 1.6, "text": "统一扩展面板" },
  { "start": 2.1, "end": 3.8, "label": "标签筛选", "text": "只显示「效率工具」类扩展" },
  { "start": 6.4, "end": 7.8, "label": "安装进度可视化", "text": "进度条随安装状态更新" }
]
```

将时间对齐到实际画面。进度字幕从进度条出现时开始，安装完成后切换到结果说明。缩到文章展示宽度检查标签和说明是否都读得清。

### 合成 GIF

从已安装 Playwright（`playwright` 或 `@playwright/test`）且可启动 Chromium 的项目目录运行。用绝对路径指向技能脚本。系统需有 FFmpeg、ffprobe 和所需语言字体，可用 `FFMPEG_PATH` / `FFPROBE_PATH` 指定二进制。脚本按视频宽度渲染透明字幕条，贴在画面底部，以 15 fps 和调色板导出 GIF。可传入第四个参数调整输出帧率。无字幕时传空数组，便可跳过 Chromium。

```sh
node /path/to/component-demo-gif/scripts/caption-gif.mjs source.mp4 captions.json demo.gif
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,nb_frames demo.gif
```
