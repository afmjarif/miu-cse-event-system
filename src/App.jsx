
import { useEffect, useState } from 'react'
import './App.css'

const API_URL =
  'https://script.google.com/macros/s/AKfycbyF363koCS54zLBAMy8Qw0QbsIFGRNIn2jUqjWwXOSCOcnRSNLHKixlcD3-mInyfeSw/exec'

function getEventStatus(status) {
  const normalized = String(status || '').trim().toLowerCase()

  if (normalized === 'open') return 'Registration Open'
  if (normalized === 'closed') return 'Registration Closed'
  if (normalized === 'hidden') return 'Hidden'
  return status || 'Coming Soon'
}

function formatEventDate(dateValue) {
  if (!dateValue) return 'Date to be announced'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return String(dateValue)
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  }).format(date)
}

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadEvents() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}?action=events`)

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !Array.isArray(data.events)) {
        throw new Error('The server returned an unexpected response.')
      }

      setEvents(
        data.events.filter(
          (event) =>
            String(event.registration_status || '')
              .trim()
              .toLowerCase() !== 'hidden',
        ),
      )
    } catch (err) {
      console.error('Failed to load events:', err)
      setError(
        'We could not load events right now. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">C</span>
          <span>
            <strong>MIU CSE Club</strong>
            <small>Event Management System</small>
          </span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#about">About</a>
          <a className="login-link" href="#admin">
            Admin Login
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              MANARAT INTERNATIONAL UNIVERSITY
            </span>

            <h1>
              Every Event.
              <br />
              <span>One Platform.</span>
            </h1>

            <p>
              Discover CSE events, register online, and keep your
              event passes in one place. Built for the MIU CSE
              community.
            </p>

            <a className="primary-button" href="#events">
              Explore Events <span aria-hidden="true">→</span>
            </a>

            <div className="hero-note">
              <span className="status-dot" />
              Your campus. Your community. Your next experience.
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-symbol">&lt;/&gt;</div>

            <div className="floating-card card-top">
              <span>01</span>
              <strong>Discover</strong>
            </div>

            <div className="floating-card card-bottom">
              <span>02</span>
              <strong>Register</strong>
            </div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT'S HAPPENING</span>
              <h2>Explore Events</h2>
              <p>
                Find your next opportunity to learn, connect, and grow.
              </p>
            </div>

            <span className="event-count">
              {loading ? 'Loading…' : `${events.length} events`}
            </span>
          </div>

          {loading && (
            <div className="events-message" role="status">
              Loading events from MIU CSE Club…
            </div>
          )}

          {!loading && error && (
            <div className="events-message" role="alert">
              <p>{error}</p>
              <button
                className="secondary-button"
                type="button"
                onClick={loadEvents}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="events-message">
              No public events are available right now. Please check
              again later.
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="event-grid">
              {events.map((event) => (
                <article
                  className="event-card"
                  key={event.event_id}
                >
                  <div className="event-card-top">
                    <span className="event-category">
                      MIU CSE CLUB
                    </span>
                    <span className="event-status">
                      {getEventStatus(event.registration_status)}
                    </span>
                  </div>

                  <div className="event-card-body">
                    <h3>{event.event_name}</h3>

                    <p>
                      {event.description ||
                        'More details about this event will be announced soon.'}
                    </p>

                    <div className="event-detail">
                      <span aria-hidden="true">◷</span>
                      {formatEventDate(event.event_date)}
                    </div>

                    {event.start_time && (
                      <div className="event-detail">
                        <span aria-hidden="true">◴</span>
                        {String(event.start_time)}
                        {event.end_time
                          ? ` – ${event.end_time}`
                          : ''}
                      </div>
                    )}

                    <div className="event-detail">
                      <span aria-hidden="true">⌖</span>
                      {event.venue || 'Venue to be announced'}
                    </div>

                    <button
                      className="secondary-button"
                      type="button"
                      disabled
                      title="Online registration will be enabled after the registration workflow is implemented."
                    >
                      Registration Coming Soon
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <span className="eyebrow">
            CREATING TECH LEADERS OF TOMORROW
          </span>
          <h2>More than events. A community.</h2>
          <p>
            The MIU CSE Club brings students together through technology,
            innovation, collaboration, and shared experiences.
          </p>
        </section>

        <section className="admin-section" id="admin">
          <h2>Event administration</h2>
          <p>
            Authorized club members will be able to manage events,
            registrations, attendance, and participant passes.
          </p>
          <span className="admin-note">
            Admin sign-in will be available after secure
            authentication is configured.
          </span>
        </section>
      </main>

      <footer>
        <a className="footer-brand" href="#home">
          MIU CSE Club
        </a>
        <p>Creating Tech Leaders of Tomorrow.</p>
        <small>
          © {new Date().getFullYear()} MIU CSE Club. Event portal.
        </small>
      </footer>
    </div>
  )
}

export default App

