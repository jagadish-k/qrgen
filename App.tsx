import React, { useState, useRef } from 'react';

// Utility function for className concatenation
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// shadcn/ui Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'default', 
  size = 'md', 
  ...props 
}) => {
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
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};

// shadcn/ui Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

// shadcn/ui Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ className, ...props }) => {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
};

// shadcn/ui Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select: React.FC<SelectProps> = ({ className, ...props }) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

// shadcn/ui Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

// Toast component for user feedback
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
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

  return (
    <div className={cn('fixed top-4 right-4 p-4 rounded-md border z-50', typeStyles[type])}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-lg font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Types for QR code generation
type QRCodeType = 'text' | 'url' | 'wifi' | 'contact';

interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

interface ContactData {
  name: string;
  phone: string;
  email: string;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
}

const App: React.FC = () => {
  const [qrType, setQrType] = useState<QRCodeType>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [wifiData, setWifiData] = useState<WiFiData>({ ssid: '', password: '', encryption: 'WPA' });
  const [contactData, setContactData] = useState<ContactData>({ name: '', phone: '', email: '' });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [embeddedImage, setEmbeddedImage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', show: false });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const generateQRData = (): string => {
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

  const validateInput = (): boolean => {
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
        } catch {
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
    if (!validateInput()) return;

    const qrData = generateQRData();
    const canvas = canvasRef.current;
    
    if (!canvas) return;

    try {
      // @ts-ignore - QRious is loaded via CDN
      const qr = new QRious({
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
          ctx!.fillStyle = 'white';
          ctx?.fill();
          
          // Draw the image
          ctx?.drawImage(img, x, y, imageSize, imageSize);
          
          setQrCodeDataUrl(canvas.toDataURL('image/png'));
        };
        
        img.src = embeddedImage;
      } else {
        setQrCodeDataUrl(canvas.toDataURL('image/png'));
      }
      
      showToast('QR code generated successfully!', 'success');
    } catch (error) {
      showToast('Error generating QR code', 'error');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEmbeddedImage(e.target?.result as string);
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
        return (
          <div className="space-y-2">
            <Label htmlFor="text-input">Text</Label>
            <Textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text to encode in QR code"
            />
          </div>
        );
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="url-input">URL</Label>
            <Input
              id="url-input"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                placeholder="WiFi network name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifi-password">Password</Label>
              <Input
                id="wifi-password"
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                placeholder="WiFi password (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifi-encryption">Encryption</Label>
              <Select
                id="wifi-encryption"
                value={wifiData.encryption}
                onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Encryption</option>
              </Select>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="Email address"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">QR Code Generator</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="qr-type">QR Code Type</Label>
          <Select
            id="qr-type"
            value={qrType}
            onChange={(e) => setQrType(e.target.value as QRCodeType)}
          >
            <option value="text">Plain Text</option>
            <option value="url">URL</option>
            <option value="wifi">WiFi Network</option>
            <option value="contact">Contact Card</option>
          </Select>
        </div>

        {renderInputFields()}

        <div className="space-y-2">
          <Label htmlFor="image-upload">Embed Image (Optional)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {embeddedImage && (
            <div className="mt-2">
              <img src={embeddedImage} alt="Embedded" className="w-16 h-16 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={generateQRCode} className="flex-1">
            Generate QR Code
          </Button>
          <Button onClick={downloadQRCode} variant="outline" disabled={!qrCodeDataUrl}>
            Download
          </Button>
        </div>

        {qrCodeDataUrl && (
          <div className="text-center">
            <img src={qrCodeDataUrl} alt="Generated QR Code" className="mx-auto border rounded" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="hidden"
        />
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default App;