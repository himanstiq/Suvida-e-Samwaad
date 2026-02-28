import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Global error boundary for the kiosk app.
 * Prevents the entire UI from going blank on uncaught render errors.
 * Shows a recovery screen that auto-resets after 10 seconds.
 */
export class KioskErrorBoundary extends Component<Props, State> {
    private resetTimerId: ReturnType<typeof setTimeout> | null = null;

    override state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[KioskErrorBoundary]", error, errorInfo);
    }

    override componentDidUpdate(_: Props, prevState: State) {
        // Auto-recover after 10 seconds so the kiosk doesn't stay stuck
        if (this.state.hasError && !prevState.hasError) {
            this.resetTimerId = setTimeout(() => this.setState({ hasError: false }), 10_000);
        }
    }

    override componentWillUnmount() {
        if (this.resetTimerId) clearTimeout(this.resetTimerId);
    }

    handleReset = () => {
        if (this.resetTimerId) clearTimeout(this.resetTimerId);
        this.setState({ hasError: false });
    };

    override render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-white text-center p-12">
                    <div className="size-24 rounded-full bg-red-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-500 text-6xl">error</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900">कुछ गलत हो गया</h2>
                        <p className="text-xl text-slate-500">Something went wrong. The kiosk will recover automatically.</p>
                    </div>
                    <button
                        onClick={this.handleReset}
                        className="px-10 py-4 bg-saffron text-white text-xl font-bold rounded-full shadow-xl kiosk-button"
                    >
                        पुनः प्रयास करें (Retry)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
