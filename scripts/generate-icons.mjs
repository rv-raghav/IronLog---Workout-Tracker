/**
 * Quick script to generate PWA icon PNGs from the SVG favicon.
 * Run: node scripts/generate-icons.mjs
 * 
 * NOTE: This is a simple approach for development.
 * For production, use a tool like @vite-pwa/assets-generator or 
 * https://realfavicongenerator.net to create proper icons.
 */

import { readFileSync, writeFileSync } from 'fs';

const svgContent = readFileSync('public/favicon.svg', 'utf-8');
const sizes = [192, 512];

// Create a minimal HTML file that renders the SVG to canvas and downloads PNGs
const html = `<!DOCTYPE html>
<html>
<body>
<script>
const svg = \`${svgContent}\`;
const sizes = [${sizes.join(',')}];

async function generateIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = \`icon-\${size}.png\`;
        a.click();
        resolve();
      });
    };
    img.src = url;
  });
}

(async () => {
  for (const size of sizes) {
    await generateIcon(size);
  }
  document.body.innerHTML = '<h1>Icons generated! Check your downloads folder and move them to public/</h1>';
})();
</script>
</body>
</html>`;

writeFileSync('scripts/generate-icons.html', html);
console.log('Open scripts/generate-icons.html in a browser to download the icon PNGs.');
console.log('Then move them to public/icon-192.png and public/icon-512.png');
