import type React from "react"
import { cn } from "@/lib/utils"

type Props = React.PropsWithChildren<{
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  ariaLabel?: string
}>

export function GlassPanel({ className, children, as = "div", ariaLabel }: Props) {
  const Comp: any = as
  return (
    <Comp aria-label={ariaLabel} className={cn("glass", className)}>
      {children}
    </Comp>
  )
}
