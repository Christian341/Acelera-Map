import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    autoReloadOnError?: boolean;
    reloadDelayMs?: number;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    countdown: number;
}

/**
 * Error Boundary component with auto-reload capability for TV mode
 * Catches React errors and automatically reloads the page after a delay
 */
export class TVErrorBoundary extends Component<Props, State> {
    private countdownInterval: NodeJS.Timeout | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            countdown: 0,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { autoReloadOnError = true, reloadDelayMs = 3000 } = this.props;

        console.error('[TV Error Boundary] Fatal error caught:', error);
        console.error('[TV Error Boundary] Error info:', errorInfo);

        this.setState({
            error,
            errorInfo,
            countdown: Math.floor(reloadDelayMs / 1000),
        });

        // Save error to localStorage for debugging
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                error: error.toString(),
                stack: error.stack,
                componentStack: errorInfo.componentStack,
            };
            localStorage.setItem('lastError', JSON.stringify(errorLog));
        } catch (e) {
            // Ignore localStorage errors
        }

        if (autoReloadOnError) {
            // Start countdown
            this.countdownInterval = setInterval(() => {
                this.setState((prevState) => {
                    const newCountdown = prevState.countdown - 1;
                    if (newCountdown <= 0) {
                        if (this.countdownInterval) {
                            clearInterval(this.countdownInterval);
                        }
                        window.location.reload();
                    }
                    return { countdown: newCountdown };
                });
            }, 1000);
        }
    }

    componentWillUnmount() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    render() {
        const { hasError, error, countdown } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            if (fallback) {
                return fallback;
            }

            return (
                <div className="w-full h-screen bg-[#050505] flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Erro Detectado</h1>
                                <p className="text-white/60 text-sm">
                                    O sistema encontrou um problema e será reiniciado
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-lg p-4 mb-6 font-mono text-sm text-red-400">
                            {error?.toString()}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-white/60 text-sm">
                                Reiniciando em{' '}
                                <span className="text-[#FF2D55] font-bold text-lg">{countdown}</span>{' '}
                                segundos...
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-[#FF2D55] hover:bg-[#FF2D55]/80 text-white rounded-lg transition-colors font-medium"
                            >
                                Reiniciar Agora
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-[#FF2D55] h-full transition-all duration-1000 ease-linear"
                                    style={{
                                        width: `${(countdown / 3) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return children;
    }
}
