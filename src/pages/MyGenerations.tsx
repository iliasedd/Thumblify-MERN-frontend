import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import SoftBackdrop from "../components/SoftBackdrop"
import { useAuth } from "../context/AuthContext"
import api from "../configs/api"
import type { IThumbnail } from "../types"
import ThumbnailCard from "../components/ThumbnailCard"

export default function MyGenerations() {
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([])
  const [loading, setLoading] = useState(false)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn) fetchThumbnails()
  }, [isLoggedIn])

  async function fetchThumbnails() {
    setLoading(true)

    try {
      const { data } = await api.get("/api/thumbnails")
      setThumbnails(data.thumbnails || [])
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this thumbnail?",
      )
      if (!confirm) return

      const { data } = await api.delete(`/api/thumbnails/${id}`)
      setThumbnails(thumbnails.filter(({ _id }) => _id !== id))
      toast.success(data.message)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  return (
    <>
      <SoftBackdrop />

      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage all your AI-generated thumbnails
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && thumbnails.length == 0 && (
          <div className="text-center py-24">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails yet
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Generate your first thumbnail to see it here
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && thumbnails.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {thumbnails.map((thumbnail) => (
              <ThumbnailCard thumbnail={thumbnail} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
