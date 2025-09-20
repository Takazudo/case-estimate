'use client';

/* global process */
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-zd-black flex items-center justify-center p-4">
          <div className="bg-zd-gray2 rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-zd-white mb-4">Something went wrong</h2>
            <p className="text-zd-white mb-4">
              We&apos;re sorry, but something unexpected happened. Please refresh the page to try
              again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-zd-link hover:bg-zd-active text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-zd-link cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-zd-error bg-black p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
