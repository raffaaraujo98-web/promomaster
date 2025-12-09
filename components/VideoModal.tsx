
import React, { useState, useEffect } from 'react';
import { VideoCardConfig } from './VideoGrid';
import { AffiliateRole, RegionalAccent, TargetVideoModel } from '../types';
import { X, Wand2, Loader2, Video, Image as ImageIcon, Clapperboard, Mic, Layers, Film, Link, Upload, Recycle, Clock, ShoppingBag, User, MapPin, Box } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VideoCardConfig | null;
  onSubmit: (inputs: Record<string, string>, goal: 'image' | 'video', speech?: string, sceneCount?: number, duration?: number, refUrl?: string, videoData?: { base64: string, mimeType: string }, productDetails?: { link: string, targetModel: TargetVideoModel, role: AffiliateRole, accent: RegionalAccent }) => void;
  isLoading: boolean;
  forcedGoal?: 'image' | 'video';
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  config,
  onSubmit,
  isLoading,
  forcedGoal
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [goal, setGoal] = useState<'image' | 'video'>('video');
  const [speech, setSpeech] = useState('');
  const [sceneCount, setSceneCount] = useState(1);
  const [duration, setDuration] = useState(15);
  const [refUrl, setRefUrl] = useState('');
  
  // File Upload State
  const [fileData, setFileData] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [processingFile, setProcessingFile] = useState(false);

  // Product Video Specifics
  const [productLink, setProductLink] = useState('');
  const [targetVideoModel, setTargetVideoModel] = useState<TargetVideoModel>(TargetVideoModel.SORA_2);
  const [role, setRole] = useState<AffiliateRole>(AffiliateRole.SELLER);
  const [accent, setAccent] = useState<RegionalAccent>(RegionalAccent.NEUTRAL);

  useEffect(() => {
    if (isOpen && config) {
      setInputs({});
      setSpeech('');
      setSceneCount(1);
      setDuration(15);
      setRefUrl('');
      setFileData(null);
      setFilePreview(null);
      setProductLink('');
      
      if (forcedGoal) {
        setGoal(forcedGoal);
      } else {
        setGoal('video');
      }
    }
  }, [isOpen, config, forcedGoal]);

  if (!isOpen || !config) return null;

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("O arquivo deve ter menos de 20MB.");
        return;
      }
      setFileData(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async () => {
    if (config.requiresFileUpload) {
      if (!fileData) return;
      setProcessingFile(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = fileData.type;
        
        let productDetails = undefined;
        if (config.isProductMode) {
            productDetails = {
                link: productLink,
                targetModel: targetVideoModel,
                role: role,
                accent: accent
            };
        }

        onSubmit(inputs, goal, speech, sceneCount, duration, refUrl, { base64: base64String, mimeType }, productDetails);
        setProcessingFile(false);
      };
      reader.onerror = () => {
        console.error("Erro ao ler arquivo");
        setProcessingFile(false);
      };
    } else {
       onSubmit(inputs, goal, speech, sceneCount, duration, refUrl);
    }
  };

  const isFormValid = config.requiresFileUpload ? !!fileData : config.inputs.every(input => inputs[input.key]?.trim().length > 0);
  const isProductValid = config.isProductMode ? (!!productLink && !!fileData) : true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 flex-shrink-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {config.icon && <config.icon className="w-5 h-5 text-purple-400" />}
            {config.title}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Goal Toggle */}
        {!forcedGoal && !config.requiresFileUpload && (
            <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex gap-2">
            <button
                onClick={() => setGoal('image')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                goal === 'image' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
                <ImageIcon className="w-4 h-4" />
                Imagem Base
            </button>
            <button
                onClick={() => setGoal('video')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                goal === 'video' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
                <Clapperboard className="w-4 h-4" />
                Vídeo VEO
            </button>
            </div>
        )}

        {/* Body - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Instructions (Standard) */}
          {!config.requiresFileUpload && (
            <div className={`border rounded-lg p-3 mb-2 flex gap-3 ${goal === 'video' ? 'bg-purple-900/10 border-purple-500/20' : 'bg-indigo-900/10 border-indigo-500/20'}`}>
              <div className={`mt-0.5 ${goal === 'video' ? 'text-purple-400' : 'text-indigo-400'}`}>
                {goal === 'video' ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                  <p className={`text-sm font-semibold ${goal === 'video' ? 'text-purple-200' : 'text-indigo-200'}`}>
                    {goal === 'image' ? 'Gerador de Prompt Estático (Pro)' : 'Gerador de Vídeo VEO3'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {goal === 'image' 
                      ? 'Preencha para gerar um prompt fotográfico ultra-realista em Inglês.'
                      : 'Preencha para gerar um prompt de vídeo complexo com movimento e iluminação em Inglês.'
                    }
                  </p>
              </div>
            </div>
          )}

          {/* FILE UPLOAD SECTION */}
          {config.requiresFileUpload && (
             <div className="space-y-4">
               <div className={`border rounded-lg p-4 ${config.isProductMode ? 'bg-rose-500/10 border-rose-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                  <p className={`text-sm font-medium ${config.isProductMode ? 'text-rose-200' : 'text-green-200'}`}>
                    {config.isProductMode ? 'Vídeo Viral de Produto (VAI)' : 'Como funciona a Remodelagem?'}
                  </p>
                  <p className={`text-xs mt-1 ${config.isProductMode ? 'text-rose-300/80' : 'text-green-300/80'}`}>
                    {config.isProductMode 
                      ? 'Envie a foto do produto. A IA analisa visualmente, considera o link e cria 6 variações de roteiro perfeitas para o modelo de vídeo escolhido.'
                      : 'Envie um vídeo que você já tem. A IA vai analisar o visual (cortes, ambiente, ações) e criar 3 novos roteiros com narrativas totalmente diferentes.'}
                  </p>
               </div>
               
               <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-slate-900 transition-colors">
                  {!filePreview ? (
                    <>
                       <Upload className="w-10 h-10 text-slate-500 mb-3" />
                       <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-lg">
                         {config.fileAccept === 'image/*' ? 'Selecionar Imagem PNG/JPG' : 'Selecionar Vídeo MP4'}
                         <input type="file" accept={config.fileAccept || "video/*"} className="hidden" onChange={handleFileChange} />
                       </label>
                       <p className="text-xs text-slate-500 mt-2">Max 20MB.</p>
                    </>
                  ) : (
                    <div className="w-full relative">
                       {config.fileAccept === 'image/*' ? (
                           <img src={filePreview} className="w-full h-48 object-cover rounded-lg" alt="Preview" />
                       ) : (
                           <video src={filePreview} className="w-full h-48 object-cover rounded-lg" controls />
                       )}
                       
                       <button 
                         onClick={() => { setFileData(null); setFilePreview(null); }}
                         className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  )}
               </div>
             </div>
          )}

          {/* Dynamic Inputs */}
          {config.inputs.map((field) => (
            <div key={field.key} className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {field.label} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={inputs[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}

          {/* PRODUCT VIDEO SPECIFIC FIELDS */}
          {config.isProductMode && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                  
                  {/* Link */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Link className="w-3.5 h-3.5 text-rose-400"/> Link do Produto
                    </label>
                    <input 
                        type="text" 
                        value={productLink} 
                        onChange={e => setProductLink(e.target.value)} 
                        placeholder="https://shopee.com.br/..." 
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {/* Target Video Model */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-rose-400"/> Modelo de Vídeo Alvo
                    </label>
                    <select
                        value={targetVideoModel}
                        onChange={(e) => setTargetVideoModel(e.target.value as TargetVideoModel)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    >
                        {Object.values(TargetVideoModel).map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400"/> Estilo da Fala
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as AffiliateRole)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        >
                            {Object.values(AffiliateRole).map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    {/* Accent */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400"/> Sotaque
                        </label>
                        <select
                            value={accent}
                            onChange={(e) => setAccent(e.target.value as RegionalAccent)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                        >
                            {Object.values(RegionalAccent).map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>
                  </div>

                   {/* Duration */}
                   <div>
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                             <Clock className="w-3.5 h-3.5 text-slate-400" /> Duração do Vídeo
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[5, 10, 15, 20, 25].map((s) => (
                            <button
                              key={s}
                              onClick={() => setDuration(s)}
                              className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
                                duration === s
                                  ? 'bg-rose-600 border-rose-500 text-white'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-bold">{s}s</span>
                            </button>
                          ))}
                        </div>
                   </div>
              </div>
          )}


          {/* Standard Video Options (Hide for Product/Remodel) */}
          {goal === 'video' && !config.requiresFileUpload && (
            <div className="space-y-5 animate-in slide-in-from-top-3 border-t border-slate-800 pt-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Scene Count */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                         <Layers className="w-3.5 h-3.5 text-purple-400" />
                         Cenas (8s cada)
                       </label>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => setSceneCount(num)}
                          className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
                            sceneCount === num
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="text-base font-bold">{num}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5 text-purple-400" />
                         Duração da Fala
                       </label>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[5, 10, 15, 20, 25].map((s) => (
                        <button
                          key={s}
                          onClick={() => setDuration(s)}
                          className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${
                            duration === s
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold">{s}s</span>
                        </button>
                      ))}
                    </div>
                  </div>
              </div>

              {/* Speech Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-400" />
                  Fala / Narração
                </label>
                <textarea
                  value={speech}
                  onChange={(e) => setSpeech(e.target.value)}
                  placeholder={`Digite o texto para a narração de ${duration} segundos...`}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Standard Link Ref */}
          {!config.requiresFileUpload && (
            <div className="animate-in slide-in-from-top-2">
               <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Link className="w-3.5 h-3.5 text-slate-400" />
                  Link de Referência (Opcional)
               </label>
               <input
                 type="text"
                 value={refUrl}
                 onChange={(e) => setRefUrl(e.target.value)}
                 placeholder="Link de imagem/vídeo para estilo..."
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
               />
            </div>
          )}

          <div className="pt-2 flex-shrink-0">
            <button
              onClick={handleFormSubmit}
              disabled={isLoading || !isFormValid || !isProductValid || processingFile}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
                ${isLoading || !isFormValid || !isProductValid || processingFile
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : config.mode === 'Vídeo de Produto'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-500/25 active:scale-[0.98]'
                    : config.requiresFileUpload
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 shadow-green-500/25 active:scale-[0.98]'
                    : goal === 'video' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25 active:scale-[0.98]'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
            >
              {isLoading || processingFile ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {processingFile ? 'Processando...' : 'Criando...'}
                </>
              ) : (
                <>
                  {config.isProductMode ? <ShoppingBag className="w-5 h-5"/> : config.requiresFileUpload ? <Recycle className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                  {config.isProductMode 
                    ? 'Gerar 6 Variações Virais'
                    : config.requiresFileUpload 
                    ? 'Remodelar Conteúdo' 
                    : (goal === 'video' ? `Gerar Prompt VEO (${sceneCount * 8}s)` : 'Gerar Prompt Studio')
                  }
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
