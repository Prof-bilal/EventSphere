import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, MotionConfig } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, Check, Users, LayoutGrid, ShieldCheck, AlertCircle } from 'lucide-react'
import './auth.css'

const content = {
  login: { label: 'YOUR EVENT WORKSPACE', title: 'Good to see\nyou again.', description: 'Sign in to pick up where you left off.', button: 'Sign in', aside: 'Every great event\nstarts with people.', asideCopy: 'Your plans, your connections, your next big moment. All in one place.' },
  register: { label: 'LET’S BRING PEOPLE TOGETHER', title: 'Find your place.\nMake your mark.', description: 'Create an account for your side of the event.', button: 'Create account', aside: 'A space for\nevery perspective.', asideCopy: 'Behind every great expo are the people who plan it, the brands that show up, and the curious who discover it.' },
  forgot: { label: 'A FRESH START', title: 'Let’s get you\nback in.', description: 'Enter your account email to request a password reset link.', button: 'Send reset link', aside: 'Your next moment\nis waiting for you.', asideCopy: 'A forgotten password shouldn’t get between you and the experience.' },
  reset: { label: 'BACK TO YOUR WORKSPACE', title: 'A new password.\nA fresh start.', description: 'Choose a new password for your EventSphere account.', button: 'Reset password', aside: 'Keep your account\nin good hands.', asideCopy: 'Use a unique password to protect your event plans and connections.' },
}
const accountRoles = [
  { value: 'exhibitor', label: 'Exhibitor', icon: LayoutGrid, description: 'I’m showcasing a brand' },
  { value: 'attendee', label: 'Attendee', icon: Users, description: 'I’m here to discover' },
]

function Field({ label, name, error, password, hint, ...props }) {
  const [visible, setVisible] = useState(false)
  return <div className="auth-field"><label htmlFor={name}>{label}</label><div className="auth-input-wrap"><input id={name} name={name} type={password ? visible ? 'text' : 'password' : props.type || 'text'} {...props} aria-invalid={!!error} aria-describedby={[error ? `${name}-error` : '', hint ? `${name}-hint` : ''].filter(Boolean).join(' ') || undefined}/>{password && <button type="button" className="password-toggle" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button>}</div>{hint && <p id={`${name}-hint`} className="field-hint">{hint}</p>}{error && <p id={`${name}-error`} className="field-error">{error}</p>}</div>
}

export default function AuthPage({ mode }) {
  // A separate form instance ensures values and errors never carry across auth routes.
  return <AuthForm key={mode} mode={mode}/>
}

function AuthForm({ mode }) {
  const c = content[mode]
  const [params] = useSearchParams()
  const roleParam = params.get('role')
  const initialRole = accountRoles.some(r=>r.value === roleParam) ? roleParam : 'attendee'
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '', company: '', role: initialRole })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const formRef = useRef(null)
  const isRegister = mode === 'register'
  const hasPassword = mode !== 'forgot'
  const needsCompany = isRegister && values.role === 'exhibitor'
  const missingToken = mode === 'reset' && !params.get('token')
  useEffect(()=>{document.title = `${mode === 'forgot' ? 'Forgot password' : mode === 'reset' ? 'Reset password' : isRegister ? 'Create account' : 'Sign in'} — EventSphere`;window.scrollTo(0,0)},[mode,isRegister])
  const update = e => {const {name,value} = e.target;setValues(v=>({...v,[name]:value}));setErrors(v=>({...v,[name]:undefined}));setNotice('')}
  const chooseRole = role => {setValues(v=>({...v,role}));setErrors(v=>({...v,company:undefined}));setNotice('')}
  function submit(e) {
    e.preventDefault()
    const next = {}
    if(isRegister && values.name.trim().length < 2) next.name = 'Enter your full name.'
    if(mode !== 'reset' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Enter a valid email address.'
    if(hasPassword && !values.password) next.password = 'Enter your password.'
    else if((isRegister || mode === 'reset') && values.password.length < 8) next.password = 'Use at least 8 characters.'
    if((isRegister || mode === 'reset') && values.confirmPassword !== values.password) next.confirmPassword = 'Your passwords don’t match.'
    if(needsCompany && !values.company.trim()) next.company = 'Enter your company name.'
    setErrors(next)
    if(Object.keys(next).length) {
      const first = Object.keys(next)[0]
      formRef.current?.elements.namedItem(first)?.focus()
      setNotice('')
      return
    }
    if(missingToken) return
    // Never store passwords or simulate an authenticated session in a frontend prototype.
    setNotice(mode === 'forgot' ? 'Email format checked. Sending a reset link requires the authentication service to be connected.' : mode === 'reset' ? 'Password checks passed. The reset link must be verified by the authentication service before your password can be changed.' : isRegister ? 'Your form is ready. Account creation will be available when the authentication service is connected.' : 'Your form is ready. Sign-in will be available when the authentication service is connected.')
  }
  return <MotionConfig reducedMotion="user"><main className={`auth-page auth-${mode}`}>
    <div className="auth-form-side"><header className="auth-header"><Link className="brand" to="/" aria-label="EventSphere home"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>EventSphere</Link><Link className="auth-back" to="/"><ArrowLeft size={14}/> Back to home</Link></header>
    <motion.div className="auth-form-content" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
      <span className="eyebrow"><span className="status-dot"/>{c.label}</span><h1>{c.title}</h1><p className="auth-description">{c.description}</p>
      {missingToken && <div className="auth-alert" role="alert"><AlertCircle size={18}/><p>This page needs a password reset link. <Link to="/forgot-password">Request a new link</Link> to continue.</p></div>}
      <form ref={formRef} onSubmit={submit} noValidate>
        {isRegister && <fieldset className="role-picker"><legend>I’m joining as an</legend><div className="role-options">{accountRoles.map(({value,label,icon:Icon,description})=><label className={values.role === value ? 'role-option selected' : 'role-option'} key={value}><input type="radio" name="role" value={value} checked={values.role === value} onChange={()=>chooseRole(value)}/><Icon size={20} strokeWidth={1.5}/><strong>{label}</strong><span>{description}</span>{values.role === value && <Check className="role-check" size={12}/>}</label>)}</div></fieldset>}
        {isRegister && <div className={needsCompany ? 'auth-field-row' : ''}>
          <Field label="Full name" name="name" value={values.name} onChange={update} autoComplete="name" placeholder="Your full name" error={errors.name} required/>
          {needsCompany && <Field label="Company name" name="company" value={values.company} onChange={update} autoComplete="organization" placeholder="Your company" error={errors.company} required/>}
        </div>}
        {mode !== 'reset' && <Field label="Email address" name="email" type="email" value={values.email} onChange={update} autoComplete="email" placeholder="you@company.com" error={errors.email} required/>}
        {hasPassword && <div className={isRegister ? 'auth-field-row' : 'auth-password-fields'}>
          <Field key={`password-${mode}`} label={mode === 'reset' ? 'New password' : 'Password'} name="password" password value={values.password} onChange={update} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'} error={errors.password} hint={mode === 'reset' ? 'Use at least 8 characters. A unique passphrase works well.' : undefined} required/>
          {(isRegister || mode === 'reset') && <Field label="Confirm password" name="confirmPassword" password value={values.confirmPassword} onChange={update} autoComplete="new-password" placeholder="Repeat your password" error={errors.confirmPassword} required/>}
        </div>}
        {isRegister && <p className="field-hint registration-password-hint">Use at least 8 characters. A unique passphrase works well.</p>}
        {mode === 'login' && <Link className="forgot-link" to="/forgot-password">Forgot your password?</Link>}
        {notice && <div className="auth-notice" role="status"><AlertCircle size={17}/><p>{notice}</p></div>}
        <button className="button button-orange auth-submit" type="submit" disabled={missingToken}>{c.button}<ArrowUpRight size={18}/></button>
      </form>
      <p className="auth-switch">{mode === 'login' ? <>New to EventSphere? <Link to="/register">Create an account</Link></> : isRegister ? <>Already have an account? <Link to="/login">Sign in</Link></> : <Link to="/login"><ArrowLeft size={13}/> Back to sign in</Link>}</p>
      <p className="auth-preview-note">Frontend preview · Authentication is not connected yet.</p>
    </motion.div><footer className="auth-footer"><span>© {new Date().getFullYear()} EventSphere</span><span>Bring people together.</span></footer></div>
    <aside className="auth-story"><div className="auth-story-image"><img src="/assets/expo-hall.png" alt="People coming together at a trade show"/></div><div className="auth-story-content"><span className="eyebrow">GOOD PEOPLE. GREAT CONNECTIONS.</span><h2>{c.aside}</h2><p>{c.asideCopy}</p><div className="auth-story-rule"/><div className="auth-story-roles"><span>For the planners.</span><span>For the brands.</span><span>For the curious.</span></div></div><div className="auth-story-caption"><ShieldCheck size={17}/><span>A place for your next big idea.</span></div></aside>
  </main></MotionConfig>
}
