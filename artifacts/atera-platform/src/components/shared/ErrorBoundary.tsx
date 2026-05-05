import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  inline?: boolean;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, message: "" };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) console.error("ErrorBoundary caught:", error, info);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      if (this.props.inline) {
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 16, padding: 32, textAlign: "center" }}>
            <div style={{ width: 32, height: 32, border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#C9A84C", fontSize: 14, fontWeight: 700 }}>!</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#8C8880", maxWidth: 280 }}>
              Something went wrong loading this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, message: "" })}
              style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#C9A84C", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Try again
            </button>
          </div>
        );
      }

      return (
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#080709", padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400, color: "#C9A84C", marginBottom: 16 }}>Atera Stays</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#8C8880", marginBottom: 32 }}>An unexpected error has occurred.</p>
          <button className="btn-gold" onClick={() => window.location.reload()} style={{ padding: "13px 32px" }}>
            Refresh to continue
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
