import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  GraduationCap, 
  Presentation, 
  Library, 
  Languages, 
  Menu, 
  X,
  Maximize2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', labelEn: 'Home', labelMl: 'പ്രധാന പേജ്', icon: BookOpen },
    { path: '/teacher', labelEn: 'Teacher Studio', labelMl: 'അധ്യാപക വേദി', icon: GraduationCap },
    { path: '/classroom', labelEn: 'Smart Classroom', labelMl: 'സ്മാർട്ട് ക്ലാസ്സ്', icon: Presentation },
    { path: '/library', labelEn: 'Library', labelMl: 'ലൈബ്രറി', icon: Library },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090909]/95 backdrop-blur-md border-b border-[#2E263B] transition-colors shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#7950B8] rounded-2xl p-1"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-[#7950B8] flex items-center justify-center text-white shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform font-black">
              <BookOpen className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFD166] border-2 border-[#090909] shadow-[0_0_8px_#FFD166]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#EDE5F7] font-sans">
                  VAAYANA
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1D1A24] text-[#A881E6] font-malayalam border border-[#7950B8]/30">
                  വായന
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#17151B] text-[#EDE5F7] border border-[#2E263B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#72D6B0]" />
                  Class 4 • നാലാം ക്ലാസ്സ്
                </span>
              </div>
              <span className="text-xs text-[#A59CB5] hidden sm:inline font-medium">
                {language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് അധ്യാപന സഹായി' : 'Smartboard Teaching Assistant'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#111114] p-1.5 rounded-2xl border border-[#2E263B]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isCurrent(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    active
                      ? 'bg-[#7950B8] text-white shadow-md shadow-purple-900/40'
                      : 'text-[#A59CB5] hover:text-[#EDE5F7] hover:bg-[#1D1A24]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#7950B8]'}`} />
                  <span className={language === 'ml' ? 'font-malayalam' : ''}>
                    {language === 'ml' ? link.labelMl : link.labelEn}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher & Fullscreen Button */}
          <div className="flex items-center gap-2.5">
            {/* Fullscreen Quick Button */}
            <button
              onClick={toggleFullscreen}
              title={t('fullscreen')}
              className="hidden lg:flex items-center justify-center w-11 h-11 rounded-xl bg-[#17151B] border border-[#2E263B] text-[#EDE5F7] hover:bg-[#1D1A24] hover:border-[#7950B8]/50 transition-all shadow-xs active:scale-95"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-[#A881E6]" />
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#17151B] hover:bg-[#1D1A24] border border-[#2E263B] hover:border-[#7950B8]/50 text-[#EDE5F7] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
              title="Toggle Language / ഭാഷ മാറ്റുക"
            >
              <Languages className="w-4 h-4 text-[#7950B8]" />
              <span className="font-malayalam font-bold">{language === 'ml' ? 'EN' : 'മലയാളം'}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-[#17151B] border border-[#2E263B] text-[#EDE5F7]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#7950B8]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2E263B] bg-[#111114] px-4 pt-4 pb-6 space-y-2 animate-fadeIn shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isCurrent(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
                  active
                    ? 'bg-[#7950B8] text-white shadow-md'
                    : 'text-[#A59CB5] hover:text-[#EDE5F7] hover:bg-[#1D1A24]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#7950B8]'}`} />
                <span className={language === 'ml' ? 'font-malayalam' : ''}>
                  {language === 'ml' ? link.labelMl : link.labelEn}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
