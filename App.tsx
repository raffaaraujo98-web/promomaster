
import React, { useState } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import ResultDisplay from './components/ResultDisplay';
import AffiliateGrid from './components/AffiliateGrid';
import AffiliateModal from './components/AffiliateModal';
import VideoGrid, { VideoCardConfig, veoViralCards, studioProCards } from './components/VideoGrid';
import VideoModal from './components/VideoModal';
import { PromptFormData, TargetModel, PromptTone, PromptLanguage, GeneratedResult, AffiliateMode, AffiliateRole, RegionalAccent } from './types';
import { generateOptimizedPrompt } from './services/geminiService';
import { AlertCircle, PenTool, ShoppingBag, Video, Clapperboard, Image as ImageIcon, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'creator' | 'affiliate' | 'video'>('creator');
  
  // Video Sub-Navigation State: 'veo_viral' | 'studio_pro' | 'creator'
  const [videoSubTab, setVideoSubTab] = useState<'veo_viral' | 'studio_pro' | 'creator'>('veo_viral');

  // General Creator State
  const [formData, setFormData] = useState<PromptFormData>({
    topic: '',
    context: '',
    targetModel: TargetModel.CHATGPT,
    tone: PromptTone.PROFESSIONAL,
    language: PromptLanguage.PORTUGUESE,
    constraints: ''
  });

  // Affiliate State
  const [affiliateModalOpen, setAffiliateModalOpen] = useState(false);
  const [selectedAffiliateMode, setSelectedAffiliateMode] = useState<AffiliateMode | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productObjection, setProductObjection] = useState('');
  const [affiliateRole, setAffiliateRole] = useState<AffiliateRole>(AffiliateRole.FRIEND_TO_FRIEND);
  const [regionalAccent, setRegionalAccent] = useState<RegionalAccent>(RegionalAccent.NEUTRAL);

  // Video State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoConfig, setSelectedVideoConfig] = useState<VideoCardConfig | null>(null);

  // Shared State
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleCreatorSubmit = async () => {
    if (!formData.topic) return;
    executeGeneration({ ...formData, isAffiliate: false, isVideo: false });
  };

  const handleAffiliateSubmit = async () => {
    if (!productName || !selectedAffiliateMode) return;
    setAffiliateModalOpen(false);
    executeGeneration({
      ...formData,
      isAffiliate: true,
      isVideo: false,
      affiliateMode: selectedAffiliateMode,
      productName,
      productPrice,
      productObjection,
      affiliateRole,
      regionalAccent,
      targetModel: TargetModel.CHATGPT
    });
  };

  const handleVideoSubmit = async (inputs: Record<string, string>, goal: 'image' | 'video', speech?: string, sceneCount?: number, refUrl?: string) => {
    if (!selectedVideoConfig) return;
    setVideoModalOpen(false);
    executeGeneration({
      ...formData,
      isAffiliate: false,
      isVideo: true,
      videoMode: selectedVideoConfig.mode,
      videoInputs: inputs,
      videoGoal: goal,
      videoSpeech: speech,
      videoSceneCount: sceneCount,
      videoRefUrl: refUrl,
      targetModel: TargetModel.GEMINI
    });
  };

  const executeGeneration = async (data: PromptFormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const resultData = await generateOptimizedPrompt(data);
      setResult(resultData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar o conteúdo.");
    } finally {
      setIsLoading(false);
    }
  };

  const openAffiliateModal = (mode: AffiliateMode) => {
    setSelectedAffiliateMode(mode);
    setProductName('');
    setProductPrice('');
    setProductObjection('');
    setAffiliateRole(AffiliateRole.FRIEND_TO_FRIEND);
    setRegionalAccent(RegionalAccent.NEUTRAL);
    setAffiliateModalOpen(true);
  };

  const openVideoModal = (config: VideoCardConfig) => {
    setSelectedVideoConfig(config);
    setVideoModalOpen(true);
  };

  const getLoadingMessage = () => {
    if (activeTab === 'affiliate') return 'Escrevendo seu conteúdo viral...';
    if (activeTab === 'video') return 'Gerando prompt técnico em Inglês...';
    return 'Engenhando seu prompt...';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <Header />
      
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Main Navigation Tabs */}
        <div className="flex justify-center mb-4">
          <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex gap-1 flex-wrap justify-center shadow-2xl">
            <button
              onClick={() => { setActiveTab('creator'); setResult(null); setError(null); }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'creator' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Criador Livre
            </button>
            <button
              onClick={() => { setActiveTab('affiliate'); setResult(null); setError(null); }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'affiliate' 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Afiliado Pro
            </button>
            <button
              onClick={() => { setActiveTab('video'); setResult(null); setError(null); }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'video' 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              VEO & Vídeo
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Input Area */}
          <section className="w-full lg:w-5/12 flex-shrink-0">
            {activeTab === 'creator' && (
              <PromptForm 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleCreatorSubmit}
                isLoading={isLoading}
              />
            )}
            
            {activeTab === 'affiliate' && (
              <AffiliateGrid onSelectMode={openAffiliateModal} />
            )}
            
            {activeTab === 'video' && (
               <div className="space-y-6">
                 {/* Video Sub-Navigation */}
                 <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 shadow-xl">
                   <button
                     onClick={() => setVideoSubTab('veo_viral')}
                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-md transition-all ${
                       videoSubTab === 'veo_viral' 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                     }`}
                   >
                     <Clapperboard className="w-3.5 h-3.5" /> 🔥 VEO Virais
                   </button>
                   <button
                     onClick={() => setVideoSubTab('studio_pro')}
                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-md transition-all ${
                       videoSubTab === 'studio_pro' 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                     }`}
                   >
                     <ImageIcon className="w-3.5 h-3.5" /> 📸 Estúdio Pro
                   </button>
                   <button
                     onClick={() => setVideoSubTab('creator')}
                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-md transition-all ${
                       videoSubTab === 'creator' 
                        ? 'bg-slate-700 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                     }`}
                   >
                     <Wand2 className="w-3.5 h-3.5" /> Criador Smart
                   </button>
                 </div>

                 {/* Video Content */}
                 {videoSubTab === 'veo_viral' && (
                   <VideoGrid cards={veoViralCards} onSelectCard={openVideoModal} />
                 )}
                 {videoSubTab === 'studio_pro' && (
                   <VideoGrid cards={studioProCards} onSelectCard={openVideoModal} />
                 )}
                 {videoSubTab === 'creator' && (
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center">
                        <p className="text-slate-400 text-sm">Use o Criador Livre na aba principal para prompts customizados.</p>
                        <button 
                            onClick={() => setActiveTab('creator')}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center justify-center gap-2 w-full"
                        >
                            Ir para Criador Livre <PenTool className="w-4 h-4" />
                        </button>
                    </div>
                 )}
               </div>
            )}
          </section>

          {/* RIGHT COLUMN: Results */}
          <section className="w-full lg:w-7/12 min-h-[500px]">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-200 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] border border-slate-800 rounded-2xl bg-slate-900/20">
                <div className="relative">
                  <div className={`w-16 h-16 border-4 rounded-full animate-spin 
                    ${activeTab === 'affiliate' ? 'border-rose-500/30 border-t-rose-500' : 
                      activeTab === 'video' ? 'border-purple-500/30 border-t-purple-500' :
                      'border-indigo-500/30 border-t-indigo-500'}`}>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                </div>
                <p className="mt-6 text-slate-400 animate-pulse">
                  {getLoadingMessage()}
                </p>
              </div>
            )}

            {!isLoading && result && (
              <ResultDisplay 
                result={result} 
                isAffiliate={activeTab === 'affiliate' || activeTab === 'video'} 
                affiliateMode={selectedAffiliateMode || undefined}
              />
            )}

            {!isLoading && !result && !error && (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-600 bg-slate-900/20">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 
                  ${activeTab === 'affiliate' ? 'bg-rose-500/10' : 
                    activeTab === 'video' ? 'bg-purple-500/10' : 
                    'bg-indigo-500/10'}`}>
                  
                  {activeTab === 'affiliate' ? (
                    <ShoppingBag className="w-10 h-10 text-rose-500/50" />
                  ) : activeTab === 'video' ? (
                    <Video className="w-10 h-10 text-purple-500/50" />
                  ) : (
                    <PenTool className="w-10 h-10 text-indigo-500/50" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  {activeTab === 'affiliate' ? 'Selecione uma Estratégia' : 
                   activeTab === 'video' ? (videoSubTab === 'veo_viral' ? 'VEO Vídeos Virais' : 'Estúdio Pro') :
                   'Aguardando sua ideia'}
                </h3>
                <p className="max-w-sm">
                  {activeTab === 'affiliate' 
                    ? 'Escolha um dos cards ao lado para gerar roteiros e copys.'
                    : activeTab === 'video'
                    ? 'Selecione um template ao lado para criar prompts otimizados em Inglês.'
                    : 'Preencha os detalhes no formulário para gerar um prompt otimizado.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Affiliate Modal */}
      <AffiliateModal 
        isOpen={affiliateModalOpen}
        onClose={() => setAffiliateModalOpen(false)}
        mode={selectedAffiliateMode}
        productName={productName}
        setProductName={setProductName}
        productPrice={productPrice}
        setProductPrice={setProductPrice}
        productObjection={productObjection}
        setProductObjection={setProductObjection}
        affiliateRole={affiliateRole}
        setAffiliateRole={setAffiliateRole}
        regionalAccent={regionalAccent}
        setRegionalAccent={setRegionalAccent}
        onSubmit={handleAffiliateSubmit}
        isLoading={isLoading}
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        config={selectedVideoConfig}
        onSubmit={handleVideoSubmit}
        isLoading={isLoading}
        // Force default goal based on tab type (checking config title/mode is safer)
        forcedGoal={selectedVideoConfig ? (
            veoViralCards.some(c => c.mode === selectedVideoConfig.mode) ? 'video' : 'image'
        ) : undefined}
      />

      <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>© {new Date().getFullYear()} PromptMaster AI. Built with Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
