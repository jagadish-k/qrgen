const fs = require('fs');
const path = require('path');

// Create actual PNG icons using Canvas
const createIcon = (size, outputPath) => {
  try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#007bff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR code pattern
    const unit = Math.floor(size / 8);
    const margin = unit;
    
    // Draw white background for QR pattern
    ctx.fillStyle = 'white';
    ctx.fillRect(margin, margin, size - 2 * margin, size - 2 * margin);
    
    // Draw QR code-like pattern
    ctx.fillStyle = '#007bff';
    
    // Corner squares
    const cornerSize = unit * 2;
    ctx.fillRect(margin, margin, cornerSize, cornerSize);
    ctx.fillRect(size - margin - cornerSize, margin, cornerSize, cornerSize);
    ctx.fillRect(margin, size - margin - cornerSize, cornerSize, cornerSize);
    
    // Center pattern
    const centerSize = unit * 1.5;
    const centerX = size / 2 - centerSize / 2;
    const centerY = size / 2 - centerSize / 2;
    ctx.fillRect(centerX, centerY, centerSize, centerSize);
    
    // Add some dots for QR appearance
    ctx.fillStyle = '#007bff';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (Math.random() > 0.6) {
          const x = margin + i * unit + unit / 4;
          const y = margin + j * unit + unit / 4;
          ctx.fillRect(x, y, unit / 2, unit / 2);
        }
      }
    }
    
    // Save PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    return true;
  } catch (error) {
    console.warn(`Canvas not available, creating simple icon for ${size}x${size}`);
    return false;
  }
};

// Create simple fallback icon without canvas
const createSimpleIcon = (size, outputPath) => {
  // Create a minimal PNG file (1x1 blue pixel) as fallback
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // Width: 1, Height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // Bit depth: 8, Color type: 2 (RGB)
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, // Compressed data
    0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x00, // (blue pixel)
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
    0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(outputPath, pngData);
};

// Create icons
const iconSizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '../build/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

let canvasWorked = false;

iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon${size}.png`);
  
  if (!createIcon(size, iconPath)) {
    createSimpleIcon(size, iconPath);
  } else {
    canvasWorked = true;
  }
  
  console.log(`Created icon${size}.png`);
});

if (canvasWorked) {
  console.log('Icons created successfully with Canvas!');
} else {
  console.log('Icons created as simple PNG files. Install canvas for better icons: npm install canvas');
}