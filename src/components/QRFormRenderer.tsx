import React from 'react'
import { QRCodeType, WiFiData, ContactData, UPIData, EventData, LocationData } from '../types'
import { TextForm, URLForm, PhoneForm, WiFiForm } from './forms'

interface QRFormRendererProps {
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
  onTextChange: (value: string) => void
  onUrlChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onSmsDataChange: (data: { number: string; message: string }) => void
  onEmailDataChange: (data: { email: string; subject: string; body: string }) => void
  onWifiDataChange: (data: WiFiData) => void
  onContactDataChange: (data: ContactData) => void
  onUpiDataChange: (data: UPIData) => void
  onEventDataChange: (data: EventData) => void
  onLocationDataChange: (data: LocationData) => void
  onMapsUrlInput: (url: string) => Promise<void>
}

export const QRFormRenderer: React.FC<QRFormRendererProps> = ({
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
  locationData,
  onTextChange,
  onUrlChange,
  onPhoneChange,
  onSmsDataChange,
  onEmailDataChange,
  onWifiDataChange,
  onContactDataChange,
  onUpiDataChange,
  onEventDataChange,
  onLocationDataChange,
  onMapsUrlInput
}) => {
  switch (qrType) {
    case 'text':
      return <TextForm value={textInput} onChange={onTextChange} />

    case 'url':
      return <URLForm value={urlInput} onChange={onUrlChange} />

    case 'phone':
    case 'facetime':
      return <PhoneForm value={phoneInput} onChange={onPhoneChange} type={qrType} />

    case 'wifi':
      return <WiFiForm data={wifiData} onChange={onWifiDataChange} />

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
              onChange={(e) => onSmsDataChange({ ...smsData, number: e.target.value })}
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
              onChange={(e) => onSmsDataChange({ ...smsData, message: e.target.value })}
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
              onChange={(e) => onEmailDataChange({ ...emailData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="email-subject">Subject (Optional)</label>
            <input
              id="email-subject"
              className="neu-input"
              value={emailData.subject}
              onChange={(e) => onEmailDataChange({ ...emailData, subject: e.target.value })}
              placeholder="Email subject"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="email-body">Message (Optional)</label>
            <textarea
              id="email-body"
              className="neu-input min-h-[100px] resize-none"
              value={emailData.body}
              onChange={(e) => onEmailDataChange({ ...emailData, body: e.target.value })}
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
                      await onMapsUrlInput(value)
                    }
                  }, 100)
                }}
              />
              <button
                type="button"
                onClick={async () => {
                  const input = document.getElementById('maps-url') as HTMLInputElement
                  if (input.value) {
                    await onMapsUrlInput(input.value)
                  }
                }}
                className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-2 rounded text-sm font-medium transition-colors"
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
                onChange={(e) => onLocationDataChange({ ...locationData, latitude: e.target.value })}
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
                onChange={(e) => onLocationDataChange({ ...locationData, longitude: e.target.value })}
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
              onChange={(e) => onLocationDataChange({ ...locationData, label: e.target.value })}
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
                  onChange={() => onLocationDataChange({ ...locationData, useDirectMapsLink: false })}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Standard geo: format (works with most apps)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="location-type"
                  checked={locationData.useDirectMapsLink || false}
                  onChange={() => onLocationDataChange({ ...locationData, useDirectMapsLink: true })}
                  className="text-blue-600"
                  disabled={!locationData.mapsUrl}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Direct Google Maps link (opens Maps app directly)</span>
              </label>
            </div>
          </div>
        </div>
      )

    // Add other form types as needed
    default:
      return <div className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Form for {qrType} not implemented yet</div>
  }
}