# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Extension (Manifest V3) for generating QR codes with embedded images. The extension supports multiple QR code types: plain text, URLs, Wi-Fi network configuration, and contact cards (vCard format).

## Technology Stack

- **Frontend:** React with TypeScript
- **UI Library:** shadcn/ui (components self-contained within main React component)
- **QR Code Generation:** qrious library
- **Styling:** Tailwind CSS (loaded via CDN)
- **Extension:** Chrome Extension Manifest V3

## Architecture

### Core Files Structure
- `manifest.json` - Chrome extension manifest (V3)
- `index.html` - Extension popup entry point
- `App.tsx` - Main React component containing all UI logic
- `index.tsx` - React rendering entry point
- `icons/` - Extension icons (16px, 48px, 128px)

### Key Features Implementation
- **QR Code Types:** Plain text, URLs, Wi-Fi networks, contact cards (vCard)
- **Image Embedding:** Center-embedded images with 20% size ratio and white background
- **Error Correction:** High level ('H') for scanability with embedded images
- **Download:** PNG format export functionality
- **UI:** Responsive design within Chrome extension popup constraints

## Development Commands

Since this is a new project, you'll need to set up the basic Chrome extension structure first. The extension doesn't require a build process - it uses CDN resources and can be loaded directly as an unpacked extension.

### Loading the Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

## Technical Constraints

- **Client-side only:** All QR generation and image processing must happen in the browser
- **Self-contained components:** shadcn/ui components and utilities included directly in App.tsx
- **No native dialogs:** Use custom toast system instead of alert()/confirm()
- **Type safety:** All code must be TypeScript with proper typing
- **Responsive design:** Must adapt to Chrome extension popup dimensions

## Key Dependencies

- `qrious` - QR code generation library
- Tailwind CSS - Styling (via CDN)
- React + TypeScript - UI framework

## UI Components Required

From shadcn/ui (to be embedded in App.tsx):
- Button
- Input
- Label
- Select
- Textarea
- Toast (custom implementation)
- cn utility function

## QR Code Specifications

- **Error correction level:** 'H' (High) for image embedding
- **Image embedding:** 20% of total QR code size
- **Image background:** White background for contrast
- **Output format:** PNG for download