import React, { useState, useEffect } from 'react'
import { Gradient } from '../types'
import { FaPlus, FaMinus, FaRotateRight } from 'react-icons/fa6'

interface CustomGradientCreatorProps {
  onGradientChange: (gradient: Gradient) => void
  isDarkMode: boolean
}

export const CustomGradientCreator: React.FC<CustomGradientCreatorProps> = ({ 
  onGradientChange, 
  isDarkMode 
}) => {
  const [colors, setColors] = useState<string[]>(['#3b82f6', '#8b5cf6'])
  const [angle, setAngle] = useState<number>(45)

  // Update parent when colors or angle change
  useEffect(() => {
    const customGradient: Gradient = {
      name: 'Custom Gradient',
      colors: colors,
      angle: angle,
      isCustom: true
    }
    onGradientChange(customGradient)
  }, [colors, angle, onGradientChange])

  const addColor = () => {
    if (colors.length < 3) {
      const newColors = [...colors, '#10b981']
      setColors(newColors)
    }
  }

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index)
      setColors(newColors)
    }
  }

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    setColors(newColors)
  }

  const presetAngles = [0, 45, 90, 135, 180, 225, 270, 315]

  // Generate CSS gradient for preview
  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${colors.join(', ')})`
  }

  return (
    <div className="space-y-4">
      <label className="neu-label">Custom Gradient</label>
      <div className="bg-neu-light dark:bg-neu-dark-light p-6 rounded-xl space-y-6 transition-colors duration-300">
        
        {/* Gradient Preview */}
        <div>
          <label className="block text-sm font-medium mb-3 transition-colors duration-300" 
                style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.9)' : 'rgba(31, 41, 55, 0.9)'}}>
            Preview
          </label>
          <div 
            className="w-full h-16 rounded-lg border border-gray-300 dark:border-gray-600"
            style={gradientStyle}
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium mb-3 transition-colors duration-300" 
                style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.9)' : 'rgba(31, 41, 55, 0.9)'}}>
            Colors ({colors.length}/3)
          </label>
          <div className="space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="neu-input text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
                {colors.length > 2 && (
                  <button
                    onClick={() => removeColor(index)}
                    className="neu-button p-2 text-red-500 hover:text-red-600"
                    title="Remove color"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            
            {colors.length < 3 && (
              <button
                onClick={addColor}
                className="neu-button flex items-center gap-2 text-sm px-4 py-2"
              >
                <FaPlus className="w-3 h-3" />
                Add Color
              </button>
            )}
          </div>
        </div>

        {/* Angle Control */}
        <div>
          <label className="block text-sm font-medium mb-3 transition-colors duration-300" 
                style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.9)' : 'rgba(31, 41, 55, 0.9)'}}>
            Gradient Angle: {angle}°
          </label>
          
          {/* Angle Slider */}
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${angle}, 70%, 60%) 0%, 
                  hsl(${(angle + 60) % 360}, 70%, 60%) 50%, 
                  hsl(${(angle + 120) % 360}, 70%, 60%) 100%)`
              }}
            />
            
            {/* Preset Angles */}
            <div className="grid grid-cols-4 gap-2">
              {presetAngles.map((presetAngle) => (
                <button
                  key={presetAngle}
                  onClick={() => setAngle(presetAngle)}
                  className={`neu-button text-xs px-3 py-2 flex items-center justify-center gap-1 ${
                    angle === presetAngle ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <FaRotateRight className="w-3 h-3" style={{transform: `rotate(${presetAngle}deg)`}} />
                  {presetAngle}°
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs transition-colors duration-300" 
           style={{color: 'rgba(107, 114, 128, 0.7)'}}>
          Create your own gradient with 2-3 colors and adjust the angle for the perfect look.
        </p>
      </div>
    </div>
  )
}