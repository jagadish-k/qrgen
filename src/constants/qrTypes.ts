import { 
  FiEdit3, FiGlobe, FiPhone, FiMessageSquare, FiMail, 
  FiVideo, FiMessageCircle, FiMapPin, FiWifi, FiCalendar, 
  FiUser, FiCreditCard
} from 'react-icons/fi'
import { QRTypeCard } from '../types'

export const QR_TYPE_CARDS: QRTypeCard[] = [
  {
    type: 'text',
    title: 'Plain Text',
    description: 'Share any text content',
    icon: FiEdit3,
    hoverColor: 'hover:border-blue-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    examples: ['Messages', 'Notes', 'Quotes']
  },
  {
    type: 'url',
    title: 'Website URL',
    description: 'Link to websites or web pages',
    icon: FiGlobe,
    hoverColor: 'hover:border-green-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    examples: ['https://example.com', 'Social media links']
  },
  {
    type: 'phone',
    title: 'Phone Number',
    description: 'Direct phone call link',
    icon: FiPhone,
    hoverColor: 'hover:border-red-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    examples: ['+1234567890', 'Business numbers']
  },
  {
    type: 'sms',
    title: 'SMS Message',
    description: 'Pre-filled text message',
    icon: FiMessageSquare,
    hoverColor: 'hover:border-purple-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    examples: ['Contact info requests', 'Quick messages']
  },
  {
    type: 'email',
    title: 'Email',
    description: 'Pre-composed email with subject',
    icon: FiMail,
    hoverColor: 'hover:border-orange-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    examples: ['Contact forms', 'Support emails']
  },
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    description: 'Direct WhatsApp message',
    icon: FiMessageCircle,
    hoverColor: 'hover:border-green-500',
    glowColor: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
    examples: ['Customer support', 'Quick chat']
  },
  {
    type: 'location',
    title: 'Location',
    description: 'GPS coordinates or Maps link',
    icon: FiMapPin,
    hoverColor: 'hover:border-cyan-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    examples: ['Meeting points', 'Business address']
  },
  {
    type: 'wifi',
    title: 'WiFi Network',
    description: 'Instant WiFi connection',
    icon: FiWifi,
    hoverColor: 'hover:border-indigo-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    examples: ['Guest networks', 'Office WiFi']
  },
  {
    type: 'event',
    title: 'Calendar Event',
    description: 'Add events to calendar',
    icon: FiCalendar,
    hoverColor: 'hover:border-pink-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    examples: ['Meetings', 'Appointments', 'Reminders']
  },
  {
    type: 'vcard',
    title: 'Contact Card',
    description: 'Complete contact information',
    icon: FiUser,
    hoverColor: 'hover:border-yellow-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    examples: ['Business cards', 'Personal contacts']
  },
  {
    type: 'upi',
    title: 'UPI Payment',
    description: 'Indian digital payments',
    icon: FiCreditCard,
    hoverColor: 'hover:border-emerald-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    examples: ['Business payments', 'Personal transfers']
  },
  {
    type: 'facetime',
    title: 'FaceTime',
    description: 'Apple FaceTime video call',
    icon: FiVideo,
    hoverColor: 'hover:border-gray-400',
    glowColor: 'hover:shadow-[0_0_20px_rgba(107,114,128,0.3)]',
    examples: ['Video meetings', 'Family calls']
  }
]

export const FALLBACK_GRADIENTS = [
  { name: 'Ocean Blue', colors: ['#2E3192', '#1BFFFF'] },
  { name: 'Sunset', colors: ['#FF512F', '#F09819'] },
  { name: 'Purple Dream', colors: ['#8360c3', '#2ebf91'] },
  { name: 'Pink Flamingo', colors: ['#f093fb', '#f5576c'] },
  { name: 'Green Tea', colors: ['#11998e', '#38ef7d'] }
]