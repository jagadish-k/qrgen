import { IconType } from 'react-icons'

export interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

export interface ContactData {
  // Basic info
  firstName: string
  lastName: string
  phone: string
  email: string
  
  // Optional fields
  organization?: string
  jobTitle?: string
  department?: string
  website?: string
  
  // Additional phone numbers
  workPhone?: string
  fax?: string
  
  // Address information
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  
  // Social/Additional
  notes?: string
  birthday?: string // YYYY-MM-DD format
}

export interface UPIData {
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

export interface EventData {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
  allDay?: boolean
}

export interface LocationData {
  latitude: string
  longitude: string
  label?: string
  mapsUrl?: string
  useDirectMapsLink?: boolean
}

export interface SocialMediaData {
  url: string
  platform: 'linkedin' | 'instagram' | 'snapchat'
  selectedIcon?: IconType
}

export type QRCodeType = 'text' | 'url' | 'phone' | 'sms' | 'email' | 'facetime' | 'whatsapp' | 'location' | 'wifi' | 'event' | 'vcard' | 'upi' | 'linkedin' | 'instagram' | 'snapchat'

export interface QRTypeCard {
  type: QRCodeType
  title: string
  description: string
  icon: IconType
  hoverColor: string
  glowColor: string
  examples?: string[]
}

export interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
}

export interface ColorPalette {
  primary: string
  secondary: string
  background: string
}

export interface Gradient {
  name: string
  colors: string[]
  angle?: number // For custom gradients
  isCustom?: boolean
}

export interface Tooltip {
  text: string
  x: number
  y: number
  show: boolean
}

export type AppStep = 'select' | 'form' | 'generate' | 'result'