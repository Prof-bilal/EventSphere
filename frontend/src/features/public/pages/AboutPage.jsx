import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Search,
  Users,
} from 'lucide-react'
import { PublicLayout } from '../components/PublicComponents'
export default function AboutPage() {
  return (
    <PublicLayout
      eyebrow="WHY EVENTSPHERE"
      title="The details make the moment."
      copy="EventSphere brings the people behind an event into one clear, shared experience."
    >
      <section className="public-section wrap about-grid">
        <div className="about-art">
          <span>
            For the planners.
            <br />
            For the brands.
            <br />
            For the curious.
          </span>
        </div>
        <div className="about-copy">
          <span className="eyebrow">A BETTER WAY TO COME TOGETHER</span>
          <h2>Events are complicated. They should not feel that way.</h2>
          <p>
            From the first idea to opening day, EventSphere gives organizers, exhibitors, and
            attendees a simple place to see what matters next.
          </p>
          <div className="about-points">
            <div>
              <Check size={17} />
              <span>
                <strong>One shared space</strong>Everyone sees the details that help them take part.
              </span>
            </div>
            <div>
              <Check size={17} />
              <span>
                <strong>Made for every role</strong>Useful tools for the people planning, showing,
                and discovering.
              </span>
            </div>
            <div>
              <Check size={17} />
              <span>
                <strong>Ready for the moment</strong>Less searching, more time for meaningful
                connections.
              </span>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
