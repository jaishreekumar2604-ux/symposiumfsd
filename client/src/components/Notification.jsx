import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Notification = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
    info: 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
  }[toast.type || 'info'];

  const IconComponent = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }[toast.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 max-w-md shadow-2xl">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-lg ${bgStyles}`}
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};

export default Notification;
