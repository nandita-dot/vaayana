import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  extractPdf, 
  extractImage, 
  generateLessonFromBackend, 
  generateTemplateLesson,
  regenerateSection,
  checkAiStatus,
  checkCachedLesson,
  approveLessonOnBackend,
  previewChapterPages
} from '../services/api';
import { saveLesson } from '../services/storage';
import { 
  Subject, 
  Grade, 
  Lesson, 
  ConceptItem, 
  VocabularyItem, 
  QuizQuestion,
  AiStatusResponse,
  DocumentAudit,
  DetectedChapter,
  DiagnosticLog
} from '../types';
import { 
  X, 
  Upload, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  BookOpen,
  ArrowRight,
  Info,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Eye,
  BookMarked,
  Check
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonCreated?: (lesson: Lesson) => void;
  defaultSubject?: Subject;
  defaultGrade?: Grade;
}

const KERALA_PRESETS: Array<{ grade: Grade; subject: Subject; chapter: string }> = [
  { grade: 'Class 4', subject: 'Mathematics', chapter: 'വരകളും രൂപങ്ങളും: ദ്വിമാന - ത്രിമാന രൂപങ്ങൾ (Lines and Shapes: 2D & 3D Geometry)' },
  { grade: 'Class 4', subject: 'Mathematics', chapter: 'ബന്ധം കണ്ടെത്താം: സംഖ്യാ പാറ്റേണുകളും അബാക്കസും (Find the Relation: Patterns, Toto 9999 & Abacus)' },
  { grade: 'Class 4', subject: 'Mathematics', chapter: 'എത്രയെത്ര സംഖ്യകൾ?: റോമൻ സംഖ്യകളും സമയവും (How Many Numbers? Wheel, Roman Numerals & Clocks)' },
  { grade: 'Class 4', subject: 'Mathematics', chapter: 'സംഖ്യകൾ വളരുന്നു: 1000 ആകുന്ന ജോടികളും സങ്കലന രീതികളും (Increasing Numbers: Pairs to 1000 & Ways to Add)' },
  { grade: 'Class 4', subject: 'Mathematics', chapter: "സമയം എത്രയായി?: ക്ലോക്കുകളും കലണ്ടർ ഗണിതവും (It's Time! Clocks, Elapsed Time & Calendar)" },
  { grade: 'Class 4', subject: 'Mathematics', chapter: 'സംഖ്യകൾ കുറയുന്നു: അബാക്കസ് കുറയ്ക്കലും ഇന്ത്യൻ കറൻസിയും (Decreasing Numbers: Abacus Subtraction, Borrowing & Currency)' },
  { grade: 'Class 4', subject: 'Environmental Studies', chapter: 'നമുക്ക് ചുറ്റും പല രൂപങ്ങളിൽ (Around Us in Different Forms)' },
  { grade: 'Class 4', subject: 'Environmental Studies', chapter: 'ആകാശവിസ്മയങ്ങൾ (Marvels of the Sky)' },
  { grade: 'Class 4', subject: 'Environmental Studies', chapter: 'ദിശകൾ അറിയാം, നാടറിയാം: വഴിയറിയാം നാടറിയാം (Know the Directions and Know Our Homeland)' },
  { grade: 'Class 4', subject: 'English', chapter: 'The Seed of Truth: Pingala and the Roasted Seed (Unit 1)' },
  { grade: 'Class 4', subject: 'English', chapter: 'The Wooden Cup: Love, Kindness & Elders (Unit 2)' },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onLessonCreated,
  defaultSubject = 'Mathematics',
  defaultGrade = 'Class 4',
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Mode: 'input' -> 'generating' -> 'review'
  const [modalMode, setModalMode] = useState<'input' | 'generating' | 'review'>('input');
  const [reviewTab, setReviewTab] = useState<'overview' | 'concepts' | 'vocabulary' | 'activities' | 'quiz'>('overview');

  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'text' | 'preset'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedSnippet, setExtractedSnippet] = useState<string>('');
  const [fileHash, setFileHash] = useState<string>('');
  const [cachedExistingLesson, setCachedExistingLesson] = useState<Lesson | null>(null);
  const [subject, setSubject] = useState<Subject>(defaultSubject);
  const [grade, setGrade] = useState<Grade>('Class 4');
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  
  // AI Status
  const [aiStatus, setAiStatus] = useState<AiStatusResponse>({
    aiAvailable: false,
    model: 'gemini-2.5-flash',
    provider: 'Google GenAI'
  });

  // Loading & Step indicators
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  // Lesson being reviewed / edited
  const [reviewLesson, setReviewLesson] = useState<Lesson | null>(null);
  const [generationWarnings, setGenerationWarnings] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-page Document Audit & Chapter Selection State
  const [documentAudit, setDocumentAudit] = useState<DocumentAudit | null>(null);
  const [detectedChapters, setDetectedChapters] = useState<DetectedChapter[]>([]);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number | 'custom'>(0);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [chapterPreviewText, setChapterPreviewText] = useState<string>('');
  const [chapterPreviewWords, setChapterPreviewWords] = useState<number>(0);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState<boolean>(false);
  const [forceRegenerate, setForceRegenerate] = useState<boolean>(false);
  const [diagnosticLog, setDiagnosticLog] = useState<DiagnosticLog | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkAiStatus().then(status => {
        setAiStatus(status);
      });
      // Lock background scrolling and navigation interference while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const isSourceBrief = wordCount > 0 && wordCount < 25;
  const isSelectedRangeBrief = chapterPreviewWords > 0 && chapterPreviewWords < 20;

  const updatePreviewAndCache = async (sp: number, ep: number, chTitle: string, currentText: string, hash: string) => {
    if (currentText) {
      const prev = await previewChapterPages({
        rawText: currentText,
        startPage: sp,
        endPage: ep
      });
      setChapterPreviewText(prev.text);
      setChapterPreviewWords(prev.wordCount);
    }
    if (hash) {
      const cacheCheck = await checkCachedLesson(hash, sp, ep, chTitle);
      if (cacheCheck.found && cacheCheck.lesson) {
        setCachedExistingLesson(cacheCheck.lesson);
      } else {
        setCachedExistingLesson(null);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsLoading(true);
      setCachedExistingLesson(null);
      setDocumentAudit(null);
      setDetectedChapters([]);
      const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(file.name);
      
      setCurrentStep(
        isImg
          ? (language === 'ml' ? 'ചിത്രം പരിശോധിക്കുന്നു...' : 'Analyzing textbook photo scan...')
          : (language === 'ml' ? 'പി.ഡി.എഫ് പരിശോധിക്കുന്നു...' : 'Extracting textbook pages (PyMuPDF / OCR)...')
      );

      const result = isImg ? await extractImage(file) : await extractPdf(file);
      setIsLoading(false);
      if (result.success) {
        setExtractedSnippet(result.previewSnippet);
        setRawText(result.extractedText);
        setDocumentAudit(result.documentAudit || null);
        
        const chapters = result.detectedChapters || (result.documentAudit ? result.documentAudit.detectedChapters : []) || [];
        setDetectedChapters(chapters);

        const totalP = result.documentAudit ? result.documentAudit.totalPages : result.pageCount || 1;
        let initialStart = 1;
        let initialEnd = totalP;
        let initialTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        if (chapters.length > 0) {
          setSelectedChapterIdx(0);
          initialStart = chapters[0].startPage;
          initialEnd = chapters[0].endPage;
          if (chapters[0].title) {
            initialTitle = chapters[0].title;
          }
        } else {
          setSelectedChapterIdx('custom');
          initialStart = 1;
          initialEnd = totalP;
        }

        setStartPage(initialStart);
        setEndPage(initialEnd);
        setChapterTitle(initialTitle);

        if (result.sourceFileHash) {
          setFileHash(result.sourceFileHash);
        }

        await updatePreviewAndCache(
          initialStart, 
          initialEnd, 
          initialTitle, 
          result.extractedText, 
          result.sourceFileHash || ''
        );
      }
    }
  };

  const handleChapterSelect = async (val: string) => {
    if (val === 'custom') {
      setSelectedChapterIdx('custom');
    } else {
      const idx = parseInt(val, 10);
      setSelectedChapterIdx(idx);
      const ch = detectedChapters[idx];
      if (ch) {
        setStartPage(ch.startPage);
        setEndPage(ch.endPage);
        const newTitle = ch.title || chapterTitle;
        setChapterTitle(newTitle);
        await updatePreviewAndCache(ch.startPage, ch.endPage, newTitle, rawText, fileHash);
      }
    }
  };

  const handlePageRangeChange = async (newStart: number, newEnd: number) => {
    const sp = Math.max(1, newStart);
    const ep = Math.max(sp, newEnd);
    setStartPage(sp);
    setEndPage(ep);
    await updatePreviewAndCache(sp, ep, chapterTitle, rawText, fileHash);
  };

  const handleSelectPreset = (preset: typeof KERALA_PRESETS[0]) => {
    setGrade('Class 4');
    setSubject(preset.subject);
    setChapterTitle(preset.chapter);
    setDocumentAudit(null);
    setDetectedChapters([]);
    setSelectedChapterIdx('custom');
    setStartPage(1);
    setEndPage(1);
    const pText = `SCERT Kerala Class 4 Syllabus: ${preset.chapter}. Focus on visual understanding, interactive smartboard inquiry, and bilingual explanations.`;
    setRawText(pText);
    setChapterPreviewText(pText);
    setChapterPreviewWords(pText.split(/\s+/).length);
    setCachedExistingLesson(null);
  };

  const handleGenerate = async (forceTemplate: boolean = false) => {
    if (!chapterTitle.trim()) {
      alert(language === 'ml' ? 'ദയവായി പാഠത്തിന്റെ പേര് നൽകുക.' : 'Please provide a chapter title.');
      return;
    }

    setErrorMessage(null);
    setModalMode('generating');
    setCurrentStep(
      language === 'ml'
        ? (aiStatus.aiAvailable && !forceTemplate ? 'Gemini 2.5 Flash തിരഞ്ഞെടുത്ത പേജുകൾ പരിശോധിക്കുന്നു...' : 'SCERT ക്ലാസ്സ് 4 മാതൃക തയ്യാറാക്കുന്നു...')
        : (aiStatus.aiAvailable && !forceTemplate ? `Gemini 2.5 Flash analyzing pages ${startPage}–${endPage} & grounding concepts...` : 'Scaffolding SCERT Class 4 curriculum lesson...')
    );

    try {
      if (aiStatus.aiAvailable && !forceTemplate) {
        const response = await generateLessonFromBackend({
          rawText: rawText || chapterTitle,
          subject,
          grade: 'Class 4',
          chapterTitle,
          sourceFileHash: fileHash,
          sourceFileName: selectedFile?.name,
          startPage,
          endPage,
          selectedChapterTitle: chapterTitle,
          forceRegenerate
        });

        if (response.success && response.lesson) {
          setReviewLesson(response.lesson);
          setGenerationWarnings(response.warnings || []);
          if (response.diagnosticLog) {
            setDiagnosticLog(response.diagnosticLog);
          }
          setModalMode('review');
        } else {
          setErrorMessage(response.error || 'Gemini generation failed. You can create an SCERT template scaffold instead.');
          setModalMode('input');
        }
      } else {
        // Teacher chose or needed template scaffold
        const templateLesson = await generateTemplateLesson({
          rawText: rawText || chapterTitle,
          subject,
          grade: 'Class 4',
          chapterTitle,
          startPage,
          endPage,
          selectedChapterTitle: chapterTitle
        });
        setReviewLesson(templateLesson);
        setGenerationWarnings(templateLesson.sourceWarnings || []);
        setModalMode('review');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while generating lesson.');
      setModalMode('input');
    }
  };

  // Section Regeneration handler
  const handleRegenerate = async (section: 'concepts' | 'vocabulary' | 'activities' | 'quiz') => {
    if (!reviewLesson) return;
    setRegeneratingSection(section);

    try {
      const res = await regenerateSection({
        section,
        rawText: rawText || reviewLesson.chapter,
        subject: reviewLesson.subject,
        grade: 'Class 4',
        chapterTitle: reviewLesson.chapter
      });

      if (res.success && res.data) {
        if (section === 'concepts') {
          setReviewLesson({ ...reviewLesson, concepts: res.data });
        } else if (section === 'vocabulary') {
          setReviewLesson({ ...reviewLesson, vocabulary: res.data });
        } else if (section === 'activities') {
          setReviewLesson({ ...reviewLesson, activities: res.data });
        } else if (section === 'quiz') {
          setReviewLesson({ ...reviewLesson, quiz: res.data });
        }
      } else {
        alert(res.error || 'Could not regenerate section. (Gemini may be unavailable or offline)');
      }
    } catch (e: any) {
      alert(`Regeneration failed: ${e.message}`);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Final Save & Launch with approval status
  const handleSaveLesson = async (launch: boolean = false, asApproved: boolean = true) => {
    if (!reviewLesson) return;

    try {
      setIsLoading(true);
      const updatedLesson: Lesson = {
        ...reviewLesson,
        grade: 'Class 4',
        approvalStatus: asApproved ? 'approved' : 'draft',
        updatedAt: new Date().toISOString()
      };

      // 1. Persist to authoritative SQLite backend
      const backendRes = await approveLessonOnBackend(updatedLesson, asApproved ? 'approved' : 'draft');
      if (!backendRes.success) {
        console.warn('Backend SQLite save notice:', backendRes.message);
      }

      // 2. Persist to IndexedDB
      await saveLesson(updatedLesson);

      setIsLoading(false);
      if (onLessonCreated) {
        onLessonCreated(updatedLesson);
      }
      onClose();

      // Navigation: Direct teacher to lesson player or teacher workspace, never dump on homepage
      if (launch) {
        navigate(`/lesson/${updatedLesson.id}`);
      } else if (window.location.pathname === '/' || window.location.pathname === '') {
        navigate('/teacher');
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error('Failed to save lesson:', err);
      setErrorMessage(`Failed to save lesson: ${err.message || 'Storage error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#130F1C] w-full max-w-4xl rounded-4xl border border-[#2E263B] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header (Cohesive Dark Surface with Purple Accent) */}
        <div className="px-6 py-4.5 border-b border-[#2E263B] flex items-center justify-between bg-[#0F0C18] text-[#EDE5F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#563580] text-white flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#EDE5F7]">
                  {modalMode === 'review'
                    ? (language === 'ml' ? 'പാഠം അവലോകനം ചെയ്യുക' : 'Review & Customize Lesson')
                    : (language === 'ml' ? 'ഇന്ററാക്ടീവ് പാഠം നിർമ്മിക്കുക' : 'Create Interactive Lesson')}
                </h3>
                {aiStatus.aiAvailable ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#1D1A24] text-[#A881E6] border border-[#7950B8]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72D6B0] animate-pulse"></span>
                    Gemini Active
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1D1A24] text-[#A59CB5] border border-[#2E263B]">
                    Deterministic Template
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A59CB5] font-medium">
                {modalMode === 'review'
                  ? (language === 'ml' ? 'ക്ലാസ്സ് മുറിയിൽ പഠിപ്പിക്കുന്നതിന് മുൻപ് വിവരങ്ങൾ മാറ്റിയെഴുതാം' : 'Verify, edit concepts, vocabulary, and quiz before classroom launch')
                  : (language === 'ml' ? 'പാഠപുസ്തകത്തിൽ നിന്ന് സ്മാർട്ട്ബോർഡ് പാഠങ്ങളിലേക്ക്' : 'Transform Kerala SCERT textbook pages into visual lessons')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A59CB5] hover:text-[#EDE5F7] hover:bg-[#1D1A24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#130F1C] text-[#EDE5F7]">

          {/* MODE 1: GENERATING STATE */}
          {modalMode === 'generating' && (
            <div className="text-center py-16 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-kerala-blue mx-auto flex items-center justify-center shadow-soft">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-navy-900">
                  {language === 'ml' ? 'പാഠം രൂപകൽപ്പന ചെയ്യുന്നു...' : 'Structuring Interactive Lesson...'}
                </h4>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  {currentStep}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl max-w-md mx-auto text-xs text-slate-500 border border-slate-200/80">
                <p className="font-semibold text-navy-800 mb-1">DRISHTI Pedagogical Pipeline:</p>
                <p>Aligning with Kerala SCERT curriculum • Formulating bilingual Malayalam/English concepts • Matching interactive smartboard manipulatives</p>
              </div>
            </div>
          )}

          {/* MODE 2: INPUT STATE */}
          {modalMode === 'input' && (
            <>
              {/* Error Banner if any */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-bold block mb-0.5">Generation Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* AI Status Banner */}
              {!aiStatus.aiAvailable ? (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold block">Gemini API Key Not Configured</span>
                    <span>
                      Live Gemini AI generation is unavailable. You can generate a <strong>Curriculum Template Scaffold</strong> directly or explore pre-curated Kerala sample lessons. To enable Gemini AI, configure <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code> in <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">backend/.env</code>.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs flex items-start gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold block">Gemini 2.5 Flash Connected</span>
                    <span>
                      Textbook excerpt will be analyzed with strict SCERT curriculum alignment, Malayalam terminology, and automated smartboard activity linking.
                    </span>
                  </div>
                </div>
              )}

              {/* Input Method Tabs */}
              <div className="flex p-1 bg-surface-subtle rounded-2xl text-xs sm:text-sm font-semibold">
                <button
                  onClick={() => setActiveInputTab('upload')}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeInputTab === 'upload' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{language === 'ml' ? 'പി.ഡി.എഫ് / ചിത്രം അപ്‌ലോഡ്' : 'Upload PDF / Photo'}</span>
                </button>

                <button
                  onClick={() => setActiveInputTab('preset')}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeInputTab === 'preset' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{language === 'ml' ? 'SCERT പാഠങ്ങൾ' : 'SCERT Presets'}</span>
                </button>

                <button
                  onClick={() => setActiveInputTab('text')}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeInputTab === 'text' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'ml' ? 'ടെക്സ്റ്റ് നൽകുക' : 'Custom Excerpt'}</span>
                </button>
              </div>

              {/* Tab 1: Upload */}
              {activeInputTab === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 hover:border-kerala-blue/60 transition-colors rounded-3xl p-6 text-center bg-slate-50/50">
                    <input
                      type="file"
                      id="pdf-upload"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-kerala-blue flex items-center justify-center mb-3">
                        <Upload className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-navy-900 text-sm">
                        {selectedFile ? selectedFile.name : (language === 'ml' ? 'പാഠപുസ്തക PDF അല്ലെങ്കിൽ ഫോട്ടോ തിരഞ്ഞെടുക്കുക' : 'Click to select textbook PDF or photo scan')}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        {language === 'ml' ? 'മലയാളം അല്ലെങ്കിൽ ഇംഗ്ലീഷ് SCERT പാഠപുസ്തകങ്ങൾ' : 'Extracts text with PyMuPDF digital engine & Malayalam OCR'}
                      </span>
                    </label>

                    {extractedSnippet && !documentAudit && (
                      <div className="mt-4 p-3 bg-white rounded-xl text-left border border-slate-200 text-xs text-slate-600 max-h-24 overflow-y-auto">
                        <div className="flex items-center justify-between font-bold text-navy-900 mb-1">
                          <span>Extracted Content Preview:</span>
                          <span className="text-[11px] font-normal text-slate-400">{wordCount} words</span>
                        </div>
                        {extractedSnippet}
                      </div>
                    )}
                  </div>

                  {/* Document Audit Summary Card */}
                  {documentAudit && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-kerala-blue" />
                          <span className="text-xs font-bold text-navy-900">
                            {language === 'ml' ? 'പാഠപുസ്തക പരിശോധന (Document Audit)' : 'Textbook Document Audit'}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {documentAudit.totalPages} {documentAudit.totalPages === 1 ? 'Page' : 'Total Pages'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                          <span className="text-slate-400 text-[10px] block font-medium">Textbook Size</span>
                          <span className="font-bold text-navy-900">{documentAudit.totalPages} Total Pages</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                          <span className="text-slate-400 text-[10px] block font-medium">Digital Text</span>
                          <span className="font-bold text-emerald-700">
                            {documentAudit.pagesWithDigitalText ?? documentAudit.pagesWithText} Pages
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                          <span className="text-slate-400 text-[10px] block font-medium">Image / Diagrams</span>
                          <span className="font-bold text-indigo-700">
                            {documentAudit.pagesImageOnly ?? 0} Pages
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                          <span className="text-slate-400 text-[10px] block font-medium">Language</span>
                          <span className="font-bold text-amber-700">
                            {documentAudit.malayalamDetected ? 'മലയാളം (Malayalam)' : 'English'}
                          </span>
                        </div>
                      </div>

                      {(documentAudit.pagesImageOnly || 0) > 0 && (
                        <div className="text-[11px] text-indigo-900 bg-indigo-50/80 p-2.5 rounded-xl flex items-start gap-2 border border-indigo-200">
                          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">
                              {documentAudit.pagesImageOnly} page(s) contain embedded diagrams / illustrations (Pages {documentAudit.imageOnlyPageNumbers?.join(', ')}):
                            </span>
                            <span className="text-indigo-800">
                              These visual pages are fully indexed and accounted for. Text concepts will cite surrounding chapter sections while preserving page references.
                            </span>
                          </div>
                        </div>
                      )}

                      {(documentAudit.pagesUnprocessable || 0) > 0 && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg flex items-center gap-1.5 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {documentAudit.pagesUnprocessable} page(s) are blank or unprocessable (Pages {documentAudit.unprocessedPageNumbers?.join(', ')}).
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chapter & Page Range Selector */}
                  {documentAudit && documentAudit.totalPages > 1 && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                          <BookMarked className="w-4 h-4 text-kerala-blue" />
                          <span>{language === 'ml' ? 'അധ്യായം / പേജ് പരിധി തിരഞ്ഞെടുക്കുക' : 'Select Chapter or Page Range'}</span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {detectedChapters.length} chapter(s) detected
                        </span>
                      </div>

                      {detectedChapters.length > 0 && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Detected Chapters:
                          </label>
                          <select
                            value={selectedChapterIdx}
                            onChange={(e) => handleChapterSelect(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-kerala-blue"
                          >
                            {detectedChapters.map((ch, idx) => (
                              <option key={idx} value={idx}>
                                {ch.title} (Pages {ch.startPage}–{ch.endPage}, ~{ch.estimatedWordCount} words)
                              </option>
                            ))}
                            <option value="custom">— Custom Page Range —</option>
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Start Page:
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={documentAudit.totalPages}
                            value={startPage}
                            onChange={(e) => handlePageRangeChange(parseInt(e.target.value, 10) || 1, endPage)}
                            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-kerala-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            End Page:
                          </label>
                          <input
                            type="number"
                            min={startPage}
                            max={documentAudit.totalPages}
                            value={endPage}
                            onChange={(e) => handlePageRangeChange(startPage, parseInt(e.target.value, 10) || startPage)}
                            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-kerala-blue"
                          />
                        </div>
                      </div>

                      {/* Selected Range Stats & Preview Button */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-600">
                          Selected Range: <strong>Pages {startPage}–{endPage}</strong> ({chapterPreviewWords} words)
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPreviewDrawer(!showPreviewDrawer)}
                          className="text-xs text-kerala-blue hover:text-navy-900 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{showPreviewDrawer ? 'Hide Page Text' : 'Preview Page Text'}</span>
                        </button>
                      </div>

                      {isSelectedRangeBrief && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>
                            Selected pages contain only {chapterPreviewWords} words. Please choose a page range with substantive chapter content.
                          </span>
                        </div>
                      )}

                      {/* Collapsible Page Text Preview Drawer */}
                      {showPreviewDrawer && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                          <div className="font-sans font-bold text-navy-900 text-[11px] mb-2 border-b border-slate-200 pb-1 flex justify-between">
                            <span>Text Extracted on Pages {startPage}–{endPage}:</span>
                            <span className="text-slate-400 font-normal">{chapterPreviewWords} words</span>
                          </div>
                          {chapterPreviewText || 'No text extracted for the selected page range.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: SCERT Presets */}
              {activeInputTab === 'preset' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'ml' ? 'മാതൃകാ പാഠങ്ങൾ തിരഞ്ഞെടുക്കുക' : 'Choose a Kerala Curriculum Chapter'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {KERALA_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                          chapterTitle === preset.chapter
                            ? 'bg-blue-50 border-kerala-blue text-navy-900 font-bold ring-2 ring-kerala-blue/30'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-bold block text-navy-900 text-sm">{preset.chapter}</span>
                        <span className="text-slate-400 mt-1 block">{preset.grade} • {preset.subject}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Text Input */}
              {activeInputTab === 'text' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {language === 'ml' ? 'പാഠഭാഗത്തിന്റെ വിവരങ്ങൾ' : 'Paste textbook paragraphs or notes:'}
                    </label>
                    <span className="text-xs text-slate-400">{wordCount} words</span>
                  </div>
                  <textarea
                    rows={4}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Enter textbook passage or notes in English or Malayalam..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-blue"
                  />
                </div>
              )}

              {/* Source Sufficiency Warning Banner */}
              {isSourceBrief && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Brief excerpt ({wordCount} words):</strong> Uploading full textbook sections or adding more detail yields higher curriculum fidelity and richer concept explanations.
                  </span>
                </div>
              )}

              {/* SQLite Cache Hit Banner */}
              {cachedExistingLesson && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-3 shadow-sm animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold text-sm text-emerald-900">
                          {language === 'ml' ? 'ഈ അധ്യായത്തിന്റെ അംഗീകരിച്ച പാഠം ലഭ്യമാണ്!' : 'Approved Lesson Available for this Chapter/Pages!'}
                        </p>
                        <p className="text-emerald-800 mt-0.5">
                          {language === 'ml' 
                            ? `പേജ് ${startPage}–${endPage} ഭാഗങ്ങൾക്കുള്ള വേർഷൻ ${cachedExistingLesson.version || 1} (${cachedExistingLesson.approvalStatus === 'approved' ? 'അംഗീകരിച്ചത്' : 'കരട്'}) സൂക്ഷിച്ചിട്ടുണ്ട്.`
                            : `A verified Version ${cachedExistingLesson.version || 1} (${cachedExistingLesson.approvalStatus || 'draft'}) for Pages ${startPage}–${endPage} is saved in the local database.`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReviewLesson(cachedExistingLesson);
                        setModalMode('review');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 shadow-sm transition-all"
                    >
                      {language === 'ml' ? 'സേവ് ചെയ്ത പാഠം തുറക്കുക (0 API ചിലവ്)' : 'Open Saved Lesson (0 API Cost)'}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={forceRegenerate}
                        onChange={(e) => setForceRegenerate(e.target.checked)}
                        className="rounded border-emerald-400 text-emerald-700 focus:ring-emerald-500"
                      />
                      <span>Force Regenerate (Bypass local cache and re-analyze with Gemini)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Metadata Selectors: Grade (Strictly Class 4), Subject (Strictly 3 subjects) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ml' ? 'ക്ലാസ്സ് (Class)' : 'Grade'}
                  </label>
                  <select
                    value={grade}
                    disabled
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-bold focus:outline-none cursor-not-allowed"
                  >
                    <option value="Class 4">Class 4 (നാലാം ക്ലാസ്സ്) — Strictly Curated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ml' ? 'വിഷയം (Subject)' : 'Subject (Class 4 Only)'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-navy-900 focus:ring-2 focus:ring-kerala-blue focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics (ഗണിതം)</option>
                    <option value="Environmental Studies">Environmental Studies (പരിസരപഠനം)</option>
                  </select>
                </div>
              </div>

              {/* Chapter Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ml' ? 'പാഠത്തിന്റെ പേര് (Chapter Name)' : 'Chapter Title'}
                </label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. വരകളും രൂപങ്ങളും / ബന്ധം കണ്ടെത്താം / അബാക്കസ്"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-blue"
                />
              </div>
            </>
          )}

          {/* MODE 3: TEACHER REVIEW INTERFACE */}
          {modalMode === 'review' && reviewLesson && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Review Header Banner: Source Confidence & Generation Origin */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy-900">Source Fidelity:</span>
                  {reviewLesson.sourceAccuracyConfidence === 'high' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> High Grounding
                    </span>
                  ) : reviewLesson.sourceAccuracyConfidence === 'medium' ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      Medium (Supplemented)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Short Source
                    </span>
                  )}
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">
                    Engine: <strong className="text-navy-900">{reviewLesson.generatedBy === 'gemini' ? 'Gemini 2.5 Flash' : 'SCERT Template'}</strong>
                  </span>
                </div>

                <div className="text-slate-500">
                  {reviewLesson.grade} • {reviewLesson.subject}
                </div>
              </div>

              {/* Diagnostic Log if available */}
              {diagnosticLog && (
                <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-navy-900">Pipeline Diagnostic:</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[11px] font-semibold text-navy-900">
                      Pages Analyzed: [{diagnosticLog.pagesAnalyzed.join(', ')}]
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[11px] font-semibold text-slate-700">
                      {diagnosticLog.totalCharactersAnalyzed.toLocaleString()} Chars
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-[11px] font-semibold text-emerald-800">
                      {diagnosticLog.conceptsRetained} Concepts Grounded
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {diagnosticLog.modelName}
                  </span>
                </div>
              )}

              {/* Generation Warnings if any */}
              {generationWarnings.length > 0 && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                  {generationWarnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Tabs */}
              <div className="flex border-b border-slate-200 gap-1 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
                <button
                  onClick={() => setReviewTab('overview')}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    reviewTab === 'overview'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  Overview & Objectives
                </button>
                <button
                  onClick={() => setReviewTab('concepts')}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    reviewTab === 'concepts'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Concepts</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {reviewLesson.concepts?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => setReviewTab('vocabulary')}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    reviewTab === 'vocabulary'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Glossary</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {reviewLesson.vocabulary?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => setReviewTab('activities')}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    reviewTab === 'activities'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Manipulatives</span>
                </button>
                <button
                  onClick={() => setReviewTab('quiz')}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    reviewTab === 'quiz'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz ({reviewLesson.quiz?.length || 0})</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW & OBJECTIVES */}
              {reviewTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={reviewLesson.titleEn}
                        onChange={(e) => setReviewLesson({ ...reviewLesson, titleEn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-navy-900 focus:ring-2 focus:ring-kerala-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Title (മലയാളം)
                      </label>
                      <input
                        type="text"
                        value={reviewLesson.titleMl}
                        onChange={(e) => setReviewLesson({ ...reviewLesson, titleMl: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-malayalam font-semibold text-navy-900 focus:ring-2 focus:ring-kerala-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={reviewLesson.descriptionEn}
                      onChange={(e) => setReviewLesson({ ...reviewLesson, descriptionEn: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-kerala-blue focus:outline-none"
                    />
                  </div>

                  {/* Learning Objectives */}
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-navy-900">
                        Learning Objectives (പഠന ലക്ഷ്യങ്ങൾ)
                      </span>
                      <button
                        onClick={() => {
                          const newEn = [...(reviewLesson.learningObjectivesEn || []), 'New learning objective'];
                          const newMl = [...(reviewLesson.learningObjectivesMl || []), 'പുതിയ പഠന ലക്ഷ്യം'];
                          setReviewLesson({
                            ...reviewLesson,
                            learningObjectivesEn: newEn,
                            learningObjectivesMl: newMl
                          });
                        }}
                        className="text-xs text-kerala-blue font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Objective
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(reviewLesson.learningObjectivesEn || []).map((objEn, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                          <span className="font-bold text-slate-400 mt-1">{idx + 1}.</span>
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={objEn}
                              onChange={(e) => {
                                const newEn = [...(reviewLesson.learningObjectivesEn || [])];
                                newEn[idx] = e.target.value;
                                setReviewLesson({ ...reviewLesson, learningObjectivesEn: newEn });
                              }}
                              className="w-full text-xs text-navy-900 font-medium border-b border-transparent hover:border-slate-300 focus:border-kerala-blue focus:outline-none"
                              placeholder="English objective"
                            />
                            <input
                              type="text"
                              value={(reviewLesson.learningObjectivesMl || [])[idx] || ''}
                              onChange={(e) => {
                                const newMl = [...(reviewLesson.learningObjectivesMl || [])];
                                newMl[idx] = e.target.value;
                                setReviewLesson({ ...reviewLesson, learningObjectivesMl: newMl });
                              }}
                              className="w-full text-xs font-malayalam text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-kerala-blue focus:outline-none"
                              placeholder="മലയാളം ലക്ഷ്യം"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newEn = (reviewLesson.learningObjectivesEn || []).filter((_, i) => i !== idx);
                              const newMl = (reviewLesson.learningObjectivesMl || []).filter((_, i) => i !== idx);
                              setReviewLesson({
                                ...reviewLesson,
                                learningObjectivesEn: newEn,
                                learningObjectivesMl: newMl
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONCEPTS */}
              {reviewTab === 'concepts' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Bilingual concept explanations tailored for Kerala school students
                    </span>
                    {aiStatus.aiAvailable && (
                      <button
                        onClick={() => handleRegenerate('concepts')}
                        disabled={regeneratingSection === 'concepts'}
                        className="text-xs text-kerala-blue font-semibold flex items-center gap-1.5 hover:underline disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'concepts' ? 'animate-spin' : ''}`} />
                        Regenerate Concepts with AI
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(reviewLesson.concepts || []).map((concept, idx) => (
                      <div key={concept.id || idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-kerala-blue">Concept {idx + 1}</span>
                            {concept.sourcePage ? (
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-kerala-blue" />
                                <span>Page {concept.sourcePage}</span>
                              </span>
                            ) : null}
                          </div>
                          <button
                            onClick={() => {
                              const newConcepts = (reviewLesson.concepts || []).filter((_, i) => i !== idx);
                              setReviewLesson({ ...reviewLesson, concepts: newConcepts });
                            }}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={concept.titleEn}
                            onChange={(e) => {
                              const list = [...(reviewLesson.concepts || [])];
                              list[idx].titleEn = e.target.value;
                              setReviewLesson({ ...reviewLesson, concepts: list });
                            }}
                            placeholder="Title in English"
                            className="p-2 rounded-lg border border-slate-200 text-xs font-bold text-navy-900"
                          />
                          <input
                            type="text"
                            value={concept.titleMl}
                            onChange={(e) => {
                              const list = [...(reviewLesson.concepts || [])];
                              list[idx].titleMl = e.target.value;
                              setReviewLesson({ ...reviewLesson, concepts: list });
                            }}
                            placeholder="തലക്കെട്ട് (മലയാളം)"
                            className="p-2 rounded-lg border border-slate-200 text-xs font-malayalam font-bold text-navy-900"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <textarea
                            rows={2}
                            value={concept.explanationEn}
                            onChange={(e) => {
                              const list = [...(reviewLesson.concepts || [])];
                              list[idx].explanationEn = e.target.value;
                              setReviewLesson({ ...reviewLesson, concepts: list });
                            }}
                            placeholder="Explanation in English"
                            className="p-2 rounded-lg border border-slate-200 text-xs text-slate-700"
                          />
                          <textarea
                            rows={2}
                            value={concept.explanationMl}
                            onChange={(e) => {
                              const list = [...(reviewLesson.concepts || [])];
                              list[idx].explanationMl = e.target.value;
                              setReviewLesson({ ...reviewLesson, concepts: list });
                            }}
                            placeholder="വിശദീകരണം (മലയാളം)"
                            className="p-2 rounded-lg border border-slate-200 text-xs font-malayalam text-slate-700"
                          />
                        </div>

                        {/* Grounded Evidence Snippet / Quote */}
                        <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
                          <div className="flex items-center justify-between font-semibold text-amber-900 text-[11px]">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-amber-700" /> Textbook Evidence Snippet:
                            </span>
                            {concept.sourcePage && (
                              <span className="text-[10px] text-amber-700 font-medium">Verified from Page {concept.sourcePage}</span>
                            )}
                          </div>
                          <textarea
                            rows={2}
                            value={concept.evidenceSnippet || ''}
                            onChange={(e) => {
                              const list = [...(reviewLesson.concepts || [])];
                              list[idx].evidenceSnippet = e.target.value;
                              setReviewLesson({ ...reviewLesson, concepts: list });
                            }}
                            placeholder="Exact supporting quote or sentence from the textbook..."
                            className="w-full bg-white p-2 rounded-lg border border-amber-200 text-xs text-slate-800 italic focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div className="p-2 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                          <span className="font-bold text-navy-900 shrink-0">Kerala Context:</span>
                          <input
                            type="text"
                            value={concept.realLifeExampleEn}
                            onChange={(e) => {
                              const list = [...(reviewLesson.concepts || [])];
                              list[idx].realLifeExampleEn = e.target.value;
                              setReviewLesson({ ...reviewLesson, concepts: list });
                            }}
                            placeholder="Real life example from Kerala surroundings"
                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none text-xs"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newC: ConceptItem = {
                          id: `c-${Date.now()}`,
                          titleEn: 'New Concept',
                          titleMl: 'പുതിയ ആശയം',
                          explanationEn: 'Explanation of concept',
                          explanationMl: 'ആശയത്തിന്റെ വിശദീകരണം',
                          realLifeExampleEn: 'Local Kerala example',
                          realLifeExampleMl: 'കേരളത്തിലെ ഉദാഹരണം',
                          suggestedVisual: 'Diagram'
                        };
                        setReviewLesson({
                          ...reviewLesson,
                          concepts: [...(reviewLesson.concepts || []), newC]
                        });
                      }}
                      className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-navy-900 hover:border-kerala-blue/50 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Concept
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: VOCABULARY */}
              {reviewTab === 'vocabulary' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Bilingual glossary terms for language & subject reinforcement
                    </span>
                    {aiStatus.aiAvailable && (
                      <button
                        onClick={() => handleRegenerate('vocabulary')}
                        disabled={regeneratingSection === 'vocabulary'}
                        className="text-xs text-kerala-blue font-semibold flex items-center gap-1.5 hover:underline disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'vocabulary' ? 'animate-spin' : ''}`} />
                        Regenerate Glossary with AI
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(reviewLesson.vocabulary || []).map((voc, idx) => (
                      <div key={voc.id || idx} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={voc.word}
                            onChange={(e) => {
                              const list = [...(reviewLesson.vocabulary || [])];
                              list[idx].word = e.target.value;
                              setReviewLesson({ ...reviewLesson, vocabulary: list });
                            }}
                            className="font-bold text-sm text-navy-900 border-b border-transparent hover:border-slate-300 focus:outline-none"
                            placeholder="Word / പദം"
                          />
                          <button
                            onClick={() => {
                              const list = (reviewLesson.vocabulary || []).filter((_, i) => i !== idx);
                              setReviewLesson({ ...reviewLesson, vocabulary: list });
                            }}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div>
                            <span className="text-[11px] text-slate-400 block">English Meaning:</span>
                            <input
                              type="text"
                              value={voc.meaningEn}
                              onChange={(e) => {
                                const list = [...(reviewLesson.vocabulary || [])];
                                list[idx].meaningEn = e.target.value;
                                setReviewLesson({ ...reviewLesson, vocabulary: list });
                              }}
                              className="w-full text-slate-700 border-b border-transparent hover:border-slate-300 focus:outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block">അർത്ഥം (മലയാളം):</span>
                            <input
                              type="text"
                              value={voc.meaningMl}
                              onChange={(e) => {
                                const list = [...(reviewLesson.vocabulary || [])];
                                list[idx].meaningMl = e.target.value;
                                setReviewLesson({ ...reviewLesson, vocabulary: list });
                              }}
                              className="w-full font-malayalam text-slate-700 border-b border-transparent hover:border-slate-300 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const newV: VocabularyItem = {
                        id: `v-${Date.now()}`,
                        word: 'New Word',
                        meaningEn: 'Meaning in English',
                        meaningMl: 'മലയാളത്തിലെ അർത്ഥം',
                        exampleEn: 'Example sentence in class.',
                        exampleMl: 'ക്ലാസ്സിൽ നിന്നുള്ള ഉദാഹരണം.'
                      };
                      setReviewLesson({
                        ...reviewLesson,
                        vocabulary: [...(reviewLesson.vocabulary || []), newV]
                      });
                    }}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-navy-900 hover:border-kerala-blue/50 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Glossary Word
                  </button>
                </div>
              )}

              {/* TAB 4: INTERACTIVE ACTIVITIES (MANIPULATIVES) */}
              {reviewTab === 'activities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      DRISHTI interactive smartboard manipulatives linked to this chapter
                    </span>
                    {aiStatus.aiAvailable && (
                      <button
                        onClick={() => handleRegenerate('activities')}
                        disabled={regeneratingSection === 'activities'}
                        className="text-xs text-kerala-blue font-semibold flex items-center gap-1.5 hover:underline disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'activities' ? 'animate-spin' : ''}`} />
                        Redetect Activities with AI
                      </button>
                    )}
                  </div>

                  {/* Activity Selection or Display */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-navy-900 block">
                      Assigned Interactive Manipulative:
                    </span>

                    {reviewLesson.activities && reviewLesson.activities.length > 0 ? (
                      reviewLesson.activities.map((act, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-kerala-blue font-bold text-xs uppercase">
                                {act.activityType?.replace('_', ' ')}
                              </span>
                              <span className="font-bold text-navy-900 text-sm">{act.titleEn}</span>
                            </div>

                            <select
                              value={act.activityType}
                              onChange={(e) => {
                                const list = [...(reviewLesson.activities || [])];
                                list[idx].activityType = e.target.value as any;
                                list[idx].activityModule = e.target.value;
                                setReviewLesson({ ...reviewLesson, activities: list });
                              }}
                              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
                            >
                              <option value="fraction_playground">Fraction Playground (ഗണിതം)</option>
                              <option value="multiplication_visualizer">Multiplication Visualizer (ഗുണനം)</option>
                              <option value="bird_beak_matching">Bird Beak Matching Game (പക്ഷികൾ)</option>
                              <option value="water_cycle_explorer">Water Cycle Explorer (ജലചക്രം)</option>
                              <option value="visual_explanation">Visual Concept Card</option>
                            </select>
                          </div>

                          <p className="text-xs text-slate-600">{act.instructionEn}</p>
                          <p className="text-xs font-malayalam text-slate-500">{act.instructionMl}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
                        <p className="text-xs text-slate-500 mb-2">No specialized manipulative attached yet.</p>
                        <button
                          onClick={() => {
                            setReviewLesson({
                              ...reviewLesson,
                              activities: [
                                {
                                  titleEn: 'Interactive Smartboard Exercise',
                                  titleMl: 'ഇന്ററാക്ടീവ് സ്മാർട്ട്ബോർഡ് പ്രവർത്തനം',
                                  activityType: 'visual_explanation',
                                  learningObjectiveEn: 'Visual understanding and active engagement',
                                  learningObjectiveMl: 'ദൃശ്യപരമായ ധാരണയും പങ്കാളിത്തവും',
                                  instructionEn: 'Interact with visual manipulatives on the smartboard.',
                                  instructionMl: 'സ്മാർട്ട്ബോർഡിലെ ഉപകരണങ്ങൾ ഉപയോഗിക്കുക.'
                                }
                              ]
                            });
                          }}
                          className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
                        >
                          Attach Manipulative
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: QUIZ */}
              {reviewTab === 'quiz' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Formative assessment questions with bilingual feedback
                    </span>
                    {aiStatus.aiAvailable && (
                      <button
                        onClick={() => handleRegenerate('quiz')}
                        disabled={regeneratingSection === 'quiz'}
                        className="text-xs text-kerala-blue font-semibold flex items-center gap-1.5 hover:underline disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'quiz' ? 'animate-spin' : ''}`} />
                        Regenerate Quiz with AI
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(reviewLesson.quiz || []).map((q, idx) => (
                      <div key={q.id || idx} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy-900">Question {idx + 1}</span>
                          <button
                            onClick={() => {
                              const list = (reviewLesson.quiz || []).filter((_, i) => i !== idx);
                              setReviewLesson({ ...reviewLesson, quiz: list });
                            }}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={q.questionEn}
                          onChange={(e) => {
                            const list = [...(reviewLesson.quiz || [])];
                            list[idx].questionEn = e.target.value;
                            setReviewLesson({ ...reviewLesson, quiz: list });
                          }}
                          className="w-full p-2 rounded-lg border border-slate-200 font-semibold text-navy-900"
                          placeholder="Question in English"
                        />
                        <input
                          type="text"
                          value={q.questionMl}
                          onChange={(e) => {
                            const list = [...(reviewLesson.quiz || [])];
                            list[idx].questionMl = e.target.value;
                            setReviewLesson({ ...reviewLesson, quiz: list });
                          }}
                          className="w-full p-2 rounded-lg border border-slate-200 font-malayalam font-semibold text-navy-900"
                          placeholder="ചോദ്യം (മലയാളം)"
                        />

                        {/* Options */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-500 block">
                            Options (Select correct index):
                          </span>
                          {q.optionsEn.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${idx}`}
                                checked={q.correctIndex === oIdx}
                                onChange={() => {
                                  const list = [...(reviewLesson.quiz || [])];
                                  list[idx].correctIndex = oIdx;
                                  setReviewLesson({ ...reviewLesson, quiz: list });
                                }}
                                className="text-kerala-blue"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const list = [...(reviewLesson.quiz || [])];
                                  list[idx].optionsEn[oIdx] = e.target.value;
                                  setReviewLesson({ ...reviewLesson, quiz: list });
                                }}
                                className="flex-1 p-1.5 rounded-lg border border-slate-200 text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                          <span className="font-bold text-[11px] text-navy-800 block mb-0.5">Explanation:</span>
                          <input
                            type="text"
                            value={q.explanationEn}
                            onChange={(e) => {
                              const list = [...(reviewLesson.quiz || [])];
                              list[idx].explanationEn = e.target.value;
                              setReviewLesson({ ...reviewLesson, quiz: list });
                            }}
                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none text-xs"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newQ: QuizQuestion = {
                          id: `q-${Date.now()}`,
                          type: 'multiple_choice',
                          questionEn: 'New Question',
                          questionMl: 'പുതിയ ചോദ്യം',
                          optionsEn: ['Option A', 'Option B', 'Option C', 'Option D'],
                          optionsMl: ['ഓപ്ഷൻ 1', 'ഓപ്ഷൻ 2', 'ഓപ്ഷൻ 3', 'ഓപ്ഷൻ 4'],
                          correctIndex: 0,
                          explanationEn: 'Explanation of correct answer.',
                          explanationMl: 'ശരിയായ ഉത്തരത്തിന്റെ വിവരണം.'
                        };
                        setReviewLesson({
                          ...reviewLesson,
                          quiz: [...(reviewLesson.quiz || []), newQ]
                        });
                      }}
                      className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-navy-900 hover:border-kerala-blue/50 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Question
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 border-t border-[#2E263B] bg-[#0F0C18] flex items-center justify-between text-[#EDE5F7]">
          {modalMode === 'input' ? (
            <>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-bold text-[#A59CB5] hover:text-[#EDE5F7]"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2.5">
                {/* Secondary: Scaffold template if user wishes */}
                <button
                  onClick={() => handleGenerate(true)}
                  disabled={isLoading || !chapterTitle.trim()}
                  className="px-4 py-2.5 rounded-xl border border-[#2E263B] hover:bg-[#1D1A24] text-[#EDE5F7] font-bold text-xs transition-all"
                >
                  Create SCERT Template
                </button>

                {/* Primary: Generate with AI (or scaffold if AI unavailable) */}
                <button
                  onClick={() => handleGenerate(false)}
                  disabled={isLoading || !chapterTitle.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#563580] hover:bg-[#683FA7] disabled:opacity-40 text-white font-black text-sm shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>
                    {aiStatus.aiAvailable 
                      ? (language === 'ml' ? 'Gemini AI ഉപയോഗിച്ച് തയ്യാറാക്കുക' : 'Generate with Gemini AI')
                      : (language === 'ml' ? 'മാതൃകാ പാഠം നിർമ്മിക്കുക' : 'Generate Template Lesson')}
                  </span>
                </button>
              </div>
            </>
          ) : modalMode === 'review' ? (
            <>
              <button
                onClick={() => setModalMode('input')}
                className="px-4 py-2 text-xs font-bold text-[#A59CB5] hover:text-[#EDE5F7]"
              >
                Back to Source
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSaveLesson(false, false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1D1A24] border border-[#2E263B] hover:bg-[#282136] text-[#EDE5F7] font-bold text-xs transition-all shadow-sm"
                >
                  {language === 'ml' ? 'കരടായി സൂക്ഷിക്കുക' : 'Save as Draft'}
                </button>

                <button
                  onClick={() => handleSaveLesson(false, true)}
                  className="px-4 py-2.5 rounded-xl bg-[#1D1A24] hover:bg-[#282136] text-[#72D6B0] border border-[#72D6B0]/40 font-black text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#72D6B0]" />
                  <span>{language === 'ml' ? 'ക്ലാസ്സിന് അംഗീകരിക്കുക' : 'Approve for Classroom'}</span>
                </button>

                <button
                  onClick={() => handleSaveLesson(true, true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#563580] hover:bg-[#683FA7] text-white font-black text-xs sm:text-sm shadow-md transition-all"
                >
                  <span>{language === 'ml' ? 'അംഗീകരിച്ച് ക്ലാസ്സ് തുറക്കുക' : 'Approve & Launch Classroom'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
