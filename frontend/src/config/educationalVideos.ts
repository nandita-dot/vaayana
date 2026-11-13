export interface EducationalVideoConfig {
  id: string;
  chapterId: string;
  titleEn: string;
  titleMl: string;
  descriptionEn: string;
  descriptionMl: string;
  youtubeId?: string;
  isPlaceholder?: boolean;
  placeholderMessageEn?: string;
  placeholderMessageMl?: string;
  topic: string;
}

export const EDUCATIONAL_VIDEOS: Record<string, EducationalVideoConfig> = {
  'ch1_states_of_matter': {
    id: 'ch1_states_of_matter',
    chapterId: 'scert-std4-evs-around-us-different-forms',
    titleEn: 'Three States of Matter: Solid, Liquid & Gas',
    titleMl: 'പദാർത്ഥത്തിന്റെ മൂന്ന് അവസ്ഥകൾ: ഖരം, ദ്രാവകം, വാതകം',
    descriptionEn: 'Observe how ice, water and water vapour transition between states through heating and cooling in nature.',
    descriptionMl: 'ചൂടാക്കുമ്പോഴും തണുപ്പിക്കുമ്പോഴും മഞ്ഞുകട്ട, വെള്ളം, നീരാവി എന്നിവ തമ്മിലുള്ള അവസ്ഥാന്തരങ്ങൾ കാണുക.',
    isPlaceholder: true,
    placeholderMessageEn: 'Teacher will add video for States of Matter experiment',
    placeholderMessageMl: 'അവസ്ഥാന്തരം സംബന്ധിച്ച വീഡിയോ അധ്യാപകർ പിന്നീട് ചേർക്കും',
    topic: 'States of Matter'
  },
  'ch2_solar_system': {
    id: 'ch2_solar_system',
    chapterId: 'scert-std4-evs-marvels-of-the-sky',
    titleEn: 'Marvels of the Solar System & Planetary Motion',
    titleMl: 'സൗരയൂഥവും ഗ്രഹങ്ങളുടെ പരിക്രമണവും',
    descriptionEn: 'Reserved dedicated slot for Solar System simulation video. Teacher will provide the specific YouTube link.',
    descriptionMl: 'സൗരയൂഥ പഠനത്തിനായി നീക്കിവെച്ച വീഡിയോ വിഭാഗം. അധ്യാപകർ പിന്നീട് യുട്യൂബ് ലിങ്ക് നൽകും.',
    isPlaceholder: true,
    placeholderMessageEn: 'Teacher will add video (Reserved for Solar System Simulation)',
    placeholderMessageMl: 'അധ്യാപകർ വീഡിയോ ലിങ്ക് നൽകും (സൗരയൂഥ സിമുലേഷനായി നീക്കിവെച്ചത്)',
    topic: 'Solar System & Moon'
  },
  'ch3_directions_homeland': {
    id: 'ch3_directions_homeland',
    chapterId: 'scert-std4-evs-directions-homeland',
    titleEn: 'Know the Directions & Know Our Homeland',
    titleMl: 'ദിശകൾ അറിയാം, നാടറിയാം',
    descriptionEn: 'Discover GPS satellite navigation, magnetic compass orientation, map symbols, and Kerala’s rivers and backwaters.',
    descriptionMl: 'ദിശകൾ, കാന്തിക കോമ്പസ്, ഭൂപട ചിഹ്നങ്ങൾ, കേരളത്തിലെ നദികളും കായലുകളും.',
    isPlaceholder: true,
    placeholderMessageEn: 'Teacher will add video for Directions & Kerala Geography',
    placeholderMessageMl: 'ദിശകളും കേരളത്തിന്റെ ഭൂപ്രകൃതിയും സംബന്ധിച്ച വീഡിയോ അധ്യാപകർ പിന്നീട് ചേർക്കും',
    topic: 'Directions & Homeland'
  }
};

export function getVideoConfigForChapter(chapterId: string): EducationalVideoConfig | undefined {
  return Object.values(EDUCATIONAL_VIDEOS).find(v => v.chapterId === chapterId);
}

