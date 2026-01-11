import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// Define the local RitualChain
// In a real environment, you can switch this to a testnet like Sepolia
export const ritualChain = defineChain({
  id: 13390,
  name: "RitualChain Local",
  nativeCurrency: { name: "MeeChain Coin", symbol: "MCB", decimals: 18 },
  rpcUrls: { 
    // Updated port to 9545 based on latest deployment
    default: { http: ["https://ritual-chain.rpc.replit.app"] } 
  },
  blockExplorers: {
    default: { name: "RitualScan", url: "https://ritual-scan.replit.app" }
  }
});

export const config = getDefaultConfig({
  appName: "RitualChain",
  // You should get a Project ID from WalletConnect Cloud
  projectId: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  chains: [ritualChain],
  ssr: false,
});
