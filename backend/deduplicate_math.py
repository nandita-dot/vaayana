import re
import sys

# Deduplicate sample_data.py
with open('backend/app/sample_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Parse python list
import importlib.util
spec = importlib.util.spec_from_file_location("sample_data", "backend/app/sample_data.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

seen_ids = set()
unique_lessons = []
for l in mod.SAMPLE_LESSONS:
    if l['id'] not in seen_ids:
        seen_ids.add(l['id'])
        unique_lessons.append(l)

import json
py_code = "# SCERT Class 4 Mathematics Curriculum Lessons\n\nSAMPLE_LESSONS = " + json.dumps(unique_lessons, indent=4, ensure_ascii=False) + "\n"

with open('backend/app/sample_data.py', 'w', encoding='utf-8') as f:
    f.write(py_code)

print(f"sample_data.py deduplicated to {len(unique_lessons)} unique lessons:")
for l in unique_lessons:
    print(" -", l['id'])

# Deduplicate mathLessons.ts
ts_code = "import { Lesson } from '../types';\n\nexport const SCERT_MATH_LESSONS: Lesson[] = " + json.dumps(unique_lessons, indent=2, ensure_ascii=False) + ";\n"

with open('frontend/src/data/mathLessons.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print(f"mathLessons.ts deduplicated to {len(unique_lessons)} unique lessons.")
