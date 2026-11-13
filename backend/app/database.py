import os
import json
import sqlite3
import hashlib
import logging
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
DB_PATH = os.path.join(DB_DIR, "vaayana.db")

def compute_sha256(data: bytes) -> str:
    """Computes SHA-256 hash of uploaded file content."""
    hasher = hashlib.sha256()
    hasher.update(data)
    return hasher.hexdigest()

def compute_lesson_cache_key(
    file_hash: str, 
    start_page: Optional[int] = None, 
    end_page: Optional[int] = None, 
    chapter_title: str = ""
) -> str:
    """
    Computes a scoped cache key representing the exact file, selected page range, and chapter.
    Prevents cache collisions across different chapters of a long textbook.
    """
    if not file_hash:
        return ""
    clean_title = (chapter_title or "").strip().lower()
    sp = str(start_page) if start_page is not None else "1"
    ep = str(end_page) if end_page is not None else "all"
    raw_key = f"{file_hash}::P{sp}-P{ep}::{clean_title}"
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

def get_connection() -> sqlite3.Connection:
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes SQLite schema for Vaayana chapters, lessons, and generation cache."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        grade TEXT NOT NULL DEFAULT 'Class 4',
        subject TEXT NOT NULL,
        original_filename TEXT,
        file_hash TEXT UNIQUE,
        extracted_text TEXT,
        extraction_metadata TEXT,
        created_at TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lesson_versions (
        id TEXT PRIMARY KEY,
        chapter_id TEXT,
        cache_key TEXT,
        start_page INTEGER,
        end_page INTEGER,
        version INTEGER NOT NULL DEFAULT 1,
        approval_status TEXT NOT NULL DEFAULT 'draft',
        lesson_data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(chapter_id) REFERENCES chapters(id)
    )
    """)

    # Try adding columns if table was created in earlier schema
    for col, col_type in [("cache_key", "TEXT"), ("start_page", "INTEGER"), ("end_page", "INTEGER")]:
        try:
            cursor.execute(f"ALTER TABLE lesson_versions ADD COLUMN {col} {col_type}")
        except Exception:
            pass

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS generation_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id TEXT,
        file_hash TEXT,
        cache_key TEXT,
        gemini_model TEXT,
        generation_status TEXT,
        generation_date TEXT
    )
    """)

    try:
        cursor.execute("ALTER TABLE generation_metadata ADD COLUMN cache_key TEXT")
    except Exception:
        pass

    conn.commit()
    conn.close()
    logger.info("Vaayana SQLite database initialized at %s", DB_PATH)

def get_chapter_by_hash(file_hash: str) -> Optional[Dict[str, Any]]:
    """Checks if a chapter with the identical file hash was already uploaded."""
    if not file_hash:
        return None
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chapters WHERE file_hash = ?", (file_hash,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def save_chapter(
    chapter_id: str,
    title: str,
    grade: str,
    subject: str,
    filename: str,
    file_hash: str,
    extracted_text: str,
    metadata: Dict[str, Any]
) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
    INSERT OR REPLACE INTO chapters 
    (id, title, grade, subject, original_filename, file_hash, extracted_text, extraction_metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        chapter_id,
        title,
        grade,
        subject,
        filename,
        file_hash,
        extracted_text,
        json.dumps(metadata),
        now
    ))
    conn.commit()
    conn.close()
    return chapter_id

def get_cached_lesson_by_key(
    cache_key: str, 
    require_approved: bool = False
) -> Optional[Dict[str, Any]]:
    """
    Returns an existing lesson matching the exact scoped cache key.
    If require_approved is True, returns only approved lessons.
    """
    if not cache_key:
        return None
    conn = get_connection()
    cursor = conn.cursor()
    
    if require_approved:
        cursor.execute("""
        SELECT lv.lesson_data, lv.approval_status, lv.version, lv.cache_key
        FROM lesson_versions lv
        WHERE lv.cache_key = ? AND lv.approval_status = 'approved'
        ORDER BY lv.version DESC
        LIMIT 1
        """, (cache_key,))
    else:
        cursor.execute("""
        SELECT lv.lesson_data, lv.approval_status, lv.version, lv.cache_key
        FROM lesson_versions lv
        WHERE lv.cache_key = ?
        ORDER BY CASE WHEN lv.approval_status = 'approved' THEN 1 ELSE 2 END, lv.version DESC
        LIMIT 1
        """, (cache_key,))

    row = cursor.fetchone()
    conn.close()

    if row and row["lesson_data"]:
        try:
            lesson_dict = json.loads(row["lesson_data"])
            lesson_dict["version"] = row["version"]
            lesson_dict["approvalStatus"] = row["approval_status"]
            return lesson_dict
        except Exception as e:
            logger.error("Error deserializing cached lesson: %s", e)
    return None

def get_cached_lesson_by_hash(file_hash: str) -> Optional[Dict[str, Any]]:
    """Legacy compatibility: returns an approved lesson for file_hash if present."""
    if not file_hash:
        return None
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT lv.lesson_data, lv.approval_status, lv.version
    FROM lesson_versions lv
    JOIN chapters c ON lv.chapter_id = c.id
    WHERE c.file_hash = ? AND lv.approval_status = 'approved'
    ORDER BY lv.version DESC
    LIMIT 1
    """, (file_hash,))
    row = cursor.fetchone()
    conn.close()

    if row and row["lesson_data"]:
        try:
            lesson_dict = json.loads(row["lesson_data"])
            lesson_dict["version"] = row["version"]
            lesson_dict["approvalStatus"] = row["approval_status"]
            return lesson_dict
        except Exception as e:
            logger.error("Error deserializing cached lesson: %s", e)
    return None

def save_lesson_record(
    lesson_dict: Dict[str, Any], 
    approval_status: str = "draft",
    cache_key: Optional[str] = None,
    start_page: Optional[int] = None,
    end_page: Optional[int] = None
) -> Tuple[str, int]:
    """
    Saves a lesson version to SQLite. Increments version if an existing lesson is modified.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    lesson_id = lesson_dict.get("id")
    chapter_id = lesson_dict.get("chapterId") or lesson_id
    now = datetime.utcnow().isoformat()

    file_hash = lesson_dict.get("sourceFileHash", "")
    if not cache_key and file_hash:
        cache_key = compute_lesson_cache_key(
            file_hash=file_hash,
            start_page=start_page,
            end_page=end_page,
            chapter_title=lesson_dict.get("chapter") or lesson_dict.get("titleEn", "")
        )

    # Determine next version
    cursor.execute("SELECT MAX(version) FROM lesson_versions WHERE chapter_id = ?", (chapter_id,))
    max_ver = cursor.fetchone()[0]
    next_ver = (max_ver or 0) + 1 if max_ver is not None else 1

    lesson_dict["version"] = next_ver
    lesson_dict["approvalStatus"] = approval_status
    lesson_dict["updatedAt"] = now

    version_id = f"{chapter_id}-v{next_ver}"

    cursor.execute("""
    INSERT OR REPLACE INTO lesson_versions
    (id, chapter_id, cache_key, start_page, end_page, version, approval_status, lesson_data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        version_id,
        chapter_id,
        cache_key,
        start_page,
        end_page,
        next_ver,
        approval_status,
        json.dumps(lesson_dict, ensure_ascii=False),
        lesson_dict.get("createdAt") or now,
        now
    ))

    # Log generation metadata
    cursor.execute("""
    INSERT INTO generation_metadata
    (chapter_id, file_hash, cache_key, gemini_model, generation_status, generation_date)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        chapter_id,
        file_hash,
        cache_key,
        lesson_dict.get("generatedBy", "template"),
        approval_status,
        now
    ))

    conn.commit()
    conn.close()
    return version_id, next_ver

def get_all_db_lessons() -> List[Dict[str, Any]]:
    """Retrieves all latest approved or draft lessons from SQLite."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT lv.lesson_data 
    FROM lesson_versions lv
    INNER JOIN (
        SELECT chapter_id, MAX(version) as max_v 
        FROM lesson_versions 
        GROUP BY chapter_id
    ) latest ON lv.chapter_id = latest.chapter_id AND lv.version = latest.max_v
    ORDER BY lv.updated_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    lessons = []
    for r in rows:
        try:
            lessons.append(json.loads(r["lesson_data"]))
        except Exception as e:
            logger.error("Failed to parse DB lesson: %s", e)
    return lessons

def get_db_lesson_by_id(lesson_id: str, require_approved: bool = False) -> Optional[Dict[str, Any]]:
    """
    Retrieves a lesson from SQLite matching id, version_id, chapter_id, or internal JSON id.
    If require_approved is True, prioritizes or restricts to approved versions.
    """
    if not lesson_id:
        return None
    conn = get_connection()
    cursor = conn.cursor()

    if require_approved:
        cursor.execute("""
        SELECT lesson_data, approval_status, version 
        FROM lesson_versions 
        WHERE (id = ? OR chapter_id = ? OR json_extract(lesson_data, '$.id') = ?)
          AND approval_status = 'approved'
        ORDER BY version DESC 
        LIMIT 1
        """, (lesson_id, lesson_id, lesson_id))
    else:
        cursor.execute("""
        SELECT lesson_data, approval_status, version 
        FROM lesson_versions 
        WHERE id = ? OR chapter_id = ? OR json_extract(lesson_data, '$.id') = ?
        ORDER BY (id = ?) DESC, version DESC 
        LIMIT 1
        """, (lesson_id, lesson_id, lesson_id, lesson_id))

    row = cursor.fetchone()
    conn.close()

    if row and row["lesson_data"]:
        try:
            lesson_dict = json.loads(row["lesson_data"])
            lesson_dict["version"] = row["version"]
            lesson_dict["approvalStatus"] = row["approval_status"]
            return lesson_dict
        except Exception as e:
            logger.error("Failed to parse DB lesson: %s", e)
    return None

def delete_db_lesson(lesson_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM lesson_versions WHERE chapter_id = ? OR id = ?", (lesson_id, lesson_id))
    cursor.execute("DELETE FROM chapters WHERE id = ?", (lesson_id,))
    conn.commit()
    conn.close()
    return True
