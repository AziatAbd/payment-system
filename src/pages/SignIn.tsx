import { useState } from "react"
import {
  CreditCard,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  UserPlus,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { instance } from "../service/instance"
import type { UserType } from "../utils/types"
import useToast from "../hooks/useToast"

type FormData = {
  cardNumber: string
  password: string
}

type SignInProps = {
  onLogin: (userData: UserType) => void
}

const mockLogin = async ({ cardNumber, password }: FormData) => {
  const { data } = await instance.post<UserType>("auth/signIn", {
    numberOfCard: cardNumber,
    passwordOfCard: password,
  })

  return data
}

export default function SignIn({ onLogin }: SignInProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const notify = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      cardNumber: "",
      password: "",
    },
  })

  const navigate = useNavigate()

  // Mock functions since we don't have router and instance
  const mockNavigate = (path: string) => {
    navigate(path)
  }

  const onSubmit = async (values: FormData) => {
    setIsLoading(true)
    try {
      const userData = await mockLogin(values)
      onLogin(userData)
      mockNavigate("/")
    } catch (err) {
      console.error(err)
      notify("Ошибка входа. Проверьте данные.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpClick = () => {
    mockNavigate("/auth/signup")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="animation-delay-4000 absolute top-40 left-40 h-80 w-80 animate-pulse rounded-full bg-indigo-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="relative mx-4 w-full max-w-md">
        {/* Main signin card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <CreditCard className="h-10 w-10 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse text-white/80" />
            </div>
            <h1 className="mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-3xl font-bold text-transparent">
              Добро пожаловать
            </h1>
            <p className="text-sm text-white/70">
              Войдите в свой аккаунт для продолжения
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Card Number Input */}
            <div className="group relative">
              <label className="mb-2 block text-sm font-medium text-white/90">
                Номер карты
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <CreditCard className="h-5 w-5 text-purple-300/70 transition-colors group-focus-within:text-purple-300" />
                </div>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  minLength={16}
                  {...register("cardNumber")}
                  className={`w-full rounded-xl border bg-white/5 py-4 pr-16 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:ring-2 focus:outline-none ${
                    errors.cardNumber
                      ? "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50"
                      : "border-white/20 focus:border-purple-400/50 focus:ring-purple-400/50"
                  }`}
                  required
                />
              </div>
              {errors.cardNumber && (
                <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                  <div className="h-1 w-1 rounded-full bg-red-400"></div>
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            {/* PIN Input */}
            <div className="group relative">
              <label className="mb-2 block text-sm font-medium text-white/90">
                PIN код
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-purple-300/70 transition-colors group-focus-within:text-purple-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••"
                  {...register("password")}
                  maxLength={4}
                  minLength={4}
                  className={`w-full rounded-xl border bg-white/5 py-4 pr-12 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:ring-2 focus:outline-none ${
                    errors.password
                      ? "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50"
                      : "border-white/20 focus:border-purple-400/50 focus:ring-purple-400/50"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50 transition-colors hover:text-white/80"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                  <div className="h-1 w-1 rounded-full bg-red-400"></div>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className={`group mt-8 flex w-full transform cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl ${
                isLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Вход в систему...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <span>Войти в аккаунт</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <button
              onClick={handleSignUpClick}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/20 py-4 font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white"
            >
              <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Создать новый аккаунт</span>
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-white/50">
              <Shield className="h-3 w-3" />
              <span>Защищено банковским уровнем безопасности</span>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-4 -right-4 h-24 w-24 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"></div>
        <div className="animation-delay-2000 absolute -bottom-4 -left-4 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl"></div>

        {/* Sparkle effects */}
        <div className="absolute top-1/4 -left-8 h-2 w-2 animate-ping rounded-full bg-purple-400/80"></div>
        <div className="absolute -right-6 bottom-1/3 h-1 w-1 animate-pulse rounded-full bg-pink-400/80"></div>
        <div className="animation-delay-1000 absolute top-2/3 -left-4 h-1.5 w-1.5 animate-ping rounded-full bg-indigo-400/80"></div>
      </div>
    </div>
  )
}
