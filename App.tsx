import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CelebrationProvider } from "./context/CelebrationContext";
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

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <CelebrationProvider>
          <HashRouter>
            <div className="min-h-screen bg-meebot-bg text-meebot-text-primary flex flex-col font-sans selection:bg-meebot-accent selection:text-white relative overflow-x-hidden">
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