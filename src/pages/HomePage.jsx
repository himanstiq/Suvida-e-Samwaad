import { useState } from 'react'
import {
  Zap, Flame, Droplets, Building2, Trash2,
  Plus, CreditCard, Search, MapPin, Wrench,
  FileText, Clock, Settings, Shield, ChevronDown,
  Globe, AlertCircle, PhoneCall, ArrowRight
} from 'lucide-react'

// HomePage - Premium Services with Glassmorphism
export default function HomePage({
  language, setLanguage, getText, navigate,
  DEPARTMENTS, handleServiceSelect, user,
  setPendingAction, setShowHelpline, LANGUAGES
}) {
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [expandedDept, setExpandedDept] = useState(null)

  const services = {
    electricity: [
      { name: 'New Connection', icon: Plus },
      { name: 'Bill Payment', icon: CreditCard },
      { name: 'Meter Reading', icon: Search },
      { name: 'Load Enhancement', icon: Zap },
    ],
    gas: [
      { name: 'New Connection', icon: Plus },
      { name: 'Cylinder Booking', icon: Flame },
      { name: 'Address Change', icon: MapPin },
    ],
    water: [
      { name: 'New Connection', icon: Plus },
      { name: 'Bill Payment', icon: CreditCard },
      { name: 'Pipeline Repair', icon: Wrench },
    ],
    municipal: [
      { name: 'Birth Certificate', icon: FileText },
      { name: 'Death Certificate', icon: FileText },
      { name: 'Property Tax', icon: CreditCard },
    ],
    waste: [
      { name: 'Schedule Pickup', icon: Clock },
      { name: 'Bulk Disposal', icon: Trash2 },
      { name: 'Recycling Info', icon: Settings },
    ],
  }

  const quickActions = [
    { id: 'complaint', label: getText('fileComplaint'), icon: AlertCircle, color: 'var(--coral-deep)' },
    { id: 'status', label: getText('trackStatus'), icon: Search, color: 'var(--coral)' },
  ]

  const handleQuickAction = (actionId) => {
    if (user) {
      navigate(actionId === 'complaint' ? 'complaints' : 'status')
    } else {
      setPendingAction({ type: actionId })
      navigate('login')
    }
  }

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="home-page">
      {/* Decorative Background */}
      <div className="gradient-mesh" />
      <div className="noise-overlay" />

      {/* Premium Dark Header */}
      <header className="home-header glass-dark">
        <div className="header-brand">
          <div className="brand-icon-wrap">
            <Building2 size={24} />
          </div>
          <div>
            <span className="brand-name font-display">SUVIDHA</span>
            <span className="brand-tagline">{getText('tagline')}</span>
          </div>
        </div>

        <div className="header-actions">
          {/* Language Dropdown */}
          <div className="lang-dropdown">
            <button className="lang-btn hover-scale" onClick={() => setShowLangMenu(!showLangMenu)}>
              <Globe size={16} />
              <span>{currentLang.native}</span>
              <ChevronDown size={14} className={showLangMenu ? 'rotated' : ''} />
            </button>
            {showLangMenu && (
              <div className="lang-menu glass-card animate-fade-in-scale">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false) }}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          {!user && (
            <button className="login-btn hover-glow press-scale" onClick={() => navigate('login')}>
              {getText('login')}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="home-content">
        <div className="welcome-section animate-fade-in-up">
          <h1 className="font-display">{getText('welcome')}</h1>
          <p className="subtitle">Select a service to get started</p>
        </div>

        {/* Department Cards */}
        <div className="dept-grid">
          {DEPARTMENTS.map((dept, index) => {
            const Icon = dept.icon
            const isExpanded = expandedDept === dept.id
            const deptServices = services[dept.id] || []

            return (
              <div
                key={dept.id}
                className={`dept-card glass-card hover-lift animate-fade-in-up stagger-${Math.min(index + 1, 5)} ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="dept-header"
                  onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                  style={{ '--dept-color': dept.color }}
                >
                  <div className="dept-icon">
                    <Icon size={22} />
                  </div>
                  <span className="dept-name">{getText(dept.id)}</span>
                  <ChevronDown size={18} className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="service-list">
                    {deptServices.map((service, idx) => {
                      const ServiceIcon = service.icon
                      return (
                        <button
                          key={idx}
                          className={`service-item animate-fade-in-up stagger-${idx + 1} press-scale`}
                          onClick={() => handleServiceSelect(dept.id, service.name)}
                        >
                          <ServiceIcon size={18} />
                          <span>{service.name}</span>
                          <ArrowRight size={16} className="arrow" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-bar animate-fade-in-up stagger-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                className="quick-action-btn glass hover-scale press-scale"
                onClick={() => handleQuickAction(action.id)}
              >
                <Icon size={18} style={{ color: action.color }} />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>

        {/* Government Badge */}
        <div className="govt-footer animate-fade-in-up stagger-7">
          <Shield size={14} />
          <span>Government of India • C-DAC Initiative</span>
        </div>
      </div>

      {/* Helpline FAB with Pulse */}
      <button
        className="helpline-fab animate-bounce-in animate-pulse-glow"
        title="Call for Assistance"
        onClick={() => setShowHelpline(true)}
      >
        <PhoneCall size={24} />
      </button>

      <style>{homePageStyles}</style>
    </div>
  )
}

const homePageStyles = `
  .home-page {
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--cream) 0%, var(--sand) 100%);
    position: relative;
    overflow: hidden;
  }

  /* Premium Dark Header */
  .home-header {
    padding: clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vw, 1.5rem);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 100;
    flex-shrink: 0;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }

  .brand-icon-wrap {
    width: clamp(32px, 5vh, 40px);
    height: clamp(32px, 5vh, 40px);
    background: linear-gradient(135deg, var(--coral) 0%, var(--coral-light) 100%);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(231, 111, 81, 0.3);
  }

  .brand-name {
    font-size: clamp(1.1rem, 2.5vh, 1.4rem);
    font-weight: 400;
    display: block;
    color: white;
    letter-spacing: 0.02em;
  }

  .brand-tagline {
    font-size: clamp(0.55rem, 1vh, 0.7rem);
    opacity: 0.6;
    display: block;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Language Dropdown */
  .lang-dropdown {
    position: relative;
  }

  .lang-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: var(--radius-full);
    color: rgba(255,255,255,0.9);
    cursor: pointer;
    font-size: 0.875rem;
    font-family: var(--font-body);
    transition: all 0.25s ease;
  }

  .lang-btn:hover {
    background: rgba(255,255,255,0.15);
  }

  .lang-btn .rotated {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }

  .lang-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    min-width: 160px;
    z-index: 200;
    padding: 0.5rem;
  }

  .lang-option {
    display: block;
    width: 100%;
    padding: 0.625rem 1rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--gray-600);
    font-family: var(--font-body);
    border-radius: var(--radius-md);
  }

  .lang-option:hover {
    background: var(--peach);
    color: var(--coral-deep);
  }

  .lang-option.active {
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    color: white;
    font-weight: 600;
  }

  /* Login Button */
  .login-btn {
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    border: none;
    border-radius: var(--radius-full);
    color: white;
    font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px rgba(184, 68, 58, 0.3);
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(184, 68, 58, 0.4);
  }

  .home-content {
    flex: 1;
    padding: clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 3vw, 2rem);
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .welcome-section {
    text-align: center;
    margin-bottom: clamp(0.5rem, 1.5vh, 1.5rem);
    flex-shrink: 0;
  }

  .welcome-section h1 {
    font-size: clamp(1.5rem, 4vh, 2.25rem);
    color: var(--navy);
    margin-bottom: 0.25rem;
    font-weight: 400;
  }

  .welcome-section .subtitle {
    color: var(--gray-500);
    font-size: clamp(0.8rem, 1.5vh, 1rem);
  }

  /* Department Grid */
  .dept-grid {
    display: flex;
    flex-direction: column;
    gap: clamp(0.4rem, 0.8vh, 0.75rem);
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .dept-grid::-webkit-scrollbar {
    display: none;
  }

  .dept-card {
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .dept-card.expanded {
    box-shadow: 
      0 12px 40px rgba(28, 37, 65, 0.1),
      0 4px 16px rgba(28, 37, 65, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .dept-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: clamp(0.5rem, 1.25vh, 0.875rem) clamp(0.75rem, 2vw, 1.25rem);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .dept-header:hover {
    background: rgba(255, 212, 196, 0.3);
  }

  .dept-icon {
    width: clamp(36px, 5vh, 44px);
    height: clamp(36px, 5vh, 44px);
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--dept-color), color-mix(in srgb, var(--dept-color) 70%, white));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .dept-name {
    flex: 1;
    text-align: left;
    font-weight: 600;
    font-size: clamp(0.9rem, 1.5vh, 1.05rem);
    color: var(--navy);
    font-family: var(--font-body);
  }

  .expand-icon {
    color: var(--gray-400);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .expand-icon.rotated {
    transform: rotate(180deg);
    color: var(--coral);
  }

  /* Service List */
  .service-list {
    padding: 0.375rem 0.75rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
  }

  .service-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem;
    background: rgba(255, 255, 255, 0.6);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.25s ease;
    color: var(--gray-700);
    font-family: var(--font-body);
    font-size: clamp(0.85rem, 1.25vh, 0.95rem);
  }

  .service-item:hover {
    background: var(--peach);
    color: var(--coral-deep);
    transform: translateX(4px);
  }

  .service-item .arrow {
    margin-left: auto;
    opacity: 0;
    transition: all 0.25s ease;
    color: var(--coral);
  }

  .service-item:hover .arrow {
    opacity: 1;
    transform: translateX(4px);
  }

  /* Quick Actions */
  .quick-actions-bar {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-top: clamp(0.75rem, 1.5vh, 1.5rem);
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .quick-action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vw, 1.25rem);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-full);
    cursor: pointer;
    font-weight: 500;
    font-family: var(--font-body);
    font-size: clamp(0.8rem, 1.25vh, 0.9rem);
    transition: all 0.25s ease;
    color: var(--gray-700);
  }

  .quick-action-btn:hover {
    border-color: var(--coral);
    box-shadow: 0 4px 16px rgba(231, 111, 81, 0.15);
  }

  /* Government Footer */
  .govt-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: clamp(0.5rem, 1vh, 1rem);
    padding: clamp(0.5rem, 1vh, 0.75rem);
    color: var(--gray-400);
    font-size: clamp(0.65rem, 1vh, 0.75rem);
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }

  /* Helpline FAB */
  .helpline-fab {
    position: fixed;
    bottom: clamp(1rem, 2vh, 1.5rem);
    right: clamp(1rem, 2vw, 1.5rem);
    width: clamp(48px, 7vh, 56px);
    height: clamp(48px, 7vh, 56px);
    border-radius: 50%;
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    transition: transform 0.25s ease;
    animation-delay: 0.5s;
  }

  .helpline-fab:hover {
    transform: scale(1.1);
  }
`
