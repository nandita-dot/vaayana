import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { TeacherWorkspace } from './pages/TeacherWorkspace';
import { ClassroomExperience } from './pages/ClassroomExperience';
import { LibraryPage } from './pages/LibraryPage';
import { LessonView } from './pages/LessonView';
import { MotionBackground } from './components/animations/MotionBackground';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10"
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher" element={<TeacherWorkspace />} />
          <Route path="/classroom" element={<ClassroomExperience />} />
          <Route path="/classroom/:id" element={<LessonView />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/lesson/:id" element={<LessonView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const Layout: React.FC = () => {
  const location = useLocation();
  const isLessonMode = location.pathname.startsWith('/lesson/') || (location.pathname.startsWith('/classroom/') && location.pathname !== '/classroom');
  const isLanding = location.pathname === '/';
  const isClassroom = location.pathname.startsWith('/lesson/') || location.pathname.startsWith('/classroom/');

  return (
    <div className="min-h-screen flex flex-col bg-[#09080F] text-[#EDE5F7] font-sans antialiased selection:bg-[#7950B8] selection:text-white relative">
      {/* Universal Fixed Background Layer (Pastel Doodles & Night Glows) */}
      <MotionBackground classroomMode={isClassroom} />

      {/* Hide global navbar during active classroom presentation to prevent double-header conflict */}
      {!isLessonMode && <Navbar />}
      
      <main className={`flex-1 w-full mx-auto relative z-10 ${
        isLessonMode 
          ? 'max-w-7xl px-2 sm:px-4 py-2 sm:py-3' 
          : isLanding 
          ? 'w-full' 
          : 'max-w-7xl px-4 sm:px-6 lg:px-8'
      }`}>
        <AnimatedRoutes />
      </main>

      {/* Hide global footer during active classroom presentation */}
      {!isLessonMode && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  // Use HashRouter when running under file:// protocol (Electron packaged build)
  // to prevent file:/// root clobbering, while preserving BrowserRouter for web/dev mode
  const RouterComponent = typeof window !== 'undefined' && window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <LanguageProvider>
      <RouterComponent>
        <Layout />
      </RouterComponent>
    </LanguageProvider>
  );
};

export default App;
