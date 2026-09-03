import Landing from './Pages/Landing'
import Dashboard from './Pages/Dashboard'
import TeamPlayers from './Pages/TeamPlayers'
import { Navigate, Route, Routes } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem('footballUser')
  if (!storedUser) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:teamId/players"
        element={
          <ProtectedRoute>
            <TeamPlayers />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
