import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#F7F9FA] text-[#0F1E25]">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-[#E2E8EA] shadow-lg text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#E0502B]/10 flex items-center justify-center text-[#E0502B] mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#0F1E25] mb-2">
              เกิดข้อผิดพลาดในการแสดงผล
            </h2>
            <p className="text-sm text-[#61757D] mb-6">
              ระบบตรวจพบปัญหาและได้กู้คืนหน้าจอเพื่อป้องกันหน้าจอขาว กรุณากดปุ่มด้านล่างเพื่อดำเนินการต่อ
            </p>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 h-11 rounded-xl border border-[#E2E8EA] text-[#33474F] font-semibold text-sm hover:bg-[#F7F9FA] transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 h-11 rounded-xl bg-[#0C6FA8] text-white font-semibold text-sm hover:bg-[#095b8a] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                รีเฟรชหน้า
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
