declare module 'qrious' {
  interface QRiousOptions {
    element?: HTMLCanvasElement
    value?: string
    size?: number
    level?: 'L' | 'M' | 'Q' | 'H'
    foreground?: string
    background?: string
  }

  export default class QRious {
    constructor(options: QRiousOptions)
    
    element: HTMLCanvasElement
    value: string
    size: number
    level: string
    foreground: string
    background: string
  }
}