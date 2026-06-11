import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DownloadIcon, TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import SoftBackdrop from "../components/SoftBackdrop"
import { useAuth } from "../context/AuthContext"
import api from "../configs/api"
import type { IThumbnail } from "../types"
import { aspectClasses } from "../data/data"
import downloadThumbnail from "../utils/utils"

export default function MyGenerations() {
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([])
  const [loading, setLoading] = useState(false)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      fetchThumbnails()
    } else {
      setThumbnails([])
    }
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
        {!loading && thumbnails.length === 0 && (
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
          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
            {thumbnails.map(
              ({
                _id,
                title,
                image,
                aspect_ratio,
                isGenerating,
                style,
                createdAt,
                color_scheme,
              }) => {
                const aspectClass = aspectClasses[aspect_ratio || "16:9"]

                return (
                  <div
                    key={_id}
                    onClick={() => navigate(`/generate/${_id}`)}
                    className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
                  >
                    {/* IMAGE */}
                    <div
                      className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                          {isGenerating ? "Generating..." : "No image"}
                        </div>
                      )}

                      {isGenerating && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                          Generating...
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
                        {title}
                      </h3>

                      <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                        <span className="px-2 py-0.5 rounded bg-white/8">
                          {style}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/8">
                          {color_scheme}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/8">
                          {aspect_ratio}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500">
                        {createdAt
                          ? new Date(createdAt).toDateString()
                          : "Tue Jun 07 2026"}
                      </p>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5"
                    >
                      <TrashIcon
                        onClick={() => handleDelete(_id)}
                        className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                      />

                      <DownloadIcon
                        onClick={() => downloadThumbnail(image!)}
                        className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                      />
                    </div>
                  </div>
                )
              },
            )}
          </div>
        )}
      </div>
    </>
  )
}
