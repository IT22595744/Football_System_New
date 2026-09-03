import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

function TeamPlayers() {
  const { teamId } = useParams()
  const navigate = useNavigate()

  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalMode, setModalMode] = useState(null)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [name, setName] = useState('')
  const [jerseyNo, setJerseyNo] = useState('')
  const [position, setPosition] = useState('')
  const [file, setFile] = useState(null)

  const getImageUrl = (imgPath) => {
    if (!imgPath) return ''
    return imgPath.startsWith('http') ? imgPath : `${API_BASE}${imgPath}`
  }

  const resetForm = () => {
    setName('')
    setJerseyNo('')
    setPosition('')
    setFile(null)
    setFormError('')
    setEditingPlayer(null)
  }

  const closeModal = () => {
    setModalMode(null)
    resetForm()
  }

  const openAddModal = () => {
    resetForm()
    setModalMode('add')
  }

  const openEditModal = (player) => {
    setEditingPlayer(player)
    setName(player.name || '')
    setJerseyNo(player.jersey_no ? String(player.jersey_no) : '')
    setPosition(player.position || '')
    setFile(null)
    setFormError('')
    setModalMode('edit')
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [teamRes, playersRes] = await Promise.all([
          fetch(`${API_BASE}/teams/${teamId}`),
          fetch(`${API_BASE}/players`),
        ])

        const teamData = await teamRes.json()
        const playersData = await playersRes.json()

        if (!teamRes.ok) {
          setError(teamData.message || 'Unable to fetch team details')
          setLoading(false)
          return
        }

        if (!playersRes.ok) {
          setError(playersData.message || 'Unable to fetch players')
          setLoading(false)
          return
        }

        setTeam(teamData.team)
        setPlayers(Array.isArray(playersData) ? playersData : playersData.players || [])
      } catch (err) {
        console.error(err)
        setError('Unable to connect to server')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [teamId])

  const teamPlayers = useMemo(() => {
    if (!team?.teamName) return []

    const normalizedTeamName = team.teamName.trim().toLowerCase()
    return players.filter((player) =>
      (player.team_name || '').trim().toLowerCase() === normalizedTeamName
    )
  }, [players, team])

  const submitPlayer = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!name || !jerseyNo || !position) {
      setFormError('Name, jersey number and position are required')
      return
    }

    if (modalMode === 'add' && !file) {
      setFormError('Player image is required for new players')
      return
    }

    if (!team?.teamName) {
      setFormError('Team details are missing')
      return
    }

    const fd = new FormData()
    fd.append('name', name)
    fd.append('team_name', team.teamName)
    fd.append('jersey_no', jerseyNo)
    fd.append('position', position)
    if (file) {
      fd.append('player_img', file)
    }

    try {
      setSubmitting(true)

      const isEdit = modalMode === 'edit' && editingPlayer?._id
      const endpoint = isEdit ? `${API_BASE}/players/${editingPlayer._id}` : `${API_BASE}/players`
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        body: fd,
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.message || 'Failed to save player')
        return
      }

      if (isEdit) {
        setPlayers((prev) => prev.map((p) => (p._id === data.player._id ? data.player : p)))
      } else {
        setPlayers((prev) => [data.player, ...prev])
      }

      closeModal()
    } catch (err) {
      console.error(err)
      setFormError('Network error while saving player')
    } finally {
      setSubmitting(false)
    }
  }

  const deletePlayer = async (playerId) => {
    const confirmed = window.confirm('Delete this player?')
    if (!confirmed) return

    try {
      const res = await fetch(`${API_BASE}/players/${playerId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        window.alert(data.message || 'Failed to delete player')
        return
      }

      setPlayers((prev) => prev.filter((p) => p._id !== playerId))
    } catch (err) {
      console.error(err)
      window.alert('Network error while deleting player')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(1000px_500px_at_15%_0%,rgba(61,220,132,0.08),transparent),radial-gradient(900px_500px_at_100%_0%,rgba(183,255,63,0.05),transparent),#0b1410] text-white">
      <Header />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,32,26,0.96),rgba(13,22,18,0.95))] shadow-[0_40px_100px_-50px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
              <div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/75 transition hover:border-[#b7ff3f] hover:text-white"
                >
                  ← Back to Dashboard
                </button>
                <p className="mt-4 text-[11px] uppercase tracking-[0.32em] text-[#b7ff3f]">Team players</p>
                <h2 className="sn-display mt-1 text-5xl leading-none sm:text-6xl">
                  {team ? `${team.teamName} Players` : 'Team Players'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                  Manage player list, jersey numbers, positions, and profile images for the selected national team.
                </p>
              </div>

              <button
                onClick={openAddModal}
                disabled={!team}
                className="sn-glow rounded-xl bg-[#b7ff3f] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                + Add Player
              </button>
            </div>
          </section>

          <section>
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-white/60">
                Loading players...
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/15 p-4 text-red-100">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="mt-1 rounded-3xl border border-white/10 bg-[#101c15] p-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,1)] sm:p-6">
                {teamPlayers.length === 0 ? (
                  <p className="py-10 text-center text-white/60">No players found for this team. Add your first player.</p>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {teamPlayers.map((player) => (
                      <article
                        key={player._id}
                        className="sn-lift overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={getImageUrl(player.player_img)}
                            alt={player.name}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(11,20,16,0.84))]" />
                          <div className="absolute bottom-3 left-3 rounded-full border border-[#b7ff3f]/25 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#dcffab]">
                            #{player.jersey_no}
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="sn-display text-4xl leading-none text-white">{player.name}</h3>
                          <div className="mt-4 space-y-2 text-sm text-white/65">
                            <p>Jersey No: {player.jersey_no}</p>
                            <p>Position: {player.position}</p>
                          </div>

                          <div className="mt-5 flex gap-2">
                            <button
                              onClick={() => openEditModal(player)}
                              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePlayer(player._id)}
                              className="rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/25"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {modalMode && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#101c15] shadow-[0_40px_90px_-35px_rgba(0,0,0,1)]">
            <div className="h-1.5 bg-[linear-gradient(100deg,#b7ff3f,#3ddc84)] sn-shine" />
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-[#b7ff3f] hover:bg-[#b7ff3f] hover:text-[#0b1410]"
            >
              ✕
            </button>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-between gap-6 border-b border-white/10 bg-[linear-gradient(160deg,rgba(183,255,63,0.12),rgba(11,20,16,0.9))] p-6 lg:border-b-0 lg:border-r lg:border-white/10 lg:p-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#b7ff3f]">
                    {modalMode === 'add' ? 'Create player' : 'Update player'}
                  </p>
                  <h3 className="sn-display mt-2 text-4xl leading-none text-white">
                    {modalMode === 'add' ? 'Add New Player' : 'Edit Player'}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {modalMode === 'add'
                      ? 'Register a player under this team with jersey number, position, and portrait.'
                      : 'Update the player profile details and optionally replace the image.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
                  <p className="uppercase tracking-[0.22em] text-white/40">Team</p>
                  <p className="mt-2 sn-display text-3xl text-[#b7ff3f]">{team?.teamName || '—'}</p>
                </div>
              </div>

              <form className="p-6 lg:p-8" onSubmit={submitPlayer}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Player Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                      placeholder="Player name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Team Name</label>
                    <input
                      value={team?.teamName || ''}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Jersey Number</label>
                    <input
                      type="number"
                      min="1"
                      value={jerseyNo}
                      onChange={(e) => setJerseyNo(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">Position</label>
                    <input
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#b7ff3f] focus:bg-white/[0.07]"
                      placeholder="Forward"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-white/55">
                    Player Image {modalMode === 'add' ? '' : '(optional)'}
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-4 text-sm text-white/70 transition hover:border-[#b7ff3f]/60 hover:bg-white/[0.07]">
                    <span>{file ? file.name : 'Choose a player image from your device'}</span>
                    <span className="rounded-full bg-[#b7ff3f]/15 px-3 py-1 text-xs font-semibold text-[#b7ff3f]">Browse</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                  </label>
                </div>

                {formError && (
                  <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                    {formError}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="sn-glow rounded-xl bg-[#b7ff3f] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1410] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (modalMode === 'add' ? 'Creating...' : 'Updating...') : modalMode === 'add' ? 'Create Player' : 'Update Player'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamPlayers
