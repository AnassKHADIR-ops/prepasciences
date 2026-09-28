const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generatePwaIcons() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const createSvg = (size, isMaskable = false) => {
    const padding = isMaskable ? size * 0.15 : size * 0.08;
    const innerSize = size - padding * 2;
    const rx = isMaskable ? 0 : size * 0.22;
    const fontSize = Math.round(innerSize * 0.44);

    return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#070c1d" />
          <stop offset="100%" stop-color="#0b132b" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00e5ff" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
        <filter id="glow">
          <feDropShadow dx="0" dy="0" stdDeviation="${size * 0.03}" flood-color="#00e5ff" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bg)" />

      <!-- Inner Glowing Card -->
      <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${innerSize * 0.25}" fill="#0f1938" stroke="url(#glowGrad)" stroke-width="${size * 0.02}" filter="url(#glow)" />

      <!-- Greek Symbols Sigma & Psi -->
      <text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" fill="#00e5ff" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="${fontSize}" text-anchor="middle" letter-spacing="1">
        ΣΨ
      </text>

      <!-- Bottom Mini Tag -->
      <text x="${size / 2}" y="${size - padding - innerSize * 0.12}" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="${Math.round(size * 0.055)}" text-anchor="middle" letter-spacing="2">
        CPGE
      </text>
    </svg>
    `;
  };

  // Generate 192x192
  await sharp(Buffer.from(createSvg(192)))
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));

  // Generate 512x512
  await sharp(Buffer.from(createSvg(512)))
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));

  // Generate 512x512 Maskable
  await sharp(Buffer.from(createSvg(512, true)))
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512-maskable.png'));

  // Generate 32x32 Favicon PNG
  await sharp(Buffer.from(createSvg(32)))
    .png()
    .toFile(path.join(iconsDir, 'favicon-32x32.png'));

  console.log('✅ PWA icons successfully generated in public/icons/');
}

generatePwaIcons().catch(console.error);
