import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../../utils/TranslationProvider";
import { useAccount } from "../services/mockWeb3";
import { useCelebration } from "../services/context/CelebrationContext";


const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const { address, isConnected, isConnecting, connect, disconnect } = useAccount();
  const { triggerCelebration } = useCelebration();

  const isActive = (path: string) => location.pathname === path;

  const handleConnect = async () => {
    if (isConnected) {
        disconnect();
    } else {
        await connect();
        triggerCelebration("⚡ Wallet Connected!");
    }
  };

  const navLinks = [
    { path: "/mining", label: "nav.mining", icon: "⛏️" },
    { path: "/dashboard", label: "nav.dashboard", icon: "🔮" },
    { path: "/genesis", label: "nav.genesis", icon: "🪄" },
    { path: "/staking", label: "nav.staking", icon: "⚡" },
    { path: "/gallery", label: "nav.gallery", icon: "🖼️" },
    { path: "/events", label: "nav.events", icon: "📜" }
  ];

  return (
    <nav className="sticky top-0 z-30 bg-meebot-surface/80 backdrop-blur-lg border-b border-meebot-border shadow-lg">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-meebot-accent to-meebot-highlight flex items-center justify-center group-hover:animate-spin">
            <span className="text-white font-bold">⚡</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-meebot-text-primary to-meebot-accent">
            RitualChain
          </h1>
        </Link>
        
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <ul className="hidden lg:flex gap-1 bg-meebot-bg/50 p-1 rounded-full border border-meebot-border">
            {navLinks.map((link) => (
                <li key={link.path}>
                    <Link 
                        to={link.path}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            isActive(link.path) 
                            ? "bg-meebot-accent text-white shadow-[0_0_10px_rgba(255,137,6,0.4)]" 
                            : "text-meebot-text-secondary hover:text-white hover:bg-meebot-surface"
                        }`}
                    >
                        <span>{link.icon}</span>
                        {t(link.label)}
                    </Link>
                </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2 border ${
                    isConnected 
                    ? "bg-meebot-surface border-meebot-accent text-meebot-accent hover:bg-red-900/50 hover:border-red-500 hover:text-red-400" 
                    : "bg-meebot-accent text-white border-transparent hover:bg-meebot-highlight shadow-[0_0_15px_rgba(255,137,6,0.3)]"
                }`}
            >
                {isConnecting ? (
                    <>
                        <span className="animate-spin">⏳</span> {t("wallet.connecting")}
                    </>
                ) : isConnected ? (
                    <>
                        <span>👛</span> {address?.substring(0, 6)}...{address?.slice(-4)}
                    </>
                ) : (
                    <>
                        <span>🔗</span> {t("wallet.connect")}
                    </>
                )}
            </button>
            
            <button 
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className="w-10 h-10 rounded-full border border-meebot-border flex items-center justify-center text-meebot-text-secondary hover:text-white hover:border-meebot-accent transition-colors"
            >
                {language === 'en' ? '🇺🇸' : '🇹🇭'}
            </button>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex justify-center py-2 border-t border-meebot-border/50">
        <div className="flex gap-4 flex-wrap justify-center">
             {[
                { path: "/dashboard", label: "Dash" },
                { path: "/mining", label: "Mine" },
                { path: "/genesis", label: "Mint" },
                { path: "/staking", label: "Stake" },
                { path: "/events", label: "Logs" }
            ].map((link) => (
                <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm ${isActive(link.path) ? "text-meebot-accent" : "text-meebot-text-secondary"}`}
                >
                    {link.label}
                </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;