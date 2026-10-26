import { Printer } from 'lucide-react'
import { useRef } from 'react'
import { useAuth } from '../../../state/AuthContext'

export default function RegistrationPass({ registration, expo, title }) {
  const { user } = useAuth()
  const passRef = useRef(null)
  if (!registration) return null

  function printPass() {
    passRef.current?.classList.add('printing-target')
    document.body.classList.add('printing-registration-pass')
    window.print()
    window.setTimeout(() => {
      document.body.classList.remove('printing-registration-pass')
      passRef.current?.classList.remove('printing-target')
    }, 500)
  }

  const expoTitle = title || expo?.title || registration.expoId?.title || 'EventSphere event'
  const date = expo?.startDate || registration.expoId?.startDate
  const location = expo?.location || registration.expoId?.location

  return (
    <article ref={passRef} className="registration-pass" aria-label="Printable event pass">
      <div className="registration-pass-profile" aria-label="Attendee profile photo">
        <span className="registration-pass-avatar" aria-hidden="true">
          <span>{user?.name?.trim()?.charAt(0)?.toUpperCase() || '?'}</span>
          {user?.profileImage && (
            <img src={user.profileImage} alt="" onError={(event) => (event.currentTarget.style.display = 'none')} />
          )}
        </span>
      </div>
      <div className="registration-pass-top">
        <div>
          <span className="dash-eyebrow">EVENTSPHERE · ADMISSION PASS</span>
          <h2>{expoTitle}</h2>
          <p>{date ? new Date(date).toLocaleDateString() : 'Event date available in your schedule'}{location ? ` · ${location}` : ''}</p>
        </div>
        <span className="registration-pass-mark">ES</span>
      </div>
      <div className="registration-pass-attendee">
        <span>ATTENDEE</span>
        <strong>{user?.name || 'Event attendee'}</strong>
        <small>{registration.organization || user?.email || 'Welcome to EventSphere'}</small>
      </div>
      <div className="registration-pass-details">
        <div><span>Badge number</span><strong>{registration.badgeNumber || registration.registrationNumber}</strong></div>
        <div><span>Registration</span><strong>#{registration.registrationNumber}</strong></div>
        <div><span>Booth</span><strong>{registration.boothNumber || 'To be assigned'}</strong></div>
        <div><span>Status</span><strong>{registration.attendanceStatus === 'present' ? 'Present' : 'Registered'}</strong></div>
      </div>
      <div className="registration-pass-footer">
        <span>Show this pass at check-in.</span>
        <button className="outline-button pass-print-button" type="button" onClick={printPass}>
          <Printer size={15} /> Print / Save PDF
        </button>
      </div>
    </article>
  )
}
