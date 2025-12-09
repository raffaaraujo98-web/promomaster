
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptFormData, GeneratedResult, AffiliateMode, VideoMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    optimizedPrompt: {
      type: Type.STRING,
      description: "The final content generated (Script, Copy, SEO list, or Video/Image Prompt) directly for the user.",
    },
    explanation: {
      type: Type.STRING,
      description: "Explanation of the strategy used, or details about the video/image prompt structure.",
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable tips on how to record, post, or generate this content effectively.",
    },
  },
  required: ["optimizedPrompt", "explanation", "tips"],
};

export const generateOptimizedPrompt = async (data: PromptFormData): Promise<GeneratedResult> => {
  try {
    let systemInstruction = '';
    let userContent = '';

    if (data.isVideo && data.videoMode) {
      // --- LOGIC FOR VEO & VIDEO (TEMPLATE FILLING) ---
      const inputs = data.videoInputs || {};
      const goal = data.videoGoal || 'video'; // 'image' or 'video'
      const speech = data.videoSpeech ? `Speech/Script needed: "${data.videoSpeech}"` : "No speech.";
      const sceneCount = data.videoSceneCount || 1;
      const refUrl = data.videoRefUrl ? `Visual Reference URL: ${data.videoRefUrl}` : "";

      systemInstruction = `
        Você é um Especialista em Mídia Sintética.
        Sua tarefa é TRADUZIR os inputs do usuário (Português) para o INGLÊS e preencher o template técnico solicitado.
        
        REGRAS GERAIS:
        1. Input em Português -> Output em INGLÊS.
        2. Mantenha a estrutura técnica do prompt (luz, câmera, resolução).
        3. Se houver URL de referência, adicione ao final.
        4. Para vídeos com múltiplas cenas, crie a sequência cronológica.
      `;

      let template = '';

      // --- MAPPING NEW CARDS TO TEMPLATES ---
      switch (data.videoMode) {
        
        // --- VEO VIRAIS (VIDEO) ---
        case VideoMode.VEO_INFLUENCER:
          template = `A realistic promotional scene inside a [location]. The main subject is a [description] woman wearing a [outfit]. She is standing confidently, looking at the camera. Soft cinematic lighting, 4k.`;
          break;
        
        case VideoMode.VEO_SANTA:
          template = `Realistic video of Santa Claus standing inside a [store_type]. He is [action]. Christmas decorations, festive lighting, 4k.`;
          break;

        case VideoMode.VEO_ALOK:
          template = `Massive LED screen on a concert stage displaying the name "[brand_name]" in neon glowing letters. Cyberpunk visuals, flashing lights, 3D render.`;
          break;

        case VideoMode.VEO_MARKET:
          template = `A video showing a [location_desc]. A presenter walks into the frame. Camera pan movement to the right showing products. Realistic lighting.`;
          break;

        case VideoMode.VEO_PODCAST:
          template = `A professional podcast studio setup. Side angle shot of [speaker] speaking into a Shure SM7B microphone. Topic vibe: [topic]. Blurred background neon lights.`;
          break;

        case VideoMode.VEO_PIXAR:
          template = `3D animated style of a cute [mascot] doing [action]. Disney Pixar art style, fluffy texture, 8k render.`;
          break;

        // --- ESTÚDIO PRO (IMAGES) ---
        case VideoMode.PRO_UNBOXING:
          template = `Realistic 4K unboxing scene inside a modern studio. A human hand holds a [product], lifting it slightly above an open box. Soft commercial lighting, blurred background.`;
          break;
        
        case VideoMode.PRO_ASMR:
          template = `Ultra-realistic product photo of a [product] placed on a luxurious [counter] countertop. Soft natural light, glossy finish reflections, high detail 8k.`;
          break;

        case VideoMode.PRO_BEAUTY:
          template = `Ultra-realistic portrait of a [model] holding a [product] close to her face. Warm natural sunlight, soft golden glow, cinematic lighting.`;
          break;

        case VideoMode.PRO_SELFIE:
          template = `Ultra-realistic vertical photo of a fit woman taking a mirror selfie inside a [location]. She is wearing [outfit]. Natural skin texture, realistic lighting, smartphone style.`;
          break;

        case VideoMode.PRO_HAND:
          template = `A realistic close-up of a womans hand holding a [product] with a stunning [landscape] in the background. Golden hour lighting, travel vibe.`;
          break;

        case VideoMode.PRO_AVATAR:
          template = `A beautiful UGC-style [description] standing in a [location]. Shot on iPhone, authentic social media vibe, realistic skin texture, 4k.`;
          break;

        default:
          template = `High quality content of [topic]`;
      }

      userContent = `
        Template Alvo: "${template}"
        
        Inputs do Usuário para preencher os colchetes:
        ${Object.entries(inputs).map(([k, v]) => `- [${k}]: ${v}`).join('\n')}
        
        ${goal === 'video' ? `Instrução de Fala/Audio (se aplicável): ${speech}` : ''}
        ${refUrl ? `Reference URL: ${refUrl}` : ''}
        
        IMPORTANTE: 
        Se for VIDEO e tiver mais de 1 cena (${sceneCount}), divida a ação logicalmente em:
        [00-08s] Scene 1...
        [08-16s] Scene 2...
        Caso contrário, retorne apenas o prompt preenchido.
      `;

    } else if (data.isAffiliate && data.affiliateMode) {
      // --- LOGIC FOR AFFILIATE PRO ---
      const role = data.affiliateRole || 'Especialista em Vendas';
      const accent = data.regionalAccent || 'Neutro';
      const commonRules = `Persona: ${role}, Sotaque: ${accent}. Criar conteúdo final pronto para uso.`;

      switch (data.affiliateMode) {
        case AffiliateMode.VAI:
          systemInstruction = `${commonRules} METODOLOGIA VAI: 1. Dor Oculta. 2. Roteiro Narração 15-30s. 3. Gancho -> Dor -> Solução.`;
          userContent = `Roteiro VAI para: "${data.productName}".`;
          break;
        case AffiliateMode.VIRAL:
          systemInstruction = `${commonRules} METODOLOGIA TIKTOK: 1. Roteiro Visual Dinâmico. 2. Cenas Impactantes.`;
          userContent = `Roteiro TikTok para: "${data.productName}". Preço: ${data.productPrice || 'N/A'}.`;
          break;
        case AffiliateMode.OBJECTION:
          systemInstruction = `${commonRules} METODOLOGIA QUEBRA DE OBJEÇÃO: Texto persuasivo matador.`;
          userContent = `Copy para "${data.productName}" matando a objeção: "${data.productObjection}".`;
          break;
        case AffiliateMode.SEO:
          systemInstruction = `${commonRules} METODOLOGIA SEO: 5 opções Título + Tags.`;
          userContent = `SEO para: "${data.productName}".`;
          break;
      }

    } else {
      // --- LOGIC FOR CREATOR ---
      systemInstruction = `Engenheiro de Prompt Sênior. Idioma: ${data.language}.`;
      userContent = `Criar prompt para ${data.targetModel}. Assunto: ${data.topic}. Contexto: ${data.context}. Tom: ${data.tone}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedResult;
    } else {
      throw new Error("Resposta vazia da API.");
    }
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
};
