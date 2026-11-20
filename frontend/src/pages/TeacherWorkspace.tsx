import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getAllLessons, isUnwantedChapter } from '../services/storage';
import { checkAiStatus, fetchDbLessons } from '../services/api';
import { Lesson, AiStatusResponse } from '../types';
import { UploadModal } from '../components/UploadModal';
import { LibraryArtwork2D } from '../components/illustrations/LibraryArtwork2D';
import { CALM_EASE } from '../animations/motionPresets';
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
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
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
      dbList.forEach(l => {
        if (!isUnwantedChapter(l)) lessonMap.set(l.id, l);
      });
      localList.forEach(l => {
        if (!isUnwantedChapter(l)) lessonMap.set(l.id, l);
      });
      
      setLessons(Array.from(lessonMap.values()));
    } catch (e) {
      console.warn('Error loading lessons:', e);
      const list = await getAllLessons();
      setLessons(list.filter(l => !isUnwantedChapter(l)));
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
      <div className="bg-[#111114] border border-[#2E263B] text-[#EDE5F7] rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D1A24] text-[#A881E6] text-xs font-bold border border-[#7950B8]/30">
              <BookOpen className="w-3.5 h-3.5 text-[#7950B8]" />
              <span>{language === 'ml' ? 'അധ്യാപക വേദി' : 'Teacher Studio'}</span>
            </div>

            {aiStatus.aiAvailable ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D1A24] text-[#A881E6] text-xs font-bold border border-[#7950B8]/40">
                <span className="w-2 h-2 rounded-full bg-[#7950B8] animate-pulse"></span>
                <span>Gemini Active</span>
              </div>
            ) : (
              <div 
                title="To activate live Gemini generation, add GEMINI_API_KEY in backend/.env"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17151B] text-[#A59CB5] text-xs font-bold border border-[#2E263B]"
              >
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>Deterministic / Template Mode</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#EDE5F7]">
            {language === 'ml' ? 'സ്മാർട്ട് ക്ലാസ്സ് പാഠങ്ങൾ തയ്യാറാക്കാം' : 'Prepare Interactive Lessons'}
          </h1>
          <p className="text-[#A59CB5] text-sm sm:text-base leading-relaxed">
            {language === 'ml'
              ? 'പാഠപുസ്തകങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക, അല്ലെങ്കിൽ അധ്യാപന കുറിപ്പുകൾ നൽകി നിമിഷങ്ങൾക്കകം സംവേദനാത്മക പാഠങ്ങൾ നിർമ്മിക്കുക.'
              : 'Convert SCERT chapters into visual slide decks with dual-language narration and smartboard activities.'}
          </p>
        </div>

        {/* Right side: Educational 2D Vignette & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-24 h-24 hidden lg:flex items-center justify-center shrink-0">
            <LibraryArtwork2D className="w-full h-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-sm sm:text-base shadow-lg shadow-purple-950/50 transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="w-5 h-5 text-white" />
              <span>{t('uploadTextbook')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Selection Strip */}
      <div className="bg-[#111114] p-6 rounded-3xl border border-[#2E263B] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#EDE5F7] font-bold text-sm sm:text-base">
            <Filter className="w-4 h-4 text-[#7950B8]" />
            <span>{language === 'ml' ? 'പാഠങ്ങൾ തിരഞ്ഞെടുക്കുക' : 'Filter & Select Chapters'}</span>
          </div>
          <span className="text-xs text-[#A59CB5] font-medium">
            {filteredLessons.length} {language === 'ml' ? 'പാഠങ്ങൾ' : 'lessons available'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A59CB5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#2E263B] bg-[#17151B] text-[#EDE5F7] placeholder:text-[#A59CB5] text-sm focus:outline-none focus:ring-2 focus:ring-[#7950B8]"
            />
          </div>

          {/* Grade Selector - Strictly Class 4 */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#2E263B] bg-[#17151B] text-sm font-bold text-[#EDE5F7] focus:outline-none focus:ring-2 focus:ring-[#7950B8]"
            >
              <option value="Class 4">Class 4 (നാലാം ക്ലാസ്സ്)</option>
              <option value="all">All Class 4 Modules</option>
            </select>
          </div>

          {/* Subject Selector - Mathematics, EVS & English */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#2E263B] bg-[#17151B] text-sm font-bold text-[#EDE5F7] focus:outline-none focus:ring-2 focus:ring-[#7950B8]"
            >
              <option value="all">All Subjects (എല്ലാ വിഷയങ്ങളും)</option>
              <option value="Mathematics">Mathematics (ഗണിതം)</option>
              <option value="Environmental Studies">Environmental Studies (പരിസരപഠനം)</option>
              <option value="English">English (ഇംഗ്ലീഷ്)</option>
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
          <div className="bg-[#111114] p-12 rounded-3xl border border-dashed border-[#2E263B] text-center space-y-4">
            <div className="w-24 h-24 mx-auto flex items-center justify-center">
              <LibraryArtwork2D className="w-full h-full" />
            </div>
            <p className="text-[#A59CB5] font-medium">{t('noLessonsFound')}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-sm shadow-md transition-all active:scale-95"
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
                  className="bg-[#17151B] rounded-3xl border border-[#2E263B] shadow-darkCard hover:border-[#7950B8]/50 flex flex-col justify-between p-6 group transition-all"
                >
                  <div className="space-y-3">
                    {/* Header tags & Version */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full font-black text-[11px] border ${
                          lesson.subject.toLowerCase().includes('math')
                            ? 'bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/40'
                            : lesson.subject.toLowerCase().includes('env') || lesson.subject.toLowerCase().includes('evs')
                            ? 'bg-[#72D6B0]/15 text-[#72D6B0] border-[#72D6B0]/40'
                            : 'bg-[#1D1A24] text-[#A881E6] border-[#7950B8]/30'
                        }`}>
                          {lesson.subject}
                        </span>
                        <span className="font-bold text-[#A59CB5]">
                          v{lesson.version || 1}
                        </span>
                      </div>

                      {/* Approval Status Badge */}
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-600/50 font-extrabold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-600/50 font-extrabold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Draft WIP</span>
                        </span>
                      )}
                    </div>

                    {/* Lesson Title & Chapter */}
                    <div>
                      <h3 className={`text-xl font-black text-[#EDE5F7] group-hover:text-[#A881E6] transition-colors line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                        {title}
                      </h3>
                      <p className="text-xs font-bold text-[#A59CB5] mt-1">
                        {lesson.chapter}
                      </p>
                    </div>

                    <p className={`text-xs text-[#E8DDC8] leading-relaxed line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {desc}
                    </p>

                    {/* Slide Count & Activities Badge */}
                    <div className="flex items-center gap-3 pt-2 text-xs font-bold text-[#A59CB5] border-t border-[#2E263B]">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#65C7F7]" />
                        {lesson.slides?.length || 0} Slides
                      </span>
                      {lesson.concepts && (
                        <span className="text-[#FFD166]">• {lesson.concepts.length} Concepts</span>
                      )}
                      {lesson.quiz && (
                        <span className="text-[#F5A6C8]">• {lesson.quiz.length} Questions</span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-6 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-xs sm:text-sm shadow-md shadow-purple-950/40 transition-all active:scale-95"
                    >
                      <Tv className="w-4 h-4 text-white" />
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
