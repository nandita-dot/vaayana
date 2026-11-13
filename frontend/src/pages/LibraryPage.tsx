import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  getAllLessons,
  deleteLesson,
  resetLessonsToDefault,
  exportLessonToJson,
  exportAllLessonsToJson,
  importLessonsFromJson
} from '../services/storage';
import { Lesson } from '../types';
import {
  Library,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Search,
  BookOpen,
  Tv,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchLessons = async () => {
    const list = await getAllLessons();
    setLessons(list);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLesson(id);
      setConfirmDeleteId(null);
      fetchLessons();
      showStatus(language === 'ml' ? 'പാഠം നീക്കം ചെയ്തു' : 'Lesson removed from library', 'success');
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm(language === 'ml' ? 'മാതൃകാ പാഠങ്ങളിലേക്ക് പുനഃസ്ഥാപിക്കണോ?' : 'Reset to default SCERT sample pack?')) {
      try {
        await resetLessonsToDefault();
        fetchLessons();
        showStatus(language === 'ml' ? 'മാതൃകാ പാഠങ്ങൾ പുനഃസ്ഥാപിച്ചു' : 'Restored SCERT sample lessons', 'success');
      } catch (err: any) {
        showStatus(err.message, 'error');
      }
    }
  };

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4500);
  };

  const handleExportAll = () => {
    try {
      const jsonStr = exportAllLessonsToJson(lessons);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dlAnchor = document.createElement('a');
      dlAnchor.href = url;
      dlAnchor.download = `vaayana-lessons-bundle-${new Date().toISOString().slice(0, 10)}.json`;
      dlAnchor.click();
      URL.revokeObjectURL(url);
      showStatus(language === 'ml' ? 'പാഠങ്ങൾ സേവ് ചെയ്തു' : 'Lessons exported successfully', 'success');
    } catch (err: any) {
      showStatus(`Export failed: ${err.message}`, 'error');
    }
  };

  const handleExportSingle = (lesson: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const jsonStr = exportLessonToJson(lesson);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dlAnchor = document.createElement('a');
      dlAnchor.href = url;
      const safeTitle = lesson.titleEn.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
      dlAnchor.download = `vaayana-${safeTitle}-${lesson.id}.json`;
      dlAnchor.click();
      URL.revokeObjectURL(url);
      showStatus(`Exported ${lesson.titleEn}`, 'success');
    } catch (err: any) {
      showStatus(`Export failed: ${err.message}`, 'error');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonContent = event.target?.result as string;
          const { importedCount, errors } = await importLessonsFromJson(jsonContent);
          await fetchLessons();
          if (errors.length > 0) {
            showStatus(`Imported ${importedCount} lessons (${errors.length} warnings)`, 'success');
          } else {
            showStatus(language === 'ml' ? `${importedCount} പാഠങ്ങൾ വിജയകരമായി ചേർത്തു!` : `Imported ${importedCount} lessons successfully!`, 'success');
          }
        } catch (err: any) {
          showStatus(err.message, 'error');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  };

  const filtered = lessons.filter(l =>
    searchQuery === '' ||
    l.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.titleMl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">

      {/* Toast Status Notice */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-sm font-semibold shadow-card animate-fadeIn ${statusMessage.type === 'success'
            ? 'bg-[#17151B] text-[#EDE5F7] border border-[#7950B8]/40'
            : 'bg-rose-950/60 text-rose-200 border border-rose-800'
          }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#7950B8]" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Library Top Banner */}
      <div className="bg-[#111114] p-6 sm:p-8 rounded-3xl border border-[#2E263B] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#7950B8]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#EDE5F7]">
              {language === 'ml' ? 'ലോക്കൽ പാഠശാല ലൈബ്രറി' : 'Local Lesson Library'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1D1A24] text-[#A881E6] border border-[#7950B8]/30">
              <CheckCircle2 className="w-3 h-3 text-[#7950B8]" /> Offline Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A59CB5] font-medium">
            {language === 'ml'
              ? 'നിങ്ങളുടെ ഉപകരണത്തിലെ SQLite & IndexedDB-ൽ സൂക്ഷിച്ച പാഠങ്ങൾ. ഇന്റർനെറ്റ് ഇല്ലാതെയും പ്രവർത്തിക്കും.'
              : 'Lessons stored locally in SQLite and browser IndexedDB. Fully accessible without internet.'}
          </p>
        </div>

        {/* Action Controls: Export All, Import, Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] text-xs sm:text-sm font-bold border border-[#2E263B] transition-all shadow-xs"
            title="Download JSON backup of all saved lessons"
          >
            <Download className="w-4 h-4 text-[#7950B8]" />
            <span>{language === 'ml' ? 'ബാക്കപ്പ് എടുക്കുക' : 'Export All'}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17151B] hover:bg-[#1D1A24] text-[#EDE5F7] text-xs sm:text-sm font-bold border border-[#2E263B] transition-all shadow-xs cursor-pointer">
            <Upload className="w-4 h-4 text-[#7950B8]" />
            <span>{language === 'ml' ? 'പാഠങ്ങൾ ചേർക്കുക' : 'Import JSON'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 text-xs font-semibold transition-all border border-transparent hover:border-rose-900/60"
            title="Reset to original SCERT sample pack"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Samples</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A59CB5]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#2E263B] bg-[#17151B] text-base text-[#EDE5F7] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7950B8] placeholder:text-[#A59CB5]"
        />
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#111114] p-12 rounded-3xl border border-dashed border-[#2E263B] text-center space-y-4">
            <BookOpen className="w-12 h-12 text-[#A59CB5] mx-auto" />
            <p className="text-[#A59CB5] font-medium">{t('noLessonsFound')}</p>
            <button
              onClick={handleResetDefaults}
              className="px-5 py-2.5 rounded-xl bg-[#7950B8] hover:bg-[#8C63D0] text-white font-black text-sm shadow-md"
            >
              Restore SCERT Sample Pack
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((lesson) => {
              const title = language === 'ml' ? lesson.titleMl : lesson.titleEn;
              const desc = language === 'ml' ? lesson.descriptionMl : lesson.descriptionEn;
              const isDeleting = confirmDeleteId === lesson.id;

              return (
                <motion.div
                  key={lesson.id}
                  whileHover={{ y: -4 }}
                  className="bg-[#17151B] rounded-3xl border border-[#2E263B] shadow-darkCard flex flex-col justify-between p-6 group hover:border-[#7950B8]/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
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
                        v{lesson.version || 1} • {lesson.slides?.length || 0} Slides
                      </span>
                    </div>

                    <h3 className={`text-xl font-black text-[#EDE5F7] line-clamp-2 ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {title}
                    </h3>

                    <p className={`text-xs text-[#E8DDC8] line-clamp-2 leading-relaxed ${language === 'ml' ? 'font-malayalam' : ''}`}>
                      {desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#2E263B] mt-4 space-y-3">
                    {/* Launch Button */}
                    <button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-xs sm:text-sm shadow-md shadow-purple-950/40 transition-all active:scale-95"
                    >
                      <Tv className="w-4 h-4 text-white" />
                      <span>{language === 'ml' ? 'ക്ലാസ്സിൽ അവതരിപ്പിക്കുക' : 'Launch Classroom'}</span>
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex items-center justify-between text-xs text-[#A59CB5] pt-1">
                      <button
                        onClick={(e) => handleExportSingle(lesson, e)}
                        className="flex items-center gap-1 hover:text-[#EDE5F7] font-bold transition-colors"
                        title="Download JSON file for this lesson"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export JSON</span>
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(lesson.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-neutral-400 hover:text-neutral-200 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(lesson.id)}
                          className="flex items-center gap-1 hover:text-rose-400 font-bold transition-colors"
                          title="Delete lesson from library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default LibraryPage;
