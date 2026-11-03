// Nap kieu `?raw` cua Vite cho kich ban Node (chu Truyen Kieu `src/loi/kieu.ts`, tep `.txt`): file khong doc duoc thi Node bao loi nhu cu.
//   node --experimental-strip-types --import ./scripts/doi-chieu/nap-raw.mjs scripts/doi-chieu/do-ai.ts …
import { register } from 'node:module';

register(`data:text/javascript,${encodeURIComponent(`
import { readFile } from 'node:fs/promises';
export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && url.endsWith('?raw')) {
    const chu = await readFile(new URL(url.slice(0, -4)), 'utf8');
    return { format: 'module', shortCircuit: true, source: 'export default ' + JSON.stringify(chu) + ';' };
  }
  return nextLoad(url, context);
}
`)}`);
