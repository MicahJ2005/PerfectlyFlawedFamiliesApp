const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const TEAL = "#2E7D6B";
const BG   = "#EDEAE4";

// The RootsIcon SVG — viewBox "-30 0 160 130"
function buildSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${BG}"/>
  <!-- Tree scaled to fit with padding -->
  <g transform="translate(${size * 0.08}, ${size * 0.04}) scale(${(size * 0.84) / 160})">
    <!-- Canopy -->
    <ellipse cx="50" cy="32" rx="46" ry="26" fill="${TEAL}"/>
    <circle cx="50" cy="8"  r="18" fill="${TEAL}"/>
    <circle cx="26" cy="14" r="17" fill="${TEAL}"/>
    <circle cx="74" cy="14" r="17" fill="${TEAL}"/>
    <circle cx="6"  cy="28" r="16" fill="${TEAL}"/>
    <circle cx="94" cy="28" r="16" fill="${TEAL}"/>
    <circle cx="10" cy="46" r="14" fill="${TEAL}"/>
    <circle cx="90" cy="46" r="14" fill="${TEAL}"/>
    <circle cx="26" cy="50" r="14" fill="${TEAL}"/>
    <circle cx="74" cy="50" r="14" fill="${TEAL}"/>
    <circle cx="50" cy="52" r="14" fill="${TEAL}"/>
    <!-- Trunk -->
    <rect x="45" y="58" width="10" height="16" rx="2" fill="${TEAL}"/>
    <!-- Roots -->
    <path d="M50 74 C46 76 34 80 14 84"    fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M50 74 C54 76 66 80 86 84"    fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M50 74 C50 82 50 92 50 110"   fill="none" stroke="${TEAL}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M48 76 C40 84 26 94 4 100"    fill="none" stroke="${TEAL}" stroke-width="2"   stroke-linecap="round"/>
    <path d="M52 76 C60 84 74 94 96 100"   fill="none" stroke="${TEAL}" stroke-width="2"   stroke-linecap="round"/>
    <path d="M47 77 C36 90 18 102 -4 112"  fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M53 77 C64 90 82 102 104 112" fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M49 79 C44 90 36 104 22 118"  fill="none" stroke="${TEAL}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M51 79 C56 90 64 104 78 118"  fill="none" stroke="${TEAL}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M48 81 C38 96 20 108 -2 122"  fill="none" stroke="${TEAL}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M52 81 C62 96 80 108 102 122" fill="none" stroke="${TEAL}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M50 84 C44 98 32 112 12 126"  fill="none" stroke="${TEAL}" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M50 84 C56 98 68 112 88 126"  fill="none" stroke="${TEAL}" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M49 75 C46 82 40 92 30 100"   fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M51 75 C54 82 60 92 70 100"   fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M48 78 C44 88 38 100 28 112"  fill="none" stroke="${TEAL}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M52 78 C56 88 62 100 72 112"  fill="none" stroke="${TEAL}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M49 80 C46 90 42 104 36 118"  fill="none" stroke="${TEAL}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M51 80 C54 90 58 104 64 118"  fill="none" stroke="${TEAL}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M50 76 C48 86 46 98 42 114"   fill="none" stroke="${TEAL}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M50 76 C52 86 54 98 58 114"   fill="none" stroke="${TEAL}" stroke-width="1.2" stroke-linecap="round"/>
  </g>
</svg>`;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, "public", "icons");

fs.mkdirSync(outDir, { recursive: true });

for (const size of sizes) {
  const svg  = buildSvg(size);
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: size } });
  const png  = resvg.render().asPng();
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`✓ icon-${size}.png`);
}

// Apple touch icon (180px, same design)
const apple = new Resvg(buildSvg(180), { fitTo: { mode: "width", value: 180 } });
fs.writeFileSync(path.join(outDir, "apple-touch-icon.png"), apple.render().asPng());
console.log("✓ apple-touch-icon.png");

console.log("\nAll icons written to dist/icons/");
