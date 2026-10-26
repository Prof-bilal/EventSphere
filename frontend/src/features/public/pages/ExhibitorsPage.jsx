import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api'
import { PublicLayout } from '../components/PublicComponents'

export default function ExhibitorsPage() {
  const [exhibitors, setExhibitors] = useState([])
  const [booths, setBooths] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadExhibitors() {
      try {
        setExhibitors(await api('/exhibitor/search'))
        setBooths(await api('/booth/public'))
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    loadExhibitors()
    window.addEventListener('event-updated', loadExhibitors)
    return () => window.removeEventListener('event-updated', loadExhibitors)
  }, [])

  const categories = [...new Set(exhibitors.map((item) => item.category || 'General'))]
  const filtered = exhibitors.filter(
    (item) =>
      (!category || (item.category || 'General') === category) &&
      (item.CompanyName + ' ' + item.products + ' ' + item.services)
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  return (
    <PublicLayout
      eyebrow="THE PEOPLE BEHIND THE BRANDS"
      title="Meet the makers."
      copy="Explore the companies, products, and people on the floor."
    >
      <section className="public-section wrap">
        <div className="page-toolbar">
          <input
            className="page-search"
            aria-label="Search exhibitors"
            placeholder="Search companies, products or services"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            aria-label="Category"
            className="page-search"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        {error && (
          <p className="api-error" role="alert">
            {error}
          </p>
        )}
        {loading && <p>Loading exhibitors...</p>}
        {!loading && !filtered.length && <p className="empty-state">No exhibitors found.</p>}
        <div className="exhibitor-grid">
          {filtered.map((item) => (
            <article className="exhibitor-card" key={item._id}>
              {item.logoUrl ? (
                <img className="company-logo" src={item.logoUrl} alt={item.CompanyName} />
              ) : (
                <div className="exhibitor-logo">{item.CompanyName.slice(0, 2)}</div>
              )}
              <span className="eyebrow">{item.category || 'General'}</span>
              <h2>{item.CompanyName}</h2>
              <p>{item.description}</p>
              <p>Products: {item.products || 'Not listed'}</p>
              <p>Services: {item.services || 'Not listed'}</p>
              <p>
                Contact: {item.contactPerson} · {item.phone}
              </p>
              {booths
                .filter((booth) => booth.exhibitorId?._id === item.UserId?._id)
                .map((booth) => (
                  <p key={booth._id}>
                    Booth {booth.boothNumber} · {booth.floorName} · {booth.expoId?.title}
                  </p>
                ))}
              <div className="record-actions">
                <a className="text-link" href={'mailto:' + item.UserId?.email}>
                  Email exhibitor
                </a>
              <Link className="text-link" to={'/dashboard/messages?userId=' + item.UserId?._id}>
                  Send message
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
