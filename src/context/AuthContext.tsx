import React, { createContext, useContext, useState } from "react"
import toast from "react-hot-toast"
import api from "../configs/api"
import type { IUser, AuthContextType } from "../types"

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
  fetchUser: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(() => init().user)
  const [isLoggedIn, setIsLoggedIn] = useState(() => init().isLoggedIn)

  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      })

      if (data.user) {
        setUser(data.user as IUser)
        setIsLoggedIn(true)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      toast.success(data.message)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error?.message)
    }
  }

  const login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password })

      if (data.user) {
        setUser(data.user as IUser)
        setIsLoggedIn(true)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      toast.success(data.message)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error?.message)
    }
  }

  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout")

      setUser(null)
      setIsLoggedIn(false)
      localStorage.removeItem("user")

      toast.success(data.message)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error?.message)
    }
  }

  async function fetchUser() {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const user = JSON.parse(storedUser)

      setUser(user as IUser)
      setIsLoggedIn(true)
      return
    }

    try {
      const { data } = await api.get("/api/auth/verify")

      if (data.user) {
        setUser(data.user as IUser)
        setIsLoggedIn(true)
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    signUp,
    login,
    logout,
    fetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

function init() {
  const storedUser = localStorage.getItem("user")

  return storedUser
    ? { user: JSON.parse(storedUser), isLoggedIn: true }
    : { user: null, isLoggedIn: false }
}
