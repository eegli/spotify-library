import cliProgress from 'cli-progress';
import { existsSync, promises as fs } from 'fs';
import { join } from 'path';

export async function write(
  path: string,
  fileName: string,
  data: unknown
): Promise<string> {
  path = join(process.cwd(), path);
  if (!existsSync(path)) {
    await fs.mkdir(path, { recursive: true });
  }
  if (fileName.endsWith('.json')) {
    fileName = fileName.slice(0, -5);
  }
  path = join(path, fileName + '.json');
  await fs.writeFile(path, JSON.stringify(data, null, 2));
  return path;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chunkify<T extends any[] | Set<any>>(
  obj: T,
  chunkSize: number
): T[][] {
  const len = Array.isArray(obj) ? obj.length : obj.size;
  const chunks = [];
  for (let i = 0; i < len; i += chunkSize) {
    chunks.push([...obj].slice(i, i + chunkSize));
  }
  return chunks;
}

export function createProgressBar(items: string) {
  return new cliProgress.SingleBar({
    format:
      `Fetching ${items}\t |` +
      '{bar} {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '\u25A0',
    barIncompleteChar: ' ',
    hideCursor: true,
  });
}

export function goodbye(message: string): never {
  console.error('\n', '\x1b[31m', `Error: ${message}. Goodbye`, '\x1b[0m');
  process.exit(1);
}
