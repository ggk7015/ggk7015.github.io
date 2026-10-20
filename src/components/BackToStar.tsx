type Props = {
  label: string
  onClick: () => void
}

/**
 * Shown at the head of every section: hops back to the planet we came from,
 * or back to the map itself once the trail runs out.
 */
export default function BackToStar({ label, onClick }: Props) {
  return (
    <button type="button" className="backstar" onClick={onClick}>
      <span className="backstar__arrow" aria-hidden="true">
        ←
      </span>
      <span>返回上一顆星球</span>
      <em>{label}</em>
    </button>
  )
}
