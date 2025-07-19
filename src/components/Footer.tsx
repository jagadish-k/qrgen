import React from 'react'
import { FaCoffee, FaHeart, FaCode } from 'react-icons/fa'

interface FooterProps {
  isDarkMode: boolean
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Footer Content */}
        <div className="bg-neu-light dark:bg-neu-dark-light rounded-2xl p-6 shadow-neu-flat dark:shadow-neu-dark-flat">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Left Side - Copyright and Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCode className="text-blue-500 w-4 h-4" />
                <span className="font-semibold transition-colors duration-300" 
                      style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.9)' : 'rgba(31, 41, 55, 0.9)'}}>
                  QR Gen
                </span>
              </div>
              
              <p className="text-xs transition-colors duration-300" 
                 style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.8)'}}>
                © {currentYear} QR Gen. Made with <FaHeart className="inline w-3 h-3 text-red-500 mx-1" /> 
                for the community.
              </p>
              
              <p className="text-xs transition-colors duration-300" 
                 style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(107, 114, 128, 0.7)'}}>
                Open source under MIT License. Use responsibly.
              </p>
            </div>

            {/* Right Side - Buy Me A Coffee */}
            <div className="flex justify-center md:justify-end">
              <a
                href="https://coff.ee/jagadishk"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-button group flex items-center gap-3 px-6 py-3 hover:scale-105 transition-all duration-200"
              >
                <FaCoffee className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:animate-bounce" />
                <span className="font-medium transition-colors duration-300" 
                      style={{color: isDarkMode ? 'rgba(243, 244, 246, 0.9)' : 'rgba(31, 41, 55, 0.9)'}}>
                  Buy me a coffee
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs transition-colors duration-300" 
             style={{color: isDarkMode ? 'rgba(156, 163, 175, 0.6)' : 'rgba(107, 114, 128, 0.6)'}}>
            This tool generates QR codes locally in your browser. No data is transmitted to external servers.
            <br />
            Please verify QR codes before sharing sensitive information.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center mt-6">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>
    </footer>
  )
}