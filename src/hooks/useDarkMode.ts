import { useState, useCallback, useEffect } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Dark mode toggle function
  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(newMode))
  }, [isDarkMode])

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedMode ? savedMode === 'true' : systemPrefersDark
    
    setIsDarkMode(shouldUseDark)
    if (shouldUseDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return { isDarkMode, toggleDarkMode }
}