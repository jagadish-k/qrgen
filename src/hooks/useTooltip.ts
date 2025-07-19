import { useState, useCallback } from 'react'
import { Tooltip } from '../types'

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState<Tooltip>({ text: '', x: 0, y: 0, show: false })

  const showTooltip = useCallback((text: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      show: true
    })
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, show: false }))
  }, [])

  return { tooltip, showTooltip, hideTooltip }
}