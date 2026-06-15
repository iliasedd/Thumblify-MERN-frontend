import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { yt_html } from "../data/data"

export default function YTPreview() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const thumbnail = localStorage.getItem("base64")
  const title = searchParams.get("title")

  const new_html = yt_html
    .replace("%%THUMBNAIL_URL%%", thumbnail!)
    .replace("%%TITLE%%", title!)

  useEffect(() => {
    if (!thumbnail || !title) navigate("/")
  }, [])

  return (
    <div className="fixed inset-0 z-100 bg-black">
      <iframe
        srcDoc={new_html}
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    </div>
  )
}
