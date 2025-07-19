import React, { useState, useCallback } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { ColorPalette } from '../types'

interface ImageUploadProps {
  embeddedImage: string | null
  extractedColors: ColorPalette | null
  embedImageInQR: boolean
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onImageFromUrl: (url: string) => void
  onColorsChange: (colors: ColorPalette) => void
  onEmbedToggle: (embed: boolean) => void
  onRemoveImage: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  isDarkMode?: boolean
}

// Utility function to validate if URL points to an image
const isImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(pathname) ||
           url.includes('unsplash.com') ||
           url.includes('images.') ||
           url.includes('cdn.') ||
           url.includes('imgur.com')
  } catch {
    return false
  }
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  embeddedImage,
  extractedColors,
  embedImageInQR,
  onImageUpload,
  onImageFromUrl,
  onColorsChange,
  onEmbedToggle,
  onRemoveImage,
  fileInputRef,
  isDarkMode = false
}) => {
  const [imageUrl, setImageUrl] = useState('')
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [urlError, setUrlError] = useState('')

  const handleUrlSubmit = useCallback(async () => {
    if (!imageUrl.trim()) return
    
    setUrlError('')
    
    if (!isImageUrl(imageUrl)) {
      setUrlError('Please enter a valid image URL (jpg, png, gif, etc.)')
      return
    }
    
    setIsLoadingUrl(true)
    
    try {
      // Test if the image can be loaded
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })
      
      onImageFromUrl(imageUrl)
      setImageUrl('')
    } catch (error) {
      setUrlError('Failed to load image from URL. Please check the URL and try again.')
    } finally {
      setIsLoadingUrl(false)
    }
  }, [imageUrl, onImageFromUrl])

  const handleColorChange = useCallback((colorType: keyof ColorPalette, newColor: string) => {
    if (extractedColors) {
      onColorsChange({
        ...extractedColors,
        [colorType]: newColor
      })
    }
  }, [extractedColors, onColorsChange])

  return (
    <div>
      <label className="neu-label">Embed Image & Extract Colors (Optional)</label>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
        {embeddedImage 
          ? 'Image loaded! You can edit the extracted colors below.' 
          : 'Upload a file or paste an image URL to extract colors automatically'
        }
      </p>
      
      {!embeddedImage && (
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.8)'}}>
              Upload from device
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="neu-input"
            />
          </div>
          
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium mb-2 transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.8)'}}>
              Or paste image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg"
                className="neu-input flex-1"
                disabled={isLoadingUrl}
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim() || isLoadingUrl}
                className="neu-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingUrl ? 'Loading...' : 'Load'}
              </button>
            </div>
            {urlError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{urlError}</p>
            )}
          </div>
        </div>
      )}
      {embeddedImage && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-center items-start space-x-6">
            {/* Debossed Image Preview */}
            <div className="neu-card p-4" style={{
              background: isDarkMode 
                ? 'linear-gradient(145deg, #2c2f36, #3a3d47)'
                : 'linear-gradient(145deg, #e0e7f0, #ffffff)',
              boxShadow: isDarkMode
                ? 'inset 6px 6px 12px #2c2f36, inset -6px -6px 12px #3a3d47'
                : 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff'
            }}>
              <img 
                src={embeddedImage} 
                alt="Embedded" 
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
            
            {/* Trash Button */}
            <button
              onClick={onRemoveImage}
              className="w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center group"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(145deg, #3a3d47, #2c2f36)' 
                  : 'linear-gradient(145deg, #ffffff, #e0e7f0)',
                boxShadow: isDarkMode
                  ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                  : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = isDarkMode
                  ? 'inset 3px 3px 6px #2c2f36, inset -3px -3px 6px #3a3d47'
                  : 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                  : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                  : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
              }}
              title="Remove image"
            >
              <FiTrash2 
                className="w-5 h-5 transition-colors duration-200" 
                style={{color: 'rgba(239, 68, 68, 0.8)'}}
              />
            </button>
          </div>
          
          {/* Embed Toggle */}
          <div className="neu-card">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.85)'}}>
                  Embed Image in QR Code
                </h4>
                <p className="text-xs mt-1 transition-colors duration-300" style={{color: 'rgba(107, 114, 128, 0.7)'}}>
                  Show image in center of QR code or use colors only
                </p>
              </div>
              <button
                onClick={() => onEmbedToggle(!embedImageInQR)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                  embedImageInQR 
                    ? 'bg-blue-600 dark:bg-blue-700' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    embedImageInQR ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {extractedColors && (
            <div className="neu-card">
              <h4 className="font-semibold mb-4 transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.85)'}}>
                Color Palette
              </h4>
              <div className="flex justify-center gap-4">
                {/* Primary Color Button */}
                <div className="text-center relative">
                  <input
                    type="color"
                    value={extractedColors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="absolute inset-0 w-16 h-16 opacity-0 cursor-pointer rounded-xl"
                    title="Click to edit primary color"
                  />
                  <div
                    className="w-16 h-16 rounded-xl pointer-events-none transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: extractedColors.primary,
                      background: `linear-gradient(145deg, ${extractedColors.primary}, ${extractedColors.primary})`,
                      boxShadow: '6px 6px 12px rgba(0,0,0,0.15), -6px -6px 12px rgba(255,255,255,0.7)'
                    }}
                  />
                  <p className="text-xs mt-2 transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.8)'}}>
                    Primary
                  </p>
                </div>

                {/* Secondary Color Button */}
                <div className="text-center relative">
                  <input
                    type="color"
                    value={extractedColors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="absolute inset-0 w-16 h-16 opacity-0 cursor-pointer rounded-xl"
                    title="Click to edit secondary color"
                  />
                  <div
                    className="w-16 h-16 rounded-xl pointer-events-none transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: extractedColors.secondary,
                      background: `linear-gradient(145deg, ${extractedColors.secondary}, ${extractedColors.secondary})`,
                      boxShadow: '6px 6px 12px rgba(0,0,0,0.15), -6px -6px 12px rgba(255,255,255,0.7)'
                    }}
                  />
                  <p className="text-xs mt-2 transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.8)'}}>
                    Secondary
                  </p>
                </div>

                {/* Background Color Button */}
                <div className="text-center relative">
                  <input
                    type="color"
                    value={extractedColors.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="absolute inset-0 w-16 h-16 opacity-0 cursor-pointer rounded-xl"
                    title="Click to edit background color"
                  />
                  <div
                    className="w-16 h-16 rounded-xl pointer-events-none transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: extractedColors.background,
                      background: `linear-gradient(145deg, ${extractedColors.background}, ${extractedColors.background})`,
                      boxShadow: '6px 6px 12px rgba(0,0,0,0.15), -6px -6px 12px rgba(255,255,255,0.7)'
                    }}
                  />
                  <p className="text-xs mt-2 transition-colors duration-300" style={{color: 'rgba(75, 85, 99, 0.8)'}}>
                    Background
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}