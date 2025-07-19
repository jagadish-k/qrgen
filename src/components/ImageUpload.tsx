import React from 'react'
import { ColorPalette } from '../types'

interface ImageUploadProps {
  embeddedImage: string | null
  extractedColors: ColorPalette | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  embeddedImage,
  extractedColors,
  onImageUpload,
  onRemoveImage,
  fileInputRef
}) => {
  return (
    <div>
      <label className="neu-label">Embed Image & Extract Colors (Optional)</label>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
        {embeddedImage 
          ? 'Image uploaded! Colors extracted for QR code customization.' 
          : 'Upload an image to extract colors, or use gradients for colorful QR codes'
        }
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="neu-input"
      />
      {embeddedImage && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-center items-start space-x-6">
            <img 
              src={embeddedImage} 
              alt="Embedded" 
              className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-300"
            />
            <button
              onClick={onRemoveImage}
              className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Remove</span>
            </button>
          </div>
          {extractedColors && (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">Extracted Colors:</h4>
              <div className="flex space-x-6">
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 mx-auto transition-colors duration-300"
                    style={{ backgroundColor: extractedColors.primary }}
                  />
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Primary</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 mx-auto transition-colors duration-300"
                    style={{ backgroundColor: extractedColors.secondary }}
                  />
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Secondary</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 mx-auto transition-colors duration-300"
                    style={{ backgroundColor: extractedColors.background }}
                  />
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Background</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}