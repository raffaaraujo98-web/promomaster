
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
  SEO = 'SEO (Título e Hashtags)',
  ANALYZER = 'Analisador de Concorrência'
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
  PRO_AVATAR = 'Avatar Realista',

  // REMODELAGEM & PRODUTO
  REMODEL_VIRAL = 'Remodelagem Viral',
  PRODUCT_VIDEO = 'Vídeo de Produto'
}

export enum TargetVideoModel {
  SORA_2 = 'Sora 2 (OpenAI)',
  KLING_AI = 'Kling AI (Flow)',
  RUNWAY_GEN3 = 'Runway Gen-3',
  LUMA_DREAM = 'Luma Dream Machine'
}

export interface PromptFormData {
  // General Creator Fields
  topic: string;
  context: string;
  targetModel: TargetModel;
  tone: PromptTone;
  language: PromptLanguage;
  constraints: string;

  // Refinement Field (New)
  refinementInstruction?: string;

  // Affiliate Pro Fields (Optional)
  isAffiliate?: boolean;
  affiliateMode?: AffiliateMode;
  productName?: string;
  productPrice?: string;
  productObjection?: string;
  affiliateRole?: AffiliateRole;
  regionalAccent?: RegionalAccent;
  affiliateDuration?: number; // 5, 10, 15, 20, 25 seconds for VAI
  
  // Analyzer Field
  analyzerVideoData?: string; // Base64 string of the video
  analyzerMimeType?: string;

  // Video Fields (Optional)
  isVideo?: boolean;
  videoMode?: VideoMode;
  videoInputs?: Record<string, string>;
  videoGoal?: 'image' | 'video'; // Image vs Video generation
  videoSpeech?: string; // What the character says
  videoDuration?: number; // 5, 10, 15, 20, 25 seconds
  videoSceneCount?: number; // 1 to 4 scenes
  videoRefUrl?: string; // URL for visual reference
  videoFileData?: string; // Base64 for Remodelagem or Product Image
  videoMimeType?: string;
  
  // Product Video Specifics
  videoProductLink?: string;
  videoTargetModel?: TargetVideoModel;
  videoRole?: AffiliateRole; // Reuse affiliate roles for consistency
  videoAccent?: RegionalAccent; // Reuse accents
}

export interface GeneratedResult {
  optimizedPrompt: string;
  explanation: string;
  tips: string[];
}
