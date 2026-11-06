import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const [source, captionFile, output, fpsArg = '15'] = process.argv.slice(2)
const fps = Number(fpsArg)
if (!source || !captionFile || !output?.endsWith('.gif') || resolve(source) === resolve(output)
  || !Number.isInteger(fps) || fps < 1 || fps > 100) {
  throw new Error('Usage: node caption-gif.mjs source.mp4 captions.json output.gif [fps=15]')
}

const captions = JSON.parse(await readFile(captionFile, 'utf8'))
if (!Array.isArray(captions) || captions.some((caption, index) =>
  !caption || !Number.isFinite(caption.start) || !Number.isFinite(caption.end)
  || caption.start < (index ? captions[index - 1].end : 0) || caption.end <= caption.start
  || typeof caption.text !== 'string' || !caption.text.trim()
  || (caption.key !== undefined && typeof caption.key !== 'string')
  || (caption.label !== undefined && (typeof caption.label !== 'string' || !caption.label.trim())))) {
  throw new Error('Captions must be ordered, nonoverlapping intervals with start, end, text and optional key and label fields.')
}

const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg'
const temp = await mkdtemp(join(tmpdir(), 'demo-gif-'))

try {
  const paths = []
  if (captions.length) {
    const ffprobe = process.env.FFPROBE_PATH || 'ffprobe'
    const dimensions = JSON.parse(execFileSync(ffprobe, [
      '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', source,
    ], { encoding: 'utf8' }))
    const { width, height } = dimensions.streams[0]
    const requireProject = createRequire(resolve('package.json'))
    const available = ['playwright', '@playwright/test'].find((name) => {
      try { return requireProject.resolve(name) } catch (error) {
        if (error.code !== 'MODULE_NOT_FOUND') throw error
        return false
      }
    })
    if (!available) throw new Error('Run from a project directory with Playwright installed.')
    const { chromium } = requireProject(available)
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
      await page.setContent(`<!doctype html><meta charset="UTF-8"><style>
        body { margin: 0; display: grid; justify-items: center; }
        p { box-sizing: border-box; display: flex; align-items: center; gap: 8px;
          max-width: calc(100vw - 12px); margin: 4px 0 6px; padding: 5px 12px;
          border-radius: 14px; color: white; background: #182941;
          font: 500 16px/20px system-ui, "PingFang SC", "Noto Sans CJK SC", sans-serif; }
        span { overflow-wrap: anywhere; }
        .label { min-width: 0; overflow-wrap: anywhere; padding: 1px 7px; border-radius: 4px; background: #e5efff;
          color: #19365e; font-weight: 750; }
        kbd { flex: none; padding: 0 6px; border-radius: 4px; background: #e5efff;
          color: #19365e; font: 700 14px/20px system-ui, sans-serif; }
        [hidden] { display: none; }
      </style><p><strong class="label" hidden></strong><kbd hidden></kbd><span></span></p>`)
      for (const [index, { key, label, text }] of captions.entries()) {
        const clipHeight = await page.locator('p').evaluate(async (caption, { key, label, text }) => {
          const badge = caption.querySelector('.label')
          badge.textContent = label ?? ''
          badge.hidden = !label
          const keycap = caption.querySelector('kbd')
          keycap.textContent = key ?? ''
          keycap.hidden = !key
          caption.querySelector('span').textContent = text
          await document.fonts.ready
          return Math.ceil(caption.getBoundingClientRect().bottom) + 6
        }, { key, label, text })
        if (clipHeight >= height) throw new Error(`Caption ${index + 1} is too tall for the video.`)
        const path = join(temp, `caption-${index}.png`)
        await page.screenshot({ path, omitBackground: true, clip: { x: 0, y: 0, width, height: clipHeight } })
        paths.push(path)
      }
    } finally {
      await browser.close()
    }
  }

  const filters = [`[0:v]fps=${fps}[base]`]
  let frame = 'base'
  for (const [index, { start, end }] of captions.entries()) {
    const next = `caption${index}`
    filters.push(`[${frame}][${index + 1}:v]overlay=0:H-h:enable='gte(t,${start})*lt(t,${end})'[${next}]`)
    frame = next
  }
  filters.push(
    `[${frame}]split[gif][colors]`,
    '[colors]palettegen[palette]',
    '[gif][palette]paletteuse=dither=bayer:bayer_scale=3[out]',
  )
  execFileSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-n', '-i', source,
    ...paths.flatMap((path) => ['-i', path]),
    '-filter_complex', filters.join(';'), '-map', '[out]', '-loop', '0', output,
  ], { stdio: 'inherit' })
} finally {
  await rm(temp, { recursive: true, force: true })
}
