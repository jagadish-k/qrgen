import React from 'react'

interface URLFormProps {
  value: string
  onChange: (value: string) => void
}

export const URLForm: React.FC<URLFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="neu-label" htmlFor="url-input">URL</label>
      <input
        id="url-input"
        type="url"
        className="neu-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
      />
    </div>
  )
}