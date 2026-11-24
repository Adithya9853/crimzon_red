import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const VIRTUAL_MEDIA_ID = 'virtual:preetham-media';
const RESOLVED_VIRTUAL_MEDIA_ID = `\0${VIRTUAL_MEDIA_ID}`;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov']);

const MEDIA_FOLDERS = [
  {
    categoryId: 'nature',
    mediaType: 'image' as const,
    parts: ['PHOTOGRAPHY', 'nature'],
  },
  {
    categoryId: 'wildlife',
    mediaType: 'image' as const,
    parts: ['PHOTOGRAPHY', 'wildlife'],
  },
  {
    categoryId: 'birds',
    mediaType: 'image' as const,
    parts: ['PHOTOGRAPHY', 'birds'],
  },
  {
    categoryId: 'portraits',
    mediaType: 'image' as const,
    parts: ['PHOTOGRAPHY', 'potraits'],
  },
  {
    categoryId: 'travel',
    mediaType: 'image' as const,
    parts: ['PHOTOGRAPHY', 'travel'],
  },
  {
    categoryId: 'landscapes',
    mediaType: 'image' as const,
    parts: ['PHOTOGRAPHY', 'landscape'],
  },
  {
    categoryId: 'instagram-reels',
    mediaType: 'video' as const,
    parts: ['VIDEOGRAPHY', 'instagram-reels'],
  },
] as const;

function formatFilenameTitle(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, '');
  const cleaned = stem.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned || stem;
}

function scanPreethamMedia() {
  const preethamRoot = path.resolve(__dirname, 'public', 'preetham');
  const folderExists = fs.existsSync(preethamRoot);

  const categoryCounts: Record<string, number> = {
    nature: 0,
    wildlife: 0,
    birds: 0,
    portraits: 0,
    travel: 0,
    landscapes: 0,
    'instagram-reels': 0,
  };

  const items: Array<{
    id: string;
    filename: string;
    title: string;
    extension: string;
    src: string;
    categoryId: string;
    mediaType: 'image' | 'video';
  }> = [];

  for (const folder of MEDIA_FOLDERS) {
    const dirPath = path.join(preethamRoot, ...folder.parts);
    if (!fs.existsSync(dirPath)) {
      continue;
    }

    const allowedExtensions =
      folder.mediaType === 'image' ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS;

    const entries = fs
      .readdirSync(dirPath, {withFileTypes: true})
      .filter((entry) => {
        if (!entry.isFile() || entry.name.startsWith('.') || entry.name === 'WhatsApp Video 2026-11-19 at 1.04.32 PM.mp4') {
          return false;
        }
        const ext = path.extname(entry.name).toLowerCase();
        return allowedExtensions.has(ext);
      })
      .map((entry) => entry.name)
      .sort((a, b) =>
        a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'})
      );

    categoryCounts[folder.categoryId] = entries.length;

    for (const filename of entries) {
      const ext = path.extname(filename).replace('.', '').toUpperCase();
      const src = `/${['preetham', ...folder.parts, filename]
        .map((segment) => encodeURIComponent(segment))
        .join('/')}`;

      items.push({
        id: `${folder.categoryId}-${filename}`,
        filename,
        title: formatFilenameTitle(filename),
        extension: ext,
        src,
        categoryId: folder.categoryId,
        mediaType: folder.mediaType,
      });
    }
  }

  return {folderExists, items, categoryCounts};
}

function preethamMediaPlugin(): Plugin {
  return {
    name: 'preetham-media-scanner',
    resolveId(id) {
      if (id === VIRTUAL_MEDIA_ID) {
        return RESOLVED_VIRTUAL_MEDIA_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MEDIA_ID) {
        const data = scanPreethamMedia();
        return [
          `export const folderExists = ${JSON.stringify(data.folderExists)};`,
          `export const items = ${JSON.stringify(data.items)};`,
          `export const categoryCounts = ${JSON.stringify(data.categoryCounts)};`,
        ].join('\n');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      preethamMediaPlugin(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
