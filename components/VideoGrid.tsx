
import React from 'react';
import { VideoMode } from '../types';
import { User, Gift, Music, ShoppingCart, Mic, Cat, Package, Sparkles, Camera, MapPin, Smile, Video, Image as ImageIcon } from 'lucide-react';

export interface VideoCardConfig {
  mode: VideoMode;
  type: 'video' | 'image';
  title: string;
  description: string;
  icon: any;
  inputs: { key: string; label: string; placeholder: string }[];
  color: string;
  bg: string;
  border: string;
}

// Collection 1: VEO VIRAIS (Video Focus)
export const veoViralCards: VideoCardConfig[] = [
  {
    mode: VideoMode.VEO_INFLUENCER,
    type: 'video',
    title: 'Influencer de Loja',
    description: 'Apresentadora realista na sua loja.',
    icon: User,
    inputs: [
      { key: 'description', label: 'Descrição da Mulher', placeholder: 'Ex: Loira, jovem, sorriso simpático...' },
      { key: 'outfit', label: 'Roupa/Time', placeholder: 'Ex: Camisa do Flamengo, Vestido Florido...' },
      { key: 'location', label: 'Local', placeholder: 'Ex: Loja de sapatos...' }
    ],
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    mode: VideoMode.VEO_SANTA,
    type: 'video',
    title: 'Papai Noel na Loja',
    description: 'O bom velhinho visitando seu negócio.',
    icon: Gift,
    inputs: [
      { key: 'store_type', label: 'Tipo de Loja', placeholder: 'Ex: Barbearia vintage...' },
      { key: 'action', label: 'Ação', placeholder: 'Ex: Cortando o cabelo, segurando sacolas...' }
    ],
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  {
    mode: VideoMode.VEO_ALOK,
    type: 'video',
    title: 'Intro Telão Alok',
    description: 'Seu nome em neon num show gigante.',
    icon: Music,
    inputs: [
      { key: 'brand_name', label: 'Nome da Marca', placeholder: 'Ex: PROMPT MASTER...' }
    ],
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20'
  },
  {
    mode: VideoMode.VEO_MARKET,
    type: 'video',
    title: 'Tour Mercadinho',
    description: 'Mostre o ambiente e produtos.',
    icon: ShoppingCart,
    inputs: [
      { key: 'location_desc', label: 'Descrição do Local', placeholder: 'Ex: Mercadinho de bairro organizado...' }
    ],
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  {
    mode: VideoMode.VEO_PODCAST,
    type: 'video',
    title: 'Podcast Fake',
    description: 'Cortes virais de podcast profissional.',
    icon: Mic,
    inputs: [
      { key: 'speaker', label: 'Quem Fala', placeholder: 'Ex: Homem de terno cinza...' },
      { key: 'topic', label: 'Assunto', placeholder: 'Ex: Empreendedorismo e sucesso...' }
    ],
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    mode: VideoMode.VEO_PIXAR,
    type: 'video',
    title: 'Pixar 3D',
    description: 'Animação fofa estilo Disney.',
    icon: Cat,
    inputs: [
      { key: 'mascot', label: 'Mascote', placeholder: 'Ex: Um cachorro golden retriever...' },
      { key: 'action', label: 'Ação', placeholder: 'Ex: Pulando numa piscina de bolinhas...' }
    ],
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20'
  }
];

// Collection 2: ESTÚDIO PRO (Image Focus)
export const studioProCards: VideoCardConfig[] = [
  {
    mode: VideoMode.PRO_UNBOXING,
    type: 'image',
    title: 'Unboxing Premium',
    description: 'Foto comercial de alta qualidade.',
    icon: Package,
    inputs: [
      { key: 'product', label: 'Produto', placeholder: 'Ex: iPhone 15 Pro Max...' }
    ],
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20'
  },
  {
    mode: VideoMode.PRO_ASMR,
    type: 'image',
    title: 'Cena ASMR',
    description: 'Detalhes ultra-realistas em bancada.',
    icon: Sparkles,
    inputs: [
      { key: 'product', label: 'Produto', placeholder: 'Ex: Creme hidratante...' },
      { key: 'counter', label: 'Bancada', placeholder: 'Ex: Mármore branco luxuoso...' }
    ],
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20'
  },
  {
    mode: VideoMode.PRO_BEAUTY,
    type: 'image',
    title: 'Influencer Beauty',
    description: 'Retrato close-up com produto.',
    icon: Camera,
    inputs: [
      { key: 'product', label: 'Produto', placeholder: 'Ex: Batom vermelho...' },
      { key: 'model', label: 'Modelo', placeholder: 'Ex: Mulher morena de olhos verdes...' }
    ],
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20'
  },
  {
    mode: VideoMode.PRO_SELFIE,
    type: 'image',
    title: 'Selfie Academia',
    description: 'Estilo autêntico espelho de academia.',
    icon: Camera,
    inputs: [
      { key: 'outfit', label: 'Roupa', placeholder: 'Ex: Top e legging preta...' },
      { key: 'location', label: 'Local', placeholder: 'Ex: Academia moderna com luz led...' }
    ],
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    mode: VideoMode.PRO_HAND,
    type: 'image',
    title: 'Mão no Horizonte',
    description: 'Foto lifestyle de viagem/paisagem.',
    icon: MapPin,
    inputs: [
      { key: 'product', label: 'Produto', placeholder: 'Ex: Garrafa de água...' },
      { key: 'landscape', label: 'Paisagem', placeholder: 'Ex: Praia no pôr do sol...' }
    ],
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    mode: VideoMode.PRO_AVATAR,
    type: 'image',
    title: 'Avatar Realista',
    description: 'Influencer virtual ultra-realista.',
    icon: Smile,
    inputs: [
      { key: 'description', label: 'Descrição', placeholder: 'Ex: Homem jovem estiloso...' },
      { key: 'location', label: 'Local', placeholder: 'Ex: Rua movimentada de NY...' }
    ],
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  }
];

interface VideoGridProps {
  cards: VideoCardConfig[];
  onSelectCard: (config: VideoCardConfig) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ cards, onSelectCard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {cards.map((card) => (
        <button
          key={card.title}
          onClick={() => onSelectCard(card)}
          className={`group relative text-left p-6 rounded-2xl border ${card.border} ${card.bg} hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col h-full`}
        >
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-slate-900/50 ${card.color}`}>
                <card.icon className="w-8 h-8" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>

          <div className={`mt-6 w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg 
            ${card.type === 'video' 
              ? 'bg-purple-600 group-hover:bg-purple-500 shadow-purple-500/25 text-white' 
              : 'bg-indigo-600 group-hover:bg-indigo-500 shadow-indigo-500/25 text-white'
            }`}>
            {card.type === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
            {card.type === 'video' ? 'Criar Vídeo' : 'Gerar Imagem'}
          </div>
        </button>
      ))}
    </div>
  );
};

export default VideoGrid;
