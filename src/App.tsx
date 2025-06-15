import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Deposit from "./pages/Deposit"
import Withdraw from "./pages/Withdraw"
import Home from "./pages/Home"
import Transfer from "./pages/Transfer"
import type { UserType } from "./utils/types"

// Компонент для защищенных маршрутов
const ProtectedRoute = ({
  children,
  isAuthenticated,
  isLoading,
}: {
  children: React.ReactNode
  isAuthenticated: boolean
  isLoading: boolean
}) => {
  if (isLoading) {
    return <div>Загрузка...</div> // или ваш компонент загрузки
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/signin" replace />
  )
}

// Компонент для публичных маршрутов (только для неавторизованных)
const PublicRoute = ({
  children,
  isAuthenticated,
  isLoading,
}: {
  children: React.ReactNode
  isAuthenticated: boolean
  isLoading: boolean
}) => {
  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Симулируем проверку токена/сессии
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)

          // Здесь можно добавить проверку валидности токена
          // const isTokenValid = await validateToken(userData.token)
          // if (isTokenValid) {
          //   setUser(userData)
          // } else {
          //   localStorage.removeItem("user")
          // }

          setUser(userData)
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleLogin = (userData: UserType) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("balance", String(userData.balance))
      setUser(userData)
    } catch (error) {
      console.error("Ошибка при сохранении данных пользователя:", error)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Ошибка при выходе:", error)
    }
  }

  const isAuthenticated = user !== null

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route
        path="/auth/signin"
        element={
          <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <SignIn onLogin={handleLogin} />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <SignUp />
          </PublicRoute>
        }
      />

      {/* Защищенные маршруты */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          >
            <Home user={user!} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deposit"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          >
            <Deposit user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          >
            <Withdraw user={user!} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          >
            <Transfer user={user!} />
          </ProtectedRoute>
        }
      />

      {/* Перенаправление на главную или авторизацию */}
      <Route
        path="*"
        element={
          isLoading ? (
            <div>Загрузка...</div>
          ) : (
            <Navigate to={isAuthenticated ? "/" : "/auth/signin"} replace />
          )
        }
      />
    </Routes>
  )
}

export default App
