import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../utils/TranslationProvider";
import { useCelebration } from "../context/CelebrationContext";
import { useAccount } from "../services/mockWeb3";
import { CONTRACT_ADDRESSES } from "../constants/addresses";

const MiningPage: React.FC = () => {
  const { t } = useTranslation();
  const { triggerCelebration } = useCelebration();
  const { isConnected, connect } = useAccount();
  
  const [isMining, setIsMining] = useState(false);
  const [minedAmount, setMinedAmount] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
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
        const currentHash = 450 + Math.random() * 100;
        setHashRate(currentHash);
        setMinedAmount(prev => prev + 0.00042);

        if (Math.random() > 0.7) {
          const msgs = [
            "Found share difficulty 1024",
            "Channeling void flux...",
            "Block #88291 accepted",
            "Synthesizing MCB particle...",
            "Ritual resonance stabilized"
          ];
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
        }
      }, 500);
    } else {
      setHashRate(0);
    }

    return () => clearInterval(interval);
  }, [isMining]);

  const toggleMining = async () => {
    if (!isConnected) {
      triggerCelebration("⚠️ Connect Wallet First!");
      await connect();
      return;
    }

    if (!isMining) {
      setIsMining(true);
      triggerCelebration("⛏️ Ritual Started! Mining initiated.");
      setLogs(prev => [`[System] Initializing mining protocol...`, ...prev]);
    } else {
      setIsMining(false);
      setLogs(prev => [`[System] Mining halted.`, ...prev]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="text-center mb-12 animate-slide-in-down">
        <h2 className="text-4xl md:text-5xl font-bold text-meebot-text-primary mb-4 flex justify-center items-center gap-3">
          <span className={isMining ? "animate-spin" : ""}>⛏️</span> {t("mining.title")}
        </h2>
        <p className="text-meebot-text-secondary max-w-lg mx-auto">
          {t("mining.desc")}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          {isMining && (
            <div className="absolute inset-0 bg-meebot-accent/5 z-0">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>
          )}

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-meebot-text-secondary text-sm font-bold uppercase tracking-widest">{t("mining.status")}</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${isMining ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                {isMining ? t("mining.status.active") : t("mining.status.idle")}
              </div>
            </div>

            <div className="mb-8 text-center py-8 border-2 border-dashed border-meebot-border rounded-xl bg-meebot-bg/30">
              <span className="block text-meebot-text-secondary mb-2 text-sm">{t("mining.hashrate")}</span>
              <span className={`text-4xl font-mono font-bold ${isMining ? 'text-meebot-accent' : 'text-meebot-text-secondary'}`}>
                {hashRate.toFixed(2)} <span className="text-lg">MH/s</span>
              </span>
            </div>

            <div className="flex justify-between items-end mb-2">
              <span className="text-meebot-text-secondary text-sm">{t("mining.mined")}</span>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-meebot-border font-mono text-2xl text-white mb-8 flex justify-between items-center">
              <span>{minedAmount.toFixed(6)}</span>
              <span className="text-sm text-meebot-accent font-bold">MCB</span>
            </div>
          </div>

          <button
            onClick={toggleMining}
            className={`relative z-10 w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
              isMining 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
              : "bg-meebot-accent hover:bg-meebot-highlight text-white shadow-[0_0_20px_rgba(255,137,6,0.4)]"
            }`}
          >
            {isMining ? (
              <>🛑 {t("mining.stop")}</>
            ) : (
              <>⚡ {t("mining.start")}</>
            )}
          </button>
        </div>

        <div className="bg-black border border-meebot-border rounded-2xl p-6 font-mono text-xs md:text-sm text-green-400 flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-meebot-surface border-b border-meebot-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-meebot-text-secondary opacity-50">ritual_miner_v1.exe</span>
          </div>
          
          <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar space-y-1 opacity-90" ref={logsRef}>
            <div className="text-meebot-text-secondary opacity-50 mb-4">
              {">"} Connecting to node: wss://ritual-chain.rpc... OK<br/>
              {">"} Loading ancient scriptures... OK<br/>
              {">"} Calibrating spectral sensors... OK<br/>
              {">"} Ready to channel.
            </div>
            {logs.map((log, i) => (
              <div key={i} className="animate-fade-in">
                <span className="text-green-600">{">"}</span> {log}
              </div>
            ))}
            {isMining && (
              <div className="animate-pulse">_</div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 w-24 h-24 pointer-events-none opacity-20">
            <div className={`w-full h-full border-4 border-t-green-500 border-r-green-500/50 border-b-transparent border-l-transparent rounded-full ${isMining ? 'animate-spin' : ''}`}></div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-slide-in-down {
          animation: slideDown 0.8s ease-out forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MiningPage;