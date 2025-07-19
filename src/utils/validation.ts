import { 
  QRCodeType, 
  WiFiData, 
  ContactData, 
  UPIData, 
  EventData, 
  LocationData 
} from '../types'

interface ValidationParams {
  qrType: QRCodeType
  textInput: string
  urlInput: string
  phoneInput: string
  smsData: { number: string; message: string }
  emailData: { email: string; subject: string; body: string }
  wifiData: WiFiData
  contactData: ContactData
  upiData: UPIData
  eventData: EventData
  locationData: LocationData
}

export const validateQRInput = (params: ValidationParams): { isValid: boolean; error?: string } => {
  const {
    qrType,
    textInput,
    urlInput,
    phoneInput,
    smsData,
    emailData,
    wifiData,
    contactData,
    upiData,
    eventData,
    locationData
  } = params

  switch (qrType) {
    case 'text':
      if (!textInput.trim()) {
        return { isValid: false, error: 'Please enter text to generate QR code' }
      }
      break

    case 'url':
      if (!urlInput.trim()) {
        return { isValid: false, error: 'Please enter a URL to generate QR code' }
      }
      try {
        new URL(urlInput)
      } catch {
        return { isValid: false, error: 'Please enter a valid URL' }
      }
      break

    case 'phone':
    case 'facetime':
      if (!phoneInput.trim()) {
        return { isValid: false, error: 'Please enter a phone number' }
      }
      break

    case 'sms':
    case 'whatsapp':
      if (!smsData.number.trim()) {
        return { isValid: false, error: 'Please enter a phone number' }
      }
      break

    case 'email':
      if (!emailData.email.trim()) {
        return { isValid: false, error: 'Please enter an email address' }
      }
      break

    case 'location':
      if (!locationData.latitude.trim() || !locationData.longitude.trim()) {
        return { isValid: false, error: 'Please enter latitude and longitude' }
      }
      break

    case 'wifi':
      if (!wifiData.ssid.trim()) {
        return { isValid: false, error: 'Please enter WiFi network name (SSID)' }
      }
      break

    case 'event':
      if (!eventData.title.trim() || !eventData.startDate.trim()) {
        return { isValid: false, error: 'Please enter event title and start date' }
      }
      break

    case 'vcard':
      if (!contactData.firstName.trim() && !contactData.lastName.trim() && !contactData.phone.trim() && !contactData.email.trim()) {
        return { isValid: false, error: 'Please enter at least first name, last name, phone, or email' }
      }
      break

    case 'upi':
      if (!upiData.pa.trim() || !upiData.pn.trim()) {
        return { isValid: false, error: 'Please enter UPI ID and payee name' }
      }
      break
  }

  return { isValid: true }
}