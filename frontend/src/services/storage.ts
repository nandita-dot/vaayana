import { Lesson } from '../types';
import { INITIAL_LESSONS } from '../data/sampleLessons';
import { fetchDbLessons, fetchDbLessonById, deleteDbLesson } from './api';

const DB_NAME = 'drishti_educational_db';
const DB_VERSION = 1;
const STORE_NAME = 'lessons';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported by this browser. Offline local storage is disabled.'));
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('subject', 'subject', { unique: false });
          store.createIndex('grade', 'grade', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message || 'Unknown database error'}`));
      };

      request.onblocked = () => {
        console.warn('IndexedDB database upgrade blocked. Please close other open tabs of DRISHTI.');
      };
    } catch (err: any) {
      reject(new Error(`IndexedDB initialization exception: ${err.message || err}`));
    }
  });
}

/**
 * Initializes DB and seeds default SCERT lessons if store is empty.
 */
export async function initializeStorage(): Promise<void> {
  try {
    const db = await openDatabase();
    const count = await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    // If store already has lessons, don't overwrite user modifications, but ensure missing initial lessons exist
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Purge non-mathematics lessons and deprecated records
    try {
      store.delete('scert-std4-maths-fractions');
      store.delete('scert-std4-evs-wings-of-life');
      store.delete('scert-std4-english-turnip');
      store.delete('scert-std4-evs-water-cycle');
    } catch (_) {}
    
    if (count === 0) {
      for (const lesson of INITIAL_LESSONS) {
        store.put(lesson);
      }
    } else {
      // Check and seed only missing canonical sample lessons
      for (const lesson of INITIAL_LESSONS) {
        const checkReq = store.get(lesson.id);
        checkReq.onsuccess = () => {
          if (!checkReq.result) {
            store.put(lesson);
          }
        };
      }
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to initialize IndexedDB:', err);
  }
}

/**
 * Retrieves all saved lessons from authoritative backend SQLite and local IndexedDB.
 */
export async function getAllLessons(): Promise<Lesson[]> {
  const lessonMap = new Map<string, Lesson>();

  // 1. Fetch from authoritative SQLite backend first
  try {
    const dbList = await fetchDbLessons();
    if (Array.isArray(dbList)) {
      dbList.forEach(l => {
        if (l && l.id) lessonMap.set(l.id, l);
      });
    }
  } catch (err) {
    console.warn('Backend SQLite read failed, falling back to local store:', err);
  }

  // 2. Fetch from IndexedDB and supplement
  try {
    await initializeStorage();
    const db = await openDatabase();
    const localLessons = await new Promise<Lesson[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve((request.result as Lesson[]) || []);
      request.onerror = () => reject(request.error);
    });

    localLessons.forEach(l => {
      if (l && l.id && !lessonMap.has(l.id)) {
        lessonMap.set(l.id, l);
      }
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
  }

  // 3. Fallback to initial lessons if empty
  if (lessonMap.size === 0) {
    INITIAL_LESSONS.forEach(l => lessonMap.set(l.id, l));
  }

  // Active Class 4 curriculum subjects (Mathematics & Environmental Studies)
  return Array.from(lessonMap.values()).filter(l => l.subject === 'Mathematics' || l.subject === 'Environmental Studies');
}

/**
 * Retrieves a single lesson by ID from backend SQLite first, then IndexedDB.
 */
export async function getLessonById(id: string): Promise<Lesson | undefined> {
  if (!id) return undefined;

  // 1. Check authoritative backend SQLite first
  try {
    const dbLesson = await fetchDbLessonById(id);
    if (dbLesson) {
      // Synchronize to IndexedDB for offline access
      try {
        await saveLesson(dbLesson);
      } catch (_) {}
      return dbLesson;
    }
  } catch (err) {
    console.warn('Backend lesson fetch error, checking IndexedDB:', err);
  }

  // 2. Fall back to local IndexedDB
  try {
    await initializeStorage();
    const db = await openDatabase();
    const local = await new Promise<Lesson | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as Lesson | undefined);
      request.onerror = () => reject(request.error);
    });
    if (local) return local;
  } catch (err) {
    console.warn(`IndexedDB read error for lesson ${id}:`, err);
  }

  // 3. Fall back to canonical sample lessons
  return INITIAL_LESSONS.find(l => l.id === id);
}

/**
 * Saves or updates a lesson in IndexedDB.
 */
export async function saveLesson(lesson: Lesson): Promise<void> {
  if (!lesson || !lesson.id || !lesson.titleEn) {
    throw new Error('Cannot save invalid lesson: Lesson must have an ID and a title.');
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const updated = {
        ...lesson,
        updatedAt: new Date().toISOString()
      };
      const req = store.put(updated);

      req.onsuccess = () => resolve();
      req.onerror = () => {
        reject(new Error(`Failed to save lesson: ${req.error?.message || 'Storage error'}`));
      };
    });
  } catch (err: any) {
    throw new Error(`Local storage failed: ${err.message || 'Unknown database error'}`);
  }
}

/**
 * Deletes a lesson by ID from both SQLite backend and IndexedDB.
 */
export async function deleteLesson(id: string): Promise<void> {
  // 1. Delete from SQLite backend
  try {
    await deleteDbLesson(id);
  } catch (err) {
    console.warn(`Failed to delete lesson ${id} from SQLite:`, err);
  }

  // 2. Delete from local IndexedDB
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(new Error(`Failed to delete lesson from IndexedDB: ${req.error?.message}`));
    });
  } catch (err) {
    console.warn('IndexedDB delete error:', err);
  }
}

/**
 * Resets local lessons back to the default SCERT sample pack.
 */
export async function resetLessonsToDefault(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of INITIAL_LESSONS) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error(`Failed to reset default lessons: ${tx.error?.message}`));
  });
}

/**
 * Exports a single lesson as formatted JSON string.
 */
export function exportLessonToJson(lesson: Lesson): string {
  return JSON.stringify(lesson, null, 2);
}

/**
 * Exports all lessons as a bundled DRISHTI JSON string.
 */
export function exportAllLessonsToJson(lessons: Lesson[]): string {
  const bundle = {
    app: 'DRISHTI',
    version: '1.1.0',
    exportedAt: new Date().toISOString(),
    lessonCount: lessons.length,
    lessons
  };
  return JSON.stringify(bundle, null, 2);
}

/**
 * Imports lessons from a JSON string with schema and integrity validation.
 */
export async function importLessonsFromJson(jsonString: string): Promise<{ importedCount: number; errors: string[] }> {
  if (!jsonString || !jsonString.trim()) {
    throw new Error('Empty file content. Please select a valid JSON backup file.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: any) {
    throw new Error(`Corrupted JSON format: ${err.message}`);
  }

  // Handle both individual lesson objects, raw array of lessons, and DRISHTI bundles
  let rawLessons: any[] = [];
  if (Array.isArray(parsed)) {
    rawLessons = parsed;
  } else if (parsed && Array.isArray(parsed.lessons)) {
    rawLessons = parsed.lessons;
  } else if (parsed && typeof parsed === 'object') {
    rawLessons = [parsed];
  } else {
    throw new Error('Unsupported JSON format. Expected a DRISHTI lesson or bundle.');
  }

  const errors: string[] = [];
  let importedCount = 0;

  for (let i = 0; i < rawLessons.length; i++) {
    const item = rawLessons[i];
    
    // Validate minimal lesson schema
    if (!item.id || typeof item.id !== 'string') {
      errors.push(`Lesson #${i + 1} skipped: Missing valid string ID.`);
      continue;
    }
    if (!item.titleEn && !item.titleMl) {
      errors.push(`Lesson #${i + 1} (${item.id}) skipped: Missing lesson title.`);
      continue;
    }
    if (!Array.isArray(item.slides) || item.slides.length === 0) {
      errors.push(`Lesson #${i + 1} (${item.id}) skipped: Lesson must contain at least one slide.`);
      continue;
    }

    // Ensure safe defaults for optional fields while preserving activity modules
    const validatedLesson: Lesson = {
      id: item.id,
      titleEn: item.titleEn || item.titleMl || 'Untitled Lesson',
      titleMl: item.titleMl || item.titleEn || 'പാഠം',
      subject: item.subject || 'General',
      grade: item.grade || 'Class 4',
      chapter: item.chapter || item.titleEn || 'Chapter',
      languagePreference: item.languagePreference || 'bilingual',
      descriptionEn: item.descriptionEn || '',
      descriptionMl: item.descriptionMl || '',
      learningObjectivesEn: Array.isArray(item.learningObjectivesEn) ? item.learningObjectivesEn : [],
      learningObjectivesMl: Array.isArray(item.learningObjectivesMl) ? item.learningObjectivesMl : [],
      concepts: Array.isArray(item.concepts) ? item.concepts : [],
      vocabulary: Array.isArray(item.vocabulary) ? item.vocabulary : [],
      durationMinutes: typeof item.durationMinutes === 'number' ? item.durationMinutes : 20,
      slides: item.slides,
      activities: Array.isArray(item.activities) ? item.activities : [],
      quiz: Array.isArray(item.quiz) ? item.quiz : [],
      tags: Array.isArray(item.tags) ? item.tags : ['Imported'],
      sourceTextSnippet: item.sourceTextSnippet || '',
      sourceAccuracyConfidence: item.sourceAccuracyConfidence || 'high',
      sourceWarnings: Array.isArray(item.sourceWarnings) ? item.sourceWarnings : [],
      generatedBy: item.generatedBy || 'template',
      version: item.version || 1,
      approvalStatus: item.approvalStatus || 'approved',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    try {
      await saveLesson(validatedLesson);
      importedCount++;
    } catch (saveErr: any) {
      errors.push(`Error saving ${validatedLesson.titleEn}: ${saveErr.message}`);
    }
  }

  if (importedCount === 0 && errors.length > 0) {
    throw new Error(`Failed to import lessons:\n${errors.join('\n')}`);
  }

  return { importedCount, errors };
}
