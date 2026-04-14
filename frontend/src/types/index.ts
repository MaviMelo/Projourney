import type React from "react"

export interface TechArea {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ExperienceLevel {
  value: string
  label: string
}

export interface FormData {
  nome: string
  email: string
  telefone: string
  idade: string
  cidade: string
  experiencia: string
  areasInteresse: string
  linguagens: string[]
  objetivos: string
  disponibilidade: string
  motivacao: string
}

export interface RippleProps {
  x: number
  y: number
  size: number
}

export interface InteractiveButtonProps {
  href: string
  children: React.ReactNode
  variant?: "primary" | "outline" | "nav" | "navButton"
  className?: string
}

export interface ParticleProps {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export interface MousePosition {
  x: number
  y: number
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}
