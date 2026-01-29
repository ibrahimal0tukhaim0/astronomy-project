import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-8 text-center text-white">
                    <h2 className="mb-4 text-3xl font-bold text-red-500 font-serif">Something went wrong</h2>
                    <p className="mb-8 max-w-md text-gray-300">
                        The simulation encountered an unexpected error. This might be due to a graphics context loss or resource limit.
                    </p>
                    <div className="bg-red-900/20 p-4 rounded border border-red-500/30 mb-8 max-w-lg overflow-auto text-left w-full text-xs font-mono">
                        {this.state.error?.toString()}
                    </div>
                    <button
                        className="rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 border border-white/20"
                        onClick={() => window.location.reload()}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
