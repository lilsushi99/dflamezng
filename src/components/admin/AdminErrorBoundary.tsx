import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AdminErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12">
          <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            {this.props.fallbackTitle || 'Unable to display admin section'}
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mb-6">
            A rendering error occurred while mounting this admin interface. You can attempt to reload the section below.
          </p>
          {this.state.error && (
            <div className="w-full p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-left mb-6 overflow-x-auto">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Error Diagnostic:</span>
              <code className="text-xs font-mono text-red-400 block whitespace-pre-wrap">
                {this.state.error.message || String(this.state.error)}
              </code>
            </div>
          )}
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RELOAD SECTION
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
