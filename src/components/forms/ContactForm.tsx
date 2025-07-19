import React from 'react'
import { ContactData } from '../../types'

interface ContactFormProps {
  data: ContactData
  onChange: (data: ContactData) => void
}

export const ContactForm: React.FC<ContactFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="neu-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="neu-label" htmlFor="contact-firstName">First Name *</label>
            <input
              id="contact-firstName"
              className="neu-input"
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-lastName">Last Name *</label>
            <input
              id="contact-lastName"
              className="neu-input"
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="neu-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="neu-label" htmlFor="contact-phone">Mobile Phone *</label>
            <input
              id="contact-phone"
              type="tel"
              className="neu-input"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-workPhone">Work Phone</label>
            <input
              id="contact-workPhone"
              type="tel"
              className="neu-input"
              value={data.workPhone || ''}
              onChange={(e) => onChange({ ...data, workPhone: e.target.value })}
              placeholder="+1 (555) 987-6543"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-fax">Fax</label>
            <input
              id="contact-fax"
              type="tel"
              className="neu-input"
              value={data.fax || ''}
              onChange={(e) => onChange({ ...data, fax: e.target.value })}
              placeholder="+1 (555) 111-2222"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              type="email"
              className="neu-input"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="url"
              className="neu-input"
              value={data.website || ''}
              onChange={(e) => onChange({ ...data, website: e.target.value })}
              placeholder="https://johndoe.com"
            />
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="neu-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Work Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="neu-label" htmlFor="contact-organization">Organization</label>
            <input
              id="contact-organization"
              className="neu-input"
              value={data.organization || ''}
              onChange={(e) => onChange({ ...data, organization: e.target.value })}
              placeholder="Acme Corporation"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-jobTitle">Job Title</label>
            <input
              id="contact-jobTitle"
              className="neu-input"
              value={data.jobTitle || ''}
              onChange={(e) => onChange({ ...data, jobTitle: e.target.value })}
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-department">Department</label>
            <input
              id="contact-department"
              className="neu-input"
              value={data.department || ''}
              onChange={(e) => onChange({ ...data, department: e.target.value })}
              placeholder="Engineering"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="neu-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Address Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="neu-label" htmlFor="contact-street">Street Address</label>
            <input
              id="contact-street"
              className="neu-input"
              value={data.street || ''}
              onChange={(e) => onChange({ ...data, street: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="neu-label" htmlFor="contact-city">City</label>
              <input
                id="contact-city"
                className="neu-input"
                value={data.city || ''}
                onChange={(e) => onChange({ ...data, city: e.target.value })}
                placeholder="New York"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="contact-state">State/Province</label>
              <input
                id="contact-state"
                className="neu-input"
                value={data.state || ''}
                onChange={(e) => onChange({ ...data, state: e.target.value })}
                placeholder="NY"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="neu-label" htmlFor="contact-postalCode">Postal Code</label>
              <input
                id="contact-postalCode"
                className="neu-input"
                value={data.postalCode || ''}
                onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
                placeholder="10001"
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="contact-country">Country</label>
              <input
                id="contact-country"
                className="neu-input"
                value={data.country || ''}
                onChange={(e) => onChange({ ...data, country: e.target.value })}
                placeholder="United States"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="neu-card">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          Additional Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="neu-label" htmlFor="contact-birthday">Birthday</label>
            <input
              id="contact-birthday"
              type="date"
              className="neu-input"
              value={data.birthday || ''}
              onChange={(e) => onChange({ ...data, birthday: e.target.value })}
            />
          </div>
          <div>
            <label className="neu-label" htmlFor="contact-notes">Notes</label>
            <textarea
              id="contact-notes"
              className="neu-input"
              rows={3}
              value={data.notes || ''}
              onChange={(e) => onChange({ ...data, notes: e.target.value })}
              placeholder="Additional notes about this contact..."
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
        <p>* Required fields. All other information is optional but helps create a more complete contact card.</p>
        <p>The generated QR code will contain all filled information in vCard format, compatible with all major smartphones.</p>
      </div>
    </div>
  )
}