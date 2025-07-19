import { useState, useCallback, useEffect } from 'react'
import { Gradient } from '../types'
import { FALLBACK_GRADIENTS } from '../constants/qrTypes'

export const useGradients = () => {
  const [availableGradients, setAvailableGradients] = useState<Gradient[]>([])
  const [currentGradient, setCurrentGradient] = useState<Gradient | null>(null)
  const [gradientOptions, setGradientOptions] = useState<Gradient[]>([])

  // Fetch gradients from UIGradients API
  const fetchGradients = useCallback(async () => {
    try {
      const response = await fetch('https://uigradients.com/gradients.json')
      const gradients = await response.json()
      setAvailableGradients(gradients)
      
      // Set a random gradient as initial
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
      setCurrentGradient(randomGradient)
      
      // Select 5 random gradients for options
      const shuffled = [...gradients].sort(() => 0.5 - Math.random())
      setGradientOptions(shuffled.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch gradients:', error)
      // Fallback gradients if API fails
      setAvailableGradients(FALLBACK_GRADIENTS)
      setCurrentGradient(FALLBACK_GRADIENTS[0])
      setGradientOptions(FALLBACK_GRADIENTS)
    }
  }, [])

  // Generate random gradient and refresh options
  const generateRandomGradient = useCallback(() => {
    if (availableGradients.length > 0) {
      const randomGradient = availableGradients[Math.floor(Math.random() * availableGradients.length)]
      setCurrentGradient(randomGradient)
      
      // Generate new 5 random options
      const shuffled = [...availableGradients].sort(() => 0.5 - Math.random())
      setGradientOptions(shuffled.slice(0, 5))
      
      return randomGradient
    }
    return null
  }, [availableGradients])
  
  // Select specific gradient
  const selectGradient = useCallback((gradient: Gradient) => {
    setCurrentGradient(gradient)
    return gradient
  }, [])

  // Load gradients on hook initialization
  useEffect(() => {
    fetchGradients()
  }, [fetchGradients])

  return {
    availableGradients,
    currentGradient,
    gradientOptions,
    generateRandomGradient,
    selectGradient,
    fetchGradients
  }
}