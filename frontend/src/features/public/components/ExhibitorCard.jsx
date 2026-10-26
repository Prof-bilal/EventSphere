import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ExhibitorCard({ item, booths = [] }) {
  const exhibitorBooths = booths.filter((booth) => booth.exhibitorId?._id === item.UserId?._id)
  const initials = (item.CompanyName || 'Ex').trim().slice(0, 2).toUpperCase()

  return (
    <article className="exhibitor-card">
      <div className="exhibitor-card-brand">
        {item.logoUrl ? (
          <img className="exhibitor-card-logo-image" src={item.logoUrl} alt={item.CompanyName} />
        ) : (
          <div className="exhibitor-logo" aria-hidden="true">{initials}</div>
        )}
        <span className="exhibitor-card-category">{item.category || 'General'}</span>
      </div>

      <div className="exhibitor-card-content">
        <h2>{item.CompanyName}</h2>
        <p className="exhibitor-card-description">
          {item.description || 'A featured company bringing new ideas to the event floor.'}
        </p>
        <div className="exhibitor-card-facts">
          <div>
            <span>Products</span>
            <strong>{item.products || 'Not listed'}</strong>
          </div>
          <div>
            <span>Services</span>
            <strong>{item.services || 'Not listed'}</strong>
          </div>
        </div>
      </div>

      <div className="exhibitor-card-connect">
        <span className="exhibitor-card-connect-label">CONNECT</span>
        <div className="exhibitor-card-person">
          <strong>{item.contactPerson || 'Exhibitor team'}</strong>
          {item.phone && <span><Phone size={13} /> {item.phone}</span>}
        </div>
        {exhibitorBooths.length > 0 && (
          <div className="exhibitor-card-booths">
            <MapPin size={13} />
            <span>{exhibitorBooths.map((booth) => `Booth ${booth.boothNumber} · ${booth.floorName || booth.expoId?.title}`).join('  /  ')}</span>
          </div>
        )}
        <div className="exhibitor-card-actions">
          <a href={'mailto:' + item.UserId?.email} aria-label={`Email ${item.CompanyName}`}>
            <Mail size={15} /> Email
          </a>
          <Link to={'/dashboard/messages?userId=' + item.UserId?._id} aria-label={`Message ${item.CompanyName}`}>
            <MessageCircle size={15} /> Message
          </Link>
        </div>
      </div>
    </article>
  )
}
