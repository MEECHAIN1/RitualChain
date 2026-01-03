import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { playMintSound, playStakeSound, playClaimSound } from "../utils/sounds";

const MagicParticles: React.FC = () => {
  const colors = ['#ff8906', '#f25f4c', '#fffffe', '#7f5af0', '#2cb67d'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: `0 0 10px currentColor`,
            animation: `magic-float ${Math.random() * 3 + 2}s ease-out forwards`,
            animationDelay: `${Math.random() * 1}s`
          }}
        />
      ))}
      <style>{`
        @keyframes magic-float {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

type CelebrationType = 'mint' | 'stake' | 'unstake' | 'claim' | 'connect' | 'generic';

type CelebrationContextType = {
  triggerCelebration: (message: string, type?: CelebrationType) => Promise<void>;
  isCelebrating: boolean;
};

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proclamation, setProclamation] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getMysticalMessage = async (baseMessage: string, type: CelebrationType): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an ancient mystical oracle for the blockchain 'RitualChain'. 
      A significant event just occurred: "${baseMessage}" (Event Type: ${type}). 
      Speak as if delivering a short, powerful prophecy. Use poetic, ritualistic language. 
      Keep it under 15 words. Respond in the user's likely language (Thai or English). 
      No emojis in the plain text output.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || baseMessage;
    } catch (e) {
      console.error("Oracle failed to speak", e);
      return baseMessage;
    }
  };

  const triggerCelebration = useCallback(async (msg: string, type: CelebrationType = 'generic') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Play sounds based on type
    if (type === 'mint') playMintSound();
    else if (type === 'stake') playStakeSound();
    else if (type === 'claim') playClaimSound();

    setIsCelebrating(true);
    
    // Fetch AI mystical message
    const mysticalMsg = await getMysticalMessage(msg, type);
    setProclamation(mysticalMsg);

    timerRef.current = setTimeout(() => {
        setIsCelebrating(false);
        setProclamation(null);
        timerRef.current = null;
    }, 7000);
  }, []);

  return (
    <CelebrationContext.Provider value={{ triggerCelebration, isCelebrating }}>
      <div className={`ritual-aura ${isCelebrating ? 'active' : ''}`} />
      {children}
      {isCelebrating && <MagicParticles />}
      {proclamation && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-lg pointer-events-none animate-ritual-reveal">
          <div className="relative group">
            {/* Glow Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-meebot-accent via-meebot-highlight to-purple-600 rounded-3xl blur opacity-60 animate-pulse"></div>
            
            <div className="relative bg-meebot-surface/90 border border-white/20 px-8 py-6 rounded-3xl shadow-2xl backdrop-blur-3xl flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-meebot-accent to-meebot-highlight flex items-center justify-center text-3xl shadow-xl ring-2 ring-white/20 animate-spin-slow">
                🔮
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.4em] text-meebot-accent font-black mb-1 opacity-80">Oracle Proclamation</span>
                <p className="font-serif text-xl md:text-2xl italic text-white leading-tight font-light">
                  "{proclamation}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider");
  return ctx;
};