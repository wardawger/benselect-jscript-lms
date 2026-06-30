import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
} from 'motion/react'
import { cn } from '@/lib/utils'

const BAND_HALF = 17
const SWEEP_START = -BAND_HALF
const SWEEP_END = 100 + BAND_HALF

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - BAND_HALF
  const bandEnd = pos + BAND_HALF
  if (bandStart >= 100) return `linear-gradient(90deg, ${textColor}, ${textColor})`
  const n = colors.length
  const parts: string[] = []
  if (bandStart > 0) parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`)
  colors.forEach((c, i) => {
    const pct = n === 1 ? pos : bandStart + (i / (n - 1)) * BAND_HALF * 2
    parts.push(`${c} ${pct.toFixed(2)}%`)
  })
  if (bandEnd < 100) parts.push(`transparent ${bandEnd.toFixed(2)}%`, `transparent 100%`)
  return `linear-gradient(90deg, ${parts.join(', ')})`
}

export interface DiaTextRevealProps extends Omit<
  HTMLMotionProps<'span'>,
  'ref' | 'children' | 'style' | 'animate' | 'transition' | 'color'
> {
  text: string | string[]
  colors?: string[]
  textColor?: string
  duration?: number
  delay?: number
  once?: boolean
  className?: string
}

export function DiaTextReveal({
  text,
  colors = ['#7BB8E8', '#4A9FD4', '#2A6EBB', '#1A4F8A', '#4A9FD4', '#7BB8E8'],
  textColor = '#2A6EBB',
  duration = 1.2,
  delay = 0.1,
  once = true,
  className,
  ...props
}: DiaTextRevealProps) {
  const texts = Array.isArray(text) ? text : [text]
  const prefersReducedMotion = useReducedMotion()
  const spanRef = useRef<HTMLSpanElement>(null)
  const hasPlayedRef = useRef(false)
  const stopRef = useRef<(() => void) | null>(null)
  const [, setTick] = useState(0)

  const sweepPos = useMotionValue(SWEEP_START)
  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildGradient(pos, colors, textColor)
  )
  const isInView = useInView(spanRef, { once, amount: 0.1 })

  useEffect(() => {
    if (prefersReducedMotion) { sweepPos.set(SWEEP_END); return }
    if (!isInView) return
    if (once && hasPlayedRef.current) return
    hasPlayedRef.current = true
    sweepPos.set(SWEEP_START)
    // Force a re-render so the gradient starts from the left
    setTick(n => n + 1)
    const controls = animate(sweepPos, SWEEP_END, { duration, delay, ease: sweepEase })
    stopRef.current = () => controls.stop()
    return () => { stopRef.current?.() }
  }, [isInView, prefersReducedMotion])

  return (
    <motion.span
      ref={spanRef}
      className={cn('align-bottom leading-[100%] text-inherit', className)}
      style={{
        transform: 'translateY(-2px)',
        color: 'transparent',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        backgroundSize: '100% 100%',
        backgroundImage,
      }}
      {...props}
    >
      {texts[0]}
    </motion.span>
  )
}
