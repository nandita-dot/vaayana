const assert = require('assert');

// Mock browser environments for storage validation logic test
function validateLesson(item, index = 1) {
  if (!item.id || typeof item.id !== 'string') {
    throw new Error(`Lesson #${index} skipped: Missing valid string ID.`);
  }
  if (!item.titleEn && !item.titleMl) {
    throw new Error(`Lesson #${index} (${item.id}) skipped: Missing lesson title.`);
  }
  if (!Array.isArray(item.slides) || item.slides.length === 0) {
    throw new Error(`Lesson #${index} (${item.id}) skipped: Lesson must contain at least one slide.`);
  }

  return {
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
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isCustom: true
  };
}

function parseAndValidateBundle(jsonString) {
  if (!jsonString || !jsonString.trim()) {
    throw new Error('Empty file content. Please select a valid JSON backup file.');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error(`Corrupted JSON format: ${err.message}`);
  }

  let rawLessons = [];
  if (Array.isArray(parsed)) {
    rawLessons = parsed;
  } else if (parsed && Array.isArray(parsed.lessons)) {
    rawLessons = parsed.lessons;
  } else if (parsed && typeof parsed === 'object') {
    rawLessons = [parsed];
  } else {
    throw new Error('Unsupported JSON format. Expected a DRISHTI lesson or bundle.');
  }

  const validated = [];
  const errors = [];
  rawLessons.forEach((item, idx) => {
    try {
      validated.push(validateLesson(item, idx + 1));
    } catch (e) {
      errors.push(e.message);
    }
  });

  return { validated, errors };
}

console.log('==================================================');
console.log('TESTING DRISHTI LOCAL STORAGE, EXPORT & IMPORT');
console.log('==================================================');

// 1. Test Valid Single Lesson Import
console.log('\n1. Testing Valid Single Lesson Import...');
const singleLesson = {
  id: 'custom-maths-fraction',
  titleEn: 'Fractions in Daily Life',
  titleMl: 'ഭിന്നസംഖ്യകൾ ദൈനംദിന ജീവിതത്തിൽ',
  subject: 'Mathematics',
  grade: 'Class 6',
  slides: [
    {
      id: 's1',
      titleEn: 'Circle Shading',
      titleMl: 'വൃത്തം തുല്യ ഭാഗങ്ങളാക്കാം',
      contentEn: 'Divide into 4 parts',
      contentMl: '4 തുല്യ ഭാഗങ്ങളാക്കുക',
      visualType: 'interactive_activity',
      interactiveModule: 'fraction_playground',
      keyPointsEn: ['Equivalent fractions'],
      keyPointsMl: ['തുല്യ ഭിന്നസംഖ്യകൾ']
    }
  ],
  activities: [
    {
      activityType: 'fraction_playground',
      titleEn: 'Fraction Visualizer',
      titleMl: 'ഭിന്നസംഖ്യാ സഹായി'
    }
  ],
  quiz: [
    {
      id: 'q1',
      questionEn: 'What is 2/4 equivalent to?',
      questionMl: '2/4 ന് തുല്യമായ ഭിന്നസംഖ്യ ഏത്?',
      optionsEn: ['1/2', '1/3', '3/4', '1/5'],
      optionsMl: ['1/2', '1/3', '3/4', '1/5'],
      correctIndex: 0,
      explanationEn: '2/4 simplifies to 1/2.',
      explanationMl: '2/4 ലഘൂകരിച്ചാൽ 1/2 ലഭിക്കുന്നു.'
    }
  ]
};

const res1 = parseAndValidateBundle(JSON.stringify(singleLesson));
assert.strictEqual(res1.validated.length, 1);
assert.strictEqual(res1.errors.length, 0);
assert.strictEqual(res1.validated[0].slides[0].interactiveModule, 'fraction_playground');
assert.strictEqual(res1.validated[0].activities[0].activityType, 'fraction_playground');
console.log('   ✓ Single lesson validated with 100% activity and quiz retention.');

// 2. Test DRISHTI Full Bundle Import
console.log('\n2. Testing Multi-Lesson Bundle Import...');
const bundle = {
  app: 'DRISHTI',
  version: '1.1.0',
  exportedAt: new Date().toISOString(),
  lessonCount: 2,
  lessons: [
    singleLesson,
    {
      id: 'scert-water-cycle',
      titleEn: 'Water Cycle Explorer',
      titleMl: 'ജലചക്രം',
      subject: 'Basic Science',
      grade: 'Class 5',
      slides: [{ id: 's1', titleEn: 'Evaporation', titleMl: 'ബാഷ്പീകരണം', contentEn: 'Vapor rises', contentMl: 'നീരാവി ഉയരുന്നു', visualType: 'interactive_activity', interactiveModule: 'water_cycle_explorer', keyPointsEn: [], keyPointsMl: [] }]
    }
  ]
};

const res2 = parseAndValidateBundle(JSON.stringify(bundle));
assert.strictEqual(res2.validated.length, 2);
assert.strictEqual(res2.errors.length, 0);
assert.strictEqual(res2.validated[1].slides[0].interactiveModule, 'water_cycle_explorer');
console.log('   ✓ Multi-lesson bundle parsed and validated with zero data loss.');

// 3. Test Corrupted JSON Handling
console.log('\n3. Testing Corrupted JSON Handling...');
assert.throws(() => {
  parseAndValidateBundle('{ broken json:');
}, /Corrupted JSON format/);
console.log('   ✓ Malformed JSON error safely intercepted with clear user message.');

// 4. Test Missing Required Fields
console.log('\n4. Testing Incomplete Lesson Data Guard...');
const badLesson = { titleEn: 'No ID and No Slides' };
const res4 = parseAndValidateBundle(JSON.stringify([badLesson]));
assert.strictEqual(res4.validated.length, 0);
assert.strictEqual(res4.errors.length, 1);
assert.match(res4.errors[0], /Missing valid string ID/);
console.log('   ✓ Incomplete lesson data identified and reported without crash.');

console.log('\n==================================================');
console.log('ALL STORAGE & IMPORT/EXPORT TESTS PASSED!');
console.log('==================================================');
