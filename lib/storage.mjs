import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveEnv(filePath) {
     if (!filePath) return null;
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
               return path.resolve(process.cwd(), filePath);
          }
     return filePath;
}

export async function readJSON(filePath) {
     const resolved = resolveEnv(filePath);
          try {
               const raw = await fs.readFile(resolved, 'utf8');
          return JSON.parse(raw);
          } catch (err) {
               if (err.code === 'ENOENT') return null;
          throw err;
     }
}

export async function writeJSON(filePath, data) {
     const resolved = resolveEnv(filePath);
     const dir = path.dirname(resolved);
          try {
               await fs.mkdir(dir, { recursive: true });
          } catch {}
          await fs.writeFile(resolved, JSON.stringify(data, null, 2), 'utf8');
}