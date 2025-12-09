
import React, { useState } from 'react';
import { AffiliateMode, AffiliateRole, RegionalAccent } from '../types';
import { X, Wand2, Loader2, ShoppingBag, User, MapPin, Upload, ScanEye, Clock } from 'lucide-react';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AffiliateMode | null;
  productName: string;
  setProductName: (val: string) => void;
  productPrice: string;
  setProductPrice: (val: string) => void;
  productObjection: string;
  setProductObjection: (val: string) => void;
  affiliateRole: AffiliateRole;
  setAffiliateRole: (val: AffiliateRole) => void;
  regionalAccent: RegionalAccent;
  setRegionalAccent: (val: RegionalAccent) => void;
  onSubmit: (videoData?: { base64: string, mimeType: string }, duration?: number) => void;
  isLoading: boolean;
}

const AffiliateModal: React.FC<AffiliateModalProps> = ({
  isOpen,
  onClose,
  mode,
  productName,
  setProductName,
  productPrice,
  setProductPrice,
  productObjection,
  setProductObjection,
  affiliateRole,
  setAffiliateRole,
  regionalAccent,
  setRegionalAccent,
  onSubmit,
  isLoading
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [duration, setDuration] = useState(15); // Default 15s for VAI

  if (!isOpen || !mode) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit for demo stability
        alert("O vídeo deve ter menos de 20MB.");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyzerSubmit = async () => {
    if (!videoFile) return;
    
    setProcessingFile(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(videoFile);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = videoFile.type;
        onSubmit({ base64: base64String, mimeType });
        setProcessingFile(false);
      };
      reader.onerror = () => {
        console.error("Erro ao ler arquivo");
        setProcessingFile(false);
      };
    } catch (error) {
      console.error(error);
      setProcessingFile(false);
    }
  };

  const handleSubmit = () => {
    if (mode === AffiliateMode.ANALYZER) {
      handleAnalyzerSubmit();
    } else {
      // Pass duration if mode is VAI
      const finalDuration = mode === AffiliateMode.VAI ? duration : undefined;
      onSubmit(undefined, finalDuration);
    }
  };

  const isAnalyzer = mode === AffiliateMode.ANALYZER;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 flex-shrink-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {isAnalyzer ? <ScanEye className="w-5 h-5 text-blue-400"/> : <ShoppingBag className="w-5 h-5 text-indigo-400" />}
            {mode}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {isAnalyzer ? (
             <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    Faça upload de um vídeo curto (Reels/TikTok). A IA vai assistir, entender a estratégia e criar 6 variações usando o método VAI.
                  </p>
                  <p className="text-xs text-blue-300 mt-2 font-bold">
                    * Todas as gerações são verificadas contra as diretrizes da Shopee.
                  </p>
                </div>
                
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-slate-900 transition-colors">
                   {!videoPreview ? (
                     <>
                        <Upload className="w-10 h-10 text-slate-500 mb-3" />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                          Selecionar Vídeo
                          <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                        </label>
                        <p className="text-xs text-slate-500 mt-2">Max 20MB. MP4, MOV.</p>
                     </>
                   ) : (
                     <div className="w-full relative">
                        <video src={videoPreview} className="w-full h-48 object-cover rounded-lg" controls />
                        <button 
                          onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                          className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                     </div>
                   )}
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Estilo das Variações
                    </label>
                    <select
                      value={affiliateRole}
                      onChange={(e) => setAffiliateRole(e.target.value as AffiliateRole)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {Object.values(AffiliateRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                </div>
             </div>
          ) : (
            <>
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome do Produto <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Mini Processador USB, Kit de Pinceis..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              {/* Roteiro VAI Specific: Duration Selector */}
              {mode === AffiliateMode.VAI && (
                <div className="animate-in slide-in-from-top-2">
                   <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5 text-rose-400" />
                         Duração da Narração
                       </label>
                   </div>
                   <div className="grid grid-cols-5 gap-2">
                      {[5, 10, 15, 20, 25].map((s) => (
                        <button
                          key={s}
                          onClick={() => setDuration(s)}
                          className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                            duration === s
                              ? 'bg-rose-600 border-rose-500 text-white font-bold shadow-lg shadow-rose-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="text-xs">{s}s</span>
                        </button>
                      ))}
                    </div>
                </div>
              )}

              {/* Persona & Tone Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Estilo da Fala
                  </label>
                  <select
                    value={affiliateRole}
                    onChange={(e) => setAffiliateRole(e.target.value as AffiliateRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {Object.values(AffiliateRole).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Sotaque/Região
                  </label>
                  <select
                    value={regionalAccent}
                    onChange={(e) => setRegionalAccent(e.target.value as RegionalAccent)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {Object.values(RegionalAccent).map((accent) => (
                      <option key={accent} value={accent}>{accent}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Fields based on Mode */}
              {mode === AffiliateMode.VIRAL && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Preço (Opcional - Para destacar valor)
                  </label>
                  <input
                    type="text"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Ex: Apenas R$ 29,90"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {mode === AffiliateMode.OBJECTION && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Principal Objeção/Dúvida <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={productObjection}
                    onChange={(e) => setProductObjection(e.target.value)}
                    placeholder="Ex: Frete muito caro, parece frágil, demora pra chegar..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </>
          )}

          <div className="pt-4 flex-shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading || processingFile || (!isAnalyzer && (!productName || (mode === AffiliateMode.OBJECTION && !productObjection))) || (isAnalyzer && !videoFile)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
                ${isLoading || processingFile || (!isAnalyzer && (!productName || (mode === AffiliateMode.OBJECTION && !productObjection))) || (isAnalyzer && !videoFile)
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : isAnalyzer
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/25 active:scale-[0.98]'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
            >
              {isLoading || processingFile ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {processingFile ? 'Processando Vídeo...' : 'Gerando Conteúdo...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {isAnalyzer ? 'Analisar & Gerar Variações' : 'Gerar Agora'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateModal;
