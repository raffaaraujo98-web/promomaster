
export enum TargetModel {
  CHATGPT = 'ChatGPT / GPT-4',
  CLAUDE = 'Claude 3.5 Sonnet',
  GEMINI = 'Google Gemini',
  MIDJOURNEY = 'Midjourney',
  STABLE_DIFFUSION = 'Stable Diffusion',
  DALL_E = 'DALL-E 3'
}

export enum PromptTone {
  PROFESSIONAL = 'Profissional',
  CREATIVE = 'Criativo',
  ACADEMIC = 'Acadêmico',
  CASUAL = 'Casual',
  HUMOROUS = 'Bem-humorado',
  PERSUASIVE = 'Persuasivo'
}

export enum PromptLanguage {
  PORTUGUESE = 'Português',
  ENGLISH = 'Inglês',
  SPANISH = 'Espanhol',
  FRENCH = 'Francês'
}

export enum AffiliateMode {
  VAI = 'Roteiro VAI (Venda por Intenção)',
  VIRAL = 'Achadinho Viral (TikTok)',
  OBJECTION = 'Quebra de Objeção',
  SEO = 'SEO (Título e Hashtags)'
}

export enum AffiliateRole {
  FRIEND_TO_FRIEND = 'De Amigo para Amigo (Conselho sincero)',
  SELLER = 'Vendedor Especialista (Persuasivo)',
  STORYTELLING = 'Storytelling (Narrativa envolvente)',
  PROFESSIONAL = 'Profissional / Técnico (Análise fria)',
  INFLUENCER = 'Influencer Exagerado (Hype)'
}

export enum RegionalAccent {
  NEUTRAL = 'Neutro (Padrão Internet)',
  PAULISTA = 'Paulista (Mêo, daora)',
  CARIOCA = 'Carioca (Mermão, caraca)',
  MINEIRO = 'Mineiro (Uai, trem bão)',
  GAUCHO = 'Gaúcho (Bah, tchê)',
  NORDESTINO_GENERICO = 'Nordestino (Arretado, oxente)',
  BAIANO = 'Baiano (Massa, barril)',
  PERNAMBUCANO = 'Pernambucano (Visse, massa)',
  CEARENSE = 'Cearense (Macho, égua)',
  MARANHENSE = 'Maranhense (Égua, tu doido)',
  AMAZONENSE = 'Nortista/Amazonense (Mano, chibata)',
  PARANAENSE = 'Paranaense (Piá, daí)',
  CATARINENSE = 'Catarinense (Tanso, capaz)',
  GOIANO = 'Goiano (Uai, bão demais)',
  BRASILIENSE = 'Brasiliense (Véio, paia)'
}

export enum VideoMode {
  // VEO VIRAIS (VIDEO)
  VEO_INFLUENCER = 'Influencer de Loja',
  VEO_SANTA = 'Papai Noel na Loja',
  VEO_ALOK = 'Intro Telão Alok',
  VEO_MARKET = 'Tour Mercadinho',
  VEO_PODCAST = 'Podcast Fake',
  VEO_PIXAR = 'Pixar 3D',

  // ESTUDIO PRO (IMAGES)
  PRO_UNBOXING = 'Unboxing Premium',
  PRO_ASMR = 'Cena ASMR',
  PRO_BEAUTY = 'Influencer Beauty',
  PRO_SELFIE = 'Selfie Academia',
  PRO_HAND = 'Mão no Horizonte',
  PRO_AVATAR = 'Avatar Realista'
}

export interface PromptFormData {
  // General Creator Fields
  topic: string;
  context: string;
  targetModel: TargetModel;
  tone: PromptTone;
  language: PromptLanguage;
  constraints: string;

  // Affiliate Pro Fields (Optional)
  isAffiliate?: boolean;
  affiliateMode?: AffiliateMode;
  productName?: string;
  productPrice?: string;
  productObjection?: string;
  affiliateRole?: AffiliateRole;
  regionalAccent?: RegionalAccent;

  // Video Fields (Optional)
  isVideo?: boolean;
  videoMode?: VideoMode;
  videoInputs?: Record<string, string>;
  videoGoal?: 'image' | 'video'; // Image vs Video generation
  videoSpeech?: string; // What the character says
  videoSceneCount?: number; // 1 to 4 scenes
  videoRefUrl?: string; // URL for visual reference
}

export interface GeneratedResult {
  optimizedPrompt: string;
  explanation: string;
  tips: string[];
}
