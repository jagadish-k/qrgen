import React, { useRef, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import QRious from 'qrious'
import { ColorPalette, Gradient, SocialMediaData, QRCodeType } from '../types'
import { gradientToColorPalette } from '../utils/colorUtils'
import { IconType } from 'react-icons'

interface QRCodeGeneratorProps {
  qrData: string
  qrType: QRCodeType
  embeddedImage: string | null
  extractedColors: ColorPalette | null
  currentGradient: Gradient | null
  embedImageInQR: boolean
  socialMediaData?: SocialMediaData
  onQRGenerated: (dataUrl: string) => void
  onError: (error: string) => void
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  qrData,
  qrType,
  embeddedImage,
  extractedColors,
  currentGradient,
  embedImageInQR,
  socialMediaData,
  onQRGenerated,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function to create SVG from React icon and convert to image
  const createIconImage = useCallback((IconComponent: IconType): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      // Create a temporary container to render the React icon
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '80px'
      tempContainer.style.height = '80px'
      tempContainer.style.display = 'flex'
      tempContainer.style.alignItems = 'center'
      tempContainer.style.justifyContent = 'center'
      
      document.body.appendChild(tempContainer)
      
      // Create React element and render it
      const iconElement = React.createElement(IconComponent, { 
        size: 48,
        color: qrType === 'snapchat' ? '#000000' : '#FFFFFF'
      })
      
      // Use ReactDOM to render the icon
      const root = createRoot(tempContainer)
      root.render(iconElement)
      
      // Wait a bit for rendering, then convert to SVG
      setTimeout(() => {
        const svgElement = tempContainer.querySelector('svg')
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement)
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(svgBlob)
          
          const img = new Image()
          img.onload = () => {
            URL.revokeObjectURL(url)
            root.unmount()
            document.body.removeChild(tempContainer)
            resolve(img)
          }
          img.onerror = () => {
            URL.revokeObjectURL(url)
            root.unmount()
            document.body.removeChild(tempContainer)
            reject(new Error('Failed to load icon'))
          }
          img.src = url
        } else {
          root.unmount()
          document.body.removeChild(tempContainer)
          reject(new Error('No SVG found'))
        }
      }, 100)
    })
  }, [qrType])

  // Function to draw social media icon with actual React icon
  const drawSocialMediaIcon = useCallback(async (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, IconComponent: IconType) => {
    // Platform colors
    const platformColors = {
      linkedin: '#0077b5',
      instagram: '#E4405F', 
      snapchat: '#FFFC00'
    }
    
    const bgColor = platformColors[qrType as keyof typeof platformColors] || '#000000'
    
    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = bgColor
    ctx.fill()
    
    try {
      // Get the React icon as an image
      const iconImg = await createIconImage(IconComponent)
      
      // Draw the icon centered
      const iconSize = radius * 1.2
      const iconX = centerX - iconSize / 2
      const iconY = centerY - iconSize / 2
      
      ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize)
    } catch (error) {
      console.error('Failed to render icon, falling back to text:', error)
      // Fallback to text if icon rendering fails
      ctx.fillStyle = qrType === 'snapchat' ? '#000000' : '#FFFFFF'
      ctx.font = `${radius * 0.8}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const iconText = qrType === 'linkedin' ? 'in' : 
                      qrType === 'instagram' ? 'ig' : 
                      qrType === 'snapchat' ? '👻' : '•'
      
      ctx.fillText(iconText, centerX, centerY)
    }
  }, [qrType, createIconImage])

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

      // Handle social media icons or regular embedded images
      const shouldEmbedIcon = (qrType === 'linkedin' || qrType === 'instagram' || qrType === 'snapchat') && 
                             socialMediaData?.selectedIcon
      const shouldEmbedImage = embeddedImage && embedImageInQR && !shouldEmbedIcon

      if (shouldEmbedIcon && socialMediaData?.selectedIcon) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const iconRadius = canvas.width * 0.1 // 20% of canvas width for diameter
          
          // Draw white background circle
          ctx.beginPath()
          ctx.arc(centerX, centerY, iconRadius + 10, 0, 2 * Math.PI)
          ctx.fillStyle = '#FFFFFF'
          ctx.fill()
          
          // Add border
          ctx.beginPath()
          ctx.arc(centerX, centerY, iconRadius + 10, 0, 2 * Math.PI)
          ctx.strokeStyle = '#E0E0E0'
          ctx.lineWidth = 4
          ctx.stroke()
          
          // Draw the social media icon (now async)
          try {
            await drawSocialMediaIcon(ctx, centerX, centerY, iconRadius, socialMediaData.selectedIcon)
            onQRGenerated(canvas.toDataURL('image/png'))
          } catch (error) {
            console.error('Error drawing social media icon:', error)
            onError('Failed to embed social media icon')
          }
        }
      } else if (shouldEmbedImage) {
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
  }, [qrData, qrType, embeddedImage, extractedColors, currentGradient, embedImageInQR, socialMediaData, onQRGenerated, onError, drawSocialMediaIcon])

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