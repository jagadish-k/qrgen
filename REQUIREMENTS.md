## **Creative QR Code Generator Chrome Extension Requirements**

### **I. Objective**

Develop a Chrome extension for generating QR codes with embedded images, designed for printing and displaying information around the house.

### **II. Technology Stack**

- **Frontend:** React with TypeScript
- **UI Library:** `shadcn/ui` (components should be self-contained within the main React component for simplicity in a single file output).
- **QR Code Generation:** `qrious` library.

### **III. Core Functionality**

1. **QR Code Types Support:**
   - **Plain Text:** Generate QR codes from arbitrary text input.
   - **URLs:** Generate QR codes from valid URL inputs.
   - **Wi-Fi Network:** Generate QR codes for Wi-Fi network configuration, including:
     - SSID (Network Name)
     - Password (optional)
     - Encryption Type (WPA/WPA2, WEP, or No Encryption)
   - **Contact Card (vCard):** Generate QR codes for contact information, including:
     - Name
     - Phone Number
     - Email Address
     - (At least one field must be provided for a valid contact card.)
2. **Image Embedding:**
   - Allow users to upload an image file (e.g., PNG, JPG).
   - The uploaded image should be embedded in the center of the generated QR code.
   - The QR code generation should utilize a high error correction level ('H') to maintain scanability when an image is embedded.
   - The embedded image should occupy approximately 20% of the QR code's total size.
   - A white background should be drawn behind the embedded image to improve contrast and scanability.
3. **QR Code Download:**
   - Provide a clear button to enable users to download the generated QR code.
   - The downloaded file should be in PNG format.
4. **User Interface (UI):**
   - The extension popup UI must be fully responsive, adapting well to different sizes within the Chrome extension context.
   - The design should be user-friendly and intuitive.

### **IV. Technical Requirements & Constraints**

1. **Chrome Extension Structure:**
   - The output should include the necessary files for a Chrome Extension Manifest V3: manifest.json, index.html (as the default popup), and the main React application file (e.g., App.tsx and index.tsx for rendering).
   - An icons directory with appropriate icon sizes (icon16.png, icon48.png, icon128.png) should be referenced.
2. **Type Safety:**
   - All React components, state variables, and functions must be written in TypeScript, ensuring proper type compatibility and compile-time checks.
3. **Styling:**
   - Tailwind CSS should be used for styling, loaded via a CDN in index.html.
   - `shadcn/ui` components (e.g., Button, Input, Label, Select, Textarea, Toast) should be integrated. For the purpose of a self-contained output, the essential `shadcn/ui` component code and the cn utility function should be included directly within the main React component file (App.tsx).
4. **User Feedback:**

   - Implement a custom message/toast system (simulated `shadcn/ui` Toast) for providing user feedback, such as input validation errors or successful QR code generation.
   - **Crucially, avoid using native browser alert() or confirm() dialogs.**

5. **Client-Side Execution:**
   - All QR code generation and image embedding logic must be executed entirely client-side within the Chrome extension environment.
