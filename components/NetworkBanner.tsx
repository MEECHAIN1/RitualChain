import React, { useState, useEffect } from "react";
import { useChainId, useSwitchChain } from "../services/mockWeb3";
import { ritualChain } from "../wagmi";
import { useCelebration } from "../context/CelebrationContext";
import { useTranslation } from "../utils/TranslationProvider";

const NetworkBanner: React.FC = () => {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { triggerCelebration } = useCelebration();
  const { t } = useTranslation();
  
  const [isDismissed, setIsDismissed] = useState(false);

  // Auto-reveal if the chain changes to a wrong one after previously being correct
  useEffect(() => {
    if (chainId !== ritualChain.id) {
      setIsDismissed(false);
    }
  }, [chainId]);

  if (chainId === ritualChain.id || isDismissed) {
    return null;
  }

  const handleSwitch = async () => {
    try {
        await switchChain({ chainId: ritualChain.id });
        // The celebration will be triggered once the chainId state updates and is captured by useChainId
        triggerCelebration("Ritual synchronization complete.", "connect");
    } catch (e) {
        console.error("Failed to switch network", e);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100] p-4 animate-slide-down pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="bg-gradient-to-r from-red-600/90 via-meebot-highlight/90 to-red-900/90 border border-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(220,38,38,0.5)] overflow-hidden relative group transition-all duration-500">
          
          {/* Animated Glow Backlight */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="absolute inset-0 bg-white blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative w-14 h-14 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center text-3xl shadow-2xl backdrop-blur-md transform -rotate-3 group-hover:rotate-0 transition-transform">
                        🔮
                    </div>
                </div>
                <div className="text-center md:text-left text-white">
                    <h3 className="font-black text-xl tracking-tight leading-none mb-1">{t("banner.wrong_network")}</h3>
                    <p className="text-white/70 text-sm font-medium leading-tight max-w-sm">{t("banner.wrong_desc")}</p>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  onClick={handleSwitch}
                  disabled={isPending}
                  className="relative group/btn flex-1 md:flex-none px-8 py-3 bg-white text-red-600 rounded-2xl font-black text-sm uppercase tracking-[0.1em] shadow-[0_10px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.4)] transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPending ? (
                      <><span className="animate-spin text-lg">⏳</span> {t("banner.switching")}</>
                    ) : (
                      <>⚡ {t("banner.switch")}</>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-red-50 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
                
                <button 
                  onClick={() => setIsDismissed(true)}
                  className="p-4 rounded-2xl bg-black/30 text-white/50 hover:text-white hover:bg-black/50 border border-white/5 transition-all group/close"
                  title="Dismiss temporarily"
                >
                  <svg className="w-5 h-5 group-hover/close:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>

          {/* Bottom Shimmer Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full overflow-hidden">
            <div className="h-full bg-white w-1/3 animate-shimmer-fast"></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer-fast {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
        }
        .animate-shimmer-fast {
            animation: shimmer-fast 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default NetworkBanner;