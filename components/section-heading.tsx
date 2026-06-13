import { cn } from "@/lib/utils"
import { Reveal } from "@/components/reveal"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-gold/60" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Reveal>
  )
}
