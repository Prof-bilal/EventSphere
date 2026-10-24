import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react'
import { publicExhibitors, publicExpos, publicSessions } from '../../../data/publicData'
import { PublicLayout } from '../components/PublicComponents'
export default function ContactPage() {
  return (
    <PublicLayout
      eyebrow="LET’S TALK ABOUT YOUR EVENT"
      title="Tell us what you’re bringing to life."
      copy="Have a question, a big idea, or an event that needs a home? We’d love to hear about it."
    >
      <section className="public-section wrap contact-layout">
        <form
          className="contact-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <label>
            Your name
            <input placeholder="Your full name" required />
          </label>
          <label>
            Email address
            <input type="email" placeholder="you@company.com" required />
          </label>
          <label>
            How can we help?
            <select defaultValue="">
              <option value="" disabled>
                Choose a topic
              </option>
              <option>Planning an event</option>
              <option>Joining as an exhibitor</option>
              <option>Attending an expo</option>
            </select>
          </label>
          <label>
            Message
            <textarea placeholder="Tell us a little more..." rows="5" />
          </label>
          <button className="button button-orange" type="submit">
            Send message <ArrowUpRight size={17} />
          </button>
        </form>
        <aside className="contact-aside">
          <Clock3 size={25} />
          <h2>We’ll get back to you soon.</h2>
          <p>For now, explore the events and see what is waiting for you.</p>
          <Link className="text-link" to="/events">
            Browse events <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
    </PublicLayout>
  );
}
