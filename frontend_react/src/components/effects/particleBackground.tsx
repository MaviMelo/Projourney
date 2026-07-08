import { JSX, useRef, useEffect } from "react";
import { useTheme } from "./themeProvider";

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

    // Reposiciona a partícula proporcionalmente quando o canvas muda de tamanho
    rescale(oldW: number, oldH: number, newW: number, newH: number): void {
        this.x = (this.x / oldW) * newW;
        this.y = (this.y / oldH) * newH;
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

// Densidade alvo: 1 partícula a cada N px² (ajuste esse valor a gosto)
const PARTICLE_DENSITY = 12000;
const MIN_PARTICLES = 30;
const MAX_PARTICLES = 140;

function getParticleCount(width: number, height: number): number {
    const count = Math.round((width * height) / PARTICLE_DENSITY);
    return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, count));
}

export default function ParticleBackground(): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const animationFrameId = useRef<number | null>(null);

    useEffect((): (() => void) => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return (): void => { };

        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx) return (): void => { };

        const dpr = window.devicePixelRatio || 1;

        // Define o tamanho inicial do canvas (em px de CSS, escalado pelo devicePixelRatio)
        const setCanvasSize = (): void => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        setCanvasSize();

        // Cria as partículas com base na densidade da tela
        let particles: Particle[] = [];
        const initParticles = (): void => {
            const count = getParticleCount(window.innerWidth, window.innerHeight);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(window.innerWidth, window.innerHeight));
            }
        };
        initParticles();

        // Redimensionamento: reposiciona partículas proporcionalmente em vez de perdê-las
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = (): void => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout((): void => {
                const oldW = canvas.width / dpr;
                const oldH = canvas.height / dpr;
                const newDpr = window.devicePixelRatio || 1;

                const newW = window.innerWidth;
                const newH = window.innerHeight;

                canvas.width = newW * newDpr;
                canvas.height = newH * newDpr;
                canvas.style.width = `${newW}px`;
                canvas.style.height = `${newH}px`;
                ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0);

                // Reposiciona as partículas existentes proporcionalmente
                particles.forEach((p: Particle): void => p.rescale(oldW, oldH, newW, newH));

                // Ajusta a quantidade de partículas para a nova área da tela
                const targetCount = getParticleCount(newW, newH);
                if (particles.length < targetCount) {
                    const toAdd = targetCount - particles.length;
                    for (let i = 0; i < toAdd; i++) {
                        particles.push(new Particle(newW, newH));
                    }
                } else if (particles.length > targetCount) {
                    particles = particles.slice(0, targetCount);
                }
            }, 150); // debounce para não recalcular a cada pixel de resize
        };
        window.addEventListener("resize", handleResize);

        // Interação com o mouse
        const mouse: MousePosition = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent): void => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        canvas.addEventListener("mousemove", handleMouseMove);

        // Loop de animação
        const animate = (): void => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            particles.forEach((particle: Particle, i: number): void => {
                particle.update(w, h);
                particle.draw(ctx);

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

        return (): void => {
            clearTimeout(resizeTimeout);
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [theme]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 min-w-full h-full" style={{ zIndex: -2 }} />;
}