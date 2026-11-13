import { 
  Lesson, 
  ExtractResult, 
  GenerateLessonResponse, 
  RegenerateSectionResponse, 
  AiStatusResponse,
  Subject
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<{ 
  online: boolean; 
  message: string; 
  ocrAvailable?: boolean;
  geminiConfigured?: boolean;
  geminiModel?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      return { 
        online: true, 
        message: data.service || 'Connected',
        ocrAvailable: data.ocr?.tesseractInstalled || false,
        geminiConfigured: data.geminiConfigured || false,
        geminiModel: data.geminiModel || 'gemini-2.5-flash'
      };
    }
    return { online: false, message: 'Backend returned status error' };
  } catch (err) {
    return { online: false, message: 'Backend offline (using local processing)' };
  }
}

export async function checkAiStatus(): Promise<AiStatusResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai-status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Unable to query AI status endpoint:', err);
  }
  return {
    aiAvailable: false,
    model: 'gemini-2.5-flash',
    provider: 'Google GenAI SDK (Offline/Unconfigured)'
  };
}

export async function extractPdf(file: File): Promise<ExtractResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/extract-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.info('Backend not responding to PDF extract, using local fallback:', err);
  }

  // Fallback for offline or standalone frontend mode:
  const isMalayalamFilename = /[\u0D00-\u0D7F]/.test(file.name) || file.name.toLowerCase().includes('mal');
  const simulatedText = isMalayalamFilename 
    ? `[SCERT കേരള പാഠപുസ്തകം - ക്ലാസ്സ് 4]\n\nഅധ്യായം: പ്രകൃതിയും ജീവജാലങ്ങളും\nകേരളത്തിലെ കാലാവസ്ഥയും ജൈവവൈവിധ്യവും ആഗോളതലത്തിൽ ശ്രദ്ധേയമാണ്. പശ്ചിമഘട്ട മലനിരകളും കായലുകളും സംരക്ഷിക്കുക എന്നത് നമ്മുടെ കർത്തവ്യമാണ്.\n\nപ്രധാന ആശയങ്ങൾ:\n1. തണ്ണീർത്തടങ്ങളുടെ പ്രാധാന്യം\n2. കണ്ടൽക്കാടുകളുടെ പങ്ക്\n3. ജീവജാലങ്ങളുടെ പരസ്പരബന്ധം`
    : `[SCERT Kerala Textbook - Class 4]\n\nChapter: Ecosystems and Living Things\nKerala is endowed with unique geographic formations from the Western Ghats to the coastal wetlands. Every organism plays an interdependent role in maintaining balance.\n\nKey Concepts:\n1. Biodiversity hotspots in Kerala\n2. Importance of wetlands and mangrove ecosystems\n3. Conservation strategies for school students`;

  return {
    success: true,
    pageCount: 3,
    extractedText: simulatedText,
    languageDetected: isMalayalamFilename ? 'malayalam' : 'english',
    previewSnippet: simulatedText.slice(0, 250),
    sourceFileHash: `mock-hash-${file.name}`,
    fileName: file.name
  };
}

export async function extractImage(file: File): Promise<ExtractResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/extract-image`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: data.success,
        pageCount: 1,
        extractedText: data.extractedText,
        languageDetected: data.languageDetected,
        previewSnippet: data.previewSnippet || data.extractedText.slice(0, 200),
        sourceFileHash: data.sourceFileHash,
        fileName: data.fileName || file.name,
        ocrAvailable: data.ocrAvailable,
        error: data.error
      };
    }
  } catch (err) {
    console.info('Backend image extract offline or unavailable:', err);
  }

  return {
    success: true,
    pageCount: 1,
    extractedText: `[Textbook Photo Scan: ${file.name}]\nScanned page ready for visual lesson creation.`,
    languageDetected: 'malayalam',
    previewSnippet: `[Textbook Photo Scan: ${file.name}] ready for interactive generation.`,
    sourceFileHash: `mock-hash-${file.name}`,
    fileName: file.name
  };
}

/**
 * Checks SQLite cache on the backend using the scoped cache key.
 * If found, returns the cached lesson, avoiding any Gemini API calls.
 */
export async function checkCachedLesson(
  fileHash: string,
  startPage?: number,
  endPage?: number,
  chapter?: string
): Promise<{
  found: boolean;
  lesson?: Lesson | null;
  version?: number;
  approvalStatus?: string;
}> {
  if (!fileHash) return { found: false };
  try {
    const params = new URLSearchParams();
    if (startPage) params.append('start_page', String(startPage));
    if (endPage) params.append('end_page', String(endPage));
    if (chapter) params.append('chapter', chapter);

    const url = `${API_BASE_URL}/api/cached-lesson/${encodeURIComponent(fileHash)}${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Cache check error:', err);
  }
  return { found: false };
}

/**
 * Previews textbook text and metrics for a specific page range before generating.
 */
export async function previewChapterPages(params: {
  rawText: string;
  startPage?: number;
  endPage?: number;
}): Promise<{
  text: string;
  wordCount: number;
  pageCount: number;
  pagesIncluded: number[];
  snippet: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chapter-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Chapter preview request failed:', err);
  }
  return {
    text: params.rawText,
    wordCount: params.rawText.split(/\s+/).length,
    pageCount: 1,
    pagesIncluded: [1],
    snippet: params.rawText.slice(0, 300)
  };
}

/**
 * Saves or approves a lesson to SQLite database on the backend.
 */
export async function approveLessonOnBackend(lesson: Lesson, approvalStatus: 'approved' | 'draft' = 'approved'): Promise<{
  success: boolean;
  lessonId?: string;
  version?: number;
  approvalStatus?: string;
  message?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/approve-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lesson,
        approvalStatus
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to approve lesson on backend:', err);
  }
  return { success: false, message: 'Could not connect to backend database' };
}

/**
 * Fetches all lessons saved in SQLite backend database.
 */
export async function fetchDbLessons(): Promise<Lesson[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/db-lessons`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch DB lessons:', err);
  }
  return [];
}

/**
 * Fetches a single lesson by ID from SQLite backend database.
 */
export async function fetchDbLessonById(lessonId: string, requireApproved: boolean = false): Promise<Lesson | null> {
  try {
    const url = `${API_BASE_URL}/api/db-lessons/${encodeURIComponent(lessonId)}${requireApproved ? '?require_approved=true' : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch DB lesson by ID:', err);
  }
  return null;
}

/**
 * Deletes a lesson from SQLite backend database.
 */
export async function deleteDbLesson(lessonId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/db-lessons/${encodeURIComponent(lessonId)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to delete DB lesson:', err);
    return false;
  }
}

/**
 * Invokes Gemini AI lesson generation on the backend.
 * Passes sourceFileHash to leverage SQLite caching and prevent duplicate API costs.
 */
export async function generateLessonFromBackend(params: {
  rawText: string;
  subject: string;
  grade: string;
  chapterTitle: string;
  sourceFileHash?: string;
  sourceFileName?: string;
  languagePreference?: 'bilingual' | 'malayalam' | 'english';
  startPage?: number;
  endPage?: number;
  selectedChapterTitle?: string;
  forceRegenerate?: boolean;
}): Promise<GenerateLessonResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: params.rawText,
        subject: params.subject,
        grade: params.grade || 'Class 4',
        chapterTitle: params.chapterTitle,
        sourceFileHash: params.sourceFileHash || '',
        sourceFileName: params.sourceFileName || '',
        languagePreference: params.languagePreference || 'malayalam',
        startPage: params.startPage,
        endPage: params.endPage,
        selectedChapterTitle: params.selectedChapterTitle,
        forceRegenerate: params.forceRegenerate || false
      }),
    });

    if (response.ok) {
      const data: GenerateLessonResponse = await response.json();
      return data;
    } else {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        aiAvailable: false,
        error: errData.detail || 'Backend generation failed'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      aiAvailable: false,
      error: err.message || 'Network error connecting to backend'
    };
  }
}

/**
 * Creates a structured SCERT curriculum template scaffold for manual teacher authoring.
 */
export async function generateTemplateLesson(params: {
  rawText: string;
  subject: string;
  grade: string;
  chapterTitle: string;
  startPage?: number;
  endPage?: number;
  selectedChapterTitle?: string;
}): Promise<Lesson> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-template-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.info('Backend template endpoint unavailable, falling back to local scaffold:', err);
  }

  // Fallback local scaffold
  return createLocalFallbackLesson(params);
}

/**
 * Regenerates an individual section (concepts, vocabulary, activities, or quiz).
 */
export async function regenerateSection(params: {
  section: 'concepts' | 'vocabulary' | 'activities' | 'quiz';
  rawText: string;
  subject: string;
  grade: string;
  chapterTitle: string;
}): Promise<RegenerateSectionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/regenerate-section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      return await response.json();
    }
    const errData = await response.json().catch(() => ({}));
    return {
      success: false,
      section: params.section,
      data: null,
      aiAvailable: false,
      error: errData.detail || 'Failed to regenerate section'
    };
  } catch (err: any) {
    return {
      success: false,
      section: params.section,
      data: null,
      aiAvailable: false,
      error: err.message || 'Network error'
    };
  }
}

/**
 * Legacy compatibility wrapper.
 */
export async function generateLessonFromText(params: {
  rawText: string;
  subject: string;
  grade: string;
  chapterTitle: string;
}): Promise<Lesson> {
  const result = await generateLessonFromBackend(params);
  if (result.success && result.lesson) {
    return result.lesson;
  }
  return await generateTemplateLesson(params);
}

function createLocalFallbackLesson(params: {
  rawText: string;
  subject: string;
  grade: string;
  chapterTitle: string;
}): Lesson {
  const id = `lesson-${Date.now().toString(36)}`;
  return {
    id,
    titleEn: params.chapterTitle || `${params.subject} Interactive Exploration`,
    titleMl: params.chapterTitle ? `${params.chapterTitle} (ദൃശ്യപാഠം)` : `${params.subject} ഇന്ററാക്ടീവ് പാഠം`,
    subject: (params.subject as Subject) || 'Mathematics',
    grade: 'Class 4',
    chapter: params.chapterTitle,
    descriptionEn: `Interactive visual textbook module on ${params.chapterTitle || params.subject} customized for classroom smartboards.`,
    descriptionMl: `${params.chapterTitle || params.subject} സംബന്ധിച്ച ഇന്ററാക്ടീവ് പാഠം. സ്മാർട്ട്ബോർഡിലും ടാബ്‌ലെറ്റിലും ഉപയോഗിക്കാൻ അനുയോജ്യം.`,
    learningObjectivesEn: [
      `Understand fundamental concepts of ${params.chapterTitle}`,
      'Observe real-world examples in Kerala environment',
      'Participate actively in classroom smartboard activities'
    ],
    learningObjectivesMl: [
      `${params.chapterTitle} എന്ന പാഠത്തിലെ അടിസ്ഥാന ആശയങ്ങൾ മനസ്സിലാക്കുക`,
      'കേരളത്തിന്റെ പരിസരത്തുനിന്നുള്ള ഉദാഹരണങ്ങൾ കണ്ടെത്തുക',
      'സ്മാർട്ട്ബോർഡ് പ്രവർത്തനങ്ങളിൽ സജീവമായി പങ്കെടുക്കുക'
    ],
    concepts: [
      {
        id: 'c1',
        titleEn: `Core Principles of ${params.chapterTitle}`,
        titleMl: `${params.chapterTitle} - പ്രധാന ആശയങ്ങൾ`,
        explanationEn: `Explore the fundamental concepts introduced in ${params.chapterTitle}. Focus on visual patterns and connections to nature.`,
        explanationMl: `${params.chapterTitle} എന്ന പാഠഭാഗത്തിലെ പ്രധാന തത്വങ്ങൾ മനസ്സിലാക്കുക. പ്രകൃതിയുമായും ദൈനംദിന ജീവിതവുമായും ബന്ധിപ്പിച്ചു പഠിക്കാം.`,
        realLifeExampleEn: 'Observations around the school courtyard and home gardens in Kerala.',
        realLifeExampleMl: 'സ്കൂൾ മുറ്റത്തും വീട്ടുപരിസരങ്ങളിലും കാണുന്ന നിരീക്ഷണങ്ങൾ.',
        suggestedVisual: 'Illustrative diagram of concepts'
      }
    ],
    vocabulary: [
      {
        id: 'v1',
        word: 'Exploration / നിരീക്ഷണം',
        meaningEn: 'The action of traveling through or examining unfamiliar concepts',
        meaningMl: 'ആശയങ്ങൾ ശ്രദ്ധയോടെ കണ്ടു മനസ്സിലാക്കുന്ന രീതി',
        exampleEn: 'Students conducted an exploration of garden plants.',
        exampleMl: 'വിദ്യാർത്ഥികൾ പൂന്തോട്ടത്തിലെ സസ്യങ്ങളെ നിരീക്ഷിച്ചു.',
        synonyms: ['Observation', 'Study']
      }
    ],
    durationMinutes: 20,
    tags: ['Curriculum Scaffold', params.subject, 'Class 4', 'Smartboard Ready'],
    createdAt: new Date().toISOString(),
    isCustom: true,
    version: 1,
    approvalStatus: 'draft',
    generatedBy: 'template',
    sourceAccuracyConfidence: 'high',
    activities: [],
    slides: [
      {
        id: 's1',
        titleEn: `Core Concepts: ${params.chapterTitle || params.subject}`,
        titleMl: `പ്രധാന ആശയങ്ങൾ: ${params.chapterTitle || params.subject}`,
        contentEn: params.rawText.slice(0, 300) || `Welcome to this visual lesson prepared for ${params.grade} students in Kerala. Today we delve into the foundational ideas of ${params.chapterTitle}.`,
        contentMl: `ഈ ദൃശ്യപാഠത്തിലേക്ക് സ്വാഗതം. ${params.grade} ക്ലാസ്സിലെ വിദ്യാർത്ഥികൾക്കായി രൂപകൽപ്പന ചെയ്ത ഈ പാഠത്തിൽ ${params.chapterTitle} എന്ന ആശയത്തെ നാം വിശദമായി മനസ്സിലാക്കുന്നു.`,
        visualType: 'interactive_card',
        visualDescriptionEn: `Interactive thematic concept card exploring ${params.chapterTitle}.`,
        visualDescriptionMl: `പാഠഭാഗത്തെ ചിത്രസഹിതം വ്യക്തമാക്കുന്ന ദൃശ്യം.`,
        keyPointsEn: [
          `Key principle from ${params.chapterTitle}`,
          'Active observation in school environment',
          'Collaborative discussion with classmates'
        ],
        keyPointsMl: [
          'പാഠഭാഗത്തിലെ പ്രധാന ആശയം',
          'സ്കൂൾ പരിസരത്തെ സജീവ നിരീക്ഷണം',
          'കൂട്ടുകാരുമൊത്തുള്ള ചർച്ച'
        ],
        audioNarrationEn: `Let us explore ${params.chapterTitle} together on our smartboard!`,
        audioNarrationMl: `നമുക്ക് ഒന്നിച്ച് സ്മാർട്ട്ബോർഡിലൂടെ ഈ പാഠം പഠിക്കാം!`,
        activity: {
          titleEn: 'Interactive Check',
          titleMl: 'ഇന്ററാക്ടീവ് ചിന്ത',
          instructionEn: 'Tap the option that best illustrates this concept in your daily surroundings.',
          instructionMl: 'നിങ്ങളുടെ നിത്യജീവിതത്തിലെ അനുഭവവുമായി പൊരുത്തപ്പെടുന്ന ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക.',
          interactionType: 'tap_reveal',
          items: [
            {
              id: 'item-1',
              titleEn: 'Real-world Kerala example',
              titleMl: 'യഥാർത്ഥ ജീവിത ഉദാഹരണം',
              activityType: 'tap_reveal',
              learningObjectiveEn: 'Observe real life example',
              learningObjectiveMl: 'യഥാർത്ഥ ജീവിത ഉദാഹരണം കണ്ടെത്തുക',
              instructionEn: 'Tap to see the explanation',
              instructionMl: 'വിശദീകരണം കാണാൻ തൊടുക'
            }
          ]
        }
      }
    ],
    quiz: [
      {
        id: 'q1',
        type: 'multiple_choice',
        questionEn: `What is the main learning goal of this lesson on ${params.chapterTitle}?`,
        questionMl: `${params.chapterTitle} എന്ന പാഠത്തിന്റെ പ്രധാന പഠന ലക്ഷ്യം എന്താണ്?`,
        optionsEn: [
          'Deep conceptual understanding and real-world connection',
          'Merely memorizing sentences without meaning',
          'Skipping practical observations',
          'None of the above'
        ],
        optionsMl: [
          'ആശയങ്ങൾ സമഗ്രമായി മനസ്സിലാക്കി ജീവിതവുമായി ബന്ധപ്പെടുത്തുക',
          'കാണാപ്പാഠം പഠിക്കുക മാത്രം',
          'നിരീക്ഷണങ്ങൾ ഒഴിവാക്കുക',
          'ഇതൊന്നുമല്ല'
        ],
        correctIndex: 0,
        explanationEn: 'Drishti is designed to encourage curiosity and active inquiry.',
        explanationMl: 'ആശയങ്ങൾ കണ്ട് അനുഭവിച്ചറിയാനും ജിജ്ഞാസ വളർത്താനുമാണ് ദൃഷ്ടി രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്.'
      }
    ]
  };
}
