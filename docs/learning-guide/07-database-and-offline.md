# VAAYANA (വായന) — Developer Learning Guide
## Module 07: Database & Offline Storage Architecture

---

### Mentor Introduction
In many standard web applications, if the server goes down or your Wi-Fi disconnects, the entire application becomes useless—the screen goes blank or throws an error.

For a primary school in rural Kerala, that is unacceptable. If a teacher starts a mathematics lesson on a smartboard and the school Wi-Fi drops, the class cannot stop.

To solve this, VAAYANA implements a **Dual-Storage Offline-First Architecture**:
1. **Server-Side SQLite (`backend/app/database.py`)**: Stores lessons, versions, and cached AI results on the teacher's workstation.
2. **Client-Side IndexedDB (`frontend/src/services/storage.ts`)**: Stores lessons, teacher drawings, and student quiz scores directly inside the browser's persistent storage engine.

Let us explore how both storage systems work in depth.

---

### 1. Server-Side SQLite Database (`backend/app/database.py`)

SQLite is an embedded relational SQL database engine. Unlike MySQL or PostgreSQL, it does not run as a separate server process. Instead, it reads and writes directly to an ordinary file on disk: `backend/vaayana.db`.

#### Table Schemas
When `init_db()` runs during backend startup, it executes SQL `CREATE TABLE IF NOT EXISTS` statements to build four core tables:

```sql
-- 1. CHAPTERS TABLE: High-level metadata about textbook chapters
CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,           -- 'mathematics' or 'evs'
    chapter_number INTEGER NOT NULL, -- e.g. 1, 2, 3
    title_ml TEXT NOT NULL,          -- Malayalam title
    title_en TEXT NOT NULL,          -- English title
    grade_level INTEGER DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LESSONS TABLE: Complete lesson payloads
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    chapter_id TEXT,
    title_ml TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subject TEXT NOT NULL,
    content_json TEXT NOT NULL,      -- Full JSON containing all slides & quiz questions
    is_approved INTEGER DEFAULT 0,   -- 1 = approved for classroom, 0 = draft
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- 3. LESSON_VERSIONS TABLE: History tracking for lesson edits
CREATE TABLE IF NOT EXISTS lesson_versions (
    version_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    content_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- 4. LESSON_CACHE TABLE: SHA-256 hash lookup to avoid duplicate AI processing
CREATE TABLE IF NOT EXISTS lesson_cache (
    file_hash TEXT PRIMARY KEY,      -- SHA-256 hash of the uploaded PDF
    lesson_data_json TEXT NOT NULL,  -- Cached generated lesson JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### The SHA-256 Hash Caching Pattern
Calling Google's Gemini API takes several seconds and consumes API quota. If a teacher uploads the exact same chapter PDF twice, we should not call the AI again.

Here is how `backend/app/database.py` avoids duplicate work:
```python
import hashlib
import json

def get_file_hash(file_bytes: bytes) -> str:
    # Compute unique 64-character SHA-256 fingerprint of the file
    return hashlib.sha256(file_bytes).hexdigest()

def check_cache(file_hash: str) -> dict | None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT lesson_data_json FROM lesson_cache WHERE file_hash = ?", (file_hash,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return json.loads(row["lesson_data_json"])
    return None
```
Notice the parameter `(file_hash,)` with a `?` placeholder in the SQL query. **Never concatenate strings into SQL queries** (`f"SELECT ... WHERE file_hash = '{file_hash}'"`), because that leaves your application vulnerable to **SQL Injection attacks**. Always use parameterized queries!

---

### 2. Client-Side Browser Storage: IndexedDB (`frontend/src/services/storage.ts`)

While SQLite lives on the backend, **IndexedDB** lives inside the browser on the teacher's laptop.

#### What is IndexedDB?
IndexedDB is an object-oriented, transactional database built directly into every modern web browser (Chrome, Edge, Firefox, Safari). It allows web apps to store JavaScript objects (dictionaries, arrays, strings, binary data) without serializing them manually.

#### Demystifying the Low-Level IndexedDB API
The native browser IndexedDB API uses events (`onsuccess`, `onerror`, `onupgradeneeded`). In `frontend/src/services/storage.ts`, these callback-based events are wrapped into clean, modern JavaScript `async/await` Promises.

Let us trace how the database opens and sets up its tables ("Object Stores"):

```typescript
// Conceptual walkthrough of frontend/src/services/storage.ts:
const DB_NAME = 'vaayana_local_db';
const DB_VERSION = 1;

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // 1. Request to open database with specific version
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 2. Runs ONLY if the database doesn't exist yet or version increased
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create 'lessons' store with 'id' as the primary key
      if (!db.objectStoreNames.contains('lessons')) {
        const lessonStore = db.createObjectStore('lessons', { keyPath: 'id' });
        // Create indexes so we can search by subject or chapter number quickly
        lessonStore.createIndex('subject', 'subject', { unique: false });
        lessonStore.createIndex('chapter_number', 'chapter_number', { unique: false });
      }

      // Create 'settings' store for user preferences
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

#### Writing and Reading Data with Transactions
In IndexedDB, any operation must occur inside a **Transaction**. A transaction ensures data integrity: if anything goes wrong during a write, the entire transaction is rolled back so the database never gets corrupted.

```typescript
// Saving a lesson into IndexedDB:
export async function saveLesson(lesson: Lesson): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    // Open a readwrite transaction on the 'lessons' object store
    const tx = db.transaction('lessons', 'readwrite');
    const store = tx.objectStore('lessons');
    
    // Put the lesson object into the store (inserts or updates)
    const request = store.put(lesson);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Reading all lessons from IndexedDB:
export async function getAllLessons(): Promise<Lesson[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('lessons', 'readonly');
    const store = tx.objectStore('lessons');
    const request = store.getAll(); // Retrieves all objects
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

---

### 3. The Offline Seeding Engine (`frontend/src/data/sampleLessons.ts`)

What happens the very first time a teacher opens VAAYANA on a fresh laptop that has no internet connection? IndexedDB is completely empty!

To solve this, VAAYANA bundles a full set of pre-compiled SCERT Kerala Class 4 lessons directly inside the frontend JavaScript bundle at `frontend/src/data/sampleLessons.ts`.

#### How Auto-Seeding Works:
```
[ App or Classroom Page Mounts ]
  │
  ▼
Calls `storageService.getLessons()` in `frontend/src/services/storage.ts`
  │
  ▼
Reads `store.getAll()` from IndexedDB
  │
  ├── Are there stored lessons?
  │     ├── YES: Return stored lessons immediately.
  │     └── NO (First run on fresh browser):
  │           1. Imports `sampleLessons` from `sampleLessons.ts`
  │           2. Loops through each sample lesson and executes `store.put(lesson)`
  │           3. Returns `sampleLessons` to the UI
```
Because of this auto-seeding engine, the application is **fully functional out of the box** even on a computer that has never connected to the internet!

---

### 4. Offline vs. Online Capabilities Matrix

Here is a clear summary of what features work completely offline versus what requires an active internet connection or backend server:

| Feature | Works 100% Offline? | Requires Backend? | Requires Internet? | Notes |
|---|---|---|---|---|
| View Math Chapters 1–6 | ✅ YES | ❌ No | ❌ No | Bundled in `sampleLessons.ts` & IndexedDB |
| View EVS Chapters 1–3 | ✅ YES | ❌ No | ❌ No | Bundled in `sampleLessons.ts` & IndexedDB |
| Interactive Manipulatives (Abacus, Clock, etc.) | ✅ YES | ❌ No | ❌ No | Pure client-side React + Canvas |
| Smartboard Pen Drawing | ✅ YES | ❌ No | ❌ No | Pure client-side HTML5 Canvas |
| Sound Effects & Victory Fanfare | ✅ YES | ❌ No | ❌ No | Synthesized locally via Web Audio API |
| Multiple Choice Quizzes & Scoring | ✅ YES | ❌ No | ❌ No | Client-side state in `QuizActivity.tsx` |
| Bilingual Malayalam/English Toggle | ✅ YES | ❌ No | ❌ No | Client-side `LanguageContext.tsx` |
| Upload New Textbook PDF & OCR | ❌ No | ✅ YES (FastAPI) | ❌ No | PyMuPDF & Tesseract run locally on laptop |
| AI Automatic Lesson Generation | ❌ No | ✅ YES (FastAPI) | ✅ YES (Gemini) | Needs Google GenAI cloud connection |

---

### 5. Inspecting IndexedDB in Your Browser DevTools

You can actually inspect the live database with your own eyes while using VAAYANA!

1. Open the application in Google Chrome or Microsoft Edge (`http://localhost:5173`).
2. Press `F12` (or Right-Click -> **Inspect**) to open Browser Developer Tools.
3. Click on the **Application** tab at the top.
4. In the left sidebar, expand **Storage** -> **IndexedDB** -> **vaayana_local_db** -> **lessons**.
5. You will see an interactive table showing every stored lesson, its ID, slides, vocabulary terms, and quiz questions! You can even edit or delete records manually right inside DevTools.

---

### Mentor's Checkpoint
You now understand both halves of VAAYANA's storage engine: backend SQLite with SHA-256 caching and client-side IndexedDB with automatic sample data seeding.

In **Module 08: End-to-End Feature Walkthroughs**, we will trace the exact code execution of 12 real features in the app!

