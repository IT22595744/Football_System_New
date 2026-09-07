import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fifaCup from '../assets/fifa_cup.jpg'
import playersImage from '../assets/fo_players.png'

function Landing() {
  const navigate = useNavigate()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', countrycode: '', contactno: '',
  })

  const openAuth = (registerMode = false) => {
    setAuthError('')
    setIsRegister(registerMode)
    setIsAuthOpen(true)
  }

  const closeAuth = () => {
    setIsAuthOpen(false)
    setAuthError('')
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (event) => {
    const { name, value } = event.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
  }

  const navigateToDashboard = (user) => {
    localStorage.setItem('footballUser', JSON.stringify(user))
    navigate('/dashboard')
    closeAuth()
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/users/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()
      if (!response.ok) {
        setAuthError(data.message || 'Unable to login')
        return
      }

      navigateToDashboard(data.user)
    } catch {
      setAuthError('Unable to connect to server')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/users/reg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerForm,
          contactno: Number(registerForm.contactno),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setAuthError(data.message || 'Unable to register user')
        return
      }

      setLoginForm({ email: registerForm.email, password: registerForm.password })
      setIsRegister(false)
      setAuthError('Registration successful. Please login.')
    } catch {
      setAuthError('Unable to connect to server')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-[#b7ff3f] focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(183,255,63,0.12)]'

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b1410] px-4 py-3 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-[1280px] flex-col overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_100px_-50px_rgba(0,0,0,1)]">
        <section className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(120deg,rgba(11,20,16,0.98)_10%,rgba(17,30,23,0.88)_52%,rgba(11,20,16,0.92)_100%)]">
          <img
            src={fifaCup}
            alt="FIFA Cup background"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(183,255,63,0.12),transparent),linear-gradient(110deg,rgba(8,20,14,0.98)_18%,rgba(8,20,14,0.88)_56%,rgba(8,20,14,0.58)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(183,255,63,0.04)_0_1px,transparent_1px_84px)]" />

          <div className="relative z-10 flex h-full flex-col px-5 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#b7ff3f]/40 bg-[#132a1c] shadow-[0_0_24px_-6px_rgba(183,255,63,0.55)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#b7ff3f]">
                    <path d="M12 2 3.5 5v6.8c0 5.2 3.7 9.9 8.5 11.2 4.8-1.3 8.5-6 8.5-11.2V5L12 2Zm0 2.2 6.2 2.2v5.4c0 4.2-2.8 8.1-6.2 9.3-3.4-1.2-6.2-5.1-6.2-9.3V6.4L12 4.2Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/55">Football</p>
                  <p className="sn-display text-xl leading-none text-white sm:text-2xl">Player Hub</p>
                </div>
              </div>

              <nav className="hidden items-center gap-5 text-sm text-white/70 xl:flex">
                {['Home', 'Players', 'National Teams', 'About'].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="border-b-2 border-transparent py-1 transition after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[#b7ff3f] after:transition-transform hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <button
                className="sn-glow rounded-xl bg-[#b7ff3f] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0b1410] transition hover:brightness-110"
                onClick={() => openAuth(true)}
              >
                Login
              </button>
            </header>

            <div className="grid flex-1 items-center gap-6 py-4 lg:grid-cols-[1.15fr_.85fr] lg:gap-8 lg:py-6">
              <div className="max-w-3xl">
                <p className="sn-rise mb-4 inline-flex rounded-full border border-[#b7ff3f]/25 bg-[#b7ff3f]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b7ff3f]">
                  Player Registration Platform
                </p>
                <h1 className="sn-display sn-rise text-5xl leading-[0.88] sm:text-6xl lg:text-[6.25rem]">
                  Build Your Team
                  <br />
                  with Verified
                  <span className="sn-gradient-text"> Football Players</span>
                </h1>
                <p className="sn-rise mt-4 max-w-[640px] text-sm leading-relaxed text-white/70 sm:text-base">
                  Register players, connect them with national teams, and keep complete player profiles in one beautiful dashboard.
                </p>

                <div className="sn-rise mt-6 flex flex-wrap gap-3">
                  <button
                    className="sn-glow rounded-xl bg-[#b7ff3f] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110"
                    onClick={() => openAuth(false)}
                  >
                    Get Started
                  </button>
                  <button
                    className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur-sm transition hover:border-[#b7ff3f]/60 hover:bg-white/10"
                    onClick={() => openAuth(true)}
                  >
                    View Players
                  </button>
                </div>

                <div className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
                  {[
                    ['1000+', 'Players Registered'],
                    ['60+', 'National Team Links'],
                    ['24/7', 'Player Data Visibility'],
                  ].map(([value, label], i) => (
                    <article
                      key={label}
                      className="sn-lift sn-rise rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"
                      style={{ animationDelay: `${i * 90}ms` }}
                    >
                      <p className="sn-display text-4xl leading-none text-[#b7ff3f]">{value}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/55">{label}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="sn-float relative mx-auto hidden w-full max-w-[460px] lg:block">
                <div className="absolute -inset-6 rounded-[28px] bg-[#b7ff3f]/12 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101c15] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
                  <img src={playersImage} alt="Football players" className="h-full w-full object-cover opacity-95" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,20,14,0.76))]" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#b7ff3f]">National football system</p>
                    <p className="mt-1 sn-display text-4xl leading-none">All players in one frame</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isAuthOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#101c15] shadow-[0_50px_100px_-40px_rgba(0,0,0,1)]">
            <div className="sn-shine relative h-1.5 w-full overflow-hidden bg-[linear-gradient(100deg,#b7ff3f,#3ddc84)]" />
            <button
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white/80 transition hover:border-[#b7ff3f] hover:bg-[#b7ff3f] hover:text-[#0b1410]"
              onClick={closeAuth}
              aria-label="Close authentication card"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative min-h-[520px] overflow-hidden p-6 md:p-8">
                <div
                  className={`absolute inset-0 flex w-[200%] transition-transform duration-500 ease-in-out ${
                    isRegister ? '-translate-x-1/2' : 'translate-x-0'
                  }`}
                >
                  <form className="w-1/2 px-2 py-10" onSubmit={handleLoginSubmit} noValidate>
                    <h2 className="sn-display text-4xl text-white">Welcome Back</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Login to access your player dashboard.
                    </p>
                    <div className="mt-6 space-y-4">
                      <input
                        type="email"
                        name="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="Email address"
                        required
                        className={inputClass}
                      />
                      <input
                        type="password"
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        placeholder="Password"
                        required
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="sn-glow mt-6 w-full rounded-xl bg-[#b7ff3f] px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Signing In...' : 'Login'}
                    </button>
                    <p className="mt-5 text-sm text-white/60">
                      New player?{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegister(true)}
                        className="font-semibold text-[#b7ff3f] hover:underline"
                      >
                        Register here
                      </button>
                    </p>
                  </form>

                  <form className="w-1/2 px-2 py-10" onSubmit={handleRegisterSubmit} noValidate>
                    <h2 className="sn-display text-4xl text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Join and connect with national football teams.
                    </p>
                    <div className="mt-6 space-y-3">
                      <input
                        type="text"
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        placeholder="Full name"
                        required
                        className={inputClass}
                      />
                      <input
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="Email address"
                        required
                        className={inputClass}
                      />
                      <input
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="Password (min 8 characters)"
                        minLength={8}
                        required
                        className={inputClass}
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          name="countrycode"
                          value={registerForm.countrycode}
                          onChange={handleRegisterChange}
                          placeholder="Code"
                          required
                          className={inputClass}
                        />
                        <input
                          type="tel"
                          name="contactno"
                          value={registerForm.contactno}
                          onChange={handleRegisterChange}
                          placeholder="Contact Number"
                          required
                          className={`col-span-2 ${inputClass}`}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="sn-glow mt-6 w-full rounded-xl bg-[#b7ff3f] px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Register'}
                    </button>
                    <p className="mt-5 text-sm text-white/60">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => setIsRegister(false)}
                        className="font-semibold text-[#b7ff3f] hover:underline"
                      >
                        Login here
                      </button>
                    </p>
                  </form>
                </div>
              </div>

              <div className="relative flex min-h-[260px] flex-col justify-center overflow-hidden border-t border-white/10 p-8 md:border-l md:border-t-0">
                <img
                  src={playersImage}
                  alt="Players"
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(8,20,14,0.92)_0%,rgba(61,220,132,0.35)_100%)]" />
                <div className="relative z-10">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#b7ff3f]">
                    Football System
                  </p>
                  <h3 className="sn-display mt-3 text-4xl leading-tight text-white">
                    {isRegister ? 'Register New Player' : 'Login to Dashboard'}
                  </h3>
                  <p className="mt-3 text-sm text-white/75">
                    {isRegister
                      ? 'Create your profile and join the national team ecosystem.'
                      : 'Track profiles, teams, and player details from your dashboard.'}
                  </p>
                  {authError ? (
                    <p
                      className={`mt-4 rounded-xl px-3 py-2 text-sm ${
                        authError.toLowerCase().includes('successful')
                          ? 'border border-[#b7ff3f]/40 bg-[#b7ff3f]/15 text-[#dcffab]'
                          : 'border border-red-400/40 bg-red-500/20 text-red-100'
                      }`}
                    >
                      {authError}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default Landing
