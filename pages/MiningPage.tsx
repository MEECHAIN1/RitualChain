import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../utils/TranslationProvider";
import { useCelebration } from "../context/CelebrationContext";
import { useAccount } from "../services/mockWeb3";
import { GoogleGenAI } from "@google/genai";

const MiningPage: React.FC = () => {
  const { t } = useTranslation();
  const { triggerCelebration } = useCelebration();
  const { isConnected, connect } = useAccount();
  
  const [isMining, setIsMining] = useState(false);
  const [minedAmount, setMinedAmount] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [wisdomPoints, setWisdomPoints] = useState(0);
  const [logs, setLogs] = useState<{ id: string; text: string; time: string }[]>([]);
  
  // Badge Tracking
  const [achievedBadges, setAchievedBadges] = useState<Set<string>>(new Set());
  
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isMining) {
      interval = setInterval(() => {
        // Random flux in Vacuum Energy (MHz)
        const currentHash = 1.2 + Math.random() * 2.1; 
        setHashRate(currentHash);
        
        // Accumulate Mined tokens and Wisdom Points
        setMinedAmount(prev => prev + 0.000084);
        setWisdomPoints(prev => prev + 0.000025);

        // Badge Checks
        if (currentHash > 3.0 && !achievedBadges.has('quantum')) {
            setAchievedBadges(prev => new Set(prev).add('quantum'));
            triggerCelebration(t("badge.quantum"), 'generic');
        }
      }, 1000);
    } else {
      setHashRate(0);
    }

    return () => clearInterval(interval);
  }, [isMining, achievedBadges, t, triggerCelebration]);

  // AI Log Generation
  useEffect(() => {
    let logInterval: ReturnType<typeof setInterval>;
    
    const generateAILog = async () => {
        if (!isMining) return;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = "You are the RitualChain Oracle monitoring a vacuum energy mining ritual. Generate a single, short (max 12 words) log entry describing a mystical or technical ritual event. Examples: 'Quantum fluctuations stabilized in the third quadrant', 'Ancient cipher decoded in the energy stream'. Use ritualistic language. No emojis.";
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            
            const logText = response.text || "Energy stream stabilized.";
            setLogs(prev => [
                ...prev.slice(-49),
                { id: Math.random().toString(36), text: logText, time: new Date().toLocaleTimeString() }
            ]);
        } catch (e) {
            console.error("Oracle log failed", e);
        }
    };

    if (isMining) {
        // Initial log
        setLogs(prev => [...prev, { id: 'init', text: "Initializing ritual sequences...", time: new Date().toLocaleTimeString() }]);
        logInterval = setInterval(generateAILog, 8000); // New AI log every 8s
    }

    return () => clearInterval(logInterval);
  }, [isMining]);

  const toggleMining = async () => {
    if (!isConnected) {
      triggerCelebration("Connect your soul-binding wallet first!");
      await connect();
      return;
    }

    if (!isMining) {
      setIsMining(true);
      triggerCelebration("Mining Ritual Commenced!", 'stake');
    } else {
      setIsMining(false);
      triggerCelebration("Ritual Halted Safely", 'generic');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <header className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 flex justify-center items-center gap-4">
          <span className={`${isMining ? "animate-spin text-meebot-accent" : "text-meebot-highlight"}`}>⛏️</span> 
          {t("mining.title")}
        </h2>
        <p className="text-meebot-text-secondary max-w-lg mx-auto font-medium italic opacity-80">
          {t("mining.desc")}
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Control Panel */}
        <div className="bg-meebot-surface/50 border border-meebot-border rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl backdrop-blur-xl">
          {isMining && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-meebot-accent/5 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            </div>
          )}

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-meebot-text-secondary text-xs font-black uppercase tracking-[0.3em]">{t("mining.status")}</span>
              <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-500 ${isMining ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-green-400 animate-ping' : 'bg-red-400'}`}></span>
                {isMining ? t("mining.status.active") : t("mining.status.idle")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-meebot-bg/50 border border-meebot-border p-6 rounded-2xl text-center">
                    <span className="block text-meebot-text-secondary mb-2 text-[10px] uppercase font-bold tracking-widest">{t("mining.hashrate")}</span>
                    <span className={`text-3xl font-mono font-black ${isMining ? 'text-meebot-accent' : 'text-meebot-text-secondary'}`}>
                        {hashRate.toFixed(2)}
                    </span>
                </div>
                <div className="bg-meebot-bg/50 border border-meebot-border p-6 rounded-2xl text-center">
                    <span className="block text-meebot-text-secondary mb-2 text-[10px] uppercase font-bold tracking-widest">{t("mining.wisdom")}</span>
                    <span className={`text-3xl font-mono font-black ${isMining ? 'text-purple-400' : 'text-meebot-text-secondary'}`}>
                        {wisdomPoints.toFixed(4)}
                    </span>
                </div>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-meebot-border font-mono text-3xl text-white mb-8 flex justify-between items-center group relative overflow-hidden">
                <div className="flex flex-col">
                    <span className="text-meebot-text-secondary text-[10px] uppercase font-bold tracking-widest mb-1">{t("mining.mined")}</span>
                    <div className="flex items-baseline gap-2">
                        <span>{minedAmount.toFixed(6)}</span>
                        <span className="text-xs text-meebot-accent font-black">MCB</span>
                    </div>
                </div>
                <div className="text-4xl opacity-20">🪙</div>
            </div>
            
            <div className="flex gap-4 mb-4">
                {['quantum', 'wisdom', 'conduit'].map(b => (
                    <div 
                        key={b} 
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 border ${achievedBadges.has(b) ? 'bg-meebot-accent/20 border-meebot-accent shadow-lg scale-110' : 'bg-meebot-surface border-meebot-border opacity-20'}`}
                        title={t(`badge.desc.${b}`)}
                    >
                        {b === 'quantum' ? '⚛️' : b === 'wisdom' ? '🧠' : '🔗'}
                    </div>
                ))}
            </div>
          </div>

          <button
            onClick={toggleMining}
            className={`relative z-10 w-full py-5 rounded-2xl font-black text-xl transition-all duration-300 transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 overflow-hidden group ${
              isMining 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-meebot-accent hover:bg-meebot-highlight text-white"
            }`}
          >
            <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-3">
                {isMining ? t("mining.stop") : t("mining.start")}
            </span>
          </button>
        </div>

        {/* Right: Mystical Terminal */}
        <div className="bg-black border border-meebot-border rounded-3xl p-8 font-mono text-xs text-green-400 flex flex-col h-[500px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-10 bg-meebot-surface/50 border-b border-meebot-border flex items-center px-6 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            <span className="ml-3 text-meebot-text-secondary text-[10px] font-black uppercase tracking-widest opacity-50">ritual_oracle.log</span>
          </div>
          
          <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar space-y-3 pt-4" ref={logsRef}>
            {logs.length === 0 && !isMining && (
              <div className="text-meebot-text-secondary opacity-30 italic">
                {">"} Connect to vacuum energy stream...
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 border-b border-white/5 pb-2">
                <span className="text-gray-600 shrink-0">[{log.time}]</span>
                <span className="text-green-300">❯ {log.text}</span>
              </div>
            ))}
            {isMining && (
              <div className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-2"></div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 197, 94, 0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default MiningPage;