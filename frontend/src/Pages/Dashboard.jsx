import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import AddTeamModal from '../Components/AddTeamModal'
import EditTeamModal from '../Components/EditTeamModal'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

function Dashboard() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const getCurrentUser = () => {
    const rawUser = localStorage.getItem('footballUser')
    if (!rawUser) return null
    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  }

  const currentUser = getCurrentUser()

  const fetchTeams = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/teams`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Unable to fetch teams')
        setTeams([])
      } else {
        setTeams(data.teams || [])
      }
    } catch (err) {
      console.error(err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('footballUser')
    navigate('/')
  }

  const handleCreated = (team) => {
    setTeams((prev) => [team, ...prev])
  }

  const handleUpdated = (updatedTeam) => {
    setTeams((prev) => prev.map((p) => (p._id === updatedTeam._id ? updatedTeam : p)))
    setSelected(updatedTeam)
  }

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this team?')
    if (!ok) return

    try {
      const res = await fetch(`${API_BASE}/teams/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        window.alert(data.message || 'Failed to delete team')
        return
      }
      setTeams((prev) => prev.filter((t) => t._id !== id))
      setSelected(null)
    } catch (err) {
      console.error(err)
      window.alert('Network error')
    }
  }

  const getFlagUrl = (flag) => {
    if (!flag) return ''
    return flag.startsWith('http') ? flag : `${API_BASE}${flag}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(1000px_500px_at_15%_0%,rgba(61,220,132,0.08),transparent),radial-gradient(900px_500px_at_100%_0%,rgba(183,255,63,0.05),transparent),#0b1410] text-white">
      <Header />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,32,26,0.96),rgba(13,22,18,0.95))] shadow-[0_40px_100px_-50px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#b7ff3f]">National Teams</p>
                <h2 className="sn-display mt-1 text-5xl leading-none sm:text-6xl">
                  Welcome {currentUser?.name || 'Manager'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                  Manage national teams, upload flags, and keep coaching staff organized in one modern dashboard.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setAddOpen(true)}
                  className="sn-glow rounded-xl bg-[#b7ff3f] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110"
                >
                  + Add Team
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          <section>
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-white/60">
                Loading teams...
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/15 p-4 text-red-100">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="mt-1 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {teams.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/60">
                    No teams yet. Add one using the button above.
                  </div>
                )}

                {teams.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    className="sn-lift group overflow-hidden rounded-3xl border border-white/10 bg-[#101c15] text-left shadow-[0_24px_70px_-35px_rgba(0,0,0,1)]"
                    onClick={() => setSelected(t)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getFlagUrl(t.flag)}
                        alt={t.teamName}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(11,20,16,0.86))]" />
                      <div className="absolute bottom-3 left-3 rounded-full border border-[#b7ff3f]/25 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#dcffab]">
                        {t.teamId}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="sn-display text-3xl leading-none text-white">{t.teamName}</h3>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-white/65">
                        <p>Coach: {t.teamCoach}</p>
                        <p>Manager: {t.teamManager}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {selected && (
          <div
            className="fixed inset-0 z-40 grid place-items-center bg-black/75 px-4 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#101c15] shadow-[0_50px_100px_-40px_rgba(0,0,0,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 bg-[linear-gradient(100deg,#b7ff3f,#3ddc84)] sn-shine" />
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-[#b7ff3f] hover:bg-[#b7ff3f] hover:text-[#0b1410]"
              >
                ✕
              </button>

              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[320px] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
                  <img
                    src={getFlagUrl(selected.flag)}
                    alt={selected.teamName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,20,16,0.12),rgba(11,20,16,0.9))]" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#b7ff3f]">Selected Team</p>
                    <h3 className="sn-display mt-1 text-5xl leading-none text-white">{selected.teamName}</h3>
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Team ID</p>
                      <p className="sn-display text-4xl text-[#b7ff3f]">{selected.teamId}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                      1 national team card
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 text-sm text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <span className="block text-[11px] uppercase tracking-[0.22em] text-white/40">Coach</span>
                      <span className="mt-1 block text-base text-white">{selected.teamCoach}</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <span className="block text-[11px] uppercase tracking-[0.22em] text-white/40">Manager</span>
                      <span className="mt-1 block text-base text-white">{selected.teamManager}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const id = selected._id
                        setSelected(null)
                        navigate(`/teams/${id}/players`)
                      }}
                      className="sn-glow rounded-xl bg-[#b7ff3f] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110"
                    >
                      View Players
                    </button>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(selected._id)}
                      className="rounded-xl border border-red-400/30 bg-red-500/15 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/25"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {addOpen && (
          <AddTeamModal isOpen={addOpen} onClose={() => setAddOpen(false)} onCreated={(team) => handleCreated(team)} />
        )}

        {editOpen && selected && (
          <EditTeamModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            team={selected}
            onUpdated={(team) => handleUpdated(team)}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
