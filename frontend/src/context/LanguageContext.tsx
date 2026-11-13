import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ml: string }> = {
  // Brand & Slogan
  appName: { en: 'Vaayana', ml: 'വായന' },
  appTagline: { 
    en: 'Class 4 Smartboard Teaching Assistant for Kerala Schools', 
    ml: 'നാലാം ക്ലാസ്സ് സ്മാർട്ട്ബോർഡ് ഡിജിറ്റൽ അധ്യാപന സഹായി' 
  },
  
  // Navigation
  navHome: { en: 'Home', ml: 'പ്രധാന പേജ്' },
  navTeacher: { en: 'Teacher Studio', ml: 'അധ്യാപക വേദി' },
  navClassroom: { en: 'Smart Classroom', ml: 'സ്മാർട്ട് ക്ലാസ്സ്' },
  navLibrary: { en: 'Lesson Library', ml: 'പാഠശാല ലൈബ്രറി' },
  
  // Actions
  startTeaching: { en: 'Prepare Lessons', ml: 'പാഠങ്ങൾ തയ്യാറാക്കുക' },
  exploreClassroom: { en: 'Open Smartboard', ml: 'സ്മാർട്ട്ബോർഡ് തുറക്കുക' },
  uploadTextbook: { en: 'Upload Chapter (PDF)', ml: 'പാഠപുസ്തക അധ്യായം (PDF)' },
  createLesson: { en: 'Create Interactive Lesson', ml: 'പുതിയ ഇന്ററാക്ടീവ് പാഠം' },
  launchLesson: { en: 'Launch on Smartboard', ml: 'സ്മാർട്ട്ബോർഡിൽ പഠിപ്പിക്കാം' },
  saveLesson: { en: 'Save Lesson', ml: 'പാഠം സൂക്ഷിക്കുക' },
  approveLesson: { en: 'Approve for Classroom', ml: 'ക്ലാസ്സിനായി അംഗീകരിക്കുക' },
  saveDraft: { en: 'Save Draft', ml: 'കരട് സൂക്ഷിക്കുക' },
  previewLesson: { en: 'Preview Lesson', ml: 'പാഠം കാണുക' },
  deleteLesson: { en: 'Delete', ml: 'ഒഴിവാക്കുക' },
  preview: { en: 'Preview', ml: 'കാണുക' },
  back: { en: 'Back', ml: 'പിന്നോട്ട്' },
  next: { en: 'Next', ml: 'അടുത്തത്' },
  previous: { en: 'Previous', ml: 'മുൻപത്തേത്' },
  fullscreen: { en: 'Fullscreen Mode', ml: 'പൂർണ്ണ സ്ക്രീൻ' },
  exitFullscreen: { en: 'Exit Fullscreen', ml: 'പൂർണ്ണ സ്ക്രീൻ നിർത്തുക' },
  listenAudio: { en: 'Listen Narration', ml: 'വിവരണം കേൾക്കാം' },
  stopAudio: { en: 'Stop Audio', ml: 'ശബ്ദം നിർത്തുക' },
  takeQuiz: { en: 'Class Kahoot Quiz', ml: 'ക്ലാസ്സ് ക്വിസ് ഗെയിം' },
  tryAgain: { en: 'Try Again', ml: 'വീണ്ടും കളിക്കാം' },
  completed: { en: 'Lesson Completed!', ml: 'പാഠം വിജയകരമായി പൂർത്തിയായി!' },

  // Subjects for Class 4
  maths: { en: 'Mathematics', ml: 'ഗണിതം' },
  evs: { en: 'Environmental Studies', ml: 'പരിസരപഠനം' },
  english: { en: 'English', ml: 'ഇംഗ്ലീഷ്' },

  // Filters & Labels
  class4Only: { en: 'Class 4 (നാലാം ക്ലാസ്സ്)', ml: 'നാലാം ക്ലാസ്സ് (Class 4)' },
  selectSubject: { en: 'Select Subject', ml: 'വിഷയം തിരഞ്ഞെടുക്കുക' },
  selectChapter: { en: 'Select Chapter', ml: 'പാഠഭാഗം തിരഞ്ഞെടുക്കുക' },
  allSubjects: { en: 'All 3 Subjects', ml: 'എല്ലാ വിഷയങ്ങളും' },
  searchPlaceholder: { en: 'Search Class 4 chapters, keywords or concepts...', ml: 'നാലാം ക്ലാസ്സ് പാഠഭാഗങ്ങൾ തിരയുക...' },
  noLessonsFound: { en: 'No lessons found.', ml: 'പാഠങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല.' },
  savedLocally: { en: 'Stored Locally in SQLite & IndexedDB', ml: 'ബ്രൗസറിലും ഡാറ്റാബേസിലും സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു' },
  keralaCurriculumNotice: { 
    en: 'SCERT Kerala Class 4 Malayalam-Medium Curriculum', 
    ml: 'കേരള SCERT നാലാം ക്ലാസ്സ് മലയാളം മീഡിയം പാഠ്യപദ്ധതി' 
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vaayana_lang');
    return (saved === 'ml' || saved === 'en') ? saved : 'ml'; // Default to Malayalam
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vaayana_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].ml;
    }
    return key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
