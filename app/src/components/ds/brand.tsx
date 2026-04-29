import { cn } from '@/lib/utils'

interface BrandProps {
  size?: number
  className?: string
}

/**
 * The InMan wordmark. Renders the SVG asset committed at /public/brand/logo.svg
 * (the one already used in TopNav).
 */
export function Brand({ size = 33, className }: BrandProps) {
  return (
    <img
      src="/brand/logo.svg"
      alt="InMan"
      className={cn('block w-auto select-none', className)}
      style={{ height: size }}
      draggable={false}
    />
  )
}
