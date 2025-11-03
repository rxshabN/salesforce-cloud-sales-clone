"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { X, CheckCircle2 } from "lucide-react"

interface Toast {
  id: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  showToast: (message: string, action?: { label: string; onClick: () => void }) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, action?: { label: string; onClick: () => void }) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, action }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      hideToast(id)
    }, 5000)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#c8f7dc] rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[400px] animate-in slide-in-from-top-2 duration-300"
          >
            <CheckCircle2 className="w-5 h-5 text-[#0b6e4f] shrink-0" />
            <span className="text-[#181818] text-sm flex-1">
              {toast.message}
              {toast.action && (
                <>
                  {" "}
                  <button
                    onClick={() => {
                      toast.action?.onClick()
                      hideToast(toast.id)
                    }}
                    className="underline font-medium hover:no-underline"
                  >
                    {toast.action.label}
                  </button>
                </>
              )}
            </span>
            <button onClick={() => hideToast(toast.id)} className="text-[#181818] hover:text-[#0b6e4f] shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
