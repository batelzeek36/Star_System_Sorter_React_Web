import { ChevronLeft } from 'lucide-react';

interface AppBarProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function AppBar({ title, onBack, showBack }: AppBarProps) {
  return (
    <div className="flex items-center justify-between h-14 px-4">
      {showBack && onBack ? (
        <button 
          onClick={onBack}
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-purple-300" />
        </button>
      ) : (
        <div className="w-11" />
      )}
      
      {title && (
        <h2 className="text-purple-200">{title}</h2>
      )}
      
      <div className="w-11" />
    </div>
  );
}
