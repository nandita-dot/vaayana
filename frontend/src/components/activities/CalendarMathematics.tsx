import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Award,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';

interface MonthData {
  nameEn: string;
  nameMl: string;
  year: number;
  daysCount: number;
  startDayOfWeek: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  isLeapYear?: boolean;
}

const MONTHS: MonthData[] = [
  { nameEn: 'January', nameMl: 'ജനുവരി', year: 2026, daysCount: 31, startDayOfWeek: 4 }, // Thu
  { nameEn: 'February', nameMl: 'ഫെബ്രുവരി', year: 2026, daysCount: 28, startDayOfWeek: 0, isLeapYear: false },
  { nameEn: 'March', nameMl: 'മാർച്ച്', year: 2026, daysCount: 31, startDayOfWeek: 0 },
  { nameEn: 'April', nameMl: 'ഏപ്രിൽ', year: 2026, daysCount: 30, startDayOfWeek: 3 },
  { nameEn: 'May', nameMl: 'മേയ്', year: 2026, daysCount: 31, startDayOfWeek: 5 },
  { nameEn: 'June', nameMl: 'ജൂൺ', year: 2026, daysCount: 30, startDayOfWeek: 1 },
  { nameEn: 'July', nameMl: 'ജൂലൈ', year: 2026, daysCount: 31, startDayOfWeek: 3 },
  { nameEn: 'August', nameMl: 'ഓഗസ്റ്റ്', year: 2026, daysCount: 31, startDayOfWeek: 6 }
];

const WEEKDAYS = [
  { en: 'Sun', ml: 'ഞായർ', isWeekend: true },
  { en: 'Mon', ml: 'തിങ്കൾ', isWeekend: false },
  { en: 'Tue', ml: 'ചൊവ്വ', isWeekend: false },
  { en: 'Wed', ml: 'ബുധൻ', isWeekend: false },
  { en: 'Thu', ml: 'വ്യാഴം', isWeekend: false },
  { en: 'Fri', ml: 'വെള്ളി', isWeekend: false },
  { en: 'Sat', ml: 'ശനി', isWeekend: false }
];

interface CalendarChallenge {
  id: string;
  monthIdx: number;
  questionEn: string;
  questionMl: string;
  type: 'click-date' | 'select-day' | 'number-input';
  correctDate?: number;
  correctDay?: string;
  correctNumber?: number;
  options?: string[];
  explanationEn: string;
  explanationMl: string;
}

const CHALLENGES: CalendarChallenge[] = [
  {
    id: 'c1',
    monthIdx: 0, // January
    questionEn: 'What day of the week is the 15th of January?',
    questionMl: 'ജനുവരി 15 ഏത് ദിവസമാണ്?',
    type: 'select-day',
    correctDay: 'Thu',
    options: ['Sun', 'Tue', 'Thu', 'Sat'],
    explanationEn: 'Look at row containing 15 and trace upwards: 15 falls on Thursday (വ്യാഴം).',
    explanationMl: '15-ാം തീയതിക്ക് മുകളിലേക്ക് നോക്കൂ: അത് വ്യാഴാഴ്ചയാണ് (Thursday).'
  },
  {
    id: 'c2',
    monthIdx: 0, // January
    questionEn: 'How many Sundays are there in this month of January?',
    questionMl: 'ഈ ജനുവരി മാസത്തിൽ എത്ര ഞായറാഴ്ചകൾ ഉണ്ട്?',
    type: 'number-input',
    correctNumber: 4,
    explanationEn: 'The Sundays in Jan 2026 are: 4, 11, 18, 25. Total = 4 Sundays.',
    explanationMl: 'ജനുവരിയിലെ ഞായറാഴ്ചകൾ: 4, 11, 18, 25. ആകെ = 4 ഞായറാഴ്ചകൾ.'
  },
  {
    id: 'c3',
    monthIdx: 0, // January
    questionEn: 'What date will it be exactly 7 days after the 12th?',
    questionMl: '12-ാം തീയതി കഴിഞ്ഞ് കൃത്യം 7 ദിവസം കഴിഞ്ഞാൽ ഏത് തീയതിയായിരിക്കും?',
    type: 'click-date',
    correctDate: 19,
    explanationEn: '12 + 7 = 19th! It falls on the exact same day of the week (Monday)!',
    explanationMl: '12 + 7 = 19! കൃത്യം ഒരാഴ്ച കഴിഞ്ഞ് അതേ ആഴ്ചയിലെ തിങ്കളാഴ്ച വരുന്നു.'
  },
  {
    id: 'c4',
    monthIdx: 3, // April
    questionEn: 'How many total days are there in the month of April?',
    questionMl: 'ഏപ്രിൽ മാസത്തിൽ ആകെ എത്ര ദിവസങ്ങളുണ്ട്?',
    type: 'number-input',
    correctNumber: 30,
    explanationEn: 'April has 30 days ("Thirty days hath September, April, June, and November").',
    explanationMl: 'ഏപ്രിൽ മാസത്തിൽ ആകെ 30 ദിവസങ്ങളാണുള്ളത്.'
  },
  {
    id: 'c5',
    monthIdx: 1, // February
    questionEn: 'February 2026 has 28 days. In a Leap Year, how many days does February have?',
    questionMl: '2026 ഫെബ്രുവരിയിൽ 28 ദിവസങ്ങളുണ്ട്. ഒരു അധിവർഷത്തിൽ (Leap Year) ഫെബ്രുവരിയിൽ എത്ര ദിവസങ്ങളുണ്ടാകും?',
    type: 'number-input',
    correctNumber: 29,
    explanationEn: 'A leap year occurs every 4 years and adds 1 extra day to February: 29 days!',
    explanationMl: 'നാല് വർഷത്തിലൊരിക്കൽ വരുന്ന അധിവർഷത്തിൽ ഫെബ്രുവരിക്ക് 29 ദിവസങ്ങൾ ഉണ്ടാകും!'
  }
];

export const CalendarMathematics: React.FC = () => {
  const { language } = useLanguage();

  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [challengeIdx, setChallengeIdx] = useState<number>(0);

  // Student inputs
  const [selectedDayOption, setSelectedDayOption] = useState<string | null>(null);
  const [inputNumber, setInputNumber] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const month = MONTHS[currentMonthIdx];
  const activeChallenge = CHALLENGES[challengeIdx];

  const handleMonthPrev = () => {
    soundService.play('click');
    setCurrentMonthIdx((idx) => (idx === 0 ? MONTHS.length - 1 : idx - 1));
    setSelectedDate(null);
  };

  const handleMonthNext = () => {
    soundService.play('click');
    setCurrentMonthIdx((idx) => (idx === MONTHS.length - 1 ? 0 : idx + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (dayNumber: number) => {
    soundService.play('click');
    setSelectedDate(dayNumber);

    // If active challenge is clicking a date
    if (activeChallenge.type === 'click-date') {
      if (dayNumber === activeChallenge.correctDate) {
        soundService.play('correct');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        setFeedback({
          isCorrect: true,
          message: language === 'ml' ? 'ശരിയാണ്! വെരി ഗുഡ്!' : 'Correct date selected! Wonderful!'
        });
        setShowExplanation(true);
      } else {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' 
            ? `നിങ്ങൾ തിരഞ്ഞെടുത്തത് ${dayNumber} ആണ്. വീണ്ടും ശ്രദ്ധിച്ച് കണക്കുകൂട്ടൂ.` 
            : `You selected ${dayNumber}. Try counting carefully from the 12th.`
        });
      }
    }
  };

  const handleCheckChallenge = () => {
    if (activeChallenge.type === 'select-day') {
      if (!selectedDayOption) {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' ? 'ഒരു ദിവസം തിരഞ്ഞെടുക്കുക.' : 'Please select an option.'
        });
        return;
      }
      if (selectedDayOption === activeChallenge.correctDay) {
        soundService.play('correct');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        setFeedback({
          isCorrect: true,
          message: language === 'ml' ? 'ശരിയുത്തരം! വ്യാഴാഴ്ചയാണ്.' : 'Correct! It is indeed Thursday!'
        });
        setShowExplanation(true);
      } else {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' ? 'തെറ്റാണ്. കലണ്ടറിലെ വരികൾ മുകളിലേക്ക് നോക്കൂ.' : 'Not quite. Check the weekday header above the 15th.'
        });
      }
    } else if (activeChallenge.type === 'number-input') {
      const val = parseInt(inputNumber.trim(), 10);
      if (isNaN(val)) {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' ? 'ദയവായി ഒരു സംഖ്യ നൽകുക.' : 'Please enter a number.'
        });
        return;
      }
      if (val === activeChallenge.correctNumber) {
        soundService.play('correct');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        setFeedback({
          isCorrect: true,
          message: language === 'ml' ? 'തികച്ചും ശരിയാണ്! വെരി ഗുഡ്!' : 'Spot on! Correct answer!'
        });
        setShowExplanation(true);
      } else {
        soundService.play('incorrect');
        setFeedback({
          isCorrect: false,
          message: language === 'ml' ? 'ശ്രമിക്കൂ! കലണ്ടറിലെ ദിവസങ്ങൾ എണ്ണി നോക്കൂ.' : 'Try again! Count the days in the column/month.'
        });
      }
    }
  };

  const handleNextChallenge = () => {
    soundService.play('click');
    const nextIdx = (challengeIdx + 1) % CHALLENGES.length;
    setChallengeIdx(nextIdx);
    setCurrentMonthIdx(CHALLENGES[nextIdx].monthIdx);
    setFeedback(null);
    setShowExplanation(false);
    setSelectedDayOption(null);
    setInputNumber('');
  };

  // Build 42 grid cells (6 rows x 7 cols) for the monthly calendar
  const totalCells = 42;
  const daysInGrid: (number | null)[] = [];
  for (let i = 0; i < month.startDayOfWeek; i++) {
    daysInGrid.push(null);
  }
  for (let d = 1; d <= month.daysCount; d++) {
    daysInGrid.push(d);
  }
  while (daysInGrid.length < totalCells) {
    daysInGrid.push(null);
  }

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Top Banner */}
      <div className="bg-vaayana-darkSurface p-4 sm:p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-emerald-950 uppercase tracking-wider">
              {language === 'ml' ? 'പ്രവർത്തനം 3' : 'Activity 3'}
            </span>
            <span className="text-xs font-bold text-vaayana-textLightMuted">
              Class 4 Mathematics • Chapter 5
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-vaayana-textLight mt-1 font-malayalam">
            {language === 'ml' ? 'കലണ്ടർ ഗണിതം (Calendar Mathematics)' : 'Calendar Mathematics'}
          </h2>
          <p className="text-xs sm:text-sm text-vaayana-textLightMuted mt-1">
            {language === 'ml'
              ? 'മാസങ്ങൾ, ആഴ്ചയിലെ ദിവസങ്ങൾ, തീയതി വ്യത്യാസങ്ങൾ എന്നിവ കലണ്ടർ തൊട്ടുനോക്കി പഠിക്കാം.'
              : 'Explore months, weekdays, elapsed days, and leap years using an interactive monthly calendar.'}
          </p>
        </div>

        {/* Challenge Switcher Button */}
        <button
          onClick={handleNextChallenge}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-xs sm:text-sm shadow-limeGlow transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-vaayana-dark" />
          <span>{language === 'ml' ? 'അടുത്ത വെല്ലുവിളി (Next Challenge)' : 'Next Challenge'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: The Large Monthly Interactive Calendar Grid (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-vaayana-softSurface border border-vaayana-softBorder shadow-card space-y-4">
          
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-vaayana-softMuted">
            <button
              onClick={handleMonthPrev}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 transition-all active:scale-95 shadow-sm"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black text-navy-900 font-malayalam">
                {language === 'ml' ? month.nameMl : month.nameEn} {month.year}
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {month.daysCount} {language === 'ml' ? 'ദിവസങ്ങൾ (Days)' : 'Days'}
              </span>
            </div>

            <button
              onClick={handleMonthNext}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 transition-all active:scale-95 shadow-sm"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Columns Header */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {WEEKDAYS.map((wd, i) => (
              <div 
                key={i} 
                className={`py-2 rounded-xl text-xs font-black ${
                  wd.isWeekend 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200/60' 
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <div>{wd.en}</div>
                <div className="text-[10px] font-bold opacity-80 font-malayalam">{wd.ml}</div>
              </div>
            ))}
          </div>

          {/* Date Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {daysInGrid.map((dayNum, idx) => {
              if (dayNum === null) {
                return (
                  <div 
                    key={`empty-${idx}`} 
                    className="h-12 sm:h-14 rounded-2xl bg-slate-50/50 border border-transparent" 
                  />
                );
              }

              const isSelected = selectedDate === dayNum;
              const isSunday = (idx % 7) === 0;

              return (
                <motion.button
                  key={`day-${dayNum}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(dayNum)}
                  className={`h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-bold transition-all relative ${
                    isSelected
                      ? 'bg-vaayana-lime text-vaayana-dark border-2 border-vaayana-dark shadow-limeGlow z-10'
                      : isSunday
                      ? 'bg-rose-50/80 text-rose-700 hover:bg-rose-100 border border-rose-200/50'
                      : 'bg-white text-navy-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-base sm:text-lg font-black font-mono">
                    {dayNum}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-vaayana-dark mt-0.5" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Selected Date Summary Banner */}
          {selectedDate && (
            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between">
              <span>
                {language === 'ml' ? 'തിരഞ്ഞെടുത്ത തീയതി' : 'Selected Date'}:{' '}
                <strong className="text-navy-900">{selectedDate} {month.nameEn} {month.year}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-navy-900">
                {WEEKDAYS[(month.startDayOfWeek + selectedDate - 1) % 7].en} (
                {WEEKDAYS[(month.startDayOfWeek + selectedDate - 1) % 7].ml})
              </span>
            </div>
          )}

        </div>

        {/* Right: Challenge Panel & Educational Concept Cards (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-vaayana-darkSurface border border-vaayana-darkBorder shadow-darkCard space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-vaayana-lime" />
              <h3 className="text-lg font-black text-vaayana-textLight font-malayalam">
                {language === 'ml' ? 'കലണ്ടർ ചോദ്യം (Challenge)' : 'Calendar Challenge'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-vaayana-lime bg-vaayana-dark px-2.5 py-1 rounded-lg border border-vaayana-darkBorder">
              {challengeIdx + 1} / {CHALLENGES.length}
            </span>
          </div>

          {/* Question Box */}
          <div className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-darkBorder space-y-3">
            <p className="text-sm font-extrabold text-vaayana-textLight font-malayalam leading-relaxed">
              {language === 'ml' ? activeChallenge.questionMl : activeChallenge.questionEn}
            </p>

            {/* If Challenge Type is Select Day */}
            {activeChallenge.type === 'select-day' && activeChallenge.options && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {activeChallenge.options.map((opt) => {
                  const wd = WEEKDAYS.find(w => w.en === opt);
                  const isSelected = selectedDayOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        soundService.play('click');
                        setSelectedDayOption(opt);
                      }}
                      className={`p-3 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                          : 'bg-vaayana-dark text-vaayana-textLight hover:bg-vaayana-darkBorder border border-vaayana-darkBorder'
                      }`}
                    >
                      <div>{opt}</div>
                      <div className="text-[10px] opacity-80 font-malayalam">{wd?.ml}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* If Challenge Type is Number Input */}
            {activeChallenge.type === 'number-input' && (
              <div className="pt-2">
                <input
                  type="number"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full p-3.5 rounded-xl border border-vaayana-darkBorder bg-vaayana-dark font-mono text-lg font-black text-vaayana-lime focus:outline-none focus:ring-2 focus:ring-vaayana-lime text-center"
                />
              </div>
            )}

            {/* If Challenge Type is Click Date */}
            {activeChallenge.type === 'click-date' && (
              <div className="p-3 bg-vaayana-dark rounded-xl border border-vaayana-darkBorder text-xs text-vaayana-textLightMuted italic">
                {language === 'ml'
                  ? 'കലണ്ടറിലെ ശരിയായ തീയതിയിൽ നേരിട്ട് തൊടുക (Touch the date directly on the calendar).'
                  : 'Touch the correct date directly on the calendar grid.'}
              </div>
            )}

            {activeChallenge.type !== 'click-date' && (
              <button
                onClick={handleCheckChallenge}
                className="w-full py-3.5 px-4 rounded-xl bg-vaayana-lime hover:bg-lime-400 text-vaayana-dark font-black text-sm shadow-limeGlow transition-all active:scale-95"
              >
                {language === 'ml' ? 'ഉത്തരം സമർപ്പിക്കുക' : 'Submit Answer'}
              </button>
            )}
          </div>

          {/* Feedback Display */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-3 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
                  : 'bg-rose-950/80 text-rose-200 border border-rose-800'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-vaayana-lime shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="font-malayalam leading-relaxed">{feedback.message}</div>
            </motion.div>
          )}

          {/* Explanation Box */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-vaayana-darkElevated border border-vaayana-lime/30 space-y-2 text-xs text-vaayana-textLight"
            >
              <div className="font-black text-sm text-vaayana-lime flex items-center gap-1.5 font-malayalam">
                <Info className="w-4 h-4 text-vaayana-lime" />
                <span>{language === 'ml' ? 'വിശദീകരണം (Explanation)' : 'Explanation'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'ml' ? activeChallenge.explanationMl : activeChallenge.explanationEn}
              </p>
            </motion.div>
          )}

          {/* Kerala SCERT Leap Year Fact Card */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 space-y-1">
            <span className="font-extrabold text-amber-400 font-malayalam flex items-center gap-1.5">
              <span>💡</span>
              {language === 'ml' ? 'അധിവർഷം (Leap Year) എന്താണ്?' : 'What is a Leap Year?'}
            </span>
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-malayalam">
              {language === 'ml'
                ? 'ഭൂമി സൂര്യനെ ചുറ്റാൻ 365 1/4 ദിവസങ്ങൾ എടുക്കുന്നു. 4 വർഷം കൂടുമ്പോൾ ഈ 1/4 ദിവസങ്ങൾ ചേർന്ന് 1 അധിക ദിവസമായി ഫെബ്രുവരി 29 ഉണ്ടാകുന്നു (ആകെ 366 ദിവസങ്ങൾ).'
                : 'A leap year has 366 days instead of 365. The extra day is added to February (Feb 29), happening once every 4 years.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
