# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Extension (Manifest V3) for generating **colorful QR codes with embedded images**. The extension opens as a full-page tab (similar to JSONView) when clicked, providing a spacious and user-friendly interface. It supports multiple QR code types: plain text, URLs, Wi-Fi network configuration, and contact cards (vCard format).

## Technology Stack

- **Frontend:** React with TypeScript
- **Build System:** Vite with React plugin
- **Styling:** Tailwind CSS with PostCSS
- **QR Code Generation:** qrious library
- **Color Analysis:** colorthief library for extracting dominant colors from images
- **Extension:** Chrome Extension Manifest V3

## Architecture

### Core Files Structure
- `manifest.json` - Chrome extension manifest (V3) with tabs permission
- `background.js` - Service worker that opens new tab when extension clicked
- `index.html` - Full-page tab entry point (minimal, processed by Vite)
- `src/App.tsx` - Main React component with color analysis and QR generation
- `src/index.tsx` - React rendering entry point
- `src/index.css` - Tailwind CSS imports and custom styles
- `src/types/colorthief.d.ts` - TypeScript type definitions for colorthief
- `vite.config.ts` - Vite configuration for Chrome extension build
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Key Features Implementation
- **QR Code Types:** Plain text, URLs, Wi-Fi networks, contact cards (vCard)
- **Image Embedding:** Center-embedded images with 20% size ratio and colored background
- **Color Analysis:** Extracts dominant colors from uploaded images using colorthief
- **Colorful QR Codes:** Uses extracted colors for QR code foreground, background, and image border
- **Error Correction:** High level ('H') for scanability with embedded images
- **Download:** PNG format export functionality (400x400px)
- **UI:** Full-page responsive design with Tailwind CSS styling
- **UX:** Similar to JSONView extension - opens in new tab instead of popup

## Development Commands

### Building the Extension
- `npm install` - Install dependencies
- `npm run build` - Build the extension using Vite (compiles TypeScript, bundles React, processes Tailwind CSS)
- `npm run dev` - Watch mode for development
- `npm run clean` - Remove build directory
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Loading the Extension
1. Run `npm run build` to create the build directory
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `build/` directory
5. Click the QR Code Generator extension icon in the toolbar to open in a new tab

## Technical Constraints

- **Client-side only:** All QR generation, image processing, and color analysis happen in the browser
- **Proper bundling:** Uses Vite for modern bundling with TypeScript and React
- **No native dialogs:** Uses custom toast system instead of alert()/confirm()
- **Type safety:** All code must be TypeScript with proper typing
- **Responsive design:** Must adapt to full-page tab dimensions

## Key Dependencies

- `qrious` - QR code generation library
- `colorthief` - Color analysis and extraction from images
- `react` + `react-dom` - UI framework
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - Utility-first CSS framework
- `typescript` - Type checking

## Color Analysis Features

The extension uses the colorthief library to extract dominant colors from uploaded images:

1. **Color Extraction:** Extracts 3 dominant colors from uploaded images
2. **Color Mapping:** Maps colors to:
   - Primary: QR code foreground color
   - Secondary: Image border color
   - Background: QR code background color
3. **Color Preview:** Shows extracted colors in the UI
4. **Colorful QR Codes:** Applies extracted colors to generate vibrant QR codes

## QR Code Specifications

- **Error correction level:** 'H' (High) for image embedding
- **Image embedding:** 20% of total QR code size
- **Image background:** Uses extracted background color with border
- **Output format:** PNG for download
- **Color customization:** Dynamic colors based on image analysis

## Build System

The project uses Vite for modern bundling:
- TypeScript compilation
- React JSX transformation
- Tailwind CSS processing
- Chrome extension manifest and background script copying
- Asset optimization and hashing