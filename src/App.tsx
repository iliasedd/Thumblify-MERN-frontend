import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import HomePage from "./pages/Home"
import Generate from "./pages/Generate"
import MyGenerations from "./pages/MyGenerations"
import Login from "./pages/Login"
import YTPreview from "./pages/YTPreview"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LenisScroll from "./components/LenisScroll"
import { useAuth } from "./context/AuthContext"
import "./globals.css"

export default function App() {
  const { pathname } = useLocation()
  const { fetchUser } = useAuth()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      <Toaster />
      <LenisScroll />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generate/:id" element={<Generate />} />
        <Route path="/my-generations" element={<MyGenerations />} />
        <Route path="/preview" element={<YTPreview />} />
      </Routes>

      <Footer />
    </>
  )
}
