import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SoftBackdrop from "../components/SoftBackdrop"
import PreviewPanel from "../components/PreviewPanel"
import SettingsPanel from "../components/SettingsPanel"
import { useAuth } from "../context/AuthContext"
import api from "../configs/api"
import { colorSchemes } from "../data/data"
import type {
  AspectRatio,
  ColorScheme,
  IThumbnail,
  ThumbnailStyle,
} from "../types"

export default function Generate() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null)
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [titleError, setTitleError] = useState("")
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9")

  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic")
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false)

  const [colorSchemeId, setColorSchemeId] = useState<ColorScheme>(
    colorSchemes[0].id,
  )
  const [additionalDetails, setAdditionalDetails] = useState("")

  useEffect(() => {
    if (isLoggedIn && id) {
      if (id.length == 24) {
        fetchThumbnail()
      } else {
        navigate("/generate")
      }
    }
  }, [id, isLoggedIn])

  useEffect(() => {
    if (!id && thumbnail) {
      setThumbnail(null)
      setTitle("")
      setAspectRatio("16:9")
      setStyle("Bold & Graphic")
      setColorSchemeId(colorSchemes[0].id)
      setAdditionalDetails("")
    }
  }, [pathname])

  useEffect(() => {
    if (!isLoggedIn) navigate("/login")
  }, [isLoggedIn])

  async function fetchThumbnail() {
    setLoading(true)

    try {
      const { data } = await api.get(`/api/thumbnails/${id}`)
      const { title, aspect_ratio, style, color_scheme, user_prompt } =
        data?.thumbnail

      setThumbnail(data?.thumbnail as IThumbnail)
      setTitle(title)
      setAspectRatio(aspect_ratio)
      setStyle(style)
      setColorSchemeId(color_scheme)
      setAdditionalDetails(user_prompt)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const validateTitle = () => {
    let isValid = true
    let nextTitleError = ""

    if (!title.trim()) {
      nextTitleError = "title is required"
      isValid = false
    }

    setTitleError(nextTitleError)
    return isValid
  }

  const handleGenerate = async () => {
    if (!validateTitle()) return

    const payload = {
      title,
      prompt: additionalDetails,
      style,
      aspect_ratio: aspectRatio,
      color_scheme: colorSchemeId,
      text_overlay: true,
    }

    setLoading(true)

    try {
      const { data } = await api.post("/api/thumbnails/generate", payload)

      if (data.thumbnail) {
        navigate(`/generate/${data.thumbnail._id}`)
        toast.success(data.message)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SoftBackdrop />

      <div className="pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid md:grid-cols-[367px_1fr] gap-5">
            <SettingsPanel
              id={id}
              title={title}
              onTitleChange={(e) => setTitle(e.target.value)}
              titleError={titleError}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              style={style}
              onStyleChange={setStyle}
              isOpen={styleDropdownOpen}
              setIsOpen={setStyleDropdownOpen}
              colorScheme={colorSchemeId}
              onColorSchemeChange={setColorSchemeId}
              additionalDetails={additionalDetails}
              onAdditionalDetailsChange={(e) =>
                setAdditionalDetails(e.target.value)
              }
              onGenerate={handleGenerate}
              isLoading={loading}
            />

            <PreviewPanel
              thumbnail={thumbnail}
              isLoading={loading}
              aspectRatio={aspectRatio}
            />
          </div>
        </div>
      </div>
    </>
  )
}
