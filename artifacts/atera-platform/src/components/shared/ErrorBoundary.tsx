import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-center">
          <h1 className="font-display text-4xl text-gold mb-4">Something went wrong</h1>
          <p className="font-body text-off-white mb-8">An unexpected error has occurred.</p>
          <button 
            className="btn-gold" 
            onClick={() => window.location.reload()}
          >
            Refresh to continue
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
