import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChainId, useAccount } from "../services/mockWeb3";
import { CONTRACT_ADDRESSES } from "../constants/addresses";

interface DebugProps {
  file?: File | null;
  events?: any[];
  extra?: Record<string, any>;
  className?: string;
}

const DebugOverlay: React.FC<DebugProps> = ({ file, events, extra, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const location = useLocation();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`${className || "fixed bottom-4 right-4"} bg-black text-green-400 border border-green-500/50 px-3 py-1.5 rounded-md text-xs font-mono z-[9999] animate-pulse`}
      >
        🐞 DEBUG
      </button>
    );
  }

  return (
    <div className={`${className || "fixed bottom-4 right-4"} bg-black/95 text-green-400 border border-green-500 rounded-lg z-[9999] font-mono text-[10px] w-72 shadow-2xl p-3`}>
      <div className="flex justify-between border-b border-green-500/30 pb-2 mb-2">
        <span className="font-bold">SYSTEM STATE</span>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between"><span>Route:</span><span>{location.pathname}</span></div>
        <div className="flex justify-between"><span>Chain ID:</span><span>{chainId}</span></div>
        <div className="flex justify-between"><span>Wallet:</span><span>{isConnected ? "Connected" : "Disconnected"}</span></div>
        {isConnected && <div className="truncate opacity-70">{address}</div>}
        <div className="pt-2 border-t border-green-500/10">
          <p className="text-[9px] opacity-50">CONTRACTS</p>
          <div className="truncate text-[9px]">{CONTRACT_ADDRESSES.MeeBotNFT}</div>
          <div className="truncate text-[9px]">{CONTRACT_ADDRESSES.MeeBotStaking}</div>
        </div>
        {extra && Object.entries(extra).map(([k, v]) => <div key={k} className="flex justify-between"><span>{k}:</span><span>{String(v)}</span></div>)}
      </div>
    </div>
  );
};

export default DebugOverlay;