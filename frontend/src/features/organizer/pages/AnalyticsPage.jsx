import { useEffect, useState } from 'react'
import { api } from '../../../api'

export default function AnalyticsPage() {
  const [expos, setExpos] = useState([])
  const [expoId, setExpoId] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/expo/getExpo')
      .then((data) => {
        setExpos(data)
        setExpoId(data[0]?._id || '')
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let active = true
    async function loadReport() {
      if (!expoId) return
      setLoading(true)
      try {
        const data = await api('/analytics/' + expoId)
        if (active) {
          setReport(data)
          setError('')
        }
      } catch (error) {
        if (active) setError(error.message)
      }
      if (active) setLoading(false)
    }
    loadReport()
    window.addEventListener('event-updated', loadReport)
    return () => {
      active = false
      window.removeEventListener('event-updated', loadReport)
    }
  }, [expoId])

  function downloadReport() {
    if (!report) return
    const rows = [
      ['Expo', report.expo.title],
      ['Attendees', report.attendees],
      ['Exhibitors', report.exhibitors],
      ['Booths', report.booths],
      ['Booked booths', report.bookedBooths],
      ['Sessions', report.sessions],
      ['Feedback', report.feedback],
      ['Session', 'Registrations', 'Bookmarks'],
      ...report.popularity.map((item) => [item.title, item.registrations, item.bookmarks]),
      ['Booth', 'Recorded visits'],
      ...report.boothTraffic.map((item) => [item.boothNumber, item.visits]),
    ]
    const csv = rows
      .map((row) => row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'expo-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dash-view">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">ANALYTICS</span>
          <h1>See the bigger picture.</h1>
        </div>
        <button className="dash-primary" disabled={!report} onClick={downloadReport}>
          Download report
        </button>
      </div>
      <label className="workspace-field">
        <span>Expo</span>
        <select value={expoId} onChange={(event) => setExpoId(event.target.value)}>
          <option value="">Select expo</option>
          {expos.map((expo) => (
            <option key={expo._id} value={expo._id}>
              {expo.title}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p>Loading analytics...</p>}
      {!loading && !expos.length && (
        <p className="empty-state">Create an expo to view its analytics.</p>
      )}
      {report && (
        <>
          <div className="dash-grid">
            <article className="dash-card">
              <h3>Attendees</h3>
              <h2>{report.attendees}</h2>
            </article>
            <article className="dash-card">
              <h3>Exhibitors</h3>
              <h2>{report.exhibitors}</h2>
            </article>
            <article className="dash-card">
              <h3>Booths booked</h3>
              <h2>
                {report.bookedBooths} / {report.booths}
              </h2>
            </article>
            <article className="dash-card">
              <h3>Sessions</h3>
              <h2>{report.sessions}</h2>
            </article>
          </div>
          <section className="dash-card">
            <h2>Session popularity</h2>
            {!report.popularity.length && <p>No sessions yet.</p>}
            {report.popularity.map((item) => (
              <article className="activity-row" key={item.title}>
                <strong>{item.title}</strong>
                <span>
                  {item.registrations} registrations · {item.bookmarks} bookmarks
                </span>
              </article>
            ))}
          </section>
          <section className="dash-card">
            <h2>Booth engagement</h2>
            <p>Recorded attendee booth-detail views.</p>
            {report.boothTraffic.map((item) => (
              <article className="activity-row" key={item._id}>
                <strong>{item.boothNumber}</strong>
                <span>{item.visits} views</span>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
