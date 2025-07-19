import React from 'react'
import { Gradient } from '../types'

interface GradientSelectorProps {
  currentGradient: Gradient | null
  gradientOptions: Gradient[]
  onSelectGradient: (gradient: Gradient) => void
  onGenerateRandom: () => void
}

export const GradientSelector: React.FC<GradientSelectorProps> = ({
  currentGradient,
  gradientOptions,
  onSelectGradient,
  onGenerateRandom
}) => {
  if (!currentGradient) return null

  return (
    <div>
      <label className="neu-label">Gradient Themes</label>
      <div className="bg-neu-light dark:bg-neu-dark-light p-6 rounded-xl space-y-4 transition-colors duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Current: {currentGradient.name}
            </span>
            <button
              onClick={onGenerateRandom}
              className="neu-button text-sm"
            >
              Random
            </button>
          </div>
          <div 
            className="h-8 rounded border-2 border-gray-300" 
            style={{ 
              background: `linear-gradient(135deg, ${currentGradient.colors.join(', ')})` 
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">Choose a gradient:</p>
          <div className="grid grid-cols-1 gap-3">
            {gradientOptions.map((gradient, index) => (
              <button
                key={index}
                onClick={() => onSelectGradient(gradient)}
                className={`p-3 rounded-lg border-2 transition-all hover:border-blue-400 ${
                  currentGradient.name === gradient.name 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded border border-gray-300 flex-shrink-0" 
                    style={{ 
                      background: `linear-gradient(135deg, ${gradient.colors.join(', ')})` 
                    }}
                  />
                  <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-300 transition-colors duration-300">{gradient.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}