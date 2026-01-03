import React, { useState, useEffect, useRef } from "react";
import { useWatchContractEvent } from "../services/mockWeb3";
import { formatUnits } from "viem";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";
import { MeeBotStakingAbi } from "../abi/MeeBotStaking";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { useCelebration } from "../context/CelebrationContext";

interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  icon: string;
  args: any;
  hash: string;
}

const EventLogPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { triggerCelebration } = useCelebration();

  const addLog = (event: string, icon: string, args: any) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      event,
      icon,
      args,
      hash: "0x" + Math.random().toString(16).substr(2, 40)
    };
    setLogs((prev) => [...prev.slice(-49), newLog]);
    if (['MeeBotMinted', 'RewardClaimed'].includes(event)) {
        triggerCelebration(`${icon} New ${event}!`);
    }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
    abi: MeeBotNFTAbi,
    eventName: "MeeBotMinted",
    onLogs(events: any[]) {
      events.forEach(e => addLog("MeeBotMinted", "🪄", { tokenId: e.args.tokenId?.toString(), prompt: e.args.prompt }));
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    eventName: "Staked",
    onLogs(events: any[]) {
      events.forEach(e => addLog("Staked", "🥩", { user: e.args.user, amount: formatUnits(e.args.amount || 0n, 18) + " MCB" }));
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-8 h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-meebot-text-primary">✨ Oracle Logs</h1>
        <span className="text-xs font-mono animate-pulse text-green-400">● LIVE</span>
      </div>
      <div className="flex-1 bg-black/90 border border-meebot-border rounded-xl p-4 overflow-y-auto font-mono text-sm custom-scrollbar">
        {logs.length === 0 && <p className="opacity-30 italic">Waiting for blockchain rituals...</p>}
        {logs.map((log) => (
            <div key={log.id} className="py-1 border-b border-white/5 flex gap-3">
                <span className="opacity-40">[{log.timestamp}]</span>
                <span className="text-meebot-accent font-bold">{log.icon} {log.event}</span>
                <span className="text-meebot-text-secondary truncate">{JSON.stringify(log.args)}</span>
            </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default EventLogPage;