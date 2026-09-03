import React, { useEffect, useState } from 'react'
//import the react library so the file can use React features.
//useState: a hook that lets the component hold and update local state (e.g.,lists,booleans)
//useEffect: a hook that lets the component perform side effects (e.g.,fetching data,updating the DOM) after rendering./
//In short:this line brings in React plus the two hooks the component needs to manage state and side effects.
import { useNavigate } from 'react-router-dom'
//imports a navigation helper from the react-router-dom library, which allows the component to programmatically navigate to different routes in the application.
//In short:used to move the user to another page from code (not a link)
import Header from '../Components/Header'
import Footer from '../Components/Footer'
//imports two custom components, Header and Footer, which are likely used to display consistent header and footer sections across different pages of the application.
import AddTeamModal from '../Components/AddTeamModal'
//imports a model(popup) component used to add a new team.
//this component conatains the form and upload logic to create a team(team id,name,flag,coach,manager)
//used to open a "Add Team" dialog.
import EditTeamModal from '../Components/EditTeamModal'
//imports a model component used to edit an existing team.
//it pre-fills the team fields and submits an update to the backend(PUT /teams/:id)
//used to open a "Edit Team" dialog.

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
//reads the frontend API base URL from vite environment variables(import.meta.env.VITE_API_BASE). If not set, defaults to 'http://localhost:5000'.
//used to build full URLs like ${API_BASE}/teams when calling your backend.

function Dashboard() {
//declares the dashboard react component function, the function that returns the UI and contains it's logic/state.
  const navigate = useNavigate()
  //calls the React Router hook useNavigator and stores the returned function in navigate.
  //used to call navigate ('/path') to programmatically change pages(e.g., go to the TeamPlayers page)
  const [teams, setTeams] = useState([])
  //declares a state variable teams and it's updater function setTeams.
  //initializes teams to an empty array.
  //teams holds the current list of team objects shown in the UI.
  //setTeams(newValue) updates teams and triggers a re-render. For example
  //setTeams(data.teams) updates the teams state with the fetched team data from the backend.
  //yes:teams is the variable holding the data;setTeams is used to later change it
  const [loading, setLoading] = useState(true)
  //declares a state variable loading and it's updater function setLoading.
  //initializes loading to true, indicating that the component is in a loading state (e.g., fetching data from the backend).
  //setLoading(false) is called after data is fetched to indicate that loading is complete.
  const [error, setError] = useState('')
  //declares error state and it's updater setError.
  //initial value empty string (no error).
  //used to setError('message') when a fetch fails, which will display the error message in the UI.
  //clearing setError('') removes it.
  const [addOpen, setAddOpen] = useState(false)
  //boolean state controlling whether the "Add Team" modal is visible.
  //false= modal closed, true=modal open.
  //setAddOpen(true) opens the modal, setAddOpen(false) closes it.
  const [editOpen, setEditOpen] = useState(false)
  //boolean state controlling whether the "Edit Team" modal is visible.
  //false= modal closed, true=modal open.
  //setEditOpen(true) opens the modal, setEditOpen(false) closes it.
  const [selected, setSelected] = useState(null)
  //holds the currently selected team object (or null when none selected)
  //when the user clicks a card, code sets selected(team) so detail modal shows that team's info.
  //reading selected.teamName,selected._id, etc.inside the detail modal or to open the edit modal.

  const getCurrentUser = () => {
    //creates a function named getCurrentUser.
    //it reads the logged-in user from browser localStorage and returns it as a parsed object.
    const rawUser = localStorage.getItem('footballUser')
    //get me the value stored under the key 'footballUser' in localstorage and assign it to rawUser.
    //gets the value stored in browser localstorage under the key 'footballUser' and assigns it to rawUser.
    //rawUser is the raw text value, usually a JSON string.
    if (!rawUser) return null
    //if nothing is stored, return null., this means no user is logged in.
    try {
      return JSON.parse(rawUser)
    //tries to convert the json string into a real javascript object.
    //JSON.parse is used because localstorage stores everything as strings, so we need to parse it back into an object.
    } catch {
      return null
    }
    //if parsing fails(bad JSON) return null instead of crashing.
  }

  const currentUser = getCurrentUser()
  //calls the function and stores the result in currentUSer.
  // if login data exists and is valid, currentUser becomes the user object.

  const fetchTeams = async () => {
    //creates an asyn function named fetchTeams.
    //it will request team data from the backend.
    setLoading(true)
    //turns loading state on.
    //This tells the UI to show a loading message /spinner.
    setError('')
    //clears any previous error message.
    //starts a try block so network/API errors can be handled safely without crashing the app.
    try {
      const res = await fetch(`${API_BASE}/teams`)
      //sends a GET request to the backend endpoint /teams to fetch the list of teams.
      //res is the response object from the server.
      const data = await res.json()
      //converts the response body into a javascript object.
      if (!res.ok) {
        //checks if the HTTP response was not successful (status code not in the 200-299 range).
        setError(data.message || 'Unable to fetch teams')
        setTeams([])
        //stores the server error message in the state.
        //if server didn't send one, it uses the fallback text.
        //clears team list if request failed.
      } else {
        setTeams(data.teams || [])
        //if request succeeded, stores team data in teams.
        //if data.teams is missing, uses an empty array.
      }
    } catch (err) {
      //runs if fetch fails completely (network error, server unreachable)
      console.error(err)
      //prints the error in browser console for debugging.
      setError('Unable to connect to server')
      //shows a user-friendly error message in the UI.
    } finally {
      setLoading(false)
      //runs no matter what happens.
      //turns loading off after request ends.
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])
  //declares a React effect that runs once when the component mounts (empty dependency array).
  //it calls fetchTeams to load the team data from the backend when the Dashboard page is first displayed.
  //the empty array [] means this effect runs only once, similar to componentDidMount in class components.

  const handleLogout = () => {
    localStorage.removeItem('footballUser')
    navigate('/')
  }
  //declares a function named handlelogout.
  //this function contains the steps to perform when the user logs out.
  //localStorage.removeItem('footballUser') removes the stored user data from the browser, effectively logging the user out.
  //navigate('/') programmatically redirects the user to the landing page after logout.
  //this function is called when the user clicks the "Logout" button in the UI.

  const handleCreated = (team) => {
    setTeams((prev) => [team, ...prev])
  }
  //declares a function named handleCreated that takes a team object as an argument.
  //it updates the teams state by adding the new team to the beginning of the existing list.
  //setTeams((prev) => [team, ...prev]) uses the previous state (prev) and creates a new array with the new team at the front, followed by all previous teams.
  //this function is called after a new team is successfully created in the AddTeamModal, ensuring that the UI reflects the newly added team immediately.

  const handleUpdated = (updatedTeam) => {
    //declares a function named handleUpdated that takes one argument, updatedTeam, which is the team object that has been modified.
    //it updates the teams state by replacing the old version of the team with the updated version.
    setTeams((prev) => prev.map((p) => (p._id === updatedTeam._id ? updatedTeam : p)))
    setSelected(updatedTeam)
  }

  const handleDelete = async (id) => {
    //declares an asynchronous function named handleDelete that accepts a team id to delete.
    const ok = window.confirm('Are you sure you want to delete this team?')
    //shows a browser confirmation dialog asking the user to confirm the delete.
    //The dialog returns true if the user clicks OK, false if they click Cancel.
    if (!ok) return
    //if the user cancelled (ok is false), stop and do nothing.

    //start a try block to handle the network call and possible errors.
    try {
      const res = await fetch(`${API_BASE}/teams/${id}`, { method: 'DELETE' })
      //start a try block to handle the network call and possible errors.
      //and send an HTTP DELETE request to the backend endpoint for deleting the team with the specified id.
      const data = await res.json()
      //converts the response body into a javascript object.
      //await pauses until the server responds and stores the response object in res.
      if (!res.ok) {
        window.alert(data.message || 'Failed to delete team')
        return
      }
      //if the response is not ok (status code not in the 200-299 range), show an alert with the error message from the server or a fallback message.
      setTeams((prev) => prev.filter((t) => t._id !== id))
      //if the delete was successful, update the teams state by filtering out the deleted team.
      setSelected(null)
      //clear the selected team since it has been deleted.
    } catch (err) {
      console.error(err)
      window.alert('Network error')
      //if the fetch or response parsing threw an error (network failure, json parse error,(etc))
      //log it to the console and show a generic network error alert to the user.
    }
  }

  const getFlagUrl = (flag) => {
    if (!flag) return ''
    return flag.startsWith('http') ? flag : `${API_BASE}${flag}`
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Manage teams and flags</p>
            <h2 className="text-2xl font-bold">Welcome {currentUser?.name || 'Manager'}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setAddOpen(true)} className="rounded bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700">
              + Add Team
            </button>
            <button onClick={handleLogout} className="rounded border px-3 py-2 text-sm">Logout</button>
          </div>
        </div>

        <section className="mt-6">
          {loading && <div className="py-8 text-center text-gray-500">Loading teams...</div>}
          {error && <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>}

          {!loading && !error && (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.length === 0 && <div className="text-gray-600">No teams yet. Add one using the button above.</div>}

              {teams.map((t) => (
                <div key={t._id} className="cursor-pointer rounded-lg bg-white p-4 shadow hover:shadow-md" onClick={() => setSelected(t)}>
                  <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <img src={getFlagUrl(t.flag)} alt={t.teamName} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{t.teamName}</h3>
                      <span className="text-sm text-gray-500">{t.teamId}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Coach: {t.teamCoach}</p>
                    <p className="mt-1 text-sm text-gray-600">Manager: {t.teamManager}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selected && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
            <div className="mx-4 w-full max-w-2xl rounded bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{selected.teamName}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-600">✕</button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-center">
                  <img src={getFlagUrl(selected.flag)} alt={selected.teamName} className="h-48 w-full max-w-xs rounded object-cover" />
                </div>
                <div>
                  <p className="text-sm text-gray-700"><strong>ID:</strong> {selected.teamId}</p>
                  <p className="mt-2 text-sm text-gray-700"><strong>Coach:</strong> {selected.teamCoach}</p>
                  <p className="mt-2 text-sm text-gray-700"><strong>Manager:</strong> {selected.teamManager}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const id = selected._id
                        setSelected(null)
                        navigate(`/teams/${id}/players`)
                      }}
                      className="rounded bg-sky-600 px-4 py-2 text-white"
                    >
                      View Players
                    </button>
                    <button onClick={() => setEditOpen(true)} className="rounded border px-3 py-2">Edit</button>
                    <button onClick={() => handleDelete(selected._id)} className="rounded bg-red-600 px-3 py-2 text-white">Delete</button>
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
