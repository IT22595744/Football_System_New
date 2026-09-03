import React, { useEffect, useState } from 'react'

export default function EditTeamModal({ isOpen, onClose, team, onUpdated }) {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const [teamId, setTeamId] = useState('')
  const [teamName, setTeamName] = useState('')
  const [teamCoach, setTeamCoach] = useState('')
  const [teamManager, setTeamManager] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (team) {
      setTeamId(team.teamId || '')
      setTeamName(team.teamName || '')
      setTeamCoach(team.teamCoach || '')
      setTeamManager(team.teamManager || '')
      setFile(null)
      setError('')
    }
  }, [team])

  if (!isOpen) return null

  const close = () => {
    setError('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!teamId || !teamName || !teamCoach || !teamManager) {
      setError('Please fill required fields')
      return
    }

    const fd = new FormData()
    fd.append('teamId', teamId)
    fd.append('teamName', teamName)
    fd.append('teamCoach', teamCoach)
    fd.append('teamManager', teamManager)
    if (file) fd.append('flag', file)

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/teams/${team._id}`, {
        method: 'PUT',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to update team')
        return
      }
      onUpdated(data.team)
      close()
    } catch (err) {
      console.error(err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#101c15] shadow-[0_40px_90px_-35px_rgba(0,0,0,1)]">
        <div className="h-1.5 bg-[linear-gradient(100deg,#b7ff3f,#3ddc84)] sn-shine" />
        <button
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-[#b7ff3f] hover:bg-[#b7ff3f] hover:text-[#0b1410]"
          onClick={close}
        >
          ✕
        </button>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 bg-[linear-gradient(160deg,rgba(183,255,63,0.12),rgba(11,20,16,0.9))] p-6 lg:border-b-0 lg:border-r lg:border-white/10 lg:p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#b7ff3f]">Update team</p>
              <h3 className="sn-display mt-2 text-4xl leading-none text-white">Edit Team</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Refine the national team information, coach, manager, or replace the flag image.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
              <p className="uppercase tracking-[0.22em] text-white/40">Current Team ID</p>
              <p className="mt-2 sn-display text-3xl text-[#b7ff3f]">{team?.teamId || '—'}</p>
            </div>
          </div>

          <form className="p-6 lg:p-8" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Team ID</label>
                <input
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                  placeholder="e.g. ARG"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Team Name</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                  placeholder="Argentina"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Coach</label>
                <input
                  value={teamCoach}
                  onChange={(e) => setTeamCoach(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                  placeholder="Coach name"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Manager</label>
                <input
                  value={teamManager}
                  onChange={(e) => setTeamManager(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                  placeholder="Manager name"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Flag Image (optional)</label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-4 text-sm text-white/70 transition hover:border-[#b7ff3f]/60 hover:bg-white/[0.07]">
                <span>{file ? file.name : 'Choose a replacement flag image or keep existing'}</span>
                <span className="rounded-full bg-[#b7ff3f]/15 px-3 py-1 text-xs font-semibold text-[#b7ff3f]">Browse</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10"
                onClick={close}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="sn-glow rounded-xl bg-[#b7ff3f] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
