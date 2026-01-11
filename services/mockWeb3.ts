import { useState, useEffect, useMemo } from 'react';

// This file mocks the behavior of Wagmi hooks so the UI and Celebration logic 
// can be demonstrated without a live Web3 provider or wallet.

let globalIsConnected = false;
let globalChainId = 13390; // Start on Ethereum Mainnet by default for the "Wrong Network" demo
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
    await new Promise(resolve => setTimeout(resolve, 800)); 
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

export const useChainId = () => {
  const [chainId, setChainId] = useState(globalChainId);

  useEffect(() => {
    const handler = () => setChainId(globalChainId);
    chainListeners.add(handler);
    return () => { chainListeners.delete(handler); };
  }, []);

  return chainId;
};

export const useSwitchChain = () => {
  const [isPending, setIsPending] = useState(false);
  
  const switchChain = async ({ chainId }: { chainId: number }) => {
     setIsPending(true);
     await new Promise(resolve => setTimeout(resolve, 1200)); 
     globalChainId = chainId;
     chainListeners.forEach(l => l());
     setIsPending(false);
  };

  return { switchChain, isPending };
};

export const useReadContract = (config: any) => {
  return { data: 1250n, refetch: () => {} }; 
};

export const useWriteContract = () => {
  const [isPending, setIsPending] = useState(false);

  const writeContractAsync = async (config: any) => {
    setIsPending(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsPending(false);
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error("Transaction reverted"));
        }
      }, 1500); 
    });
  };

  return { writeContractAsync, isPending };
};

export const useWatchContractEvent = (config: any) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const eventTypes = ['MeeBotMinted', 'Staked', 'RewardClaimed'];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        if (config.eventName && type !== config.eventName) {
            return;
        }

        let args: any = {};
        const randomAddr = () => '0x' + Math.floor(Math.random()*16777215).toString(16).padEnd(6, '0') + '...'+ Math.floor(Math.random()*1000);
        
        if (type === 'MeeBotMinted') {
            const prompts = ['Cyberpunk Paladin', 'Neon Druid', 'Void Walker'];
            args = { 
                tokenId: BigInt(Math.floor(Math.random() * 2000)), 
                prompt: prompts[Math.floor(Math.random() * prompts.length)], 
                minter: randomAddr()
            };
        } else if (type === 'Staked') {
            args = { 
                user: randomAddr(), 
                amount: BigInt(Math.floor(Math.random() * 1000) * 1e18) 
            };
        } else if (type === 'RewardClaimed') {
            args = { 
                user: randomAddr(), 
                reward: BigInt(Math.floor(Math.random() * 50) * 1e18)
            };
        }

        if (config.onLogs) {
            config.onLogs([{ eventName: type, args }]);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [config.eventName]);
};

export const usePublicClient = () => {
  return useMemo(() => ({
    getLogs: async (args: any) => {
      return [];
    }
  }), []);
};