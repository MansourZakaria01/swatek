// Bootstrap: load env then run seed via tsx
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = join(__dirname, 'seed.ts')

try {
  execSync(`npx tsx "${seedPath}"`, {
    stdio: 'inherit',
    cwd: join(__dirname, '..'),
    env: { ...process.env },
  })
} catch (e) {
  process.exit(1)
}
