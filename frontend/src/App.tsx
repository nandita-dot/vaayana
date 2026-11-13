import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const isClassroom = location.pathname.startsWith('/lesson/') || location.pathname.startsWith('/classroom/');

  return (
    <>
      <MotionBackground classroomMode={isClassroom} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
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
    </>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-transparent text-[#EDE5F7] font-sans antialiased selection:bg-[#7950B8] selection:text-white">
          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedRoutes />
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
