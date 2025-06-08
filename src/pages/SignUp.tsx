import { useState } from "react"
import { instance } from "../service/instance"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  User,
  Phone,
  CreditCard,
  Eye,
  DollarSign,
  Banknote,
} from "lucide-react"

// Заглушки для демонстрации (в реальном проекте замените на настоящие импорты)

type SignUpFormFields = {
  firstName: string
  lastName: string
  phoneNumber: string
  numberOfCard: string
  password: string
  paymentSystem: string
  balance: number
}

const inputs = [
  {
    type: "text",
    placeholder: "Имя",
    name: "firstName",
    icon: <User />,
  },
  {
    type: "text",
    placeholder: "Фамилия",
    name: "lastName",
    icon: <User />,
  },
  {
    type: "tel",
    placeholder: "Номер телефона",
    name: "phoneNumber",
    icon: <Phone />,
  },
  {
    type: "text",
    placeholder: "Номер карты",
    name: "numberOfCard",
    icon: <CreditCard />,
  },
  {
    type: "password",
    placeholder: "Пароль карты",
    name: "password",
    icon: <Eye />,
  },
  {
    type: "number",
    placeholder: "Баланс",
    name: "balance",
    icon: <DollarSign />,
  },
  {
    type: "select",
    placeholder: "Платежная система",
    name: "paymentSystem",
    icon: <Banknote />,
    options: [
      {
        value: "VISA",
        label: "Visa",
      },
      {
        value: "MASTERCARD",
        label: "MasterCard",
      },
    ],
  },
]

export default function SignUp() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormFields>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      numberOfCard: "",
      password: "",
      paymentSystem: "VISA",
      balance: 0,
    },
  })

  const getValidationRules = (inputName: string) => {
    const baseRules = {
      required: "Это поле обязательно для заполнения",
    }

    if (inputName === "phoneNumber") {
      return {
        ...baseRules,
        pattern: {
          value: /^\+996\d{9}$/,
          message:
            "Номер телефона должен начинаться с +996 и содержать 13 цифр (например: +996700123456)",
        },
      }
    }

    return baseRules
  }
  const onSubmit = async (data: SignUpFormFields) => {
    setIsLoading(true)
    const formData = {
      clientFirstName: data.firstName,
      clientLastName: data.lastName,
      phoneNumber: data.phoneNumber,
      numberOfCard: data.numberOfCard,
      passwordOfCard: data.password,
      payment: data.paymentSystem,
      balance: +data.balance,
    }

    try {
      await instance.post("auth/signUp", formData)
      alert("Успешная регистрация")
      navigate("/auth/signin")
    } catch (err) {
      console.error("Ошибка регистрации:", err)
      alert("Ошибка регистрации")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-4">
      <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

        <div className="relative z-10">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <span className="text-2xl text-white">🚀</span>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-white">Регистрация</h2>
            <p className="text-sm text-white">
              Создайте свой аккаунт для начала работы
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {inputs.map((input) => (
              <div key={input.name} className="group">
                <div className="relative">
                  <div className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-lg text-purple-300/70 transition-colors group-focus-within:text-purple-300">
                    {input.icon}
                  </div>

                  {input.type === "select" ? (
                    <select
                      className="w-full rounded-xl border border-white/40 bg-white/5 py-4 pr-16 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:ring-2 focus:outline-none"
                      {...register(
                        input.name as keyof SignUpFormFields,
                        getValidationRules(input.name),
                      )}
                    >
                      {input.options?.map((option) => (
                        <option
                          key={option.label}
                          value={option.value}
                          className="bg-black"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      maxLength={
                        input.type === "password"
                          ? 4
                          : input.name === "numberOfCard"
                            ? 16
                            : undefined
                      }
                      className={`w-full rounded-xl border bg-white/5 py-4 pr-16 pl-12 text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 focus:ring-2 focus:outline-none ${
                        errors[input.name as keyof SignUpFormFields]
                          ? "border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50"
                          : "border-white/20 focus:border-purple-400/50 focus:ring-purple-400/50"
                      }`}
                      {...register(
                        input.name as keyof SignUpFormFields,
                        getValidationRules(input.name),
                      )}
                    />
                  )}
                </div>

                {errors[input.name as keyof SignUpFormFields] && (
                  <p className="mt-1 ml-2 text-xs text-red-500">
                    {errors[input.name as keyof SignUpFormFields]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full transform items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>Регистрация...</span>
                </>
              ) : (
                <>
                  <span>Зарегистрироваться</span>
                  <span className="text-lg">✨</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/auth/signIn")}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/20 py-4 font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white"
            >
              Войти в аккаунт
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
