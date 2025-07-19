import React from 'react'
import { QRCodeType } from '../types'
import { QR_TYPE_CARDS } from '../constants/qrTypes'

interface QRTypeSelectorProps {
  onSelectType: (type: QRCodeType) => void
  onShowTooltip: (text: string, event: React.MouseEvent) => void
  onHideTooltip: () => void
  isDarkMode: boolean
}

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  onSelectType,
  onShowTooltip,
  onHideTooltip,
  isDarkMode
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center transition-colors duration-300" style={{color: isDarkMode ? 'rgba(229, 231, 235, 0.8)' : 'rgba(55, 65, 81, 0.8)', textShadow: isDarkMode ? '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.2)'}}>
        Choose QR Code Type
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {QR_TYPE_CARDS.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.type}
              onClick={() => {
                onHideTooltip()
                onSelectType(card.type)
              }}
              onMouseEnter={(e) => onShowTooltip(card.description, e)}
              onMouseLeave={onHideTooltip}
              className={`qr-type-card qr-card-${card.type} relative`}
            >
              <div className="text-center relative z-10">
                <div className="qr-icon-embedded">
                  <IconComponent />
                </div>
                <h3 className="qr-title-elevated">{card.title}</h3>
              </div>
              {card.examples && (
                <div className="mt-4 relative z-10">
                  <p className="text-xs mb-2 transition-colors duration-300" style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(107, 114, 128, 0.7)'}}>
                    Examples:
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {card.examples.slice(0, 2).map((example, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-neu-light dark:bg-neu-dark-light px-2 py-1 rounded transition-colors duration-300"
                        style={{color: isDarkMode ? 'rgba(209, 213, 219, 0.75)' : 'rgba(75, 85, 99, 0.75)'}}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}