import React from 'react';
import { AffiliateMode, AffiliateRole, RegionalAccent } from '../types';
import { X, Wand2, Loader2, ShoppingBag, User, MapPin } from 'lucide-react';

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
  onSubmit: () => void;
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
  if (!isOpen || !mode) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 flex-shrink-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
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

          <div className="pt-4 flex-shrink-0">
            <button
              onClick={onSubmit}
              disabled={isLoading || !productName || (mode === AffiliateMode.OBJECTION && !productObjection)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
                ${isLoading || !productName || (mode === AffiliateMode.OBJECTION && !productObjection)
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando Conteúdo...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Gerar Agora
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