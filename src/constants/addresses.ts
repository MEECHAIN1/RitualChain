// Addresses exported from the deploy script or environment variables
export const CONTRACT_ADDRESSES = {
  // Use import.meta.env if available (Vite), otherwise fallback to hardcoded local addresses
  // Updated from latest RitualChain deployment ⚡
  MeeBotNFT: (import.meta as any).env?.VITE_NFT_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  MeeBotStaking: (import.meta as any).env?.VITE_STAKING_CONTRACT_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  MeeToken: (import.meta as any).env?.VITE_TOKEN_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  MeeBotMarketplace: (import.meta as any).env?.VITE_MARKETPLACE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
};