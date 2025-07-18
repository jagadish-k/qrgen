const fs = require('fs');
const path = require('path');
const https = require('https');

// Create vendor directory
const vendorDir = path.join(__dirname, '../vendor');
if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
}

// Dependencies to download
const dependencies = [
  {
    url: 'https://unpkg.com/react@18/umd/react.development.js',
    filename: 'react.js'
  },
  {
    url: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    filename: 'react-dom.js'
  },
  {
    url: 'https://unpkg.com/qrious@4.0.2/dist/qrious.min.js',
    filename: 'qrious.js'
  },
  {
    url: 'https://cdn.tailwindcss.com',
    filename: 'tailwind.js'
  }
];

// Download function
const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(vendorDir, filename);
    const file = fs.createWriteStream(filePath);
    
    console.log(`Downloading ${filename}...`);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
};

// Download all dependencies
async function downloadAll() {
  try {
    for (const dep of dependencies) {
      await downloadFile(dep.url, dep.filename);
    }
    console.log('All dependencies downloaded successfully!');
  } catch (error) {
    console.error('Error downloading dependencies:', error);
  }
}

downloadAll();