import { useState, createContext, useContext, useEffect } from 'react'
import {
  Building2, Zap, Flame, Droplets, Trash2, Landmark,
  ArrowLeft, ArrowRight, Phone, KeyRound, Shield,
  LayoutDashboard, FileText, MapPin, User, LogOut,
  Clock, Camera, Upload, Search, Star, AlertCircle,
  CheckCircle, XCircle, ChevronRight, Menu, Settings,
  CreditCard, Receipt, Wrench, Plus, Send, Home,
  Globe, Languages, Timer, Bell, Download, Printer,
  Eye, EyeOff, HelpCircle, Mail, Calendar, Hash
} from 'lucide-react'
import './index.css'

// Context for app state
const AppContext = createContext()
export const useApp = () => useContext(AppContext)

// Languages
const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
]

// Translations
const translations = {
  en: {
    welcome: 'Welcome to SUVIDHA',
    tagline: 'Smart Urban Virtual Interactive Digital Helpdesk Assistant',
    selectLanguage: 'Select Your Language',
    getStarted: 'Get Started',
    login: 'Login',
    services: 'Services',
    complaints: 'Complaints',
    trackStatus: 'Track Status',
    profile: 'Profile',
    logout: 'End Session',
    electricity: 'Electricity',
    gas: 'Gas',
    water: 'Water Supply',
    municipal: 'Municipal Services',
    waste: 'Waste Management',
    newConnection: 'New Connection',
    billPayment: 'Bill Payment',
    meterReading: 'Meter Reading',
    fileComplaint: 'File Complaint',
    enterPhone: 'Enter Mobile Number',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    enterOTP: 'Enter 6-digit OTP',
    back: 'Back',
    submit: 'Submit',
    cancel: 'Cancel',
    sessionTimeout: 'Session Timeout Warning',
    continueSession: 'Continue Session',
    endSession: 'End Session',
    govtOf: 'Government of India',
    cdacInit: 'C-DAC Initiative',
  },
  hi: {
    welcome: 'सुविधा में आपका स्वागत है',
    tagline: 'स्मार्ट शहरी वर्चुअल इंटरैक्टिव डिजिटल हेल्पडेस्क सहायक',
    selectLanguage: 'अपनी भाषा चुनें',
    getStarted: 'शुरू करें',
    login: 'लॉगिन',
    services: 'सेवाएं',
    complaints: 'शिकायतें',
    trackStatus: 'स्थिति ट्रैक करें',
    profile: 'प्रोफ़ाइल',
    logout: 'सत्र समाप्त करें',
    electricity: 'बिजली',
    gas: 'गैस',
    water: 'जल आपूर्ति',
    municipal: 'नगरपालिका सेवाएं',
    waste: 'कचरा प्रबंधन',
    newConnection: 'नया कनेक्शन',
    billPayment: 'बिल भुगतान',
    meterReading: 'मीटर रीडिंग',
    fileComplaint: 'शिकायत दर्ज करें',
    enterPhone: 'मोबाइल नंबर दर्ज करें',
    sendOTP: 'OTP भेजें',
    verifyOTP: 'OTP सत्यापित करें',
    enterOTP: '6 अंकों का OTP दर्ज करें',
    back: 'वापस',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    govtOf: 'भारत सरकार',
    cdacInit: 'सी-डैक पहल',
  },
}

const t = (key, lang) => translations[lang]?.[key] || translations.en[key] || key

// Department configurations with icons
const DEPARTMENTS = [
  { id: 'electricity', icon: Zap, color: '#f59e0b', colorClass: 'electricity' },
  { id: 'gas', icon: Flame, color: '#ef4444', colorClass: 'gas' },
  { id: 'water', icon: Droplets, color: '#06b6d4', colorClass: 'water' },
  { id: 'municipal', icon: Building2, color: '#8b5cf6', colorClass: 'municipal' },
  { id: 'waste', icon: Trash2, color: '#22c55e', colorClass: 'waste' },
]

function App() {
  const [language, setLanguage] = useState(null)
  const [currentPage, setCurrentPage] = useState('language')
  const [user, setUser] = useState(null)
  const [sessionTime, setSessionTime] = useState(180) // 3 minutes
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)

  // Session timer effect
  useEffect(() => {
    if (!user) return

    const timer = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          // Auto logout
          setUser(null)
          setCurrentPage('language')
          sessionStorage.clear()
          return 180
        }
        if (prev === 60) {
          setShowTimeoutWarning(true)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user])

  const resetSession = () => {
    setSessionTime(180)
    setShowTimeoutWarning(false)
  }

  const navigate = (page) => {
    setCurrentPage(page)
    resetSession() // Reset timer on navigation
  }

  const getText = (key) => t(key, language || 'en')

  const contextValue = {
    language, setLanguage, currentPage, navigate,
    user, setUser, getText, sessionTime, DEPARTMENTS,
    resetSession, showTimeoutWarning, setShowTimeoutWarning
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app">
        {currentPage === 'language' && <LanguageSelect />}
        {currentPage === 'welcome' && <WelcomeScreen />}
        {currentPage === 'login' && <LoginScreen />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'services' && <ServicesScreen />}
        {currentPage === 'complaints' && <ComplaintsScreen />}
        {currentPage === 'status' && <StatusScreen />}
        {currentPage === 'service-form' && <ServiceFormScreen />}
        {currentPage === 'profile' && <ProfileScreen />}
        {currentPage === 'receipt' && <ReceiptScreen />}
        {user && currentPage !== 'language' && currentPage !== 'welcome' && <SessionBar />}
        {showTimeoutWarning && <TimeoutWarningModal />}
      </div>
    </AppContext.Provider>
  )
}

// Language Selection Screen
function LanguageSelect() {
  const { setLanguage, navigate } = useApp()

  const handleSelect = (code) => {
    setLanguage(code)
    navigate('welcome')
  }

  return (
    <div className="screen language-screen">
      <div className="screen-content">
        <div className="logo-section animate-fade-in">
          <div className="logo-icon">
            <Landmark size={80} strokeWidth={1.5} />
          </div>
          <h1 className="logo-text">SUVIDHA</h1>
          <p className="tagline">Smart Urban Virtual Interactive Digital Helpdesk Assistant</p>
          <div className="govt-badge">
            <Shield size={20} />
            <span>Government of India | C-DAC Initiative</span>
          </div>
        </div>

        <div className="language-grid animate-slide-up">
          <h2>
            <Languages size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Select Your Language / अपनी भाषा चुनें
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className="language-btn card card-hover"
                onClick={() => handleSelect(lang.code)}
                aria-label={`Select ${lang.name}`}
              >
                <Globe size={24} className="lang-icon" />
                <span className="native">{lang.native}</span>
                <span className="english">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{languageScreenStyles}</style>
    </div>
  )
}

// Welcome Screen
function WelcomeScreen() {
  const { getText, navigate, DEPARTMENTS } = useApp()

  return (
    <div className="screen welcome-screen">
      <div className="screen-content">
        <div className="welcome-hero animate-fade-in">
          <div className="hero-icon">
            <Landmark size={96} strokeWidth={1.5} />
          </div>
          <h1>{getText('welcome')}</h1>
          <p className="hero-tagline">{getText('tagline')}</p>
        </div>

        <div className="services-preview animate-slide-up">
          <div className="preview-grid">
            {DEPARTMENTS.slice(0, 4).map((dept) => {
              const Icon = dept.icon
              return (
                <div key={dept.id} className="preview-item">
                  <Icon size={40} style={{ color: dept.color }} />
                  <span>{getText(dept.id)}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button className="btn btn-primary btn-xl" onClick={() => navigate('login')}>
          {getText('getStarted')}
          <ArrowRight size={24} />
        </button>
      </div>
      <style>{welcomeScreenStyles}</style>
    </div>
  )
}

// Login Screen
function LoginScreen() {
  const { getText, navigate, setUser } = useApp()
  const [phone, setPhone] = useState('')
  const [otp, setOTP] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setStep('otp')
      }, 1500)
    }
  }

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setLoading(true)
      setTimeout(() => {
        setUser({ phone, name: 'Citizen User' })
        navigate('dashboard')
      }, 1000)
    }
  }

  return (
    <div className="screen login-screen">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('welcome')}>
        <ArrowLeft size={20} />
        {getText('back')}
      </button>

      <div className="screen-content">
        <div className="login-card card card-glass animate-slide-up">
          <div className="card-body">
            <div className="login-header">
              <Shield size={48} className="text-primary" />
              <h2>{getText('login')}</h2>
              <p>Secure OTP Verification</p>
            </div>

            {step === 'phone' ? (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={18} />
                    {getText('enterPhone')}
                  </label>
                  <div className="phone-input">
                    <span className="prefix">+91</span>
                    <input
                      type="tel"
                      className="input input-lg"
                      placeholder="9876543210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      aria-label="Mobile number"
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleSendOTP}
                  disabled={phone.length !== 10 || loading}
                >
                  {loading ? <span className="spinner" /> : (
                    <>
                      <Send size={20} />
                      {getText('sendOTP')}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <KeyRound size={18} />
                    {getText('enterOTP')}
                  </label>
                  <div className="otp-inputs">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        className="otp-box"
                        maxLength={1}
                        value={otp[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          const newOtp = otp.split('')
                          newOtp[i] = val
                          setOTP(newOtp.join(''))
                          if (val && e.target.nextSibling) e.target.nextSibling.focus()
                        }}
                        aria-label={`OTP digit ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="form-hint">
                    <CheckCircle size={16} className="text-success" />
                    OTP sent to +91 {phone}
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? <span className="spinner" /> : (
                    <>
                      <Shield size={20} />
                      {getText('verifyOTP')}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{loginScreenStyles}</style>
    </div>
  )
}

// Dashboard
function Dashboard() {
  const { getText, navigate, user, DEPARTMENTS } = useApp()

  const menuItems = [
    { id: 'services', icon: Wrench, label: getText('services'), color: '#3b82f6' },
    { id: 'complaints', icon: FileText, label: getText('complaints'), color: '#ef4444' },
    { id: 'status', icon: MapPin, label: getText('trackStatus'), color: '#22c55e' },
    { id: 'profile', icon: User, label: getText('profile'), color: '#8b5cf6' },
  ]

  const quickActions = [
    { icon: Zap, label: 'Pay Electricity Bill', color: '#f59e0b' },
    { icon: Droplets, label: 'Report Water Issue', color: '#06b6d4' },
    { icon: Trash2, label: 'Request Pickup', color: '#22c55e' },
    { icon: Receipt, label: 'Download Receipt', color: '#8b5cf6' },
  ]

  return (
    <div className="screen dashboard-screen">
      <div className="screen-content">
        <div className="dashboard-header animate-fade-in">
          <div className="welcome-text">
            <Home size={32} className="text-primary" />
            <div>
              <h1>Welcome, {user?.name || 'Citizen'}</h1>
              <p>How can we help you today?</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid animate-slide-up">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className="dashboard-card card card-hover"
                onClick={() => navigate(item.id)}
                style={{ '--card-color': item.color }}
              >
                <Icon size={48} style={{ color: item.color }} />
                <span className="card-label">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="quick-actions animate-slide-up">
          <h3>Quick Services</h3>
          <div className="action-chips">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} className="chip">
                  <Icon size={18} style={{ color: action.color }} />
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <style>{dashboardStyles}</style>
    </div>
  )
}

// Services Screen
function ServicesScreen() {
  const { getText, navigate, DEPARTMENTS } = useApp()
  const [selectedDept, setSelectedDept] = useState(null)

  const services = {
    electricity: [
      { name: 'New Connection', icon: Plus },
      { name: 'Bill Payment', icon: CreditCard },
      { name: 'Meter Reading', icon: Search },
      { name: 'Name Transfer', icon: User },
      { name: 'Load Enhancement', icon: Zap },
    ],
    gas: [
      { name: 'New Connection', icon: Plus },
      { name: 'Cylinder Booking', icon: Flame },
      { name: 'Address Change', icon: MapPin },
      { name: 'Transfer Connection', icon: User },
    ],
    water: [
      { name: 'New Connection', icon: Plus },
      { name: 'Bill Payment', icon: CreditCard },
      { name: 'Pipeline Repair', icon: Wrench },
      { name: 'Quality Test', icon: Search },
    ],
    municipal: [
      { name: 'Birth Certificate', icon: FileText },
      { name: 'Death Certificate', icon: FileText },
      { name: 'Property Tax', icon: CreditCard },
      { name: 'Trade License', icon: FileText },
    ],
    waste: [
      { name: 'Schedule Pickup', icon: Clock },
      { name: 'Large Item Disposal', icon: Trash2 },
      { name: 'Recycling Info', icon: Trash2 },
      { name: 'Composting', icon: Trash2 },
    ],
  }

  const selectedDepartment = DEPARTMENTS.find(d => d.id === selectedDept)

  return (
    <div className="screen services-screen">
      <header className="screen-header">
        <button className="btn btn-ghost" onClick={() => selectedDept ? setSelectedDept(null) : navigate('dashboard')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>
          <Wrench size={24} />
          {getText('services')}
        </h2>
        <div style={{ width: 80 }} />
      </header>

      <div className="screen-content">
        {!selectedDept ? (
          <div className="dept-grid animate-slide-up">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon
              return (
                <button
                  key={dept.id}
                  className="dept-card card card-hover"
                  onClick={() => setSelectedDept(dept.id)}
                  style={{ '--dept-color': dept.color }}
                >
                  <Icon size={48} style={{ color: dept.color }} />
                  <span className="dept-name">{getText(dept.id)}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="services-list animate-slide-up">
            <div className="selected-dept-header">
              {selectedDepartment && (
                <>
                  {(() => { const Icon = selectedDepartment.icon; return <Icon size={32} style={{ color: selectedDepartment.color }} /> })()}
                  <h3>{getText(selectedDept)}</h3>
                </>
              )}
            </div>
            <div className="service-options">
              {services[selectedDept]?.map((service, i) => {
                const Icon = service.icon
                return (
                  <button
                    key={i}
                    className="service-option card card-hover"
                    onClick={() => navigate('service-form')}
                  >
                    <div className="service-info">
                      <Icon size={24} style={{ color: selectedDepartment?.color }} />
                      <span>{service.name}</span>
                    </div>
                    <ChevronRight size={24} className="text-muted" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <style>{servicesStyles}</style>
    </div>
  )
}

// Complaints Screen
function ComplaintsScreen() {
  const { getText, navigate, DEPARTMENTS } = useApp()
  const [form, setForm] = useState({ department: '', category: '', description: '' })
  const [submitted, setSubmitted] = useState(false)

  const categories = ['Power Outage', 'Billing Issue', 'Meter Problem', 'Service Quality', 'Other']

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      navigate('dashboard')
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="screen complaints-screen">
        <div className="screen-content">
          <div className="success-card card animate-slide-up">
            <div className="card-body text-center">
              <CheckCircle size={80} className="text-success" />
              <h2>Complaint Submitted!</h2>
              <p>Your complaint ID: <strong>CMP-2026-{Math.floor(Math.random() * 1000)}</strong></p>
              <p className="text-muted">You will receive updates via SMS</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen complaints-screen">
      <header className="screen-header">
        <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>
          <FileText size={24} />
          {getText('fileComplaint')}
        </h2>
        <div style={{ width: 80 }} />
      </header>

      <div className="screen-content">
        <div className="complaint-form card card-glass animate-slide-up">
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">
                <Building2 size={18} />
                Department
              </label>
              <select
                className="input"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.id} value={dept.id}>{getText(dept.id)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <AlertCircle size={18} />
                Category
              </label>
              <div className="category-chips">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`chip ${form.category === cat ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={18} />
                Description
              </label>
              <textarea
                className="input"
                rows={4}
                placeholder="Describe your issue in detail..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Camera size={18} />
                Upload Photo (Optional)
              </label>
              <div className="upload-area">
                <Upload size={32} className="text-muted" />
                <p>Tap to upload or take photo</p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleSubmit}
              disabled={!form.department || !form.category || !form.description}
            >
              <Send size={20} />
              {getText('submit')}
            </button>
          </div>
        </div>
      </div>
      <style>{complaintsStyles}</style>
    </div>
  )
}

// Status Tracking Screen
function StatusScreen() {
  const { navigate } = useApp()

  const requests = [
    { id: 'REQ-2026-001', type: 'New Connection', dept: 'Electricity', status: 'In Progress', date: '28 Jan 2026', progress: 60, icon: Zap, color: '#f59e0b' },
    { id: 'CMP-2026-042', type: 'Complaint', dept: 'Water', status: 'Resolved', date: '25 Jan 2026', progress: 100, icon: Droplets, color: '#06b6d4' },
    { id: 'REQ-2026-003', type: 'Bill Dispute', dept: 'Gas', status: 'Pending', date: '30 Jan 2026', progress: 20, icon: Flame, color: '#ef4444' },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle size={18} className="text-success" />
      case 'In Progress': return <Clock size={18} className="text-primary" />
      default: return <AlertCircle size={18} className="text-warning" />
    }
  }

  return (
    <div className="screen status-screen">
      <header className="screen-header">
        <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>
          <MapPin size={24} />
          Track Status
        </h2>
        <div style={{ width: 80 }} />
      </header>

      <div className="screen-content">
        <div className="search-box mb-6">
          <Search size={20} className="search-icon" />
          <input type="text" className="input" placeholder="Search by Request ID..." />
        </div>

        <div className="requests-list animate-slide-up">
          {requests.map(req => {
            const Icon = req.icon
            return (
              <div key={req.id} className="request-card card">
                <div className="request-header">
                  <div className="request-id-section">
                    <Icon size={24} style={{ color: req.color }} />
                    <span className="request-id">{req.id}</span>
                  </div>
                  <span className={`badge badge-${req.status === 'Resolved' ? 'success' : req.status === 'In Progress' ? 'primary' : 'warning'}`}>
                    {getStatusIcon(req.status)}
                    {req.status}
                  </span>
                </div>
                <div className="request-body">
                  <p className="request-type">{req.type}</p>
                  <p className="request-dept">
                    <Clock size={14} />
                    {req.dept} • {req.date}
                  </p>
                </div>
                <div className="request-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${req.progress}%`,
                        background: req.status === 'Resolved' ? 'var(--success-500)' : undefined
                      }}
                    />
                  </div>
                  <span className="progress-text">{req.progress}% Complete</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{statusStyles}</style>
    </div>
  )
}

// Service Form Screen
function ServiceFormScreen() {
  const { navigate, getText } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', address: '', pincode: '', connectionType: ''
  })

  const handleSubmit = () => {
    setStep(3) // Success
  }

  return (
    <div className="screen service-form-screen">
      <header className="screen-header">
        <button className="btn btn-ghost" onClick={() => step > 1 ? setStep(step - 1) : navigate('services')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>New Connection Application</h2>
        <div style={{ width: 80 }} />
      </header>

      <div className="screen-content">
        {/* Progress Steps */}
        <div className="progress-steps mb-6">
          {['Details', 'Documents', 'Confirm'].map((label, i) => (
            <div key={i} className={`step ${step > i ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">
                {step > i + 1 ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="form-card card card-glass animate-slide-up">
            <div className="card-body">
              <h3>Applicant Details</h3>

              <div className="form-group">
                <label className="form-label"><User size={18} /> Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label"><MapPin size={18} /> Address</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Enter complete address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="560001"
                    maxLength={6}
                    value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Connection Type</label>
                  <select
                    className="input"
                    value={form.connectionType}
                    onChange={e => setForm({ ...form, connectionType: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="domestic">Domestic</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-primary btn-lg w-full" onClick={() => setStep(2)}>
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-card card card-glass animate-slide-up">
            <div className="card-body">
              <h3>Upload Documents</h3>

              {['ID Proof (Aadhaar/PAN)', 'Address Proof', 'Property Document', 'Passport Photo'].map((doc, i) => (
                <div key={i} className="document-upload">
                  <div className="doc-info">
                    <FileText size={24} />
                    <span>{doc}</span>
                  </div>
                  <button className="btn btn-secondary">
                    <Upload size={18} /> Upload
                  </button>
                </div>
              ))}

              <div className="form-hint">
                <AlertCircle size={16} />
                All documents should be clear and legible. Max size: 5MB each.
              </div>

              <button className="btn btn-primary btn-lg w-full" onClick={handleSubmit}>
                Submit Application <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="success-card card animate-slide-up">
            <div className="card-body text-center">
              <CheckCircle size={80} className="text-success" />
              <h2>Application Submitted!</h2>
              <p>Your application ID: <strong>APP-2026-{Math.floor(Math.random() * 10000)}</strong></p>
              <p className="text-muted">Expected processing time: 5-7 working days</p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('dashboard')}>
                <Home size={20} /> Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{serviceFormStyles}</style>
    </div>
  )
}

// Session Bar
function SessionBar() {
  const { getText, navigate, setUser, sessionTime, resetSession } = useApp()

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndSession = () => {
    setUser(null)
    navigate('language')
    sessionStorage.clear()
  }

  const isLow = sessionTime <= 60

  return (
    <div className="session-bar">
      <div className={`session-timer ${isLow ? 'timer-warning' : ''}`}>
        <Timer size={20} />
        <span>Session: {formatTime(sessionTime)}</span>
      </div>
      <div className="session-actions">
        <button className="btn btn-ghost btn-sm" onClick={resetSession} title="Extend Session">
          <Clock size={18} />
        </button>
        <button className="btn btn-ghost btn-sm">
          <Bell size={18} />
        </button>
        <button className="btn btn-ghost btn-sm">
          <Settings size={18} />
        </button>
        <button className="btn btn-danger" onClick={handleEndSession}>
          <LogOut size={18} />
          {getText('logout')}
        </button>
      </div>
      <style>{sessionBarStyles}</style>
    </div>
  )
}

// Profile Screen
function ProfileScreen() {
  const { navigate, user, getText } = useApp()

  const userData = {
    name: user?.name || 'Citizen User',
    phone: user?.phone || '9876543210',
    email: 'citizen@example.com',
    aadhaar: '****-****-1234',
    address: '123, Main Street, New Delhi - 110001',
    registeredDate: '15 Jan 2024',
  }

  const recentActivity = [
    { type: 'Service', desc: 'New Electricity Connection', date: '28 Jan 2026', status: 'In Progress' },
    { type: 'Complaint', desc: 'Water Supply Issue', date: '25 Jan 2026', status: 'Resolved' },
    { type: 'Payment', desc: 'Gas Bill Payment', date: '20 Jan 2026', status: 'Completed' },
  ]

  return (
    <div className="screen profile-screen">
      <header className="screen-header">
        <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>
          <User size={24} />
          {getText('profile')}
        </h2>
        <div style={{ width: 80 }} />
      </header>

      <div className="screen-content">
        <div className="profile-grid animate-slide-up">
          {/* Profile Card */}
          <div className="profile-card card">
            <div className="card-body">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <h3>{userData.name}</h3>
              <p className="text-muted">Verified Citizen</p>

              <div className="profile-details">
                <div className="detail-row">
                  <Phone size={18} />
                  <span>+91 {userData.phone}</span>
                </div>
                <div className="detail-row">
                  <Mail size={18} />
                  <span>{userData.email}</span>
                </div>
                <div className="detail-row">
                  <Hash size={18} />
                  <span>Aadhaar: {userData.aadhaar}</span>
                </div>
                <div className="detail-row">
                  <MapPin size={18} />
                  <span>{userData.address}</span>
                </div>
                <div className="detail-row">
                  <Calendar size={18} />
                  <span>Member since {userData.registeredDate}</span>
                </div>
              </div>

              <button className="btn btn-secondary w-full">
                <Settings size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((item, i) => (
                <div key={i} className="activity-item card">
                  <div className="activity-info">
                    <span className="activity-type">{item.type}</span>
                    <span className="activity-desc">{item.desc}</span>
                    <span className="activity-date">{item.date}</span>
                  </div>
                  <span className={`badge badge-${item.status === 'Resolved' || item.status === 'Completed' ? 'success' : 'primary'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="quick-links">
              <button className="btn btn-secondary" onClick={() => navigate('receipt')}>
                <Receipt size={18} />
                View Receipts
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('status')}>
                <Search size={18} />
                Track Requests
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{profileStyles}</style>
    </div>
  )
}

// Receipt Screen
function ReceiptScreen() {
  const { navigate } = useApp()

  const receipts = [
    { id: 'RCP-2026-001', type: 'Bill Payment', dept: 'Electricity', amount: '₹2,450', date: '28 Jan 2026', icon: Zap, color: '#f59e0b' },
    { id: 'RCP-2026-002', type: 'Application Fee', dept: 'Municipal', amount: '₹500', date: '25 Jan 2026', icon: Building2, color: '#8b5cf6' },
    { id: 'RCP-2026-003', type: 'Bill Payment', dept: 'Gas', amount: '₹850', date: '20 Jan 2026', icon: Flame, color: '#ef4444' },
  ]

  return (
    <div className="screen receipt-screen">
      <header className="screen-header">
        <button className="btn btn-ghost" onClick={() => navigate('profile')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>
          <Receipt size={24} />
          Receipts
        </h2>
        <div style={{ width: 80 }} />
      </header>

      <div className="screen-content">
        <div className="receipts-list animate-slide-up">
          {receipts.map((receipt) => {
            const Icon = receipt.icon
            return (
              <div key={receipt.id} className="receipt-card card">
                <div className="receipt-header">
                  <Icon size={32} style={{ color: receipt.color }} />
                  <div className="receipt-info">
                    <span className="receipt-id">{receipt.id}</span>
                    <span className="receipt-type">{receipt.type} - {receipt.dept}</span>
                  </div>
                  <span className="receipt-amount">{receipt.amount}</span>
                </div>
                <div className="receipt-footer">
                  <span className="receipt-date">
                    <Calendar size={14} />
                    {receipt.date}
                  </span>
                  <div className="receipt-actions">
                    <button className="btn btn-ghost btn-sm">
                      <Eye size={16} />
                      View
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Download size={16} />
                      Download
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Printer size={16} />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{receiptStyles}</style>
    </div>
  )
}

// Timeout Warning Modal
function TimeoutWarningModal() {
  const { getText, resetSession, setUser, navigate, setShowTimeoutWarning, sessionTime } = useApp()

  const handleContinue = () => {
    resetSession()
    setShowTimeoutWarning(false)
  }

  const handleEndSession = () => {
    setUser(null)
    navigate('language')
    setShowTimeoutWarning(false)
    sessionStorage.clear()
  }

  return (
    <div className="modal-overlay">
      <div className="modal animate-slide-up">
        <div className="card-body text-center">
          <AlertCircle size={64} className="text-warning" />
          <h2 style={{ marginTop: '1rem' }}>{getText('sessionTimeout')}</h2>
          <p className="text-muted">Your session will expire in {sessionTime} seconds due to inactivity.</p>

          <div className="modal-actions">
            <button className="btn btn-primary btn-lg" onClick={handleContinue}>
              <Clock size={20} />
              {getText('continueSession')}
            </button>
            <button className="btn btn-danger btn-lg" onClick={handleEndSession}>
              <LogOut size={20} />
              {getText('endSession')}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .text-warning { color: var(--warning-500); }
      `}</style>
    </div>
  )
}

// Styles
const languageScreenStyles = `
  .language-screen { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%); }
  .logo-section { text-align: center; margin-bottom: 3rem; }
  .logo-icon { display: flex; justify-content: center; color: white; margin-bottom: 1rem; }
  .logo-text { font-size: 3.5rem; color: white; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
  .tagline { color: rgba(255,255,255,0.8); font-size: 1.1rem; }
  .govt-badge { margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.1); border-radius: 2rem; color: white; display: inline-flex; align-items: center; gap: 0.75rem; }
  .language-grid { text-align: center; }
  .language-grid h2 { color: white; margin-bottom: 2rem; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; }
  .language-btn { padding: 1.5rem; text-align: center; cursor: pointer; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; }
  .language-btn .lang-icon { color: var(--primary-500); margin-bottom: 0.5rem; }
  .language-btn .native { font-size: 1.5rem; font-weight: 600; }
  .language-btn .english { font-size: 0.9rem; color: var(--gray-500); }
`

const welcomeScreenStyles = `
  .welcome-screen { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); }
  .welcome-hero { text-align: center; margin-bottom: 3rem; }
  .hero-icon { display: flex; justify-content: center; color: white; margin-bottom: 1rem; }
  .welcome-hero h1 { font-size: 2.5rem; color: white; margin-bottom: 0.5rem; }
  .hero-tagline { color: rgba(255,255,255,0.8); font-size: 1.1rem; }
  .services-preview { margin-bottom: 3rem; }
  .preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .preview-item { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 1rem; color: white; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
`

const loginScreenStyles = `
  .login-screen { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); }
  .back-btn { position: absolute; top: 2rem; left: 2rem; }
  .login-card { max-width: 500px; margin: 0 auto; }
  .login-header { text-align: center; margin-bottom: 2rem; }
  .login-header h2 { font-size: 1.75rem; margin-top: 1rem; }
  .login-header p { color: var(--gray-500); }
  .phone-input { display: flex; gap: 0.5rem; }
  .phone-input .prefix { display: flex; align-items: center; padding: 0 1rem; background: var(--gray-100); border-radius: var(--radius-lg); font-weight: 600; }
  .otp-inputs { display: flex; gap: 0.75rem; justify-content: center; }
  .otp-box { width: 56px; height: 64px; text-align: center; font-size: 1.5rem; font-weight: 600; border: 2px solid var(--gray-200); border-radius: var(--radius-lg); }
  .otp-box:focus { border-color: var(--primary-500); outline: none; }
  .form-label { display: flex; align-items: center; gap: 0.5rem; }
  .form-hint { display: flex; align-items: center; gap: 0.5rem; }
`

const dashboardStyles = `
  .dashboard-screen { background: var(--gray-50); }
  .dashboard-header { margin-bottom: 2rem; }
  .welcome-text { display: flex; align-items: center; gap: 1rem; }
  .welcome-text h1 { font-size: 1.75rem; color: var(--gray-800); }
  .welcome-text p { color: var(--gray-500); }
  .dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
  .dashboard-card { padding: 2rem; text-align: center; cursor: pointer; border-left: 4px solid var(--card-color); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .dashboard-card .card-label { font-size: 1.25rem; font-weight: 600; color: var(--gray-700); }
  .quick-actions h3 { margin-bottom: 1rem; color: var(--gray-700); }
  .action-chips { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: white; border: 1px solid var(--gray-200); border-radius: 2rem; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; }
  .chip:hover, .chip.active { background: var(--primary-500); color: white; border-color: var(--primary-500); }
  .chip:hover svg, .chip.active svg { color: white !important; }
`

const servicesStyles = `
  .services-screen { background: var(--gray-50); }
  .screen-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: white; border-bottom: 1px solid var(--gray-200); }
  .screen-header h2 { font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
  .dept-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .dept-card { padding: 2rem; text-align: center; cursor: pointer; border-top: 4px solid var(--dept-color); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .dept-name { font-size: 1.1rem; font-weight: 600; }
  .selected-dept-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .selected-dept-header h3 { font-size: 1.5rem; margin: 0; }
  .service-options { display: flex; flex-direction: column; gap: 1rem; }
  .service-option { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; cursor: pointer; font-size: 1.1rem; }
  .service-info { display: flex; align-items: center; gap: 1rem; }
`

const complaintsStyles = `
  .complaints-screen { background: var(--gray-50); }
  .complaint-form { max-width: 600px; margin: 0 auto; }
  .category-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .upload-area { border: 2px dashed var(--gray-300); border-radius: var(--radius-lg); padding: 2rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .upload-area:hover { border-color: var(--primary-500); background: var(--primary-50); }
  textarea.input { resize: vertical; min-height: 120px; }
  .success-card { max-width: 500px; margin: 0 auto; padding: 3rem; }
  .success-card h2 { margin: 1.5rem 0 1rem; }
`

const statusStyles = `
  .status-screen { background: var(--gray-50); }
  .search-box { position: relative; }
  .search-box .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--gray-400); }
  .search-box .input { padding-left: 3rem; }
  .requests-list { display: flex; flex-direction: column; gap: 1rem; }
  .request-card { padding: 1.5rem; }
  .request-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .request-id-section { display: flex; align-items: center; gap: 0.75rem; }
  .request-id { font-weight: 600; font-family: monospace; font-size: 1rem; }
  .badge { display: flex; align-items: center; gap: 0.25rem; }
  .request-type { font-size: 1.1rem; font-weight: 500; }
  .request-dept { font-size: 0.9rem; color: var(--gray-500); margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
  .request-progress { margin-top: 1rem; }
  .progress-text { font-size: 0.8rem; color: var(--gray-500); margin-top: 0.5rem; display: block; }
`

const serviceFormStyles = `
  .service-form-screen { background: var(--gray-50); }
  .progress-steps { display: flex; justify-content: center; gap: 3rem; }
  .step { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.5; }
  .step.active, .step.completed { opacity: 1; }
  .step-circle { width: 40px; height: 40px; border-radius: 50%; background: var(--gray-200); display: flex; align-items: center; justify-content: center; font-weight: 600; }
  .step.active .step-circle { background: var(--primary-500); color: white; }
  .step.completed .step-circle { background: var(--success-500); color: white; }
  .form-card { max-width: 600px; margin: 0 auto; }
  .form-card h3 { margin-bottom: 1.5rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .document-upload { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--gray-50); border-radius: var(--radius-lg); margin-bottom: 1rem; }
  .doc-info { display: flex; align-items: center; gap: 1rem; }
  .success-card { max-width: 500px; margin: 0 auto; padding: 3rem; }
  .success-card h2 { margin: 1.5rem 0 1rem; }
`

const sessionBarStyles = `
  .session-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--gray-200); z-index: 100; }
  .session-timer { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--gray-600); padding: 0.5rem 1rem; border-radius: var(--radius-lg); transition: all 0.3s; }
  .session-timer.timer-warning { background: var(--error-50); color: var(--error-600); animation: pulse 1s ease-in-out infinite; }
  .session-actions { display: flex; align-items: center; gap: 0.5rem; }
  .btn-sm { min-height: 40px; min-width: 40px; padding: 0.5rem; }
`

const profileStyles = `
  .profile-screen { background: var(--gray-50); }
  .profile-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
  .profile-card { text-align: center; }
  .profile-avatar { width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary-500), var(--primary-600)); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
  .profile-card h3 { margin-bottom: 0.25rem; }
  .profile-details { margin: 1.5rem 0; text-align: left; }
  .detail-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--gray-100); }
  .detail-row:last-child { border-bottom: none; }
  .activity-section h3 { margin-bottom: 1rem; }
  .activity-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
  .activity-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; }
  .activity-info { display: flex; flex-direction: column; gap: 0.25rem; }
  .activity-type { font-size: 0.85rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; }
  .activity-desc { font-weight: 500; }
  .activity-date { font-size: 0.85rem; color: var(--gray-400); }
  .quick-links { display: flex; gap: 1rem; }
`

const receiptStyles = `
  .receipt-screen { background: var(--gray-50); }
  .receipts-list { display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 0 auto; }
  .receipt-card { padding: 1.5rem; }
  .receipt-header { display: flex; align-items: center; gap: 1rem; }
  .receipt-info { flex: 1; }
  .receipt-id { font-weight: 600; font-family: monospace; display: block; }
  .receipt-type { font-size: 0.9rem; color: var(--gray-500); }
  .receipt-amount { font-size: 1.5rem; font-weight: 700; color: var(--success-600); }
  .receipt-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-100); }
  .receipt-date { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--gray-500); }
  .receipt-actions { display: flex; gap: 0.5rem; }
`

// Global screen styles
const style = document.createElement('style')
style.textContent = `
  .screen { min-height: 100vh; display: flex; flex-direction: column; }
  .screen-content { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; justify-content: center; }
  .text-primary { color: var(--primary-500); }
  .text-success { color: var(--success-500); }
  .text-warning { color: var(--warning-500); }
  .text-muted { color: var(--gray-400); }
`
document.head.appendChild(style)

export default App
