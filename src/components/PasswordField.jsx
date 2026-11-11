import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ id, label = 'Password', value, onChange, autoComplete = 'current-password', placeholder = '••••••••' }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} className="input pr-12" value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} required />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-300 transition hover:text-white">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
