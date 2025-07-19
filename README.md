# QR Code Generator Chrome Extension

A powerful Chrome extension for generating beautiful, colorful QR codes with embedded images and intelligent color extraction. Features a modern neumorphism design with dark mode support.

![QR Code Generator](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 Multiple QR Code Types
- **📝 Plain Text** - Messages, notes, quotes
- **🌐 Website URLs** - Direct links to any website
- **📞 Phone Numbers** - Instant dial functionality
- **💬 SMS Messages** - Pre-filled text messages
- **📧 Email** - Compose emails with subject and body
- **📱 WhatsApp** - Direct WhatsApp messaging
- **📍 Location** - GPS coordinates with Maps integration
- **📶 WiFi Networks** - Instant WiFi sharing
- **📅 Calendar Events** - Add events to calendar
- **👤 Contact Cards** - vCard format contact sharing
- **💳 UPI Payments** - Indian digital payments
- **📲 FaceTime** - Apple video call links

### 🎨 Visual Design
- **Neumorphism Interface** - Modern, tactile design with soft shadows
- **Dark Mode Support** - Automatic theme detection with manual toggle
- **Professional Typography** - Nunito Sans font optimized for readability
- **React Icons** - Consistent, scalable Feather icons
- **Responsive Layout** - Works on all screen sizes

### 🖼️ Image & Color Features
- **Image Embedding** - Add logos or images to QR codes (20% size ratio)
- **Smart Color Extraction** - Automatically extract dominant colors from images
- **Dynamic Coloring** - QR codes adapt to image colors
- **Gradient Backgrounds** - Beautiful gradients when no image is used
- **High Error Correction** - Level 'H' for reliable scanning with images

### 🚀 User Experience
- **3-Step Wizard** - Simple Select → Configure → Generate workflow
- **Real-time Validation** - Instant feedback on input errors
- **Toast Notifications** - User-friendly success/error messages
- **Tooltip Help** - Contextual information for all features
- **Keyboard Navigation** - ESC key support and accessibility
- **One-Click Download** - High-quality PNG export (400x400px)

## 🛠️ Installation

### From Chrome Web Store
[Install QR Gen](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID) (Coming Soon)

### Manual Installation (Development)

1. **Download the Extension**
   - Clone this repository or download the ZIP file
   - Extract to your desired location

2. **Build the Extension**
   ```bash
   npm install
   npm run build
   ```

3. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `build/` directory from the project
   - The extension icon will appear in your toolbar

4. **Start Using**
   - Click the QR Code Generator icon in Chrome toolbar
   - The extension opens in a new tab for the best experience

### For Developers

```bash
# Clone the repository
git clone <repository-url>
cd qr-code-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Publishing scripts
npm run prepare-release     # Interactive release preparation
npm run build:zip          # Build and create extension zip
npm run validate:extension # Run all checks and build

# Code quality
npm run typecheck
npm run lint
npm run format
```

## 🚀 Publishing

### Automatic Publishing (GitHub Actions)
1. Set up Chrome Web Store API credentials (see `scripts/setup-store-api.md`)
2. Configure GitHub secrets:
   - `CHROME_EXTENSION_ID`
   - `CHROME_CLIENT_ID`
   - `CHROME_CLIENT_SECRET`
   - `CHROME_REFRESH_TOKEN`
3. Create a release or use workflow dispatch in GitHub Actions

### Manual Publishing
```bash
# Prepare a new release
npm run prepare-release

# Or build and zip manually
npm run build:zip
```

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 4.5+ with React plugin
- **Styling**: Tailwind CSS with custom neumorphism utilities
- **QR Generation**: qrious library
- **Color Analysis**: colorthief library
- **Icons**: React Icons (Feather)
- **Extension**: Chrome Manifest V3

### Project Structure
```
src/
├── components/          # React components
│   ├── QRTypeSelector/  # QR type selection grid
│   ├── QRFormRenderer/  # Dynamic form rendering
│   ├── QRCodeGenerator/ # QR generation logic
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useDarkMode/    # Theme management
│   ├── useToast/       # Notification system
│   └── ...
├── utils/              # Utility functions
│   ├── qrDataGenerator # QR data formatting
│   ├── validation/     # Input validation
│   └── ...
├── types/              # TypeScript definitions
├── constants/          # App constants
└── index.css          # Global styles + neumorphism
```

### Key Features
- **Modular Architecture** - Separated concerns with custom hooks and utilities
- **Type Safety** - Comprehensive TypeScript coverage
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Performance Optimized** - Vite bundling with code splitting
- **Accessible** - ARIA labels and keyboard navigation

## 🎯 Usage Examples

### Basic Text QR Code
1. Click the extension icon
2. Select "Plain Text"
3. Enter your message
4. Click "Generate QR Code"
5. Download the result

### WiFi Sharing
1. Select "WiFi Network"
2. Enter network name (SSID)
3. Enter password
4. Choose encryption type
5. Generate and share the QR code

### Contact Card
1. Select "Contact Card"
2. Fill in name, phone, email
3. Add optional organization and website
4. Generate vCard QR code

### Image-Enhanced QR Code
1. Choose any QR type
2. Configure your data
3. Upload an image/logo
4. Colors are automatically extracted
5. Generate colorful QR code with embedded image

## 🔧 Configuration

### Content Security Policy
The extension includes a secure CSP that allows:
- Google Fonts for typography
- Local asset loading
- Image data URLs for QR generation

### Permissions
- **tabs** - Only permission required, used to open the extension in a new tab

## 🐛 Troubleshooting

### Common Issues

**QR Code won't scan:**
- Ensure good contrast between colors
- Try removing the embedded image
- Check if the data is too long for the QR code capacity

**Extension won't load:**
- Make sure you've run `npm run build`
- Check that Developer mode is enabled in Chrome
- Verify the build/ directory contains all files

**Fonts not loading:**
- Check internet connection (Google Fonts)
- Verify CSP allows font loading
- Clear browser cache

**Dark mode not working:**
- Check if system preference detection is enabled
- Try manually toggling the theme button
- Clear localStorage and refresh

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run typecheck && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Add proper type definitions
- Test your changes thoroughly
- Follow the neumorphism design patterns

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[qrious](https://github.com/neocotic/qrious)** - QR code generation
- **[colorthief](https://github.com/lokesh/color-thief)** - Color extraction
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework
- **[Google Fonts](https://fonts.google.com/)** - Nunito Sans typography

## 📊 Stats

- **Bundle Size**: ~374KB JavaScript, ~48KB CSS
- **QR Types Supported**: 12 different types
- **Image Formats**: PNG, JPG, GIF, WebP
- **Output Format**: High-quality PNG (400x400px)
- **Error Correction**: Level H (30% recovery)

---

**Made with ❤️ for the Chrome Web Store**

*Generate beautiful QR codes with style and intelligence.*