export type paymentSystem = "VISA" | "MASTERCARD"

export type UserType = {
  token: string
  clientFirstName: string
  clientLastName: string
  numberOfCard: string
  paymentSystem: paymentSystem
  balance: number
}
