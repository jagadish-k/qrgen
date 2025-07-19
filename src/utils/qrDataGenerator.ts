import { 
  QRCodeType, 
  WiFiData, 
  ContactData, 
  UPIData, 
  EventData, 
  LocationData 
} from '../types'

interface QRDataParams {
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

export const generateQRData = (params: QRDataParams): string => {
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
}