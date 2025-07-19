import React from 'react'

interface PhoneFormProps {
  value: string
  onChange: (value: string) => void
  type: 'phone' | 'facetime'
}

export const PhoneForm: React.FC<PhoneFormProps> = ({ value, onChange, type }) => {
  return (
    <div className="space-y-4">
      <label className="neu-label" htmlFor="phone-input">
        {type === 'facetime' ? 'FaceTime Number' : 'Phone Number'}
      </label>
      <input
        id="phone-input"
        type="tel"
        className="neu-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="+1234567890"
      />
    </div>
  )
}