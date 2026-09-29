/**
 * Identity plus the only in-page "go home" link. Without it, tapping a section
 * link on a phone leaves no way back to the top short of scrolling up.
 */
export default function Wordmark() {
  return (
    <a className="wordmark" href="#top">
      <span className="wordmark__name">ggk5743</span>
      <span className="wordmark__role">全端開發者</span>
    </a>
  )
}
