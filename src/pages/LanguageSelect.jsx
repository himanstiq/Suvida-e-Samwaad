import { useState } from 'react'
import { Volume2, X, ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react'

// LanguageSelect - Premium First Screen with Hello! greeting and glassmorphism
export default function LanguageSelect({
  setLanguage,
  navigate,
  LANGUAGES
}) {
  const [selectedLang, setSelectedLang] = useState(null)

  const handleContinue = () => {
    if (selectedLang) {
      setLanguage(selectedLang)
      navigate('home')
    }
  }

  return (
    <div className="language-page">
      {/* Decorative Background Elements */}
      <div className="gradient-mesh" />
      <div className="noise-overlay" />
      <div className="decorative-circle circle-1" />
      <div className="decorative-circle circle-2" />
      <div className="decorative-circle circle-3" />

      {/* Top Progress Bar */}
      <div className="kiosk-progress">
        <div className="progress-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Dark Header with Glass Effect */}
      <header className="lang-header glass-dark">
        <button className="header-icon" title="Accessibility">
          <HelpCircle size={20} />
        </button>
        <button className="header-icon" title="Audio">
          <Volume2 size={20} />
        </button>
        <div style={{ flex: 1 }} />
        <button className="header-icon close-btn" title="Exit">
          <X size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="lang-content">
        {/* Glass Card Container */}
        <div className="lang-card glass-card animate-fade-in-up">
          <div className="greeting-section">
            <div className="greeting-icon animate-bounce-in stagger-1">
              <Sparkles size={32} />
            </div>
            <h1 className="greeting font-display animate-fade-in-up stagger-2">Hello!</h1>
            <p className="greeting-sub animate-fade-in-up stagger-3">
              Please select your preferred language to continue
            </p>
          </div>

          {/* Language Pills */}
          <div className="language-pills">
            {LANGUAGES.map((lang, index) => (
              <button
                key={lang.code}
                className={`lang-pill animate-fade-in-up stagger-${Math.min(index + 4, 8)} hover-scale press-scale ${selectedLang === lang.code ? 'selected' : ''}`}
                onClick={() => setSelectedLang(lang.code)}
              >
                <span className="pill-text">{lang.name}</span>
                {selectedLang === lang.code && (
                  <span className="pill-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Footer with Glass Effect */}
      <footer className="lang-footer glass-dark">
        <button className="footer-btn" disabled>
          <ChevronLeft size={18} />
          <span>previous</span>
        </button>
        <button
          className={`footer-btn next-btn ${selectedLang ? 'ready' : ''}`}
          onClick={handleContinue}
          disabled={!selectedLang}
        >
          <span>next</span>
          <ChevronRight size={18} />
        </button>
      </footer>

      <style>{languagePageStyles}</style>
    </div>
  )
}

const languagePageStyles = `
  .language-page {
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--cream) 0%, var(--sand) 100%);
    position: relative;
    overflow: hidden;
  }

  /* Decorative Circles */
  .circle-1 {
    width: clamp(200px, 30vw, 400px);
    height: clamp(200px, 30vw, 400px);
    top: -50px;
    right: -50px;
  }
  
  .circle-2 {
    width: clamp(150px, 20vw, 300px);
    height: clamp(150px, 20vw, 300px);
    bottom: 10%;
    left: -50px;
  }
  
  .circle-3 {
    width: clamp(100px, 15vw, 200px);
    height: clamp(100px, 15vw, 200px);
    top: 40%;
    right: 10%;
    opacity: 0.1;
  }

  /* Progress Bar */
  .kiosk-progress {
    background: var(--navy);
    padding: 0.5rem 1.5rem;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }

  .progress-dots {
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dot.active {
    background: var(--coral);
    width: 24px;
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(231, 111, 81, 0.5);
  }

  /* Dark Header */
  .lang-header {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .header-icon:hover {
    background: rgba(255,255,255,0.15);
    color: white;
    transform: scale(1.05);
  }

  .close-btn {
    background: transparent;
  }

  /* Main Content */
  .lang-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(0.75rem, 2vh, 1.5rem);
    position: relative;
    z-index: 5;
    min-height: 0;
  }

  /* Glass Card */
  .lang-card {
    padding: clamp(1.25rem, 3vh, 2.5rem);
    max-width: 380px;
    width: 100%;
  }

  .greeting-section {
    text-align: center;
    margin-bottom: clamp(1rem, 2vh, 2rem);
  }

  .greeting-icon {
    width: clamp(48px, 8vh, 64px);
    height: clamp(48px, 8vh, 64px);
    background: linear-gradient(135deg, var(--coral) 0%, var(--coral-light) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto clamp(0.75rem, 1.5vh, 1.25rem);
    color: white;
    box-shadow: 0 8px 24px rgba(231, 111, 81, 0.3);
  }

  .greeting {
    font-size: clamp(2.5rem, 6vh, 3.5rem);
    font-weight: 400;
    color: var(--navy);
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }

  .greeting-sub {
    font-size: clamp(0.875rem, 1.5vh, 1rem);
    color: var(--gray-500);
    font-weight: 400;
  }

  /* Language Pills */
  .language-pills {
    display: flex;
    flex-direction: column;
    gap: clamp(0.5rem, 1vh, 0.75rem);
    width: 100%;
  }

  .lang-pill {
    width: 100%;
    padding: clamp(0.625rem, 1.25vh, 1rem) clamp(1rem, 2vw, 1.5rem);
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid transparent;
    border-radius: var(--radius-full);
    font-size: clamp(0.9rem, 1.5vh, 1.05rem);
    font-weight: 500;
    font-family: var(--font-body);
    color: var(--gray-700);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    position: relative;
    box-shadow: 0 2px 8px rgba(28, 37, 65, 0.04);
  }

  .lang-pill:hover {
    background: var(--peach);
    color: var(--coral-deep);
    border-color: rgba(231, 111, 81, 0.2);
    box-shadow: 0 4px 16px rgba(231, 111, 81, 0.15);
  }

  .lang-pill.selected {
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 8px 24px rgba(184, 68, 58, 0.3);
    transform: scale(1.02);
  }

  .pill-text {
    position: relative;
    z-index: 2;
  }

  .pill-check {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    animation: fadeInScale 0.3s ease-out;
  }

  /* Dark Footer */
  .lang-footer {
    padding: clamp(0.75rem, 1.5vh, 1rem) 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }

  .footer-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vw, 1.5rem);
    background: transparent;
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: var(--radius-full);
    color: rgba(255,255,255,0.7);
    font-weight: 500;
    font-size: clamp(0.8rem, 1.25vh, 0.95rem);
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .footer-btn:hover:not(:disabled) {
    border-color: var(--coral-light);
    color: var(--coral-light);
  }

  .footer-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .next-btn {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
  }

  .next-btn.ready {
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 16px rgba(231, 111, 81, 0.4);
  }

  .next-btn.ready:hover {
    transform: translateX(4px);
    box-shadow: 0 6px 24px rgba(231, 111, 81, 0.5);
  }
`
