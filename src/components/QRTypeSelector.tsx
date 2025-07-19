import React from 'react'
import { QRCodeType } from '../types'
import { QR_TYPE_CARDS } from '../constants/qrTypes'

interface QRTypeSelectorProps {
  onSelectType: (type: QRCodeType) => void
  onShowTooltip: (text: string, event: React.MouseEvent) => void
  onHideTooltip: () => void
}

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  onSelectType,
  onShowTooltip,
  onHideTooltip
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center transition-colors duration-300">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
                    Examples:
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {card.examples.slice(0, 2).map((example, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-neu-light dark:bg-neu-dark-light text-gray-600 dark:text-gray-300 px-2 py-1 rounded transition-colors duration-300"
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