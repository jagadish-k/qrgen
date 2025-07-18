
// React and ReactDOM from CDN will be available as global variables
const { React, ReactDOM } = window;

// App component
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
// React is loaded via CDN
const { React } = window;
const { useState, useRef } = React;
// Utility function for className concatenation
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
const Button = ({ className, variant = 'default', size = 'md', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    };
    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8'
    };
    return (_jsx("button", { className: cn(baseStyles, variants[variant], sizes[size], className), ...props }));
};
const Input = ({ className, ...props }) => {
    return (_jsx("input", { className: cn('flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50', className), ...props }));
};
const Label = ({ className, ...props }) => {
    return (_jsx("label", { className: cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className), ...props }));
};
const Select = ({ className, ...props }) => {
    return (_jsx("select", { className: cn('flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50', className), ...props }));
};
const Textarea = ({ className, ...props }) => {
    return (_jsx("textarea", { className: cn('flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50', className), ...props }));
};
const Toast = ({ message, type, onClose }) => {
    const typeStyles = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200'
    };
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (_jsx("div", { className: cn('fixed top-4 right-4 p-4 rounded-md border z-50', typeStyles[type]), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: message }), _jsx("button", { onClick: onClose, className: "ml-2 text-lg font-bold hover:opacity-70", children: "\u00D7" })] }) }));
};
const App = () => {
    const [qrType, setQrType] = useState('text');
    const [textInput, setTextInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
    const [contactData, setContactData] = useState({ name: '', phone: '', email: '' });
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
    const [embeddedImage, setEmbeddedImage] = useState(null);
    const [toast, setToast] = useState({ message: '', type: 'info', show: false });
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const showToast = (message, type) => {
        setToast({ message, type, show: true });
    };
    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };
    const generateQRData = () => {
        switch (qrType) {
            case 'text':
                return textInput;
            case 'url':
                return urlInput;
            case 'wifi':
                return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
            case 'contact':
                return `BEGIN:VCARD\nVERSION:3.0\nFN:${contactData.name}\nTEL:${contactData.phone}\nEMAIL:${contactData.email}\nEND:VCARD`;
            default:
                return '';
        }
    };
    const validateInput = () => {
        switch (qrType) {
            case 'text':
                if (!textInput.trim()) {
                    showToast('Please enter text to generate QR code', 'error');
                    return false;
                }
                break;
            case 'url':
                if (!urlInput.trim()) {
                    showToast('Please enter a URL to generate QR code', 'error');
                    return false;
                }
                try {
                    new URL(urlInput);
                }
                catch {
                    showToast('Please enter a valid URL', 'error');
                    return false;
                }
                break;
            case 'wifi':
                if (!wifiData.ssid.trim()) {
                    showToast('Please enter WiFi network name (SSID)', 'error');
                    return false;
                }
                break;
            case 'contact':
                if (!contactData.name.trim() && !contactData.phone.trim() && !contactData.email.trim()) {
                    showToast('Please enter at least one contact field', 'error');
                    return false;
                }
                break;
        }
        return true;
    };
    const generateQRCode = () => {
        if (!validateInput())
            return;
        const qrData = generateQRData();
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        try {
            const qr = new window.QRious({
                element: canvas,
                value: qrData,
                size: 300,
                level: 'H' // High error correction for image embedding
            });
            // If there's an embedded image, overlay it on the QR code
            if (embeddedImage) {
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                    const imageSize = canvas.width * 0.2; // 20% of QR code size
                    const x = (canvas.width - imageSize) / 2;
                    const y = (canvas.height - imageSize) / 2;
                    // Draw white background circle
                    ctx?.beginPath();
                    ctx?.arc(canvas.width / 2, canvas.height / 2, imageSize / 2 + 10, 0, 2 * Math.PI);
                    ctx.fillStyle = 'white';
                    ctx?.fill();
                    // Draw the image
                    ctx?.drawImage(img, x, y, imageSize, imageSize);
                    setQrCodeDataUrl(canvas.toDataURL('image/png'));
                };
                img.src = embeddedImage;
            }
            else {
                setQrCodeDataUrl(canvas.toDataURL('image/png'));
            }
            showToast('QR code generated successfully!', 'success');
        }
        catch (error) {
            showToast('Error generating QR code', 'error');
        }
    };
    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEmbeddedImage(e.target?.result);
                showToast('Image uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    const downloadQRCode = () => {
        if (!qrCodeDataUrl) {
            showToast('Please generate a QR code first', 'error');
            return;
        }
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = qrCodeDataUrl;
        link.click();
        showToast('QR code downloaded!', 'success');
    };
    const renderInputFields = () => {
        switch (qrType) {
            case 'text':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "text-input", children: "Text" }), _jsx(Textarea, { id: "text-input", value: textInput, onChange: (e) => setTextInput(e.target.value), placeholder: "Enter text to encode in QR code" })] }));
            case 'url':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "url-input", children: "URL" }), _jsx(Input, { id: "url-input", type: "url", value: urlInput, onChange: (e) => setUrlInput(e.target.value), placeholder: "https://example.com" })] }));
            case 'wifi':
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "wifi-ssid", children: "Network Name (SSID)" }), _jsx(Input, { id: "wifi-ssid", value: wifiData.ssid, onChange: (e) => setWifiData({ ...wifiData, ssid: e.target.value }), placeholder: "WiFi network name" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "wifi-password", children: "Password" }), _jsx(Input, { id: "wifi-password", type: "password", value: wifiData.password, onChange: (e) => setWifiData({ ...wifiData, password: e.target.value }), placeholder: "WiFi password (optional)" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "wifi-encryption", children: "Encryption" }), _jsxs(Select, { id: "wifi-encryption", value: wifiData.encryption, onChange: (e) => setWifiData({ ...wifiData, encryption: e.target.value }), children: [_jsx("option", { value: "WPA", children: "WPA/WPA2" }), _jsx("option", { value: "WEP", children: "WEP" }), _jsx("option", { value: "nopass", children: "No Encryption" })] })] })] }));
            case 'contact':
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contact-name", children: "Name" }), _jsx(Input, { id: "contact-name", value: contactData.name, onChange: (e) => setContactData({ ...contactData, name: e.target.value }), placeholder: "Full name" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contact-phone", children: "Phone" }), _jsx(Input, { id: "contact-phone", type: "tel", value: contactData.phone, onChange: (e) => setContactData({ ...contactData, phone: e.target.value }), placeholder: "Phone number" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contact-email", children: "Email" }), _jsx(Input, { id: "contact-email", type: "email", value: contactData.email, onChange: (e) => setContactData({ ...contactData, email: e.target.value }), placeholder: "Email address" })] })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "p-4 max-w-md mx-auto bg-white min-h-screen", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "QR Code Generator" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "qr-type", children: "QR Code Type" }), _jsxs(Select, { id: "qr-type", value: qrType, onChange: (e) => setQrType(e.target.value), children: [_jsx("option", { value: "text", children: "Plain Text" }), _jsx("option", { value: "url", children: "URL" }), _jsx("option", { value: "wifi", children: "WiFi Network" }), _jsx("option", { value: "contact", children: "Contact Card" })] })] }), renderInputFields(), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "image-upload", children: "Embed Image (Optional)" }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageUpload, className: "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" }), embeddedImage && (_jsx("div", { className: "mt-2", children: _jsx("img", { src: embeddedImage, alt: "Embedded", className: "w-16 h-16 object-cover rounded" }) }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: generateQRCode, className: "flex-1", children: "Generate QR Code" }), _jsx(Button, { onClick: downloadQRCode, variant: "outline", disabled: !qrCodeDataUrl, children: "Download" })] }), qrCodeDataUrl && (_jsx("div", { className: "text-center", children: _jsx("img", { src: qrCodeDataUrl, alt: "Generated QR Code", className: "mx-auto border rounded" }) })), _jsx("canvas", { ref: canvasRef, width: 300, height: 300, className: "hidden" })] }), toast.show && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: hideToast }))] }));
};
window.App = App;


// Index logic
"use strict";
// @ts-nocheck
// React and ReactDOM are loaded via CDN
const { React, ReactDOM } = window;
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(window.App));

