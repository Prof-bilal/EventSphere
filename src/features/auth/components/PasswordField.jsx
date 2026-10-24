import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ label = 'Password', name, value, onChange, error, placeholder, hint }) {
  const [visible, setVisible] = useState(false)
  return <div className="auth-field"><label htmlFor={name}>{label}</label><div className="auth-input-wrap"><input id={name} name={name} type={visible ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)}/><button type="button" className="password-toggle" onClick={() => setVisible(value => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>{hint && <p className="field-hint">{hint}</p>}{error && <p className="field-error">{error}</p>}</div>
}
