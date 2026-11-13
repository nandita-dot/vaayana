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
import { EmphasisWordAnimator } from './animations/EmphasisWordAnimator';
import { ConceptAnimator } from './animations/ConceptAnimator';
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-vaayana-soft rounded-4xl p-6 sm:p-10 border border-vaayana-softBorder shadow-lifted space-y-6 select-none transition-all duration-300"
      style={{ fontSize: `${fontScale * 100}%` }}
    >
      
      {/* Slide Header & Bilingual Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-vaayana-softMuted">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-vaayana-dark bg-vaayana-lime px-3 py-1 rounded-full shadow-sm">
              {slide.slideType ? slide.slideType.replace('_', ' ') : (slide.visualType || 'concept').replace('_', ' ')}
            </span>
            {slide.sourcePageRef && (
              <span className="text-[11px] font-bold text-vaayana-textDarkMuted bg-vaayana-softSurface px-2.5 py-0.5 rounded-lg border border-vaayana-softBorder flex items-center gap-1 shadow-sm">
                <BookOpen className="w-3 h-3 text-vaayana-limeDark" />
                <span>{slide.sourcePageRef}</span>
              </span>
            )}
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black text-vaayana-textDark mt-2 tracking-tight ${language === 'ml' ? 'font-malayalam leading-relaxed' : ''}`}>
            {title}
          </h2>
          {bilingualView && (
            <h3 className="text-lg font-bold text-vaayana-textDarkMuted mt-1 italic font-malayalam">
              {language === 'ml' ? slide.titleEn : slide.titleMl}
            </h3>
          )}
        </div>

        <button
          onClick={() => setBilingualView(!bilingualView)}
          className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            bilingualView
              ? 'bg-vaayana-dark text-vaayana-lime border-vaayana-dark shadow-sm'
              : 'bg-vaayana-softSurface text-vaayana-textDark hover:bg-vaayana-softBorder border-vaayana-softBorder'
          }`}
          title="Toggle side-by-side English/Malayalam translations"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{bilingualView ? 'Side-by-Side Active' : 'Dual Language'}</span>
        </button>
      </div>

      {/* Grounded Evidence Snippet Banner */}
      {slide.evidenceSnippet && (
        <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 shadow-sm">
          <BookOpen className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-amber-950 block text-[11px]">
              {language === 'ml' ? 'പാഠപുസ്തക തെളിവ് (Textbook Grounding):' : 'Textbook Citation Quote:'}
              {slide.sourcePageRef && <span className="ml-1 text-[10px] font-normal text-amber-800">({slide.sourcePageRef})</span>}
            </span>
            <p className="italic text-amber-900 mt-0.5 leading-relaxed font-serif">"{slide.evidenceSnippet}"</p>
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
      {slide.interactiveModule && (
        <div className="py-2 space-y-4">
          {slide.interactiveModule === 'shape_explorer' && <ShapeExplorer />}
          {slide.interactiveModule === 'geoboard' && <Geoboard />}
          {slide.interactiveModule === 'three_d_shapes' && <ThreeDShapeViewer />}
          {slide.interactiveModule === 'tangram' && <TangramPuzzle />}
          {slide.interactiveModule === 'number_pattern' && <NumberPatternActivity />}
          {slide.interactiveModule === 'toto_intro' && <TotoCarIntro />}
          {slide.interactiveModule === 'vehicle_matching' && <VehicleMatchingGame />}
          {slide.interactiveModule === 'abacus' && <AbacusSimulator />}
          {slide.interactiveModule === 'car_race' && <CarRaceActivity />}
          {slide.interactiveModule === 'number_names' && <NumberNameExplorer />}
          {slide.interactiveModule === 'number_wheel' && <NumberWheel />}
          {slide.interactiveModule === 'roman_numerals' && <RomanNumeralExplorer />}
          {(slide.interactiveModule === 'interactive_clock' || slide.interactiveModule === 'clock') && <InteractiveClock />}
          {slide.interactiveModule === 'number_pairs' && <NumberPairExplorer />}
          {slide.interactiveModule === 'dwani_door' && <DwaniDoorChallenge />}
          {slide.interactiveModule === 'ways_to_add' && <WaysToAddVisualizer />}
          {slide.interactiveModule === 'girls_race' && <GirlsRaceActivity />}
          {slide.interactiveModule === 'water_leak' && <WaterLeakSimulation />}
          {slide.interactiveModule === 'calendar_math' && <CalendarMathematics />}
          {slide.interactiveModule === 'abacus_subtraction' && <AbacusSubtraction />}
          {slide.interactiveModule === 'written_subtraction' && <WrittenSubtractionBoard />}
          {slide.interactiveModule === 'currency_explorer' && <IndianCurrencyExplorer />}
          {slide.interactiveModule === 'fraction_playground' && <FractionPlayground />}
          {slide.interactiveModule === 'multiplication_visualizer' && <MultiplicationVisualizer />}

          {/* Accompanying narrative below manipulative */}
          {content && (
            <div className="p-6 bg-vaayana-softSurface rounded-3xl border border-vaayana-softBorder shadow-soft space-y-2">
              <p className={`text-base sm:text-xl text-vaayana-textDark leading-relaxed font-medium ${language === 'ml' ? 'font-malayalam' : ''}`}>
                {content}
              </p>
              {keyPoints.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {keyPoints.map((point, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-vaayana-dark text-vaayana-lime font-bold text-xs shadow-sm">
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
      {!slide.emphasisWord && !slide.interactiveModule && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left/Top: Interactive Visual Box */}
          <div className="lg:col-span-5 bg-vaayana-softSurface p-6 sm:p-7 rounded-3xl border border-vaayana-softBorder flex flex-col justify-between shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-32 h-32 text-vaayana-limeDark" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-vaayana-dark text-vaayana-lime shadow-sm">
                  <Eye className="w-5 h-5" />
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-vaayana-textDarkMuted font-mono">
                  {language === 'ml' ? 'ദൃശ്യ സഹായി' : 'Smartboard Visual Concept'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="w-full min-h-[160px] rounded-2xl bg-vaayana-soft border border-vaayana-softBorder p-5 flex flex-col items-center justify-center text-center shadow-inner">
                  <Lightbulb className="w-12 h-12 text-amber-500 animate-bounce mb-2" />
                  <p className="text-sm sm:text-base font-bold text-vaayana-textDark font-malayalam leading-relaxed">
                    {language === 'ml'
                      ? (slide.visualDescriptionMl || slide.visualDescriptionEn || 'ആശയത്തെ വ്യക്തമാക്കുന്ന ദൃശ്യം')
                      : (slide.visualDescriptionEn || slide.visualDescriptionMl || 'Diagram illustrating concept')}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Notes Tip */}
            {slide.teacherNotesMl && (
              <div className="mt-4 p-3.5 bg-vaayana-dark text-vaayana-textLight rounded-2xl border border-vaayana-darkBorder text-xs">
                <span className="font-black text-vaayana-lime block mb-0.5">അധ്യാപക സഹായി (Teacher Note):</span>
                <span className="font-malayalam text-vaayana-textLightMuted">
                  {language === 'ml' ? slide.teacherNotesMl : (slide.teacherNotesEn || slide.teacherNotesMl)}
                </span>
              </div>
            )}
          </div>

          {/* Right/Bottom: Story Narrative & Key Insights */}
          <div className="lg:col-span-7 bg-vaayana-softSurface p-6 sm:p-8 rounded-3xl border border-vaayana-softBorder shadow-card flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <p className={`text-lg sm:text-2xl text-vaayana-textDark leading-relaxed font-medium ${language === 'ml' ? 'font-malayalam' : ''}`}>
                {content}
              </p>

              {bilingualView && (
                <p className="text-base text-vaayana-textDarkMuted leading-relaxed italic border-t border-vaayana-softMuted pt-3">
                  {language === 'ml' ? slide.contentEn : slide.contentMl}
                </p>
              )}
            </div>

            {/* Smartboard Touch Reveal Points */}
            {(keyPoints || []).length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-vaayana-textDarkMuted block">
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
                            ? 'bg-vaayana-limeLight/40 border-vaayana-limeDark/40 shadow-sm'
                            : 'bg-vaayana-soft hover:bg-vaayana-softMuted/40 border-vaayana-softBorder'
                        }`}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isRevealed ? 'bg-vaayana-dark text-vaayana-lime font-black' : 'bg-vaayana-softBorder text-vaayana-textDarkMuted'
                        }`}>
                          {isRevealed ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>

                        <div className="flex-1">
                          <p className={`text-sm sm:text-base text-vaayana-textDark font-bold ${language === 'ml' ? 'font-malayalam' : ''}`}>
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

    </motion.div>
  );
};

export default InteractiveSlideView;
