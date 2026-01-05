export type Language = 'en' | 'th';

export interface MeeBot {
  tokenId: string;
  name: string;
  description: string;
  image: string;
}

export interface CelebrationContextType {
  triggerCelebration: (message: string, type?: 'mint' | 'stake' | 'unstake' | 'claim' | 'connect' | 'generic') => void;
  isCelebrating: boolean;
}

export interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface ContractEvent {
  message: string;
  timestamp: Date;
  type: 'mint' | 'stake' | 'unstake' | 'claim';
}