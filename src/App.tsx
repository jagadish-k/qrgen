import React, { useState, useRef, useCallback, useEffect } from 'react'
import { FiPlus, FiDownload, FiArrowLeft, FiX, FiRefreshCw } from 'react-icons/fi'

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
  const [activeTab, setActiveTab] = useState<'gradient' | 'image'>('gradient')

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
  }, [selectGradient, showToast])

  const handleRandomGradient = useCallback(() => {
    const randomGradient = generateRandomGradient()
    if (randomGradient) {
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
    
    // Stay in form step for 2-column layout, but set result step internally for generator
    if (currentStep === 'form') {
      setCurrentStep('result')
    }
  }, [validateInput, getQRData, currentStep])

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string
        setEmbeddedImage(imageUrl)
        setActiveTab('image') // Switch to image tab when image is uploaded
        
        try {
          const colors = await extractColorsFromImage(imageUrl)
          setExtractedColors(colors)
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
    setActiveTab('gradient') // Switch back to gradient tab when image is removed
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

        {/* Main Layout Container */}
        <div className={`flex gap-6 transition-all duration-500 ${qrCodeDataUrl ? 'lg:flex-row flex-col-reverse' : 'flex-col'}`}>
          {/* Left Column - Forms and Selection */}
          <div className={`transition-all duration-500 ${qrCodeDataUrl ? 'lg:w-1/2 w-full' : 'w-full'}`}>
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
            {(currentStep === 'form' || currentStep === 'result') && selectedQRType && (
          <div id="qr-form-section" className="mt-12 neu-card">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-3xl font-semibold transition-colors duration-300" style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.85)' : 'rgba(31, 41, 55, 0.85)', textShadow: isDarkMode ? '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.2)'}}>
                {QR_TYPE_CARDS.find(card => card.type === selectedQRType)?.title} QR Code
              </h2>
              <button
                onClick={() => goToStep('select')}
                className="neu-button p-2 w-10 h-10 flex items-center justify-center rounded-full"
                type="button"
              >
                <FiX className="w-5 h-5" />
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
              
              {/* Color & Style Options */}
              <div className="neu-card">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex bg-neu-light dark:bg-neu-dark-light rounded-xl p-1">
                    <button
                      onClick={() => setActiveTab('gradient')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'gradient' 
                          ? 'bg-neu-base dark:bg-neu-dark-base shadow-neu-pressed dark:shadow-neu-dark-pressed' 
                          : 'hover:bg-neu-base dark:hover:bg-neu-dark-base'
                      }`}
                      style={{color: isDarkMode ? 'rgba(229, 231, 235, 0.8)' : 'rgba(55, 65, 81, 0.8)'}}
                    >
                      Gradient Themes
                    </button>
                    <button
                      onClick={() => setActiveTab('image')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'image' 
                          ? 'bg-neu-base dark:bg-neu-dark-base shadow-neu-pressed dark:shadow-neu-dark-pressed' 
                          : 'hover:bg-neu-base dark:hover:bg-neu-dark-base'
                      }`}
                      style={{color: isDarkMode ? 'rgba(229, 231, 235, 0.8)' : 'rgba(55, 65, 81, 0.8)'}}
                    >
                      Image Colors
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'gradient' ? (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm transition-colors duration-300" style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.8)'}}>
                        Choose from hundreds of beautiful gradient themes for your QR code
                      </p>
                    </div>
                    {currentGradient && (
                      <GradientSelector
                        currentGradient={currentGradient}
                        gradientOptions={gradientOptions}
                        onSelectGradient={handleGradientSelect}
                        onGenerateRandom={handleRandomGradient}
                        isDarkMode={isDarkMode}
                        selectedQRType={selectedQRType}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm transition-colors duration-300" style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.8)'}}>
                        Upload an image to extract colors automatically for your QR code
                      </p>
                    </div>
                    <ImageUpload
                      embeddedImage={embeddedImage}
                      extractedColors={extractedColors}
                      onImageUpload={handleImageUpload}
                      onRemoveImage={removeImage}
                      fileInputRef={fileInputRef}
                    />
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
                  onClick={generateQRCode}
                  disabled={isGenerating}
                  className="neu-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    'Generating...'
                  ) : qrCodeDataUrl ? (
                    <>
                      <FiRefreshCw className="w-4 h-4" />
                      Regenerate QR Code
                    </>
                  ) : (
                    'Generate QR Code'
                  )}
                </button>
              </div>
            </div>
          </div>
            )}
          </div>

          {/* Right Column - QR Code Display */}
          {qrCodeDataUrl && (
            <div className="lg:w-1/2 w-full transition-all duration-500">
              <div className="neu-card lg:sticky lg:top-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-2xl font-semibold transition-colors duration-300" style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.85)' : 'rgba(31, 41, 55, 0.85)', textShadow: isDarkMode ? '1px 1px 2px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.6)' : '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.2)'}}>
                    Your QR Code
                  </h2>
                  <button
                    onClick={() => {
                      setQrCodeDataUrl('')
                      setCurrentStep('form')
                    }}
                    className="neu-button p-2 w-10 h-10 flex items-center justify-center rounded-full"
                    type="button"
                    title="Clear QR Code"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* QR Code and Action Panel Layout */}
                  <div className="flex items-center gap-4">
                    {/* QR Code Display */}
                    <div className="flex-1 flex justify-center">
                      <div className="neu-card bg-neu-base dark:bg-neu-dark-base p-6 w-full max-w-sm">
                        <img 
                          src={qrCodeDataUrl} 
                          alt="Generated QR Code" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                    
                    {/* Calculator-style Action Panel */}
                    <div className="flex flex-col gap-2">
                      {/* Download Button */}
                      <button
                        onClick={downloadQRCode}
                        disabled={!qrCodeDataUrl}
                        className="w-16 h-16 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                        style={{
                          background: isDarkMode 
                            ? 'linear-gradient(145deg, #3a3d47, #2c2f36)' 
                            : 'linear-gradient(145deg, #ffffff, #e0e7f0)',
                          boxShadow: isDarkMode
                            ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                            : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? 'inset 3px 3px 6px #2c2f36, inset -3px -3px 6px #3a3d47'
                            : 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff'
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                            : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                            : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                        }}
                        title="Download PNG"
                      >
                        <FiDownload 
                          className="w-6 h-6 transition-colors duration-200" 
                          style={{color: isDarkMode ? 'rgba(34, 197, 94, 0.8)' : 'rgba(21, 128, 61, 0.8)'}}
                        />
                      </button>

                      {/* Create New Button */}
                      <button
                        onClick={() => goToStep('select')}
                        className="w-16 h-16 rounded-xl transition-all duration-200 flex items-center justify-center group"
                        style={{
                          background: isDarkMode 
                            ? 'linear-gradient(145deg, #3a3d47, #2c2f36)' 
                            : 'linear-gradient(145deg, #ffffff, #e0e7f0)',
                          boxShadow: isDarkMode
                            ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                            : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? 'inset 3px 3px 6px #2c2f36, inset -3px -3px 6px #3a3d47'
                            : 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff'
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                            : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = isDarkMode
                            ? '6px 6px 12px #2c2f36, -6px -6px 12px #3a3d47'
                            : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff'
                        }}
                        title="Create New QR"
                      >
                        <FiPlus 
                          className="w-6 h-6 transition-colors duration-200" 
                          style={{color: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)'}}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Generator Component */}
      {(currentStep === 'form' || currentStep === 'result') && (
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