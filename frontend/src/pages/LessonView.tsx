import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getLessonById } from '../services/storage';
import { Lesson } from '../types';
import { SmartboardControls } from '../components/SmartboardControls';
import { InteractiveSlideView } from '../components/InteractiveSlideView';
import { QuizActivity } from '../components/QuizActivity';
import { 
  ChevronLeft, 
  ChevronRight, 
  Tv, 
  Sparkles,
  Gamepad2,
  LogOut,
  Calculator,
  Clock,
  Plane
} from 'lucide-react';
import { FractionPlayground } from '../components/activities/FractionPlayground';
import { MultiplicationVisualizer } from '../components/activities/MultiplicationVisualizer';
import { ShapeExplorer } from '../components/activities/ShapeExplorer';
import { Geoboard } from '../components/activities/Geoboard';
import { ThreeDShapeViewer } from '../components/activities/ThreeDShapeViewer';
import { TangramPuzzle } from '../components/activities/TangramPuzzle';
import { NumberPatternActivity } from '../components/activities/NumberPatternActivity';
import { TotoCarIntro } from '../components/activities/TotoCarIntro';
import { VehicleMatchingGame } from '../components/activities/VehicleMatchingGame';
import { AbacusSimulator } from '../components/activities/AbacusSimulator';
import { CarRaceActivity } from '../components/activities/CarRaceActivity';
import { NumberNameExplorer } from '../components/activities/NumberNameExplorer';
import { NumberWheel } from '../components/activities/NumberWheel';
import { RomanNumeralExplorer } from '../components/activities/RomanNumeralExplorer';
import { InteractiveClock } from '../components/activities/InteractiveClock';
import { NumberPairExplorer } from '../components/activities/NumberPairExplorer';
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

export const LessonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Restore slide progress from sessionStorage if available
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(() => {
    if (typeof window !== 'undefined' && id) {
      const saved = sessionStorage.getItem(`vaayana_progress_${id}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return 0;
  });

  const [viewMode, setViewMode] = useState<'slides' | 'quiz' | 'activity'>('slides');
  const [fontScale, setFontScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChapterCompleteOpen, setIsChapterCompleteOpen] = useState(false);
  const [selectedActivityOverride, setSelectedActivityOverride] = useState<string | null>(null);

  const nextChapterMap: Record<string, { id: string; titleEn: string; titleMl: string }> = {
    'scert-std4-maths-ch1-lines-and-shapes': {
      id: 'scert-std4-maths-ch2-find-relation',
      titleEn: 'Chapter 2 — Find the Relation',
      titleMl: 'അധ്യായം 2 — ബന്ധം കണ്ടെത്താം'
    },
    'scert-std4-maths-ch1-lines-and-shapes-v1': {
      id: 'scert-std4-maths-ch2-find-relation',
      titleEn: 'Chapter 2 — Find the Relation',
      titleMl: 'അധ്യായം 2 — ബന്ധം കണ്ടെത്താം'
    },
    'scert-std4-maths-ch2-find-relation': {
      id: 'scert-std4-maths-ch3-how-many-numbers',
      titleEn: 'Chapter 3 — How Many Numbers?',
      titleMl: 'അധ്യായം 3 — എത്രയെത്ര സംഖ്യകൾ?'
    },
    'scert-std4-maths-ch2-find-relation-v1': {
      id: 'scert-std4-maths-ch3-how-many-numbers',
      titleEn: 'Chapter 3 — How Many Numbers?',
      titleMl: 'അധ്യായം 3 — എത്രയെത്ര സംഖ്യകൾ?'
    },
    'scert-std4-maths-ch3-how-many-numbers': {
      id: 'scert-std4-maths-ch4-increasing-numbers',
      titleEn: 'Chapter 4 — Increasing Numbers',
      titleMl: 'അധ്യായം 4 — സംഖ്യകൾ വളരുന്നു'
    },
    'scert-std4-maths-ch3-how-many-numbers-v1': {
      id: 'scert-std4-maths-ch4-increasing-numbers',
      titleEn: 'Chapter 4 — Increasing Numbers',
      titleMl: 'അധ്യായം 4 — സംഖ്യകൾ വളരുന്നു'
    },
    'scert-std4-maths-ch4-increasing-numbers': {
      id: 'scert-std4-maths-ch5-its-time',
      titleEn: "Chapter 5 — It's Time!",
      titleMl: 'അധ്യായം 5 — സമയം എത്രയായി?'
    },
    'scert-std4-maths-ch4-increasing-numbers-v1': {
      id: 'scert-std4-maths-ch5-its-time',
      titleEn: "Chapter 5 — It's Time!",
      titleMl: 'അധ്യായം 5 — സമയം എത്രയായി?'
    },
    'scert-std4-maths-ch5-its-time': {
      id: 'scert-std4-maths-ch6-decreasing-numbers',
      titleEn: 'Chapter 6 — Decreasing Numbers',
      titleMl: 'അധ്യായം 6 — സംഖ്യകൾ കുറയുന്നു'
    },
    'scert-std4-maths-ch5-its-time-v1': {
      id: 'scert-std4-maths-ch6-decreasing-numbers',
      titleEn: 'Chapter 6 — Decreasing Numbers',
      titleMl: 'അധ്യായം 6 — സംഖ്യകൾ കുറയുന്നു'
    }
  };

  // Canvas drawing reference for smartboard annotation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPaintingRef = useRef(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getLessonById(id).then((data) => {
        if (data) {
          setLesson(data);
          if (currentSlideIndex >= data.slides.length) {
            setCurrentSlideIndex(0);
          }
        }
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id && lesson) {
      sessionStorage.setItem(`vaayana_progress_${id}`, currentSlideIndex.toString());
    }
  }, [id, currentSlideIndex, lesson]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  // Keyboard navigation for smartboard clickers (Left/Right arrows, Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (viewMode === 'slides' && lesson) {
          if (currentSlideIndex < lesson.slides.length - 1) {
            setCurrentSlideIndex(i => i + 1);
          } else {
            setViewMode('quiz');
          }
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (viewMode === 'slides') {
          setCurrentSlideIndex(i => Math.max(0, i - 1));
        } else if (viewMode === 'quiz' && lesson) {
          setViewMode('slides');
          setCurrentSlideIndex(lesson.slides.length - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentSlideIndex, lesson]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isPaintingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isPaintingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#9ACD32'; // Vaayana neon lime highlighter

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime animate-spin shadow-limeGlow" />
          <p className="text-vaayana-textLightMuted font-bold">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-md mx-auto my-12 bg-vaayana-darkSurface p-8 rounded-3xl border border-vaayana-darkBorder text-center space-y-4">
        <h3 className="text-xl font-bold text-vaayana-textLight">Lesson not found</h3>
        <p className="text-sm text-vaayana-textLightMuted">The requested lesson might have been deleted or moved.</p>
        <Link to="/library" className="inline-block px-5 py-2.5 rounded-xl bg-vaayana-lime text-vaayana-dark font-black text-sm">
          Return to Library
        </Link>
      </div>
    );
  }

  const currentSlide = lesson.slides[currentSlideIndex] || lesson.slides[0];
  const lessonTitle = language === 'ml' ? lesson.titleMl : lesson.titleEn;
  const activeInteractiveModule = currentSlide?.interactiveModule || 
    lesson.slides.find(s => s.interactiveModule)?.interactiveModule ||
    lesson.activities?.find(a => a.activityModule || a.activityType)?.activityModule ||
    lesson.activities?.find(a => a.activityModule || a.activityType)?.activityType;

  const displayedActivity = selectedActivityOverride || activeInteractiveModule;

  const progressPercentage = Math.round(((currentSlideIndex + 1) / lesson.slides.length) * 100);

  return (
    <div className="space-y-4 py-2 sm:py-4 max-w-7xl mx-auto relative select-none">
      
      {/* Top Smartboard Control Bar (Landscape-Friendly) */}
      <div className="bg-vaayana-darkSurface p-3 sm:p-4 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Exit Classroom Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/classroom')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder text-vaayana-textLight font-bold text-xs sm:text-sm border border-vaayana-darkBorder transition-all shadow-sm active:scale-95"
            title="Exit Classroom Mode"
          >
            <LogOut className="w-4 h-4 text-vaayana-lime" />
            <span className="hidden sm:inline">
              {language === 'ml' ? 'ക്ലാസ്സ് പൂർത്തിയാക്കുക' : 'Exit Classroom'}
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-vaayana-textLightMuted">
              <span className="px-2 py-0.5 rounded-md bg-vaayana-dark text-vaayana-lime font-black">{lesson.grade || 'Class 4'}</span>
              <span>•</span>
              <span className="truncate max-w-[150px] sm:max-w-none">{lesson.subject}</span>
            </div>
            <h1 className={`text-base sm:text-xl font-black text-vaayana-textLight truncate max-w-[240px] sm:max-w-md ${language === 'ml' ? 'font-malayalam' : ''}`}>
              {lessonTitle}
            </h1>
          </div>
        </div>

        {/* Right: Smartboard & Audio Controls */}
        <div className="flex items-center gap-2">
          <SoundControl />
          <SmartboardControls
            onFontSizeChange={setFontScale}
            audioTextEn={currentSlide ? currentSlide.audioNarrationEn : ''}
            audioTextMl={currentSlide ? currentSlide.audioNarrationMl : ''}
            isDrawingEnabled={isDrawing}
            onToggleDrawing={() => {
              setIsDrawing(!isDrawing);
              if (isDrawing) clearCanvas();
            }}
          />
        </div>
      </div>

      {/* Mode Switcher Tabs + Progress Visualizer */}
      <div className="bg-vaayana-darkSurface p-3 rounded-2xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode('slides')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 ${
              viewMode === 'slides'
                ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                : 'bg-vaayana-darkElevated text-vaayana-textLightMuted hover:text-vaayana-textLight border border-vaayana-darkBorder'
            }`}
          >
            <Tv className={`w-4 h-4 ${viewMode === 'slides' ? 'text-vaayana-dark' : 'text-vaayana-lime'}`} />
            <span>{language === 'ml' ? 'ദൃശ്യപാഠം' : 'Interactive Slides'}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${viewMode === 'slides' ? 'bg-vaayana-dark/20 text-vaayana-dark font-black' : 'bg-vaayana-dark text-vaayana-lime'}`}>
              {currentSlideIndex + 1}/{lesson.slides.length}
            </span>
          </button>

          {(activeInteractiveModule || lesson.subject === 'Mathematics') && (
            <button
              onClick={() => setViewMode('activity')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 ${
                viewMode === 'activity'
                  ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                  : 'bg-vaayana-darkElevated text-vaayana-textLightMuted hover:text-vaayana-textLight border border-vaayana-darkBorder'
              }`}
            >
              <Gamepad2 className={`w-4 h-4 ${viewMode === 'activity' ? 'text-vaayana-dark' : 'text-vaayana-lime'}`} />
              <span>{language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് കളിസ്ഥലം' : 'Smartboard Manipulative'}</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('quiz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 ${
              viewMode === 'quiz'
                ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                : 'bg-vaayana-darkElevated text-vaayana-textLightMuted hover:text-vaayana-textLight border border-vaayana-darkBorder'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${viewMode === 'quiz' ? 'text-vaayana-dark' : 'text-vaayana-lime'}`} />
            <span>{language === 'ml' ? 'ക്ലാസ്സ് ക്വിസ്' : 'Smartboard Quiz'}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${viewMode === 'quiz' ? 'bg-vaayana-dark/20 text-vaayana-dark font-black' : 'bg-vaayana-dark text-vaayana-lime'}`}>
              {lesson.quiz.length}
            </span>
          </button>

          {/* Dev / Teacher Preview Chapter Completion Airplane Button */}
          <button
            onClick={() => setIsChapterCompleteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-amber-950 transition-all active:scale-95 shadow-sm"
            title="Preview Chapter Completion Celebration & Airplane Animation"
          >
            <Plane className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span>{language === 'ml' ? 'വിമാനം കാണുക (Preview)' : 'Preview Chapter Completion'}</span>
          </button>
        </div>

        {/* Clear Highlighter Button when active */}
        {isDrawing && (
          <button
            onClick={clearCanvas}
            className="text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-800 transition-all"
          >
            Clear Highlighter
          </button>
        )}

        {/* Lesson Progress Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-vaayana-textLightMuted">
          <span>Progress:</span>
          <div className="w-28 h-2 bg-vaayana-darkBorder rounded-full overflow-hidden">
            <div 
              className="h-full bg-vaayana-lime transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="font-mono text-vaayana-lime">{progressPercentage}%</span>
        </div>
      </div>

      {/* Main Experience Container with Drawing Canvas Overlay */}
      <div className="relative min-h-[500px]">
        {isDrawing && (
          <canvas
            ref={canvasRef}
            width={1200}
            height={650}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="absolute inset-0 z-30 w-full h-full cursor-crosshair touch-none"
          />
        )}

        <AnimatePresence mode="wait">
          {viewMode === 'activity' ? (
            <motion.div
              key="activity"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-vaayana-soft rounded-4xl p-6 sm:p-8 border border-vaayana-softBorder shadow-lifted space-y-6"
            >
              {/* Mathematics Smartboard Manipulatives Tab Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-vaayana-dark rounded-2xl border border-vaayana-darkBorder">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-vaayana-textLightMuted px-2">
                    {language === 'ml' ? 'കളിക്കളങ്ങൾ:' : 'Manipulatives:'}
                  </span>

                  {/* Open Abacus Button */}
                  <button
                    onClick={() => setSelectedActivityOverride('abacus')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 ${
                      displayedActivity === 'abacus'
                        ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                        : 'bg-vaayana-darkElevated text-vaayana-textLight hover:bg-vaayana-darkBorder border border-vaayana-darkBorder'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{language === 'ml' ? 'അബാക്കസ് (Open Abacus)' : 'Open Abacus'}</span>
                  </button>

                  {/* Open Interactive Clock Button */}
                  <button
                    onClick={() => setSelectedActivityOverride('interactive_clock')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 ${
                      displayedActivity === 'interactive_clock' || displayedActivity === 'clock'
                        ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                        : 'bg-vaayana-darkElevated text-vaayana-textLight hover:bg-vaayana-darkBorder border border-vaayana-darkBorder'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{language === 'ml' ? 'ഘടികാരം (Open Interactive Clock)' : 'Open Interactive Clock'}</span>
                  </button>

                  {/* Reset to Slide Default Activity */}
                  {selectedActivityOverride && (
                    <button
                      onClick={() => setSelectedActivityOverride(null)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-vaayana-textLightMuted hover:text-white bg-vaayana-darkSurface border border-vaayana-darkBorder"
                    >
                      {language === 'ml' ? 'പാഠത്തിലെ കളിക്കളം' : 'Slide Default'}
                    </button>
                  )}
                </div>

                {/* Preview Chapter Completion Button */}
                <button
                  onClick={() => setIsChapterCompleteOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-amber-950 transition-all active:scale-95 shadow-sm"
                >
                  <Plane className="w-4 h-4 fill-amber-950 text-amber-950" />
                  <span>{language === 'ml' ? 'വിമാനം കാണുക (Preview)' : 'Preview Chapter Completion'}</span>
                </button>
              </div>

              {/* Render the Active Manipulative */}
              {displayedActivity === 'shape_explorer' && <ShapeExplorer />}
              {displayedActivity === 'geoboard' && <Geoboard />}
              {displayedActivity === 'three_d_shapes' && <ThreeDShapeViewer />}
              {displayedActivity === 'tangram' && <TangramPuzzle />}
              {displayedActivity === 'number_pattern' && <NumberPatternActivity />}
              {displayedActivity === 'toto_intro' && <TotoCarIntro />}
              {displayedActivity === 'vehicle_matching' && <VehicleMatchingGame />}
              {displayedActivity === 'abacus' && <AbacusSimulator />}
              {displayedActivity === 'car_race' && <CarRaceActivity />}
              {displayedActivity === 'number_names' && <NumberNameExplorer />}
              {displayedActivity === 'number_wheel' && <NumberWheel />}
              {displayedActivity === 'roman_numerals' && <RomanNumeralExplorer />}
              {(displayedActivity === 'interactive_clock' || displayedActivity === 'clock') && <InteractiveClock />}
              {displayedActivity === 'number_pairs' && <NumberPairExplorer />}
              {displayedActivity === 'dwani_door' && <DwaniDoorChallenge />}
              {displayedActivity === 'ways_to_add' && <WaysToAddVisualizer />}
              {displayedActivity === 'girls_race' && <GirlsRaceActivity />}
              {displayedActivity === 'water_leak' && <WaterLeakSimulation />}
              {displayedActivity === 'calendar_math' && <CalendarMathematics />}
              {displayedActivity === 'abacus_subtraction' && <AbacusSubtraction />}
              {displayedActivity === 'written_subtraction' && <WrittenSubtractionBoard />}
              {displayedActivity === 'currency_explorer' && <IndianCurrencyExplorer />}
              {displayedActivity === 'fraction_playground' && <FractionPlayground />}
              {displayedActivity === 'multiplication_visualizer' && <MultiplicationVisualizer />}
            </motion.div>
          ) : viewMode === 'slides' && currentSlide ? (
            <motion.div
              key={`slide-${currentSlideIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <InteractiveSlideView
                slide={currentSlide}
                fontScale={fontScale}
              />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <QuizActivity
                questions={lesson.quiz}
                onFinish={() => setIsChapterCompleteOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapter Completion Transition Modal */}
      <ChapterTransition
        isOpen={isChapterCompleteOpen}
        chapterTitleEn={lesson?.titleEn || ''}
        chapterTitleMl={lesson?.titleMl || ''}
        nextChapterTitleEn={lesson && nextChapterMap[lesson.id]?.titleEn}
        nextChapterTitleMl={lesson && nextChapterMap[lesson.id]?.titleMl}
        onProceed={() => {
          setIsChapterCompleteOpen(false);
          if (lesson && nextChapterMap[lesson.id]) {
            navigate(`/lesson/${nextChapterMap[lesson.id].id}`);
          } else {
            navigate('/classroom');
          }
        }}
        onClose={() => {
          setIsChapterCompleteOpen(false);
          setViewMode('slides');
        }}
      />

      {/* Bottom Smartboard Touch Navigation */}
      {viewMode === 'slides' && (
        <div className="bg-vaayana-darkSurface p-4 sm:p-5 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-vaayana-darkElevated hover:bg-vaayana-darkBorder disabled:opacity-30 text-vaayana-textLight font-extrabold text-base sm:text-lg transition-all active:scale-95 min-h-[56px] border border-vaayana-darkBorder shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 text-vaayana-lime" />
            <span>{t('previous')}</span>
          </button>

          {/* Interactive Slide Progress Dots */}
          <div className="flex items-center gap-2 overflow-x-auto px-2">
            {lesson.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all ${
                  idx === currentSlideIndex 
                    ? 'w-10 h-4 bg-vaayana-lime rounded-full shadow-limeGlow' 
                    : 'w-4 h-4 bg-vaayana-darkBorder hover:bg-vaayana-darkMuted rounded-full'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {currentSlideIndex < lesson.slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlideIndex(i => Math.min(lesson.slides.length - 1, i + 1))}
              className="flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-base sm:text-lg shadow-limeGlow transition-all active:scale-95 min-h-[56px]"
            >
              <span>{t('next')}</span>
              <ChevronRight className="w-6 h-6 text-vaayana-dark" />
            </button>
          ) : (
            <button
              onClick={() => setViewMode('quiz')}
              className="flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-base sm:text-lg shadow-limeGlow transition-all active:scale-95 min-h-[56px]"
            >
              <span>{t('takeQuiz')}</span>
              <Sparkles className="w-6 h-6 text-vaayana-dark" />
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default LessonView;
