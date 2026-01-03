import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, TranslationContextType } from "../types";

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.genesis": "Genesis Ritual",
    "nav.staking": "Staking Altar",
    "nav.gallery": "NFT Gallery",
    "nav.events": "Oracle Logs",
    "nav.mining": "Void Mining",
    "wallet.connect": "Connect Wallet",
    "wallet.disconnect": "Disconnect",
    "wallet.connecting": "Connecting...",
    "mining.title": "Vacuum Energy Mining",
    "mining.desc": "Channel chaotic vacuum energy from hidden realms to synthesize MCB tokens.",
    "mining.start": "Begin Ritual",
    "mining.stop": "Cease Channeling",
    "mining.hashrate": "Vacuum Energy (MHz)",
    "mining.wisdom": "Wisdom Points",
    "mining.mined": "Mined MCB",
    "mining.status": "Ritual Status",
    "mining.status.active": "Ritual In Progress",
    "mining.status.idle": "Altar Dormant",
    "badge.quantum": "Quantum Initiate",
    "badge.wisdom": "Wisdom Seeker",
    "badge.conduit": "Ritual Conduit",
    "badge.desc.quantum": "First successful vacuum harvest (>1 MHz)",
    "badge.desc.wisdom": "Proven ritual mastery (>0.01 Wisdom)",
    "badge.desc.conduit": "Node and ritual fully synced",
    "genesis.title": "Summon a MeeBot",
    "genesis.desc": "Enter a mystical theme to bring your digital familiar to life.",
    "genesis.placeholder": "e.g., Cyberpunk Monk, Neon Druid...",
    "genesis.button": "Mint MeeBot",
    "staking.title": "Energy Staking",
    "staking.desc": "Lock your MCB tokens to channel energy and earn rewards.",
    "staking.balance": "Staked Balance",
    "staking.rewards": "Earned Rewards",
    "staking.claim": "Claim Rewards",
    "staking.stake": "Stake Tokens",
    "staking.unstake": "Unstake Tokens",
    "gallery.title": "MeeBot Gallery",
    "gallery.subtitle": "A collection of summoned familiars from the void.",
    "events.title": "Real-time Ritual Event Logs",
    "footer.text": "RitualChain © 2025 — Crafted with 🪄⚡🎉",
    "celebration.mint.success": "MeeBot minted successfully!",
    "celebration.mint.fail": "Mint failed. The ritual was interrupted.",
    "celebration.stake.success": "MCB staked successfully!",
    "celebration.stake.fail": "Staking failed.",
    "celebration.unstake.success": "Unstake successful!",
    "celebration.unstake.fail": "Unstake failed.",
    "celebration.claim.success": "MCB Rewards claimed successfully!",
    "celebration.claim.fail": "Claim failed.",
    "dash.welcome": "Welcome, Initiate.",
    "dash.stats": "Network Statistics",
    "banner.wrong_network": "Forbidden Portal Detected",
    "banner.wrong_desc": "You are wandering in the void. Return to RitualChain.",
    "banner.switch": "⚡ Align with RitualChain",
    "banner.switching": "Aligning...",
    "banner.connected": "⚡ Synchronized with RitualChain!"
  },
  th: {
    "nav.dashboard": "แดชบอร์ด",
    "nav.genesis": "พิธีกรรมกำเนิด",
    "nav.staking": "แท่นบูชาฝากเหรียญ",
    "nav.gallery": "แกลเลอรี NFT",
    "nav.events": "บันทึกเทพพยากรณ์",
    "nav.mining": "การขุดพลังงาน",
    "wallet.connect": "เชื่อมต่อกระเป๋า",
    "wallet.disconnect": "ตัดการเชื่อมต่อ",
    "wallet.connecting": "กำลังเชื่อมต่อ...",
    "mining.title": "การขุดพลังงานสุญญากาศ",
    "mining.desc": "รวบรวมพลังงานจากความโกลาหลเพื่อสังเคราะห์เหรียญ MCB",
    "mining.start": "เริ่มพิธีกรรม",
    "mining.stop": "หยุดการรวบรวม",
    "mining.hashrate": "พลังงานสุญญากาศ (MHz)",
    "mining.wisdom": "จุดเชาว์ได้",
    "mining.mined": "เหรียญที่ขุดได้",
    "mining.status": "สถานะพิธีกรรม",
    "mining.status.active": "กำลังประกอบพิธี",
    "mining.status.idle": "แท่นบูชาสงบนิ่ง",
    "badge.quantum": "ผู้เริ่มต้นควอนตัม",
    "badge.wisdom": "ผู้แสวงหาปัญญา",
    "badge.conduit": "สื่อกลางพิธีกรรม",
    "badge.desc.quantum": "เก็บเกี่ยวพลังงานสุญญากาศสำเร็จครั้งแรก (>1 MHz)",
    "badge.desc.wisdom": "พิสูจน์ความเชี่ยวชาญในพิธีกรรม (>0.01 ปัญญา)",
    "badge.desc.conduit": "ซิงค์โหนดและพิธีกรรมสำเร็จสมบูรณ์",
    "genesis.title": "อัญเชิญ MeeBot",
    "genesis.desc": "ใส่ธีมที่ต้องการเพื่อปลุกชีพผู้ช่วยดิจิทัลของคุณ",
    "genesis.placeholder": "เช่น นักบวชไซเบอร์, ดรูอิดแสงนีออน...",
    "genesis.button": "สร้าง MeeBot",
    "staking.title": "ฝากพลังงาน",
    "staking.desc": "ล็อคเหรียญ MCB ของคุณเพื่อรวบรวมพลังงานและรับรางวัล",
    "staking.balance": "ยอดที่ฝากไว้",
    "staking.rewards": "รางวัลที่ได้รับ",
    "staking.claim": "รับรางวัล",
    "staking.stake": "ฝากเหรียญ",
    "staking.unstake": "ถอนเหรียญ",
    "gallery.title": "แกลเลอรี MeeBot",
    "gallery.subtitle": "คอลเลกชันภูตรับใช้ที่ถูกอัญเชิญมาจากความว่างเปล่า",
    "events.title": "บันทึกเหตุการณ์พิธีกรรมแบบเรียลไทม์",
    "footer.text": "RitualChain © 2025 — สร้างสรรค์ด้วยเวทมนตร์ 🪄⚡🎉",
    "celebration.mint.success": "การสร้าง MeeBot สำเร็จ!",
    "celebration.mint.fail": "การสร้าง MeeBot ล้มเหลว พิธีกรรมถูกขัดจังหวะ",
    "celebration.stake.success": "การฝากเหรียญ MCB สำเร็จ!",
    "celebration.stake.fail": "การฝากเหรียญล้มเหลว",
    "celebration.unstake.success": "การถอนเหรียญ MCB สำเร็จ!",
    "celebration.unstake.fail": "การถอนเหรียญล้มเหลว",
    "celebration.claim.success": "รับรางวัล MCB เรียบร้อย!",
    "celebration.claim.fail": "การรับรางวัลล้มเหลว",
    "dash.welcome": "ยินดีต้อนรับ ผู้ศรัทธาใหม่",
    "dash.stats": "สถิติเครือข่าย",
    "banner.wrong_network": "ตรวจพบประตูมิติที่ต้องห้าม",
    "banner.wrong_desc": "คุณกำลังหลงทางในความว่างเปล่า กลับสู่ RitualChain",
    "banner.switch": "⚡ ปรับจูนเข้ากับ RitualChain",
    "banner.switching": "กำลังปรับจูน...",
    "banner.connected": "⚡ เชื่อมต่อกับ RitualChain สำเร็จ!"
  },
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ritual_language');
      return (saved === 'en' || saved === 'th') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ritual_language', language);
    } catch (e) {
      console.warn("Failed to save language preference", e);
    }
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
};