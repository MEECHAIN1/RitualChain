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

  // If the user is on the correct network, reset dismiss state and hide banner
  useEffect(() => {
    if (chainId === ritualChain.id) {
      setIsDismissed(false);
    }
  }, [chainId]);

  // If connected to RitualChain (1337) or user dismissed it, do not show
  if (chainId === ritualChain.id || isDismissed) {
    return null;
  }

  const handleSwitch = async () => {
    try {
        await switchChain({ chainId: ritualChain.id });
        triggerCelebration(t("banner.connected") || "⚡ Connected to RitualChain!");
    } catch (e) {
        console.error("Failed to switch chain", e);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100] p-4 animate-slide-down pointer-events-none">
      <div className="container mx-auto max-w-4xl pointer-events-auto">
        <div className="bg-gradient-to-r from-red-600/90 via-meebot-highlight/90 to-red-700/90 border border-white/20 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] overflow-hidden relative group">
          
          {/* Decorative animated highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-white blur-lg opacity-20 animate-pulse"></div>
                    <div className="relative w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl shadow-inner backdrop-blur-md">
                        🚧
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-white text-lg tracking-wide flex items-center justify-center md:justify-start gap-2">
                        {t("banner.wrong_network") || "Wrong Network Detected"}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                        {t("banner.wrong_desc") || "You are currently in the void. Return to RitualChain to perform rituals."}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleSwitch}
                  disabled={isPending}
                  className="flex-1 md:flex-none px-6 py-3 bg-white text-red-600 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                      <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          {t("banner.switching") || "Switching..."}
                      </>
                  ) : (
                      <>
                         ⚡ {t("banner.switch") || "Switch Network"}
                      </>
                  )}
                </button>

                <button 
                  onClick={() => setIsDismissed(true)}
                  className="p-3 rounded-xl bg-black/20 text-white hover:bg-black/40 transition-colors border border-white/10"
                  aria-label="Dismiss warning"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slide-down {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
            animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default NetworkBanner;