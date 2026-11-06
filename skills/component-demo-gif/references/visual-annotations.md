# 界面结果标注

结果已显示在界面里，但在成片尺寸下容易漏看时，可在录制层标注一处关键文字。静态提示可用浅色底。需要让观众注意结果出现的时刻，可用由左向右伸展的细下划线。同一演示的多个结果用同一种样式。

## 动态下划线

1. 真实执行操作，等对应结果出现在页面上并稳定，再从可见结果中定位关键词。短语下方的线条建议在 200–300 毫秒内画完，只播放一次，然后留在原位约两秒或直到该镜头结束。
2. 将线条加到临时录制页或由录制脚本注入。通过 `Range` 读取实际文字坐标，将覆盖层放到正文下方。覆盖层独立于结果节点和组件布局，字幕沿用原文案和样式。采用 Webreel 时可把标注挂在录制页内，沿用原有录制和字幕合成流程。
3. 在进入下一段操作时移除覆盖层。每次结果出现后重新计算位置。若镜头内会滚动、缩放或重排，重新测量覆盖层位置，或将覆盖层附着在会随结果一起移动的录制容器里。

以下函数在浏览器页面内执行。传入已可见的结果元素和该结果中唯一、位于单个文本节点和同一行内的关键词。返回值可在切换镜头时调用 `remove()`。如果关键词跨节点或换行，可选用同一行内更短的词。需要标注整段时，分别量取各段的位置。

```js
function drawResultUnderline(result, keyword) {
  if (!keyword) throw new Error('Keyword is required')
  const walker = document.createTreeWalker(result, NodeFilter.SHOW_TEXT)
  let textNode = walker.nextNode()
  while (textNode && !textNode.data.includes(keyword)) {
    textNode = walker.nextNode()
  }
  if (!textNode) throw new Error('Keyword is missing from the visible result')

  const start = textNode.data.indexOf(keyword)
  const range = document.createRange()
  range.setStart(textNode, start)
  range.setEnd(textNode, start + keyword.length)
  const rects = range.getClientRects()
  if (rects.length !== 1 || rects[0].width === 0) {
    throw new Error('Expected a visible keyword on one line')
  }
  const { left, bottom, width } = rects[0]

  const line = document.createElement('span')
  line.setAttribute('aria-hidden', 'true')
  Object.assign(line.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '10000',
    left: `${left}px`,
    top: `${bottom + 1}px`,
    width: `${width}px`,
    height: '2px',
    borderRadius: '2px',
    background: '#2167e8',
    transformOrigin: 'left center',
  })
  document.body.append(line)
  line.animate(
    [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    { duration: 250, easing: 'linear', fill: 'both' },
  )
  return line
}
```

## 成片检查

按最终 GIF 帧率检查结果出现、线条伸展中和完整停留的画面。确认线条从词首长到词尾，发送前或切镜头后无残留，并在文章展示宽度下检查文字、字幕和控件是否清楚。若导出后线条看起来直接跳到全长，延长动画或提高成片帧率。
