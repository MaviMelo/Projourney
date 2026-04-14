import { ParticleProps, MousePosition } from "@/types"
import { JSX, useRef, useEffect } from "react"
import { useTheme } from "./theme-provider"


// Particle class with TypeScript 
class Particle implements ParticleProps {
    public x: number
    public y: number
    public vx: number
    public vy: number
    public size: number
    public opacity: number

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.vx = (Math.random() - 0.5) * 0.15
        this.vy = (Math.random() - 0.5) * 0.15
        this.size = Math.random() * 1.2 + 0.3
        this.opacity = Math.random() * 0.5 + 0.2
    }

    public update(canvasWidth: number, canvasHeight: number): void {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0) this.x = canvasWidth
        if (this.x > canvasWidth) this.x = 0
        if (this.y < 0) this.y = canvasHeight
        if (this.y > canvasHeight) this.y = 0
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        )
        gradient.addColorStop(0, `rgba(250, 255, 255, ${this.opacity})`)
        gradient.addColorStop(1, 'rgba(55, 58, 24, 0.49)')

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
    }
}

// Particle system component with TypeScript
export default function ParticleBackground(): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()

    useEffect((): (() => void) => {
        const canvas: HTMLCanvasElement | null = canvasRef.current
        if (!canvas) return (): void => { }

        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d")
        if (!ctx) return (): void => { }

        // Set canvas size with TypeScript
        const resizeCanvas = (): void => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Create particles with TypeScript
        const particles: Particle[] = []
        for (let i = 0; i < 75; i++) {
            particles.push(new Particle(canvas.width, canvas.height))
        }

        // Mouse interaction with TypeScript
        const mouse: MousePosition = { x: 0, y: 0 }
        const handleMouseMove = (e: MouseEvent): void => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }
        canvas.addEventListener("mousemove", handleMouseMove)

        // Animation loop with TypeScript
        
        let animationFrameId: number;

        // Cores de fundo baseadas no tema
        const bgColor = theme === 'dark' ? '#08081a' : '#f8fafc'
        const lineColor = theme === 'dark' ? 'rgba(255, 255, 255,' : 'rgba(0, 100, 200,'

        const animate = (): void => {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle: Particle, i: number): void => {
                particle.update(canvas.width, canvas.height)
                particle.draw(ctx)

                // Draw connections with TypeScript
                particles.slice(i + 1).forEach((otherParticle: Particle): void => {
                    const dx: number = particle.x - otherParticle.x
                    const dy: number = particle.y - otherParticle.y
                    const distance: number = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 160) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = `${lineColor} ${0.1 * (1 - distance / 160)})`
                        ctx.lineWidth = 0.3
                        ctx.stroke()
                    }
                })

                // Mouse interaction with TypeScript
                const mouseDistance: number = Math.sqrt((particle.x - mouse.x) ** 2 + (particle.y - mouse.y) ** 2)
                if (mouseDistance < 180) {
                    ctx.beginPath()
                    ctx.moveTo(particle.x, particle.y)
                    ctx.lineTo(mouse.x, mouse.y)
                    ctx.strokeStyle = `${lineColor} ${0.2 * (1 - mouseDistance / 180)})`
                    ctx.lineWidth = 0.3
                    ctx.stroke()
                }
            })

           animationFrameId = requestAnimationFrame(animate)
        }
        animate()

        return (): void => {
            window.removeEventListener("resize", resizeCanvas)
            canvas.removeEventListener("mousemove", handleMouseMove)
        }
    }, [theme])

    return <canvas ref={canvasRef} className="fixed top-0 left-0 min-w-full h-full bg-slate-50 dark:bg-[#08081a]" style={{ zIndex: -1 }} />
}
