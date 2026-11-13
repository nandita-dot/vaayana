import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Presentation, 
  GraduationCap, 
  Languages, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Tv,
  Brain,
  Sparkles,
  BookOpen,
  Compass,
  PieChart
} from 'lucide-react';
import { UploadModal } from '../components/UploadModal';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: Presentation,
      accentColor: 'text-[#65C7F7]',
      accentBg: 'bg-[#65C7F7]/10 border-[#65C7F7]/30',
      titleEn: 'Smartboard Interactive Pedagogy',
      titleMl: 'സ്മാർട്ട്ബോർഡ് സംവേദനാത്മക പഠനം',
      descEn: 'Engineered with massive touch targets, responsive manipulatives, and visual flip cards tailored for classroom smartboards.',
      descMl: 'സ്കൂളുകളിലെ സ്മാർട്ട്ബോർഡുകൾക്ക് അനുയോജ്യമായ വലിയ ടച്ച് കൺട്രോളുകളും ആകർഷകമായ ചിത്രീകരണങ്ങളും.'
    },
    {
      icon: Languages,
      accentColor: 'text-[#FFD166]',
      accentBg: 'bg-[#FFD166]/10 border-[#FFD166]/30',
      titleEn: 'Bilingual Malayalam & English',
      titleMl: 'പൂർണ്ണ മലയാളം & ഇംഗ്ലീഷ് പിന്തുണ',
      descEn: 'Dual-language audio narration and Malayalam typography crafted specifically for Kerala SCERT curriculum.',
      descMl: 'കേരളത്തിലെ അധ്യാപകർക്കും കുട്ടികൾക്കുമായി പ്രകൃതിദത്തമായ മലയാളം ലിപി രൂപകൽപ്പനയും ഓഡിയോ വിവരണവും.'
    },
    {
      icon: Brain,
      accentColor: 'text-[#F5A6C8]',
      accentBg: 'bg-[#F5A6C8]/10 border-[#F5A6C8]/30',
      titleEn: 'Hierarchical Textbook Understanding',
      titleMl: 'AI പാഠപുസ്തക വിശകലനം',
      descEn: 'PyMuPDF and Gemini analyze multi-page chapters, extracting grounded concepts, vocabulary, and interactive activities.',
      descMl: 'സാധാരണ പാഠപുസ്തക ഭാഗങ്ങളെ നിമിഷങ്ങൾക്കകം സംവേദനാത്മക ദൃശ്യപാഠങ്ങളാക്കി മാറ്റുന്നു.'
    },
    {
      icon: ShieldCheck,
      accentColor: 'text-[#72D6B0]',
      accentBg: 'bg-[#72D6B0]/10 border-[#72D6B0]/30',
      titleEn: 'Zero Cloud Database & 100% Private',
      titleMl: 'സമ്പൂർണ്ണ സ്വകാര്യത, ക്ലൗഡ് ഡാറ്റാബേസ് ഇല്ല',
      descEn: 'All lessons reside locally in SQLite and browser IndexedDB. No student tracking, no logins, works offline.',
      descMl: 'വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ ശേഖരിക്കാതെ, എല്ലാ പാഠങ്ങളും നിങ്ങളുടെ സ്വന്തം കമ്പ്യൂട്ടറിൽ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.'
    }
  ];

  return (
    <div className="space-y-24 py-8 sm:py-16">
      
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 space-y-8">
          
          {/* Top Badge Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#17151B] border border-[#2E263B] shadow-sm text-xs sm:text-sm font-semibold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166] animate-pulse" />
            <span className="font-malayalam text-[#EDE5F7] font-black">
              {language === 'ml' ? 'എ.എൽ.പി സ്കൂൾ കൂട്ടാല' : 'ALP School Koottala'}
            </span>
            <span className="text-[#3D2D56]">•</span>
            <span className="text-[#A881E6] font-bold">Koottala, Palakkad</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#EDE5F7] leading-[1.15]">
              {language === 'ml' ? (
                <>
                  പാഠപുസ്തകങ്ങൾ ഇനി <br />
                  <span className="text-[#A881E6] underline decoration-[#7950B8]/40 underline-offset-8 font-malayalam">
                    കണ്ണഞ്ചിപ്പിക്കുന്ന ദൃശ്യാനുഭവങ്ങൾ!
                  </span>
                </>
              ) : (
                <>
                  Transform Ordinary Textbooks <br />
                  <span className="text-[#A881E6] underline decoration-[#7950B8]/40 underline-offset-8">
                    into Interactive Wonder
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-3xl mx-auto text-lg sm:text-2xl text-[#A59CB5] leading-relaxed font-normal">
              {language === 'ml' 
                ? 'കേരളത്തിലെ സ്കൂൾ ക്ലാസ്സുകൾക്കായി രൂപകൽപ്പന ചെയ്ത ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് അസിസ്റ്റഡ് സ്മാർട്ട്ബോർഡ് ലേണിംഗ് പ്ലാറ്റ്‌ഫോം.'
                : 'Empowering Kerala government school teachers and students with touch-first, visual, and bilingual learning experiences on classroom smartboards.'}
            </p>
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/teacher"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-base sm:text-lg shadow-lg shadow-purple-950/50 hover:scale-105 transition-all group"
            >
              <GraduationCap className="w-6 h-6 text-white" />
              <span>{t('startTeaching')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
            </Link>

            <Link
              to="/classroom"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] border border-[#2E263B] hover:border-[#7950B8]/50 font-bold text-base sm:text-lg shadow-sm transition-all"
            >
              <Presentation className="w-6 h-6 text-[#7950B8]" />
              <span>{t('exploreClassroom')}</span>
            </Link>
          </motion.div>

          {/* Quick Curriculum Tag */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#EDE5F7] font-medium">
            <span className="flex items-center gap-1.5 bg-[#17151B] px-3 py-1.5 rounded-full border border-[#2E263B]">
              <CheckCircle2 className="w-4 h-4 text-[#72D6B0]" /> Class 4 Mathematics & EVS Curriculum
            </span>
            <span className="flex items-center gap-1.5 bg-[#17151B] px-3 py-1.5 rounded-full border border-[#2E263B]">
              <CheckCircle2 className="w-4 h-4 text-[#FFD166]" /> ALP School Koottala
            </span>
            <span className="flex items-center gap-1.5 bg-[#17151B] px-3 py-1.5 rounded-full border border-[#2E263B]">
              <CheckCircle2 className="w-4 h-4 text-[#65C7F7]" /> Touch Smartboard Ready
            </span>
          </div>

        </div>
      </section>

      {/* Visual Product Showcase Card (Elevated Dark Surface) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#111114] rounded-4xl p-6 sm:p-10 border border-[#2E263B] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle decorative watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Compass className="w-64 h-64 text-[#7950B8]" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#2E263B] relative z-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#EDE5F7] bg-[#1D1A24] px-3 py-1 rounded-full border border-[#7950B8]/40">
                {language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് മാതൃക' : 'Smartboard Live Preview'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#EDE5F7] mt-2 font-malayalam">
                {language === 'ml' ? 'വരകളും രൂപങ്ങളും: കോണുകളും വൃത്തങ്ങളും' : 'Lines and Shapes: Corners & Curves'}
              </h3>
              <p className="text-sm font-semibold text-[#A59CB5] mt-1">
                Class 4 Mathematics • SCERT Kerala Unit 1
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/lesson/scert-std4-maths-ch1-lines-and-shapes')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-sm shadow-md transition-all hover:scale-105"
              >
                <Tv className="w-4 h-4 text-white" />
                <span>{language === 'ml' ? 'ഈ പാഠം തുറക്കുക' : 'Launch Demo Lesson'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Slide Teaser Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 relative z-10">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#65C7F7]/40 shadow-sm space-y-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#65C7F7]/15 text-[#65C7F7] flex items-center justify-center font-black border border-[#65C7F7]/30">
                1
              </div>
              <h4 className="font-extrabold text-[#EDE5F7] text-lg">
                {language === 'ml' ? 'നിരീക്ഷണ ദൃശ്യങ്ങൾ' : 'Visual Observations'}
              </h4>
              <p className="text-sm text-[#A59CB5] leading-relaxed">
                {language === 'ml' 
                  ? 'കേരളത്തിലെ സാധാരണ പക്ഷികളെയും അവയുടെ വാസസ്ഥലങ്ങളെയും വ്യക്തമാക്കുന്ന വർണ്ണചിത്രങ്ങൾ.'
                  : 'Vivid illustrations and concept cards representing native Kerala birds and habitats.'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#FFD166]/40 shadow-sm space-y-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FFD166]/15 text-[#FFD166] flex items-center justify-center font-black border border-[#FFD166]/30">
                2
              </div>
              <h4 className="font-extrabold text-[#EDE5F7] text-lg">
                {language === 'ml' ? 'ദ്വിഭാഷാ വിവരണം' : 'Dual Language Audio'}
              </h4>
              <p className="text-sm text-[#A59CB5] leading-relaxed">
                {language === 'ml'
                  ? 'മലയാളത്തിലും ഇംഗ്ലീഷിലുമുള്ള വ്യക്തമായ ശബ്ദ വിവരണം ക്ലാസ്സിലെ എല്ലാ കുട്ടികൾക്കും മനസ്സിലാകുന്നു.'
                  : 'Clear spoken narration in English and Malayalam ensures accessibility for all children.'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-[#17151B] border border-[#2E263B] hover:border-[#72D6B0]/40 shadow-sm space-y-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#72D6B0]/15 text-[#72D6B0] flex items-center justify-center font-black border border-[#72D6B0]/30">
                3
              </div>
              <h4 className="font-extrabold text-[#EDE5F7] text-lg">
                {language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് ക്വിസ്' : 'Smartboard Quizzes'}
              </h4>
              <p className="text-sm text-[#A59CB5] leading-relaxed">
                {language === 'ml'
                  ? 'കുട്ടികൾക്ക് സ്മാർട്ട്ബോർഡിൽ നേരിട്ടെത്തി ഉത്തരം തൊടാവുന്ന രസകരമായ ചോദ്യോത്തരങ്ങൾ.'
                  : 'Interactive multiple choice touch quizzes with instant celebratory confetti.'}
              </p>
            </motion.div>
          </div>

        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#A881E6] bg-[#1D1A24] px-3 py-1 rounded-full border border-[#2E263B]">
            {language === 'ml' ? 'പ്രത്യേകതകൾ' : 'Core Innovations'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#EDE5F7]">
            {language === 'ml' ? 'എന്തുകൊണ്ട് വായന (VAAYANA)?' : 'Why Vaayana in the Classroom?'}
          </h2>
          <p className="text-[#A59CB5] text-sm sm:text-base">
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
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-[#111114] p-8 rounded-3xl border border-[#2E263B] shadow-darkCard hover:border-[#7950B8]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl ${feat.accentBg} ${feat.accentColor} flex items-center justify-center shadow-xs border`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className={`text-xl font-bold text-[#EDE5F7] ${language === 'ml' ? 'font-malayalam' : ''}`}>
                    {language === 'ml' ? feat.titleMl : feat.titleEn}
                  </h3>
                  <p className={`text-[#A59CB5] text-sm sm:text-base leading-relaxed ${language === 'ml' ? 'font-malayalam' : ''}`}>
                    {language === 'ml' ? feat.descMl : feat.descEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Ready to Begin Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#17151B] via-[#1D1A24] to-[#17151B] border border-[#2E263B] rounded-4xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black text-[#EDE5F7] tracking-tight">
              {language === 'ml' 
                ? 'നിങ്ങളുടെ ക്ലാസ്സ് റൂം സ്മാർട്ട് ആക്കാൻ തയ്യാറാണോ?' 
                : 'Ready to bring wonder into your classroom?'}
            </h3>
            <p className="text-[#A59CB5] text-base sm:text-lg">
              {language === 'ml'
                ? 'പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്ത് നിങ്ങളുടെ സ്വന്തം ഇന്ററാക്ടീവ് പാഠങ്ങൾ നിർമ്മിക്കാൻ ആരംഭിക്കുക.'
                : 'Prepare interactive visual slides from your textbooks in minutes or launch pre-curated SCERT lessons.'}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-base shadow-lg shadow-purple-950/50 transition-all hover:scale-105"
              >
                {t('createLesson')}
              </button>
              <Link
                to="/library"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] font-bold text-base transition-all border border-[#2E263B]"
              >
                {t('navLibrary')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onLessonCreated={(lesson) => navigate(`/lesson/${lesson.id}`)}
      />

    </div>
  );
};

export default LandingPage;
