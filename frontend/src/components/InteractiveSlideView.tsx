import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slide } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { FractionPlayground } from './activities/FractionPlayground';
import { MultiplicationVisualizer } from './activities/MultiplicationVisualizer';
import { ShapeExplorer } from './activities/ShapeExplorer';
import { Geoboard } from './activities/Geoboard';
import { ThreeDShapeViewer } from './activities/ThreeDShapeViewer';
import { TangramPuzzle } from './activities/TangramPuzzle';
import { NumberPatternActivity } from './activities/NumberPatternActivity';
import { TotoCarIntro } from './activities/TotoCarIntro';
import { VehicleMatchingGame } from './activities/VehicleMatchingGame';
import { AbacusSimulator } from './activities/AbacusSimulator';
import { CarRaceActivity } from './activities/CarRaceActivity';
import { NumberNameExplorer } from './activities/NumberNameExplorer';
import { NumberWheel } from './activities/NumberWheel';
import { RomanNumeralExplorer } from './activities/RomanNumeralExplorer';
import { InteractiveClock } from './activities/InteractiveClock';
import { NumberPairExplorer } from './activities/NumberPairExplorer';
import { DwaniDoorChallenge } from './activities/DwaniDoorChallenge';
import { WaysToAddVisualizer } from './activities/WaysToAddVisualizer';
import { GirlsRaceActivity } from './activities/GirlsRaceActivity';
import { WaterLeakSimulation } from './activities/WaterLeakSimulation';
import { CalendarMathematics } from './activities/CalendarMathematics';
import { AbacusSubtraction } from './activities/AbacusSubtraction';
import { WrittenSubtractionBoard } from './activities/WrittenSubtractionBoard';
import { IndianCurrencyExplorer } from './activities/IndianCurrencyExplorer';
import { SolidLiquidGasClassifier } from './activities/SolidLiquidGasClassifier';
import { LiquidShapeExplorer } from './activities/LiquidShapeExplorer';
import { HeatingCoolingSimulator } from './activities/HeatingCoolingSimulator';
import { AirOccupiesSpaceDemo } from './activities/AirOccupiesSpaceDemo';
import { SolarSystemSimulator } from './activities/SolarSystemSimulator';
import { RotationRevolutionSimulator } from './activities/RotationRevolutionSimulator';
import { MoonPhasesSimulator } from './activities/MoonPhasesSimulator';
import { MoonExplorationViewer } from './activities/MoonExplorationViewer';
import { DirectionCompassActivity } from './activities/DirectionCompassActivity';
import { VillageNavigationMap } from './activities/VillageNavigationMap';
import { MagneticCompassDemo } from './activities/MagneticCompassDemo';
import { MapSymbolsExplorer } from './activities/MapSymbolsExplorer';
import { KeralaGeographyExplorer } from './activities/KeralaGeographyExplorer';
import { BackwatersExplorer } from './activities/BackwatersExplorer';
import { EducationalVideo } from './EducationalVideo';
import { EmphasisWordAnimator } from './animations/EmphasisWordAnimator';
import { ConceptAnimator } from './animations/ConceptAnimator';
import { ChapterIllustration2D } from './illustrations/ChapterIllustration2D';
import { 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Eye, 
  Layers, 
  BookOpen
} from 'lucide-react';

interface InteractiveSlideViewProps {
  slide: Slide;
  fontScale?: number;
}

export const InteractiveSlideView: React.FC<InteractiveSlideViewProps> = ({ 
  slide, 
  fontScale = 1 
}) => {
  const { language } = useLanguage();
  const [revealedItems, setRevealedItems] = useState<Record<number, boolean>>({});
  const [bilingualView, setBilingualView] = useState(false);

  const toggleReveal = (index: number) => {
    setRevealedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const title = (language === 'ml' ? slide.titleMl : slide.titleEn) || slide.titleEn || slide.titleMl || 'Concept';
  const content = (language === 'ml' ? slide.contentMl : slide.contentEn) || slide.contentEn || slide.contentMl || '';
  const keyPoints = (language === 'ml' ? slide.keyPointsMl : slide.keyPointsEn) || slide.keyPointsEn || slide.keyPointsMl || [];

  return (
    <div 
      className="bg-[#111114] rounded-4xl p-6 sm:p-10 border border-[#2E263B] shadow-2xl space-y-6 select-none transition-all duration-300"
      style={{ fontSize: `${fontScale * 100}%` }}
    >
      
      {/* Slide Header & Bilingual Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2E263B]">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border ${
              (slide.slideType || '').includes('activity') || (slide.visualType || '').includes('activity') || (slide.interactiveModule || '') !== ''
                ? 'bg-[#F5A6C8]/20 text-[#F5A6C8] border-[#F5A6C8]/40'
                : (slide.slideType || '').includes('grounding')
                ? 'bg-[#FFD166]/20 text-[#FFD166] border-[#FFD166]/40'
                : 'bg-[#7950B8] text-white border-[#7950B8]'
            }`}>
              {slide.slideType ? slide.slideType.replace('_', ' ') : (slide.visualType || 'concept').replace('_', ' ')}
            </span>
            {slide.sourcePageRef && (
              <span className="text-[11px] font-bold text-[#A59CB5] bg-[#17151B] px-2.5 py-0.5 rounded-lg border border-[#2E263B] flex items-center gap-1 shadow-xs">
                <BookOpen className="w-3 h-3 text-[#FFD166]" />
                <span>{slide.sourcePageRef}</span>
              </span>
            )}
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black text-[#EDE5F7] mt-2 tracking-tight ${language === 'ml' ? 'font-malayalam leading-relaxed' : ''}`}>
            {title}
          </h2>
          {bilingualView && (
            <h3 className="text-lg font-bold text-[#A59CB5] mt-1 italic font-malayalam">
              {language === 'ml' ? slide.titleEn : slide.titleMl}
            </h3>
          )}
        </div>

        <button
          onClick={() => setBilingualView(!bilingualView)}
          className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            bilingualView
              ? 'bg-[#7950B8] text-white border-[#7950B8] shadow-sm'
              : 'bg-[#17151B] text-[#EDE5F7] hover:bg-[#1D1A24] border-[#2E263B]'
          }`}
          title="Toggle side-by-side English/Malayalam translations"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{bilingualView ? 'Side-by-Side Active' : 'Dual Language'}</span>
        </button>
      </div>

      {/* Grounded Evidence Snippet Banner */}
      {slide.evidenceSnippet && (
        <div className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2.5 shadow-sm">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-amber-300 block text-[11px]">
              {language === 'ml' ? 'പാഠപുസ്തക തെളിവ് (Textbook Grounding):' : 'Textbook Citation Quote:'}
              {slide.sourcePageRef && <span className="ml-1 text-[10px] font-normal text-amber-300/80">({slide.sourcePageRef})</span>}
            </span>
            <p className="italic text-amber-200 mt-0.5 leading-relaxed font-serif">"{slide.evidenceSnippet}"</p>
          </div>
        </div>
      )}

      {/* 1. Word Power Emphasis Animation (e.g. ENORMOUS, TINY, FAST, SLOW) */}
      {slide.emphasisWord && (
        <div className="py-2">
          <EmphasisWordAnimator emphasisWord={slide.emphasisWord} />
        </div>
      )}

      {/* 2. Step-by-Step Concept Animation */}
      {slide.conceptAnimation && (
        <div className="py-2">
          <ConceptAnimator conceptAnimation={slide.conceptAnimation} />
        </div>
      )}

      {/* 3. Embed Interactive Smartboard Manipulative if slide has one */}
      {(slide.interactiveModule || slide.activityType) && (
        <div className="py-2 space-y-4">
          {(slide.interactiveModule === 'shape_explorer' || slide.activityType === 'shape_explorer') && <ShapeExplorer />}
          {(slide.interactiveModule === 'geoboard' || slide.activityType === 'geoboard') && <Geoboard />}
          {(slide.interactiveModule === 'three_d_shapes' || slide.activityType === 'three_d_shapes') && <ThreeDShapeViewer />}
          {(slide.interactiveModule === 'tangram' || slide.activityType === 'tangram') && <TangramPuzzle />}
          {(slide.interactiveModule === 'number_pattern' || slide.activityType === 'number_pattern') && <NumberPatternActivity />}
          {(slide.interactiveModule === 'toto_intro' || slide.activityType === 'toto_intro') && <TotoCarIntro />}
          {(slide.interactiveModule === 'vehicle_matching' || slide.activityType === 'vehicle_matching') && <VehicleMatchingGame />}
          {(slide.interactiveModule === 'abacus' || slide.activityType === 'abacus') && <AbacusSimulator />}
          {(slide.interactiveModule === 'car_race' || slide.activityType === 'car_race') && <CarRaceActivity />}
          {(slide.interactiveModule === 'number_names' || slide.activityType === 'number_names') && <NumberNameExplorer />}
          {(slide.interactiveModule === 'number_wheel' || slide.activityType === 'number_wheel') && <NumberWheel />}
          {(slide.interactiveModule === 'roman_numerals' || slide.activityType === 'roman_numerals') && <RomanNumeralExplorer />}
          {(slide.interactiveModule === 'interactive_clock' || slide.interactiveModule === 'clock' || slide.activityType === 'interactive_clock' || slide.activityType === 'clock') && <InteractiveClock />}
          {(slide.interactiveModule === 'number_pairs' || slide.activityType === 'number_pairs') && <NumberPairExplorer />}
          {(slide.interactiveModule === 'dwani_door' || slide.activityType === 'dwani_door') && <DwaniDoorChallenge />}
          {(slide.interactiveModule === 'ways_to_add' || slide.activityType === 'ways_to_add') && <WaysToAddVisualizer />}
          {(slide.interactiveModule === 'girls_race' || slide.activityType === 'girls_race') && <GirlsRaceActivity />}
          {(slide.interactiveModule === 'water_leak' || slide.activityType === 'water_leak') && <WaterLeakSimulation />}
          {(slide.interactiveModule === 'calendar_math' || slide.activityType === 'calendar_math') && <CalendarMathematics />}
          {(slide.interactiveModule === 'abacus_subtraction' || slide.activityType === 'abacus_subtraction') && <AbacusSubtraction />}
          {(slide.interactiveModule === 'written_subtraction' || slide.activityType === 'written_subtraction') && <WrittenSubtractionBoard />}
          {(slide.interactiveModule === 'currency_explorer' || slide.activityType === 'currency_explorer') && <IndianCurrencyExplorer />}
          {(slide.interactiveModule === 'fraction_playground' || slide.activityType === 'fraction_playground') && <FractionPlayground />}
          {(slide.interactiveModule === 'multiplication_visualizer' || slide.activityType === 'multiplication_visualizer') && <MultiplicationVisualizer />}
          {(slide.interactiveModule === 'evs_states_classifier' || slide.activityType === 'evs_states_classifier') && <SolidLiquidGasClassifier />}
          {(slide.interactiveModule === 'evs_liquid_shape' || slide.activityType === 'evs_liquid_shape') && <LiquidShapeExplorer />}
          {(slide.interactiveModule === 'evs_thermal_transitions' || slide.activityType === 'evs_thermal_transitions') && <HeatingCoolingSimulator />}
          {(slide.interactiveModule === 'evs_air_occupies_space' || slide.activityType === 'evs_air_occupies_space') && <AirOccupiesSpaceDemo />}
          {(slide.interactiveModule === 'evs_solar_system' || slide.activityType === 'evs_solar_system') && <SolarSystemSimulator />}
          {(slide.interactiveModule === 'evs_rotation_revolution' || slide.activityType === 'evs_rotation_revolution') && <RotationRevolutionSimulator />}
          {(slide.interactiveModule === 'evs_moon_phases' || slide.activityType === 'evs_moon_phases') && <MoonPhasesSimulator />}
          {(slide.interactiveModule === 'evs_moon_exploration' || slide.activityType === 'evs_moon_exploration') && <MoonExplorationViewer />}
          {(slide.interactiveModule === 'evs_direction_compass' || slide.activityType === 'evs_direction_compass') && <DirectionCompassActivity />}
          {(slide.interactiveModule === 'evs_village_map' || slide.activityType === 'evs_village_map') && <VillageNavigationMap />}
          {(slide.interactiveModule === 'evs_magnetic_compass' || slide.activityType === 'evs_magnetic_compass') && <MagneticCompassDemo />}
          {(slide.interactiveModule === 'evs_map_symbols' || slide.activityType === 'evs_map_symbols') && <MapSymbolsExplorer />}
          {(slide.interactiveModule === 'evs_kerala_geography' || slide.activityType === 'evs_kerala_geography') && <KeralaGeographyExplorer />}
          {(slide.interactiveModule === 'evs_backwaters_explorer' || slide.activityType === 'evs_backwaters_explorer') && <BackwatersExplorer />}
          {(slide.interactiveModule === 'educational_video' || slide.activityType === 'educational_video') && <EducationalVideo />}

          {/* Accompanying narrative below manipulative */}
          {content && (
            <div className="p-6 bg-[#17151B] rounded-3xl border border-[#2E263B] shadow-darkCard space-y-2">
              <p className={`text-base sm:text-xl text-[#EDE5F7] leading-relaxed font-medium ${language === 'ml' ? 'font-malayalam' : ''}`}>
                {content}
              </p>
              {keyPoints.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {keyPoints.map((point, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-[#1D1A24] text-[#EDE5F7] font-bold text-xs shadow-xs border border-[#7950B8]/30">
                      ✓ {point}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Main Narrative Grid: Concept Details + Smartboard Touch Points (When no full manipulative) */}
      {!slide.emphasisWord && !slide.interactiveModule && !slide.activityType && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left/Top: Interactive Visual Box */}
          <div className="lg:col-span-5 bg-[#17151B] p-6 sm:p-7 rounded-3xl border border-[#2E263B] flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-32 h-32 text-[#7950B8]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-[#1D1A24] text-[#A881E6] shadow-xs">
                  <Eye className="w-5 h-5" />
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-[#A59CB5] font-mono">
                  {language === 'ml' ? 'ദൃശ്യ സഹായി' : 'Smartboard Visual Concept'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="w-full min-h-[190px] rounded-2xl bg-[#111114] border border-[#2E263B] p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                  <div className="w-full h-32 mb-2 flex items-center justify-center">
                    <ChapterIllustration2D
                      topic={slide.slideType || ''}
                      chapterTitle={`${slide.titleEn || ''} ${slide.titleMl || ''}`}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#EDE5F7] font-malayalam leading-relaxed">
                    {language === 'ml'
                      ? (slide.visualDescriptionMl || slide.visualDescriptionEn || 'ആശയത്തെ വ്യക്തമാക്കുന്ന ദൃശ്യം')
                      : (slide.visualDescriptionEn || slide.visualDescriptionMl || 'Diagram illustrating concept')}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Notes Tip */}
            {slide.teacherNotesMl && (
              <div className="mt-4 p-3.5 bg-[#111114] text-[#EDE5F7] rounded-2xl border border-[#2E263B] text-xs">
                <span className="font-black text-[#A881E6] block mb-0.5">അധ്യാപക സഹായി (Teacher Note):</span>
                <span className="font-malayalam text-[#A59CB5]">
                  {language === 'ml' ? slide.teacherNotesMl : (slide.teacherNotesEn || slide.teacherNotesMl)}
                </span>
              </div>
            )}
          </div>

          {/* Right/Bottom: Story Narrative & Key Insights */}
          <div className="lg:col-span-7 bg-[#17151B] p-6 sm:p-8 rounded-3xl border border-[#2E263B] shadow-darkCard flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <p className={`text-lg sm:text-2xl text-[#EDE5F7] leading-relaxed font-medium ${language === 'ml' ? 'font-malayalam' : ''}`}>
                {content}
              </p>

              {bilingualView && (
                <p className="text-base text-[#A59CB5] leading-relaxed italic border-t border-[#2E263B] pt-3">
                  {language === 'ml' ? slide.contentEn : slide.contentMl}
                </p>
              )}
            </div>

            {/* Smartboard Touch Reveal Points */}
            {(keyPoints || []).length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#A59CB5] block">
                  {language === 'ml' ? 'പ്രധാന വസ്തുതകൾ (തൊട്ട് തുറക്കാം):' : 'Key Classroom Takeaways (Tap to Reveal):'}
                </span>

                <div className="space-y-2.5">
                  {(keyPoints || []).map((point, idx) => {
                    const isRevealed = !!revealedItems[idx];
                    return (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleReveal(idx)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                          isRevealed
                            ? 'bg-[#72D6B0]/10 border-[#72D6B0]/40 shadow-sm'
                            : 'bg-[#17151B] hover:bg-[#1D1A24] border-[#2E263B]'
                        }`}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isRevealed ? 'bg-[#72D6B0]/20 text-[#72D6B0] font-black border border-[#72D6B0]/40' : 'bg-[#1D1A24] text-[#A59CB5] border border-[#2E263B]'
                        }`}>
                          {isRevealed ? <CheckCircle2 className="w-4 h-4 text-[#72D6B0]" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>

                        <div className="flex-1">
                          <p className={`text-sm sm:text-base text-[#EDE5F7] font-bold ${language === 'ml' ? 'font-malayalam' : ''}`}>
                            {point}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Embedded Activity Prompt if present */}
      {slide.activity && (
        <div className="p-6 bg-vaayana-softSurface border border-vaayana-softBorder rounded-3xl space-y-4 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-vaayana-dark text-vaayana-lime font-bold">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-black text-vaayana-textDark text-base sm:text-lg font-malayalam">
                {language === 'ml' ? slide.activity.titleMl : slide.activity.titleEn}
              </h4>
              <p className="text-xs sm:text-sm text-vaayana-textDarkMuted font-malayalam">
                {language === 'ml' ? slide.activity.instructionMl : slide.activity.instructionEn}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slide.activity.items.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 bg-vaayana-soft rounded-2xl border border-vaayana-softBorder shadow-sm hover:shadow-card transition-all"
              >
                <span className="font-extrabold text-sm text-vaayana-textDark block font-malayalam">
                  {language === 'ml' ? item.titleMl : item.titleEn}
                </span>
                <span className="text-xs text-vaayana-textDarkMuted mt-1 block">
                  {language === 'ml' ? item.instructionMl : item.instructionEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default InteractiveSlideView;
