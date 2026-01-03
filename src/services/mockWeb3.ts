import { useState, useEffect, useMemo } from 'react';

// This file mocks the behavior of Wagmi hooks so the UI and Celebration logic 
// can be demonstrated without a live Web3 provider or wallet.

// Global state to simulate wallet connection and network state
let globalIsConnected = false;
let globalChainId = 1; // Default to Mainnet (Wrong network) to demonstrate the banner
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

// Mock event watcher
export const useWatchContractEvent = (config: any) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Speed up: Randomly simulate an event coming in every 1.5 seconds
      if (Math.random() > 0.3) {
        const eventTypes = ['MeeBotMinted', 'Staked', 'RewardClaimed', 'Transfer', 'Approval'];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        // CRITICAL FIX: Only emit if it matches the listener's requested event name.
        if (config.eventName && type !== config.eventName) {
            return;
        }

        let args: any = {};
        const randomAddr = () => '0x' + Math.floor(Math.random()*16777215).toString(16).padEnd(6, '0') + '...'+ Math.floor(Math.random()*1000);
        
        if (type === 'MeeBotMinted') {
            const prompts = ['Cyberpunk Paladin', 'Neon Druid', 'Void Walker', 'Solar Cleric', 'Quantum Rogue', 'Mecha Bard'];
            args = { 
                tokenId: BigInt(Math.floor(Math.random() * 2000)), 
                prompt: prompts[Math.floor(Math.random() * prompts.length)], 
                minter: randomAddr()
            };
        } else if (type === 'Staked') {
            args = { 
                user: randomAddr(), 
                amount: BigInt(Math.floor(Math.random() * 1000) * 1000000000000000000) 
            };
        } else if (type === 'RewardClaimed') {
            args = { 
                user: randomAddr(), 
                reward: BigInt(Math.floor(Math.random() * 50) * 1000000000000000000)
            };
        } else if (type === 'Transfer') {
            args = {
                from: randomAddr(),
                to: randomAddr(),
                tokenId: BigInt(Math.floor(Math.random() * 5000))
            };
        } else if (type === 'Approval') {
            args = {
                owner: randomAddr(),
                approved: randomAddr(),
                tokenId: BigInt(Math.floor(Math.random() * 5000))
            };
        }

        if (config.onLogs) {
            config.onLogs([{ eventName: type, args }]);
        }
      }
    }, 1500); // 1.5 seconds for faster updates

    return () => clearInterval(interval);
  }, [config.eventName]);
};

export const usePublicClient = () => {
  // Memoize the client to prevent infinite loops in useEffects that depend on it
  return useMemo(() => ({
    getLogs: async (args: any) => {
      // Mock logs for NFT Mints
      if (args.event && args.event.name === 'MeeBotMinted') {
         return [
            { 
                args: { 
                    tokenId: 101n, 
                    prompt: "Neon Cyber Paladin", 
                    minter: "0x71C...9A23" 
                } 
            },
            { 
                args: { 
                    tokenId: 102n, 
                    prompt: "Void Walker", 
                    minter: "0x71C...9A23" 
                } 
            },
            { 
                args: { 
                    tokenId: 103n, 
                    prompt: "ipfs://QmFakeHashForDemo", // Will use fallback
                    minter: "0x71C...9A23" 
                } 
            },
         ];
      }
      return Array(2).fill({ args: { user: "0x...", amount: 100n } });
    }
  }), []);
};