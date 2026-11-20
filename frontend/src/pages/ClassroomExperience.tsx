import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getAllLessons, isUnwantedChapter } from '../services/storage';
import { Lesson } from '../types';
import { ChapterIllustration2D } from '../components/illustrations/ChapterIllustration2D';
import { CALM_EASE } from '../animations/motionPresets';
import { FractionPlayground } from '../components/activities/FractionPlayground';
import { MultiplicationVisualizer } from '../components/activities/MultiplicationVisualizer';
import { ShapeExplorer } from '../components/activities/ShapeExplorer';
import { Geoboard } from '../components/activities/Geoboard';
import { ThreeDShapeViewer } from '../components/activities/ThreeDShapeViewer';
import { TangramPuzzle } from '../components/activities/TangramPuzzle';
import { AbacusSimulator } from '../components/activities/AbacusSimulator';
import { TotoCarIntro } from '../components/activities/TotoCarIntro';
import { VehicleMatchingGame } from '../components/activities/VehicleMatchingGame';
import { InteractiveClock } from '../components/activities/InteractiveClock';
import { DwaniDoorChallenge } from '../components/activities/DwaniDoorChallenge';
import { WaysToAddVisualizer } from '../components/activities/WaysToAddVisualizer';
import { GirlsRaceActivity } from '../components/activities/GirlsRaceActivity';
import { WaterLeakSimulation } from '../components/activities/WaterLeakSimulation';
import { CalendarMathematics } from '../components/activities/CalendarMathematics';
import { AbacusSubtraction } from '../components/activities/AbacusSubtraction';
import { WrittenSubtractionBoard } from '../components/activities/WrittenSubtractionBoard';
import { IndianCurrencyExplorer } from '../components/activities/IndianCurrencyExplorer';
import { SolidLiquidGasClassifier } from '../components/activities/SolidLiquidGasClassifier';
import { LiquidShapeExplorer } from '../components/activities/LiquidShapeExplorer';
import { HeatingCoolingSimulator } from '../components/activities/HeatingCoolingSimulator';
import { AirOccupiesSpaceDemo } from '../components/activities/AirOccupiesSpaceDemo';
import { SolarSystemSimulator } from '../components/activities/SolarSystemSimulator';
import { RotationRevolutionSimulator } from '../components/activities/RotationRevolutionSimulator';
import { MoonPhasesSimulator } from '../components/activities/MoonPhasesSimulator';
import { MoonExplorationViewer } from '../components/activities/MoonExplorationViewer';
import { DirectionCompassActivity } from '../components/activities/DirectionCompassActivity';
import { VillageNavigationMap } from '../components/activities/VillageNavigationMap';
import { MagneticCompassDemo } from '../components/activities/MagneticCompassDemo';
import { MapSymbolsExplorer } from '../components/activities/MapSymbolsExplorer';
import { KeralaGeographyExplorer } from '../components/activities/KeralaGeographyExplorer';
import { BackwatersExplorer } from '../components/activities/BackwatersExplorer';
import { EducationalVideo } from '../components/EducationalVideo';
import { ChapterTransition } from '../components/animations/ChapterTransition';
import { SoundControl } from '../components/SoundControl';
import { 
  Sparkles, 
  Tv, 
  BookOpen,
  Maximize2, 
  Minimize2, 
  TreePine, 
  Compass, 
  Calculator, 
  ArrowRight,
  PieChart,
  Gamepad2,
  CloudRain,
  X,
  Play,
  Clock,
  Plane,
  Layers,
  Orbit,
  Sun,
  Droplet,
  GraduationCap
} from 'lucide-react';

export const ClassroomExperience: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'playgrounds' | 'subjects'>('playgrounds');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModalActivity, setActiveModalActivity] = useState<string | null>(null);
  const [isChapterPreviewOpen, setIsChapterPreviewOpen] = useState(false);

  useEffect(() => {
    getAllLessons().then((loaded) => {
      setLessons(loaded.filter(l => !isUnwantedChapter(l)));
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subj = params.get('subject');
    const tab = params.get('tab');
    if (tab === 'subjects' || tab === 'playgrounds') {
      setActiveTab(tab);
    } else if (subj) {
      setActiveSubject(subj);
      setActiveTab('subjects');
    }
  }, [location.search]);

  useEffect(() => {
    if (activeModalActivity || isChapterPreviewOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeModalActivity, isChapterPreviewOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const subjectCards = [
    { 
      id: 'all', 
      titleEn: 'All Subjects (Class 4)', 
      titleMl: 'എല്ലാ വിഷയങ്ങളും', 
      icon: Layers
    },
    { 
      id: 'Mathematics', 
      titleEn: 'Mathematics (Class 4)', 
      titleMl: 'ഗണിതം (ക്ലാസ്സ് 4)', 
      icon: Calculator
    },
    { 
      id: 'Environmental Studies', 
      titleEn: 'Environmental Studies (EVS)', 
      titleMl: 'പരിസരപഠനം (ക്ലാസ്സ് 4)', 
      icon: TreePine
    },
    { 
      id: 'English', 
      titleEn: 'English (Class 4)', 
      titleMl: 'ഇംഗ്ലീഷ് (ക്ലാസ്സ് 4)', 
      icon: BookOpen
    },
  ];

  const filteredLessons = lessons.filter(l => 
    !isUnwantedChapter(l) && (activeSubject === 'all' || l.subject === activeSubject)
  );

  return (
    <div className="space-y-8 py-4 sm:py-8 max-w-7xl mx-auto">
      
      {/* Top Smartboard Control Bar (Minimal Distraction) */}
      <div className="bg-[#130F1C] border border-[#241E30] p-4 sm:p-6 rounded-3xl shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#563580] flex items-center justify-center text-white shadow-md shadow-purple-950/40 font-black">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#EDE5F7]">
              {language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ്‌റൂം ഹബ്ബ്' : 'Smartboard Classroom Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A59CB5] font-medium">
              {language === 'ml' ? 'ടച്ച് സ്ക്രീനിനായി രൂപകൽപ്പന ചെയ്ത വലിയ ബട്ടണുകൾ' : 'Large touch-friendly controls for students and teachers'}
            </p>
          </div>
        </div>

        {/* Audio Controls, Airplane Preview and Fullscreen */}
        <div className="flex items-center gap-3">
          {/* Chapter Completion Airplane Preview Button */}
          <button
            onClick={() => setIsChapterPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#171320] hover:bg-[#1E182A] text-[#EDE5F7] border border-[#2E263B] font-black text-xs shadow-xs transition-all active:scale-95"
            title="Preview Chapter Completion Airplane Animation"
          >
            <Plane className="w-4 h-4 text-[#FFD166]" />
            <span className="hidden md:inline">
              {language === 'ml' ? 'വിമാനം കാണുക (Preview)' : 'Preview Chapter Flight'}
            </span>
          </button>

          <SoundControl />
          
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#171320] hover:bg-[#1E182A] border border-[#2E263B] text-[#EDE5F7] font-bold text-sm shadow-xs transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-[#A881E6]" /> : <Maximize2 className="w-5 h-5 text-[#A881E6]" />}
            <span className="hidden sm:inline">
              {isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SMART CLASSROOM EXACTLY TWO TABS:
          Tab 1: Interactive Playgrounds (Manipulatives, Activities & Simulations)
          Tab 2: Subjects (Mathematics, EVS, English Chapters & Lessons)
         ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#100D18] border border-[#241E30] rounded-3xl shadow-sm">
        <button
          onClick={() => setActiveTab('playgrounds')}
          className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer ${
            activeTab === 'playgrounds'
              ? 'bg-[#563580] text-white shadow-md shadow-purple-950/40 scale-[1.01]'
              : 'text-[#A59CB5] hover:text-[#EDE5F7] hover:bg-[#171320]'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className={language === 'ml' ? 'font-malayalam' : ''}>
            {language === 'ml' ? '1. കളിക്കളങ്ങൾ (Interactive Playgrounds)' : '1. Interactive Playgrounds'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer ${
            activeTab === 'subjects'
              ? 'bg-[#563580] text-white shadow-md shadow-purple-950/40 scale-[1.01]'
              : 'text-[#A59CB5] hover:text-[#EDE5F7] hover:bg-[#171320]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className={language === 'ml' ? 'font-malayalam' : ''}>
            {language === 'ml' ? '2. പാഠപുസ്തക വിഷയങ്ങൾ (Subjects)' : '2. Subjects & Chapters'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1 CONTENT: INTERACTIVE PLAYGROUNDS
         ========================================================================= */}
      {activeTab === 'playgrounds' && (
        <motion.div
          key="tab-playgrounds"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: CALM_EASE }}
          className="space-y-8"
        >
          {/* Section A: Mathematics Playgrounds */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Calculator className="w-5 h-5 text-[#7950B8]" />
              <h2 className="text-lg sm:text-xl font-black text-[#EDE5F7]">
                {language === 'ml' ? 'ഗണിത സംവേദനാത്മക കളിക്കളങ്ങൾ' : 'Mathematics Playgrounds & Manipulatives'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Activity 1: Lines, Shapes & Geoboard */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('shapes')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#65C7F7]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#65C7F7]/15 text-[#65C7F7] border border-[#65C7F7]/30 flex items-center justify-center font-bold shadow-sm">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#65C7F7] bg-[#65C7F7]/15 border border-[#65C7F7]/40 px-2.5 py-0.5 rounded-full">
                      Maths • Ch 1
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#65C7F7] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'വരകളും രൂപങ്ങളും' : 'Lines & Shapes Explorer'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'വൃത്തം, ത്രികോണം, ചതുരം, ജിയോബോർഡ്, 3D രൂപങ്ങൾ.' : 'Circles, triangles, rectangles, digital geoboard & 3D shapes.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#65C7F7] border-t border-[#2E263B] mt-4">
                  <span>{language === 'ml' ? 'തുടങ്ങുക' : 'Play Activity'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#65C7F7]" />
                </div>
              </motion.div>

              {/* Activity 2: Toto 9999 & Abacus */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('abacus')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#72D6B0]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#72D6B0]/15 text-[#72D6B0] border border-[#72D6B0]/30 flex items-center justify-center font-bold shadow-sm">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#72D6B0] bg-[#72D6B0]/15 border border-[#72D6B0]/40 px-2.5 py-0.5 rounded-full">
                      Maths • Ch 2
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#72D6B0] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'അബാക്കസ് സിമുലേറ്റർ (Open Abacus)' : 'Open Abacus (Simulator)'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'ആയിരങ്ങൾ, നൂറുകൾ, പത്തുകൾ, ഒന്നുകൾ മണികൾ നിരത്തി 1000 വരെയുള്ള സ്ഥാനവില.' : 'Interactive 4-column abacus with movable beads up to 1000.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#72D6B0] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'അബാക്കസ് തുറക്കുക ➔' : 'Open Abacus ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#72D6B0]" />
                </div>
              </motion.div>

              {/* Activity 3: Interactive Clock & Roman Numerals */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('clock')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#FFD166]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/30 flex items-center justify-center font-bold shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD166] bg-[#FFD166]/15 border border-[#FFD166]/40 px-2.5 py-0.5 rounded-full">
                      Maths • Ch 3
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#FFD166] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'ഘടികാരം (Open Interactive Clock)' : 'Open Interactive Clock'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'മണിക്കൂർ, മിനിറ്റ് സൂചികൾ തിരിച്ച് ഡിജിറ്റൽ സമയവും മലയാള സമയ പ്രയോഗങ്ങളും.' : 'Drag clock hands 1-12 with live synchronized digital time.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#FFD166] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'ക്ലോക്ക് തുറക്കുക ➔' : 'Open Interactive Clock ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FFD166]" />
                </div>
              </motion.div>

              {/* Activity 4: Dwani's Magical Door */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('dwani_door')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#F5A6C8]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5A6C8]/15 text-[#F5A6C8] border border-[#F5A6C8]/30 flex items-center justify-center font-bold shadow-sm">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F5A6C8] bg-[#F5A6C8]/15 border border-[#F5A6C8]/40 px-2.5 py-0.5 rounded-full">
                      Maths • Ch 4
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#F5A6C8] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'ധ്വനിയുടെ മാന്ത്രിക വാതിൽ' : "Dwani's Magic Door"}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'കൂട്ടുമ്പോൾ 1000 ആകുന്ന സംഖ്യാ ജോടികൾ കൊണ്ട് വാതിൽ തുറക്കാം.' : 'Unlock the magical temple door with pairs summing to 1000.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#F5A6C8] border-t border-[#2E263B] mt-4">
                  <span>{language === 'ml' ? 'തുടങ്ങുക' : 'Play Activity'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F5A6C8]" />
                </div>
              </motion.div>

            </div>
          </div>

          {/* Section B: Environmental Studies (EVS) & Science Playgrounds */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 px-1">
              <TreePine className="w-5 h-5 text-[#8FAF91]" />
              <h2 className="text-lg sm:text-xl font-black text-[#EDE5F7]">
                {language === 'ml' ? 'പരിസരപഠന ശാസ്ത്ര പരീക്ഷണശാല' : 'Environmental Studies (EVS) Explorers'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Activity 5: EVS Ch 1 - Solid, Liquid or Gas? */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('evs_states_classifier')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#FF8066]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF8066]/15 text-[#FF8066] border border-[#FF8066]/30 flex items-center justify-center font-bold shadow-sm text-2xl">
                    🧊
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF8066] bg-[#FF8066]/15 border border-[#FF8066]/40 px-2.5 py-0.5 rounded-full">
                      EVS • Ch 1
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#FF8066] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'ഖരമോ, ദ്രാവകമോ, വാതകമോ?' : 'Solid, Liquid or Gas?'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'കേരളത്തിലെ വസ്തുക്കളെ മൂന്ന് അവസ്ഥകളിലേക്ക് തരംതിരിക്കുക.' : 'Classify familiar objects into Solid, Liquid, and Gas.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#FF8066] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'കളിക്കളം തുറക്കുക ➔' : 'Play Sorting ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FF8066]" />
                </div>
              </motion.div>

              {/* Activity 6: EVS Ch 1 - Heating & Cooling Simulator */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('evs_thermal_transitions')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#FFA552]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFA552]/15 text-[#FFA552] border border-[#FFA552]/30 flex items-center justify-center font-bold shadow-sm text-2xl">
                    🔥
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFA552] bg-[#FFA552]/15 border border-[#FFA552]/40 px-2.5 py-0.5 rounded-full">
                      EVS • Ch 1
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#FFA552] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'അവസ്ഥാന്തര സിമുലേറ്റർ' : 'State Transition Simulator'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'ഐസ്, വെള്ളം, നീരാവി: ചൂടാക്കലും തണുപ്പിക്കലും പരീക്ഷിക്കുക.' : 'Heat and cool between Ice, Water, and Vapour.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#FFA552] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'സിമുലേറ്റർ തുറക്കുക ➔' : 'Open Simulator ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FFA552]" />
                </div>
              </motion.div>

              {/* Activity 7: EVS Ch 2 - Solar System Simulator */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('evs_solar_system')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#7950B8]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#7950B8]/20 text-[#A881E6] border border-[#7950B8]/30 flex items-center justify-center font-bold shadow-sm text-2xl">
                    🪐
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#A881E6] bg-[#7950B8]/20 border border-[#7950B8]/40 px-2.5 py-0.5 rounded-full">
                      EVS • Ch 2
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#A881E6] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'സൗരയൂഥ സിമുലേറ്റർ' : 'Solar System Simulator'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'സൂര്യനും എട്ട് ഗ്രഹങ്ങളും അവയുടെ പരിക്രമണ പാതകളും.' : 'Sun and all 8 planets revolving in orbit.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#A881E6] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'സൗരയൂഥം കാണുക ➔' : 'Explore Solar System ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#A881E6]" />
                </div>
              </motion.div>

              {/* Activity 8: EVS Ch 2 - 8 Moon Phases */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('evs_moon_phases')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#65C7F7]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#65C7F7]/15 text-[#65C7F7] border border-[#65C7F7]/30 flex items-center justify-center font-bold shadow-sm text-2xl">
                    🌕
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#65C7F7] bg-[#65C7F7]/15 border border-[#65C7F7]/40 px-2.5 py-0.5 rounded-full">
                      EVS • Ch 2
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#65C7F7] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'ചന്ദ്രന്റെ 8 കലകൾ' : '8 Moon Phases'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'അമാവാസി മുതൽ പൗർണ്ണമി വരെയുള്ള പ്രകാശ പ്രതിഫലനം.' : 'From New Moon to Full Moon phases.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#65C7F7] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'കലകൾ കാണുക ➔' : 'View Phases ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#65C7F7]" />
                </div>
              </motion.div>

              {/* Activity 9: EVS Ch 3 - Interactive Direction Compass */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('evs_direction_compass')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#72D6B0]/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#72D6B0]/15 text-[#72D6B0] border border-[#72D6B0]/30 flex items-center justify-center font-bold shadow-sm text-2xl">
                    🧭
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#72D6B0] bg-[#72D6B0]/15 border border-[#72D6B0]/40 px-2.5 py-0.5 rounded-full">
                      EVS • Ch 3
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-[#72D6B0] transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'ദിശാ കോമ്പസ് (8 ദിശകൾ)' : '8-Direction Compass'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'പ്രധാന ദിശകളും ഉപദിശകളും അടയാളങ്ങളും കണ്ടെത്താം.' : 'Explore 4 cardinal and 4 intermediate directions.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-[#72D6B0] border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'കോമ്പസ് തുറക്കുക ➔' : 'Open Compass ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#72D6B0]" />
                </div>
              </motion.div>

              {/* Activity 10: EVS Ch 3 - Kerala Geography & 44 Rivers */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveModalActivity('evs_kerala_geography')}
                className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-emerald-500/60 shadow-darkCard cursor-pointer flex flex-col justify-between group active:scale-98 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-sm text-2xl">
                    🗺️
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                      EVS • Ch 3
                    </span>
                    <h3 className="text-base font-extrabold text-[#EDE5F7] group-hover:text-emerald-400 transition-colors mt-2 font-malayalam">
                      {language === 'ml' ? 'കേരള ഭൂപ്രകൃതിയും 44 നദികളും' : 'Kerala Geography & 44 Rivers'}
                    </h3>
                    <p className="text-xs text-[#A59CB5] mt-1 line-clamp-2">
                      {language === 'ml' ? 'സഹ്യാദ്രി, അറബിക്കടൽ, 41 പടിഞ്ഞാറൻ നദികളും 3 കിഴക്കൻ നദികളും.' : 'Western Ghats slope, 41 west & 3 east-flowing rivers.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-black text-emerald-400 border-t border-[#2E263B] mt-4">
                  <span className="font-extrabold">{language === 'ml' ? 'ഭൂപടം തുറക്കുക ➔' : 'Explore Rivers ➔'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          TAB 2 CONTENT: SUBJECTS & CHAPTERS
         ========================================================================= */}
      {activeTab === 'subjects' && (
        <motion.div
          key="tab-subjects"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: CALM_EASE }}
          className="space-y-6"
        >
          {/* Subject Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {subjectCards.map((subj) => {
              const Icon = subj.icon;
              const isActive = activeSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  onClick={() => setActiveSubject(subj.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#7950B8] text-white shadow-md shadow-purple-900/40'
                      : 'bg-[#17151B] border border-[#2E263B] text-[#A59CB5] hover:text-[#EDE5F7] hover:bg-[#1D1A24]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7950B8]'}`} />
                  <span className={language === 'ml' ? 'font-malayalam' : ''}>
                    {language === 'ml' ? subj.titleMl : subj.titleEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Classroom Lesson Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#EDE5F7]">
                {language === 'ml' ? 'ക്ലാസ്സുകൾ അവതരിപ്പിക്കാൻ തയ്യാറായ പാഠങ്ങൾ' : 'Approved Lessons Ready for Smartboard'}
              </h2>
              <span className="text-xs text-[#A59CB5] font-semibold">
                {filteredLessons.length} {language === 'ml' ? 'പാഠങ്ങൾ' : 'lessons'}
              </span>
            </div>

            {filteredLessons.length === 0 ? (
              <div className="bg-[#111114] p-12 rounded-3xl border border-dashed border-[#2E263B] text-center space-y-4">
                <Tv className="w-12 h-12 text-[#A59CB5] mx-auto" />
                <p className="text-[#A59CB5] font-medium">{t('noLessonsFound')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {
                  const title = language === 'ml' ? lesson.titleMl : lesson.titleEn;
                  const desc = language === 'ml' ? lesson.descriptionMl : lesson.descriptionEn;

                  return (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.22, ease: CALM_EASE }}
                      className="bg-[#161220] rounded-3xl border border-[#282136] shadow-darkCard flex flex-col justify-between p-6 group hover:border-[#7950B8]/60 transition-all overflow-hidden"
                    >
                      <div className="space-y-4">
                        {/* Chapter 2D Vector Vignette */}
                        <div className="w-full h-32 rounded-2xl bg-[#0F0C16] border border-[#282136] p-2 flex items-center justify-center overflow-hidden relative">
                          <ChapterIllustration2D
                            topic={lesson.subject}
                            chapterTitle={`${lesson.titleEn} ${lesson.chapter}`}
                            className="w-full h-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2.5 py-1 rounded-full font-black text-[11px] border ${
                              lesson.subject.toLowerCase().includes('math')
                                ? 'bg-[#563580]/30 text-[#EDE5F7] border-[#7950B8]/40'
                                : lesson.subject.toLowerCase().includes('env') || lesson.subject.toLowerCase().includes('evs')
                                ? 'bg-[#72D6B0]/15 text-[#72D6B0] border-[#72D6B0]/40'
                                : 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40'
                            }`}>
                              {lesson.subject}
                            </span>
                            <span className="font-bold text-[#E8DDC8]">
                              {lesson.grade || 'Class 4'}
                            </span>
                          </div>

                          <h3 className={`text-xl font-black text-[#EDE5F7] group-hover:text-[#A881E6] transition-colors line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                            {title}
                          </h3>

                          <p className={`text-xs text-[#E8DDC8]/80 leading-relaxed line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                            {desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-sm shadow-md shadow-purple-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-white text-white" />
                          <span>{language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ് ആരംഭിക്കുക' : 'Launch Classroom Mode'}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Modal View for Smartboard Manipulative Activities */}
      <AnimatePresence>
        {activeModalActivity && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111114] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-[#2E263B] text-[#EDE5F7]"
            >
              <button
                onClick={() => setActiveModalActivity(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] hover:text-white flex items-center justify-center transition-all z-10 border border-[#2E263B] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mt-2">
                {activeModalActivity === 'shapes' && <ShapeExplorer />}
                {activeModalActivity === 'geoboard' && <Geoboard />}
                {activeModalActivity === '3d_shapes' && <ThreeDShapeViewer />}
                {activeModalActivity === 'tangram' && <TangramPuzzle />}
                {activeModalActivity === 'abacus' && <AbacusSimulator />}
                {activeModalActivity === 'clock' && <InteractiveClock />}
                {activeModalActivity === 'dwani_door' && <DwaniDoorChallenge />}
                {activeModalActivity === 'ways_to_add' && <WaysToAddVisualizer />}
                {activeModalActivity === 'girls_race' && <GirlsRaceActivity />}
                {activeModalActivity === 'water_leak' && <WaterLeakSimulation />}
                {activeModalActivity === 'calendar_math' && <CalendarMathematics />}
                {activeModalActivity === 'abacus_subtraction' && <AbacusSubtraction />}
                {activeModalActivity === 'written_subtraction' && <WrittenSubtractionBoard />}
                {activeModalActivity === 'currency_explorer' && <IndianCurrencyExplorer />}
                {activeModalActivity === 'fraction' && <FractionPlayground />}
                {activeModalActivity === 'multiplication' && <MultiplicationVisualizer />}
                {activeModalActivity === 'evs_states_classifier' && <SolidLiquidGasClassifier />}
                {activeModalActivity === 'evs_liquid_shape' && <LiquidShapeExplorer />}
                {activeModalActivity === 'evs_thermal_transitions' && <HeatingCoolingSimulator />}
                {activeModalActivity === 'evs_air_occupies_space' && <AirOccupiesSpaceDemo />}
                {activeModalActivity === 'evs_solar_system' && <SolarSystemSimulator />}
                {activeModalActivity === 'evs_rotation_revolution' && <RotationRevolutionSimulator />}
                {activeModalActivity === 'evs_moon_phases' && <MoonPhasesSimulator />}
                {activeModalActivity === 'evs_moon_exploration' && <MoonExplorationViewer />}
                {activeModalActivity === 'evs_direction_compass' && <DirectionCompassActivity />}
                {activeModalActivity === 'evs_village_map' && <VillageNavigationMap />}
                {activeModalActivity === 'evs_magnetic_compass' && <MagneticCompassDemo />}
                {activeModalActivity === 'evs_map_symbols' && <MapSymbolsExplorer />}
                {activeModalActivity === 'evs_kerala_geography' && <KeralaGeographyExplorer />}
                {activeModalActivity === 'evs_backwaters_explorer' && <BackwatersExplorer />}
                {activeModalActivity === 'educational_video' && <EducationalVideo />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chapter Completion Transition Modal (Preview & Testing) */}
      <ChapterTransition
        isOpen={isChapterPreviewOpen}
        chapterTitleEn="Mathematics — Grade 4 SCERT"
        chapterTitleMl="ഗണിതം — നാലാം ക്ലാസ്സ് (SCERT)"
        nextChapterTitleEn="Increasing Numbers & Advanced Addition"
        nextChapterTitleMl="സംഖ്യകൾ വളരുന്നു: സങ്കലന രീതികൾ"
        onProceed={() => setIsChapterPreviewOpen(false)}
        onClose={() => setIsChapterPreviewOpen(false)}
      />

    </div>
  );
};

export default ClassroomExperience;
