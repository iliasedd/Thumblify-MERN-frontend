import { useNavigate } from "react-router-dom"
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react"
import { aspectClasses } from "../data/data"
import downloadThumbnail from "../utils/utils"
import type { IThumbnail } from "../types"

export default function ThumbnailCard({
  thumbnail,
  onDelete,
}: {
  thumbnail: IThumbnail
  onDelete: (id: string) => Promise<void>
}) {
  const navigate = useNavigate()

  const {
    _id,
    title,
    image,
    aspect_ratio,
    isGenerating,
    style,
    createdAt,
    color_scheme,
  } = thumbnail
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
            className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
            {isGenerating ? "Generating..." : "No image"}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-white/8">{style}</span>
          <span className="px-2 py-0.5 rounded bg-white/8">{color_scheme}</span>
          <span className="px-2 py-0.5 rounded bg-white/8">{aspect_ratio}</span>
        </div>

        <p className="text-xs text-zinc-500">
          {createdAt ? new Date(createdAt).toDateString() : "Tue Jun 07 2026"}
        </p>
      </div>

      <div
        className="absolute bottom-2 right-2 flex gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <TrashIcon
          className="size-[25px] bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
          onClick={() => onDelete(_id)}
        />

        <DownloadIcon
          className="size-[25px] bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
          onClick={() => downloadThumbnail(image!)}
        />

        <ArrowUpRightIcon
          className="size-[25px] bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
          onClick={() => {
            localStorage.setItem("base64", image!)
            window.open(`/preview?title=${title}`, "_blank")
          }}
        />
      </div>
    </div>
  )
}
