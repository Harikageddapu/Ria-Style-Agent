import { Type } from '@google/genai';
import { generateContentWithRetry } from './gemini';
import { StyleRecommendations, VisionAnalysis } from '../src/types';

function getEditorialFallback(vision: Partial<VisionAnalysis>): StyleRecommendations {
  const gType = (vision.garmentType || '').toLowerCase();
  const cat = (vision.category || '').toLowerCase();

  // 1. Slip Dress / Dresses Fallback
  if (cat === 'dresses' || gType.includes('dress') || gType.includes('slip')) {
    return {
      concept: 'Liquid minimalism countered by masculine tailoring and clean monochromatic hardware.',
      aestheticTagline: '90s evening nonchalance meeting modern European precision.',
      stylingTips: [
        'Drape a structured oversized wool blazer across the bare shoulders for contrast.',
        'Contrast the lustrous satin finish with raw-edged denim or brushed wool outerwear.',
        'Keep jewelry sculptural and organic—opt for silver cuffs and clean collarbones.',
        'Layer over a sheer mesh long-sleeve or under a chunky cable knit for day-to-night versatility.',
      ],
      pairings: [
        {
          category: 'Outerwear',
          item: 'Oversized Double-Breasted Wool Blazer',
          whyItWorks: 'The boxy masculine shoulder line grounds the sensual fluid drape of the bias-cut satin.',
          colorHarmony: 'Deep charcoal or matte black highlights the satin liquid sheen.',
          silhouetteBalance: 'Structured angular box above, fluid vertical line below.',
        },
        {
          category: 'Footwear',
          item: 'Pointed Nappa Kitten-Heel Slingbacks',
          whyItWorks: 'Sharp pointed toe echoes 90s minimalism without sacrificing modern comfort.',
          colorHarmony: 'Patent onyx or rich burgundy adds tonal depth.',
          silhouetteBalance: 'Sleek foot silhouette peeking cleanly beneath the midi hem.',
        },
        {
          category: 'Bag & Accents',
          item: 'Sculptural Minimalist Shoulder Bag',
          whyItWorks: 'Echoes the clean geometric lines of European runway editorials.',
          colorHarmony: 'Brushed metallic silver or espresso leather.',
          silhouetteBalance: 'Tucked compactly under the arm.',
        },
        {
          category: 'Layering',
          item: 'Ultra-Fine Cashmere Crewneck (Shoulder Wrap)',
          whyItWorks: 'Tied casually across the chest for a nonchalant Parisian attitude.',
          colorHarmony: 'Oatmeal or butter cream softens the monochrome base.',
          silhouetteBalance: 'Adds horizontal shoulder dimension over a narrow slip frame.',
        },
      ],
      accessoryAdvice: {
        shoes: 'Sharp pointed slingback kitten heels or minimal two-strap leather sandals.',
        bag: 'Curved sculptural shoulder bag with subtle brushed silver hardware.',
        jewelry: 'Single sculptural silver ear cuff and flat liquid snake chain necklace.',
        eyewearOrBelt: 'Narrow 90s oval wire-frame sunglasses.',
      },
      occasions: [
        {
          title: 'Cocktail Soirée & Rooftop Terrace',
          setting: 'Low-lit metropolitan cocktail lounge overlooking city architecture.',
          vibe: 'Effortless, sensual, contemporary elegance.',
          stylingNote: 'Blazer worn unbuttoned over bare shoulders with bold glossy lip.',
        },
        {
          title: 'Contemporary Art Opening',
          setting: 'White-cube gallery vernissage or design museum biennial.',
          vibe: 'Cultured, modern, architectural.',
          stylingNote: 'Pair with flat chunky loafers and oversized boxy blazer for an intellectual edge.',
        },
        {
          title: 'Intimate Candlelit Bistro',
          setting: 'Boutique bistro with natural wine and ambient lighting.',
          vibe: 'Understated Parisian romance.',
          stylingNote: 'Slip dress worn solo with delicate gold rings and kitten heels.',
        },
      ],
      dayToNight: {
        day: 'Layer a crewneck knit sweater over the slip dress with chunky combat boots and a leather tote.',
        nightTransition: 'Shed the knit to reveal the satin slip, switch into pointed slingbacks, and add bold silver jewelry.',
      },
      colorPaletteAdvice: [
        'Midnight & Charcoal: High-contrast tactile minimalism.',
        'Black Satin & Butter Yellow: Runway-inspired unexpected pairing.',
        'Monochrome & Silver Hardware: Cool-toned industrial sophistication.',
      ],
    };
  }

  // 2. Trench / Raincoat Fallback
  if (cat === 'outerwear' && (gType.includes('trench') || gType.includes('gabardine'))) {
    return {
      concept: 'Continental utilitarian shield paired with relaxed tailoring and elevated neutrals.',
      aestheticTagline: 'Architectural weatherproofing with effortless Parisian poise.',
      stylingTips: [
        'Knot the belt tightly at the waist while leaving lapels open for an hour-glass architectural drape.',
        'Turn up collar and push gabardine sleeves up to the elbow over knitwear.',
        'Layer over monochromatic tonal base layers to create an elongated silhouette.',
        'Pair sand khaki with rich espresso leather for refined tonal contrast.',
      ],
      pairings: [
        {
          category: 'Knitwear',
          item: 'Fine-Rib Cashmere Mock Neck Sweater',
          whyItWorks: 'Provides a clean neckline that sits proudly inside the trench storm collar.',
          colorHarmony: 'Oatmeal or deep cream complements warm sand khaki.',
          silhouetteBalance: 'Fitted profile balances the generous outerwear volume.',
        },
        {
          category: 'Bottoms',
          item: 'Wide-Leg Pleated Tailored Trousers',
          whyItWorks: 'Maintains fluid movement below the belted mid-section of the coat.',
          colorHarmony: 'Charcoal slate or warm ecru harmonizes seamlessly.',
          silhouetteBalance: 'Wide hem puddles gracefully over pointed boots.',
        },
        {
          category: 'Footwear',
          item: 'Square-Toe Leather Chelsea Boots',
          whyItWorks: 'Sturdy weather-resistant leather with a sharp runway-inspired square toe.',
          colorHarmony: 'Deep espresso brown leather.',
          silhouetteBalance: 'Grounds the voluminous trench hemline.',
        },
        {
          category: 'Accessories',
          item: 'Oversized Smooth Leather Tote',
          whyItWorks: 'Architectural leather bag suited for work essentials and city travel.',
          colorHarmony: 'Rich cognac or deep black.',
          silhouetteBalance: 'Carried in the crook of the arm against the trench.',
        },
      ],
      accessoryAdvice: {
        shoes: 'Square-toe Chelsea boots or chunky minimal penny loafers.',
        bag: 'Slouchy oversized tote or structured leather baguette.',
        jewelry: 'Heavy tubular gold hoops and a masculine signet ring.',
        eyewearOrBelt: 'Chunky tortoiseshell square acetate sunglasses.',
      },
      occasions: [
        {
          title: 'Autumnal City Commute & Cafe',
          setting: 'Tree-lined boulevard, artisanal espresso bar, and morning rain.',
          vibe: 'Cinematic, thoughtful, sophisticated.',
          stylingNote: 'Trench buttoned with collar turned up and umbrella in hand.',
        },
        {
          title: 'Weekend Farmer’s Market & Gallery',
          setting: 'Open-air market followed by an afternoon gallery walk.',
          vibe: 'Relaxed continental off-duty.',
          stylingNote: 'Worn unbuttoned over relaxed denim and a crisp white tee.',
        },
        {
          title: 'Business Travel Rendezvous',
          setting: 'First-class terminal and boutique hotel lobby.',
          vibe: 'Polished transatlantic executive.',
          stylingNote: 'Belted sharply over tailored trousers and pointed ankle boots.',
        },
      ],
      dayToNight: {
        day: 'Knot the belt loosely at the back, wear with sneakers and a soft knit for city exploration.',
        nightTransition: 'Cinch the belt tightly at the natural waist as a statement dress-coat, and step into sleek pointed heels.',
      },
      colorPaletteAdvice: [
        'Khaki & Espresso: Rich equestrian tonal harmony.',
        'Sand & Optic White: Fresh spring brightness with crisp contrast.',
        'Khaki & Burgundy: Deep autumnal sophistication.',
      ],
    };
  }

  // 3. Trousers / Bottoms Fallback
  if (cat === 'bottoms' || gType.includes('trouser') || gType.includes('pant')) {
    return {
      concept: 'High-waisted columnar volume celebrating fluid drape and relaxed sartorial dignity.',
      aestheticTagline: 'Unstudied tailoring anchoring effortless modern luxury.',
      stylingTips: [
        'Tuck shirts or knits fully into the high waistband to accentuate the pleated silhouette.',
        'Add a slender dark leather belt with a brushed metal buckle to define the waistline.',
        'Ensure trousers break gently once over the instep of pointed footwear.',
        'Balance wide proportions with a fitted or slightly cropped top silhouette.',
      ],
      pairings: [
        {
          category: 'Tops',
          item: 'Crisp Poplin Button-Down or Fine Merino Knit',
          whyItWorks: 'High contrast architectural tailoring that tucks seamlessly without waistband bulk.',
          colorHarmony: 'Optic white, sky blue, or deep charcoal against ecru trousers.',
          silhouetteBalance: 'Fitted torso creates an elongated hourglass frame.',
        },
        {
          category: 'Outerwear',
          item: 'Boxy Cropped Double-Breasted Jacket',
          whyItWorks: 'Cropped hem hits exactly at the high trouser waist, creating endless leg lines.',
          colorHarmony: 'Tonal beige, slate, or chocolate wool blend.',
          silhouetteBalance: 'Angular box atop fluid flowing columns.',
        },
        {
          category: 'Footwear',
          item: 'Chunky Leather Loafers or Pointed Slingbacks',
          whyItWorks: 'Allows the generous trouser hem to break cleanly with confident stance.',
          colorHarmony: 'Polished black calfskin or oxblood.',
          silhouetteBalance: 'Extends the visual line down to the floor.',
        },
        {
          category: 'Bag & Accents',
          item: 'Asymmetric Leather Crossbody / Pouch',
          whyItWorks: 'Soft architectural geometry that balances the sharp front pleats.',
          colorHarmony: 'Cognac leather or deep olive.',
          silhouetteBalance: 'Slung across the body at hip height.',
        },
      ],
      accessoryAdvice: {
        shoes: 'Pointed slingbacks for formal events; chunky penny loafers for daytime.',
        bag: 'Minimalist leather hobo bag or structured envelope clutch.',
        jewelry: 'Clean brass or silver cuff bracelets and minimal huggie earrings.',
        eyewearOrBelt: 'Skinny croc-embossed black belt with polished silver hardware.',
      },
      occasions: [
        {
          title: 'Creative Agency Pitch & Lunch',
          setting: 'Loft design boardroom and terrace luncheon.',
          vibe: 'Artistic, confident, impeccably curated.',
          stylingNote: 'Tucked poplin shirt with rolled sleeves and pointed loafers.',
        },
        {
          title: 'Weekend Botanical Garden & Brunch',
          setting: 'Sunlit conservatory cafe and courtyard brunch.',
          vibe: 'Carefree quiet luxury.',
          stylingNote: 'Styled with a loose cashmere tee and minimal slide sandals.',
        },
        {
          title: 'Evening Jazz Bar & Dining',
          setting: 'Intimate subterranean jazz club.',
          vibe: 'Sophisticated moody elegance.',
          stylingNote: 'Paired with a draped silk halter top and pointed slingbacks.',
        },
      ],
      dayToNight: {
        day: 'Pair with flat leather loafers and an oversized linen shirt for daytime ease.',
        nightTransition: 'Swap the shirt for a sheer draped top, slip into kitten heels, and add a bold ear cuff.',
      },
      colorPaletteAdvice: [
        'Ecru & Espresso: Natural quiet luxury with rich depth.',
        'Ecru & Charcoal: High-contrast modern Scandinavian graphic feel.',
        'Tonal Chalk & Butter Cream: Luminous warm-weather monochrome.',
      ],
    };
  }

  // 4. Default Tailored Blazer Fallback
  return {
    concept: 'Architectural volumes juxtaposed against fluid tailoring, celebrating European nonchalance.',
    aestheticTagline: 'Unstudied tailoring for the contemporary metropolis.',
    stylingTips: [
      'Push sleeves up the forearm to reveal minimalist gold or silver hardware cuffs.',
      'Pair oversized proportions with crisp, straight-down vertical lines to elongate the silhouette.',
      'Contrast matte wool or cotton textures with luminous satin or patent leather accessories.',
      'Leave outer buttons undone when moving to create dynamic fluid movement.',
    ],
    pairings: [
      {
        category: 'Bottoms',
        item: 'Pleated Ecru Wide-Leg Trousers',
        whyItWorks: 'Softens the structured shoulder line while maintaining high-fashion editorial proportions.',
        colorHarmony: 'Warm ecru counters the cool slate undertone with subtle tonal balance.',
        silhouetteBalance: 'Wide-leg hem pools cleanly over pointed slingbacks or chunky loafers.',
      },
      {
        category: 'Inner Layer',
        item: 'Crisp Poplin Structural Shirt or Ribbed Cashmere Knit',
        whyItWorks: 'Provides a clean architectural neckline without adding bulk under tailored sleeves.',
        colorHarmony: 'Optic white gives high contrast; oat heather softens the ensemble.',
        silhouetteBalance: 'Tucked cleanly into high-waisted bottoms for an uninterrupted waistline.',
      },
      {
        category: 'Footwear',
        item: 'Pointed Nappa Leather Kitten-Heel Slingbacks',
        whyItWorks: 'Adds sharp feminine counter-weight to masculine-cut oversized tailoring.',
        colorHarmony: 'Deep onyx patent leather draws the eye downwards.',
        silhouetteBalance: 'Pointed toe emerges sleekly from underneath wide trouser hemlines.',
      },
      {
        category: 'Bag & Accents',
        item: 'Sculptural Asymmetric Shoulder Bag',
        whyItWorks: 'Echoes the architectural lines of Ria lookbooks.',
        colorHarmony: 'Espresso or dark burgundy leather pairs effortlessly.',
        silhouetteBalance: 'Tucked under the arm, resting cleanly at mid-rib level.',
      },
    ],
    accessoryAdvice: {
      shoes: 'Pointed slingback kitten heels in glossy black nappa leather or minimal chunky loafers.',
      bag: 'Curved sculptural shoulder bag with subtle brushed silver hardware.',
      jewelry: 'Chunky organic silver hoop earrings and a flat herringbone chain collar.',
      eyewearOrBelt: 'Narrow 90s-inspired acetate sunglasses in tortoiseshell or matte black.',
    },
    occasions: [
      {
        title: 'Art Basel / Gallery Opening',
        setting: 'White-cube exhibition space or contemporary museum terrace.',
        vibe: 'Cultured, intellectual, effortlessly curated.',
        stylingNote: 'Drape blazer over the shoulders with bare wrists and sculptural silver earrings.',
      },
      {
        title: 'Creative Boardroom to Soho Dinner',
        setting: 'Downtown design studio followed by a dimly lit bistro.',
        vibe: 'Commanding yet approachable sartorial confidence.',
        stylingNote: 'Buttoned loosely over a silk knit top with tailored pleated trousers.',
      },
      {
        title: 'Weekend European City Break',
        setting: 'Cobblestone streets, artisanal espresso bars, and indie bookshops.',
        vibe: 'Carefree quiet luxury.',
        stylingNote: 'Style with wide-leg relaxed denim, crisp white tee, and leather crossbody.',
      },
    ],
    dayToNight: {
      day: 'Style over an oversized poplin shirt, relaxed ecru trousers, and flat leather loafers for structured city daytime elegance.',
      nightTransition: 'Swap the shirt for a delicate silk slip or lace bralette, slip into pointed kitten heels, and apply a bold berry lip.',
    },
    colorPaletteAdvice: [
      'Slate & Ecru: Clean Scandinavian balance with organic warmth.',
      'Charcoal & Burgundy: Deep sensual autumn contrast.',
      'Cool Grey & Butter Yellow: Runway-inspired accent pairing.',
    ],
  };
}

export async function getStyleRecommendations(
  vision: Partial<VisionAnalysis> & { userPreferences?: string }
): Promise<StyleRecommendations> {
  const systemInstruction = `You are the Head Editorial Stylist for Ria Style Agent.
Your voice is that of a Campaign Director: chic, minimalist, forward-thinking, effortless, and grounded in European high-street elegance.
Create an avant-garde yet wearable styling guide for the analyzed garment.
Provide:
- concept: an evocative artistic summary of the look
- aestheticTagline: a punchy editorial tagline
- stylingTips: 4 concrete styling techniques (e.g. cuff roll, collar pop, half-tuck, belt layering)
- pairings: 4 complementary wardrobe items with reasoning, color harmony, and silhouette balance
- accessoryAdvice: specific footwear, handbag, and jewelry recommendations
- occasions: 3 curated high-fashion occasions with settings and styling notes
- dayToNight: practical instructions for transitioning the outfit from daytime to nighttime
- colorPaletteAdvice: 3-4 notes on which complementary tones (e.g., ecru, butter yellow, espresso, silver hardware) balance this garment best.`;

  const prompt = `Styling request for:
Garment: ${vision.garmentType || 'Contemporary garment'}
Category: ${vision.category || 'outerwear'}
Color: ${vision.color?.primary || 'neutral'} (${vision.color?.undertone || 'balanced'})
Style: ${vision.style || 'Minimalist'}
Occasion: ${vision.occasion || 'Smart Casual'}
Material: ${vision.material || 'Structured weave'}
Fit: ${vision.fit || 'Relaxed'}
Details: ${vision.details?.join(', ') || 'Clean lines'}
User Preferences: ${vision.userPreferences || 'Classic European editorial'}`;

  try {
    const response = await generateContentWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            aestheticTagline: { type: Type.STRING },
            stylingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            pairings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  item: { type: Type.STRING },
                  whyItWorks: { type: Type.STRING },
                  colorHarmony: { type: Type.STRING },
                  silhouetteBalance: { type: Type.STRING },
                },
                required: ['category', 'item', 'whyItWorks', 'colorHarmony', 'silhouetteBalance'],
              },
            },
            accessoryAdvice: {
              type: Type.OBJECT,
              properties: {
                shoes: { type: Type.STRING },
                bag: { type: Type.STRING },
                jewelry: { type: Type.STRING },
                eyewearOrBelt: { type: Type.STRING },
              },
              required: ['shoes', 'bag', 'jewelry'],
            },
            occasions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  setting: { type: Type.STRING },
                  vibe: { type: Type.STRING },
                  stylingNote: { type: Type.STRING },
                },
                required: ['title', 'setting', 'vibe', 'stylingNote'],
              },
            },
            dayToNight: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                nightTransition: { type: Type.STRING },
              },
              required: ['day', 'nightTransition'],
            },
            colorPaletteAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'concept',
            'aestheticTagline',
            'stylingTips',
            'pairings',
            'accessoryAdvice',
            'occasions',
            'dayToNight',
            'colorPaletteAdvice',
          ],
        },
      },
    });

    if (response && response.text) {
      return JSON.parse(response.text) as StyleRecommendations;
    }
  } catch (err: any) {
    console.warn('Gemini styling model temporarily unavailable; utilizing tailored editorial recommendations.');
  }

  return getEditorialFallback(vision);
}
