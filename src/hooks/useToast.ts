import { useState, useCallback } from 'react'
import { Toast } from '../types'

export const useToast = () => {
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', show: false })

  const showToast = useCallback((message: string, type: Toast['type']) => {
    setToast({ message, type, show: true })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }))
  }, [])

  return { toast, showToast, hideToast }
}