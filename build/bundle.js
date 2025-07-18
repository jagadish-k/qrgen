
// Simple browser-compatible bundle
(function() {
  // React and ReactDOM are available as global variables
  const { React, ReactDOM } = window;
  
  // App component (inline)
  const App = function() {
    const { useState, useRef } = React;
    
    // Utility function for className concatenation
    const cn = (...classes) => {
      return classes.filter(Boolean).join(' ');
    };
    
    // shadcn/ui Button component
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
      
      return React.createElement('button', {
        className: cn(baseStyles, variants[variant], sizes[size], className),
        ...props
      });
    };
    
    // shadcn/ui Input component
    const Input = ({ className, ...props }) => {
      return React.createElement('input', {
        className: cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        ),
        ...props
      });
    };
    
    // shadcn/ui Label component
    const Label = ({ className, ...props }) => {
      return React.createElement('label', {
        className: cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        ),
        ...props
      });
    };
    
    // shadcn/ui Select component
    const Select = ({ className, ...props }) => {
      return React.createElement('select', {
        className: cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        ),
        ...props
      });
    };
    
    // shadcn/ui Textarea component
    const Textarea = ({ className, ...props }) => {
      return React.createElement('textarea', {
        className: cn(
          'flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        ),
        ...props
      });
    };
    
    // Toast component
    const Toast = ({ message, type, onClose }) => {
      const typeClass = type === 'success' ? 'toast-success' : 
                       type === 'error' ? 'toast-error' : 'toast-info';
      
      React.useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 3000);
        return () => clearTimeout(timer);
      }, [onClose]);
      
      return React.createElement('div', {
        className: `toast ${typeClass}`
      }, React.createElement('span', null, message), React.createElement('button', {
        onClick: onClose,
        className: 'toast-close'
      }, '×'));
    };
    
    // State
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
        const qr = new window.QRious({
          element: canvas,
          value: qrData,
          size: 400,
          level: 'H'
        });
        
        if (embeddedImage) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            const imageSize = canvas.width * 0.2;
            const x = (canvas.width - imageSize) / 2;
            const y = (canvas.height - imageSize) / 2;
            
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, imageSize / 2 + 10, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            
            ctx.drawImage(img, x, y, imageSize, imageSize);
            
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
          return React.createElement('div', { className: 'form-group' }, 
            React.createElement('label', { htmlFor: 'text-input' }, 'Text'),
            React.createElement('textarea', {
              id: 'text-input',
              value: textInput,
              onChange: (e) => setTextInput(e.target.value),
              placeholder: 'Enter text to encode in QR code'
            })
          );
        case 'url':
          return React.createElement('div', { className: 'form-group' }, 
            React.createElement('label', { htmlFor: 'url-input' }, 'URL'),
            React.createElement('input', {
              id: 'url-input',
              type: 'url',
              value: urlInput,
              onChange: (e) => setUrlInput(e.target.value),
              placeholder: 'https://example.com'
            })
          );
        case 'wifi':
          return React.createElement('div', { className: 'space-y-4' }, 
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'wifi-ssid' }, 'Network Name (SSID)'),
              React.createElement('input', {
                id: 'wifi-ssid',
                value: wifiData.ssid,
                onChange: (e) => setWifiData({ ...wifiData, ssid: e.target.value }),
                placeholder: 'WiFi network name'
              })
            ),
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'wifi-password' }, 'Password'),
              React.createElement('input', {
                id: 'wifi-password',
                type: 'password',
                value: wifiData.password,
                onChange: (e) => setWifiData({ ...wifiData, password: e.target.value }),
                placeholder: 'WiFi password (optional)'
              })
            ),
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'wifi-encryption' }, 'Encryption'),
              React.createElement('select', {
                id: 'wifi-encryption',
                value: wifiData.encryption,
                onChange: (e) => setWifiData({ ...wifiData, encryption: e.target.value })
              }, 
                React.createElement('option', { value: 'WPA' }, 'WPA/WPA2'),
                React.createElement('option', { value: 'WEP' }, 'WEP'),
                React.createElement('option', { value: 'nopass' }, 'No Encryption')
              )
            )
          );
        case 'contact':
          return React.createElement('div', { className: 'space-y-4' }, 
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'contact-name' }, 'Name'),
              React.createElement('input', {
                id: 'contact-name',
                value: contactData.name,
                onChange: (e) => setContactData({ ...contactData, name: e.target.value }),
                placeholder: 'Full name'
              })
            ),
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'contact-phone' }, 'Phone'),
              React.createElement('input', {
                id: 'contact-phone',
                type: 'tel',
                value: contactData.phone,
                onChange: (e) => setContactData({ ...contactData, phone: e.target.value }),
                placeholder: 'Phone number'
              })
            ),
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'contact-email' }, 'Email'),
              React.createElement('input', {
                id: 'contact-email',
                type: 'email',
                value: contactData.email,
                onChange: (e) => setContactData({ ...contactData, email: e.target.value }),
                placeholder: 'Email address'
              })
            )
          );
        default:
          return null;
      }
    };
    
    return React.createElement('div', { className: 'container' }, 
      React.createElement('div', { className: 'header' }, 
        React.createElement('h1', null, 'QR Code Generator'),
        React.createElement('p', null, 'Generate QR codes with embedded images for text, URLs, Wi-Fi networks, and contact cards')
      ),
      React.createElement('div', { className: 'grid' }, 
        React.createElement('div', { className: 'panel' }, 
          React.createElement('div', { className: 'space-y-6' }, 
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'qr-type' }, 'QR Code Type'),
              React.createElement('select', {
                id: 'qr-type',
                value: qrType,
                onChange: (e) => setQrType(e.target.value)
              }, 
                React.createElement('option', { value: 'text' }, 'Plain Text'),
                React.createElement('option', { value: 'url' }, 'URL'),
                React.createElement('option', { value: 'wifi' }, 'WiFi Network'),
                React.createElement('option', { value: 'contact' }, 'Contact Card')
              )
            ),
            renderInputFields(),
            React.createElement('div', { className: 'form-group' }, 
              React.createElement('label', { htmlFor: 'image-upload' }, 'Embed Image (Optional)'),
              React.createElement('div', { className: 'file-input' }, 
                React.createElement('input', {
                  ref: fileInputRef,
                  type: 'file',
                  accept: 'image/*',
                  onChange: handleImageUpload
                }),
                embeddedImage && React.createElement('div', { className: 'image-preview' }, 
                  React.createElement('img', { src: embeddedImage, alt: 'Embedded' })
                )
              )
            ),
            React.createElement('div', { className: 'button-group' }, 
              React.createElement('button', { onClick: generateQRCode, className: 'button button-primary' }, 'Generate QR Code'),
              React.createElement('button', { onClick: downloadQRCode, className: 'button button-outline', disabled: !qrCodeDataUrl }, 'Download')
            )
          )
        ),
        React.createElement('div', { className: 'panel' }, 
          qrCodeDataUrl ? React.createElement('div', { className: 'qr-display' }, 
            React.createElement('h3', null, 'Generated QR Code'),
            React.createElement('div', { className: 'qr-container' }, 
              React.createElement('img', { src: qrCodeDataUrl, alt: 'Generated QR Code' })
            ),
            React.createElement('p', { className: 'qr-info' }, 'Click download to save as PNG')
          ) : React.createElement('div', { className: 'empty-state' }, 
            React.createElement('div', { className: 'empty-state-icon' }, 
              React.createElement('svg', { width: '64', height: '64', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
                React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 4v16m8-8H4' })
              )
            ),
            React.createElement('h3', null, 'No QR Code Generated'),
            React.createElement('p', null, 'Fill in the form and click "Generate QR Code" to create your QR code')
          )
        )
      ),
      React.createElement('canvas', { ref: canvasRef, width: 400, height: 400, className: 'hidden' }),
      toast.show && React.createElement(Toast, { message: toast.message, type: toast.type, onClose: hideToast })
    );
  };
  
  // Render the app
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(App));
})();
