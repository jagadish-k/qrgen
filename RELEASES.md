# QR Code Generator Extension - Release Notes

## v1.0.0 - Initial Release (2025-01-19)

### 🎉 Initial Release Features

This is the first major release of the QR Code Generator Chrome Extension, featuring a comprehensive set of tools for generating colorful, customizable QR codes with embedded images.

### ✨ Core Features

#### **Multi-Type QR Code Support**
- **Plain Text** - Share any text content, messages, notes, or quotes
- **Website URLs** - Direct links to websites and web pages
- **Phone Numbers** - Instant dial links for business or personal contacts
- **SMS Messages** - Pre-filled text messages with customizable content
- **Email** - Pre-composed emails with subject and body
- **WhatsApp** - Direct WhatsApp messages with phone numbers
- **Location** - GPS coordinates with Google Maps integration
- **WiFi Networks** - Instant WiFi connection sharing (WPA/WEP/Open)
- **Calendar Events** - Add events to calendar with date, time, and location
- **Contact Cards (vCard)** - Complete contact information sharing
- **UPI Payments** - Indian digital payment integration
- **FaceTime** - Apple FaceTime video call links

#### **Visual Design & User Experience**
- **Neumorphism Design** - Modern, tactile interface with soft shadows and depth
- **Dark Mode Support** - Toggle between light and dark themes with system preference detection
- **Nunito Sans Typography** - Professional, rounded font optimized for neumorphism
- **React Icons Integration** - Consistent, scalable Feather icons throughout
- **Responsive Layout** - Adapts to different screen sizes and orientations
- **3-Step Wizard Interface** - Select → Configure → Generate workflow

#### **Color & Image Customization**
- **Image Embedding** - Center-embed images in QR codes with 20% size ratio
- **Smart Color Extraction** - Automatic dominant color analysis using ColorThief
- **Dynamic Color Application** - QR codes use extracted colors for foreground, background, and borders
- **Gradient Backgrounds** - Beautiful gradient options when no image is uploaded
- **High Error Correction** - Level 'H' correction for reliable scanning with embedded images

#### **Advanced Functionality**
- **Google Maps Integration** - Paste Maps URLs to auto-extract coordinates
- **Real-time Validation** - Input validation with helpful error messages
- **Toast Notifications** - User-friendly feedback system
- **Tooltip System** - Contextual help for all QR type options
- **Keyboard Navigation** - ESC key support and accessibility features
- **Download Support** - High-quality PNG export (400x400px)

### 🏗️ Technical Architecture

#### **Modern Tech Stack**
- **Frontend**: React 18 with TypeScript for type safety
- **Build System**: Vite with optimized bundling and hot reload
- **Styling**: Tailwind CSS with custom neumorphism utilities
- **Extension**: Chrome Manifest V3 with service worker
- **QR Generation**: qrious library for reliable QR code creation
- **Color Analysis**: colorthief for intelligent color extraction

#### **Component Architecture**
- **Modular Design**: Separated components, hooks, and utilities
- **Custom Hooks**: `useDarkMode`, `useToast`, `useTooltip`, `useGradients`
- **Type Safety**: Comprehensive TypeScript interfaces and types
- **Utility Functions**: Separated business logic for maintainability

#### **Extension Features**
- **Full-Page Interface** - Opens in new tab (similar to JSONView)
- **No Permissions Abuse** - Only requests necessary `tabs` permission
- **Local Processing** - All QR generation and image processing client-side
- **Secure CSP** - Content Security Policy with Google Fonts support

### 🎨 Design Evolution

#### **Initial Development**
- Started with modal-based popup interface
- Basic QR generation with limited customization options
- Standard web fonts and simple styling

#### **Neumorphism Implementation**
- Migrated to full neumorphism design language
- Added comprehensive shadow systems for depth perception
- Implemented proper light/dark theme variations
- Integrated debossed text effects and flat icon styling

#### **Professional Polish**
- Replaced emoji icons with professional React Icons
- Added Nunito Sans font for better typography
- Refined button interactions and input field styling
- Enhanced visual hierarchy and user feedback

### 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Code formatting
npm run lint
npm run format

# Clean build directory
npm run clean
```

### 📦 Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to create the extension build
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `build/` directory
7. Click the QR Code Generator icon to start using

### 🐛 Known Issues & Limitations

- Google Fonts require internet connection for optimal typography
- Image processing happens client-side (may be slower on older devices)
- UPI payments are specific to Indian payment systems
- FaceTime links only work on Apple devices

### 🚀 Future Enhancements

Planned features for future releases:
- Batch QR code generation
- Custom color palette editor
- QR code templates and presets
- Analytics and usage tracking
- Export to multiple formats (SVG, PDF)
- Offline font support

### 🙏 Acknowledgments

- **qrious** - Reliable QR code generation library
- **colorthief** - Intelligent color extraction
- **React Icons** - Comprehensive icon library
- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts** - Nunito Sans typography

---

**Release Date**: January 19, 2025  
**Build Hash**: Built with Vite 4.5.14  
**Bundle Size**: ~374KB JS, ~48KB CSS  
**Chrome Extension**: Manifest V3 Compatible