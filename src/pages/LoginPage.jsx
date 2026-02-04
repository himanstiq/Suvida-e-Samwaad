import { useState } from 'react'
import { ChevronLeft, ChevronRight, Phone, KeyRound, Shield, Volume2, X, HelpCircle, Check, RefreshCw } from 'lucide-react'
import VirtualKeyboard from '../components/VirtualKeyboard'

// LoginPage - Premium OTP authentication with glassmorphism
export default function LoginPage({
  getText,
  navigate,
  handleLoginSuccess,
  pendingAction
}) {
  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [activeOtpIndex, setActiveOtpIndex] = useState(0)

  const handlePhoneKeyPress = (key) => {
    if (phone.length < 10) {
      setPhone(prev => prev + key)
    }
  }

  const handlePhoneBackspace = () => {
    setPhone(prev => prev.slice(0, -1))
  }

  const handleOtpKeyPress = (key) => {
    if (activeOtpIndex < 6 && /[0-9]/.test(key)) {
      const newOtp = [...otp]
      newOtp[activeOtpIndex] = key
      setOtp(newOtp)
      if (activeOtpIndex < 5) {
        setActiveOtpIndex(activeOtpIndex + 1)
      }
    }
  }

  const handleOtpBackspace = () => {
    if (activeOtpIndex > 0 || otp[0]) {
      const newOtp = [...otp]
      if (otp[activeOtpIndex]) {
        newOtp[activeOtpIndex] = ''
      } else if (activeOtpIndex > 0) {
        newOtp[activeOtpIndex - 1] = ''
        setActiveOtpIndex(activeOtpIndex - 1)
      }
      setOtp(newOtp)
    }
  }

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setStep('otp')
    }
  }

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length === 6) {
      handleLoginSuccess({
        phone: phone,
        name: 'Citizen User',
        id: 'USR-' + phone.slice(-4)
      })
    }
  }

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone')
      setOtp(['', '', '', '', '', ''])
      setActiveOtpIndex(0)
    } else {
      navigate('home')
    }
  }

  const isPhoneComplete = phone.length === 10
  const isOtpComplete = otp.join('').length === 6

  return (
    <div className="login-page">
      {/* Decorative Background */}
      <div className="gradient-mesh" />
      <div className="noise-overlay" />
      <div className="decorative-circle circle-1" />
      <div className="decorative-circle circle-2" />

      {/* Progress Bar */}
      <div className="kiosk-progress">
        <div className="progress-dots">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Dark Header */}
      <header className="login-header glass-dark">
        <button className="header-icon hover-scale" title="Accessibility">
          <HelpCircle size={20} />
        </button>
        <button className="header-icon hover-scale" title="Audio">
          <Volume2 size={20} />
        </button>
        <div style={{ flex: 1 }} />
        <button className="header-icon close-btn hover-scale" onClick={handleBack}>
          <X size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="login-content">
        {step === 'phone' ? (
          <div className="login-card glass-card animate-fade-in-up">
            <div className="login-icon animate-bounce-in stagger-1">
              <Phone size={28} />
            </div>
            <h2 className="font-display animate-fade-in-up stagger-2">{getText('login')}</h2>

            {pendingAction && (
              <div className="pending-notice animate-fade-in-up stagger-3">
                <Shield size={16} />
                <span>Login to continue with your request</span>
              </div>
            )}

            <div className="phone-input-section animate-fade-in-up stagger-3">
              <label>{getText('enterPhone')}</label>
              <div className={`phone-display ${isPhoneComplete ? 'complete' : ''}`}>
                <span className="country-code">+91</span>
                <span className="phone-number font-mono">
                  {phone || '••••••••••'}
                </span>
                {isPhoneComplete && (
                  <span className="check-icon">
                    <Check size={18} />
                  </span>
                )}
              </div>
            </div>

            <div className="animate-fade-in-up stagger-4">
              <VirtualKeyboard
                layout="numeric"
                onKeyPress={handlePhoneKeyPress}
                onBackspace={handlePhoneBackspace}
              />
            </div>
          </div>
        ) : (
          <div className="login-card glass-card animate-fade-in-up">
            <div className="login-icon otp-icon animate-bounce-in">
              <KeyRound size={28} />
            </div>
            <h2 className="font-display">{getText('verifyOTP')}</h2>
            <p className="otp-hint">Enter the 6-digit code sent to +91 {phone}</p>

            <div className="otp-boxes">
              {otp.map((digit, idx) => (
                <button
                  key={idx}
                  className={`otp-box animate-fade-in-up stagger-${idx + 1} ${activeOtpIndex === idx ? 'active' : ''} ${digit ? 'filled' : ''}`}
                  onClick={() => setActiveOtpIndex(idx)}
                >
                  {digit || ''}
                </button>
              ))}
            </div>

            <VirtualKeyboard
              layout="numeric"
              onKeyPress={handleOtpKeyPress}
              onBackspace={handleOtpBackspace}
            />

            <button className="resend-btn hover-scale" onClick={() => alert('OTP Resent!')}>
              <RefreshCw size={14} />
              <span>Resend OTP</span>
            </button>
          </div>
        )}
      </div>

      {/* Dark Footer */}
      <footer className="login-footer glass-dark">
        <button className="footer-btn hover-scale" onClick={handleBack}>
          <ChevronLeft size={18} />
          <span>back</span>
        </button>
        <button
          className={`footer-btn next-btn ${(step === 'phone' ? isPhoneComplete : isOtpComplete) ? 'ready' : ''}`}
          onClick={step === 'phone' ? handleSendOtp : handleVerifyOtp}
          disabled={step === 'phone' ? !isPhoneComplete : !isOtpComplete}
        >
          <span>{step === 'phone' ? getText('sendOTP') : getText('verifyOTP')}</span>
          <ChevronRight size={18} />
        </button>
      </footer>

      <style>{loginPageStyles}</style>
    </div>
  )
}

const loginPageStyles = `
  .login-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, var(--cream) 0%, var(--sand) 100%);
    position: relative;
    overflow: hidden;
  }

  /* Decorative Circles */
  .circle-1 {
    width: 350px;
    height: 350px;
    top: 20%;
    right: -100px;
  }
  
  .circle-2 {
    width: 250px;
    height: 250px;
    bottom: 20%;
    left: -80px;
  }

  .kiosk-progress {
    background: var(--navy);
    padding: 0.75rem 2rem;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 10;
  }

  .progress-dots {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    transition: all 0.3s ease;
  }

  .dot.active {
    background: var(--coral);
    width: 28px;
    border-radius: 5px;
    box-shadow: 0 0 12px rgba(231, 111, 81, 0.5);
  }

  .login-header {
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 10;
  }

  .header-icon {
    width: 42px;
    height: 42px;
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
  }

  .close-btn {
    background: transparent;
  }

  .login-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    position: relative;
    z-index: 5;
  }

  .login-card {
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    text-align: center;
  }

  .login-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--peach) 0%, var(--coral-light) 100%);
    color: var(--coral-deep);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    box-shadow: 0 8px 24px rgba(231, 111, 81, 0.2);
  }

  .otp-icon {
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(184, 68, 58, 0.3);
  }

  .login-card h2 {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
    color: var(--navy);
  }

  .pending-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background: rgba(255, 212, 196, 0.5);
    border: 1px solid var(--peach);
    border-radius: var(--radius-lg);
    color: var(--coral-deep);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .phone-input-section {
    margin: 1.5rem 0;
  }

  .phone-input-section label {
    display: block;
    color: var(--gray-500);
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  .phone-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.125rem 1.5rem;
    background: rgba(255, 255, 255, 0.6);
    border: 2px solid transparent;
    border-radius: var(--radius-xl);
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    transition: all 0.3s ease;
  }

  .phone-display.complete {
    border-color: var(--success-500);
    background: rgba(34, 197, 94, 0.08);
  }

  .country-code {
    color: var(--gray-400);
  }

  .phone-number {
    color: var(--navy);
  }

  .check-icon {
    color: var(--success-500);
    animation: fadeInScale 0.3s ease-out;
  }

  .otp-hint {
    color: var(--gray-500);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .otp-boxes {
    display: flex;
    gap: 0.625rem;
    justify-content: center;
    margin-bottom: 1.25rem;
  }

  .otp-box {
    width: 50px;
    height: 60px;
    border: 2px solid rgba(28, 37, 65, 0.1);
    border-radius: var(--radius-lg);
    background: rgba(255, 255, 255, 0.6);
    font-size: 1.75rem;
    font-weight: 600;
    font-family: var(--font-mono);
    color: var(--gray-300);
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .otp-box:hover {
    border-color: rgba(28, 37, 65, 0.2);
  }

  .otp-box.active {
    border-color: var(--coral);
    box-shadow: 0 0 0 4px rgba(231, 111, 81, 0.15);
    background: white;
  }

  .otp-box.filled {
    color: var(--navy);
    background: var(--peach);
    border-color: var(--coral-light);
  }

  .resend-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--coral-deep);
    font-weight: 500;
    font-family: var(--font-body);
    cursor: pointer;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    transition: all 0.25s ease;
  }

  .resend-btn:hover {
    background: rgba(184, 68, 58, 0.08);
  }

  .login-footer {
    padding: 1.25rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .footer-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    background: transparent;
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: var(--radius-full);
    color: rgba(255,255,255,0.7);
    font-weight: 500;
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
