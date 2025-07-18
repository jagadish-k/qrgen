const fs = require('fs');
const path = require('path');

// Create a simple SVG icon and convert it to different sizes
const createIcon = (size) => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#007bff"/>
    <rect x="${size * 0.2}" y="${size * 0.2}" width="${size * 0.6}" height="${size * 0.6}" fill="white"/>
    <rect x="${size * 0.3}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.4}" fill="#007bff"/>
    <text x="${size/2}" y="${size/2 + 4}" text-anchor="middle" fill="white" font-family="Arial" font-size="${size * 0.15}" font-weight="bold">QR</text>
  </svg>`;
  return svg;
};

// Write placeholder text files for now (user can replace with actual icons)
const iconSizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '../build/icons');

iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon${size}.png`);
  const placeholder = `This is a placeholder for icon${size}.png - replace with actual ${size}x${size} icon`;
  fs.writeFileSync(iconPath, placeholder);
});

console.log('Placeholder icons created. Replace them with actual PNG files for production.');