'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  pulseSpeed: number
  pulseOffset: number
}

export function FloatingParticles({ count = 55 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const animFrameRef = useRef<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let particles: Particle[] = []

    function resize() {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    function createParticles() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.2,
        opacity: Math.random() * 0.5 + 0.4,
        pulseSpeed: Math.random() * 0.025 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
      }))
    }

    function drawConnections() {
      if (!ctx) return
      const maxDist = 160
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35
            ctx.beginPath()
            ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    let tick = 0
    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)
      tick++

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const pulse = Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7
        const alpha = p.opacity * pulse

        ctx.beginPath()
        ctx.fillStyle = `rgba(94, 234, 212, ${alpha})`
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4)
        grad.addColorStop(0, `rgba(240, 180, 90, ${alpha * 0.35})`)
        grad.addColorStop(1, `rgba(94, 234, 212, 0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      drawConnections()
      animFrameRef.current = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    const ro = new ResizeObserver(() => { resize(); createParticles() })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      ro.disconnect()
    }
  }, [mounted, reducedMotion, count])

  // Always render the same node on SSR + first paint to avoid hydration mismatch.
  // Hide after mount when the user prefers reduced motion.
  if (mounted && reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
