import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react'
import { publicExhibitors, publicExpos, publicSessions } from '../../../data/publicData'
import { PublicLayout } from '../components/PublicComponents'
export default function SchedulePage() {
  const [saved, setSaved] = useState([]);
  return (
    <PublicLayout
      eyebrow="A DAY FULL OF POSSIBILITY"
      title="Make time for good ideas."
      copy="Build an agenda around the talks, workshops, and conversations you want to remember."
    >
      <section className="public-section wrap schedule-public-list">
        {mockSessions.map((session) => (
          <article key={session.id}>
            <time>{session.time}</time>
            <div className="schedule-public-line" />
            <div>
              <span className="eyebrow">{session.type}</span>
              <h2>{session.title}</h2>
              <p>
                {session.speaker} · {session.location}
              </p>
            </div>
            <button
              onClick={() =>
                setSaved((items) =>
                  items.includes(session.id)
                    ? items.filter((id) => id !== session.id)
                    : [...items, session.id],
                )
              }
            >
              {saved.includes(session.id) ? (
                <>
                  <Check size={16} /> Saved
                </>
              ) : (
                <>
                  Save session <ArrowUpRight size={15} />
                </>
              )}
            </button>
          </article>
        ))}
      </section>
    </PublicLayout>
  );
}
