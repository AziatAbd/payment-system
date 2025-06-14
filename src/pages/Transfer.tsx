import {
  ArrowRight,
  Banknote,
  CheckCircle,
  CreditCard,
  Lock,
} from "lucide-react"
import { useState, type ChangeEvent, type FC } from "react"
import { useNavigate } from "react-router-dom"
import type { UserType } from "../utils/types"
import { instance } from "../service/instance"
import useToast from "../hooks/useToast"

type TransferProps = {
  user: UserType
}

const options = [
  {
    value: "VISA",
    label: "Visa",
  },
  {
    value: "MASTERCARD",
    label: "MasterCard",
  },
]

const Transfer: FC<TransferProps> = ({ user }) => {
  const [amount, setAmount] = useState("")
  const [cardPassword, setCardPassword] = useState("")
  const [otherCardNumber, setOtherCardNumber] = useState("")
  const [payment, setPayment] = useState("VISA")
  const [isLoading, setIsLoading] = useState(false)

  const notify = useToast()
  const navigate = useNavigate()

  const apiLink =
    user.paymentSystem === "VISA"
      ? "/visa/transferVisa"
      : "/master/transferMaster"

  const handleOtherCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherCardNumber(e.target.value)
  }

  const handlePaymentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPayment(e.target.value)
  }

  const handleDeposit = async () => {
    if (!amount || !otherCardNumber || !cardPassword) {
      alert("Пожалуйста, заполните все поля")
      return
    }
    setIsLoading(true)
    const formData = {
      cardNum: user.numberOfCard,
      passwordOfCard: cardPassword,
      summa: +amount,
      otherCardNum: otherCardNumber,
      payment,
    }
    try {
      await instance.post(apiLink, formData)

      const balance = Number(localStorage.getItem("balance"))
      if (Number(amount) > balance) {
        notify("Недостаточно средств!", "error")
      } else {
        localStorage.setItem("balance", String(balance - +amount))
        notify("Перевод выполнен успешно")
      }
      setAmount("")
      setOtherCardNumber("")
      setCardPassword("")
    } catch (err) {
      console.error(err)
      notify("Произошла ошибка при пополнении счета", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (value: string) => {
    if (!value) return ""
    const num = parseFloat(value)
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "SOM",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-500 via-emerald-900 to-lime-900 py-6">
      <div className="bg-[url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-30"></div>

      <div className="relative mx-4 w-full max-w-md">
        {/* Main card with glassmorphism */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
          {/* Header section */}
          <div className="mb-8 text-center">
            <div className="relative mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
              <ArrowRight className="h-10 w-10 text-white/80" />
            </div>
            <h2 className="mb-2 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-3xl font-bold text-transparent">
              Перевод
            </h2>
            <p className="text-sm text-white/70">
              Быстро и безопасно пополните свой счет
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Banknote className="h-5 w-5 text-green-300/70 group-focus-within:text-blue-300" />
              </div>

              <select
                value={payment}
                onChange={handlePaymentChange}
                className="w-full rounded-xl border border-white/40 bg-white/5 py-4 pr-16 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:ring-2 focus:outline-none"
              >
                {options.map((option) => (
                  <option
                    key={option.label}
                    value={option.value}
                    className="bg-black"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Other card */}
            <div className="group relative">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Номер другой карты
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <CreditCard className="h-5 w-5 text-green-300/70 group-focus-within:text-blue-300" />
                </div>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={otherCardNumber}
                  onChange={handleOtherCardNumberChange}
                  maxLength={16}
                  className="w-full rounded-xl border border-white/20 bg-white/5 py-4 pr-4 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/50 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div className="group relative">
              <label className="mb-2 block text-sm font-medium text-white/80">
                PIN код вашей карты
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-green-300/70 group-focus-within:text-blue-300" />
                </div>
                <input
                  type="password"
                  placeholder="••••"
                  value={cardPassword}
                  onChange={(e) => setCardPassword(e.target.value)}
                  maxLength={4}
                  className="w-full rounded-xl border border-white/20 bg-white/5 py-4 pr-4 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/50 focus:outline-none"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  {cardPassword.length === 4 && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="group relative">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Сумма пополнения
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="font-semibold text-green-300/70 underline">
                    C
                  </span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="w-full rounded-xl border border-white/20 bg-white/5 py-4 pr-4 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/50 focus:outline-none"
                  required
                />
              </div>
              {amount && (
                <div className="mt-2 text-right">
                  <span className="text-sm font-medium text-blue-300/80">
                    {formatAmount(amount)}
                  </span>
                </div>
              )}
            </div>

            {/* Quick amount buttons */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 5000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/80 transition-all duration-200 hover:border-blue-400/30 hover:bg-white/10"
                >
                  {quickAmount}
                  <span className="underline">C</span>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleDeposit}
              className={`group mt-8 flex w-full transform cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-green-700 hover:to-emerald-700 hover:shadow-xl ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Обработка платежа...</span>
                </>
              ) : (
                <>
                  <span>Перевести деньги</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              className="group w-full cursor-pointer gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-center text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              Назад
            </button>
          </div>

          {/* Security info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-white/50">
              <Lock className="h-3 w-3" />
              <span>Защищено SSL шифрованием</span>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-6 -right-6 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl"></div>
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl"></div>

        {/* Additional floating elements */}
        <div className="absolute top-1/4 -left-8 h-2 w-2 animate-ping rounded-full bg-blue-400/60"></div>
        <div className="absolute -right-8 bottom-1/4 h-3 w-3 animate-pulse rounded-full bg-cyan-400/60"></div>
      </div>
    </div>
  )
}

export default Transfer
