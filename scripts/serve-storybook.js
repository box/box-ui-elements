#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Serves the static Storybook production build for visual tests.
 * Chromatic uses the same `storybook/` output from `yarn build:prod:storybook`.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = Number(process.env.STORYBOOK_VRT_PORT || 6061);
const HOST = process.env.STORYBOOK_VRT_HOST || '127.0.0.1';
const ROOT = path.resolve(__dirname, '..', 'storybook');

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.wasm': 'application/wasm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

function send(res, status, body, headers = {}) {
    res.writeHead(status, {
        'Cache-Control': 'no-store',
        ...headers,
    });
    res.end(body);
}

function safeFilePath(urlPath) {
    const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
    const relative = decoded.replace(/^\/+/, '');
    const resolved = path.resolve(ROOT, relative);

    if (resolved !== ROOT && !resolved.startsWith(`${ROOT}${path.sep}`)) {
        return null;
    }

    return resolved;
}

if (!fs.existsSync(ROOT)) {
    console.error(`Storybook build not found at ${ROOT}. Run \`yarn build:prod:storybook\` first.`);
    process.exit(1);
}

const server = http.createServer((req, res) => {
    const filePath = safeFilePath(req.url || '/');
    if (!filePath) {
        send(res, 403, 'Forbidden');
        return;
    }

    fs.stat(filePath, (statErr, stats) => {
        const resolvedPath = !statErr && stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;

        fs.readFile(resolvedPath, (readErr, data) => {
            if (readErr) {
                send(res, 404, 'Not found');
                return;
            }

            const contentType = MIME_TYPES[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream';
            send(res, 200, data, { 'Content-Type': contentType });
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Serving Storybook from ${ROOT} at http://${HOST}:${PORT}`);
});
