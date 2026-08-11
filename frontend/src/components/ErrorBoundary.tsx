import { Component, type ReactNode } from 'react'
import { Link } from 'react-router'
import i18n from '../lib/i18n'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Uncaught render error:', error)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center px-6">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              {i18n.t('common.error_title')}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {i18n.t('common.error_message')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {i18n.t('common.retry')}
              </button>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {i18n.t('common.back_home')}
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
