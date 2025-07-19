import React from 'react'

interface TextFormProps {
  value: string
  onChange: (value: string) => void
}

export const TextForm: React.FC<TextFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="neu-label" htmlFor="text-input">Text Content</label>
      <textarea
        id="text-input"
        className="neu-input min-h-[100px] resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter text to encode in QR code"
      />
    </div>
  )
}