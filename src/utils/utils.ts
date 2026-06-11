export default function downloadThumbnail(image: string) {
  const link = document.createElement("a")
  link.href = image
  link.download = "thumbnail.png"
  document.body.appendChild(link)
  link.click()
  link.remove()
}
