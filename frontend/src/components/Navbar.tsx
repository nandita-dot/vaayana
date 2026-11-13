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
    <header className="sticky top-0 z-40 bg-vaayana-dark/95 backdrop-blur-md border-b border-vaayana-darkBorder transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-vaayana-lime rounded-2xl p-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-vaayana-lime flex items-center justify-center text-vaayana-dark shadow-limeGlow group-hover:scale-105 transition-transform font-black">
              <BookOpen className="w-7 h-7 text-vaayana-dark" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-vaayana-textLight font-sans">
                  VAAYANA
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-vaayana-lime text-vaayana-dark font-malayalam shadow-sm">
                  വായന
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full bg-vaayana-darkSurface text-vaayana-soft border border-vaayana-darkBorder">
                  Class 4 • നാലാം ക്ലാസ്സ്
                </span>
              </div>
              <span className="text-xs text-vaayana-textLightMuted hidden sm:inline font-medium">
                {language === 'ml' ? 'സ്മാർട്ട്ബോർഡ് അധ്യാപന സഹായി' : 'Smartboard Teaching Assistant'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-vaayana-darkSurface p-1.5 rounded-2xl border border-vaayana-darkBorder shadow-darkCard">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isCurrent(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    active
                      ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                      : 'text-vaayana-textLightMuted hover:text-vaayana-textLight hover:bg-vaayana-darkElevated'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-vaayana-dark' : 'text-vaayana-textLightMuted'}`} />
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
              className="hidden lg:flex items-center justify-center w-11 h-11 rounded-xl bg-vaayana-darkSurface border border-vaayana-darkBorder text-vaayana-textLight hover:text-vaayana-lime hover:border-vaayana-lime/50 transition-all shadow-sm active:scale-95"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-vaayana-darkSurface hover:bg-vaayana-darkElevated border border-vaayana-darkBorder hover:border-vaayana-lime/40 text-vaayana-textLight font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              title="Toggle Language / ഭാഷ മാറ്റുക"
            >
              <Languages className="w-4 h-4 text-vaayana-lime" />
              <span className="font-malayalam">{language === 'ml' ? 'EN' : 'മലയാളം'}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-vaayana-darkSurface border border-vaayana-darkBorder text-vaayana-textLight"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-vaayana-lime" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-vaayana-darkBorder bg-vaayana-darkSurface px-4 pt-4 pb-6 space-y-2 animate-fadeIn">
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
                    ? 'bg-vaayana-lime text-vaayana-dark shadow-limeGlow'
                    : 'text-vaayana-textLightMuted hover:text-vaayana-textLight hover:bg-vaayana-darkElevated'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-vaayana-dark' : 'text-vaayana-lime'}`} />
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
