import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react'
import { publicExhibitors, publicExpos, publicSessions } from '../../../data/publicData'
import { PublicLayout } from '../components/PublicComponents'
export default function EventsPage() {
  const [query, setQuery] = useState("");
  const filtered = mockExpos.filter((expo) =>
    `${expo.title} ${expo.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <PublicLayout
      eyebrow="FIND YOUR NEXT EXPERIENCE"
      title="Events worth showing up for."
      copy="Browse expos, trade shows, and gatherings built around curious people and meaningful connections."
    >
      <section className="public-section wrap">
        <div className="page-toolbar">
          <div className="public-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events or locations"
            />
          </div>
          <span>{filtered.length} events found</span>
        </div>
        <div className="public-event-grid">
          {filtered.map((expo) => (
            <Link
              className="public-event-card"
              to={`/events/${expo.id}`}
              key={expo.id}
            >
              <div className="event-card-art">
                <span>{expo.status}</span>
                <CalendarDays size={38} />
              </div>
              <div className="event-card-body">
                <span className="eyebrow">{expo.date}</span>
                <h2>{expo.title}</h2>
                <p>
                  <MapPin size={14} />
                  {expo.location}
                </p>
                <div>
                  <span>
                    <Users size={14} /> {expo.attendees || "Open"} attendees
                  </span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
