import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LockIcon, MailIcon, UserIcon } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import SoftBackdrop from "../components/SoftBackdrop"

export default function Login() {
  const [state, setState] = useState("login")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  })

  const { user, login, signUp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate("/")
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    let isValid = true
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const nextErrors = {
      username: "",
      email: "",
      password: "",
    }

    if (state !== "login" && formData.username.trim().length < 3) {
      nextErrors.username = "username should be at least 3 characters"
      isValid = false
    }

    if (!formData.email.trim()) {
      nextErrors.email = "email is required"
      isValid = false
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = "please enter a valid email address"
      isValid = false
    }

    if (formData.password.trim().length < 6) {
      nextErrors.password = "password should be at least 6 characters"
      isValid = false
    }

    setErrors(nextErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) return

    if (state === "login") {
      login(formData)
    } else {
      signUp({ ...formData, name: formData.username })
    }
  }

  return (
    <>
      <SoftBackdrop />

      <div className="min-h-screen flex items-center justify-center">
        <form
          className="w-full sm:w-87.5 text-center bg-white/10 border border-white/15 rounded-2xl px-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <h1 className="text-white text-2xl mt-10 font-medium">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Please sign in to continue
          </p>

          {state !== "login" && (
            <>
              <div
                className={`flex items-center mt-6 w-full bg-white/5 ring-2 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ${errors.username ? "ring-red-400/90" : "ring-white/10"}`}
              >
                <UserIcon size={16} className="text-white/60" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {errors?.username && (
                <p className="mt-1 text-xs font-medium text-red-400/90">
                  {errors.username}
                </p>
              )}
            </>
          )}

          <div
            className={`flex items-center w-full mt-4 bg-white/5 ring-2 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ${errors.email ? "ring-red-400/90" : "ring-white/10"}`}
          >
            <MailIcon size={14} className="text-white/75" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {errors?.email && (
            <p className="mt-1 text-xs font-medium text-red-400/90">
              {errors.email}
            </p>
          )}

          <div
            className={`flex items-center mt-4 w-full bg-white/5 ring-2 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ${errors.password ? "ring-red-400/90" : "ring-white/10"}`}
          >
            <LockIcon size={14} className="text-white/75" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {errors?.password && (
            <p className="mt-1 text-xs font-medium text-red-400/90">
              {errors.password}
            </p>
          )}

          <div className="mt-3 text-left">
            <button className="text-sm text-pink-400 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 w-full h-11 rounded-full text-white bg-pink-600 hover:bg-pink-500 transition "
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>

          <p className="text-gray-400 text-sm mt-3 mb-11">
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              className="text-pink-400 hover:underline ml-1 cursor-pointer"
              onClick={() => {
                setState((prev) => (prev === "login" ? "register" : "login"))
                setErrors({ username: "", email: "", password: "" })
              }}
            >
              click here
            </span>
          </p>
        </form>
      </div>
    </>
  )
}
