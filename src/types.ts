import { aspectRatios, colorSchemes, thumbnailStyles } from "./data/data"

export type AspectRatio = (typeof aspectRatios)[number]
export type ThumbnailStyle = (typeof thumbnailStyles)[number]
export type ColorScheme = (typeof colorSchemes)[number]["id"]

export interface IThumbnail {
  _id: string
  userId: string
  title: string
  description?: string
  style: ThumbnailStyle
  aspect_ratio?: AspectRatio
  color_scheme?: ColorScheme
  image?: string
  text_overlay?: boolean
  prompt_used?: string
  user_prompt?: string
  isGenerating?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IUser {
  name: string
  email: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  user: IUser | null
  setUser: (user: IUser | null) => void
  login: (user: { email: string; password: string }) => Promise<void>
  signUp: (user: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
}

export interface SectionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

export interface SectionTitleProps {
  text1: string
  text2: string
  text3: string
}

export interface IFeature {
  icon: string
  title: string
  description: string
}

export interface IFooter {
  title: string
  links: IFooterLink[]
}

export interface IFooterLink {
  name: string
  href: string
}
