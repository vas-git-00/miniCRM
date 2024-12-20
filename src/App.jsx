import React, { useEffect } from "react"
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom"

import Login from "./pages/Login"
import MainApp from "./MainApp"
import authStore from "./store/authStore"

const App = () => {
  const { isAuthenticated } = authStore()

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login", { replace: true })
    }
  }, [isAuthenticated, location.pathname, navigate])

  return (
    <Routes>
      <Route
        path="/login/*"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? <MainApp /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  )
}

export default App
