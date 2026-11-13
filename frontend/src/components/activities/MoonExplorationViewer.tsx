import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playCorrectSound } from '../../services/soundService';
import { Sparkles, MapPin, Compass, BookOpen, Flag, Info } from 'lucide-react';

interface LunarFeature {
  id: string;
  nameEn: string;
  nameMl: string;
  category: 'crater' | 'mountain' | 'maria' | 'landing';
  x: number; // percentage
  y: number; // percentage
  descEn: string;
  descMl: string;
  factEn: string;
  factMl: string;
}

const LUNAR_FEATURES: LunarFeature[] = [
  {
    id: 'tycho_crater',
    nameEn: 'Tycho Crater',
    nameMl: 'ടൈക്കോ ഗർത്തം (Tycho Crater)',
    category: 'crater',
    x: 48,
    y: 78,
    descEn: 'Prominent 85 km wide impact crater with magnificent bright rays stretching across thousands of kilometres.',
    descMl: '85 കിലോമീറ്റർ വീതിയുള്ള പ്രശസ്തമായ വലിയ ഉൽക്കാ ഗർത്തം. ഇതിൽ നിന്നുള്ള പ്രകാശരശ്മികൾ ആയിരക്കണക്കിന് കിലോമീറ്റർ നീളത്തിൽ കാണാം.',
    factEn: 'Formed by asteroid collision ~108 million years ago.',
    factMl: 'ഏകദേശം 10.8 കോടി വർഷം മുമ്പ് ഒരു ഉൽക്ക പതിച്ചാണ് ഈ ഗർത്തം ഉണ്ടായത്.'
  },
  {
    id: 'sea_of_tranquility',
    nameEn: 'Sea of Tranquility (Mare Tranquillitatis)',
    nameMl: 'പ്രശാന്ത സമുദ്രം (Sea of Tranquility)',
    category: 'landing',
    x: 65,
    y: 38,
    descEn: 'Dark basaltic volcanic plain where Apollo 11 landed in July 1969, and Neil Armstrong took mankind’s first steps.',
    descMl: '1969 ജൂലൈയിൽ അപ്പോളോ 11 ഇറങ്ങിയ ഇടം. നീൽ ആംസ്ട്രോംഗ് മനുഷ്യന്റെ ആദ്യ കാൽപ്പാട് പതിപ്പിച്ച ചരിത്ര ഭൂമി.',
    factEn: 'Despite the name "Sea", there is no liquid water on the surface!',
    factMl: 'കടൽ എന്ന് വിളിക്കുന്നുവെങ്കിലും ഇവിടെ ദ്രാവക രൂപത്തിൽ ഒട്ടും വെള്ളമില്ല! പുരാതന ലാവ തണുത്തുറഞ്ഞ ഇരുണ്ട സമതലമാണിത്.'
  },
  {
    id: 'copernicus_crater',
    nameEn: 'Copernicus Crater',
    nameMl: 'കോപ്പർനിക്കസ് ഗർത്തം',
    category: 'crater',
    x: 32,
    y: 42,
    descEn: 'Gigantic crater with terraced walls nearly 4 km deep, visible even through small classroom telescopes.',
    descMl: 'നാല് കിലോമീറ്റർ ആഴമുള്ള പടവുകളോടുകൂടിയ വലിയ ഗർത്തം. ചെറിയ ടെലിസ്കോപ്പിലൂടെയും കാണാം.',
    factEn: 'Named after Nicolaus Copernicus, who showed Earth revolves around the Sun.',
    factMl: 'സൂര്യകേന്ദ്ര സിദ്ധാന്തം അവതരിപ്പിച്ച കോപ്പർനിക്കസിന്റെ പേരിൽ അറിയപ്പെടുന്നു.'
  },
  {
    id: 'lunar_apennines',
    nameEn: 'Montes Apenninus (Lunar Mountains)',
    nameMl: 'ചാന്ദ്ര മലനിരകൾ (Lunar Mountains)',
    category: 'mountain',
    x: 44,
    y: 32,
    descEn: 'Rugged lunar mountain range rising more than 5,000 metres (over 5 km) high, with no wind or rain to erode them.',
    descMl: '5000 മീറ്ററിലധികം ഉയരമുള്ള കുത്തനെയുള്ള പർവ്വതനിരകൾ. വായുവോ മഴയോ ഇല്ലാത്തതിനാൽ ഇവയ്ക്ക് തേയ്മാനം സംഭവിക്കുന്നില്ല.',
    factEn: 'Taller than most mountains on Earth!',
    factMl: 'ഭൂമിയിലെ പല ഉയർന്ന മലനിരകളെക്കാളും ഉയരമുണ്ട്.'
  }
];

export const MoonExplorationViewer: React.FC = () => {
  const { language } = useLanguage();

  const [selectedFeature, setSelectedFeature] = useState<LunarFeature>(LUNAR_FEATURES[1]); // Default Apollo 11 landing site
  const [activeTab, setActiveTab] = useState<'map' | 'science'>('map');

  const handleSelect = (feat: LunarFeature) => {
    playClickSound();
    setSelectedFeature(feat);
  };

  return (
    <div className="bg-vaayana-darkSurface border border-vaayana-darkBorder rounded-3xl p-6 sm:p-8 space-y-6 shadow-darkCard">
      
      {/* Activity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
            EVS • Chapter 2 Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-2 font-malayalam">
            {language === 'ml' ? 'ചാന്ദ്ര പര്യവേക്ഷണം (Moon Exploration & Features)' : 'Moon Exploration & Lunar Geology'}
          </h3>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted">
            {language === 'ml' 
              ? 'ചന്ദ്രന്റെ ഉപരിതലത്തിലെ ഗർത്തങ്ങൾ, പർവ്വതങ്ങൾ, മനുഷ്യൻ ആദ്യമായി കാലുകുത്തിയ ഇടം എന്നിവ കണ്ടെത്തുക.' 
              : 'Explore lunar craters, mountain ranges, and Apollo landing sites.'}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => { playClickSound(); setActiveTab('map'); }}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'map' ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' : 'bg-vaayana-darkElevated text-vaayana-textLight border border-vaayana-darkBorder'
            }`}
          >
            {language === 'ml' ? 'ഉപരിതല ഭൂപടം (Surface Map)' : 'Surface Map'}
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab('science'); }}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'science' ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow' : 'bg-vaayana-darkElevated text-vaayana-textLight border border-vaayana-darkBorder'
            }`}
          >
            {language === 'ml' ? 'സെലനോളജി vs സെലനോഗ്രാഫി' : 'Selenology vs Selenography'}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeTab === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Moon Surface Interactive Graphic with Hotspots (7 Cols) */}
          <div className="lg:col-span-7 bg-[#090E0A] rounded-3xl p-6 border border-vaayana-darkBorder shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[420px]">
            
            {/* The Moon Sphere Container */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-4 border-slate-500 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden">
              
              {/* Dark Lunar Seas (Maria) Texture */}
              <div className="absolute top-[28%] right-[18%] w-36 h-28 rounded-full bg-slate-500/40 blur-sm transform rotate-12" />
              <div className="absolute top-[42%] left-[22%] w-32 h-24 rounded-full bg-slate-500/35 blur-sm" />
              <div className="absolute bottom-[20%] left-[30%] w-24 h-20 rounded-full bg-slate-500/30 blur-sm" />

              {/* Surface Crater Depressions */}
              <div className="absolute bottom-[16%] left-[46%] w-12 h-12 rounded-full border-2 border-slate-600 bg-slate-400/50 shadow-inner" />
              <div className="absolute top-[38%] left-[28%] w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-400/50 shadow-inner" />

              {/* Interactive Feature Hotspots */}
              {LUNAR_FEATURES.map((feat) => {
                const isSelected = feat.id === selectedFeature.id;
                return (
                  <button
                    key={feat.id}
                    onClick={() => handleSelect(feat)}
                    style={{ left: `${feat.x}%`, top: `${feat.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-vaayana-lime text-vaayana-dark scale-125 ring-4 ring-vaayana-lime/50 shadow-lg'
                        : 'bg-vaayana-dark text-white hover:scale-110 border border-white/50'
                    }`}>
                      {feat.category === 'landing' ? <Flag className="w-4 h-4 fill-current" /> :
                       feat.category === 'mountain' ? <span className="text-xs font-black">⛰️</span> :
                       <MapPin className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}

            </div>

          </div>

          {/* Right: Selected Feature Deep Dive Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-3xl bg-vaayana-darkElevated border border-vaayana-darkBorder shadow-darkCard space-y-4">
              <div className="flex items-center justify-between border-b border-vaayana-darkBorder pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vaayana-lime/20 text-vaayana-lime flex items-center justify-center text-lg font-black">
                    {selectedFeature.category === 'landing' ? '🚀' : '🌕'}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-vaayana-lime">
                      {selectedFeature.category === 'landing' ? 'Apollo 11 Landing Site' : 'Lunar Geographical Feature'}
                    </span>
                    <h4 className="text-xl font-black text-white font-malayalam">
                      {language === 'ml' ? selectedFeature.nameMl : selectedFeature.nameEn}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-vaayana-textLight leading-relaxed font-medium font-malayalam">
                {language === 'ml' ? selectedFeature.descMl : selectedFeature.descEn}
              </p>

              {/* Special Fun Fact */}
              <div className="p-3.5 rounded-2xl bg-vaayana-darkSurface border border-vaayana-darkBorder space-y-1">
                <span className="text-[11px] font-black text-vaayana-lime uppercase tracking-wider">
                  {language === 'ml' ? 'ശാസ്ത്രീയ വസ്തുത:' : 'Scientific Fact:'}
                </span>
                <p className="text-xs text-vaayana-textLightMuted font-medium font-malayalam">
                  {language === 'ml' ? selectedFeature.factMl : selectedFeature.factEn}
                </p>
              </div>
            </div>

            {/* Quick Feature Select Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-vaayana-textLightMuted">
                {language === 'ml' ? 'പ്രധാന സവിശേഷതകൾ തിരഞ്ഞെടുക്കൂ:' : 'Select Lunar Surface Feature:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {LUNAR_FEATURES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelect(f)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all truncate ${
                      f.id === selectedFeature.id
                        ? 'bg-vaayana-lime text-vaayana-dark border-vaayana-lime font-black'
                        : 'bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight border-vaayana-darkBorder'
                    }`}
                  >
                    <span className="font-malayalam">{language === 'ml' ? f.nameMl : f.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* View B: Selenology vs Selenography Clear Comparison */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          
          {/* Selenology Card */}
          <div className="p-6 rounded-3xl bg-vaayana-darkElevated border-2 border-indigo-500/40 shadow-darkCard space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xl">
                🔬
              </span>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400">
                  Scientific Moon Study
                </span>
                <h4 className="text-2xl font-black text-white font-malayalam">
                  {language === 'ml' ? 'സെലനോളജി (Selenology)' : 'Selenology'}
                </h4>
              </div>
            </div>

            <p className="text-sm text-vaayana-textLight leading-relaxed font-medium font-malayalam">
              {language === 'ml'
                ? 'ചന്ദ്രനെക്കുറിച്ചുള്ള സമഗ്രമായ ശാസ്ത്രീയ പഠനമാണ് സെലനോളജി. ചന്ദ്രന്റെ ഉത്ഭവം, പാറകളുടെ ഘടന, ആന്തരിക സ്വഭാവം, ചന്ദ്രന്റെ പരിണാമം എന്നിവ ഇതിൽ പഠനവിധേയമാക്കുന്നു.'
                : 'Selenology is the scientific study of the Moon, its geological origin, internal composition, and evolution.'}
            </p>

            <div className="p-3 rounded-2xl bg-vaayana-darkSurface text-xs text-indigo-200">
              {language === 'ml' ? 'ഉദാഹരണം: ചാന്ദ്ര ശിലകളുടെ രാസഘടന പരിശോധിക്കൽ.' : 'Focus: Moon rocks, core structure & history.'}
            </div>
          </div>

          {/* Selenography Card */}
          <div className="p-6 rounded-3xl bg-vaayana-darkElevated border-2 border-vaayana-lime/40 shadow-darkCard space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 text-vaayana-lime flex items-center justify-center font-black text-xl">
                🗺️
              </span>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-vaayana-lime">
                  Lunar Surface Mapping
                </span>
                <h4 className="text-2xl font-black text-white font-malayalam">
                  {language === 'ml' ? 'സെലനോഗ്രാഫി (Selenography)' : 'Selenography'}
                </h4>
              </div>
            </div>

            <p className="text-sm text-vaayana-textLight leading-relaxed font-medium font-malayalam">
              {language === 'ml'
                ? 'ചന്ദ്രന്റെ ഉപരിതല സവിശേഷതകളെക്കുറിച്ച് പഠിക്കുകയും അവ ഭൂപടത്തിൽ രേഖപ്പെടുത്തുകയും ചെയ്യുന്ന ശാസ്ത്രശാഖയാണ് സെലനോഗ്രാഫി. ഗർത്തങ്ങൾ, സമതലങ്ങൾ, മലനിരകൾ എന്നിവയുടെ സ്ഥാനങ്ങൾ ഇതിലൂടെ കൃത്യമായി നിർണ്ണയിക്കുന്നു.'
                : 'Selenography is the study and mapping of the physical features of the Moon’s surface, such as craters, lunar maria (seas), and mountain ridges.'}
            </p>

            <div className="p-3 rounded-2xl bg-vaayana-darkSurface text-xs text-vaayana-lime">
              {language === 'ml' ? 'ഉദാഹരണം: ഗർത്തങ്ങളുടെയും ലാവ സമതലങ്ങളുടെയും ഭൂപടം നിർമ്മിക്കൽ.' : 'Focus: Charting & mapping lunar geography.'}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

