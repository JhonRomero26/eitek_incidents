import * as React from "react"

const Dialog = ({ open, onOpenChange, children }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
