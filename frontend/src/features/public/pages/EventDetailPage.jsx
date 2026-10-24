import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react'
import { publicExhibitors, publicExpos, publicSessions } from '../../../data/publicData'
import { PublicLayout } from '../components/PublicComponents'
export default function EventDetailPage() {
  const { id } = useParams();
  const expo = mockExpos.find((item) => String(item.id) === id) || mockExpos[0];
  return (
    <PublicLayout
      eyebrow="EVENT DETAIL"
      title={expo.title}
      copy={`${expo.date} · ${expo.location}`}
    >
      <section className="public-section wrap detail-layout">
        <div>
          <div className="detail-art">
            <CalendarDays size={56} />
            <span>Future ideas, in one place.</span>
          </div>
          <div className="detail-copy">
            <span className="eyebrow">ABOUT THIS EVENT</span>
            <h2>A place to discover what comes next.</h2>
            <p>
              Meet the people, products, and ideas shaping the future. Explore
              the floor, build your agenda, and make room for a good
              conversation.
            </p>
          </div>
        </div>
        <aside className="detail-panel">
          <span className="eyebrow">YOUR VISIT</span>
          <h2>Plan your day.</h2>
          <div>
            <CalendarDays size={17} />
            <span>
              <strong>{expo.date}</strong>
              <small>Three days of ideas</small>
            </span>
          </div>
          <div>
            <MapPin size={17} />
            <span>
              <strong>{expo.location}</strong>
              <small>Find your way around</small>
            </span>
          </div>
          <div>
            <Users size={17} />
            <span>
              <strong>{expo.attendees || "Open"} attendees</strong>
              <small>A room full of possibility</small>
            </span>
          </div>
          <Link className="button button-orange" to="/register?role=attendee">
            Register for this expo <ArrowUpRight size={16} />
          </Link>
        </aside>
      </section>
      <section className="detail-links wrap">
        <Link to="/exhibitors">
          <span>01</span>
          <strong>Meet the exhibitors</strong>
          <ArrowRight size={17} />
        </Link>
        <Link to="/schedule">
          <span>02</span>
          <strong>Explore the schedule</strong>
          <ArrowRight size={17} />
        </Link>
        <Link to="/floor-plan">
          <span>03</span>
          <strong>Find your way around</strong>
          <ArrowRight size={17} />
        </Link>
      </section>
    </PublicLayout>
  );
}
