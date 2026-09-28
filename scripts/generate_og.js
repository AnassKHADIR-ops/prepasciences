const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // 1. Prepare circular avatar for Pr. Anas Khadir
  const anasCircleSvg = Buffer.from(`
    <svg width="110" height="110">
      <circle cx="55" cy="55" r="55" fill="#fff" />
    </svg>
  `);
  const anasAvatar = await sharp('public/anas-khadir.webp')
    .resize(110, 110, { fit: 'cover', position: 'top' })
    .composite([{ input: anasCircleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const anasBase64 = `data:image/png;base64,${anasAvatar.toString('base64')}`;

  // 2. Prepare circular avatar for Pr. Hassan Eddams
  const hassanCircleSvg = Buffer.from(`
    <svg width="110" height="110">
      <circle cx="55" cy="55" r="55" fill="#fff" />
    </svg>
  `);
  const hassanAvatar = await sharp('public/hassan-eddams.webp')
    .resize(110, 110, { fit: 'cover', position: 'top' })
    .composite([{ input: hassanCircleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const hassanBase64 = `data:image/png;base64,${hassanAvatar.toString('base64')}`;

  // 3. Construct rich vector SVG
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070c1d" />
        <stop offset="50%" stop-color="#0b132b" />
        <stop offset="100%" stop-color="#080e22" />
      </linearGradient>

      <!-- Radial Glow Maths (Cyan) -->
      <radialGradient id="glowCyan" cx="20%" cy="30%" r="45%">
        <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#00e5ff" stop-opacity="0" />
      </radialGradient>

      <!-- Radial Glow PC (Purple) -->
      <radialGradient id="glowPurple" cx="80%" cy="30%" r="45%">
        <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
      </radialGradient>

      <!-- Maths Card Gradient -->
      <linearGradient id="mathsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f1d3d" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#0b1429" stop-opacity="0.95" />
      </linearGradient>

      <!-- PC Card Gradient -->
      <linearGradient id="pcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1f113a" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#0e0b20" stop-opacity="0.95" />
      </linearGradient>

      <!-- Glow Filters -->
      <filter id="shadowBox" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <filter id="glowCyanFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00e5ff" flood-opacity="0.4"/>
      </filter>
      <filter id="glowPurpleFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#a855f7" flood-opacity="0.4"/>
      </filter>
    </defs>

    <!-- 1. Background Fill -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#glowCyan)" />
    <rect width="${width}" height="${height}" fill="url(#glowPurple)" />

    <!-- Subtle Tech Pattern / Coordinates Grid -->
    <g opacity="0.04" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="100" x2="1200" y2="100" />
      <line x1="0" y1="200" x2="1200" y2="200" />
      <line x1="0" y1="300" x2="1200" y2="300" />
      <line x1="0" y1="400" x2="1200" y2="400" />
      <line x1="0" y1="500" x2="1200" y2="500" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Faint Academic Symbols Watermark in Background -->
    <g opacity="0.05" fill="#ffffff" font-family="serif" font-style="italic">
      <text x="50" y="280" font-size="140">∑</text>
      <text x="1050" y="270" font-size="140">∫</text>
      <text x="1100" y="550" font-size="120">∇</text>
      <text x="80" y="560" font-size="120">Ψ</text>
    </g>

    <!-- 2. Header Bar -->
    <g transform="translate(60, 42)">
      <!-- Logo Square -->
      <rect x="0" y="0" width="46" height="46" rx="12" fill="#091326" stroke="#00e5ff" stroke-width="1.8" filter="url(#glowCyanFilter)" />
      <text x="23" y="29" fill="#00e5ff" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="19" text-anchor="middle">ΣΨ</text>

      <!-- Brand Name -->
      <text x="58" y="28" fill="#ffffff" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-weight="900" font-size="24" letter-spacing="0.5">
        Prépa<tspan fill="#00e5ff">sciences</tspan>
      </text>
      <text x="58" y="42" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="10" letter-spacing="2">
        EXCELLENCE CPGE MAROC
      </text>

      <!-- Right Top Badge -->
      <g transform="translate(730, 6)">
        <rect x="0" y="0" width="350" height="34" rx="17" fill="#0c1836" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.4" />
        <text x="175" y="22" fill="#7dd3fc" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11.5" text-anchor="middle" letter-spacing="1">
          ✦ CONCOURS CNC MAROC &amp; FRANCE
        </text>
      </g>
    </g>

    <!-- 3. Central Title Section -->
    <g transform="translate(60, 142)">
      <text x="0" y="0" fill="#ffffff" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-weight="900" font-size="38" letter-spacing="-0.5">
        L'Excellence en CPGE Scientifique
      </text>
      <text x="0" y="30" fill="#cbd5e1" font-family="'Segoe UI', Roboto, Helvetica, sans-serif" font-weight="400" font-size="16">
        Accompagnement d'élite en Mathématiques et Physique-Chimie · Spé TSI 2e &amp; MP / MP* 2e
      </text>
    </g>

    <!-- 4. DUAL CARDS SECTION (MATHS & PC) -->
    <!-- CARD 1: MATHÉMATIQUES (PR. ANAS KHADIR) -->
    <g transform="translate(60, 210)" filter="url(#shadowBox)">
      <!-- Outer Card Box -->
      <rect x="0" y="0" width="525" height="300" rx="24" fill="url(#mathsGrad)" stroke="#00e5ff" stroke-width="1.8" stroke-opacity="0.8" />
      
      <!-- Top Glow Accent Line -->
      <line x1="20" y1="0" x2="250" y2="0" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" />

      <!-- Discipline Tag -->
      <rect x="24" y="22" width="165" height="24" rx="12" fill="#00e5ff" fill-opacity="0.15" stroke="#00e5ff" stroke-width="1" />
      <text x="106" y="38" fill="#00e5ff" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" text-anchor="middle" letter-spacing="1">
        PÔLE MATHS
      </text>

      <!-- Teacher Avatar with Ring -->
      <g transform="translate(24, 65)">
        <circle cx="55" cy="55" r="57" fill="none" stroke="#00e5ff" stroke-width="2.5" filter="url(#glowCyanFilter)" />
        <image href="${anasBase64}" x="0" y="0" width="110" height="110" />
      </g>

      <!-- Teacher Info -->
      <g transform="translate(155, 75)">
        <text x="0" y="18" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20">
          Prof. Anas Khadir
        </text>
        <text x="0" y="36" fill="#00e5ff" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="12">
          Professeur Agrégé de Mathématiques
        </text>
        <text x="0" y="52" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11">
          Centre CPGE ERRAZI El Jadida
        </text>
      </g>

      <!-- Bullets List -->
      <g transform="translate(24, 195)" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#e2e8f0">
        <text x="0" y="0">
          <tspan fill="#00e5ff" font-weight="bold">✓ </tspan>Algèbre, Analyse, Topologie &amp; Probabilités
        </text>
        <text x="0" y="24">
          <tspan fill="#00e5ff" font-weight="bold">✓ </tspan>Fiches Méthodes &amp; Lemmes Essentiels de Concours
        </text>
        <text x="0" y="48">
          <tspan fill="#00e5ff" font-weight="bold">✓ </tspan>Corrigés Rédigés CNC, Mines-Ponts &amp; Centrale
        </text>
      </g>

      <!-- Bottom Platform Tag -->
      <g transform="translate(24, 268)">
        <text x="0" y="0" fill="#38bdf8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">
          🔗 Plateforme : quiz.anasskhadir.com
        </text>
      </g>
    </g>

    <!-- CARD 2: PHYSIQUE-CHIMIE (PR. HASSAN EDDAMS) -->
    <g transform="translate(615, 210)" filter="url(#shadowBox)">
      <!-- Outer Card Box -->
      <rect x="0" y="0" width="525" height="300" rx="24" fill="url(#pcGrad)" stroke="#a855f7" stroke-width="1.8" stroke-opacity="0.8" />
      
      <!-- Top Glow Accent Line -->
      <line x1="20" y1="0" x2="250" y2="0" stroke="#a855f7" stroke-width="3" stroke-linecap="round" />

      <!-- Discipline Tag -->
      <rect x="24" y="22" width="180" height="24" rx="12" fill="#a855f7" fill-opacity="0.18" stroke="#a855f7" stroke-width="1" />
      <text x="114" y="38" fill="#d8b4fe" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="11" text-anchor="middle" letter-spacing="1">
        PÔLE PHYSIQUE-CHIMIE
      </text>

      <!-- Teacher Avatar with Ring -->
      <g transform="translate(24, 65)">
        <circle cx="55" cy="55" r="57" fill="none" stroke="#a855f7" stroke-width="2.5" filter="url(#glowPurpleFilter)" />
        <image href="${hassanBase64}" x="0" y="0" width="110" height="110" />
      </g>

      <!-- Teacher Info -->
      <g transform="translate(155, 75)">
        <text x="0" y="18" fill="#ffffff" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20">
          Prof. Hassan Eddams
        </text>
        <text x="0" y="36" fill="#c084fc" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="12">
          Professeur Agrégé de Physique-Chimie
        </text>
        <text x="0" y="52" fill="#94a3b8" font-family="'Segoe UI', Roboto, sans-serif" font-size="11">
          Centre CPGE Safi
        </text>
      </g>

      <!-- Bullets List -->
      <g transform="translate(24, 195)" font-family="'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#e2e8f0">
        <text x="0" y="0">
          <tspan fill="#a855f7" font-weight="bold">✓ </tspan>Électromagnétisme, Mécanique, Thermo &amp; Chimie
        </text>
        <text x="0" y="24">
          <tspan fill="#a855f7" font-weight="bold">✓ </tspan>Formulaires Officiels BO &amp; Mémento Constantes SI
        </text>
        <text x="0" y="48">
          <tspan fill="#a855f7" font-weight="bold">✓ </tspan>Séances Vidéos Replays 4K &amp; Fiches de Synthèse
        </text>
      </g>

      <!-- Bottom Platform Tag -->
      <g transform="translate(24, 268)">
        <text x="0" y="0" fill="#c084fc" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">
          🔗 Hub Officiel : prepasciences.ma/eddams
        </text>
      </g>
    </g>

    <!-- 5. Footer Concours Pills & Badges -->
    <g transform="translate(60, 545)">
      <!-- Concours Target Badges -->
      <g transform="translate(0, 5)" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">
        <!-- Pill 1: CNC -->
        <rect x="0" y="0" width="115" height="28" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="1" />
        <text x="57" y="18" fill="#38bdf8" text-anchor="middle">CNC MAROC</text>

        <!-- Pill 2: MINES -->
        <rect x="125" y="0" width="125" height="28" rx="8" fill="#0f172a" stroke="#00e5ff" stroke-width="1" />
        <text x="187" y="18" fill="#00e5ff" text-anchor="middle">MINES-PONTS</text>

        <!-- Pill 3: CENTRALE -->
        <rect x="260" y="0" width="150" height="28" rx="8" fill="#0f172a" stroke="#a855f7" stroke-width="1" />
        <text x="335" y="18" fill="#c084fc" text-anchor="middle">CENTRALESUPÉLEC</text>

        <!-- Pill 4: X -->
        <rect x="420" y="0" width="165" height="28" rx="8" fill="#0f172a" stroke="#eab308" stroke-width="1" />
        <text x="502" y="18" fill="#fde047" text-anchor="middle">POLYTECHNIQUE (X)</text>

        <!-- Pill 5: CCINP -->
        <rect x="595" y="0" width="95" height="28" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="1" />
        <text x="642" y="18" fill="#cbd5e1" text-anchor="middle">CCINP</text>
      </g>

      <!-- Right Domain Watermark -->
      <g transform="translate(940, 18)">
        <text x="140" y="0" fill="#64748b" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="14" text-anchor="end">
          prepasciences.ma
        </text>
      </g>
    </g>
  </svg>
  `;

  // Render SVG to high quality JPEG with Sharp (1200x630, quality 92)
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.jpg');
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, mozjpeg: true, progressive: true })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`✅ OG Image successfully generated at: ${outputPath}`);
  console.log(`📏 Dimensions: 1200x630 | 📦 File size: ${(stats.size / 1024).toFixed(1)} KB`);
}

generateOgImage().catch(console.error);
