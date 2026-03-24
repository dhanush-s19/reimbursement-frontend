"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: Readonly<ToastProps>) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setIsVisible(true), 10)
    const closeTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(closeTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsVisible(false) // Trigger exit animation
    setTimeout(onClose, 300) // Call the parent onClose after animation finishes
  }

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  }

  const currentStyle = styles[type]

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[999] 
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg 
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
        ${currentStyle.bg} ${currentStyle.border}
      `}
    >
      {currentStyle.icon}
      <p className={`text-sm font-medium ${currentStyle.text}`}>{message}</p>
      <button
        onClick={handleClose}
        className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X className={`w-4 h-4 ${currentStyle.text} opacity-60`} />
      </button>
    </div>
  )
}