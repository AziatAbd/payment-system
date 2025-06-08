import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Deposit from "./pages/Deposit"
import Withdraw from "./pages/Withdraw"
import Home from "./pages/Home"
import type { UserType } from "./utils/types"
import Transfer from "./pages/Transfer"

function App() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData: UserType) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <Routes>
      <Route path="/auth/signin" element={<SignIn onLogin={handleLogin} />} />
      <Route path="/auth/signup" element={<SignUp />} />
      {user !== null ? (
        <>
          <Route
            path="/"
            element={<Home user={user} onLogout={handleLogout} />}
          />
          <Route path="/deposit" element={<Deposit user={user} />} />
          <Route path="/withdraw" element={<Withdraw user={user} />} />
          <Route path="/transfer" element={<Transfer user={user} />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      )}
    </Routes>
  )
}

export default App
