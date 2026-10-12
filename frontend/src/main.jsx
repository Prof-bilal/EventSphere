import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, MotionConfig } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AuthPage from './AuthPage'
import { ArrowUpRight, ArrowRight, CalendarDays, LayoutGrid, MapPin, Users, Menu, X, Check, Bookmark, ChevronRight } from 'lucide-react'
import './index.css'

const photo = '/assets/expo-hall.png'
const roles = {
  Organizers: { title: 'A clear view of the whole show.', copy: 'Bring your schedule, exhibitors, and registrations together. Keep the details moving so your team can focus on the experience.', items: ['Create and publish your expo', 'Manage applications and booth allocations', 'Keep sessions and speakers in sync'] },
  Exhibitors: { title: 'Your best introduction starts here.', copy: 'Find your place on the floor, build your company profile, and connect with the people who came to discover you.', items: ['Apply for upcoming expos', 'Choose and manage your booth', 'Connect directly with the organizer'] },
  Attendees: { title: 'Less searching. More discovering.', copy: 'Find the exhibitors and sessions that matter to you. Build your own agenda and arrive with a plan.', items: ['Discover events and exhibitors', 'Save sessions to your schedule', 'Navigate the expo floor with confidence'] },
}
function Reveal({ children, className = '' }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .55 }}>{children}</motion.div>
}
function Brand() { return <a className="brand" href="#home"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>EventSphere</a> }
function PlanningSteps() {
  const steps = [
    ['01', 'Start with the essentials.', 'Set your event name, dates, venue, and theme. Give your expo a clear starting point.', CalendarDays, 'Your event, defined'],
    ['02', 'Bring the right people in.', 'Review exhibitor applications, assign booth spaces, and shape the session schedule.', Users, 'Your team, connected'],
    ['03', 'Keep the experience moving.', 'Help attendees explore the agenda and floor plan, and keep everyone informed as details change.', MapPin, 'Your show, in motion'],
  ]
  return <section className="planning-section" id="how-it-works"><div className="wrap section">
    <Reveal className="section-heading"><div><span className="eyebrow">04 / A CLEAR PATH FROM IDEA TO EVENT</span><h2>From a first idea<br/>to opening day.</h2></div><p>Start with the essentials.<br/>Build the experience around them.</p></Reveal>
    <div className="planning-steps">{steps.map(([number, title, copy, Icon, label]) => <Reveal className="planning-step" key={number}>
      <div className="step-top"><span>{number}</span><Icon size={22} strokeWidth={1.5}/></div>
      <h3>{title}</h3><p>{copy}</p><div className="step-bottom"><span>{label}</span><ArrowRight size={16}/></div>
    </Reveal>)}</div>
    <Reveal className="planning-footnote"><span>One workspace, from setup to showtime.</span><a className="text-link" href="#solutions">Take a look inside <ArrowUpRight size={16}/></a></Reveal>
  </div></section>
}
function FAQ() {
  const questions = [
    ['Who is EventSphere designed for?', 'EventSphere is designed for expo and trade-show organizers, participating exhibitors, and attendees. Each role has its own view of the event, with tools suited to what they need to do.'],
    ['What can organizers manage?', 'The platform brings together event details, exhibitor applications, booth allocations, and session schedules. Organizers can coordinate speakers, topics, and rooms from the same workspace.'],
    ['How do exhibitors find their place?', 'Exhibitors can apply with their company details, explore the floor plan, and select a booth. Organizers review applications and manage allocations as part of the event setup.'],
    ['Can attendees build their own agenda?', 'Attendees can browse sessions and workshops, discover exhibitors, and bookmark sessions of interest. The floor plan helps them locate booths and plan their visit.'],
    ['What happens when event details change?', 'Schedule and booth updates keep organizers, exhibitors, and attendees working from the same event information. Notifications and session reminders help attendees follow the sessions they have saved.'],
  ]
  return <section id="faq" className="section wrap faq-section">
    <Reveal className="faq-intro"><span className="eyebrow">05 / A FEW THINGS TO KNOW</span><h2>Good questions.<br/>Clear answers.</h2><p>A little more about how<br/>everything comes together.</p><a className="text-link" href="#platform">Explore the platform <ArrowUpRight size={16}/></a></Reveal>
    <Reveal className="faq-list">{questions.map(([question, answer], index) => <details key={question} className="faq-item" name="eventsphere-faq" open={index === 0}>
      <summary><span>{question}</span><span className="faq-toggle" aria-hidden="true"/></summary><p>{answer}</p>
    </details>)}</Reveal>
  </section>
}
function App() {
  useEffect(() => { document.title = 'EventSphere — Big moments. Every detail taken care of.' }, [])
  const [menu, setMenu] = useState(false)
  const [role, setRole] = useState('Organizers')
  const [saved, setSaved] = useState(false)
  const [booth, setBooth] = useState('B04')
  const active = roles[role]
  return <MotionConfig reducedMotion="user"><div className="site">
    <header className="header"><Brand/><nav className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">{[['Platform','platform'],['Who it’s for','solutions'],['The experience','experience']].map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{label}</a>)}<Link to="/login" onClick={()=>setMenu(false)}>Sign in</Link><Link className="mobile-register" to="/register" onClick={()=>setMenu(false)}>Create account ↗</Link></nav><Link className="button button-dark nav-cta" to="/register">Plan your event <ArrowUpRight size={16}/></Link><button className="menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></header>
    <main>
      <section className="hero wrap" id="home"><Reveal className="hero-copy"><span className="eyebrow"><span className="status-dot"/> A better way to bring people together</span><h1>Big moments.<br/>Every detail<br/><span>taken care of.</span></h1><p>One home for your expo. From planning the floor to filling the room, bring organizers, exhibitors, and attendees together.</p><div className="hero-actions"><a className="button button-orange" href="#contact">Let’s build your event <ArrowUpRight size={18}/></a><a className="text-link" href="#platform">Explore the platform <ArrowRight size={16}/></a></div><div className="hero-note"><span>+</span> Built around the people behind the event.</div></Reveal><Reveal className="hero-visual"><div className="photo-frame"><img src={photo} alt="Visitors exploring a beautifully lit trade-show hall" fetchPriority="high"/><span className="photo-tag">Good things happen<br/>when we get together.</span><span className="photo-caption">MORE THAN AN EVENT. A CONNECTION.</span></div><div className="floating-ticket"><div className="ticket-icon"><CalendarDays size={22}/></div><div><span>Your next big idea</span><strong>Starts with a great event.</strong></div><ArrowUpRight size={20}/></div><span className="orbit-mark" aria-hidden="true">✳</span></Reveal></section>
      <div className="audience-strip"><div className="wrap audience-inner"><span>ONE SHARED SPACE.</span><p>For the planners.<span>For the brands.</span>For the curious.</p><ArrowUpRight size={26}/></div></div>
      <section id="platform" className="section wrap"><Reveal className="section-heading"><div><span className="eyebrow">01 / THE PLATFORM</span><h2>Everything connected.<br/>Nothing overlooked.</h2></div><p>Less jumping between tools.<br/>More time for the things that make<br/>your event worth showing up for.</p></Reveal><div className="feature-grid">
        {[{icon:CalendarDays,num:'01',title:'Set the stage.',copy:'Create your event, shape the agenda, and give every speaker and session a place.',cls:'peach',visual:'schedule'}, {icon:LayoutGrid,num:'02',title:'Make room for everyone.',copy:'Manage exhibitor applications and allocate booths on one shared floor plan.',cls:'lilac',visual:'map'}, {icon:Users,num:'03',title:'Make the right connections.',copy:'Help attendees discover exhibitors, save sessions, and find their way around.',cls:'sage',visual:'session'}].map(f=><Reveal key={f.num} className="feature"><div className={`feature-visual ${f.cls}`}><span className="visual-index">{f.num}</span>{f.visual==='schedule' ? <div className="schedule-mini"><div className="mini-top">Your event agenda <CalendarDays size={15}/></div><div className="mini-day">WEDNESDAY / DAY 01</div><div className="agenda-row"><time>09:00</time><div><strong>Opening keynote</strong><span>Main stage</span></div></div><div className="agenda-row"><time>11:00</time><div><strong>New ideas. New connections.</strong><span>Workshop room</span></div></div></div> : f.visual==='map' ? <div className="booth-mini"><div className="mini-top">Find your space <MapPin size={15}/></div><div className="mini-booths">{Array.from({length:12},(_,i)=><span className={i===6?'selected':''} key={i}>{i===6?<Check size={17}/>: `B${String(i+1).padStart(2,'0')}`}</span>)}</div><div className="map-legend"><i/> Your perfect spot</div></div> : <div className="session-mini"><span className="session-label">A LITTLE INSPIRATION</span><strong>Ideas that move<br/>the world forward.</strong><div className="session-meta"><span><CalendarDays size={13}/> 14:00 – 15:00</span><Bookmark size={16}/></div><div className="session-bottom">Explore your agenda <ArrowRight size={15}/></div></div>}</div><div className="feature-copy"><f.icon size={20}/><h3>{f.title}</h3><p>{f.copy}</p></div></Reveal>)}
      </div></section>
      <section className="role-section" id="solutions"><div className="wrap"><Reveal className="section-heading"><div><span className="eyebrow">02 / MADE FOR YOUR SIDE OF THE EVENT</span><h2>Different roles.<br/>One great experience.</h2></div></Reveal><div className="role-tabs" role="tablist" aria-label="Event roles">{Object.keys(roles).map(r=><button key={r} id={`tab-${r}`} role="tab" aria-selected={role===r} aria-controls="role-panel" className={r===role?'active':''} onClick={()=>setRole(r)}>{r}<ArrowUpRight size={17}/></button>)}</div><div id="role-panel" role="tabpanel" aria-labelledby={`tab-${role}`} className="role-layout"><div className="role-copy"><h3>{active.title}</h3><p>{active.copy}</p><ul>{active.items.map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul><a className="button button-dark" href="#contact">Get started <ArrowUpRight size={17}/></a></div><div className="workspace"><div className="workspace-top"><span className="mini-brand">EventSphere</span><span className="demo-label">INTERACTIVE PREVIEW</span></div><div className="workspace-main"><aside><span className="sidebar-caption">WORKSPACE</span>{[[LayoutGrid,'Overview'],[CalendarDays,'Schedule'],[MapPin,'Floor plan'],[Users,'Exhibitors']].map(([Icon,label])=><span key={label} className={(role==='Exhibitors'? label==='Floor plan':label==='Schedule')?'current':''}><Icon size={14}/>{label}</span>)}<span className="workspace-avatar">ES <small>Your event team</small></span></aside><div className="workspace-content"><div className="workspace-title"><div><span>LET’S MAKE IT HAPPEN</span><h4>{role==='Exhibitors'?'Choose your space':role==='Attendees'?'Your event agenda':'Your event, at a glance'}</h4></div><span className="live-badge">● Upcoming</span></div>{role==='Exhibitors'? <><div className="interactive-map">{Array.from({length:12},(_,i)=>{const id=`B${String(i+1).padStart(2,'0')}`;return <button key={id} aria-pressed={booth===id} onClick={()=>setBooth(id)} className={booth===id?'chosen':''}>{id}</button>})}</div><div className="selected-info"><MapPin size={17}/><strong>Booth {booth}</strong><span>Selected for preview</span></div></> : <><div className="workspace-stats"><div><span>EVENT SETUP</span><strong>Ready to publish <Check size={17}/></strong></div><div><span>NEXT UP</span><strong>Finalize your agenda</strong></div></div><div className="agenda-header"><h5>{role==='Attendees'?'Recommended for you':'Today’s agenda'}</h5><span>Day 01 <ChevronRight size={13}/></span></div><div className="agenda-item"><time>09:00</time><span className="agenda-color"/><div><strong>Opening keynote</strong><span>Main stage · Welcome & inspiration</span></div><button aria-label={saved?'Remove keynote from saved sessions':'Save keynote'} aria-pressed={saved} onClick={()=>setSaved(!saved)}><Bookmark size={17} fill={saved?'currentColor':'none'}/></button></div><div className="agenda-item"><time>11:00</time><span className="agenda-color violet"/><div><strong>Meet the makers</strong><span>Expo floor · Discover & connect</span></div><ArrowUpRight size={15}/></div><div className="workspace-banner"><span><span className="status-dot"/> All the right details. All in one place.</span><ArrowRight size={16}/></div></>}</div></div></div></div></div></section>
      <section id="experience" className="section wrap experience"><Reveal className="experience-photo"><img src={photo} alt="Exhibitors and visitors coming together at an expo" loading="lazy"/><span className="experience-label">A ROOM FULL OF POSSIBILITY.</span></Reveal><Reveal className="experience-copy"><span className="eyebrow">03 / FROM THE FIRST INVITE</span><h2>Take care of the details.<br/><span>Make space for<br/>the moment.</span></h2><p>The best events feel effortless. Behind them is a team that knows where everything stands. From booth selections to last-minute schedule changes, keep everyone on the same page.</p><a href="#solutions" className="text-link">Find your perspective <ArrowUpRight size={18}/></a></Reveal></section>
      <PlanningSteps/>
      <FAQ/>
      <section className="closing" id="contact"><div className="wrap closing-inner"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Make it an event<br/>to remember.</h2><Link className="button button-dark" to="/register">Create your account <ArrowUpRight size={19}/></Link><span className="closing-star" aria-hidden="true">✳</span></div></section>
    </main><footer className="wrap footer"><div className="footer-top"><div><Brand/><p>Good people. Great connections.<br/>Events that bring it all together.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#platform">The platform</a><a href="#experience">The experience</a></div><div><strong>For your team</strong>{Object.keys(roles).map(r=><a href="#solutions" key={r} onClick={()=>setRole(r)}>{r}</a>)}</div><div><strong>Get started</strong><a href="#contact">Plan an event ↗</a><a href="#home">Back to top ↑</a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} EventSphere</span><span>Bring people together.</span></div></footer>
  </div></MotionConfig>
}
createRoot(document.getElementById('root')).render(<BrowserRouter><Routes>
  <Route path="/" element={<App/>}/>
  <Route path="/login" element={<AuthPage mode="login"/>}/>
  <Route path="/register" element={<AuthPage mode="register"/>}/>
  <Route path="/forgot-password" element={<AuthPage mode="forgot"/>}/>
  <Route path="/reset-password" element={<AuthPage mode="reset"/>}/>
  <Route path="*" element={<div className="section wrap"><h1>Page not found.</h1><Link to="/">Return to EventSphere →</Link></div>}/>
</Routes></BrowserRouter>)
