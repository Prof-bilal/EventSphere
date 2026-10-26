import { useEffect, useState } from 'react'
import { api } from '../../../api'
import ExhibitorCard from '../../public/components/ExhibitorCard'

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
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">EXHIBITORS</span>
          <h1>Meet the makers.</h1>
        </div>
      </div>
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
        {filtered.map((item) => <ExhibitorCard key={item._id} item={item} booths={booths} />)}
      </div>
    </div>
  )
}
