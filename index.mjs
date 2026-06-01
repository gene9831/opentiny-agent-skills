import { cpSync, existsSync, mkdirSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'

const __dirname = dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const isProject = args.includes('--project') || args.includes('-p')

const sourceDir = join(__dirname, 'skills', 'tiny-vue-skill')

const targetBase = isProject
  ? join(process.cwd(), '.opencode', 'skills')
  : join(homedir(), '.config', 'opencode', 'skills')

const destDir = join(targetBase, 'tiny-vue-skill')

if (!existsSync(sourceDir)) {
  console.error(`源目录不存在: ${sourceDir}`)
  process.exit(1)
}

mkdirSync(targetBase, { recursive: true })

if (existsSync(destDir)) {
  rmSync(destDir, { recursive: true, force: true })
  console.error(`删除skill目录: ${destDir}`)
  

}

cpSync(sourceDir, destDir, { recursive: true })

console.log(`完成：已将 tiny-vue-skill 复制到 ${destDir}`)
