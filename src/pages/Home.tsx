import { useState } from "react"
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  LogOut,
  User,
  Wallet,
  ArrowRight,
  Settings,
  Bell,
  Shield,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { UserType } from "../utils/types"

type HomeProps = {
  user: UserType
  onLogout: () => void
}

const Home = ({ user, onLogout }: HomeProps) => {
  const [recentTransactions] = useState([
    { type: "deposit", amount: 5000, date: "2 часа назад" },
    { type: "withdraw", amount: 2500, date: "Вчера" },
    { type: "deposit", amount: 10000, date: "3 дня назад" },
  ])
  const navigate = useNavigate()

  const balance = Number(localStorage.getItem("balance"))

  const ActionButton = ({
    onClick,
    icon: Icon,
    title,
    subtitle,
    gradient,
    hoverGradient,
  }: {
    onClick: () => void
    icon: React.ElementType
    title: string
    subtitle: string
    gradient: string
    hoverGradient: string
  }) => (
    <div
      onClick={onClick}
      className={`${gradient} ${hoverGradient} group transform cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Icon className="h-6 w-6 text-white" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/60 transition-all group-hover:translate-x-1 group-hover:text-white" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background pattern */}
      <div className="bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M30 30c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-50"></div>

      <div className="relative mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="mb-1 text-2xl font-bold text-white">
                Добро пожаловать!
              </h1>
              <p className="text-white/70">
                {user.clientFirstName} {user.clientLastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
              <Bell className="h-5 w-5 text-white/80" />
            </div>
            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20">
              <Settings className="h-5 w-5 text-white/80" />
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mb-8 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6 text-white/80" />
              <span className="text-white/80">Текущий баланс</span>
            </div>
            <Shield className="h-5 w-5 text-green-400" />
          </div>

          <div className="mb-4">
            <span className="text-4xl font-bold text-white">
              {balance} <span className="underline">C</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span>+2.5% за месяц</span>
            </div>
            <div className="text-white/50">
              Последнее обновление: только что
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Actions */}
          <div className="space-y-4 lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Основные действия
            </h2>

            <ActionButton
              onClick={() => navigate("/deposit")}
              icon={TrendingUp}
              title={`Пополнить ${user.paymentSystem === "VISA" ? "Visa" : "MasterCard"}`}
              subtitle="Быстрое пополнение счета"
              gradient="bg-gradient-to-r from-blue-600 to-cyan-600"
              hoverGradient="hover:from-blue-700 hover:to-cyan-700"
            />

            <ActionButton
              onClick={() => navigate("/withdraw")}
              icon={TrendingDown}
              title={`Снять с ${user.paymentSystem === "VISA" ? "Visa" : "MasterCard"}`}
              subtitle="Вывод средств с карты"
              gradient="bg-gradient-to-r from-red-600 to-pink-600"
              hoverGradient="hover:from-red-700 hover:to-pink-700"
            />

            <ActionButton
              onClick={() => navigate("/transfer")}
              icon={ArrowRight}
              title={`Перевод денег`}
              subtitle="Перевод на другой банк"
              gradient="bg-gradient-to-r from-green-600 to-cyan-600"
              hoverGradient="hover:from-green-700 hover:to-cyan-700"
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                <CreditCard className="mb-2 h-6 w-6 text-white/80" />
                <h4 className="font-medium text-white">История операций</h4>
                <p className="text-sm text-white/60">Просмотр транзакций</p>
              </div>

              <div className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10">
                <Settings className="mb-2 h-6 w-6 text-white/80" />
                <h4 className="font-medium text-white">Настройки</h4>
                <p className="text-sm text-white/60">Управление аккаунтом</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Последние операции
            </h3>

            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    {transaction.type === "deposit" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {transaction.type === "deposit" ? "+" : "-"}
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-white/60">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={onLogout}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span>Завершить сессию</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-2xl"></div>
        <div className="absolute bottom-20 left-10 h-24 w-24 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-xl"></div>
      </div>
    </div>
  )
}

export default Home
