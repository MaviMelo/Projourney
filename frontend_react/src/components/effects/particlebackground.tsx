import { JSX, useRef, useEffect } from "react";
import { useTheme } from "./theme-provider";

interface ParticleProps {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
}

interface MousePosition {
    x: number;
    y: number;
}

class Particle implements ParticleProps {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.size = Math.random() * 1.2 + 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update(canvasWidth: number, canvasHeight: number): void {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        const particleColor1 = getComputedStyle(document.documentElement).getPropertyValue('--particle1').trim();
        const particleColor2 = getComputedStyle(document.documentElement).getPropertyValue('--particle2').trim();
        gradient.addColorStop(0, `hsl(${particleColor1})`);
        gradient.addColorStop(1, `hsl(${particleColor2})`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Particle system component
export default function ParticleBackground(): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const animationFrameId = useRef<number|null>(null); // Usando useRef para gerenciar o ID da animação

    useEffect((): (() => void) => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return (): void => { };

        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx) return (): void => { };

        // Define o tamanho do canvas
        const resizeCanvas = (): void => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Cria as partículas
        const particles: Particle[] = [];
        for (let i = 0; i < 75; i++) {
            particles.push(new Particle(canvas.width, canvas.height));
        }

        // Interação com o mouse
        const mouse: MousePosition = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent): void => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        canvas.addEventListener("mousemove", handleMouseMove);

        // Loop de animação
        const animate = (): void => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle: Particle, i: number): void => {
                particle.update(canvas.width, canvas.height);
                particle.draw(ctx);

                // Desenha as conexões entre partículas
                for (let j = i + 1; j < particles.length; j++) {
                    const otherParticle = particles[j];
                    const dx: number = particle.x - otherParticle.x;
                    const dy: number = particle.y - otherParticle.y;
                    const distance: number = Math.sqrt(dx * dx + dy * dy);
                    const particleColor3 = getComputedStyle(document.documentElement).getPropertyValue('--particle3').trim();

                    if (distance < 160) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `hsla(${particleColor3}, ${0.1 * (1 - distance / 160)})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }

                // Interação da partícula com o mouse
                const mouseDistance: number = Math.sqrt((particle.x - mouse.x) ** 2 + (particle.y - mouse.y) ** 2);
                const particleColor4 = getComputedStyle(document.documentElement).getPropertyValue('--particle4').trim();
                if (mouseDistance < 180) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `hsla(${particleColor4}, ${0.2 * (1 - mouseDistance / 180)})`;
                    ctx.lineWidth = 0.9;
                    ctx.stroke();
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };
        animate();

        // Função de limpeza
        return (): void => {
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [theme]); // O efeito é reexecutado quando o tema muda

    return <canvas ref={canvasRef} className="fixed top-0 left-0 min-w-full h-full " style={{ zIndex: -2 }} />;
}