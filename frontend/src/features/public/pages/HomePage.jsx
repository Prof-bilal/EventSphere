import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Handshake,
  LayoutGrid,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react'
import PublicLayout from '../../../components/layout/PublicLayout'

export default function HomePage() {
  const [activeRole, setActiveRole] = useState('Organizers')
  const roleContent = {
    Organizers: {
      title: 'A clear view of the whole picture.',
      copy: 'Keep the moving parts moving. See registrations, sessions, exhibitors, and feedback in one calm workspace.',
      items: [
        'Build a polished agenda',
        'Track registrations in real time',
        'Keep your team aligned',
      ],
    },
    Exhibitors: {
      title: 'A better way to be discovered.',
      copy: 'Give your team a simple place to manage your booth, share your story, and meet the right people.',
      items: ['Apply for the right booth', 'Share your company profile', 'Connect with attendees'],
    },
    Attendees: {
      title: 'Find your way to what matters.',
      copy: 'Make a personal plan for the day. Explore what is happening, save your favourites, and arrive ready.',
      items: [
        'Browse the full programme',
        'Save sessions and exhibitors',
        'Navigate the floor with ease',
      ],
    },
  }
  const role = roleContent[activeRole]

  return (
    <PublicLayout>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> A better way to bring people together
          </span>
          <h1>
            Big moments.
            <br />
            Every detail
            <br />
            <span>taken care of.</span>
          </h1>
          <p>
            One home for your expo. From planning the floor to filling the room, bring organizers,
            exhibitors, and attendees together.
          </p>
          <div className="hero-actions">
            <Link className="button button-orange" to="/register">
              Let’s build your event <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" to="/events">
              Explore events <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <span>+</span> Built around the people behind the event.
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="photo-frame">
            <img src="/assets/expo-hall.png" alt="Visitors exploring a trade-show hall" />
            <span className="photo-tag">
              Good things happen
              <br />
              when we get together.
            </span>
            <span className="photo-caption">MORE THAN AN EVENT. A CONNECTION.</span>
            <span className="hero-sticker sticker-top">
              NEXT UP <strong>Future Makers</strong>
              <small>09:00 · Main stage</small>
            </span>
            <span className="hero-sticker sticker-bottom">
              <span className="sticker-pulse" /> 842 people are finding their way in
            </span>
          </div>
        </div>
      </section>

      <section className="audience-strip">
        <div className="wrap audience-inner">
          <span>ONE SHARED SPACE</span>
          <p>
            <span>Organizers</span>
            <span>Exhibitors</span>
            <span>Attendees</span>
          </p>
          <ArrowRight size={21} />
        </div>
      </section>

      <section className="section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / THE PLATFORM</span>
            <h2>
              Everything connected.
              <br />
              Nothing overlooked.
            </h2>
          </div>
          <p>
            Less jumping between tools.
            <br />
            More time for the things that make
            <br />
            your event worth showing up for.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature">
            <div className="feature-visual peach">
              <CalendarDays size={30} />
            </div>
            <div className="feature-copy">
              <CalendarDays size={20} />
              <h3>Set the stage.</h3>
              <p>
                Create your event, shape the agenda, and give every speaker and session a place.
              </p>
            </div>
          </article>
          <article className="feature">
            <div className="feature-visual lilac">
              <LayoutGrid size={30} />
              <div className="mini-booths">
                <span> B01 </span>
                <span> B02 </span>
                <span> B03 </span>
                <span> B04 </span>
              </div>
            </div>
            <div className="feature-copy">
              <LayoutGrid size={20} />
              <h3>Make room for everyone.</h3>
              <p>Manage exhibitor applications and allocate booths on one shared floor plan.</p>
            </div>
          </article>
          <article className="feature">
            <div className="feature-visual sage">
              <Users size={30} />
              <Check size={18} />
            </div>
            <div className="feature-copy">
              <Users size={20} />
              <h3>Make the right connections.</h3>
              <p>Help attendees discover exhibitors, save sessions, and find their way around.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="role-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / BUILT FOR EVERY ROLE</span>
              <h2>
                Everyone has a place
                <br />
                in the picture.
              </h2>
            </div>
            <p>
              One shared experience, with the right tools
              <br />
              for every person in the room.
            </p>
          </div>
          <div className="role-tabs">
            {Object.keys(roleContent).map((name) => (
              <button
                key={name}
                className={activeRole === name ? 'active' : ''}
                onClick={() => setActiveRole(name)}
              >
                <span>{name}</span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
          <div className="role-layout">
            <div className="role-copy">
              <h3>{role.title}</h3>
              <p>{role.copy}</p>
              <ul>
                {role.items.map((item) => (
                  <li key={item}>
                    <Check size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link className="text-link" to="/register">
                See how it works <ArrowRight size={16} />
              </Link>
            </div>
            <div className="workspace">
              <div className="workspace-top">
                <span className="mini-brand">EventSphere</span>
                <span className="demo-label">LIVE WORKSPACE</span>
              </div>
              <div className="workspace-main">
                <aside>
                  <span className="sidebar-caption">{activeRole.toUpperCase()}</span>
                  <span className="current">
                    <LayoutGrid size={12} /> Overview
                  </span>
                  <span>
                    <CalendarDays size={12} /> Schedule
                  </span>
                  <span>
                    <Building2 size={12} /> Exhibitors
                  </span>
                  <span className="workspace-avatar">
                    <span>AK</span>
                    <small>Alex Kim</small>
                  </span>
                </aside>
                <div className="workspace-content">
                  <div className="workspace-title">
                    <div>
                      <span>YOUR EVENT</span>
                      <h4>Future Makers Expo</h4>
                    </div>
                    <span className="live-badge">
                      <span className="status-dot" /> Live
                    </span>
                  </div>
                  <div className="workspace-stats">
                    <div>
                      <span>REGISTRATIONS</span>
                      <strong>
                        <BarChart3 size={12} /> 842 <small>+18%</small>
                      </strong>
                    </div>
                    <div>
                      <span>SESSIONS</span>
                      <strong>
                        <Clock3 size={12} /> 24
                      </strong>
                    </div>
                  </div>
                  <div className="agenda-header">
                    <h5>Up next</h5>
                    <span>
                      <MapPin size={11} /> Main stage
                    </span>
                  </div>
                  <div className="agenda-item">
                    <time>09:00</time>
                    <i className="agenda-color" />
                    <div>
                      <strong>Opening keynote</strong>
                      <span>Amina Rahman · Main stage</span>
                    </div>
                  </div>
                  <div className="agenda-item">
                    <time>11:00</time>
                    <i className="agenda-color violet" />
                    <div>
                      <strong>Meet the makers</strong>
                      <span>Workshop room · 48 saved</span>
                    </div>
                  </div>
                  <div className="workspace-banner">
                    <span>
                      <Sparkles size={12} /> Your event is ready for doors open.
                    </span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="planning-section section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / THE SIMPLE WAY</span>
              <h2>
                From first idea
                <br />
                to full house.
              </h2>
            </div>
            <p>
              A few thoughtful steps.
              <br />A lot more room to focus.
            </p>
          </div>
          <div className="planning-steps">
            <article className="planning-step">
              <div className="step-top">
                <span>01</span>
                <CalendarDays size={20} />
              </div>
              <h3>Shape your event</h3>
              <p>
                Start with the essentials, then build an agenda your audience will want to be part
                of.
              </p>
              <div className="step-bottom">
                <span>EVENT SETUP</span>
                <ArrowRight size={14} />
              </div>
            </article>
            <article className="planning-step">
              <div className="step-top">
                <span>02</span>
                <LayoutGrid size={20} />
              </div>
              <h3>Bring the room to life</h3>
              <p>
                Invite exhibitors, place every booth, and turn your floor plan into a shared
                destination.
              </p>
              <div className="step-bottom">
                <span>FLOOR PLAN</span>
                <ArrowRight size={14} />
              </div>
            </article>
            <article className="planning-step">
              <div className="step-top">
                <span>03</span>
                <Handshake size={20} />
              </div>
              <h3>Make the introductions</h3>
              <p>
                Let people discover the right sessions, teams, and conversations before they even
                arrive.
              </p>
              <div className="step-bottom">
                <span>CONNECTIONS</span>
                <ArrowRight size={14} />
              </div>
            </article>
          </div>
          <div className="planning-footnote">
            <span>Good events feel effortless from the outside.</span>
            <Link className="text-link" to="/about">
              Our approach <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section wrap experience">
        <div className="experience-photo">
          <img
            src="/assets/eventsphere-warm-maximalist.png"
            alt="A vibrant EventSphere event experience"
          />
          <span className="experience-label">THE PEOPLE MAKE THE MOMENT</span>
        </div>
        <div className="experience-copy">
          <span className="eyebrow">04 / MORE THAN LOGISTICS</span>
          <h2>
            Make space for the <span>good stuff.</span>
          </h2>
          <p>
            When the details are in the right place, people can do what they came to do: learn
            something new, find a collaborator, and leave with a story worth telling.
          </p>
          <Link className="text-link" to="/events">
            See what’s happening <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="signal-section">
        <div className="signal-ticker" aria-hidden="true">
          <span>PLAN BOLDLY</span>
          <i>✳</i>
          <span>MEET CURIOUSLY</span>
          <i>✳</i>
          <span>MOVE TOGETHER</span>
          <i>✳</i>
          <span>PLAN BOLDLY</span>
          <i>✳</i>
        </div>
        <div className="wrap signal-grid">
          <div className="signal-intro">
            <span className="eyebrow">05 / THE EVENT ENERGY</span>
            <h2>
              All the little
              <br />
              <span>signals</span> in one place.
            </h2>
            <p>
              From the first registration to the final high-five, see the rhythm of your event as it
              happens.
            </p>
            <Link className="text-link" to="/about">
              See the bigger picture <ArrowRight size={16} />
            </Link>
          </div>
          <div className="signal-board">
            <div className="signal-board-head">
              <span>LIVE EVENT PULSE</span>
              <span className="signal-live">
                <i /> ON AIR
              </span>
            </div>
            <div className="pulse-line">
              <span className="pulse-dot dot-a" />
              <span className="pulse-dot dot-b" />
              <span className="pulse-dot dot-c" />
              <span className="pulse-dot dot-d" />
              <span className="pulse-dot dot-e" />
            </div>
            <div className="signal-cards">
              <article>
                <strong>+18%</strong>
                <span>
                  registrations
                  <br />
                  this week
                </span>
              </article>
              <article>
                <strong>24</strong>
                <span>
                  sessions
                  <br />
                  in motion
                </span>
              </article>
              <article>
                <strong>06</strong>
                <span>
                  new teams
                  <br />
                  connected
                </span>
              </article>
            </div>
            <div className="signal-foot">
              <span>
                <span className="mini-avatar avatar-orange">A</span>
                <span className="mini-avatar avatar-lilac">M</span>
                <span className="mini-avatar avatar-green">S</span>
              </span>
              <span>
                People are already making plans <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap closing-inner">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>
            Make it an event
            <br />
            to remember.
          </h2>
          <Link className="button button-dark" to="/register">
            Create your account <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>

      <footer className="footer wrap">
        <div className="footer-top">
          <div>
            <Link className="brand" to="/">
              <span className="brand-mark" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              EventSphere
            </Link>
            <p>
              Good people. Great connections.
              <br />
              Events that bring it all together.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <strong>Explore</strong>
              <Link to="/events">Events</Link>
              <Link to="/exhibitors">Exhibitors</Link>
              <Link to="/schedule">Schedule</Link>
            </div>
            <div>
              <strong>EventSphere</strong>
              <Link to="/about">About us</Link>
              <Link to="/contact">Contact the team</Link>
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 EventSphere</span>
          <span>Built for better events.</span>
        </div>
      </footer>
    </PublicLayout>
  )
}
