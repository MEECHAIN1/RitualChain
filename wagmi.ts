import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// Define the RitualChain (MeeChain) ⚡
export const ritualChain = defineChain({
  id: 1337,
  name: "RitualChain Local",
  nativeCurrency: { name: "MeeBot Coin", symbol: "MCB", decimals: 18 },
  rpcUrls: { 
    default: { http: [(import.meta as any).env?.VITE_RPC_URL || "http://127.0.0.1:9545"] } 
  },
  blockExplorers: {
    default: { name: "RitualScan", url: "http://localhost:9545/explorer" }
  }
});

// Supported chains for the Altar
export const config = getDefaultConfig({
  appName: "RitualChain",
  projectId: (import.meta as any).env?.WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [ritualChain],
  ssr: false,
});