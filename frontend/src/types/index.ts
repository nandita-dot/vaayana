export type Language = 'en' | 'ml';

// Strictly Class 4 Kerala curriculum scope
export type Grade = 'Class 4';

// Strictly THREE subjects for Class 4 Malayalam medium
export type Subject = 
  | 'Mathematics'            // ഗണിതം
  | 'Environmental Studies'  // പരിസരപഠനം (EVS)
  | 'English';               // ഇംഗ്ലീഷ്

export type LessonApprovalStatus = 'draft' | 'approved';

export type EmphasisAnimationEffect = 
  | 'enormous' 
  | 'tiny' 
  | 'huge' 
  | 'fast' 
  | 'slow' 
  | 'up' 
  | 'down' 
  | 'hot' 
  | 'cold' 
  | 'bounce' 
  | 'none';

export type ConceptAnimationType = 
  | 'count_group' 
  | 'number_line' 
  | 'multiplication_array' 
  | 'fraction_partition' 
  | 'plant_growth' 
  | 'water_cycle' 
  | 'food_chain' 
  | 'bird_adaptation'
  | 'word_meaning' 
  | 'sentence_build' 
  | 'story_sequence' 
  | 'step_reveal' 
  | 'compare' 
  | 'none';

export interface EmphasisWord {
  word: string;
  effect: EmphasisAnimationEffect;
  meaningMl: string;
  exampleSentenceEn?: string;
  exampleSentenceMl?: string;
  iconName?: string;
}

export interface ConceptAnimationData {
  type: ConceptAnimationType;
  titleEn: string;
  titleMl: string;
  steps: Array<{
    stepNumber: number;
    labelEn: string;
    labelMl: string;
    descriptionEn: string;
    descriptionMl: string;
    value?: any;
  }>;
  interactiveData?: any;
}

export type SlideType = 
  | 'chapter_intro'
  | 'opening_question'
  | 'learning_objectives'
  | 'concept_intro'
  | 'definition'
  | 'visual_explanation'
  | 'step_process'
  | 'everyday_example'
  | 'emphasis_word'
  | 'interactive_activity'
  | 'recap'
  | 'quiz';

export interface VocabularyItem {
  id?: string;
  word: string;
  meaningEn: string;
  meaningMl: string;
  exampleEn: string;
  exampleMl: string;
  synonyms?: string[];
  suggestedVisual?: string;
  emphasisEffect?: EmphasisAnimationEffect;
}

export interface ConceptItem {
  id: string;
  titleEn: string;
  titleMl: string;
  explanationEn: string;
  explanationMl: string;
  realLifeExampleEn: string;
  realLifeExampleMl: string;
  suggestedVisual: string;
  sourcePage?: string;
  evidenceSnippet?: string;
}

export interface ActivityItem {
  id?: string;
  titleEn: string;
  titleMl: string;
  activityType: 
    | 'fraction_playground' 
    | 'multiplication_visualizer' 
    | 'bird_beak_matching' 
    | 'water_cycle_explorer' 
    | 'quiz' 
    | 'visual_explanation' 
    | 'emphasis_word' 
    | 'tap_reveal'
    | 'shape_explorer'
    | 'geoboard'
    | 'three_d_shapes'
    | 'tangram'
    | 'number_pattern'
    | 'toto_intro'
    | 'vehicle_matching'
    | 'abacus'
    | 'car_race'
    | 'number_names'
    | 'number_wheel'
    | 'roman_numerals'
    | 'interactive_clock'
    | 'number_pairs'
    | 'dwani_door'
    | 'ways_to_add'
    | 'girls_race'
    | 'water_leak'
    | 'calendar_math'
    | 'abacus_subtraction'
    | 'written_subtraction'
    | 'currency_explorer'
    | 'evs_states_classifier'
    | 'evs_liquid_shape'
    | 'evs_thermal_transitions'
    | 'evs_air_occupies_space'
    | 'evs_solar_system'
    | 'evs_rotation_revolution'
    | 'evs_moon_phases'
    | 'evs_moon_exploration'
    | 'educational_video'
    | 'evs_direction_compass'
    | 'evs_village_map'
    | 'evs_magnetic_compass'
    | 'evs_map_symbols'
    | 'evs_kerala_geography'
    | 'evs_backwaters_explorer';
  learningObjectiveEn?: string;
  learningObjectiveMl?: string;
  instructionEn?: string;
  instructionMl?: string;
  instructionsEn?: string;
  instructionsMl?: string;
  suggestedDurationMinutes?: number;
  items?: any[];
  activityModule?: string;
}

export interface ActivityPrompt {
  titleEn: string;
  titleMl: string;
  instructionEn: string;
  instructionMl: string;
  interactionType: 
    | 'tap_reveal' 
    | 'sort' 
    | 'identify' 
    | 'experiment' 
    | 'fraction_playground' 
    | 'multiplication_visualizer' 
    | 'bird_beak_matching' 
    | 'water_cycle_explorer' 
    | 'visual_explanation'
    | 'shape_explorer'
    | 'geoboard'
    | 'three_d_shapes'
    | 'tangram'
    | 'number_pattern'
    | 'toto_intro'
    | 'vehicle_matching'
    | 'abacus'
    | 'car_race'
    | 'number_names'
    | 'number_wheel'
    | 'roman_numerals'
    | 'interactive_clock'
    | 'number_pairs'
    | 'dwani_door'
    | 'ways_to_add'
    | 'girls_race'
    | 'water_leak'
    | 'calendar_math'
    | 'abacus_subtraction'
    | 'written_subtraction'
    | 'currency_explorer'
    | 'evs_states_classifier'
    | 'evs_liquid_shape'
    | 'evs_thermal_transitions'
    | 'evs_air_occupies_space'
    | 'evs_solar_system'
    | 'evs_rotation_revolution'
    | 'evs_moon_phases'
    | 'evs_moon_exploration'
    | 'educational_video'
    | 'evs_direction_compass'
    | 'evs_village_map'
    | 'evs_magnetic_compass'
    | 'evs_map_symbols'
    | 'evs_kerala_geography'
    | 'evs_backwaters_explorer';
  items: ActivityItem[];
  activityModule?: string;
}

export interface Slide {
  id: string;
  slideType?: SlideType;
  titleEn: string;
  titleMl: string;
  contentEn: string;
  contentMl: string;
  visualType: 'diagram' | 'illustration' | 'concept_map' | 'experiment' | 'interactive_card' | 'interactive_activity' | 'emphasis_animation' | 'interactive' | 'image' | 'text';
  visualDescriptionEn?: string;
  visualDescriptionMl?: string;
  imageUrl?: string;
  keyPointsEn?: string[];
  keyPointsMl?: string[];
  audioNarrationEn?: string;
  audioNarrationMl?: string;
  teacherNotesEn?: string;
  teacherNotesMl?: string;
  sourcePageRef?: string;
  evidenceSnippet?: string;
  emphasisWord?: EmphasisWord;
  conceptAnimation?: ConceptAnimationData;
  activity?: ActivityPrompt;
  activityType?: string;
  interactiveModule?: string;
  interactivePrompt?: any;
}

export interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'true_false' | 'fill_in_blank' | 'image_identify';
  questionEn: string;
  questionMl: string;
  optionsEn: string[];
  optionsMl: string[];
  correctIndex: number;
  explanationEn: string;
  explanationMl: string;
  sourcePageRef?: string;
}

export interface Lesson {
  id: string;
  chapterId?: string;
  titleEn: string;
  titleMl: string;
  subject: Subject;
  grade: Grade;
  chapter: string;
  languagePreference?: 'malayalam' | 'bilingual' | 'english';
  descriptionEn: string;
  descriptionMl: string;
  learningObjectivesEn: string[];
  learningObjectivesMl: string[];
  concepts: ConceptItem[];
  vocabulary: VocabularyItem[];
  durationMinutes: number;
  slides: Slide[];
  activities: ActivityItem[];
  quiz: QuizQuestion[];
  tags: string[];
  sourceFileHash?: string;
  sourceFileName?: string;
  sourceTextSnippet?: string;
  sourceAccuracyConfidence?: 'high' | 'medium' | 'insufficient_source';
  sourceWarnings?: string[];
  version: number;
  approvalStatus: LessonApprovalStatus;
  generatedBy?: 'gemini' | 'manual_scert' | 'template';
  createdAt?: string;
  updatedAt?: string;
  isCustom?: boolean;
}

export interface PageAudit {
  pageNumber: number;
  wordCount: number;
  charCount: number;
  hasSelectableText: boolean;
  hasImages?: boolean;
  imageCount?: number;
  extractionMethod?: 'digital_text' | 'ocr' | 'image_only' | 'unprocessable';
  ocrApplied: boolean;
  requiresVisualProcessing?: boolean;
  isUnreadable?: boolean;
  unreadableReason?: string;
  headings: string[];
  snippet: string;
  text?: string;
}

export interface DetectedChapter {
  chapterIndex: number;
  title: string;
  titleMl?: string;
  startPage: number;
  endPage: number;
  pageCount: number;
  snippet: string;
  estimatedWordCount: number;
}

export interface DocumentAudit {
  filename: string;
  totalPages: number;
  processedPages: number;
  pagesWithDigitalText?: number;
  pagesOcrProcessed?: number;
  pagesImageOnly?: number;
  pagesUnprocessable?: number;
  pagesWithText: number;
  pagesWithLittleOrNoText: number;
  pagesRequiringVisualProcessing?: number;
  imageOnlyPageNumbers?: number[];
  unprocessedPageNumbers?: number[];
  emptyOrScannedPageNumbers: number[];
  totalWordCount: number;
  totalImageCount?: number;
  hasSelectableText: boolean;
  malayalamCharCount: number;
  malayalamDetected: boolean;
  firstSnippet: string;
  lastSnippet: string;
  detectedChapters: DetectedChapter[];
}

export interface DiagnosticLog {
  modelName: string;
  pagesAnalyzed: number[];
  totalCharactersAnalyzed: number;
  chunksProcessed: number;
  conceptsIdentified: number;
  conceptsRetained: number;
  slidesGenerated: number;
  evidenceGrounded: boolean;
  warnings: string[];
}

export interface ExtractResult {
  success: boolean;
  pageCount: number;
  extractedText: string;
  languageDetected: string;
  previewSnippet: string;
  sourceFileHash?: string;
  fileName?: string;
  ocrAvailable?: boolean;
  engine?: string;
  documentAudit?: DocumentAudit;
  pages?: PageAudit[];
  detectedChapters?: DetectedChapter[];
  warning?: string;
  error?: string;
}

export interface GenerateLessonResponse {
  success: boolean;
  lesson?: Lesson | null;
  aiAvailable: boolean;
  modelUsed?: string | null;
  fromCache?: boolean;
  warnings?: string[];
  diagnosticLog?: DiagnosticLog;
  error?: string | null;
}

export interface RegenerateSectionResponse {
  success: boolean;
  section: string;
  data: any;
  aiAvailable: boolean;
  error?: string | null;
}

export interface AiStatusResponse {
  aiAvailable: boolean;
  model: string;
  provider: string;
}
