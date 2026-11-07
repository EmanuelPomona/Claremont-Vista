/**
 * The owner's sketch, redrawn: "Claremont" lettered by hand, then a tall capital
 * V standing in the gap before "ista" (it touches no letter). One jacaranda
 * stroke, no fill.
 * Stroke is currentColor; the parent sets the colour.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 470 124"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-1.4 225 62)">
        {/* Claremont */}
        <g strokeWidth="3.8" transform="scale(0.9 1)">
          {/* C */}
          <path pathLength="1" d="M50 34 C42 20 14 22 12 56 C10 88 42 96 54 72" />
          {/* l */}
          <path pathLength="1" d="M72 14 C66 36 64 64 68 84 C69 88 74 88 77 84" />
          {/* a */}
          <path pathLength="1" d="M108 60 C96 52 82 60 82 72 C82 86 98 90 108 76" />
          <path pathLength="1" d="M108 58 L108 82 C108 88 114 88 118 84" />
          {/* r */}
          <path pathLength="1" d="M128 58 L128 84" />
          <path pathLength="1" d="M128 70 C130 60 138 56 146 60" />
          {/* e */}
          <path pathLength="1" d="M154 72 L180 70 C182 58 170 52 162 58 C152 66 154 84 168 86 C174 87 180 84 182 80" />
          {/* m */}
          <path pathLength="1" d="M192 58 L192 84" />
          <path pathLength="1" d="M192 68 C194 56 208 56 210 68 L210 84" />
          <path pathLength="1" d="M210 68 C212 56 226 56 228 68 L228 84" />
          {/* o */}
          <path pathLength="1" d="M248 56 C234 54 232 86 248 87 C264 88 266 58 250 55" />
          {/* n */}
          <path pathLength="1" d="M276 58 L276 84" />
          <path pathLength="1" d="M276 68 C278 56 294 56 296 68 L296 84" />
          {/* t */}
          <path pathLength="1" d="M312 40 L312 78 C312 86 320 88 326 83" />
          <path pathLength="1" d="M302 58 L326 58" />
        </g>

        {/* the capital V of Vista: sits in the gap, apex on the baseline, touches no letter */}
        <g strokeWidth="4.8">
          <path pathLength="1" d="M300 22 C304 44 312 68 320 88" />
          <path pathLength="1" d="M320 88 C326 66 334 42 342 18" />
        </g>

        {/* ista */}
        <g strokeWidth="3.8" transform="translate(350 0) scale(0.9 1)">
          {/* i */}
          <path pathLength="1" d="M6 58 L6 82 C6 86 10 86 12 83" />
          <circle cx="7" cy="42" r="2.2" fill="currentColor" strokeWidth="1.4" />
          {/* s */}
          <path pathLength="1" d="M42 60 C32 52 20 58 24 66 C30 73 44 74 40 82 C36 90 24 88 20 82" />
          {/* t */}
          <path pathLength="1" d="M56 42 L56 78 C56 86 64 88 70 83" />
          <path pathLength="1" d="M46 58 L70 58" />
          {/* a */}
          <path pathLength="1" d="M104 62 C92 54 78 62 78 74 C78 88 94 90 104 78" />
          <path pathLength="1" d="M104 60 L104 84 C104 90 110 90 114 86" />
        </g>
      </g>
    </svg>
  )
}
