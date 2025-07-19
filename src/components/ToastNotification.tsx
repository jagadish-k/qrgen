import React from 'react'
import { Toast } from '../types'

interface ToastNotificationProps {
  toast: Toast
  onClose: () => void
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  if (!toast.show) return null

  return (
    <div className={`neu-toast neu-toast-${toast.type} animate-fade-in`}>
      <span>{toast.message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-lg font-bold hover:opacity-70 transition-opacity duration-200"
      >
        ×
      </button>
    </div>
  )
}