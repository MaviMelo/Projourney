
// src/components/common/interactive-button.tsx
//  COMPONENTE DE BOTÃO INTERATIVO

import { useState, useRef, useEffect } from "react"
import React from "react" // <-- Importe React aqui
import { Link } from "react-router-dom" // <-- Importe Link do react-router-dom
import { cn } from "../../lib/utils"
import type { RippleProps, InteractiveButtonProps } from "../../types"
import type { JSX } from "react/jsx-runtime"

export default function InteractiveButton({ // <-- Este é o componente do botão
  href,
  children,
  variant = "primary",
  className,
}: InteractiveButtonProps): JSX.Element {
  const [ripples, setRipples] = useState<RippleProps[]>([])
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isPressed, setIsPressed] = useState<boolean>(false)

  useEffect((): (() => void) => {
    const timeoutIds: NodeJS.Timeout[] = []

    ripples.forEach((_: RippleProps, i: number): void => {
      const timeoutId: NodeJS.Timeout = setTimeout((): void => {
        setRipples((prevRipples: RippleProps[]): RippleProps[] =>
          prevRipples.filter((_: RippleProps, index: number): boolean => index !== 0),
        )
      }, 600)

      timeoutIds.push(timeoutId)
    })

    return (): void => {
      timeoutIds.forEach((id: NodeJS.Timeout): void => clearTimeout(id))
    }
  }, [ripples])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!buttonRef.current) return

    const rect: DOMRect = buttonRef.current.getBoundingClientRect()
    const x: number = e.clientX - rect.left
    const y: number = e.clientY - rect.top
    const size: number = Math.max(rect.width, rect.height) * 2

    setRipples([...ripples, { x, y, size }])
    setIsPressed(true)
    setTimeout((): void => setIsPressed(false), 150)
  }

  const variantStyles: Record<string, string> = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white px-9 py-4 rounded-full font-semibold shadow-lg hover:shadow-blue-500/50",
    outline:
      "border-2 border-[#00aaff] text-[#00aaff] hover:bg-[#00aaff] hover:text-white px-9 py-4 rounded-full font-semibold",
    nav: "text-gray-300 font-semibold hover:text-white border-b-2 border-transparent hover:border-[#00aaff]",
    navButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold",
  }

  return (
    <Link
      to={href}
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden transition-all duration-300 inline-block",
        variantStyles[variant],
        isHovered && "scale-105",
        isPressed && "scale-95",
        variant === "nav" && "pb-1",
        className,
      )}
      onClick={handleClick}
      onMouseEnter={(): void => setIsHovered(true)}
      onMouseLeave={(): void => setIsHovered(false)}
    >
      {ripples.map(
        (ripple: RippleProps, i: number): JSX.Element => (
          <span
            key={i}
            className="absolute rounded-full bg-white/30 animate-ripple"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ),
      )}
      {children}
    </Link>
  )
}
