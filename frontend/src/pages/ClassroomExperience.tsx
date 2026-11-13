import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getAllLessons } from '../services/storage';
import { Lesson } from '../types';
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
  Plane
} from 'lucide-react';

export const ClassroomExperience: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('Mathematics');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModalActivity, setActiveModalActivity] = useState<string | null>(null);
  const [isChapterPreviewOpen, setIsChapterPreviewOpen] = useState(false);

  useEffect(() => {
    getAllLessons().then(setLessons);
  }, []);

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
      id: 'Mathematics', 
      titleEn: 'Mathematics (Class 4)', 
      titleMl: 'ഗണിതം (ക്ലാസ്സ് 4)', 
      icon: Calculator
    },
  ];

  const filteredLessons = lessons.filter(l => 
    activeSubject === 'all' || l.subject === activeSubject
  );

  return (
    <div className="space-y-8 py-4 sm:py-8 max-w-7xl mx-auto">
      
      {/* Top Smartboard Control Bar (Minimal Distraction) */}
      <div className="bg-vaayana-darkSurface border border-vaayana-darkBorder p-4 sm:p-6 rounded-3xl shadow-darkCard flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime flex items-center justify-center text-vaayana-dark shadow-limeGlow font-black">
            <BookOpen className="w-7 h-7 text-vaayana-dark" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ്‌റൂം' : 'Smartboard Classroom Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-vaayana-textLightMuted font-medium">
              {language === 'ml' ? 'ടച്ച് സ്ക്രീനിനായി രൂപകൽപ്പന ചെയ്ത വലിയ ബട്ടണുകൾ' : 'Large touch-friendly controls for students and teachers'}
            </p>
          </div>
        </div>

        {/* Audio Controls and Fullscreen */}
        <div className="flex items-center gap-3">
          <SoundControl />
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder border border-vaayana-darkBorder text-vaayana-textLight font-bold text-sm shadow-soft transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-vaayana-lime" /> : <Maximize2 className="w-5 h-5 text-vaayana-lime" />}
            <span className="hidden sm:inline">
              {isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            </span>
          </button>
        </div>
      </div>

      {/* Featured Interactive Smartboard Activities Strip */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-vaayana-lime" />
            <h2 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് സംവേദനാത്മക കളിക്കളങ്ങൾ' : 'Interactive Smartboard Playgrounds'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Dev / Teacher Preview Chapter Completion Airplane Button */}
            <button
              onClick={() => setIsChapterPreviewOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-sm transition-all active:scale-95"
              title="Test Chapter Completion Airplane Animation"
            >
              <Plane className="w-4 h-4 fill-amber-950 text-amber-950" />
              <span>{language === 'ml' ? 'വിമാനം കാണുക (Preview)' : 'Preview Chapter Completion'}</span>
            </button>

            <span className="text-xs font-black text-vaayana-dark bg-vaayana-lime px-3 py-1.5 rounded-full shadow-sm">
              Touch Ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Activity 1: Lines, Shapes & Geoboard */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setActiveModalActivity('shapes')}
            className="p-6 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder shadow-soft cursor-pointer flex flex-col justify-between group active:scale-98"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-vaayana-dark text-vaayana-lime flex items-center justify-center font-bold shadow-sm">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-2.5 py-0.5 rounded-full">
                  Maths • Ch 1
                </span>
                <h3 className="text-base font-extrabold text-vaayana-textDark mt-2 font-malayalam">
                  {language === 'ml' ? 'വരകളും രൂപങ്ങളും' : 'Lines & Shapes Explorer'}
                </h3>
                <p className="text-xs text-vaayana-textDarkMuted mt-1 line-clamp-2">
                  {language === 'ml' ? 'വൃത്തം, ത്രികോണം, ചതുരം, ജിയോബോർഡ്, 3D രൂപങ്ങൾ.' : 'Circles, triangles, rectangles, digital geoboard & 3D shapes.'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-black text-vaayana-dark border-t border-vaayana-softMuted mt-4">
              <span>{language === 'ml' ? 'തുടങ്ങുക' : 'Play Activity'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-vaayana-limeDark" />
            </div>
          </motion.div>

          {/* Activity 2: Toto 9999 & Abacus */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setActiveModalActivity('abacus')}
            className="p-6 rounded-3xl bg-vaayana-soft border-2 border-emerald-500/50 shadow-soft cursor-pointer flex flex-col justify-between group active:scale-98"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-vaayana-dark text-vaayana-lime flex items-center justify-center font-bold shadow-sm">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-emerald-700 px-2.5 py-0.5 rounded-full">
                  Maths • Ch 2
                </span>
                <h3 className="text-base font-extrabold text-vaayana-textDark mt-2 font-malayalam">
                  {language === 'ml' ? 'അബാക്കസ് സിമുലേറ്റർ (Open Abacus)' : 'Open Abacus (Simulator)'}
                </h3>
                <p className="text-xs text-vaayana-textDarkMuted mt-1 line-clamp-2">
                  {language === 'ml' ? 'ആയിരങ്ങൾ, നൂറുകൾ, പത്തുകൾ, ഒന്നുകൾ മണികൾ നിരത്തി 1000 വരെയുള്ള സ്ഥാനവില.' : 'Interactive 4-column abacus with movable beads up to 1000.'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-black text-emerald-800 border-t border-vaayana-softMuted mt-4">
              <span className="font-extrabold">{language === 'ml' ? 'അബാക്കസ് തുറക്കുക ➔' : 'Open Abacus ➔'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-700" />
            </div>
          </motion.div>

          {/* Activity 3: Interactive Clock & Roman Numerals */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setActiveModalActivity('clock')}
            className="p-6 rounded-3xl bg-vaayana-soft border-2 border-sky-500/50 shadow-soft cursor-pointer flex flex-col justify-between group active:scale-98"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-vaayana-dark text-vaayana-lime flex items-center justify-center font-bold shadow-sm">
                <Clock className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-sky-700 px-2.5 py-0.5 rounded-full">
                  Maths • Ch 3
                </span>
                <h3 className="text-base font-extrabold text-vaayana-textDark mt-2 font-malayalam">
                  {language === 'ml' ? 'ഘടികാരം (Open Interactive Clock)' : 'Open Interactive Clock'}
                </h3>
                <p className="text-xs text-vaayana-textDarkMuted mt-1 line-clamp-2">
                  {language === 'ml' ? 'മണിക്കൂർ, മിനിറ്റ് സൂചികൾ തിരിച്ച് ഡിജിറ്റൽ സമയവും മലയാള സമയ പ്രയോഗങ്ങളും.' : 'Drag clock hands 1-12 with live synchronized digital time.'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-black text-sky-800 border-t border-vaayana-softMuted mt-4">
              <span className="font-extrabold">{language === 'ml' ? 'ക്ലോക്ക് തുറക്കുക ➔' : 'Open Interactive Clock ➔'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-sky-700" />
            </div>
          </motion.div>

          {/* Activity 4: Dwani's Magical Door */}
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => setActiveModalActivity('dwani_door')}
            className="p-6 rounded-3xl bg-vaayana-soft border border-vaayana-softBorder shadow-soft cursor-pointer flex flex-col justify-between group active:scale-98"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-vaayana-dark text-vaayana-lime flex items-center justify-center font-bold shadow-sm">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-2.5 py-0.5 rounded-full">
                  Maths • Ch 4
                </span>
                <h3 className="text-base font-extrabold text-vaayana-textDark mt-2 font-malayalam">
                  {language === 'ml' ? 'ധ്വനിയുടെ മാന്ത്രിക വാതിൽ' : "Dwani's Magic Door"}
                </h3>
                <p className="text-xs text-vaayana-textDarkMuted mt-1 line-clamp-2">
                  {language === 'ml' ? 'കൂട്ടുമ്പോൾ 1000 ആകുന്ന സംഖ്യാ ജോടികൾ കൊണ്ട് വാതിൽ തുറക്കാം.' : 'Unlock the magical temple door with pairs summing to 1000.'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-black text-vaayana-dark border-t border-vaayana-softMuted mt-4">
              <span>{language === 'ml' ? 'തുടങ്ങുക' : 'Play Activity'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-vaayana-limeDark" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {subjectCards.map((subj) => {
          const Icon = subj.icon;
          const isActive = activeSubject === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => setActiveSubject(subj.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                isActive
                  ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                  : 'bg-vaayana-darkSurface border border-vaayana-darkBorder text-vaayana-textLightMuted hover:text-vaayana-textLight hover:bg-vaayana-darkElevated'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-vaayana-dark' : 'text-vaayana-lime'}`} />
              <span className={language === 'ml' ? 'font-malayalam' : ''}>
                {language === 'ml' ? subj.titleMl : subj.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Classroom Lesson Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-vaayana-textLight">
          {language === 'ml' ? 'ക്ലാസ്സുകൾ അവതരിപ്പിക്കാൻ തയ്യാറായ പാഠങ്ങൾ' : 'Approved Lessons Ready for Smartboard'}
        </h2>

        {filteredLessons.length === 0 ? (
          <div className="bg-vaayana-darkSurface p-12 rounded-3xl border border-dashed border-vaayana-darkBorder text-center space-y-4">
            <Tv className="w-12 h-12 text-vaayana-textLightMuted mx-auto" />
            <p className="text-vaayana-textLightMuted font-medium">{t('noLessonsFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const title = language === 'ml' ? lesson.titleMl : lesson.titleEn;
              const desc = language === 'ml' ? lesson.descriptionMl : lesson.descriptionEn;

              return (
                <motion.div
                  key={lesson.id}
                  whileHover={{ y: -4 }}
                  className="bg-vaayana-soft rounded-3xl border border-vaayana-softBorder shadow-soft flex flex-col justify-between p-6 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-vaayana-dark text-vaayana-lime font-black">
                        {lesson.subject}
                      </span>
                      <span className="font-bold text-vaayana-textDarkMuted">
                        {lesson.grade || 'Class 4'}
                      </span>
                    </div>

                    <h3 className={`text-xl font-black text-vaayana-textDark group-hover:text-vaayana-dark transition-colors line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {title}
                    </h3>

                    <p className={`text-xs text-vaayana-textDarkMuted leading-relaxed line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {desc}
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-vaayana-dark hover:bg-[#1a251e] text-vaayana-lime font-black text-sm shadow-soft transition-all"
                    >
                      <Play className="w-4 h-4 fill-vaayana-lime text-vaayana-lime" />
                      <span>{language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ് ആരംഭിക്കുക' : 'Launch Classroom Mode'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal View for Smartboard Manipulative Activities */}
      <AnimatePresence>
        {activeModalActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-vaayana-soft rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-vaayana-softBorder"
            >
              <button
                onClick={() => setActiveModalActivity(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-vaayana-dark hover:bg-black text-vaayana-lime flex items-center justify-center transition-all z-10"
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
