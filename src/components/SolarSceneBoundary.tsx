import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { failed: boolean }

/** A failed optional 3D chunk must never take down the portfolio content. */
export default class SolarSceneBoundary extends Component<Props, State> {
  override state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('3D star map could not be loaded:', error, info.componentStack)
  }

  override render() {
    if (this.state.failed) {
      return <div className="solar-scene solar-scene--loading" role="alert">3D 星圖暫時無法載入，仍可使用下方行星按鈕探索。</div>
    }
    return this.props.children
  }
}