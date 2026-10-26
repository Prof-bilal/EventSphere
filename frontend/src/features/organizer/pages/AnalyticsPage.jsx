import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

  const popularity = report?.popularity || []
  const boothTraffic = report?.boothTraffic || []
  const audienceMix = report
    ? [
        { name: 'Attendees', value: report.attendees },
        { name: 'Exhibitors', value: report.exhibitors },
        { name: 'Feedback', value: report.feedback },
      ].filter((item) => item.value > 0)
    : []
  const engagementMix = report
    ? [
        { name: 'Sessions', value: report.sessions },
        { name: 'Booked booths', value: report.bookedBooths },
        { name: 'Available booths', value: report.availableBooths },
      ]
    : []

  return (
    <div className="dash-view analytics-page">
      <div className="page-intro">
        <div>
          <span className="dash-eyebrow">ANALYTICS</span>
          <h1>See the bigger picture.</h1>
          <p>Understand the people, sessions, and spaces shaping your event.</p>
        </div>
        <button className="dash-primary" disabled={!report} onClick={downloadReport}>
          Download CSV report
        </button>
      </div>
      <label className="workspace-field analytics-expo-select">
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
          <div className="analytics-kpis">
            <article className="analytics-kpi analytics-kpi-orange"><span>ATTENDEES</span><strong>{report.attendees}</strong><small>Registered for this expo</small></article>
            <article className="analytics-kpi analytics-kpi-purple"><span>EXHIBITORS</span><strong>{report.exhibitors}</strong><small>Approved exhibitors</small></article>
            <article className="analytics-kpi analytics-kpi-green"><span>BOOTH OCCUPANCY</span><strong>{report.bookedBooths}<em> / {report.booths}</em></strong><small>{report.booths ? Math.round((report.bookedBooths / report.booths) * 100) : 0}% of booths booked</small></article>
            <article className="analytics-kpi analytics-kpi-blue"><span>SESSIONS</span><strong>{report.sessions}</strong><small>{report.feedback} feedback entries</small></article>
          </div>
          <div className="analytics-chart-grid">
            <section className="analytics-chart-card analytics-chart-wide"><div className="analytics-chart-heading"><div><span className="dash-eyebrow">SESSION ENGAGEMENT</span><h2>What people want to attend</h2></div><span>Registrations vs bookmarks</span></div>{popularity.length ? <ResponsiveContainer width="100%" height={300}><BarChart data={popularity} margin={{ top: 15, right: 10, left: -18, bottom: 55 }}><CartesianGrid stroke="#eee5dc" vertical={false} /><XAxis dataKey="title" tick={{ fill: '#8e7e74', fontSize: 10 }} angle={-28} textAnchor="end" interval={0} /><YAxis allowDecimals={false} tick={{ fill: '#a08f84', fontSize: 10 }} /><Tooltip cursor={{ fill: '#fff5ef' }} contentStyle={{ border: '1px solid #e8ded4', borderRadius: 8, fontSize: 11 }} /><Legend verticalAlign="top" align="right" height={32} wrapperStyle={{ fontSize: 10 }} /><Bar dataKey="registrations" name="Registrations" fill="#dc633f" radius={[4, 4, 0, 0]} /><Bar dataKey="bookmarks" name="Bookmarks" fill="#8d6b9f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="analytics-chart-empty">No sessions yet.</div>}</section>
            <section className="analytics-chart-card"><div className="analytics-chart-heading"><div><span className="dash-eyebrow">AUDIENCE MIX</span><h2>Who is showing up</h2></div></div>{audienceMix.length ? <ResponsiveContainer width="100%" height={225}><PieChart><Pie data={audienceMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={83} paddingAngle={4}>{audienceMix.map((item, index) => <Cell key={item.name} fill={['#dc633f', '#8d6b9f', '#75a278'][index % 3]} />)}</Pie><Tooltip contentStyle={{ border: '1px solid #e8ded4', borderRadius: 8, fontSize: 11 }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} /></PieChart></ResponsiveContainer> : <div className="analytics-chart-empty">No audience data yet.</div>}</section>
            <section className="analytics-chart-card"><div className="analytics-chart-heading"><div><span className="dash-eyebrow">SPACE UTILIZATION</span><h2>Booth capacity</h2></div></div><ResponsiveContainer width="100%" height={225}><PieChart><Pie data={engagementMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={83} paddingAngle={4}>{engagementMix.map((item, index) => <Cell key={item.name} fill={['#4d789d', '#dc633f', '#d9b36c'][index % 3]} />)}</Pie><Tooltip contentStyle={{ border: '1px solid #e8ded4', borderRadius: 8, fontSize: 11 }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} /></PieChart></ResponsiveContainer></section>
            <section className="analytics-chart-card analytics-chart-wide"><div className="analytics-chart-heading"><div><span className="dash-eyebrow">BOOTH ENGAGEMENT</span><h2>Where attendees are exploring</h2></div><span>Recorded booth views</span></div>{boothTraffic.length ? <ResponsiveContainer width="100%" height={270}><BarChart data={boothTraffic} layout="vertical" margin={{ top: 10, right: 20, left: 5, bottom: 10 }}><CartesianGrid stroke="#eee5dc" horizontal={false} /><XAxis type="number" allowDecimals={false} tick={{ fill: '#a08f84', fontSize: 10 }} /><YAxis type="category" dataKey="boothNumber" width={58} tick={{ fill: '#8e7e74', fontSize: 10 }} /><Tooltip cursor={{ fill: '#fff5ef' }} contentStyle={{ border: '1px solid #e8ded4', borderRadius: 8, fontSize: 11 }} /><Bar dataKey="visits" name="Views" fill="#75a278" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer> : <div className="analytics-chart-empty">No booth visits recorded yet.</div>}</section>
          </div>
          <section className="analytics-detail-grid"><div className="analytics-detail-card"><span className="dash-eyebrow">TOP SESSIONS</span>{popularity.slice().sort((a, b) => (b.registrations + b.bookmarks) - (a.registrations + a.bookmarks)).slice(0, 5).map((item, index) => <div className="analytics-rank" key={item.title}><b>0{index + 1}</b><span>{item.title}<small>{item.registrations} registrations · {item.bookmarks} bookmarks</small></span><strong>{item.registrations + item.bookmarks}</strong></div>)}{!popularity.length && <p>No sessions yet.</p>}</div><div className="analytics-detail-card"><span className="dash-eyebrow">REPORT SUMMARY</span><div className="analytics-summary-line"><span>Available booths</span><strong>{report.availableBooths}</strong></div><div className="analytics-summary-line"><span>Feedback entries</span><strong>{report.feedback}</strong></div><div className="analytics-summary-line"><span>Registered attendees</span><strong>{report.attendees}</strong></div></div></section>
        </>
      )}
    </div>
  )
}
