import { useState } from 'react'

export default function AuthField({ label, name, error, hint, children, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const passwordField = props.type === 'password'
  return <div className="auth-field"><label htmlFor={name}>{label}</label><div className="auth-input-wrap">{children || <input id={name} name={name} type={passwordField && !showPassword ? 'password' : props.type || 'text'} {...props}/>} {passwordField && <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>}</div>{hint && <p className="field-hint">{hint}</p>}{error && <p className="field-error">{error}</p>}</div>
}
