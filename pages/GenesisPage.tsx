import React, { useState, useRef, useEffect } from "react";
import { useWriteContract } from "../services/mockWeb3";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";
import { CONTRACT_ADDRESSES } from "../constants/addresses"; 
import { useCelebration } from "../context/CelebrationContext";
import { useTranslation } from "../utils/TranslationProvider";
import { uploadToIPFS, uploadJSONToIPFS } from "../utils/ipfs";
import { playMintSound } from "../utils/sounds";
import DebugOverlay from "../components/DebugOverlay"; 

const GenesisPage: React.FC = () => {
  const { triggerCelebration } = useCelebration();
  const { writeContractAsync, isPending } = useWriteContract();
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mintedBot, setMintedBot] = useState<{name: string, image: string, desc: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleMint = async () => {
    if (!prompt) return;
    setMintedBot(null);
    setIsUploading(true);

    try {
      let tokenUri = prompt;
      let finalImageUrl = "";

      if (file) {
        triggerCelebration("📤 Uploading image to IPFS...");
        const imageUri = await uploadToIPFS(file);
        finalImageUrl = imageUri.replace("ipfs://", "https://aquamarine-rainy-dinosaur-738.mypinata.cloud/ipfs/");

        triggerCelebration("🧾 Generating metadata...");
        const metadata = {
          name: `MeeBot: ${prompt}`,
          description: "Mystical MeeBot born from the RitualChain.",
          image: imageUri,
          attributes: [{ trait_type: "Theme", value: prompt }, { trait_type: "Ritual", value: "Genesis" }],
        };

        tokenUri = await uploadJSONToIPFS(metadata);
      } else {
        finalImageUrl = `https://placehold.co/400x400/23212d/f25f4c?text=${encodeURIComponent(prompt.substring(0, 10))}`;
      }

      await writeContractAsync({
        address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
        abi: MeeBotNFTAbi,
        functionName: "mintMeeBot",
        args: [tokenUri], 
      });
      
      playMintSound();
      triggerCelebration(t("celebration.mint.success"));
      setMintedBot({ name: `MeeBot: ${prompt}`, image: finalImageUrl, desc: "Summoned successfully from the void." });
      setPrompt("");
      setFile(null);
      setPreviewUrl(null);
    } catch (e: any) {
      console.error(e);
      triggerCelebration(t("celebration.mint.fail") + (e.message ? ` (${e.message})` : ""));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const isLoading = isPending || isUploading;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative">
      <DebugOverlay className="absolute top-0 right-0 z-50" file={file} extra={{ isUploading, hasPreview: !!previewUrl }} />
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8 shadow-2xl animate-slide-in-left">
            <h2 className="text-3xl font-bold text-meebot-text-primary mb-2 flex items-center gap-3"><span>🪄</span> {t("genesis.title")}</h2>
            <p className="text-meebot-text-secondary mb-8">{t("genesis.desc")}</p>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-meebot-text-secondary mb-2">Theme Prompt</label>
                    <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t("genesis.placeholder")} disabled={isLoading} className="w-full bg-meebot-bg border border-meebot-border rounded-lg px-4 py-3 text-meebot-text-primary focus:outline-none focus:border-meebot-highlight disabled:opacity-50" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-meebot-text-secondary mb-2">Image (Optional)</label>
                    <div onClick={() => !isLoading && fileInputRef.current?.click()} className={`w-full border-2 border-dashed rounded-lg p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-meebot-highlight/50 ${file ? 'border-meebot-accent' : 'border-meebot-border'}`}>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        {previewUrl ? <img src={previewUrl} className="w-full h-48 object-cover rounded-lg" alt="Preview" /> : <div className="py-10 text-center text-meebot-text-secondary">📤 Click to upload</div>}
                    </div>
                </div>
                <button onClick={handleMint} disabled={isLoading || !prompt} className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-meebot-highlight to-orange-600 text-white disabled:opacity-50">
                    {isUploading ? "Uploading..." : isPending ? "Summoning..." : t("genesis.button")}
                </button>
            </div>
        </div>
        <div className="relative aspect-[3/4] border-2 border-meebot-border rounded-2xl overflow-hidden bg-meebot-bg/30">
            {mintedBot ? (
                <div className="h-full flex flex-col animate-float">
                    <img src={mintedBot.image} className="flex-1 object-cover" alt="Minted" />
                    <div className="p-6 bg-meebot-surface">
                        <h3 className="text-2xl font-bold text-white">{mintedBot.name}</h3>
                        <p className="text-meebot-text-secondary text-sm">{mintedBot.desc}</p>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-meebot-text-secondary opacity-30">
                    <span className="text-6xl mb-4">🔮</span>
                    <p>Altar is waiting...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GenesisPage;