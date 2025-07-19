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
      // Create comprehensive vCard 3.0 format
      const fullName = `${contactData.firstName} ${contactData.lastName}`.trim()
      let vcard = `BEGIN:VCARD\nVERSION:3.0\n`
      
      // Full name and formatted name
      vcard += `FN:${fullName}\n`
      vcard += `N:${contactData.lastName || ''};${contactData.firstName || ''};;;\n`
      
      // Phone numbers
      if (contactData.phone) {
        vcard += `TEL;TYPE=CELL:${contactData.phone}\n`
      }
      if (contactData.workPhone) {
        vcard += `TEL;TYPE=WORK:${contactData.workPhone}\n`
      }
      if (contactData.fax) {
        vcard += `TEL;TYPE=FAX:${contactData.fax}\n`
      }
      
      // Email
      if (contactData.email) {
        vcard += `EMAIL;TYPE=INTERNET:${contactData.email}\n`
      }
      
      // Organization and title
      if (contactData.organization) {
        const orgParts = [contactData.organization]
        if (contactData.department) {
          orgParts.push(contactData.department)
        }
        vcard += `ORG:${orgParts.join(';')}\n`
      }
      if (contactData.jobTitle) {
        vcard += `TITLE:${contactData.jobTitle}\n`
      }
      
      // Address
      if (contactData.street || contactData.city || contactData.state || contactData.postalCode || contactData.country) {
        const addressParts = [
          '', // PO Box (empty)
          '', // Extended address (empty)
          contactData.street || '',
          contactData.city || '',
          contactData.state || '',
          contactData.postalCode || '',
          contactData.country || ''
        ]
        vcard += `ADR;TYPE=HOME:${addressParts.join(';')}\n`
      }
      
      // Website
      if (contactData.website) {
        vcard += `URL:${contactData.website}\n`
      }
      
      // Birthday
      if (contactData.birthday) {
        // Convert YYYY-MM-DD to vCard format (YYYYMMDD)
        const birthday = contactData.birthday.replace(/-/g, '')
        vcard += `BDAY:${birthday}\n`
      }
      
      // Notes
      if (contactData.notes) {
        vcard += `NOTE:${contactData.notes.replace(/\n/g, '\\n')}\n`
      }
      
      vcard += `END:VCARD`
      return vcard

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