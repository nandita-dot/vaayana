import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Presentation, 
  GraduationCap, 
  Languages, 
  ShieldCheck, 
  ArrowRight,
  Tv,
  Brain,
  Sparkles,
  BookOpen,
  Compass,
  Calculator,
  TreePine,
  Feather,
  Gamepad2,
  Play,
  Volume2,
  Shapes,
  FileUp,
  Star
} from 'lucide-react';
import { UploadModal } from '../components/UploadModal';
import { SubjectIllustration2D } from '../components/illustrations/SubjectIllustration2D';
import { HomepageDoodleCanvas } from '../components/illustrations/HomepageDoodleCanvas';
import { CALM_EASE, cardHoverMotion, buttonMotion } from '../animations/motionPresets';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Subject configurations with distinct identities, color themes & metadata
  const subjects = [
    {
      id: 'Mathematics',
      titleEn: 'Mathematics',
      titleMl: 'ഗണിതം',
      subtitleEn: 'Angles, shapes, clock & numbers',
      subtitleMl: 'ജ്യാമിതി, അബാക്കസ്, സമയം & ക്രിയകൾ',
      descEn: 'Master lines, shapes, abacus place value, analog clocks, tangrams, and arithmetic through interactive manipulatives.',
      descMl: 'വരകളും രൂപങ്ങളും, അബാക്കസ് സ്ഥാനവില, സമയവും ഘടികാരവും, ടാൻഗ്രാം മാതൃകകളും സ്മാർട്ട്ബോർഡിൽ തൊട്ടുപഠിക്കാം.',
      accentColor: '#A881E6',
      borderClass: 'border-[#7950B8]/40 hover:border-[#A881E6]',
      bgGlow: 'from-[#563580]/25 via-[#1C152B] to-[#120D1D]',
      badgeBg: 'bg-[#563580]/30 text-[#EDE5F7] border border-[#7950B8]/50',
      tagColor: 'bg-[#7950B8]/20 text-[#EDE5F7] border border-[#7950B8]/40',
      btnBg: 'bg-[#563580] hover:bg-[#683FA7] text-white',
      btnTextEn: 'Explore Mathematics',
      btnTextMl: 'ഗണിതം ആരംഭിക്കാം',
      icon: Calculator,
      unitsCountEn: '4 Interactive Units',
      unitsCountMl: '4 പാഠങ്ങൾ',
      topics: ['Lines & Shapes', 'Abacus', 'Analog Clock', 'Fractions']
    },
    {
      id: 'Environmental Studies',
      titleEn: 'Environmental Studies',
      titleMl: 'പരിസരപഠനം (EVS)',
      subtitleEn: 'Science, nature, planets & directions',
      subtitleMl: 'പ്രകൃതി, ശാസ്ത്രം, സൗരയൂഥം & ദിശകൾ',
      descEn: 'Explore states of matter, the solar system, water cycle, 8 compass directions, and Kerala’s rich biodiversity.',
      descMl: 'ഖരം, ദ്രാവകം, വാതകം, സൗരയൂഥം, 8 ദിശകളും കോമ്പസും, കേരളത്തിലെ പ്രകൃതിവിഭവങ്ങളും കണ്ടെത്താം.',
      accentColor: '#72D6B0',
      borderClass: 'border-[#72D6B0]/40 hover:border-[#72D6B0]',
      bgGlow: 'from-[#1B382F]/30 via-[#13221C] to-[#0E1714]',
      badgeBg: 'bg-[#72D6B0]/15 text-[#72D6B0] border border-[#72D6B0]/40',
      tagColor: 'bg-[#72D6B0]/15 text-[#72D6B0] border border-[#72D6B0]/30',
      btnBg: 'bg-[#1E523F] hover:bg-[#25684F] text-[#72D6B0] hover:text-white',
      btnTextEn: 'Explore Environment',
      btnTextMl: 'പരിസരപഠനം തുറക്കാം',
      icon: TreePine,
      unitsCountEn: '4 Science Units',
      unitsCountMl: '4 പാഠങ്ങൾ',
      topics: ['Matter & Liquids', 'Solar System', 'Directions', 'Kerala Nature']
    },
    {
      id: 'English',
      titleEn: 'English',
      titleMl: 'ഇംഗ്ലീഷ്',
      subtitleEn: 'Stories, vocabulary & read-aloud',
      subtitleMl: 'കഥകൾ, വായന & പുതിയ വാക്കുകൾ',
      descEn: 'Experience rich storytelling, narrative comprehension, moral reflection, and bilingual vocabulary building.',
      descMl: 'സത്യസന്ധതയുടെ വിത്ത്, രസകരമായ കഥകൾ, വായനാനുഭവങ്ങൾ, പുതിയ ഇംഗ്ലീഷ് വാക്കുകൾ എന്നിവ ആസ്വദിക്കാം.',
      accentColor: '#FFD166',
      borderClass: 'border-[#FFD166]/40 hover:border-[#FFD166]',
      bgGlow: 'from-[#3A2D16]/30 via-[#1F190F] to-[#141009]',
      badgeBg: 'bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/40',
      tagColor: 'bg-[#FFD166]/15 text-[#FFD166] border border-[#FFD166]/30',
      btnBg: 'bg-[#5C4513] hover:bg-[#73571A] text-[#FFD166] hover:text-white',
      btnTextEn: 'Explore English',
      btnTextMl: 'ഇംഗ്ലീഷ് വായിക്കാം',
      icon: Feather,
      unitsCountEn: '3 Story Units',
      unitsCountMl: '3 പാഠങ്ങൾ',
      topics: ['The Seed of Truth', 'Story Reading', 'New Words', 'Audio Tales']
    }
  ];

  // Pedagogical Strengths / Key discovery indicators
  const discoveryCapsules = [
    {
      icon: Gamepad2,
      labelEn: 'Touch Playgrounds',
      labelMl: 'സ്പർശന കളിക്കളങ്ങൾ',
      descEn: 'Hands-on smartboard manipulatives',
      descMl: 'സ്പർശന മാതൃകകൾ',
      color: 'text-[#72D6B0]',
      border: 'border-[#72D6B0]/30 bg-[#72D6B0]/10',
      link: '/classroom'
    },
    {
      icon: Languages,
      labelEn: 'Bilingual Narration',
      labelMl: 'ദ്വിഭാഷാ വിവരണം',
      descEn: 'Malayalam & English audio',
      descMl: 'മലയാളം & ഇംഗ്ലീഷ് ശബ്ദം',
      color: 'text-[#65C7F7]',
      border: 'border-[#65C7F7]/30 bg-[#65C7F7]/10',
      link: '/classroom'
    },
    {
      icon: Sparkles,
      labelEn: 'Kerala SCERT Class 4',
      labelMl: 'നാലാം ക്ലാസ്സ് SCERT',
      descEn: 'Tailored for state schools',
      descMl: 'പൊതുവിദ്യാലയ പാഠ്യപദ്ധതി',
      color: 'text-[#FFD166]',
      border: 'border-[#FFD166]/30 bg-[#FFD166]/10',
      link: '/classroom'
    },
    {
      icon: ShieldCheck,
      labelEn: '100% Offline & Private',
      labelMl: 'പൂർണ്ണ ഓഫ്‌ലൈൻ',
      descEn: 'Zero cloud tracking',
      descMl: 'സുരക്ഷിത ലോക്കൽ ശേഖരം',
      color: 'text-[#F497B6]',
      border: 'border-[#F497B6]/30 bg-[#F497B6]/10',
      link: '/library'
    }
  ];

  // Core Educational Innovations
  const features = [
    {
      icon: Presentation,
      accentColor: 'text-[#72D6B0]',
      accentBg: 'bg-[#72D6B0]/15 border-[#72D6B0]/30',
      titleEn: 'Smartboard Interactive Pedagogy',
      titleMl: 'സ്മാർട്ട്ബോർഡ് സംവേദനാത്മക പഠനം',
      descEn: 'Engineered with massive touch targets, responsive 2D manipulatives, and visual flip cards tailored for classroom smartboards.',
      descMl: 'സ്കൂളുകളിലെ സ്മാർട്ട്ബോർഡുകൾക്ക് അനുയോജ്യമായ വലിയ ടച്ച് കൺട്രോളുകളും ആകർഷകമായ ചിത്രീകരണങ്ങളും.'
    },
    {
      icon: Languages,
      accentColor: 'text-[#EDE5F7]',
      accentBg: 'bg-[#563580]/30 border-[#7950B8]/40',
      titleEn: 'Bilingual Malayalam & English',
      titleMl: 'പൂർണ്ണ മലയാളം & ഇംഗ്ലീഷ് പിന്തുണ',
      descEn: 'Dual-language audio narration and Malayalam typography crafted specifically for Kerala SCERT curriculum.',
      descMl: 'കേരളത്തിലെ അധ്യാപകർക്കും കുട്ടികൾക്കുമായി പ്രകൃതിദത്തമായ മലയാളം ലിപി രൂപകൽപ്പനയും ഓഡിയോ വിവരണവും.'
    },
    {
      icon: Brain,
      accentColor: 'text-[#FFD166]',
      accentBg: 'bg-[#FFD166]/15 border-[#FFD166]/30',
      titleEn: 'Hierarchical Textbook Understanding',
      titleMl: 'AI പാഠപുസ്തക വിശകലനം',
      descEn: 'PyMuPDF and Gemini analyze multi-page chapters, extracting grounded concepts, vocabulary, and interactive activities.',
      descMl: 'സാധാരണ പാഠപുസ്തക ഭാഗങ്ങളെ നിമിഷങ്ങൾക്കകം സംവേദനാത്മക ദൃശ്യപാഠങ്ങളാക്കി മാറ്റുന്നു.'
    },
    {
      icon: ShieldCheck,
      accentColor: 'text-[#65C7F7]',
      accentBg: 'bg-[#65C7F7]/15 border-[#65C7F7]/30',
      titleEn: 'Zero Cloud Database & 100% Private',
      titleMl: 'സമ്പൂർണ്ണ സ്വകാര്യത, ക്ലൗഡ് ഡാറ്റാബേസ് ഇല്ല',
      descEn: 'All lessons reside locally in SQLite and browser IndexedDB. No student tracking, no logins, works offline.',
      descMl: 'വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ ശേഖരിക്കാതെ, എല്ലാ പാഠങ്ങളും നിങ്ങളുടെ സ്വന്തം കമ്പ്യൂട്ടറിൽ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.'
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#09080F] text-[#EDE5F7] selection:bg-[#7950B8]/30 overflow-hidden">
      
      {/* ===================================================================
          TRANSPARENT COLORFUL 2D EDUCATIONAL DOODLE BACKGROUND LAYER
          Positioned strictly in margins and flanks; never overlaps UI cards/text.
         =================================================================== */}
      <HomepageDoodleCanvas />

      {/* ===================================================================
          1. HERO STAGE: INTENTIONAL, IMMERSIVE SMARTBOARD GATEWAY
         =================================================================== */}
      <section className="relative z-10 w-full overflow-hidden border-b border-[#282136]/70">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#563580]/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-[#72D6B0]/08 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-[#FFD166]/08 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20 text-center space-y-8">
          
          {/* Top School & Curriculum Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: CALM_EASE }}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-[#161220]/90 border border-[#282136] shadow-md backdrop-blur-md text-xs sm:text-sm font-semibold"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#72D6B0] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#72D6B0]" />
            </span>
            <span className="font-malayalam text-[#EDE5F7] font-black">
              {language === 'ml' ? 'എ.എൽ.പി സ്കൂൾ കൂട്ടാല' : 'ALP School Koottala'}
            </span>
            <span className="text-[#3D2D56]">•</span>
            <span className="text-[#E8DDC8] font-bold">Palakkad, Kerala</span>
            <span className="text-[#3D2D56] hidden md:inline">•</span>
            <span className="text-[#A59CB5] hidden md:inline text-[11px] font-semibold uppercase tracking-wider">
              {language === 'ml' ? 'നാലാം ക്ലാസ്സ് സ്മാർട്ട് ലേണിംഗ്' : 'Class 4 Smart Learning'}
            </span>
          </motion.div>

          {/* Welcoming Bilingual Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: CALM_EASE }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#EDE5F7] leading-[1.12]">
              {language === 'ml' ? (
                <>
                  പാഠപുസ്തകങ്ങൾ ഇനി <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDE5F7] via-[#A881E6] to-[#FFD166] font-malayalam">
                    കണ്ണഞ്ചിപ്പിക്കുന്ന ദൃശ്യാനുഭവങ്ങൾ!
                  </span>
                </>
              ) : (
                <>
                  Transform Class 4 Textbooks <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDE5F7] via-[#A881E6] to-[#FFD166]">
                    into Interactive Wonder
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-[#E8DDC8]/90 leading-relaxed font-normal max-w-2xl mx-auto">
              {language === 'ml' 
                ? 'ഓരോ പാഠവും ഒരു പുതിയ കണ്ടെത്തൽ! സ്കൂളുകളിലെ സ്മാർട്ട്ബോർഡുകൾക്കായി വലിയ ടച്ച് ബട്ടണുകളും ദ്വിഭാഷാ ശബ്ദ വിവരണവും സഹിതം ഒരുക്കിയ ഡിജിറ്റൽ പഠന സഹായി.'
                : 'Every lesson is a new discovery! Empowering Kerala government school teachers and students with touch-first controls, bilingual audio, and visual learning on classroom smartboards.'}
            </p>
          </motion.div>

          {/* Primary Action Suite */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: CALM_EASE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            {/* Main CTA: Open Smartboard Classroom */}
            <motion.div {...buttonMotion} className="w-full sm:w-auto">
              <Link
                to="/classroom"
                className="w-full sm:w-auto flex items-center justify-center gap-3.5 px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-[#563580] to-[#7950B8] hover:from-[#643D96] hover:to-[#885BCB] text-white font-black text-base shadow-xl shadow-purple-950/60 border border-[#9C6BDB]/40 transition-all group"
              >
                <Presentation className="w-5 h-5 text-white" />
                <span>{language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ്‌റൂം തുറക്കുക' : 'Enter Smart Classroom'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-white" />
              </Link>
            </motion.div>

            {/* Secondary CTA: Prepare Lessons */}
            <motion.div {...buttonMotion} className="w-full sm:w-auto">
              <Link
                to="/teacher"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-2xl bg-[#161220] hover:bg-[#1E182B] text-[#EDE5F7] border border-[#282136] hover:border-[#7950B8]/60 font-bold text-base shadow-md transition-all"
              >
                <GraduationCap className="w-5 h-5 text-[#A881E6]" />
                <span>{language === 'ml' ? 'പാഠങ്ങൾ തയ്യാറാക്കുക' : 'Prepare Lessons'}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Demo Lesson Launch Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28, ease: CALM_EASE }}
            className="pt-1 flex items-center justify-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-[#120E1C]/80 border border-[#282136] text-xs text-[#E8DDC8]">
              <span className="flex items-center gap-1.5 text-[#FFD166] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#FFD166]" />
                {language === 'ml' ? 'മാതൃകാ പാഠം:' : 'Featured Demo:'}
              </span>
              <span className="font-semibold text-[#EDE5F7]">
                {language === 'ml' ? 'വരകളും രൂപങ്ങളും (ഗണിതം)' : 'Lines and Shapes (Mathematics)'}
              </span>
              <button
                onClick={() => navigate('/lesson/scert-std4-maths-ch1-lines-and-shapes')}
                className="ml-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#563580]/40 hover:bg-[#563580] text-[#EDE5F7] font-bold transition-all border border-[#7950B8]/40 hover:scale-105"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{language === 'ml' ? 'തുടങ്ങുക' : 'Launch'}</span>
              </button>
            </div>
          </motion.div>

          {/* 4 Feature Discovery Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: CALM_EASE }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto"
          >
            {discoveryCapsules.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className={`p-3.5 rounded-2xl border ${item.border} flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95 group text-left`}
                >
                  <div className={`p-2 rounded-xl bg-[#0F0C16] shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-black truncate text-[#EDE5F7] group-hover:${item.color} transition-colors`}>
                      {language === 'ml' ? item.labelMl : item.labelEn}
                    </p>
                    <p className="text-[11px] text-[#A59CB5] truncate font-medium">
                      {language === 'ml' ? item.descMl : item.descEn}
                    </p>
                  </div>
                </Link>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ===================================================================
          2. CENTRAL CROWN FEATURE: THE RE-IMAGINED SUBJECT DISCOVERY HUB
         =================================================================== */}
      <section className="relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161220] border border-[#282136] text-xs font-black tracking-wider text-[#A881E6] uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'ml' ? 'വിഷയങ്ങൾ തിരഞ്ഞെടുക്കാം' : 'Curriculum Discovery'}</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-[#EDE5F7] tracking-tight">
              {language === 'ml' ? 'നാലാം ക്ലാസ്സ് പാഠ്യപദ്ധതി' : 'Class 4 Interactive Subjects'}
            </h2>
            
            <p className="text-[#E8DDC8]/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {language === 'ml'
                ? 'സ്മാർട്ട്ബോർഡിൽ തൊട്ട് അനുഭവിക്കാൻ വിഷയങ്ങൾ തിരഞ്ഞെടുക്കുക. ഓരോ വിഷയത്തിലും ഇന്ററാക്ടീവ് ചിത്രീകരണങ്ങളും കളിക്കളങ്ങളും ഉൾപ്പെടുത്തിയിരിക്കുന്നു.'
                : 'Select a subject to launch touch-first visual lessons, interactive manipulatives, and bilingual narration.'}
            </p>
          </div>

          {/* 3 Distinctive Asymmetrical Subject Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {subjects.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.12, ease: CALM_EASE }}
                  {...cardHoverMotion}
                  className={`bg-gradient-to-b ${sub.bgGlow} rounded-4xl p-6 sm:p-7 border ${sub.borderClass} shadow-2xl flex flex-col justify-between group transition-all relative overflow-hidden`}
                >
                  {/* Subtle Card Ambient Glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
                    style={{ backgroundColor: sub.accentColor }}
                  />

                  {/* Card Top: Header & Badges */}
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${sub.badgeBg}`}>
                        {language === 'ml' ? sub.unitsCountMl : sub.unitsCountEn}
                      </span>
                      
                      <div className="w-10 h-10 rounded-2xl bg-[#0F0C16] border border-[#282136] flex items-center justify-center text-[#EDE5F7] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" style={{ color: sub.accentColor }} />
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className={`text-2xl sm:text-3xl font-black text-[#EDE5F7] group-hover:text-white transition-colors ${language === 'ml' ? 'font-malayalam' : ''}`}>
                        {language === 'ml' ? sub.titleMl : sub.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-[#A59CB5] mt-1">
                        {language === 'ml' ? sub.subtitleMl : sub.subtitleEn}
                      </p>
                    </div>

                    {/* Creative 2D Illustration Showcase Frame */}
                    <div className="w-full h-44 rounded-2xl bg-[#09080F]/90 border border-[#282136] p-3 flex items-center justify-center overflow-hidden relative group-hover:border-opacity-60 transition-colors">
                      <div className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        <SubjectIllustration2D subject={sub.id} className="w-full h-full" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-xs sm:text-sm text-[#E8DDC8]/85 leading-relaxed ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {language === 'ml' ? sub.descMl : sub.descEn}
                    </p>

                    {/* Topic Tags: Clean, Structured Badges */}
                    <div className="pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#A59CB5] block mb-2">
                        {language === 'ml' ? 'പ്രധാന അധ്യായങ്ങൾ:' : 'Core Chapters & Concepts:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.topics.map((t, tidx) => (
                          <span 
                            key={tidx} 
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${sub.tagColor}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Button */}
                  <div className="pt-6 mt-6 border-t border-[#282136]/70 relative z-10">
                    <button
                      onClick={() => navigate(`/classroom?subject=${encodeURIComponent(sub.id)}`)}
                      className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl ${sub.btnBg} font-black text-sm shadow-md transition-all group-hover:scale-[1.02] active:scale-95`}
                    >
                      <span>{language === 'ml' ? sub.btnTextMl : sub.btnTextEn}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================================================================
          3. SMARTBOARD LIVE INTERACTIVE CONSOLE PREVIEW
         =================================================================== */}
      <section className="relative z-10 w-full py-16 sm:py-20 border-t border-b border-[#282136]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: CALM_EASE }}
            className="bg-gradient-to-b from-[#161220] to-[#120E1C] rounded-4xl p-6 sm:p-10 lg:p-12 border border-[#2E263B] shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Compass className="w-80 h-80 text-[#7950B8]" />
            </div>

            {/* Console Header Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#282136] relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#72D6B0]/15 border border-[#72D6B0]/40 text-xs font-black text-[#72D6B0] uppercase tracking-wider">
                  <Tv className="w-3.5 h-3.5" />
                  <span>{language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് മാതൃക' : 'Smartboard Live Preview'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#EDE5F7] font-malayalam">
                  {language === 'ml' ? 'വരകളും രൂപങ്ങളും: കോണുകളും വൃത്തങ്ങളും' : 'Lines and Shapes: Corners & Curves'}
                </h3>
                <p className="text-sm font-semibold text-[#E8DDC8]/80">
                  Class 4 Mathematics • Unit 1 • SCERT Kerala Curriculum
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => navigate('/lesson/scert-std4-maths-ch1-lines-and-shapes')}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#563580] to-[#7950B8] hover:from-[#643D96] hover:to-[#885BCB] text-white font-black text-sm shadow-xl shadow-purple-950/60 transition-all hover:scale-105 active:scale-95 border border-[#9C6BDB]/40"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{language === 'ml' ? 'ഈ പാഠം തുറക്കുക' : 'Launch Demo Lesson'}</span>
                </button>
              </div>
            </div>

            {/* 3 Interactive Progression Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 relative z-10">
              
              {/* Step 1 */}
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-[#120E1C] border border-[#282136] hover:border-[#7950B8]/60 shadow-sm space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-[#563580]/30 text-[#EDE5F7] flex items-center justify-center font-black border border-[#7950B8]/50 text-sm">
                    1
                  </span>
                  <Shapes className="w-4 h-4 text-[#A881E6]" />
                </div>
                <h4 className="font-extrabold text-[#EDE5F7] text-lg">
                  {language === 'ml' ? 'നിരീക്ഷണ ദൃശ്യങ്ങൾ' : 'Visual Manipulatives'}
                </h4>
                <p className="text-sm text-[#E8DDC8]/80 leading-relaxed">
                  {language === 'ml' 
                    ? 'കോണുകൾ, വൃത്തങ്ങൾ, സമചതുരങ്ങൾ എന്നിവ സ്പർശനത്തിലൂടെ പഠിക്കാവുന്ന ആകർഷകമായ 2D രൂപങ്ങൾ.'
                    : 'Interactive 2D vector diagrams illustrating geometric corners, curves, and angles on touchscreens.'}
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-[#120E1C] border border-[#282136] hover:border-[#72D6B0]/60 shadow-sm space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-[#72D6B0]/20 text-[#72D6B0] flex items-center justify-center font-black border border-[#72D6B0]/50 text-sm">
                    2
                  </span>
                  <Volume2 className="w-4 h-4 text-[#72D6B0]" />
                </div>
                <h4 className="font-extrabold text-[#EDE5F7] text-lg">
                  {language === 'ml' ? 'ദ്വിഭാഷാ വിവരണം' : 'Dual Language Audio'}
                </h4>
                <p className="text-sm text-[#E8DDC8]/80 leading-relaxed">
                  {language === 'ml'
                    ? 'മലയാളത്തിലും ഇംഗ്ലീഷിലുമുള്ള വ്യക്തമായ ശബ്ദ വിവരണം ക്ലാസ്സിലെ എല്ലാ കുട്ടികൾക്കും ഒരുപോലെ മനസ്സിലാകുന്നു.'
                    : 'Clear spoken narration in English and Malayalam ensures effortless comprehension for all students.'}
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-[#120E1C] border border-[#282136] hover:border-[#FFD166]/60 shadow-sm space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-[#FFD166]/20 text-[#FFD166] flex items-center justify-center font-black border border-[#FFD166]/50 text-sm">
                    3
                  </span>
                  <Sparkles className="w-4 h-4 text-[#FFD166]" />
                </div>
                <h4 className="font-extrabold text-[#EDE5F7] text-lg">
                  {language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് ക്വിസ്' : 'Smartboard Quizzes'}
                </h4>
                <p className="text-sm text-[#E8DDC8]/80 leading-relaxed">
                  {language === 'ml'
                    ? 'കുട്ടികൾക്ക് സ്മാർട്ട്ബോർഡിൽ നേരിട്ടെത്തി ഉത്തരം തൊടാവുന്ന രസകരമായ ചോദ്യോത്തരങ്ങൾ.'
                    : 'Interactive multiple choice touch quizzes with instant celebratory confetti and feedback.'}
                </p>
              </motion.div>

            </div>

          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          4. CORE PEDAGOGICAL INNOVATIONS (WHY VAAYANA)
         =================================================================== */}
      <section className="relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#A881E6] bg-[#161220] px-3.5 py-1 rounded-full border border-[#282136]">
              {language === 'ml' ? 'പ്രത്യേകതകൾ' : 'Core Innovations'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#EDE5F7]">
              {language === 'ml' ? 'എന്തുകൊണ്ട് വായന (VAAYANA)?' : 'Why Vaayana in the Classroom?'}
            </h2>
            <p className="text-[#E8DDC8]/80 text-sm sm:text-base">
              {language === 'ml'
                ? 'കേരള സർക്കാർ സ്കൂളുകളിലെ നാലാം ക്ലാസ്സ് കുട്ടികൾക്കായി പ്രത്യേകം തയ്യാറാക്കിയ ദൃശ്യ സ്മാർട്ട്ബോർഡ് മാധ്യമം.'
                : 'Designed with the physical reality of Kerala government school Class 4 smart classrooms in mind.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: CALM_EASE }}
                  className="bg-[#120E1C] p-8 rounded-3xl border border-[#282136] shadow-darkCard hover:border-[#7950B8]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl ${feat.accentBg} ${feat.accentColor} flex items-center justify-center shadow-xs border`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className={`text-xl font-bold text-[#EDE5F7] ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {language === 'ml' ? feat.titleMl : feat.titleEn}
                    </h3>
                    <p className={`text-[#E8DDC8]/80 text-sm sm:text-base leading-relaxed ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {language === 'ml' ? feat.descMl : feat.descEn}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================================================================
          5. READY TO BEGIN BANNER & UPLOAD GATEWAY
         =================================================================== */}
      <section className="relative z-10 w-full py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#161220] via-[#1D172A] to-[#161220] border border-[#2E263B] rounded-4xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <h3 className="text-3xl sm:text-4xl font-black text-[#EDE5F7] tracking-tight">
                {language === 'ml' 
                  ? 'നിങ്ങളുടെ ക്ലാസ്സ് റൂം സ്മാർട്ട് ആക്കാൻ തയ്യാറാണോ?' 
                  : 'Ready to bring wonder into your classroom?'}
              </h3>
              <p className="text-[#E8DDC8]/80 text-base sm:text-lg">
                {language === 'ml'
                  ? 'പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്ത് നിങ്ങളുടെ സ്വന്തം ഇന്ററാക്ടീവ് പാഠങ്ങൾ നിർമ്മിക്കാൻ ആരംഭിക്കുക.'
                  : 'Prepare interactive visual slides from your textbooks in minutes or launch pre-curated SCERT lessons.'}
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#563580] to-[#7950B8] hover:from-[#643D96] hover:to-[#885BCB] text-white font-black text-base shadow-xl shadow-purple-950/60 transition-all hover:scale-105 active:scale-95 border border-[#9C6BDB]/40"
                >
                  <FileUp className="w-5 h-5 text-white" />
                  <span>{t('createLesson')}</span>
                </button>
                
                <Link
                  to="/classroom"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#120E1C] hover:bg-[#1A1428] text-[#EDE5F7] font-bold text-base transition-all border border-[#2E263B]"
                >
                  <Presentation className="w-5 h-5 text-[#A881E6]" />
                  <span>{language === 'ml' ? 'ക്ലാസ്സ് റൂം കാണുക' : 'Explore Classroom'}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upload Modal for Creating New Lessons */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onLessonCreated={(lesson) => navigate(`/lesson/${lesson.id}`)}
      />

    </div>
  );
};

export default LandingPage;
