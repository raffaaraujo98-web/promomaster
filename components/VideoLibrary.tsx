import React, { useState } from 'react';
import { VideoMode } from '../types';
import { veoViralCards, studioProCards, VideoCardConfig } from './VideoGrid';
import { Play, Copy, Edit, Image as ImageIcon, Video, Check, ExternalLink } from 'lucide-react';

interface VideoLibraryProps {
  type: 'video' | 'image';
  onPersonalize: (config: VideoCardConfig) => void;
}

const ARSENAL_CATEGORIES = [
  "Todos",
  "Entrevistas",
  "Comédia",
  "Influencer",
  "Bebês",
  "Unbox",
  "Comercial",
  "Vlog",
  "Menina da Roça",
  "Dupla",
  "Repórter",
  "Animais Falando",
  "Menina do Posto",
  "Jornal"
];

// Mock data with Thumbnails
const MOCK_LIBRARY_ITEMS = [
  {
    id: 1,
    title: "Influencer Lifestyle: Café em Paris",
    category: "Influencer",
    description: "Mulher tomando café em Paris com roupa chique, olhando para a câmera e sorrindo. Estilo vlog de luxo.",
    videoMode: VideoMode.VEO_INFLUENCER,
    defaultInputs: { description: "blonde woman 20s", outfit: "chic trench coat and beret", location: "Parisian cafe outdoors with Eiffel Tower view" },
    thumbnail: "https://images.unsplash.com/photo-1521119989659-a83eee488058?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Bebê Repórter: Preço do Leite",
    category: "Bebês",
    description: "Bebê de terno com microfone anunciando a alta do leite com cara séria e fofa.",
    videoMode: VideoMode.VEO_INFLUENCER,
    defaultInputs: { description: "cute baby with serious face holding microphone", outfit: "tiny blue business suit and glasses", location: "news studio background" },
    thumbnail: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Gato Astronauta Zero G",
    category: "Animais Falando",
    description: "Gato com roupa espacial flutuando dentro de uma nave comendo atum flutuante.",
    videoMode: VideoMode.VEO_PIXAR,
    defaultInputs: { mascot: "fluffy cat astronaut", action: "floating in zero gravity eating floating tuna chunks" },
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Tour Loja de Roupas Rápido",
    category: "Comercial",
    description: "Drone voando por araras de roupas em alta velocidade em loja de departamento.",
    videoMode: VideoMode.VEO_MARKET,
    defaultInputs: { location_desc: "modern clothing department store, drone view flying through racks of colorful summer dresses" },
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Menina da Roça: Café Fresco",
    category: "Menina da Roça",
    description: "Menina servindo café na fazenda ao nascer do sol com fumaça saindo da xícara.",
    videoMode: VideoMode.VEO_INFLUENCER,
    defaultInputs: { description: "country girl pouring fresh hot coffee", outfit: "rustic farm clothes", location: "rustic farm porch at sunrise with chickens" },
    thumbnail: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Papai Noel Radical",
    category: "Comédia",
    description: "Papai Noel andando de skate no shopping fazendo manobras radicais.",
    videoMode: VideoMode.VEO_SANTA,
    defaultInputs: { store_type: "shopping mall", action: "doing skateboarding tricks on a rail" },
    thumbnail: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    title: "Unbox Tech: Celular Novo",
    category: "Unbox",
    description: "Mãos abrindo caixa de celular novo com iluminação RGB e setup gamer.",
    videoMode: VideoMode.PRO_UNBOXING, 
    defaultInputs: { product: "new smartphone, sleek black box with holographic logo" },
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    title: "Jornal: Urso no Mercado",
    category: "Jornal",
    description: "Câmera de segurança mostrando um urso entrando no mercado e pegando mel.",
    videoMode: VideoMode.VEO_PIXAR,
    defaultInputs: { mascot: "polar bear", action: "walking into a supermarket buying honey jars casually like a human" },
    thumbnail: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 9,
    title: "Menina do Posto: Abastecendo",
    category: "Menina do Posto",
    description: "Cena cinematográfica noturna de garota estilosa abastecendo carro vintage.",
    videoMode: VideoMode.VEO_INFLUENCER,
    defaultInputs: { description: "stylish girl pumping gas", outfit: "vintage mechanic jumpsuit with heels", location: "neon lit retro gas station at night" },
    thumbnail: "https://images.unsplash.com/photo-1526491443657-6e949392e21e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    title: "Dupla: Disputa de Dança",
    category: "Dupla",
    description: "Duas pessoas dançando breakdance na rua competindo entre si.",
    videoMode: VideoMode.VEO_INFLUENCER,
    defaultInputs: { description: "street dancer guy and ballerina girl", outfit: "urban street wear", location: "urban graffiti alleyway, dance battle" },
    thumbnail: "https://images.unsplash.com/photo-1535525266644-dc287837c80b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    title: "Entrevista com Alien",
    category: "Entrevistas",
    description: "Jornalista entrevistando um alienígena cinza clássico sobre a Terra.",
    videoMode: VideoMode.VEO_PODCAST,
    defaultInputs: { speaker: "serious journalist woman interviewing grey alien", topic: "invasion plans and earth culture" },
    thumbnail: "https://images.unsplash.com/photo-1614728853911-0941581eb0bc?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    title: "Vlog: Arrumando a Mala",
    category: "Vlog",
    description: "Pessoa mostrando como organizar mala de viagem perfeitamente.",
    videoMode: VideoMode.PRO_UNBOXING,
    defaultInputs: { product: "travel suitcase with organizer cubes, folded clothes" },
    thumbnail: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 13,
    title: "Repórter de Rua: Chuva",
    category: "Repórter",
    description: "Repórter no meio de uma tempestade segurando guarda-chuva virado.",
    videoMode: VideoMode.VEO_INFLUENCER, 
    defaultInputs: { description: "reporter struggling with wind", outfit: "yellow raincoat soaked", location: "city street during heavy storm hurricane" },
    thumbnail: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 14,
    title: "Comédia: Cachorro Diretor",
    category: "Animais Falando",
    description: "Cachorro sentado na cadeira de diretor gritando 'Ação!' num megafone.",
    videoMode: VideoMode.VEO_PIXAR,
    defaultInputs: { mascot: "bulldog director", action: "sitting on director chair yelling action into a megaphone" },
    thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800"
  }
];

const VideoLibrary: React.FC<VideoLibraryProps> = ({ type, onPersonalize }) => {
  const [filter, setFilter] = useState("Todos");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const getConfigForMode = (mode: VideoMode): VideoCardConfig | undefined => {
    const allCards = [...veoViralCards, ...studioProCards];
    return allCards.find(c => c.mode === mode);
  };

  const handleCopy = (item: typeof MOCK_LIBRARY_ITEMS[0]) => {
    const text = `PROMPT (${type === 'video' ? 'VIDEO VEO3' : 'IMAGEM'}): ${item.description} - Style: ${item.category}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = filter === "Todos" 
    ? MOCK_LIBRARY_ITEMS 
    : MOCK_LIBRARY_ITEMS.filter(item => item.category === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
        {ARSENAL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === cat 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const config = getConfigForMode(item.videoMode);
          
          return (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all group flex flex-col shadow-lg hover:shadow-2xl hover:shadow-purple-500/10">
              
              {/* Preview Area with Image */}
              <div className="h-40 bg-slate-950 relative flex items-center justify-center border-b border-slate-800 overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80`}></div>
                
                {/* Play Button Overlay for Video */}
                {type === 'video' && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                   </div>
                )}

                {/* Category Badge */}
                <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-wide border border-white/10 flex items-center gap-1">
                   {type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                   {item.category}
                </span>

                {/* Duration Badge (Video Only) */}
                {type === 'video' && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center gap-1 border border-white/10">
                        <Play className="w-2 h-2 fill-current" /> 8s
                    </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div className="mb-4">
                  <h4 className="text-white font-bold mb-1 text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">{item.title}</h4>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleCopy(item)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-700 hover:border-slate-500"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === item.id ? 'Copiado' : 'Copiar'}
                  </button>
                  
                  {config && (
                    <button 
                        onClick={() => onPersonalize({ ...config, inputs: config.inputs.map(i => ({ ...i, defaultValue: item.defaultInputs[i.key as keyof typeof item.defaultInputs] })) } as any)}
                        className={`flex-1 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-lg border border-transparent
                        ${type === 'video' 
                            ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20' 
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'}
                        `}
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Personalizar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-8 border-t border-slate-800 flex flex-col items-center">
        <p className="text-slate-500 text-xs mb-3">
          Exibindo {filteredItems.length} de {type === 'video' ? '1000+' : '800+'} prompts testados no Arsenal.
        </p>
        <button className="px-6 py-2 rounded-full border border-slate-700 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          Carregar mais prompts...
        </button>
      </div>
    </div>
  );
};

export default VideoLibrary;