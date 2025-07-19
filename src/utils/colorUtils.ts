import ColorThief from 'colorthief'
import { ColorPalette, Gradient } from '../types'

export const extractColorsFromImage = async (imageUrl: string): Promise<ColorPalette> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const colorThief = new ColorThief()
    img.crossOrigin = 'Anonymous'
    
    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, 3)
        
        const rgbToHex = (r: number, g: number, b: number) => 
          `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
        
        const colors: ColorPalette = {
          primary: rgbToHex(palette[0][0], palette[0][1], palette[0][2]),
          secondary: rgbToHex(palette[1][0], palette[1][1], palette[1][2]),
          background: rgbToHex(palette[2][0], palette[2][1], palette[2][2])
        }
        
        resolve(colors)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

export const gradientToColorPalette = (gradient: Gradient): ColorPalette => {
  const colors = gradient.colors
  return {
    primary: colors[0] || '#000000',
    secondary: colors[1] || colors[0] || '#666666',
    background: colors[colors.length - 1] || '#FFFFFF'
  }
}