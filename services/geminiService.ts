
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
    let userContent: any = ''; // Can be string or array for multimodal

    // --- REFINEMENT LOGIC INJECTION ---
    let refinementContext = "";
    if (data.refinementInstruction) {
        refinementContext = `
        \n\n🚨 ATENÇÃO - PEDIDO DE REFINAMENTO (Prioridade Máxima):
        O usuário já gerou um resultado anteriormente, mas solicitou a seguinte ALTERAÇÃO:
        "${data.refinementInstruction}"
        
        Sua tarefa é REFAZER o conteúdo original aplicando estritamente essa mudança, mantendo o restante que não conflitar com a alteração.
        `;
    }

    if (data.isVideo && data.videoMode) {
      // --- LOGIC FOR VEO & VIDEO (TEMPLATE FILLING) ---
      
      // 1. PRODUCT VIDEO (New Feature)
      if (data.videoMode === VideoMode.PRODUCT_VIDEO) {
          systemInstruction = `
            Você é um Especialista em Vídeos Virais para E-commerce (Shopee/TikTok).
            
            TAREFA:
            1. Analise a imagem do produto.
            2. Analise a descrição e o link fornecidos.
            3. Crie 6 VARIAÇÕES DE ROTEIRO VIRAIS usando a metodologia VAI (Verdade, Autoridade, Intenção).
            
            DIRETRIZES DE SEGURANÇA E BRAND SAFETY (CRÍTICO):
            - PROIBIDO CONTEÚDO SEXUAL OU VIOLENTO.
            - SE O PRODUTO FOR ROUPA DE BANHO, LINGERIE OU BIQUÍNI: O PROMPT VISUAL DEVE SEMPRE MOSTRAR O PRODUTO SENDO SEGURADO NAS MÃOS OU EM UM CABIDE/MANEQUIM. NUNCA GERE PROMPTS DE PESSOAS VESTINDO ESSAS PEÇAS.
            - Foco no detalhe do tecido, textura e qualidade.
            
            Contexto:
            - Modelo de Vídeo Alvo: ${data.videoTargetModel || 'Geral'} (Otimize os prompts visuais para este modelo).
            - Estilo da Fala: ${data.videoRole || 'Vendedor'}.
            - Sotaque: ${data.videoAccent || 'Neutro'}.
            - Duração: ${data.videoDuration || 15} segundos por vídeo.
            
            ${refinementContext}

            ESTRUTURA DA RESPOSTA (optimizedPrompt):
            
            Para cada uma das 6 variações, forneça:
            - **Título/Gancho:** (Texto na tela)
            - **Roteiro de Fala:** (O que ser dito, com o sotaque escolhido)
            - **Prompt Visual (Inglês):** (O prompt para gerar o vídeo no ${data.videoTargetModel}, descrevendo o produto e a ação).
            
            Exemplo de formato para cada variação:
            ### Variação 1: [Foco na Dor]
            🗣️ **Fala:** "..."
            🎬 **Prompt Visual (${data.videoTargetModel}):** "Cinematic product shot of [Product] being held by a hand..."
          `;

          if (data.videoFileData) {
              userContent = {
                  parts: [
                      {
                          inlineData: {
                              mimeType: data.videoMimeType || 'image/png',
                              data: data.videoFileData
                          }
                      },
                      { text: `Produto: ${data.videoInputs?.description}. Link: ${data.videoProductLink}. Crie 6 roteiros virais. Atenção às regras de segurança para biquínis. ${data.refinementInstruction ? 'APLIQUE A ALTERAÇÃO SOLICITADA: ' + data.refinementInstruction : ''}` }
                  ]
              };
          } else {
              // Fallback if refining without re-uploading, assumes context is sufficient or cached (in a real app). 
              // For this stateless service, we rely on the text description if image is missing in refinement, 
              // OR the frontend must resend the base64. App.tsx keeps formData state so it should work.
              if (data.refinementInstruction && !data.videoFileData) {
                  userContent = `Refazendo roteiros de produto (${data.videoInputs?.description}) com alteração: ${data.refinementInstruction}`;
              } else {
                  throw new Error("Imagem do produto não fornecida.");
              }
          }

      }
      // 2. REMODELAGEM VIRAL (UPDATED LOGIC)
      else if (data.videoMode === VideoMode.REMODEL_VIRAL) {
          systemInstruction = `
            Você é um Especialista em Engenharia de Prompt para Modelos de Vídeo Generativo (Sora, Kling AI/Flow, Runway).

            TAREFA:
            1. Analise o vídeo enviado (Visual + Áudio/Contexto).
            2. Crie 3 VARIAÇÕES DE REMODELAGEM.
            3. Para cada variação, você deve entregar:
               
               A) **NOVO ROTEIRO (Audio/Fala):** 
                  - Reescreva o conteúdo original.
                  - Mantenha a mesma intenção e estilo, mas mude as palavras (Paráfrase Criativa).
                  - O objetivo é parecer um vídeo "novo" sobre o mesmo assunto.
               
               B) **PROMPTS DE VÍDEO (Inglês):**
                  - Crie um prompt otimizado para **SORA (OpenAI)**: Descritivo, físico, detalhado.
                  - Crie um prompt otimizado para **KLING AI / FLOW**: Focado em movimento e estética.
            
            SEGURANÇA: Se o vídeo original contiver nudez, violência ou biquínis/roupas íntimas sendo vestidas, o prompt deve descrever cenas seguras (ex: produto em flatlay, paisagem, close-up no rosto sem corpo) sem conotação sexual.
            
            ${refinementContext}

            ESTRUTURA DA RESPOSTA (optimizedPrompt):
            
            ### ♻️ Variação 1: [Nome da Abordagem]
            
            🗣️ **Nova Fala Sugerida (PT-BR):**
            "[Texto reescrito aqui...]"
            
            🎬 **Prompt SORA (Inglês):**
            "[Prompt altamente descritivo e físico...]"
            
            🌊 **Prompt KLING/FLOW (Inglês):**
            "[Prompt estético focado em movimento...]"
            
            ---
            (Repita para Variação 2 e 3)
          `;
          
          if (data.videoFileData) {
              userContent = {
                  parts: [
                      {
                          inlineData: {
                              mimeType: data.videoMimeType || 'video/mp4',
                              data: data.videoFileData
                          }
                      },
                      { text: `Analise este vídeo. Quero remodelar ele. Crie novas falas parecidas e os prompts de vídeo para SORA e FLOW. ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}` }
                  ]
              };
          } else {
             if (data.refinementInstruction && !data.videoFileData) {
                 userContent = `Refazendo remodelagem viral com alteração: ${data.refinementInstruction}. (Assumindo contexto anterior)`;
             } else {
                 throw new Error("Vídeo não fornecido para remodelagem.");
             }
          }

      } 
      // 3. STANDARD MODES (Veo / Studio)
      else {
          // --- STANDARD VEO/STUDIO PROMPTS ---
          const inputs = data.videoInputs || {};
          const goal = data.videoGoal || 'video'; // 'image' or 'video'
          const duration = data.videoDuration || 10;
          const speech = data.videoSpeech ? `Speech/Script needed: "${data.videoSpeech}"` : "No specific speech provided.";
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
            
            VERIFICAÇÃO DE SEGURANÇA (SHOPEE/VEO):
            - PROIBIDO gerar prompts com conteúdo sexual, nudez ou violência explícita.
            - PROIBIDO gerar prompts de pessoas vestindo biquínis, lingeries ou roupas íntimas de forma provocativa.
            - CASO O INPUT SEJA SOBRE BIQUÍNIS/LINGERIE: O prompt deve descrever o produto sendo segurado na mão, em um cabide, ou em "flatlay" (sobre a mesa), NUNCA vestido em uma modelo.
            
            ${refinementContext}
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
            
            ${goal === 'video' ? `Target Duration: ${duration} seconds.` : ''}
            ${goal === 'video' ? `Instrução de Fala/Audio (Narration): ${speech}` : ''}
            ${refUrl ? `Reference URL: ${refUrl}` : ''}
            
            IMPORTANTE: 
            Se for VIDEO e tiver mais de 1 cena (${sceneCount}), divida a ação logicamente para caber em ${duration} segundos totais:
            [00-${Math.floor(duration/sceneCount)}s] Scene 1...
            Caso contrário, retorne apenas o prompt preenchido.
            
            LEMBRE-SE: Se o input contiver biquíni/lingerie, altere o prompt para mostrar o produto na mão ou cabide, nunca vestido.
            
            ${data.refinementInstruction ? `ALTERAÇÃO SOLICITADA: ${data.refinementInstruction}` : ''}
          `;
      }

    } else if (data.isAffiliate && data.affiliateMode) {
      // --- LOGIC FOR AFFILIATE PRO & ANALYZER ---
      const role = data.affiliateRole || 'Especialista em Vendas';
      const accent = data.regionalAccent || 'Neutro';
      
      const SHOPEE_RULES = `
        CRÍTICO - DIRETRIZES DA SHOPEE (VERIFICAR ANTES DE GERAR):
        1. É PROIBIDO fazer promessas falsas ou exageradas (ex: "cura milagrosa", "dinheiro fácil").
        2. O produto deve ser permitido na plataforma.
        3. NÃO USE linguagem ofensiva ou discriminatória.
        4. Respeite direitos autorais.
        5. O conteúdo deve parecer autêntico e confiável.
        6. SEGURANÇA VISUAL: Para produtos como BIQUÍNIS, ROUPAS DE BANHO ou LINGERIE, o roteiro/prompt visual DEVE descrever o produto sendo mostrado na mão, em cima de uma mesa ou em um cabide. NUNCA sugira cenas de pessoas vestindo essas peças de forma sensual ou explícita.
        SE O TEMA VIOLAR ISSO, ALERTE O USUÁRIO NA EXPLICAÇÃO.
      `;

      const commonRules = `Persona: ${role}, Sotaque: ${accent}. Criar conteúdo final pronto para uso. ${SHOPEE_RULES} ${refinementContext}`;

      switch (data.affiliateMode) {
        case AffiliateMode.VAI:
          const vaiDuration = data.affiliateDuration || 15;
          const wordCount = Math.floor(vaiDuration * 2.5); // Approx 2.5 words/sec
          
          systemInstruction = `
             ${commonRules} 
             METODOLOGIA VAI (Verdade, Autoridade, Intenção).
             IMPORTANTE: A narração deve durar EXATAMENTE ${vaiDuration} SEGUNDOS (Aprox ${wordCount} palavras).
             Estrutura:
             1. Verdade (Conexão/Dor)
             2. Autoridade (Solução/Produto)
             3. Intenção (CTA)
          `;
          userContent = `Crie um Roteiro VAI para: "${data.productName}". Duração Obrigatória: ${vaiDuration} segundos. ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}`;
          break;
          
        case AffiliateMode.VIRAL:
          systemInstruction = `${commonRules} METODOLOGIA TIKTOK: 1. Roteiro Visual Dinâmico. 2. Cenas Impactantes.`;
          userContent = `Roteiro TikTok para: "${data.productName}". Preço: ${data.productPrice || 'N/A'}. ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}`;
          break;
        case AffiliateMode.OBJECTION:
          systemInstruction = `${commonRules} METODOLOGIA QUEBRA DE OBJEÇÃO: Texto persuasivo matador.`;
          userContent = `Copy para "${data.productName}" matando a objeção: "${data.productObjection}". ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}`;
          break;
        case AffiliateMode.SEO:
          systemInstruction = `${commonRules} METODOLOGIA SEO: 5 opções Título + Tags.`;
          userContent = `SEO para: "${data.productName}". ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}`;
          break;
        case AffiliateMode.ANALYZER:
          systemInstruction = `
            Você é um Engenheiro de IA especialista em Viralização e Vendas na Shopee.
            Análise o vídeo fornecido e faça a Engenharia Reversa dele.
            1. Identifique o GANCHO visual e verbal.
            2. Identifique a DOR/PROBLEMA atacado.
            3. Identifique a CHAMADA PARA AÇÃO (CTA).
            
            Com base nisso, crie 6 NOVAS VARIAÇÕES de Roteiro usando a metodologia VAI (Verdade, Autoridade, Intenção/Interesse):
            - Variação 1 e 2: Foco em Dor Oculta (Problema que a pessoa não sabia que tinha).
            - Variação 3 e 4: Foco em Benefício Imediato (Transformação rápida).
            - Variação 5 e 6: Foco em Curiosidade/Polêmica (Quebra de padrão).
            
            Persona: ${role}. Formato: Lista estruturada de 6 roteiros prontos para gravar.
            ${SHOPEE_RULES}
            ${refinementContext}
          `;
          
          if (data.analyzerVideoData) {
            userContent = {
                parts: [
                    { 
                        inlineData: {
                            mimeType: data.analyzerMimeType || 'video/mp4',
                            data: data.analyzerVideoData
                        }
                    },
                    { text: `Analise este vídeo da concorrência e crie as 6 variações VAI seguindo o padrão identificado, mas melhorado. ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}` }
                ]
            };
          } else {
             if (data.refinementInstruction && !data.analyzerVideoData) {
                 userContent = `Refazendo análise com alteração: ${data.refinementInstruction} (Assumindo contexto)`;
             } else {
                 userContent = "Analise o vídeo (Erro: Nenhum dado de vídeo recebido).";
             }
          }
          break;
      }

    } else {
      // --- LOGIC FOR CREATOR ---
      systemInstruction = `Engenheiro de Prompt Sênior. Idioma: ${data.language}. ${refinementContext}`;
      userContent = `Criar prompt para ${data.targetModel}. Assunto: ${data.topic}. Contexto: ${data.context}. Tom: ${data.tone}. ${data.refinementInstruction ? 'ALTERAÇÃO: ' + data.refinementInstruction : ''}`;
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
