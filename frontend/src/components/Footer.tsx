import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Sparkles, BookOpen, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-24 border-t border-vaayana-darkBorder bg-vaayana-darkSurface/90 py-12 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-3">
            {/* Logo, Brand & Book Icon */}
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-vaayana-lime flex items-center justify-center text-vaayana-dark shadow-limeGlow">
                <BookOpen className="w-4 h-4 text-vaayana-dark" />
              </div>
              <span className="font-black text-vaayana-textLight text-xl tracking-tight">VAAYANA</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-vaayana-lime text-vaayana-dark font-malayalam font-black">
                വായന
              </span>
              <span className="text-xs text-vaayana-textLightMuted font-mono bg-vaayana-darkElevated px-2 py-0.5 rounded-md border border-vaayana-darkBorder">
                Class 4 Beta
              </span>
            </div>

            {/* School Name & Location Information */}
            <div className="space-y-1">
              <div className="text-base sm:text-lg font-black text-vaayana-lime tracking-wide">
                ALP School Koottala
              </div>
              <div className="text-xs sm:text-sm text-vaayana-textLight leading-relaxed font-semibold flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-vaayana-lime shrink-0" />
                <span>Koottala, Erimayur, Alathur, Palakkad District, Kerala – 678681</span>
              </div>
            </div>

            <p className="text-xs text-vaayana-textLightMuted font-medium max-w-md">
              {language === 'ml' 
                ? 'കേരളത്തിലെ പൊതുവിദ്യാലയങ്ങൾക്കായുള്ള നാലാം ക്ലാസ്സ് സ്മാർട്ട്ബോർഡ് അധ്യാപന പ്ലാറ്റ്‌ഫോം' 
                : 'Smartboard interactive teaching assistant for Class 4 in Kerala schools'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-vaayana-textLightMuted">
            <div className="flex items-center gap-1.5 bg-vaayana-darkElevated px-3 py-1.5 rounded-full border border-vaayana-darkBorder">
              <ShieldCheck className="w-4 h-4 text-vaayana-lime" />
              <span>{language === 'ml' ? 'ലോക്കൽ SQLite • ഓഫ്‌ലൈൻ റെഡി' : 'Local SQLite • Offline Ready'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-vaayana-darkElevated px-3 py-1.5 rounded-full border border-vaayana-darkBorder">
              <Sparkles className="w-4 h-4 text-vaayana-lime" />
              <span>{language === 'ml' ? 'ഗണിത പാഠ്യപദ്ധതി' : 'Class 4 Mathematics'}</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-vaayana-darkBorder flex flex-col sm:flex-row items-center justify-between text-xs text-vaayana-textLightMuted gap-3">
          <p>© {new Date().getFullYear()} VAAYANA (വായന) — ALP School Koottala. Designed for Kerala Classroom Smartboards.</p>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-vaayana-lime fill-vaayana-lime" />
            <span>for ALP School Koottala Teachers & Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
