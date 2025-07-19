import React from 'react'
import { SocialMediaData } from '../../types'
import { FaLinkedin, FaInstagram, FaSnapchat } from 'react-icons/fa'
import { IconType } from 'react-icons'

interface SocialMediaFormProps {
  data: SocialMediaData
  onChange: (data: SocialMediaData) => void
}

const PLATFORM_ICONS: Record<SocialMediaData['platform'], IconType[]> = {
  linkedin: [FaLinkedin],
  instagram: [FaInstagram],
  snapchat: [FaSnapchat]
}

const PLATFORM_PLACEHOLDERS: Record<SocialMediaData['platform'], string> = {
  linkedin: 'https://www.linkedin.com/in/yourprofile',
  instagram: 'https://www.instagram.com/yourusername',
  snapchat: 'https://www.snapchat.com/add/yourusername'
}

export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ data, onChange }) => {
  const availableIcons = PLATFORM_ICONS[data.platform]
  const placeholder = PLATFORM_PLACEHOLDERS[data.platform]

  // Auto-select the first available icon if none is selected or platform changed
  React.useEffect(() => {
    if (availableIcons.length > 0) {
      // Always set the icon when platform changes or if none is selected
      if (!data.selectedIcon || !availableIcons.includes(data.selectedIcon)) {
        onChange({ ...data, selectedIcon: availableIcons[0] })
      }
    }
  }, [data.platform, availableIcons, onChange, data])

  const handleUrlChange = (url: string) => {
    let formattedUrl = url.trim()
    
    // Auto-format platform URLs for compatibility
    if (data.platform === 'instagram') {
      // If user enters just username, convert to full URL
      if (formattedUrl && !formattedUrl.startsWith('http')) {
        // Remove @ if present
        formattedUrl = formattedUrl.replace(/^@/, '')
        formattedUrl = `https://www.instagram.com/${formattedUrl}`
      }
      // Ensure consistent instagram.com format
      else if (formattedUrl.includes('instagram.com')) {
        formattedUrl = formattedUrl.replace(/https?:\/\/(www\.)?instagram\.com/, 'https://www.instagram.com')
      }
    } else if (data.platform === 'linkedin') {
      // If user enters just username, convert to full URL
      if (formattedUrl && !formattedUrl.startsWith('http')) {
        formattedUrl = formattedUrl.replace(/^@/, '')
        formattedUrl = `https://www.linkedin.com/in/${formattedUrl}`
      }
      // Ensure consistent linkedin.com format
      else if (formattedUrl.includes('linkedin.com')) {
        formattedUrl = formattedUrl.replace(/https?:\/\/(www\.)?linkedin\.com/, 'https://www.linkedin.com')
      }
    } else if (data.platform === 'snapchat') {
      // If user enters just username, convert to full URL
      if (formattedUrl && !formattedUrl.startsWith('http')) {
        formattedUrl = formattedUrl.replace(/^@/, '')
        formattedUrl = `https://www.snapchat.com/add/${formattedUrl}`
      }
      // Ensure consistent snapchat.com format
      else if (formattedUrl.includes('snapchat.com')) {
        formattedUrl = formattedUrl.replace(/https?:\/\/(www\.)?snapchat\.com/, 'https://www.snapchat.com')
      }
    }
    
    onChange({ ...data, url: formattedUrl })
  }

  const handleIconSelect = (icon: IconType) => {
    onChange({ ...data, selectedIcon: icon })
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div>
        <label className="neu-label">
          {data.platform.charAt(0).toUpperCase() + data.platform.slice(1)} Profile (Username or URL)
        </label>
        <input
          type="text"
          value={data.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={
            data.platform === 'instagram' ? 'username or https://www.instagram.com/username' :
            data.platform === 'linkedin' ? 'username or https://www.linkedin.com/in/username' :
            'username or https://www.snapchat.com/add/username'
          }
          className="neu-input"
        />
        <p className="text-xs mt-2 transition-colors duration-300" style={{color: 'rgba(107, 114, 128, 0.7)'}}>
          Enter your {data.platform} username (e.g., "myusername") or full URL. We'll format it correctly for the official {data.platform} app.
        </p>
      </div>

      {/* Icon Selection */}
      <div>
        <label className="neu-label">Logo Selection</label>
        <div className="neu-card bg-neu-light dark:bg-neu-dark-light p-4">
          <p className="text-sm mb-4 transition-colors duration-300" style={{color: 'rgba(107, 114, 128, 0.8)'}}>
            Choose the logo that will be embedded in the center of your QR code
          </p>
          <div className="flex gap-3">
            {availableIcons.map((IconComponent, index) => (
              <button
                key={index}
                onClick={() => handleIconSelect(IconComponent)}
                className={`p-4 rounded-lg transition-all duration-200 ${ 
                  data.selectedIcon === IconComponent 
                    ? 'bg-blue-500 text-white scale-105' 
                    : 'neu-button hover:scale-105'
                }`}
                type="button"
              >
                <IconComponent className="w-8 h-8" />
              </button>
            ))}
          </div>
          {data.selectedIcon && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <data.selectedIcon className="w-4 h-4 inline mr-2" />
                Selected logo will be embedded in the QR code center
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}