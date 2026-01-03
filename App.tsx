import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CelebrationProvider, useCelebration } from "./context/CelebrationContext";
import { TranslationProvider } from "./utils/TranslationProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NetworkBanner from "./components/NetworkBanner";
import DebugOverlay from "./components/DebugOverlay"; 
import DashboardPage from "./pages/DashboardPage";
import GenesisPage from "./pages/GenesisPage";
import StakingPage from "./pages/StakingPage";
import EventLogPage from "./pages/EventLogPage";
import NFTGalleryPage from "./pages/NFTGalleryPage";
import MiningPage from "./pages/MiningPage";

const queryClient = new QueryClient();

const GlobalAura: React.FC = () => {
    const { isCelebrating } = useCelebration();
    return (
        <>
            {/* Ambient Ritual Glow */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-meebot-accent/5 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-meebot-highlight/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Celebration Aura */}
            <div className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 ${isCelebrating ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-meebot-accent/10 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(255,137,6,0.2)]"></div>
            </div>
        </>
    );
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <CelebrationProvider>
          <HashRouter>
            <div className="min-h-screen bg-meebot-bg text-meebot-text-primary flex flex-col font-sans selection:bg-meebot-accent selection:text-white relative overflow-x-hidden">
              <GlobalAura />
              <NetworkBanner />
              <Navbar />
              <main className="container mx-auto px-4 py-6 flex-grow relative z-10">
                <Routes>
                  <Route path="/" element={<Navigate to="/mining" replace />} />
                  <Route path="/mining" element={<MiningPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/genesis" element={<GenesisPage />} />
                  <Route path="/staking" element={<StakingPage />} />
                  <Route path="/gallery" element={<NFTGalleryPage />} />
                  <Route path="/events" element={<EventLogPage />} />
                </Routes>
              </main>
              <Footer />
              <DebugOverlay className="fixed bottom-4 right-4 z-[60]" />
            </div>
          </HashRouter>
        </CelebrationProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export default App;