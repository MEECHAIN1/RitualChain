import React, { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "../services/mockWeb3";
import { parseUnits, formatUnits } from "viem";
import { MeeBotStakingAbi } from "../abi/MeeBotStaking";
import { ERC20Abi } from "../abi/ERC20";
import { CONTRACT_ADDRESSES } from "../constants/addresses"; // Explicit relative import
import { useCelebration } from "../context/CelebrationContext";
import { useTranslation } from "../utils/TranslationProvider";
import { playStakeSound, playUnstakeSound, playClaimSound } from "../utils/sounds";

type TxStatus = 'idle' | 'pending' | 'success' | 'error';

const StakingPage: React.FC = () => {
  const { address } = useAccount();
  const { triggerCelebration } = useCelebration();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const [amount, setAmount] = useState("");
  const { t } = useTranslation();
  
  // Local status tracking
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [statusMsg, setStatusMsg] = useState("");

  // Read Staked Balance
  const { data: balanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Read Rewards
  const { data: rewardsData } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    functionName: "earnedRewards",
    args: address ? [address] : undefined,
  });

  // Read Allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeToken as `0x${string}`,
    abi: ERC20Abi,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.MeeBotStaking] : undefined,
  });

  const stakedBalance = balanceData ? formatUnits(balanceData as bigint, 18) : "0";
  const rewards = rewardsData ? formatUnits(rewardsData as bigint, 18) : "0";
  const currentAllowance = allowanceData as bigint || BigInt(0);

  const handleClaim = async () => {
    setTxStatus('pending');
    setStatusMsg("Claiming rewards...");
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
        abi: MeeBotStakingAbi,
        functionName: "claimRewards",
      });
      playClaimSound();
      setTxStatus('success');
      setStatusMsg("Rewards claimed successfully!");
      triggerCelebration(t("celebration.claim.success"));
    } catch (e: any) {
      setTxStatus('error');
      setStatusMsg(e.message || "Claim failed");
      triggerCelebration(t("celebration.claim.fail"));
    }
  };

  const handleStake = async () => {
    if(!amount) return;
    setTxStatus('pending');
    setStatusMsg("Initializing staking ritual...");
    try {
        const amountWei = parseUnits(amount, 18);
        
        // Check Allowance
        if (currentAllowance < amountWei) {
            setStatusMsg("Approving MCB tokens...");
            triggerCelebration("⏳ Approving MCB tokens...");
            await writeContractAsync({
                address: CONTRACT_ADDRESSES.MeeToken as `0x${string}`,
                abi: ERC20Abi,
                functionName: "approve",
                args: [CONTRACT_ADDRESSES.MeeBotStaking, amountWei],
            });
             triggerCelebration("✅ Approved! Click Stake again.");
             setStatusMsg("Approval successful. Ready to stake.");
             setTxStatus('success');
             refetchAllowance();
             return;
        }

        await writeContractAsync({
            address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
            abi: MeeBotStakingAbi,
            functionName: "stake",
            args: [amountWei]
        });
        playStakeSound();
        setTxStatus('success');
        setStatusMsg(`${amount} MCB staked successfully!`);
        triggerCelebration(t("celebration.stake.success"));
        setAmount("");
    } catch (e: any) {
        console.error(e);
        setTxStatus('error');
        setStatusMsg(e.message || "Staking failed");
        triggerCelebration(t("celebration.stake.fail"));
    }
  }

  const handleUnstake = async () => {
      if(!amount) return;
      setTxStatus('pending');
      setStatusMsg("Withdrawing energy...");
      try {
        await writeContractAsync({
            address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
            abi: MeeBotStakingAbi,
            functionName: "unstake",
            args: [parseUnits(amount, 18)]
        });
        playUnstakeSound();
        setTxStatus('success');
        setStatusMsg(`${amount} MCB unstaked successfully!`);
        triggerCelebration(t("celebration.unstake.success"));
        setAmount("");
      } catch (e: any) {
        setTxStatus('error');
        setStatusMsg(e.message || "Unstake failed");
        triggerCelebration(t("celebration.unstake.fail"));
      }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 grid md:grid-cols-2 gap-8 px-4">
      {/* Rewards Panel */}
      <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-xl">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-meebot-accent to-transparent"></div>
         <div>
             <h2 className="text-2xl font-bold text-meebot-accent mb-1 flex items-center gap-2">
                <span>⚡</span> {t("staking.rewards")}
             </h2>
             <p className="text-meebot-text-secondary text-sm">Accumulated energy from your rituals</p>
         </div>
         
         <div className="my-8 text-center relative">
             <div className="absolute inset-0 bg-meebot-accent/5 blur-3xl rounded-full"></div>
             <span className="relative text-5xl font-mono font-bold text-white block tracking-tighter drop-shadow-glow">
                {Number(rewards).toFixed(4)}
             </span>
             <span className="relative text-meebot-accent text-sm font-bold tracking-widest uppercase">MCB Tokens</span>
         </div>
         
         <div className="mb-4 text-center bg-meebot-bg/30 p-4 rounded-xl border border-meebot-border/50">
            <p className="text-xs text-meebot-text-secondary uppercase tracking-widest font-bold mb-1">{t("staking.balance")}</p>
            <p className="text-2xl font-mono text-white">{Number(stakedBalance).toFixed(4)} <span className="text-xs opacity-50">MCB</span></p>
         </div>

         <button 
            onClick={handleClaim} 
            disabled={isWritePending}
            className="w-full bg-meebot-accent/10 border border-meebot-accent text-meebot-accent hover:bg-meebot-accent hover:text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-[0.98] disabled:opacity-50"
         >
            {isWritePending && txStatus === 'pending' ? "Channeling..." : t("staking.claim")}
         </button>
      </div>

      {/* Action Panel */}
      <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8 shadow-xl flex flex-col h-full">
        <h2 className="text-2xl font-bold text-meebot-text-primary mb-6 flex items-center gap-2">
            <span>🪄</span> {t("staking.title")}
        </h2>
        
        <div className="space-y-6 flex-grow">
            <div>
                <label className="block text-sm font-medium text-meebot-text-secondary mb-2">Amount to Stake/Unstake</label>
                <div className="relative group">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            if (txStatus !== 'pending') setTxStatus('idle');
                        }}
                        placeholder="0.00"
                        className="w-full bg-meebot-bg border border-meebot-border rounded-xl pl-4 pr-16 py-4 text-meebot-text-primary focus:outline-none focus:border-meebot-accent transition-all text-right font-mono text-xl group-hover:border-meebot-border/80"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-meebot-text-secondary font-bold text-xs uppercase tracking-tighter pointer-events-none">Input Amount</span>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-meebot-accent font-black text-sm pointer-events-none">MCB</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={handleStake}
                    disabled={isWritePending || !amount}
                    className="bg-meebot-text-primary text-meebot-bg py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                    {t("staking.stake")}
                </button>
                <button 
                    onClick={handleUnstake}
                    disabled={isWritePending || !amount}
                    className="border border-meebot-border text-meebot-text-secondary py-4 rounded-xl font-black uppercase tracking-widest hover:border-meebot-text-secondary hover:text-meebot-text-primary transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {t("staking.unstake")}
                </button>
            </div>
        </div>

        {/* Transaction Status Area */}
        {txStatus !== 'idle' && (
            <div className={`mt-8 p-4 rounded-xl border animate-ritual-reveal flex items-center gap-4 transition-all duration-500 ${
                txStatus === 'pending' ? 'bg-meebot-accent/5 border-meebot-accent/30 text-meebot-accent' :
                txStatus === 'success' ? 'bg-green-500/5 border-green-500/30 text-green-400' :
                'bg-red-500/5 border-red-500/30 text-red-400'
            }`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-current/10 flex items-center justify-center">
                    {txStatus === 'pending' ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                    ) : txStatus === 'success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Ritual Status</p>
                    <p className="text-sm font-medium truncate">{statusMsg}</p>
                </div>
                <button 
                    onClick={() => setTxStatus('idle')}
                    className="text-current opacity-40 hover:opacity-100 transition-opacity"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )}
      </div>

      <style>{`
        .drop-shadow-glow { filter: drop-shadow(0 0 10px rgba(255, 137, 6, 0.4)); }
      `}</style>
    </div>
  );
};

export default StakingPage;