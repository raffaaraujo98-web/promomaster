import React from 'react';
import { PromptFormData, TargetModel, PromptTone, PromptLanguage } from '../types';
import { Wand2, Loader2 } from 'lucide-react';

interface PromptFormProps {
  formData: PromptFormData;
  setFormData: React.Dispatch<React.SetStateAction<PromptFormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isImageModel = [TargetModel.MIDJOURNEY, TargetModel.STABLE_DIFFUSION, TargetModel.DALL_E].includes(formData.targetModel);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-indigo-500 rounded-full block"></span>
        Configure seu Prompt
      </h2>
      
      <div className="space-y-6">
        {/* Main Topic */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
            O que você quer criar? (Ideia principal)
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder={isImageModel ? "Ex: Um gato astronauta cyberpunk..." : "Ex: Um plano de marketing para café..."}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Model & Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetModel" className="block text-sm font-medium text-slate-300 mb-2">
              Modelo Alvo
            </label>
            <select
              name="targetModel"
              id="targetModel"
              value={formData.targetModel}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {Object.values(TargetModel).map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">
              Idioma do Prompt
            </label>
            <select
              name="language"
              id="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {Object.values(PromptLanguage).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Context */}
        <div>
          <label htmlFor="context" className="block text-sm font-medium text-slate-300 mb-2">
            Contexto ou Detalhes Adicionais
          </label>
          <textarea
            id="context"
            name="context"
            rows={3}
            value={formData.context}
            onChange={handleChange}
            placeholder="Quem é o público alvo? Qual o objetivo específico? Detalhes de estilo?"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Tone & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
              Tom de Voz / Estilo
            </label>
            <select
              name="tone"
              id="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {Object.values(PromptTone).map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-slate-300 mb-2">
              Restrições (Opcional)
            </label>
            <input
              type="text"
              id="constraints"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              placeholder="Ex: Max 200 palavras, Sem jargões..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onSubmit}
            disabled={isLoading || !formData.topic}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 
              ${isLoading || !formData.topic 
                ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Gerando Prompt Mágico...
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                Gerar Prompt Otimizado
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptForm;
