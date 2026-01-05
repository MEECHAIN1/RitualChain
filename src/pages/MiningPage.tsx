import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../utils/TranslationProvider";
import { useCelebration } from "../context/CelebrationContext";
import { useAccount } from "../services/mockWeb3";

const MiningPage: React.FC = () => {
  const { t } = useTranslation();
  const { triggerCelebration } = useCelebration();
  const { isConnected, connect } = useAccount();
  
  const [isMining, setIsMining] = useState(false);
  const [minedAmount, setMinedAmount] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [wisdomPoints, setWisdomPoints] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Badge Tracking
  const [achievedBadges, setAchievedBadges] = useState<Set<string>>(new Set());
  
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isMining) {
      interval = setInterval(() => {
        // Random flux in Vacuum Energy (MHz)
        const currentHash = 0.8 + Math.random() * 1.5; // Average around 1.55 MHz
        setHashRate(currentHash);
        
        // Accumulate Mined tokens and Wisdom Points
        setMinedAmount(prev => prev + 0.000042);
        setWisdomPoints(prev => prev + 0.00001);

        // Badge Check: Quantum Initiate (> 1 MHz)
        if (currentHash > 1.0 && !achievedBadges.has('quantum')) {
            setAchievedBadges(prev => new Set(prev).add('quantum'));
            triggerCelebration(t("badge.quantum"), 'generic');
        }

        // Generate logs randomly with mystical flavor
        if (Math.random() > 0.7) {
          const msgs = [
            "Vacuum energy harvesting stabilized...",
            "Quantum fluctuations accepted into node",
            "Wisdom synthesized from void data",
            "Ritual resonance frequency: " + currentHash.toFixed(2) + " MHz",
            "Synthesizing MCB particle from chaotic energy"
          ];
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30));
        }
      }, 500);
    } else {
      setHashRate(0);
    }

    return () => clearInterval(interval);
  }, [isMining, achievedBadges, t, triggerCelebration]);

  // Badge Check: Wisdom Seeker (> 0.01 Wisdom)
  useEffect(() => {
      if (wisdomPoints > 0.01 && !achievedBadges.has('wisdom')) {
          setAchievedBadges(prev => new Set(prev).add('wisdom'));
          triggerCelebration(t("badge.wisdom"), 'generic');
      }
  }, [wisdomPoints, achievedBadges, t, triggerCelebration]);

  const toggleMining = async () => {
    if (!isConnected) {
      triggerCelebration("⚠️ Align your essence (Connect Wallet) first!");
      await connect();
      return;
    }

    if (!isMining) {
      setIsMining(true);
      triggerCelebration("⛏️ Ritual Commenced! Vacuum Energy is flowing.");
      setLogs(prev => [`[System] Initializing Vacuum Energy Ritual...`, ...prev]);
    } else {
      setIsMining(false);
      setLogs(prev => [`[System] Ritual halted. Energy dissipated.`, ...prev]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="text-center mb-12 animate-slide-in-down">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 flex justify-center items-center gap-4">
          <span className={`${isMining ? "animate-spin text-meebot-accent" : "text-meebot-highlight"}`}>⛏️</span> 
          {t("mining.title")}
        </h2>
        <p className="text-meebot-text-secondary max-w-lg mx-auto font-medium italic opacity-80">
          "{t("mining.desc")}"
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Left: Control Panel */}
        <div className="bg-meebot-surface/50 border border-meebot-border rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl backdrop-blur-xl">
          {/* Background Aura */}
          {isMining && (
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-meebot-accent/10 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            </div>
          )}

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-meebot-text-secondary text-xs font-black uppercase tracking-[0.3em]">{t("mining.status")}</span>
              <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-500 ${isMining ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isMining ? 'bg-green-400 animate-ping' : 'bg-red-400'}`}></span>
                {isMining ? t("mining.status.active") : t("mining.status.idle")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-meebot-bg/50 border border-meebot-border p-6 rounded-2xl text-center">
                    <span className="block text-meebot-text-secondary mb-2 text-[10px] uppercase font-bold tracking-widest">{t("mining.hashrate")}</span>
                    <span className={`text-3xl font-mono font-black ${isMining ? 'text-meebot-accent drop-shadow-glow' : 'text-meebot-text-secondary'}`}>
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

            <div className="flex justify-between items-end mb-2">
              <span className="text-meebot-text-secondary text-xs uppercase font-black tracking-widest">{t("mining.mined")}</span>
            </div>
            <div className="bg-black/60 p-6 rounded-2xl border border-meebot-border font-mono text-3xl text-white mb-8 flex justify-between items-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-meebot-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span>{minedAmount.toFixed(6)}</span>
                <span className="text-sm text-meebot-accent font-black tracking-tighter">MCB</span>
            </div>
            
            {/* Badges UI */}
            <div className="flex gap-3 mb-4">
                {['quantum', 'wisdom', 'conduit'].map(b => (
                    <div 
                        key={b} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-500 border ${achievedBadges.has(b) ? 'bg-meebot-accent/20 border-meebot-accent shadow-lg scale-110' : 'bg-meebot-surface border-meebot-border opacity-20 grayscale'}`}
                        title={t(`badge.desc.${b}`)}
                    >
                        {b === 'quantum' ? '⚛️' : b === 'wisdom' ? '🧠' : '🔗'}
                    </div>
                ))}
            </div>
          </div>

          <button
            onClick={toggleMining}
            className={`relative z-10 w-full py-5 rounded-2xl font-black text-xl transition-all duration-300 transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 overflow-hidden group/btn ${
              isMining 
              ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]" 
              : "bg-meebot-accent hover:bg-meebot-highlight text-white shadow-[0_0_30px_rgba(255,137,6,0.5)]"
            }`}
          >
            <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-3">
                {isMining ? (
                  <><span className="text-2xl">🛑</span> {t("mining.stop")}</>
                ) : (
                  <><span className="text-2xl">⚡</span> {t("mining.start")}</>
                )}
            </span>
          </button>
        </div>

        {/* Right: Mystical Terminal */}
        <div className="bg-black border border-meebot-border rounded-3xl p-8 font-mono text-xs md:text-sm text-green-400 flex flex-col h-[600px] shadow-2xl relative overflow-hidden group/terminal">
          <div className="absolute top-0 left-0 w-full h-10 bg-meebot-surface/50 border-b border-meebot-border flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <span className="ml-3 text-meebot-text-secondary text-[10px] font-black uppercase tracking-widest opacity-50">ritual_miner_v1.exe — [SESSION ACTIVE]</span>
          </div>
          
          <div className="mt-10 flex-1 overflow-y-auto custom-scrollbar space-y-2 opacity-90" ref={logsRef}>
            <div className="text-meebot-text-secondary opacity-40 mb-6 text-[10px] leading-relaxed">
              [SYSTEM] INITIALIZING QUANTUM HARVESTER CORE...<br/>
              [SYSTEM] ALIGNING SPECTRAL RESONANCE WITH VOID LAYER 7... OK<br/>
              [SYSTEM] ANCIENT SCRIPTURES LOADED INTO HEURISTIC BUFFER... OK<br/>
              [SYSTEM] READY TO SYNTHESIZE VACUUM ENERGY.
            </div>
            {logs.map((log, i) => (
              <div key={i} className="animate-fade-in flex gap-3">
                <span className="text-green-800 font-black">❯</span> 
                <span className="flex-1">{log}</span>
              </div>
            ))}
            {isMining && (
              <div className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-1"></div>
            )}
          </div>

          {/* Cyber Sigil Animation */}
          <div className="absolute bottom-8 right-8 w-32 h-32 pointer-events-none opacity-5 transition-opacity group-hover/terminal:opacity-20 duration-1000">
             <div className={`w-full h-full border-[8px] border-t-green-500 border-r-green-500/30 border-b-transparent border-l-transparent rounded-full ${isMining ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}></div>
             <div className="absolute inset-4 border-[4px] border-b-green-400 border-l-green-400/30 border-t-transparent border-r-transparent rounded-full animate-spin-reverse" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
      </div>

      <style>{`
        .drop-shadow-glow { filter: drop-shadow(0 0 10px rgba(255, 137, 6, 0.5)); }
        @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
        }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 197, 94, 0.2); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default MiningPage;