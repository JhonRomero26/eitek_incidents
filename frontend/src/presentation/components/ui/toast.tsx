import { useToastStore, type Toast, type ToastType } from "../../../shared/stores/toastStore";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const TOAST_ICONS: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const TOAST_STYLES: Record<ToastType, string> = {
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
};

const ICON_STYLES: Record<ToastType, string> = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
};

function ToastItem({ toast }: { toast: Toast }) {
    const removeToast = useToastStore((state) => state.removeToast);
    const Icon = TOAST_ICONS[toast.type];

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full duration-300 ${TOAST_STYLES[toast.type]}`}
            role="alert"
        >
            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${ICON_STYLES[toast.type]}`} />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{toast.title}</p>
                {toast.message && (
                    <p className="text-sm mt-1 opacity-80">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Cerrar notificación"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const toasts = useToastStore((state) => state.toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
