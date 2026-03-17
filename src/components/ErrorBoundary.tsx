import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-deep text-white p-6">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-serif mb-4">Something went wrong</h1>
            <p className="text-white/70 mb-6">
              {this.state.error?.message.includes('{') 
                ? "A database permission error occurred. Please contact support." 
                : "An unexpected error occurred."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-gold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
