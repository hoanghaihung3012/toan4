// Tiny static server for the project root (ES modules and fetch need http://, not file://).
// node render/serve.mjs [port]  -> preview at http://localhost:<port>/shared/web/index.html?lesson=<name>
//   a long lesson: http://localhost:<port>/lessons/<name>/ (all scenes), /lessons/<name>/<scene>/ (one)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessonDir } from './paths.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.ttf': 'font/ttf', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.wav': 'audio/wav', '.mp3': 'audio/mpeg',
};

export function startServer(port = 0, root = ROOT) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    // short form /lessons/<name>/... -> the lesson's dated folder lessons/<date>/<name>/...
    const short = /^\/lessons\/([a-z0-9_]+)\/(.*)$/.exec(url);
    if (short && !/^\d{4}-\d{2}-\d{2}$/.test(short[1])) {
      let dir = null;
      try { dir = lessonDir(short[1]); } catch { /* unknown lesson: 404 below */ }
      if (dir) {
        res.writeHead(302, { Location: `/${dir.split(path.sep).map(encodeURIComponent).join('/')}/${short[2].split('/').map(encodeURIComponent).join('/')}`, 'Cache-Control': 'no-store' }).end();
        return;
      }
    }
    let file = path.join(root, url);
    // a folder with an index.html (a long lesson's stitched preview, a scene page) serves that page
    if (url.endsWith('/') && fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end('not found');
      return;
    }
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    const size = fs.statSync(file).size;
    // byte ranges, so the preview can seek the voiceover
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Number(range[2]) : size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes',
      'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  });
  // no host: listen on both IPv4 and IPv6 so "localhost" works either way
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await startServer(Number(process.argv[2] || 8123));
  console.log(`preview: http://localhost:${server.address().port}/shared/web/index.html`);
}
