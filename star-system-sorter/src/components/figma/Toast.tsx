import { Check, X, AlertCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
  onRetry?: () => void;
}

export function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
  onRetry,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Don't auto-close if there's a retry button (let user dismiss manually)
    if (onRetry) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration, onRetry]);

  const config = {
    success: {
      icon: <Check className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-gradient-to-r from-[var(--s3-success)] to-green-500",
      text: "text-white",
    },
    error: {
      icon: <X className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-gradient-to-r from-[var(--s3-error)] to-red-600",
      text: "text-white",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-gradient-to-r from-[var(--s3-warning)] to-[var(--s3-gold-600)]",
      text: "text-white",
    },
    info: {
      icon: <Info className="w-5 h-5 flex-shrink-0" />,
      bg: "bg-gradient-to-r from-[var(--s3-info)] to-blue-600",
      text: "text-white",
    },
  };

  const { icon, bg, text } = config[type];

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      setIsVisible(false);
      setTimeout(onClose, 300);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed top-16 left-1/2 -translate-x-1/2 z-50 
        transition-all duration-300 
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      <div
        className={`
        ${bg} backdrop-blur-md 
        px-4 py-3 
        rounded-[var(--s3-radius-full)]
        shadow-[var(--s3-elevation-3)]
        flex items-center gap-3 
        min-w-[200px] max-w-md
      `}
      >
        <div className={text}>{icon}</div>
        <p className={`text-sm ${text} flex-1`}>{message}</p>
        {onRetry && (
          <button
            onClick={handleRetry}
            className={`
              ${text} 
              px-3 py-1 
              bg-white/20 hover:bg-white/30 
              rounded-[var(--s3-radius-md)]
              text-xs font-medium
              transition-colors duration-200
              min-h-[32px]
            `}
          >
            Retry
          </button>
        )}
        <button
          onClick={handleClose}
          className={`${text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Inline Alert variant for use within pages
interface InlineAlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onDismiss?: () => void;
}

export function InlineAlert({
  message,
  type = "info",
  onDismiss,
}: InlineAlertProps) {
  const config = {
    success: {
      icon: <Check className="w-4 h-4 flex-shrink-0" />,
      bg: "bg-[var(--s3-success-muted)]",
      border: "border-[var(--s3-success)]",
      text: "text-green-300",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
      bg: "bg-[var(--s3-error-muted)]",
      border: "border-[var(--s3-error)]",
      text: "text-red-300",
    },
    warning: {
      icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
      bg: "bg-[var(--s3-warning-muted)]",
      border: "border-[var(--s3-warning)]",
      text: "text-[var(--s3-gold-300)]",
    },
    info: {
      icon: <Info className="w-4 h-4 flex-shrink-0" />,
      bg: "bg-[var(--s3-info-muted)]",
      border: "border-[var(--s3-info)]",
      text: "text-blue-300",
    },
  };

  const { icon, bg, border, text } = config[type];

  return (
    <div
      className={`
      ${bg} 
      border ${border}
      rounded-[var(--s3-radius-lg)]
      p-3
      flex items-start gap-3
    `}
    >
      <div className={text}>{icon}</div>
      <p className={`text-xs ${text} flex-1 leading-relaxed`}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
