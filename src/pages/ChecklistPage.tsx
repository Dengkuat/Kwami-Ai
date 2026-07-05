import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { loadChecklist, toggleItem } from '../store/checklistSlice'
import { ROUTE_PATHS } from '../routes/routePaths'
import './ChecklistPage.css'

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path
        d="M8.5 13h7M8.5 16.5h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChecklistPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { serviceId } = useParams<{ serviceId: string }>()
  const { applicationName, items } = useAppSelector((state) => state.checklist)

  useEffect(() => {
    if (serviceId) {
      dispatch(loadChecklist(serviceId))
    }
  }, [serviceId, dispatch])

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <div className="checklist-screen">
      <header className="checklist-topbar">
        <div className="checklist-brand">
          <span className="checklist-logo">KK</span>
          <span>Kigali Kwima</span>
        </div>
        <span className="checklist-tag">Government</span>
      </header>

      <main className="checklist-body">
        <div className="checklist-heading">
          <h2>Checklist: {applicationName}</h2>
          <div className="checklist-progress-row">
            <p className="checklist-progress-label">
              {completedCount} of {totalCount} items completed
            </p>
            <span className="checklist-progress-badge">{progress}%</span>
          </div>
          <div className="checklist-progress-bar">
            <div className="checklist-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ul className="checklist-items">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`checklist-item ${item.completed ? 'is-complete' : ''}`}
                onClick={() => dispatch(toggleItem(item.id))}
                aria-pressed={item.completed}
              >
                <span className="checklist-item-icon">
                  <DocumentIcon />
                </span>
                <span className="checklist-item-text">
                  <span className="checklist-item-title">{item.title}</span>
                  <span className="checklist-item-desc">{item.description}</span>
                </span>
                <span className="checklist-item-check">{item.completed && <CheckIcon />}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="checklist-actions">
          <button
            type="button"
            className="checklist-btn checklist-btn-primary"
            onClick={() =>
              window.location.href =
              "https://irembo.gov.rw/user/citizen/service/nesa/application_for_equating_foreign_qualifications_for_general_education"
            }
          >
            Go to Service
          </button>

          <button
            type="button"
            className="checklist-btn checklist-btn-outline"
            onClick={() =>
              window.open(
                "https://www.google.com/maps/dir/ALX+Rwanda,+Deco+Center,+KG+9+Ave,+Kigali/Irembo+Campus+%26+Headquarters,+KG+517+Street,+Kigali/@-1.9345803,30.090429,3100m/data=!3m2!1e3!4b1!4m14!4m13!1m5!1m1!1s0x19dca7007bbe35ed:0xd2dff7bc3ca71163!2m2!1d30.0986948!2d-1.9270343!1m5!1m1!1s0x19dca7e1da543b6f:0x9a1d82d08ecd9558!2m2!1d30.1032144!2d-1.9416317!3e0",
                "_blank"
              )
            }
          >
            Find Office
          </button>
        </div>

        <div className="checklist-note">
          <span className="checklist-note-icon">!</span>
          <p>
            Once all documents are ready, you can book an appointment at your nearest office to
            complete your application.
          </p>
        </div>
      </main>

      <nav className="checklist-bottomnav" aria-label="Primary">
        <button
          type="button"
          className="checklist-nav-item"
          onClick={() => navigate(ROUTE_PATHS.landing)}
        >
          <HomeIcon />
          <span>Home</span>
        </button>
        <button
          type="button"
          className="checklist-nav-item"
          onClick={() => navigate(ROUTE_PATHS.services)}
        >
          <ServicesNavIcon />
          <span>Services</span>
        </button>
        <button
          type="button"
          className="checklist-nav-item"
          onClick={() => navigate(ROUTE_PATHS.chat)}
        >
          <ChatIcon />
          <span>Chat</span>
        </button>
        <button type="button" className="checklist-nav-item is-active">
          <ListIcon />
          <span>Checklist</span>
        </button>
        <button
          type="button"
          className="checklist-nav-item"
          onClick={() => navigate(ROUTE_PATHS.profile)}
        >
          <UserIcon />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6h11M9 12h11M9 18h11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ServicesNavIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default ChecklistPage
