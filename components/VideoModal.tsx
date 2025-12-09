
import React, { useState, useEffect } from 'react';
import { VideoCardConfig } from './VideoGrid';
import { X, Wand2, Loader2, Video, Image as ImageIcon, Clapperboard, Mic, Layers, Film, Link } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VideoCardConfig | null;
  onSubmit: (inputs: Record<string, string>, goal: 'image' | 'video', speech?: string, sceneCount?: number, refUrl?: string) => void;
  isLoading: boolean;
  forcedGoal?: 'image' | 'video'; // New prop to lock mode
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
  const [refUrl, setRefUrl] = useState('');

  useEffect(() => {
    if (isOpen && config) {
      setInputs({});
      setSpeech('');
      setSceneCount(1);
      setRefUrl('');
      // Set goal based on forcedGoal or default to video
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

  const isFormValid = config.inputs.every(input => inputs[input.key]?.trim().length > 0);

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

        {/* Goal Toggle - Only show if not forced */}
        {!forcedGoal && (
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
          
          {/* Instructions */}
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

          {/* Optional Reference URL */}
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

          {/* Video Specific: Scene Count & Speech */}
          {goal === 'video' && (
            <div className="space-y-4 animate-in slide-in-from-top-3 border-t border-slate-800 pt-5">
              
              {/* Scene Count */}
              <div>
                <div className="flex items-center justify-between mb-2">
                   <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                     <Layers className="w-4 h-4 text-purple-400" />
                     Quantidade de Cenas (8s cada)
                   </label>
                   <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                     VEO Mode
                   </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSceneCount(num)}
                      className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-lg border transition-all ${
                        sceneCount === num
                          ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-lg font-bold">{num}</span>
                      <span className="text-[10px] uppercase font-medium">{num === 1 ? 'Cena' : 'Cenas'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-400" />
                  Fala do Personagem (Opcional)
                </label>
                <textarea
                  value={speech}
                  onChange={(e) => setSpeech(e.target.value)}
                  placeholder="Ex: 'Olá a todos...' (Gera lip-sync)"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex-shrink-0">
            <button
              onClick={() => onSubmit(inputs, goal, speech, sceneCount, refUrl)}
              disabled={isLoading || !isFormValid}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
                ${isLoading || !isFormValid
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : goal === 'video' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25 active:scale-[0.98]'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {goal === 'video' ? `Gerar Prompt VEO (${sceneCount * 8}s)` : 'Gerar Prompt Studio'}
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
