import { useState, type FC, type FormEvent } from "react"
import { CreditCard, Lock, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { instance } from "../service/instance"
import type { UserType } from "../utils/types"
import useToast from "../hooks/useToast"

type WithdrawProps = {
  user: UserType
}

const Withdraw: FC<WithdrawProps> = ({ user }) => {
  const [amount, setAmount] = useState("")
  const [cardPassword, setCardPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const notify = useToast()
  const navigate = useNavigate()

  const apiLink =
    user.paymentSystem === "VISA"
      ? "/visa/debitingVisa"
      : "/master/debitingMaster"

  const handleWithdraw = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!amount || !cardPassword) {
      alert("Пожалуйста, заполните все поля")
      return
    }

    setIsLoading(true)

    try {
      // Simulating API call since we don't have actual instance
      await instance.post(apiLink, {
        passwordOfCard: cardPassword,
        cardNum: user.numberOfCard,
        summa: parseFloat(amount),
      })

      notify("Снятие успешно выполнено")
      navigate(-1)
      setAmount("")
      setCardPassword("")
    } catch (err) {
      console.error(err)
      notify("Произошла ошибка при снятии средств", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="<from-slate-900 flex min-h-screen items-center justify-center bg-gradient-to-br via-purple-900 to-slate-900">
      <div className="bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-50"></div>

      <div className="relative mx-4 w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
              <CreditCard className="h-10 w-10 text-white" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Снятие {user.paymentSystem === "VISA" ? "Visa" : "MasterCard"}
            </h2>
            <p className="text-sm text-white/70">
              Введите данные карты для снятия средств
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleWithdraw}>
            {/* PIN Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="password"
                placeholder="Пин карты"
                value={cardPassword}
                onChange={(e) => setCardPassword(e.target.value)}
                maxLength={4}
                className="w-full rounded-xl border border-white/20 bg-white/5 py-4 pr-4 pl-12 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                required
              />
            </div>

            {/* Amount Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="font-semibold text-white/50 underline">C</span>
              </div>
              <input
                type="number"
                placeholder="Сумма для снятия"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-4 pr-4 pl-12 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 py-4 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-red-700 hover:to-pink-700 hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Обработка...</span>
                </>
              ) : (
                <>
                  <span>Снять средства</span>
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
          </form>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              🔒 Ваши данные защищены 256-битным шифрованием
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl"></div>
      </div>
    </div>
  )
}

export default Withdraw
