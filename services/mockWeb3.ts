
import { useState, useEffect, useMemo } from 'react';

// This file mocks the behavior of Wagmi hooks so the UI and Celebration logic 
// can be demonstrated without a live Web3 provider or wallet.

// Global state to simulate wallet connection and network state across components
let globalIsConnected = true;
let globalChainId = 1337; 
const accountListeners = new Set<() => void>();
const chainListeners = new Set<() => void>();

export const useAccount = () => {
  const [isConnected, setIsConnected] = useState(globalIsConnected);
  const [address, setAddress] = useState<string | undefined>(globalIsConnected ? "0x71C...9A23" : undefined);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsConnected(globalIsConnected);
      setAddress(globalIsConnected ? "0x71C...9A23" : undefined);
    };
    accountListeners.add(handler);
    return () => { accountListeners.delete(handler); };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    globalIsConnected = true;
    accountListeners.forEach(l => l());
    setIsConnecting(false);
  };

  const disconnect = () => {
    globalIsConnected = false;
    accountListeners.forEach(l => l());
  };

  return { address, isConnected, isConnecting, connect, disconnect };
};

// Added useChainId to fix the missing export error in DebugOverlay.tsx
export const useChainId = () => {
  const [chainId, setChainId] = useState(globalChainId);

  useEffect(() => {
    const handler = () => setChainId(globalChainId);
    chainListeners.add(handler);
    return () => { chainListeners.delete(handler); };
  }, []);

  return chainId;
};

// Added useSwitchChain for consistency with components like NetworkBanner.tsx
export const useSwitchChain = () => {
  const [isPending, setIsPending] = useState(false);
  
  const switchChain = async ({ chainId }: { chainId: number }) => {
     setIsPending(true);
     await new Promise(resolve => setTimeout(resolve, 800)); // Simulate switching delay
     globalChainId = chainId;
     chainListeners.forEach(l => l());
     setIsPending(false);
  };

  return { switchChain, isPending };
};

export const useReadContract = (config: any) => {
  // Simulate reading data
  return { data: 1250n, refetch: () => {} }; 
};

export const useWriteContract = () => {
  const [isPending, setIsPending] = useState(false);

  const writeContractAsync = async (config: any) => {
    setIsPending(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsPending(false);
        // Simulate random success rate for demo purposes (mostly success)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Transaction reverted"));
        }
      }, 1500); // 1.5s delay to simulate blockchain conf
    });
  };

  return { writeContractAsync, isPending };
};

// Mock event watcher with proper listener cleanup and filtering
export const useWatchContractEvent = (config: any) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate an event coming in every few seconds
      if (Math.random() > 0.5) {
        const eventTypes = ['MeeBotMinted', 'Staked', 'RewardClaimed'];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        // Only emit if it matches the listener's requested event name
        if (config.eventName && type !== config.eventName) {
            return;
        }

        let args: any = {};
        if (type === 'MeeBotMinted') {
            args = { tokenId: BigInt(Math.floor(Math.random() * 1000)), prompt: 'Cyberpunk Paladin', minter: '0x71C...9A23' };
        } else if (type === 'Staked') {
            args = { user: '0xAnother...User', amount: BigInt(500) * (10n ** 18n) };
        } else {
            args = { user: '0xWhale...User', reward: BigInt(50) * (10n ** 18n) };
        }

        if (config.onLogs) {
            config.onLogs([{ eventName: type, args }]);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [config.eventName]);
};

export const usePublicClient = () => {
  return useMemo(() => ({
    getLogs: async (args: any) => {
      // Mocked log results
      return Array(5).fill({ args: { tokenId: 1n, prompt: "Summoned Bot", user: "0x71C...9A23", amount: 100n } });
    }
  }), []);
};
