import React from 'react'
import { WiFiData } from '../../types'

interface WiFiFormProps {
  data: WiFiData
  onChange: (data: WiFiData) => void
}

export const WiFiForm: React.FC<WiFiFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="neu-label" htmlFor="wifi-ssid">Network Name (SSID)</label>
        <input
          id="wifi-ssid"
          className="neu-input"
          value={data.ssid}
          onChange={(e) => onChange({ ...data, ssid: e.target.value })}
          placeholder="WiFi network name"
        />
      </div>
      <div>
        <label className="neu-label" htmlFor="wifi-password">Password</label>
        <input
          id="wifi-password"
          type="password"
          className="neu-input"
          value={data.password}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
          placeholder="WiFi password (optional)"
        />
      </div>
      <div>
        <label className="neu-label" htmlFor="wifi-encryption">Encryption</label>
        <select
          id="wifi-encryption"
          className="neu-input"
          value={data.encryption}
          onChange={(e) => onChange({ ...data, encryption: e.target.value as WiFiData['encryption'] })}
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Encryption</option>
        </select>
      </div>
    </div>
  )
}