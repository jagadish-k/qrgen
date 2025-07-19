import React, { useState, useMemo, useRef, useEffect } from 'react';
import QRious from 'qrious';
import { Gradient, QRCodeType } from '../types';

interface GradientSelectorProps {
  currentGradient: Gradient | null;
  gradientOptions: Gradient[];
  onSelectGradient: (gradient: Gradient) => void;
  onGenerateRandom: () => void;
  isDarkMode: boolean;
  selectedQRType: QRCodeType | null;
}

// Sample QR data for each type
const getSampleQRData = (qrType: QRCodeType): string => {
  switch (qrType) {
    case 'text':
      return 'Hello World! 👋';
    case 'url':
      return 'https://example.com';
    case 'phone':
      return 'tel:+1234567890';
    case 'sms':
      return 'SMSTO:+1234567890:Hello!';
    case 'email':
      return 'mailto:hello@example.com?subject=Hello&body=Hi there!';
    case 'whatsapp':
      return 'https://wa.me/1234567890?text=Hello';
    case 'location':
      return 'geo:37.7749,-122.4194?q=San Francisco';
    case 'wifi':
      return 'WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;';
    case 'event':
      return 'BEGIN:VEVENT\nSUMMARY:Sample Event\nDTSTART:20240101T120000Z\nDTEND:20240101T130000Z\nEND:VEVENT';
    case 'vcard':
      return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD';
    case 'upi':
      return 'upi://pay?pa=example@upi&pn=John Doe&am=100&cu=INR';
    case 'facetime':
      return 'facetime:+1234567890';
    default:
      return 'Sample QR Code';
  }
};

// QR Preview Component
const QRPreview: React.FC<{
  gradient: Gradient;
  qrData: string;
  size: number;
}> = ({ gradient, qrData, size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrData) return;
    console.log(size);
    try {
      // Generate QR code with gradient
      new QRious({
        element: canvas,
        value: qrData,
        size: size,
        level: 'M', // Lower error correction for better performance in preview
        foreground: '#000000',
        background: '#FFFFFF',
      });

      const ctx = canvas.getContext('2d');
      if (ctx && gradient.colors.length > 1) {
        // Get the image data to identify black pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Create gradient
        const gradientStyle = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.colors.forEach((color, index) => {
          gradientStyle.addColorStop(
            index / (gradient.colors.length - 1),
            color
          );
        });

        // Clear canvas and redraw with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply gradient only to pixels that were black in the original QR code
        ctx.fillStyle = gradientStyle;

        // Scan through pixels and draw gradient only where QR code was black
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            // If pixel was black (R, G, B values are low)
            if (
              data[index] < 128 &&
              data[index + 1] < 128 &&
              data[index + 2] < 128
            ) {
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating QR preview:', error);
    }
  }, [gradient, qrData, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="w-full h-full rounded-lg object-contain"
    />
  );
};

// Helper function to convert various color formats to a searchable format
const normalizeColorForSearch = (colorString: string): string[] => {
  const normalized = colorString.toLowerCase().trim();
  const variations: string[] = [normalized];

  // If it's a hex color, add variations
  if (normalized.startsWith('#')) {
    variations.push(normalized.substring(1)); // without #
    // Convert to RGB if it's a valid hex
    try {
      const hex = normalized.substring(1);
      if (hex.length === 3) {
        // Expand 3-digit hex to 6-digit
        const expanded = hex
          .split('')
          .map((c) => c + c)
          .join('');
        const r = parseInt(expanded.substring(0, 2), 16);
        const g = parseInt(expanded.substring(2, 4), 16);
        const b = parseInt(expanded.substring(4, 6), 16);
        variations.push(`rgb(${r}, ${g}, ${b})`);
        variations.push(`${r}, ${g}, ${b}`);
      } else if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        variations.push(`rgb(${r}, ${g}, ${b})`);
        variations.push(`${r}, ${g}, ${b}`);
      }
    } catch (e) {
      // Ignore invalid hex
    }
  }

  // If it looks like RGB, add variations
  if (normalized.includes('rgb')) {
    const rgbMatch = normalized.match(/(\d+),?\s*(\d+),?\s*(\d+)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      const hex =
        '#' +
        [r, g, b]
          .map((x) => parseInt(x).toString(16).padStart(2, '0'))
          .join('');
      variations.push(hex);
      variations.push(`${r}, ${g}, ${b}`);
      variations.push(`rgb(${r}, ${g}, ${b})`);
    }
  }

  return variations;
};

// Check if a gradient matches the search term
const matchesSearchTerm = (gradient: Gradient, searchTerm: string): boolean => {
  if (!searchTerm) return true;

  const term = searchTerm.toLowerCase().trim();

  // Check gradient name
  if (gradient.name.toLowerCase().includes(term)) return true;

  // Check each color in the gradient
  const searchVariations = normalizeColorForSearch(term);

  return gradient.colors.some((color) => {
    const colorVariations = normalizeColorForSearch(color);
    return searchVariations.some((searchVar) =>
      colorVariations.some(
        (colorVar) =>
          colorVar.includes(searchVar) || searchVar.includes(colorVar)
      )
    );
  });
};

export const GradientSelector: React.FC<GradientSelectorProps> = ({
  currentGradient,
  gradientOptions,
  onSelectGradient,
  onGenerateRandom,
  isDarkMode,
  selectedQRType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGradients = useMemo(() => {
    return gradientOptions.filter((gradient) =>
      matchesSearchTerm(gradient, searchTerm)
    );
  }, [gradientOptions, searchTerm]);

  const sampleQRData = useMemo(() => {
    return selectedQRType ? getSampleQRData(selectedQRType) : 'Sample QR Code';
  }, [selectedQRType]);

  if (!currentGradient) return null;

  return (
    <div>
      <label className="neu-label">Gradient Themes</label>
      <div className="bg-neu-light dark:bg-neu-dark-light p-6 rounded-xl space-y-4 transition-colors duration-300">
        {/* Search field and Random button */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search by name or color (hex, rgb, or name)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input text-sm flex-1"
          />
          <button
            onClick={onGenerateRandom}
            className="neu-button text-sm px-4 py-3 whitespace-nowrap"
          >
            Random
          </button>
        </div>

        <p
          className="text-xs transition-colors duration-300"
          style={{
            color: isDarkMode
              ? 'rgba(156, 163, 175, 0.8)'
              : 'rgba(107, 114, 128, 0.8)',
          }}
        >
          Showing {filteredGradients.length} of {gradientOptions.length}{' '}
          gradients
        </p>

        {/* Gradient grid */}
        <div className="max-h-80 overflow-y-auto">
          <div
            className="grid gap-3 p-1"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
            }}
          >
            {filteredGradients.map((gradient, index) => (
              <button
                key={index}
                onClick={() => onSelectGradient(gradient)}
                className={`relative group transition-all duration-200 ${
                  currentGradient.name === gradient.name
                    ? 'ring-2 ring-blue-500 scale-105'
                    : 'hover:scale-105 hover:ring-2 hover:ring-blue-400'
                }`}
                style={{ width: '64px', height: '64px' }}
                title={gradient.name}
              >
                <div className="w-full h-full rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden p-1">
                  <QRPreview
                    gradient={gradient}
                    qrData={sampleQRData}
                    size={56}
                  />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {gradient.name}
                </div>
              </button>
            ))}
          </div>

          {filteredGradients.length === 0 && (
            <div className="text-center py-8">
              <p
                className="transition-colors duration-300"
                style={{
                  color: isDarkMode
                    ? 'rgba(156, 163, 175, 0.8)'
                    : 'rgba(107, 114, 128, 0.8)',
                }}
              >
                No gradients found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
