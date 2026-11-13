import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Sparkles, BookOpen, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-24 border-t border-[#2E263B] bg-[#0B0B0D]/95 py-12 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-3">
            {/* Logo, Brand & Book Icon */}
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#7950B8] flex items-center justify-center text-white shadow-sm shadow-purple-900/40">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-[#EDE5F7] text-xl tracking-tight">VAAYANA</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1D1A24] text-[#A881E6] font-malayalam font-black border border-[#7950B8]/30">
                വായന
              </span>
              <span className="text-xs text-[#A59CB5] font-mono bg-[#17151B] px-2 py-0.5 rounded-md border border-[#2E263B]">
                Class 4 Beta
              </span>
            </div>

            {/* School Name & Location Information */}
            <div className="space-y-1">
              <div className="text-base sm:text-lg font-black text-[#A881E6] tracking-wide">
                ALP School Koottala
              </div>
              <div className="text-xs sm:text-sm text-[#E8DDC8] leading-relaxed font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7950B8] shrink-0" />
                <span>Koottala, Erimayur, Alathur, Palakkad District, Kerala – 678681</span>
              </div>
            </div>

            <p className="text-xs text-[#A59CB5] font-medium max-w-md">
              {language === 'ml' 
                ? 'കേരളത്തിലെ പൊതുവിദ്യാലയങ്ങൾക്കായുള്ള നാലാം ക്ലാസ്സ് സ്മാർട്ട്ബോർഡ് അധ്യാപന പ്ലാറ്റ്‌ഫോം' 
                : 'Smartboard interactive teaching assistant for Class 4 in Kerala schools'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#EDE5F7]">
            <div className="flex items-center gap-1.5 bg-[#17151B] px-3.5 py-1.5 rounded-full border border-[#2E263B]">
              <ShieldCheck className="w-4 h-4 text-[#7950B8]" />
              <span>{language === 'ml' ? 'ലോക്കൽ SQLite • ഓഫ്‌ലൈൻ റെഡി' : 'Local SQLite • Offline Ready'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#17151B] px-3.5 py-1.5 rounded-full border border-[#2E263B]">
              <Sparkles className="w-4 h-4 text-[#7950B8]" />
              <span>{language === 'ml' ? 'ഗണിത & പരിസരപഠന പാഠ്യപദ്ധതി' : 'Class 4 Mathematics & EVS'}</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#2E263B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A59CB5] gap-3">
          <p>© {new Date().getFullYear()} VAAYANA (വായന) — ALP School Koottala. Designed for Kerala Classroom Smartboards.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
