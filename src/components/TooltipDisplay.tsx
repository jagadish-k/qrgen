import React from 'react'
import { Tooltip } from '../types'

interface TooltipDisplayProps {
  tooltip: Tooltip
}

export const TooltipDisplay: React.FC<TooltipDisplayProps> = ({ tooltip }) => {
  if (!tooltip.show) return null

  return (
    <div 
      className="tooltip"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        opacity: tooltip.show ? 1 : 0
      }}
    >
      {tooltip.text}
    </div>
  )
}