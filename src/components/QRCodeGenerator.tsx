import React, { useRef, useCallback } from 'react'
import QRious from 'qrious'
import { ColorPalette, Gradient } from '../types'
import { gradientToColorPalette } from '../utils/colorUtils'

interface QRCodeGeneratorProps {
  qrData: string
  embeddedImage: string | null
  extractedColors: ColorPalette | null
  currentGradient: Gradient | null
  onQRGenerated: (dataUrl: string) => void
  onError: (error: string) => void
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  qrData,
  embeddedImage,
  extractedColors,
  currentGradient,
  onQRGenerated,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !qrData) return

    try {
      // Determine colors to use (image colors take priority over gradient)
      const colorPalette = extractedColors || 
                          (currentGradient ? gradientToColorPalette(currentGradient) : {
                            primary: '#000000',
                            secondary: '#666666', 
                            background: '#FFFFFF'
                          })

      // If no image and we have a gradient, create QR with gradient
      if (!embeddedImage && currentGradient) {
        // First generate QR code in black/white to get the pattern
        new QRious({
          element: canvas,
          value: qrData,
          size: 400,
          level: 'H',
          foreground: '#000000',
          background: '#FFFFFF'
        })
        
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Get the image data to identify black pixels (QR code pattern)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          currentGradient.colors.forEach((color, index) => {
            gradient.addColorStop(index / (currentGradient.colors.length - 1), color)
          })
          
          // Clear canvas and redraw with white background
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Apply gradient only to pixels that were black in the original QR code
          ctx.fillStyle = gradient
          
          // Scan through pixels and draw gradient only where QR code was black
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const index = (y * canvas.width + x) * 4
              // If pixel was black (R, G, B values are low)
              if (data[index] < 128 && data[index + 1] < 128 && data[index + 2] < 128) {
                ctx.fillRect(x, y, 1, 1)
              }
            }
          }
        }
      } else {
        // Generate normal QR code with solid colors
        new QRious({
          element: canvas,
          value: qrData,
          size: 400,
          level: 'H',
          foreground: colorPalette.primary,
          background: colorPalette.background
        })
      }

      // Add embedded image if present
      if (embeddedImage) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          
          img.onload = () => {
            const imageSize = canvas.width * 0.2
            const x = (canvas.width - imageSize) / 2
            const y = (canvas.height - imageSize) / 2
            
            // Create white background circle for image
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, imageSize / 2 + 10, 0, 2 * Math.PI)
            ctx.fillStyle = extractedColors?.background || '#FFFFFF'
            ctx.fill()
            
            // Add border using secondary color
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, imageSize / 2 + 10, 0, 2 * Math.PI)
            ctx.strokeStyle = extractedColors?.secondary || '#666666'
            ctx.lineWidth = 4
            ctx.stroke()
            
            // Draw the image
            ctx.drawImage(img, x, y, imageSize, imageSize)
            
            onQRGenerated(canvas.toDataURL('image/png'))
          }
          
          img.onerror = () => onError('Failed to load embedded image')
          img.src = embeddedImage
        }
      } else {
        onQRGenerated(canvas.toDataURL('image/png'))
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      onError('Error generating QR code')
    }
  }, [qrData, embeddedImage, extractedColors, currentGradient, onQRGenerated, onError])

  // Auto-generate when dependencies change
  React.useEffect(() => {
    if (qrData) {
      generateQRCode()
    }
  }, [generateQRCode, qrData])

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={400} 
      className="hidden" 
    />
  )
}