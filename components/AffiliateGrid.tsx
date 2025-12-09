import React from 'react';
import { AffiliateMode } from '../types';
import { Target, Video, ShieldCheck, Hash, ChevronRight } from 'lucide-react';

interface AffiliateGridProps {
  onSelectMode: (mode: AffiliateMode) => void;
}

const cards = [
  {
    mode: AffiliateMode.VAI,
    title: 'Roteiro VAI',
    subtitle: 'Venda Através de Intenção',
    icon: Target,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    description: 'Venda sem parecer vender. Gera roteiros naturais e emocionais de 10-25s focados na dor e solução.'
  },
  {
    mode: AffiliateMode.VIRAL,
    title: 'Achadinho Viral',
    subtitle: 'Estilo TikTok & Reels',
    icon: Video,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    description: 'Vídeos dinâmicos e visuais. Roteiros focados em unboxing, detalhes e "textos na tela" para prender a atenção.'
  },
  {
    mode: AffiliateMode.OBJECTION,
    title: 'Quebra de Objeção',
    subtitle: 'Fechamento de Venda',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Ideal para produtos caros. Cria copys persuasivas focadas em garantia e custo-benefício.'
  },
  {
    mode: AffiliateMode.SEO,
    title: 'SEO & Hashtags',
    subtitle: 'Para o Algoritmo',
    icon: Hash,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    description: 'Domine a busca. Gera Título exato + Característica + 5 Hashtags específicas. Sem enrolação.'
  }
];

const AffiliateGrid: React.FC<AffiliateGridProps> = ({ onSelectMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {cards.map((card) => (
        <button
          key={card.title}
          onClick={() => onSelectMode(card.mode)}
          className={`group relative text-left p-6 rounded-2xl border ${card.border} ${card.bg} hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-slate-900/50 ${card.color}`}>
              <card.icon className="w-8 h-8" />
            </div>
            <ChevronRight className={`w-5 h-5 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1`} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${card.color}`}>
            {card.subtitle}
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            {card.description}
          </p>
        </button>
      ))}
    </div>
  );
};

export default AffiliateGrid;