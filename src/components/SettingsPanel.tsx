import type { Dispatch, SetStateAction } from "react"
import AspectRatioSelector from "./AspectRatioSelector"
import ColorSchemeSelector from "./ColorSchemeSelector"
import StyleSelector from "./StyleSelector"
import type { AspectRatio, ColorScheme, ThumbnailStyle } from "../types"

export default function SettingsPanel({
  id,
  title,
  onTitleChange,
  titleError,
  aspectRatio,
  onAspectRatioChange,
  style,
  onStyleChange,
  isOpen,
  setIsOpen,
  colorScheme,
  onColorSchemeChange,
  additionalDetails,
  onAdditionalDetailsChange,
  onGenerate,
  isLoading,
}: {
  id?: string
  title: string
  onTitleChange: (e: any) => void
  titleError: string
  aspectRatio: AspectRatio
  onAspectRatioChange: Dispatch<SetStateAction<AspectRatio>>
  style: ThumbnailStyle
  onStyleChange: Dispatch<SetStateAction<ThumbnailStyle>>
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  colorScheme: ColorScheme
  onColorSchemeChange: Dispatch<SetStateAction<ColorScheme>>
  additionalDetails: string
  onAdditionalDetailsChange: (e: any) => void
  onGenerate: () => Promise<void>
  isLoading: boolean
}) {
  return (
    <div
      className={`p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6 ${id && "pointer-events-none"}`}
    >
      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-1">
          Create Your Thumbnail
        </h2>
        <p className="text-sm text-zinc-400">
          Describe your vision and let AI bring it to life
        </p>
      </div>

      <div className="space-y-5">
        {/* TITLE INPUT */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title or Topic</label>

          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            maxLength={100}
            placeholder="e.g., 10 Tips for Better Sleep"
            className="w-full px-4 py-3 rounded-lg border border-white/12  bg-black/20  text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <div className="flex justify-between">
            <span className="text-xs font-medium text-red-400/90">
              {titleError}
            </span>
            <span className="text-xs text-zinc-400">{title.length}/100</span>
          </div>
        </div>

        {/* AspectRatioSelector */}
        <AspectRatioSelector
          value={aspectRatio}
          onChange={onAspectRatioChange}
        />

        {/* StyleSelector */}
        <StyleSelector
          value={style}
          onChange={onStyleChange}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        {/* ColorSchemeSelector */}
        <ColorSchemeSelector
          value={colorScheme}
          onChange={onColorSchemeChange}
        />

        {/* DETAILS */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Additional Prompts{" "}
            <span className="text-zinc-400 text-xs">(optional)</span>
          </label>

          <textarea
            value={additionalDetails}
            onChange={onAdditionalDetailsChange}
            rows={3}
            placeholder="Add any specific elements, mood, or style preferences..."
            className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6  text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-y"
          />
        </div>
      </div>

      {/* BUTTON */}
      {!id && (
        <button
          onClick={onGenerate}
          className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Generating..." : "Generate Thumbnail"}
        </button>
      )}
    </div>
  )
}
