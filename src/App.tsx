import React, { useState, useRef, useCallback, useEffect } from 'react'
import QRious from 'qrious'
import ColorThief from 'colorthief'
import { 
  FiEdit3, FiGlobe, FiPhone, FiMessageSquare, FiMail, 
  FiVideo, FiMessageCircle, FiMapPin, FiWifi, FiCalendar, 
  FiUser, FiCreditCard, FiPlus, FiDownload, FiArrowLeft 
} from 'react-icons/fi'
import { IconType } from 'react-icons'

interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

interface ContactData {
  name: string
  phone: string
  email: string
  organization?: string
  url?: string
  address?: string
}

interface UPIData {
  pa: string // Payee address (UPI ID)
  pn: string // Payee name
  am?: string // Amount
  cu: string // Currency (INR)
  mc?: string // Merchant category code
  tr?: string // Transaction reference ID
  url?: string // Transaction reference URL
  tid?: string // Transaction ID
  tn?: string // Transaction note
  invoiceNo?: string // Invoice number
  invoiceDate?: string // Invoice date
  gstIn?: string // GST number
  mam?: string // Minimum amount
}

interface EventData {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
  allDay?: boolean
}

interface LocationData {
  latitude: string
  longitude: string
  label?: string
  mapsUrl?: string
  useDirectMapsLink?: boolean
}

type QRCodeType = 'text' | 'url' | 'phone' | 'sms' | 'email' | 'facetime' | 'whatsapp' | 'location' | 'wifi' | 'event' | 'vcard' | 'upi'

interface QRTypeCard {
  type: QRCodeType
  title: string
  description: string
  icon: IconType
  hoverColor: string
  glowColor: string
  examples?: string[]
}

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
}

interface ColorPalette {
  primary: string
  secondary: string
  background: string
}

interface Gradient {
  name: string
  colors: string[]
}

const QR_TYPE_CARDS: QRTypeCard[] = [
  {
    type: 'text',
    title: 'Plain Text',
    description: 'Share any text content',
    icon: FiEdit3,
    hoverColor: 'hover:border-blue-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    examples: ['Messages', 'Notes', 'Quotes']
  },
  {
    type: 'url',
    title: 'Website URL',
    description: 'Link to websites or web pages',
    icon: FiGlobe,
    hoverColor: 'hover:border-green-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    examples: ['https://example.com', 'Social media links']
  },
  {
    type: 'phone',
    title: 'Phone Number',
    description: 'Direct phone call link',
    icon: FiPhone,
    hoverColor: 'hover:border-red-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    examples: ['+1234567890', 'Business numbers']
  },
  {
    type: 'sms',
    title: 'SMS Message',
    description: 'Pre-filled text message',
    icon: FiMessageSquare,
    hoverColor: 'hover:border-purple-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    examples: ['Contact info requests', 'Quick messages']
  },
  {
    type: 'email',
    title: 'Email',
    description: 'Pre-composed email with subject',
    icon: FiMail,
    hoverColor: 'hover:border-orange-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    examples: ['Contact forms', 'Support emails']
  },
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Direct WhatsApp message',
    icon: FiMessageCircle,
    hoverColor: 'hover:border-green-500',
    glowColor: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
    examples: ['Customer support', 'Quick chat']
  },
  {
    type: 'location',
    title: 'Location',
    description: 'GPS coordinates or Maps link',
    icon: FiMapPin,
    hoverColor: 'hover:border-cyan-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    examples: ['Meeting points', 'Business address']
  },
  {
    type: 'wifi',
    title: 'WiFi Network',
    description: 'Instant WiFi connection',
    icon: FiWifi,
    hoverColor: 'hover:border-indigo-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    examples: ['Guest networks', 'Office WiFi']
  },
  {
    type: 'event',
    title: 'Calendar Event',
    description: 'Add events to calendar',
    icon: FiCalendar,
    hoverColor: 'hover:border-pink-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    examples: ['Meetings', 'Appointments', 'Reminders']
  },
  {
    type: 'vcard',
    title: 'Contact Card',
    description: 'Complete contact information',
    icon: FiUser,
    hoverColor: 'hover:border-yellow-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    examples: ['Business cards', 'Personal contacts']
  },
  {
    type: 'upi',
    title: 'UPI Payment',
    description: 'Indian digital payments',
    icon: FiCreditCard,
    hoverColor: 'hover:border-emerald-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    examples: ['Business payments', 'Personal transfers']
  },
  {
    type: 'facetime',
    title: 'FaceTime',
    description: 'Apple FaceTime video call',
    icon: FiVideo,
    hoverColor: 'hover:border-gray-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(107,114,128,0.3)]',
    examples: ['Video meetings', 'Family calls']
  }
]

const App: React.FC = () => {
  const [qrType, setQrType] = useState<QRCodeType>('text')
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [smsData, setSmsData] = useState({ number: '', message: '' })
  const [emailData, setEmailData] = useState({ email: '', subject: '', body: '' })
  const [wifiData, setWifiData] = useState<WiFiData>({ ssid: '', password: '', encryption: 'WPA' })
  const [contactData, setContactData] = useState<ContactData>({ name: '', phone: '', email: '' })
  const [upiData, setUpiData] = useState<UPIData>({ pa: '', pn: '', cu: 'INR' })
  const [eventData, setEventData] = useState<EventData>({ title: '', startDate: '' })
  const [locationData, setLocationData] = useState<LocationData>({ latitude: '', longitude: '', useDirectMapsLink: false })
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [embeddedImage, setEmbeddedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<ColorPalette | null>(null)
  const [currentGradient, setCurrentGradient] = useState<Gradient | null>(null)
  const [availableGradients, setAvailableGradients] = useState<Gradient[]>([])
  const [gradientOptions, setGradientOptions] = useState<Gradient[]>([])
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', show: false })
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'select' | 'form' | 'generate' | 'result'>('select')
  const [selectedQRType, setSelectedQRType] = useState<QRCodeType | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number, show: boolean }>({ text: '', x: 0, y: 0, show: false })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorThief = useRef(new ColorThief())

  const showToast = useCallback((message: string, type: Toast['type']) => {
    setToast({ message, type, show: true })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }, [])

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

  // Tooltip handlers
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

  const extractColorsFromImage = useCallback(async (imageUrl: string): Promise<ColorPalette> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      
      img.onload = () => {
        try {
          const palette = colorThief.current.getPalette(img, 3)
          
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
  }, [])

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
      const fallbackGradients = [
        { name: 'Ocean Blue', colors: ['#2E3192', '#1BFFFF'] },
        { name: 'Sunset', colors: ['#FF512F', '#F09819'] },
        { name: 'Purple Dream', colors: ['#8360c3', '#2ebf91'] },
        { name: 'Pink Flamingo', colors: ['#f093fb', '#f5576c'] },
        { name: 'Green Tea', colors: ['#11998e', '#38ef7d'] }
      ]
      setAvailableGradients(fallbackGradients)
      setCurrentGradient(fallbackGradients[0])
      setGradientOptions(fallbackGradients)
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
      
      showToast(`Applied gradient: ${randomGradient.name}`, 'success')
    }
  }, [availableGradients, showToast])
  
  // Select specific gradient
  const selectGradient = useCallback((gradient: Gradient) => {
    setCurrentGradient(gradient)
    showToast(`Applied gradient: ${gradient.name}`, 'success')
  }, [showToast])

  // Convert gradient to color palette
  const gradientToColorPalette = useCallback((gradient: Gradient): ColorPalette => {
    const colors = gradient.colors
    return {
      primary: colors[0] || '#000000',
      secondary: colors[1] || colors[0] || '#666666',
      background: colors[colors.length - 1] || '#FFFFFF'
    }
  }, [])

  // Resolve short URLs by following redirects
  const resolveShortUrl = useCallback(async (url: string): Promise<string> => {
    try {
      // For security and CORS reasons, we'll use a HEAD request to get the redirect
      const response = await fetch(url, { 
        method: 'HEAD',
        redirect: 'manual'
      })
      
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (location) {
          return location
        }
      }
      
      // If no redirect, return original URL
      return url
    } catch (error) {
      console.error('Error resolving short URL:', error)
      // Fallback: try a simple fetch and see where it goes
      try {
        const response = await fetch(url)
        return response.url
      } catch {
        return url
      }
    }
  }, [])

  // Parse Google Maps URL to extract coordinates
  const parseGoogleMapsUrl = useCallback(async (url: string): Promise<{ latitude: string, longitude: string, label?: string } | null> => {
    try {
      let targetUrl = url
      
      // Check if it's a short URL that needs resolution
      if (url.includes('goo.gl/maps') || url.includes('maps.app.goo.gl') || url.includes('g.page')) {
        showToast('Resolving short URL...', 'info')
        targetUrl = await resolveShortUrl(url)
      }
      
      // Handle various Google Maps URL formats
      const patterns = [
        // https://maps.google.com/?q=40.7128,-74.0060
        /[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
        // https://www.google.com/maps/@40.7128,-74.0060,15z
        /@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
        // https://maps.google.com/maps?ll=40.7128,-74.0060
        /[?&]ll=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
        // Place URLs with coordinates
        /place\/([^/]+)\/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/,
        // Another place format
        /\/place\/[^@]*@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/
      ]
      
      for (const pattern of patterns) {
        const match = targetUrl.match(pattern)
        if (match) {
          if (pattern.source.includes('place')) {
            if (match.length >= 4) {
              // For place URLs, try to extract the place name and coordinates
              const placeName = match[1] ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : undefined
              return {
                latitude: match[2],
                longitude: match[3],
                label: placeName
              }
            } else {
              return {
                latitude: match[1],
                longitude: match[2]
              }
            }
          } else {
            return {
              latitude: match[1],
              longitude: match[2]
            }
          }
        }
      }
      
      // Try to extract coordinates from the URL path or query parameters
      const urlObj = new URL(targetUrl)
      const coords = urlObj.pathname.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/) ||
                    urlObj.search.match(/[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/)
      
      if (coords) {
        return {
          latitude: coords[1],
          longitude: coords[2]
        }
      }
      
      return null
    } catch (error) {
      console.error('Error parsing Google Maps URL:', error)
      return null
    }
  }, [resolveShortUrl, showToast])

  // Handle Google Maps URL input
  const handleMapsUrlInput = useCallback(async (url: string) => {
    try {
      const parsed = await parseGoogleMapsUrl(url)
      if (parsed) {
        setLocationData(prev => ({
          ...prev,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          label: parsed.label || prev.label,
          mapsUrl: url
        }))
        showToast('Coordinates extracted from Maps URL!', 'success')
      } else {
        showToast('Could not extract coordinates from this URL', 'error')
      }
    } catch (error) {
      showToast('Error processing Maps URL', 'error')
    }
  }, [parseGoogleMapsUrl, showToast])

  // Step navigation functions
  const selectQRType = useCallback((type: QRCodeType) => {
    setSelectedQRType(type)
    setQrType(type)
    setCurrentStep('form')
    // Reset QR code when selecting new type
    setQrCodeDataUrl(null)
    // Scroll to form section after a brief delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.getElementById('qr-form-section')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])

  const goToStep = useCallback((step: 'select' | 'form' | 'generate' | 'result') => {
    setCurrentStep(step)
    if (step === 'select') {
      setSelectedQRType(null)
      setQrCodeDataUrl(null)
      // Scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 'form') {
      setTimeout(() => {
        const formElement = document.getElementById('qr-form-section')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else if (step === 'result') {
      setTimeout(() => {
        const resultElement = document.getElementById('qr-result-section')
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [])


  // Load gradients on component mount
  useEffect(() => {
    fetchGradients()
  }, [fetchGradients])

  // Handle wizard keyboard events
  useEffect(() => {
    if (currentStep !== 'select') {
      // Handle Escape key to go back to selection
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          goToStep('select')
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [currentStep, goToStep])

  const generateQRData = useCallback((): string => {
    switch (qrType) {
      case 'text':
        return textInput
      case 'url':
        return urlInput
      case 'phone':
        return `tel:${phoneInput}`
      case 'sms':
        return `sms:${smsData.number}${smsData.message ? `?body=${encodeURIComponent(smsData.message)}` : ''}`
      case 'email':
        return `mailto:${emailData.email}${emailData.subject || emailData.body ? '?' : ''}${emailData.subject ? `subject=${encodeURIComponent(emailData.subject)}` : ''}${emailData.subject && emailData.body ? '&' : ''}${emailData.body ? `body=${encodeURIComponent(emailData.body)}` : ''}`
      case 'facetime':
        return `facetime:${phoneInput}`
      case 'whatsapp':
        return `https://wa.me/${phoneInput.replace(/[^0-9]/g, '')}${smsData.message ? `?text=${encodeURIComponent(smsData.message)}` : ''}`
      case 'location':
        // If user wants to use direct Maps link, return the Google Maps URL
        if (locationData.useDirectMapsLink && locationData.mapsUrl) {
          return locationData.mapsUrl
        }
        // Otherwise return standard geo: format
        return `geo:${locationData.latitude},${locationData.longitude}${locationData.label ? `?q=${encodeURIComponent(locationData.label)}` : ''}`
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`
      case 'event':
        const formatDate = (dateStr: string) => dateStr.replace(/[-:]/g, '').replace(/T/, '').replace(/\.\d{3}Z?$/, '') + 'Z'
        const startDate = formatDate(eventData.startDate)
        const endDate = eventData.endDate ? formatDate(eventData.endDate) : startDate
        return `BEGIN:VEVENT\\nSUMMARY:${eventData.title}\\n${eventData.description ? `DESCRIPTION:${eventData.description}\\n` : ''}${eventData.location ? `LOCATION:${eventData.location}\\n` : ''}DTSTART:${startDate}\\nDTEND:${endDate}\\nEND:VEVENT`
      case 'vcard':
        return `BEGIN:VCARD\\nVERSION:3.0\\nFN:${contactData.name}\\n${contactData.phone ? `TEL:${contactData.phone}\\n` : ''}${contactData.email ? `EMAIL:${contactData.email}\\n` : ''}${contactData.organization ? `ORG:${contactData.organization}\\n` : ''}${contactData.url ? `URL:${contactData.url}\\n` : ''}${contactData.address ? `ADR:;;${contactData.address};;;;\\n` : ''}END:VCARD`
      case 'upi':
        const upiParams = new URLSearchParams()
        upiParams.append('pa', upiData.pa)
        upiParams.append('pn', upiData.pn)
        upiParams.append('cu', upiData.cu)
        if (upiData.am) upiParams.append('am', upiData.am)
        if (upiData.mc) upiParams.append('mc', upiData.mc)
        if (upiData.tr) upiParams.append('tr', upiData.tr)
        if (upiData.url) upiParams.append('url', upiData.url)
        if (upiData.tid) upiParams.append('tid', upiData.tid)
        if (upiData.tn) upiParams.append('tn', upiData.tn)
        if (upiData.invoiceNo) upiParams.append('invoiceNo', upiData.invoiceNo)
        if (upiData.invoiceDate) upiParams.append('invoiceDate', upiData.invoiceDate)
        if (upiData.gstIn) upiParams.append('gstIn', upiData.gstIn)
        if (upiData.mam) upiParams.append('mam', upiData.mam)
        return `upi://pay?${upiParams.toString()}`
      default:
        return ''
    }
  }, [qrType, textInput, urlInput, phoneInput, smsData, emailData, wifiData, contactData, upiData, eventData, locationData])

  const validateInput = useCallback((): boolean => {
    switch (qrType) {
      case 'text':
        if (!textInput.trim()) {
          showToast('Please enter text to generate QR code', 'error')
          return false
        }
        break
      case 'url':
        if (!urlInput.trim()) {
          showToast('Please enter a URL to generate QR code', 'error')
          return false
        }
        try {
          new URL(urlInput)
        } catch {
          showToast('Please enter a valid URL', 'error')
          return false
        }
        break
      case 'phone':
      case 'facetime':
        if (!phoneInput.trim()) {
          showToast('Please enter a phone number', 'error')
          return false
        }
        break
      case 'sms':
      case 'whatsapp':
        if (!smsData.number.trim()) {
          showToast('Please enter a phone number', 'error')
          return false
        }
        break
      case 'email':
        if (!emailData.email.trim()) {
          showToast('Please enter an email address', 'error')
          return false
        }
        break
      case 'location':
        if (!locationData.latitude.trim() || !locationData.longitude.trim()) {
          showToast('Please enter latitude and longitude', 'error')
          return false
        }
        break
      case 'wifi':
        if (!wifiData.ssid.trim()) {
          showToast('Please enter WiFi network name (SSID)', 'error')
          return false
        }
        break
      case 'event':
        if (!eventData.title.trim() || !eventData.startDate.trim()) {
          showToast('Please enter event title and start date', 'error')
          return false
        }
        break
      case 'vcard':
        if (!contactData.name.trim() && !contactData.phone.trim() && !contactData.email.trim()) {
          showToast('Please enter at least one contact field', 'error')
          return false
        }
        break
      case 'upi':
        if (!upiData.pa.trim() || !upiData.pn.trim()) {
          showToast('Please enter UPI ID and payee name', 'error')
          return false
        }
        break
    }
    return true
  }, [qrType, textInput, urlInput, phoneInput, smsData, emailData, locationData, wifiData, eventData, contactData, upiData, showToast])

  const generateColorfulQRCode = useCallback(async () => {
    if (!validateInput()) return
    
    setIsGenerating(true)
    const qrData = generateQRData()
    const canvas = canvasRef.current
    
    if (!canvas) {
      setIsGenerating(false)
      return
    }

    try {
      // Determine colors to use (image colors take priority over gradient)
      const colorPalette = extractedColors || 
                          (currentGradient ? gradientToColorPalette(currentGradient) : {
                            primary: '#000000',
                            secondary: '#666666', 
                            background: '#FFFFFF'
                          })

      // If no image and we have a gradient, create QR with gradient
      if (!embeddedImage && currentGradient) {
        // First generate QR code in black/white to get the pattern
        new QRious({
          element: canvas,
          value: qrData,
          size: 400,
          level: 'H',
          foreground: '#000000',
          background: '#FFFFFF'
        })
        
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Get the image data to identify black pixels (QR code pattern)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // Create gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          currentGradient.colors.forEach((color, index) => {
            gradient.addColorStop(index / (currentGradient.colors.length - 1), color)
          })
          
          // Clear canvas and redraw with white background
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Apply gradient only to pixels that were black in the original QR code
          ctx.fillStyle = gradient
          
          // Scan through pixels and draw gradient only where QR code was black
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const index = (y * canvas.width + x) * 4
              // If pixel was black (R, G, B values are low)
              if (data[index] < 128 && data[index + 1] < 128 && data[index + 2] < 128) {
                ctx.fillRect(x, y, 1, 1)
              }
            }
          }
        }
      } else {
        // Generate normal QR code with solid colors
        new QRious({
          element: canvas,
          value: qrData,
          size: 400,
          level: 'H',
          foreground: colorPalette.primary,
          background: colorPalette.background
        })
      }

      // Add embedded image if present
      if (embeddedImage) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          
          img.onload = () => {
            const imageSize = canvas.width * 0.2
            const x = (canvas.width - imageSize) / 2
            const y = (canvas.height - imageSize) / 2
            
            // Create white background circle for image
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, imageSize / 2 + 10, 0, 2 * Math.PI)
            ctx.fillStyle = extractedColors?.background || '#FFFFFF'
            ctx.fill()
            
            // Add border using secondary color
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, imageSize / 2 + 10, 0, 2 * Math.PI)
            ctx.strokeStyle = extractedColors?.secondary || '#666666'
            ctx.lineWidth = 4
            ctx.stroke()
            
            // Draw the image
            ctx.drawImage(img, x, y, imageSize, imageSize)
            
            setQrCodeDataUrl(canvas.toDataURL('image/png'))
            setIsGenerating(false)
          }
          
          img.src = embeddedImage
        }
      } else {
        setQrCodeDataUrl(canvas.toDataURL('image/png'))
        setIsGenerating(false)
      }
      
      const message = extractedColors ? 'Colorful QR code generated successfully!' : 
                     currentGradient ? `QR code generated with ${currentGradient.name} gradient!` : 
                     'QR code generated successfully!'
      showToast(message, 'success')
      // Auto-advance to result step and scroll to QR code
      setCurrentStep('result')
      setTimeout(() => {
        const resultElement = document.getElementById('step-result')
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (error) {
      console.error('Error generating QR code:', error)
      showToast('Error generating QR code', 'error')
      setIsGenerating(false)
    }
  }, [validateInput, generateQRData, embeddedImage, extractedColors, currentGradient, gradientToColorPalette, showToast])

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string
        setEmbeddedImage(imageUrl)
        
        try {
          const colors = await extractColorsFromImage(imageUrl)
          setExtractedColors(colors)
          showToast('Image uploaded and colors extracted!', 'success')
        } catch (error) {
          console.error('Error extracting colors:', error)
          showToast('Image uploaded but color extraction failed', 'error')
        }
      }
      reader.readAsDataURL(file)
    }
  }, [extractColorsFromImage, showToast])

  const removeImage = useCallback(() => {
    setEmbeddedImage(null)
    setExtractedColors(null)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    showToast('Image removed - using gradient mode', 'success')
  }, [showToast])

  const downloadQRCode = useCallback(() => {
    if (!qrCodeDataUrl) {
      showToast('Please generate a QR code first', 'error')
      return
    }
    
    const link = document.createElement('a')
    link.download = `qr-code-${Date.now()}.png`
    link.href = qrCodeDataUrl
    link.click()
    
    showToast('QR code downloaded!', 'success')
  }, [qrCodeDataUrl, showToast])

  const renderInputFields = useCallback(() => {
    switch (qrType) {
      case 'text':
        return (
          <div className="space-y-4">
            <label className="neu-label" htmlFor="text-input">Text Content</label>
            <textarea
              id="text-input"
              className="neu-input min-h-[100px] resize-none"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text to encode in QR code"
            />
          </div>
        )
      case 'url':
        return (
          <div className="space-y-4">
            <label className="neu-label" htmlFor="url-input">URL</label>
            <input
              id="url-input"
              type="url"
              className="neu-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        )
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="neu-label" htmlFor="wifi-ssid">Network Name (SSID)</label>
              <input
                id="wifi-ssid"
                className="neu-input"
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                placeholder="WiFi network name"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="wifi-password">Password</label>
              <input
                id="wifi-password"
                type="password"
                className="neu-input"
                value={wifiData.password}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                placeholder="WiFi password (optional)"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="wifi-encryption">Encryption</label>
              <select
                id="wifi-encryption"
                className="neu-input"
                value={wifiData.encryption}
                onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as WiFiData['encryption'] })}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Encryption</option>
              </select>
            </div>
          </div>
        )
      case 'phone':
      case 'facetime':
        return (
          <div className="space-y-4">
            <label className="neu-label" htmlFor="phone-input">
              {qrType === 'facetime' ? 'FaceTime Number' : 'Phone Number'}
            </label>
            <input
              id="phone-input"
              type="tel"
              className="neu-input"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        )
      case 'sms':
      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <label className="neu-label" htmlFor="sms-number">
                {qrType === 'whatsapp' ? 'WhatsApp Number' : 'Phone Number'}
              </label>
              <input
                id="sms-number"
                type="tel"
                className="neu-input"
                value={smsData.number}
                onChange={(e) => setSmsData({ ...smsData, number: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="sms-message">
                {qrType === 'whatsapp' ? 'WhatsApp Message (Optional)' : 'SMS Message (Optional)'}
              </label>
              <textarea
                id="sms-message"
                className="neu-input min-h-[80px] resize-none"
                value={smsData.message}
                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                placeholder="Enter your message here..."
              />
            </div>
          </div>
        )
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="neu-label" htmlFor="email-address">Email Address</label>
              <input
                id="email-address"
                type="email"
                className="neu-input"
                value={emailData.email}
                onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="email-subject">Subject (Optional)</label>
              <input
                id="email-subject"
                className="neu-input"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="email-body">Message (Optional)</label>
              <textarea
                id="email-body"
                className="neu-input min-h-[100px] resize-none"
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                placeholder="Email message content..."
              />
            </div>
          </div>
        )
      case 'location':
        return (
          <div className="space-y-4">
            {/* Google Maps URL Input */}
            <div>
              <label className="neu-label" htmlFor="maps-url">Google Maps URL (Paste to auto-fill)</label>
              <div className="flex space-x-2">
                <input
                  id="maps-url"
                  type="url"
                  className="neu-input flex-1"
                  placeholder="https://maps.google.com/..."
                  onPaste={(e) => {
                    setTimeout(async () => {
                      const value = e.currentTarget.value
                      if (value) {
                        await handleMapsUrlInput(value)
                      }
                    }, 100)
                  }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    const input = document.getElementById('maps-url') as HTMLInputElement
                    if (input.value) {
                      await handleMapsUrlInput(input.value)
                    }
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Parse
                </button>
              </div>
            </div>
            
            {/* Manual Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="neu-label" htmlFor="location-lat">Latitude</label>
                <input
                  id="location-lat"
                  type="number"
                  step="any"
                  className="neu-input"
                  value={locationData.latitude}
                  onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                  placeholder="40.7128"
                />
              </div>
              <div>
                <label className="neu-label" htmlFor="location-lng">Longitude</label>
                <input
                  id="location-lng"
                  type="number"
                  step="any"
                  className="neu-input"
                  value={locationData.longitude}
                  onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                  placeholder="-74.0060"
                />
              </div>
            </div>
            
            <div>
              <label className="neu-label" htmlFor="location-label">Location Label (Optional)</label>
              <input
                id="location-label"
                className="neu-input"
                value={locationData.label || ''}
                onChange={(e) => setLocationData({ ...locationData, label: e.target.value })}
                placeholder="My Location"
              />
            </div>
            
            {/* QR Code Type Selection */}
            <div>
              <label className="neu-label">QR Code Format</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="location-type"
                    checked={!locationData.useDirectMapsLink}
                    onChange={() => setLocationData({ ...locationData, useDirectMapsLink: false })}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Standard geo: format (works with most apps)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="location-type"
                    checked={locationData.useDirectMapsLink || false}
                    onChange={() => setLocationData({ ...locationData, useDirectMapsLink: true })}
                    className="text-blue-600"
                    disabled={!locationData.mapsUrl}
                  />
                  <span className="text-sm">Direct Google Maps link (opens Maps app directly)</span>
                </label>
              </div>
            </div>
          </div>
        )
      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <label className="neu-label" htmlFor="event-title">Event Title</label>
              <input
                id="event-title"
                className="neu-input"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Meeting with team"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="event-start">Start Date & Time</label>
              <input
                id="event-start"
                type="datetime-local"
                className="neu-input"
                value={eventData.startDate}
                onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="event-end">End Date & Time (Optional)</label>
              <input
                id="event-end"
                type="datetime-local"
                className="neu-input"
                value={eventData.endDate || ''}
                onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="event-description">Description (Optional)</label>
              <textarea
                id="event-description"
                className="neu-input min-h-[80px] resize-none"
                value={eventData.description || ''}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Event description..."
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="event-location">Location (Optional)</label>
              <input
                id="event-location"
                className="neu-input"
                value={eventData.location || ''}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Conference Room A"
              />
            </div>
          </div>
        )
      case 'vcard':
        return (
          <div className="space-y-4">
            <div>
              <label className="neu-label" htmlFor="vcard-name">Full Name</label>
              <input
                id="vcard-name"
                className="neu-input"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="vcard-phone">Phone (Optional)</label>
              <input
                id="vcard-phone"
                type="tel"
                className="neu-input"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="vcard-email">Email (Optional)</label>
              <input
                id="vcard-email"
                type="email"
                className="neu-input"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="vcard-org">Organization (Optional)</label>
              <input
                id="vcard-org"
                className="neu-input"
                value={contactData.organization || ''}
                onChange={(e) => setContactData({ ...contactData, organization: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="vcard-url">Website (Optional)</label>
              <input
                id="vcard-url"
                type="url"
                className="neu-input"
                value={contactData.url || ''}
                onChange={(e) => setContactData({ ...contactData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="vcard-address">Address (Optional)</label>
              <textarea
                id="vcard-address"
                className="neu-input min-h-[80px] resize-none"
                value={contactData.address || ''}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
          </div>
        )
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="neu-label" htmlFor="upi-pa">UPI ID / VPA</label>
              <input
                id="upi-pa"
                className="neu-input"
                value={upiData.pa}
                onChange={(e) => setUpiData({ ...upiData, pa: e.target.value })}
                placeholder="user@paytm"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="upi-pn">Payee Name</label>
              <input
                id="upi-pn"
                className="neu-input"
                value={upiData.pn}
                onChange={(e) => setUpiData({ ...upiData, pn: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="upi-am">Amount (Optional)</label>
              <input
                id="upi-am"
                type="number"
                step="0.01"
                className="neu-input"
                value={upiData.am || ''}
                onChange={(e) => setUpiData({ ...upiData, am: e.target.value })}
                placeholder="500.00"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="upi-tn">Transaction Note (Optional)</label>
              <input
                id="upi-tn"
                className="neu-input"
                value={upiData.tn || ''}
                onChange={(e) => setUpiData({ ...upiData, tn: e.target.value })}
                placeholder="Payment for services"
                maxLength={80}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="neu-label" htmlFor="upi-mc">Merchant Code (Optional)</label>
                <input
                  id="upi-mc"
                  className="neu-input"
                  value={upiData.mc || ''}
                  onChange={(e) => setUpiData({ ...upiData, mc: e.target.value })}
                  placeholder="1234"
                />
              </div>
              <div>
                <label className="neu-label" htmlFor="upi-tr">Transaction Ref (Optional)</label>
                <input
                  id="upi-tr"
                  className="neu-input"
                  value={upiData.tr || ''}
                  onChange={(e) => setUpiData({ ...upiData, tr: e.target.value })}
                  placeholder="TXN123456"
                />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }, [qrType, textInput, urlInput, wifiData, phoneInput, smsData, emailData, locationData, eventData, contactData, upiData, handleMapsUrlInput])


  return (
    <div className="min-h-screen p-6 relative">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="theme-toggle text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">QR Code Generator</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Generate colorful QR codes with embedded images using extracted color palettes</p>
        </div>

        {/* QR Type Selection Cards */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center transition-colors duration-300">Choose QR Code Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {QR_TYPE_CARDS.map((card) => {
              const IconComponent = card.icon
              return (
                <div
                  key={card.type}
                  onClick={() => selectQRType(card.type)}
                  onMouseEnter={(e) => showTooltip(card.description, e)}
                  onMouseLeave={hideTooltip}
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Examples:</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {card.examples.slice(0, 2).map((example, index) => (
                          <span key={index} className="text-xs bg-neu-light dark:bg-neu-dark-light text-gray-600 dark:text-gray-300 px-2 py-1 rounded transition-colors duration-300">
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

        {/* Step 2: Form Section */}
        {currentStep === 'form' && selectedQRType && (
          <div id="qr-form-section" className="mt-12 neu-card">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                {QR_TYPE_CARDS.find(card => card.type === selectedQRType)?.title} QR Code
              </h2>
              <button
                onClick={() => goToStep('select')}
                className="neu-button p-2 w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-8">
              {renderInputFields()}
              
              {/* Gradient Selection */}
              {!embeddedImage && currentGradient && (
                <div>
                  <label className="neu-label">Gradient Themes</label>
                  <div className="bg-neu-light dark:bg-neu-dark-light p-6 rounded-xl space-y-4 transition-colors duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Current: {currentGradient.name}</span>
                        <button
                          onClick={generateRandomGradient}
                          className="neu-button text-sm"
                        >
                          Random
                        </button>
                      </div>
                      <div 
                        className="h-8 rounded border-2 border-gray-300" 
                        style={{ 
                          background: `linear-gradient(135deg, ${currentGradient.colors.join(', ')})` 
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-3">Choose a gradient:</p>
                      <div className="grid grid-cols-1 gap-3">
                        {gradientOptions.map((gradient, index) => (
                          <button
                            key={index}
                            onClick={() => selectGradient(gradient)}
                            className={`p-3 rounded-lg border-2 transition-all hover:border-blue-400 ${
                              currentGradient.name === gradient.name 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-10 h-10 rounded border border-gray-300 flex-shrink-0" 
                                style={{ 
                                  background: `linear-gradient(135deg, ${gradient.colors.join(', ')})` 
                                }}
                              />
                              <span className="text-sm font-medium truncate">{gradient.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Image Upload */}
              <div>
                <label className="neu-label">Embed Image & Extract Colors (Optional)</label>
                <p className="text-sm text-gray-600 mb-3">
                  {embeddedImage 
                    ? 'Image uploaded! Colors extracted for QR code customization.' 
                    : 'Upload an image to extract colors, or use gradients for colorful QR codes'
                  }
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="neu-input"
                />
                {embeddedImage && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-center items-start space-x-6">
                      <img 
                        src={embeddedImage} 
                        alt="Embedded" 
                        className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        onClick={removeImage}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Remove</span>
                      </button>
                    </div>
                    {extractedColors && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-3">Extracted Colors:</h4>
                        <div className="flex space-x-6">
                          <div className="text-center">
                            <div 
                              className="w-12 h-12 rounded-full border-2 border-gray-300 mx-auto"
                              style={{ backgroundColor: extractedColors.primary }}
                            />
                            <p className="text-sm mt-2">Primary</p>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-12 h-12 rounded-full border-2 border-gray-300 mx-auto"
                              style={{ backgroundColor: extractedColors.secondary }}
                            />
                            <p className="text-sm mt-2">Secondary</p>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-12 h-12 rounded-full border-2 border-gray-300 mx-auto"
                              style={{ backgroundColor: extractedColors.background }}
                            />
                            <p className="text-sm mt-2">Background</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => goToStep('select')}
                  className="neu-button"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    generateColorfulQRCode()
                    goToStep('result')
                  }}
                  disabled={isGenerating}
                  className="neu-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </button>
              </div>
              
            </div>
          </div>
        )}

        {/* Step 3: Result Section */}
        {currentStep === 'result' && qrCodeDataUrl && (
          <div id="qr-result-section" className="mt-12 neu-card">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Your {QR_TYPE_CARDS.find(card => card.type === selectedQRType)?.title} QR Code
              </h2>
              <button
                onClick={() => goToStep('select')}
                className="neu-button p-2 w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-8">
              {/* QR Code Display */}
              <div className="text-center">
                <div className="neu-card bg-neu-base dark:bg-neu-dark-base p-6 inline-block">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Generated QR Code" 
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 transition-colors duration-300">
                  {extractedColors ? 'Colorful QR code with extracted colors' : 
                   currentGradient ? `QR code with ${currentGradient.name} gradient` : 
                   'QR code generated successfully'}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => goToStep('form')}
                  className="neu-button flex items-center justify-center gap-2"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={downloadQRCode}
                  disabled={!qrCodeDataUrl}
                  className="neu-button-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiDownload className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={() => goToStep('select')}
                  className="neu-button-primary flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-5 h-5" />
                  New QR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} width={400} height={400} className="hidden" />

      {/* Toast notification */}
      {toast.show && (
        <div className={`neu-toast neu-toast-${toast.type} animate-fade-in`}>
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="ml-2 text-lg font-bold hover:opacity-70 transition-opacity duration-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Tooltip */}
      {tooltip.show && (
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
      )}
    </div>
  )
}

export default App