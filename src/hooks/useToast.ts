import { toast, type ToastOptions } from "react-toastify"

type Type = "success" | "error" | "warning"

const useToast = () => {
  const notify = (title: string, type: Type = "success") =>
    toast<ToastOptions>(title, {
      type,
    })

  return notify
}

export default useToast
