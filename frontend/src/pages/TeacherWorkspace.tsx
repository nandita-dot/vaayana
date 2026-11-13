import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getAllLessons } from '../services/storage';
import { checkAiStatus, fetchDbLessons } from '../services/api';
import { Lesson, AiStatusResponse } from '../types';
import { UploadModal } from '../components/UploadModal';
import { 
  Upload, 
  Sparkles, 
  BookOpen, 
  Filter, 
  Tv, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Info
} from 'lucide-react';

export const TeacherWorkspace: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 4');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiStatus, setAiStatus] = useState<AiStatusResponse>({
    aiAvailable: false,
    model: 'gemini-2.5-flash',
    provider: 'Google GenAI'
  });

  const loadLessons = async () => {
    try {
      const localList = await getAllLessons();
      const dbList = await fetchDbLessons();
      
      const lessonMap = new Map<string, Lesson>();
      dbList.forEach(l => lessonMap.set(l.id, l));
      localList.forEach(l => lessonMap.set(l.id, l));
      
      setLessons(Array.from(lessonMap.values()));
    } catch (e) {
      console.warn('Error loading lessons:', e);
      const list = await getAllLessons();
      setLessons(list);
    }
  };

  useEffect(() => {
    loadLessons();
    checkAiStatus().then(status => setAiStatus(status));
  }, []);

  const handleLessonCreated = () => {
    loadLessons();
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSubject = selectedSubject === 'all' || lesson.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || lesson.grade === selectedGrade || !lesson.grade;
    const matchesSearch = searchQuery === '' || 
      lesson.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.titleMl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-10 py-6 sm:py-8">
      
      {/* Workspace Header Banner */}
      <div className="bg-vaayana-darkSurface border border-vaayana-darkBorder text-vaayana-textLight rounded-3xl p-8 sm:p-10 shadow-darkCard flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vaayana-darkElevated text-vaayana-lime text-xs font-bold border border-vaayana-darkBorder">
              <BookOpen className="w-3.5 h-3.5 text-vaayana-lime" />
              <span>{language === 'ml' ? 'അധ്യാപക വേദി' : 'Teacher Studio'}</span>
            </div>

            {aiStatus.aiAvailable ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vaayana-darkElevated text-vaayana-lime text-xs font-bold border border-vaayana-lime/30">
                <span className="w-2 h-2 rounded-full bg-vaayana-lime animate-pulse"></span>
                <span>Gemini Active</span>
              </div>
            ) : (
              <div 
                title="To activate live Gemini generation, add GEMINI_API_KEY in backend/.env"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vaayana-darkElevated text-vaayana-textLightMuted text-xs font-bold border border-vaayana-darkBorder"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Deterministic / Template Mode</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-vaayana-textLight">
            {language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ് പാഠങ്ങൾ തയ്യാറാക്കാം' : 'Prepare Interactive Lessons'}
          </h1>
          <p className="text-vaayana-textLightMuted text-sm sm:text-base leading-relaxed">
            {language === 'ml'
              ? 'പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക, അല്ലെങ്കിൽ അധ്യാപന കുറിപ്പുകൾ നൽകി നിമിഷങ്ങൾക്കകം സംവേദനാത്മക പാഠങ്ങൾ നിർമ്മിക്കുക.'
              : 'Convert SCERT chapters into visual slide decks with dual-language narration and smartboard activities.'}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-vaayana-lime hover:bg-vaayana-limeHover text-vaayana-dark font-black text-sm sm:text-base shadow-limeGlow transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5 text-vaayana-dark" />
            <span>{t('uploadTextbook')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Selection Strip */}
      <div className="bg-vaayana-darkSurface p-6 rounded-3xl border border-vaayana-darkBorder shadow-darkCard space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-vaayana-textLight font-bold text-sm sm:text-base">
            <Filter className="w-4 h-4 text-vaayana-lime" />
            <span>{language === 'ml' ? 'പാഠങ്ങൾ തിരഞ്ഞെടുക്കുക' : 'Filter & Select Chapters'}</span>
          </div>
          <span className="text-xs text-vaayana-textLightMuted font-medium">
            {filteredLessons.length} {language === 'ml' ? 'പാഠങ്ങൾ' : 'lessons available'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-vaayana-textLightMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-vaayana-darkBorder bg-vaayana-darkElevated text-vaayana-textLight placeholder:text-vaayana-textLightMuted text-sm focus:outline-none focus:ring-2 focus:ring-vaayana-lime"
            />
          </div>

          {/* Grade Selector - Strictly Class 4 */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 rounded-2xl border border-vaayana-darkBorder bg-vaayana-darkElevated text-sm font-bold text-vaayana-textLight focus:outline-none focus:ring-2 focus:ring-vaayana-lime"
            >
              <option value="Class 4">Class 4 (നാലാം ക്ലാസ്സ്)</option>
              <option value="all">All Class 4 Modules</option>
            </select>
          </div>

          {/* Subject Selector - Exclusively Mathematics */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 rounded-2xl border border-vaayana-darkBorder bg-vaayana-darkElevated text-sm font-bold text-vaayana-textLight focus:outline-none focus:ring-2 focus:ring-vaayana-lime"
            >
              <option value="Mathematics">Mathematics (ഗണിതം)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-vaayana-textLight">
            {language === 'ml' ? 'ക്ലാസ്സ് 4 പാഠങ്ങൾ' : 'Class 4 Prepared Lessons'}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-black text-vaayana-lime hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'പുതിയ പാഠം ചേർക്കുക' : 'New Lesson'}</span>
          </button>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="bg-vaayana-darkSurface p-12 rounded-3xl border border-dashed border-vaayana-darkBorder text-center space-y-4">
            <BookOpen className="w-12 h-12 text-vaayana-textLightMuted mx-auto" />
            <p className="text-vaayana-textLightMuted font-medium">{t('noLessonsFound')}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-vaayana-lime text-vaayana-dark font-black text-sm shadow-limeGlow"
            >
              {t('createLesson')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => {
              const title = language === 'ml' ? lesson.titleMl : lesson.titleEn;
              const desc = language === 'ml' ? lesson.descriptionMl : lesson.descriptionEn;
              const isApproved = lesson.approvalStatus === 'approved';

              return (
                <motion.div
                  key={lesson.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-vaayana-soft rounded-3xl border border-vaayana-softBorder shadow-soft flex flex-col justify-between p-6 group"
                >
                  <div className="space-y-3">
                    {/* Header tags & Version */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-vaayana-dark text-vaayana-lime font-black">
                          {lesson.subject}
                        </span>
                        <span className="font-bold text-vaayana-textDarkMuted">
                          v{lesson.version || 1}
                        </span>
                      </div>

                      {/* Approval Status Badge */}
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Draft WIP</span>
                        </span>
                      )}
                    </div>

                    {/* Lesson Title & Chapter */}
                    <div>
                      <h3 className={`text-xl font-black text-vaayana-textDark group-hover:text-vaayana-dark transition-colors line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                        {title}
                      </h3>
                      <p className="text-xs font-bold text-vaayana-textDarkMuted mt-1">
                        {lesson.chapter}
                      </p>
                    </div>

                    <p className={`text-xs text-vaayana-textDark leading-relaxed line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {desc}
                    </p>

                    {/* Slide Count & Activities Badge */}
                    <div className="flex items-center gap-3 pt-2 text-xs font-bold text-vaayana-textDarkMuted border-t border-vaayana-softMuted">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-vaayana-dark" />
                        {lesson.slides?.length || 0} Slides
                      </span>
                      {lesson.concepts && (
                        <span>• {lesson.concepts.length} Concepts</span>
                      )}
                      {lesson.quiz && (
                        <span>• {lesson.quiz.length} Questions</span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-6 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-vaayana-dark hover:bg-[#1f2c23] text-vaayana-lime font-black text-xs sm:text-sm shadow-soft transition-all"
                    >
                      <Tv className="w-4 h-4 text-vaayana-lime" />
                      <span>{language === 'ml' ? 'ക്ലാസ്സിൽ കാണിക്കുക' : 'Present in Classroom'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload & AI Extraction Modal */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onLessonCreated={handleLessonCreated}
      />

    </div>
  );
};

export default TeacherWorkspace;
