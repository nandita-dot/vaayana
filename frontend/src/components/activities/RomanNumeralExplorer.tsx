import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RomanMapping {
  symbol: string;
  value: number;
  nameMl: string;
}

const PRIMARY_SYMBOLS: RomanMapping[] = [
  { symbol: 'I', value: 1, nameMl: 'ഒന്ന്' },
  { symbol: 'V', value: 5, nameMl: 'അഞ്ച്' },
  { symbol: 'X', value: 10, nameMl: 'പത്ത്' },
  { symbol: 'L', value: 50, nameMl: 'അൻപത്' },
  { symbol: 'C', value: 100, nameMl: 'നൂറ്' },
];

const EXAMPLES = [
  { arabic: 3, roman: 'III', ruleEn: 'I + I + I = 3 (Repetition up to 3 times)', ruleMl: '1 + 1 + 1 = 3 (3 തവണ വരെ ആവർത്തിക്കാം)' },
  { arabic: 4, roman: 'IV', ruleEn: '5 - 1 = 4 (I before V means subtract 1)', ruleMl: '5 ൽ നിന്ന് 1 കുറച്ചാൽ 4 (V ക്ക് മുൻപിൽ I)' },
  { arabic: 6, roman: 'VI', ruleEn: '5 + 1 = 6 (I after V means add 1)', ruleMl: '5 നോട് 1 കൂട്ടിയാൽ 6 (V ക്ക് ശേഷം I)' },
  { arabic: 9, roman: 'IX', ruleEn: '10 - 1 = 9 (I before X means subtract 1)', ruleMl: '10 ൽ നിന്ന് 1 കുറച്ചാൽ 9 (X ന് മുൻപിൽ I)' },
  { arabic: 14, roman: 'XIV', ruleEn: '10 + 4 = 14 (X + IV)', ruleMl: '10 + 4 = 14 (X ഉം IV ഉം ചേരുമ്പോൾ)' },
  { arabic: 25, roman: 'XXV', ruleEn: '10 + 10 + 5 = 25 (XX + V)', ruleMl: '10 + 10 + 5 = 25' },
  { arabic: 50, roman: 'L', ruleEn: 'L represents 50', ruleMl: 'L എന്നാൽ 50 ആണ്' },
  { arabic: 100, roman: 'C', ruleEn: 'C represents 100 (Century)', ruleMl: 'C എന്നാൽ 100 ആണ്' }
];

export const RomanNumeralExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedExample, setSelectedExample] = useState(EXAMPLES[0]);

  // Interactive builder state
  const [builtString, setBuiltString] = useState<string>('');

  const computeRomanValue = (str: string): number => {
    const valMap: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100 };
    let total = 0;
    for (let i = 0; i < str.length; i++) {
      const cur = valMap[str[i]] || 0;
      const next = valMap[str[i + 1]] || 0;
      if (cur < next) {
        total -= cur;
      } else {
        total += cur;
      }
    }
    return total;
  };

  const addSymbol = (sym: string) => {
    if (builtString.length < 8) {
      setBuiltString(s => s + sym);
    }
  };

  const clearBuilder = () => {
    setBuiltString('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-vaayana-lime/20 border border-vaayana-lime/40 flex items-center justify-center text-vaayana-lime font-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-vaayana-textLight">
              {language === 'ml' ? 'റോമൻ സംഖ്യകൾ (Roman Numerals)' : 'Roman Numeral Explorer'}
            </h3>
            <p className="text-xs text-vaayana-textLightMuted">
              {language === 'ml' ? 'I, V, X, L, C തുടങ്ങിയ ചിഹ്നങ്ങളും അവയുടെ നിയമങ്ങളും' : 'Learn I, V, X, L, C and build Roman numbers'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Roman Symbols Row */}
      <div className="grid grid-cols-5 gap-3 sm:gap-4">
        {PRIMARY_SYMBOLS.map(sym => (
          <div 
            key={sym.symbol} 
            className="p-4 sm:p-5 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card text-center space-y-1"
          >
            <span className="text-3xl sm:text-4xl font-black text-vaayana-textDark font-serif block">
              {sym.symbol}
            </span>
            <span className="text-lg font-black text-vaayana-limeDark font-mono block">
              = {sym.value}
            </span>
            <span className="text-[11px] font-bold text-vaayana-textDarkMuted font-malayalam block">
              {sym.nameMl}
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Builder and Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Interactive Roman Builder */}
        <div className="lg:col-span-6 bg-vaayana-softSurface p-6 sm:p-8 rounded-4xl border border-vaayana-softBorder shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-vaayana-softBorder pb-3">
            <h4 className="text-base font-black text-vaayana-textDark font-malayalam">
              {language === 'ml' ? 'റോമൻ സംഖ്യ നിർമ്മാണം (Builder)' : 'Interactive Roman Number Builder'}
            </h4>
            <button
              onClick={clearBuilder}
              className="p-2 rounded-xl bg-vaayana-soft hover:bg-vaayana-softBorder text-vaayana-textDark"
              title="Clear"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Builder Display Card */}
          <div className="p-6 rounded-3xl bg-vaayana-dark border border-vaayana-darkBorder text-center space-y-2">
            <span className="text-xs font-mono font-bold text-vaayana-lime uppercase block">
              Roman Numeral
            </span>
            <div className="text-4xl sm:text-5xl font-black font-serif text-amber-300 min-h-[50px]">
              {builtString || '—'}
            </div>
            <div className="text-2xl font-black text-vaayana-lime font-mono pt-1">
              = {computeRomanValue(builtString)}
            </div>
          </div>

          {/* Symbol Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {PRIMARY_SYMBOLS.map(sym => (
              <button
                key={sym.symbol}
                onClick={() => addSymbol(sym.symbol)}
                className="py-3 sm:py-4 rounded-2xl bg-vaayana-dark hover:bg-vaayana-darkHover border border-vaayana-darkBorder text-vaayana-lime font-serif font-black text-xl sm:text-2xl active:scale-95 transition-all shadow-sm"
              >
                +{sym.symbol}
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-vaayana-textDarkMuted font-medium">
            {language === 'ml' ? 'ചിഹ്നങ്ങളിൽ തൊട്ട് റോമൻ സംഖ്യകൾ സ്വയം നിർമ്മിച്ചു നോക്കൂ' : 'Tap symbols to construct Roman numerals and see dynamic values'}
          </p>
        </div>

        {/* Right: Key Curriculum Examples */}
        <div className="lg:col-span-6 bg-vaayana-darkSurface p-6 sm:p-8 rounded-4xl border border-vaayana-darkBorder shadow-darkCard space-y-4 text-vaayana-textLight">
          <h4 className="text-base font-black text-vaayana-lime font-malayalam flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-vaayana-lime" />
            <span>{language === 'ml' ? 'പ്രധാന ഉദാഹരണങ്ങളും നിയമങ്ങളും' : 'SCERT Rules & Examples'}</span>
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            {EXAMPLES.map(ex => {
              const isSelected = selectedExample.arabic === ex.arabic;
              return (
                <button
                  key={ex.arabic}
                  onClick={() => setSelectedExample(ex)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-vaayana-lime text-vaayana-dark border-vaayana-lime font-black'
                      : 'bg-vaayana-dark border-vaayana-darkBorder text-vaayana-textLight hover:border-vaayana-darkMuted'
                  }`}
                >
                  <span className="font-mono text-sm block">{ex.arabic} = {ex.roman}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed rule explanation card */}
          <div className="p-4 rounded-2xl bg-vaayana-dark border border-vaayana-darkBorder space-y-1.5 mt-2">
            <div className="text-xl font-black font-serif text-amber-300">
              {selectedExample.arabic} = {selectedExample.roman}
            </div>
            <p className="text-sm font-bold font-malayalam text-vaayana-textLight leading-relaxed">
              {language === 'ml' ? selectedExample.ruleMl : selectedExample.ruleEn}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
