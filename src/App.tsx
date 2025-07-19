import React, { useState, useRef, useCallback, useEffect } from 'react'
import { FiPlus, FiDownload, FiArrowLeft } from 'react-icons/fi'

// Import types and utilities
import { 
  QRCodeType, 
  WiFiData, 
  ContactData, 
  UPIData, 
  EventData, 
  LocationData,
  ColorPalette,
  Gradient,
  AppStep
} from './types'
import { QR_TYPE_CARDS } from './constants/qrTypes'
import { generateQRData } from './utils/qrDataGenerator'
import { validateQRInput } from './utils/validation'
import { extractColorsFromImage } from './utils/colorUtils'
import { parseGoogleMapsUrl } from './utils/urlUtils'

// Import hooks
import { useToast } from './hooks/useToast'
import { useTooltip } from './hooks/useTooltip'
import { useDarkMode } from './hooks/useDarkMode'
import { useGradients } from './hooks/useGradients'

// Import components
import { QRTypeSelector } from './components/QRTypeSelector'
import { DarkModeToggle } from './components/DarkModeToggle'
import { ToastNotification } from './components/ToastNotification'
import { TooltipDisplay } from './components/TooltipDisplay'
import { QRFormRenderer } from './components/QRFormRenderer'
import { GradientSelector } from './components/GradientSelector'
import { ImageUpload } from './components/ImageUpload'
import { QRCodeGenerator } from './components/QRCodeGenerator'


const App: React.FC = () => {
  // State for form data
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
  
  // State for QR generation
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [embeddedImage, setEmbeddedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<ColorPalette | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // State for UI
  const [currentStep, setCurrentStep] = useState<AppStep>('select')
  const [selectedQRType, setSelectedQRType] = useState<QRCodeType | null>(null)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom hooks
  const { toast, showToast, hideToast } = useToast()
  const { tooltip, showTooltip, hideTooltip } = useTooltip()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { 
    currentGradient, 
    gradientOptions, 
    generateRandomGradient, 
    selectGradient 
  } = useGradients()

  // Handle Google Maps URL input
  const handleMapsUrlInput = useCallback(async (url: string) => {
    try {
      showToast('Resolving Maps URL...', 'info')
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
  }, [showToast])

  // Handle gradient selection with toast feedback
  const handleGradientSelect = useCallback((gradient: Gradient) => {
    const selected = selectGradient(gradient)
    showToast(`Applied gradient: ${selected.name}`, 'success')
  }, [selectGradient, showToast])

  const handleRandomGradient = useCallback(() => {
    const randomGradient = generateRandomGradient()
    if (randomGradient) {
      showToast(`Applied gradient: ${randomGradient.name}`, 'success')
    }
  }, [generateRandomGradient, showToast])


  // Step navigation functions
  const selectQRType = useCallback((type: QRCodeType) => {
    setSelectedQRType(type)
    setQrType(type)
    setCurrentStep('form')
    setQrCodeDataUrl(null)
    setTimeout(() => {
      const formElement = document.getElementById('qr-form-section')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])

  const goToStep = useCallback((step: AppStep) => {
    setCurrentStep(step)
    if (step === 'select') {
      setSelectedQRType(null)
      setQrCodeDataUrl(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])


  // Handle wizard keyboard events
  useEffect(() => {
    if (currentStep !== 'select') {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          goToStep('select')
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [currentStep, goToStep])

  // Generate QR data using utility function
  const getQRData = useCallback((): string => {
    return generateQRData({
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
    })
  }, [qrType, textInput, urlInput, phoneInput, smsData, emailData, wifiData, contactData, upiData, eventData, locationData])

  // Validate input using utility function
  const validateInput = useCallback((): boolean => {
    const validation = validateQRInput({
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
    })
    
    if (!validation.isValid && validation.error) {
      showToast(validation.error, 'error')
    }
    
    return validation.isValid
  }, [qrType, textInput, urlInput, phoneInput, smsData, emailData, wifiData, contactData, upiData, eventData, locationData, showToast])

  // Generate QR code
  const generateQRCode = useCallback(async () => {
    if (!validateInput()) return
    
    setIsGenerating(true)
    const qrData = getQRData()
    
    const message = extractedColors ? 'Colorful QR code generated successfully!' : 
                   currentGradient ? `QR code generated with ${currentGradient.name} gradient!` : 
                   'QR code generated successfully!'
    showToast(message, 'success')
    setCurrentStep('result')
  }, [validateInput, getQRData, extractedColors, currentGradient, showToast])

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
  }, [showToast])

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



  return (
    <div className="min-h-screen p-6 relative">
      {/* Dark Mode Toggle */}
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold mb-2 transition-colors duration-300" style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.85)' : 'rgba(31, 41, 55, 0.85)', textShadow: isDarkMode ? '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.2)'}}>
            QR Code Generator
          </h1>
          <p className="transition-colors duration-300" style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(75, 85, 99, 0.8)'}}>
            Generate colorful QR codes with embedded images using extracted color palettes
          </p>
        </div>

        {/* QR Type Selection */}
        {currentStep === 'select' && (
          <QRTypeSelector
            onSelectType={selectQRType}
            onShowTooltip={showTooltip}
            onHideTooltip={hideTooltip}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Form Section */}
        {currentStep === 'form' && selectedQRType && (
          <div id="qr-form-section" className="mt-12 neu-card">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-3xl font-semibold transition-colors duration-300" style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.85)' : 'rgba(31, 41, 55, 0.85)', textShadow: isDarkMode ? '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.2)'}}>
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
              {/* Form Fields */}
              <QRFormRenderer
                qrType={qrType}
                textInput={textInput}
                urlInput={urlInput}
                phoneInput={phoneInput}
                smsData={smsData}
                emailData={emailData}
                wifiData={wifiData}
                contactData={contactData}
                upiData={upiData}
                eventData={eventData}
                locationData={locationData}
                onTextChange={setTextInput}
                onUrlChange={setUrlInput}
                onPhoneChange={setPhoneInput}
                onSmsDataChange={setSmsData}
                onEmailDataChange={setEmailData}
                onWifiDataChange={setWifiData}
                onContactDataChange={setContactData}
                onUpiDataChange={setUpiData}
                onEventDataChange={setEventData}
                onLocationDataChange={setLocationData}
                onMapsUrlInput={handleMapsUrlInput}
              />
              
              {/* Gradient Selection */}
              {!embeddedImage && currentGradient && (
                <GradientSelector
                  currentGradient={currentGradient}
                  gradientOptions={gradientOptions}
                  onSelectGradient={handleGradientSelect}
                  onGenerateRandom={handleRandomGradient}
                  isDarkMode={isDarkMode}
                  selectedQRType={selectedQRType}
                />
              )}
              
              {/* Image Upload */}
              <ImageUpload
                embeddedImage={embeddedImage}
                extractedColors={extractedColors}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                fileInputRef={fileInputRef}
              />
              
              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => goToStep('select')}
                  className="neu-button"
                >
                  ← Back
                </button>
                <button
                  onClick={generateQRCode}
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
              <h2 className="text-3xl font-semibold transition-colors duration-300" style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.85)' : 'rgba(31, 41, 55, 0.85)', textShadow: isDarkMode ? '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.2)'}}>
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

      {/* QR Code Generator Component */}
      {currentStep === 'result' && (
        <QRCodeGenerator
          qrData={getQRData()}
          embeddedImage={embeddedImage}
          extractedColors={extractedColors}
          currentGradient={currentGradient}
          onQRGenerated={setQrCodeDataUrl}
          onError={(error) => showToast(error, 'error')}
        />
      )}

      {/* Toast notification */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Tooltip */}
      <TooltipDisplay tooltip={tooltip} />
    </div>
  )
}

export default App