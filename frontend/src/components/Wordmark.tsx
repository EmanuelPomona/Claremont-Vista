/**
 * The Claremont Vista name, typeset in the display serif (Instrument Serif).
 * Replaced the hand-drawn SVG at the owner's request: professional, not playful.
 * Decorative here; the parent link carries the accessible name.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      Claremont Vista
    </span>
  )
}
