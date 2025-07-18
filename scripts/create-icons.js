const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure build/icons directory exists
const iconsDir = path.join(__dirname, '..', 'build', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to create an icon with QR code pattern
function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#3b82f6'; // Blue background
    ctx.fillRect(0, 0, size, size);
    
    // QR code pattern (simplified)
    ctx.fillStyle = '#ffffff';
    const blockSize = Math.floor(size / 8);
    
    // Create a simple QR-like pattern
    const pattern = [
        [1, 1, 1, 0, 0, 1, 1, 1],
        [1, 0, 1, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [1, 1, 1, 0, 0, 1, 1, 1],
        [1, 0, 1, 0, 0, 1, 0, 1],
        [1, 1, 1, 0, 0, 1, 1, 1],
    ];
    
    for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col]) {
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
    
    // Add rounded corners for modern look
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.1);
    ctx.fill();
    
    return canvas.toBuffer('image/png');
}

// Create icons in different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
    const iconBuffer = createIcon(size);
    const iconPath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(iconPath, iconBuffer);
    console.log(`Created icon${size}.png`);
});

console.log('Icons created successfully with Canvas!');