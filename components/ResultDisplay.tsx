import React, { useState } from 'react';
import { GeneratedResult, AffiliateMode } from '../types';
import { Copy, Check, Info, Lightbulb, Clapperboard, FileText, Hash } from 'lucide-react';

interface ResultDisplayProps {
  result: GeneratedResult;
  isAffiliate?: boolean;
  affiliateMode?: AffiliateMode;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isAffiliate = false, affiliateMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getHeaderTitle = () => {
    if (!isAffiliate) return "Prompt Gerado";
    if (affiliateMode === AffiliateMode.SEO) return "Opções de SEO Geradas";
    return "Seu Conteúdo Final";
  };

  const isSEO = isAffiliate && affiliateMode === AffiliateMode.SEO;
  
  // Parse SEO items if mode is SEO
  const seoItems = isSEO 
    ? result.optimizedPrompt.split('---').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Main Content Area */}
      {isSEO ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-slate-300 px-1">
             <h3 className="font-semibold flex items-center gap-2">
                <Hash className="w-5 h-5 text-amber-500" />
                5 Opções Otimizadas
             </h3>
             <span className="text-xs text-slate-500">Clique no card para copiar</span>
          </div>
          {seoItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => handleCopy(item)}
              className="bg-slate-900/50 border border-amber-500/20 rounded-xl p-4 hover:bg-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group relative"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="w-4 h-4 text-slate-400" />
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
                Opção {idx + 1}
              </span>
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 font-medium">
                {item}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <div className={`border rounded-2xl overflow-hidden shadow-2xl relative ${isAffiliate ? 'bg-gradient-to-br from-rose-900/40 to-slate-900 border-rose-500/30' : 'bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/30'}`}>
          <div className={`px-6 py-3 border-b flex justify-between items-center ${isAffiliate ? 'bg-rose-600/10 border-rose-500/20' : 'bg-indigo-600/10 border-indigo-500/20'}`}>
            <h3 className={`font-semibold flex items-center gap-2 ${isAffiliate ? 'text-rose-200' : 'text-indigo-200'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isAffiliate ? 'bg-rose-400' : 'bg-green-400'}`}></span>
              {getHeaderTitle()}
            </h3>
            <button
              onClick={() => handleCopy(result.optimizedPrompt)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${isAffiliate ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 text-slate-100">
              {result.optimizedPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Explanation & Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strategy/Explanation */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
          <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
            {isAffiliate ? <Clapperboard className="w-5 h-5 text-rose-400" /> : <Info className="w-5 h-5 text-blue-400" />}
            {isAffiliate ? "Estratégia Aplicada" : "Por que funciona?"}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            {result.explanation}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
          <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
            {isAffiliate ? <FileText className="w-5 h-5 text-amber-400" /> : <Lightbulb className="w-5 h-5 text-amber-400" />}
            {isAffiliate ? "Dicas de Execução" : "Dicas Extras"}
          </h4>
          <ul className="space-y-2">
            {result.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="min-w-[6px] h-[6px] rounded-full bg-amber-400 mt-1.5"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ResultDisplay;