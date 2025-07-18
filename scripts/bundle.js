const fs = require('fs');
const path = require('path');

// Read the compiled JS files
const indexJs = fs.readFileSync(path.join(__dirname, '../build/index.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '../build/App.js'), 'utf8');

// Create a bundled version that doesn't rely on ES modules
const bundledJs = `
// React and ReactDOM from CDN will be available as global variables
const { React, ReactDOM } = window;

// App component
${appJs.replace('export default App;', 'window.App = App;')}

// Index logic
${indexJs.replace('import App from \'./App\';', '').replace('import React from \'react\';', '').replace('import { createRoot } from \'react-dom/client\';', '')}
`;

// Write the bundled JS
fs.writeFileSync(path.join(__dirname, '../build/bundle.js'), bundledJs);

console.log('Bundle created successfully!');