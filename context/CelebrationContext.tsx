import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const SimpleConfetti: React.FC = () => {
  const colors = ['#ff8906', '#f25f4c', '#fffffe', '#a7a9be', '#e53170'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm opacity-0"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animation: `fall ${Math.random() * 2.5 + 1.5}s linear forwards`,
            animationDelay: `${Math.random() * 0.8}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

type CelebrationContextType = {
  triggerCelebration: (message: string) => void;
  isCelebrating: boolean;
};

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerCelebration = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);

    setMessage(msg);
    setIsCelebrating(true);
    
    toastTimerRef.current = setTimeout(() => {
        setMessage(null);
        toastTimerRef.current = null;
    }, 4500);
    
    celebrationTimerRef.current = setTimeout(() => {
        setIsCelebrating(false);
        celebrationTimerRef.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
      return () => {
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
      };
  }, []);

  return (
    <CelebrationContext.Provider value={{ triggerCelebration, isCelebrating }}>
      {children}
      {isCelebrating && <SimpleConfetti />}
      {message && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-meebot-surface border border-meebot-accent/50 text-meebot-text-primary px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(255,137,6,0.4)] flex items-center gap-4 backdrop-blur-xl animate-bounce-custom">
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,137,6,0.8)]">✨</span>
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-meebot-accent font-bold mb-0.5 opacity-80">Oracle Proclamation</span>
                <span className="font-bold text-lg tracking-wide">{message}</span>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes bounce-custom {
            0%, 20%, 50%, 80%, 100% { transform: translate(-50%, 0); }
            40% { transform: translate(-50%, -15px); }
            60% { transform: translate(-50%, -7px); }
        }
        .animate-bounce-custom {
            animation: bounce-custom 1.5s ease infinite;
        }
      `}</style>
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider");
  return ctx;
};