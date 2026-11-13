from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

# Strict Grade & Subject scope for Vaayana Class 4 Kerala Malayalam-Medium
GradeType = Literal["Class 4"]
SubjectType = Literal["Mathematics", "Environmental Studies", "English"]

EmphasisEffect = Literal[
    "enormous", 
    "tiny", 
    "huge", 
    "fast", 
    "slow", 
    "up", 
    "down", 
    "hot", 
    "cold", 
    "bounce", 
    "none"
]

ConceptAnimationType = Literal[
    "count_group", 
    "number_line", 
    "multiplication_array", 
    "fraction_partition", 
    "plant_growth", 
    "water_cycle", 
    "food_chain", 
    "bird_adaptation",
    "word_meaning", 
    "sentence_build", 
    "story_sequence", 
    "step_reveal", 
    "compare", 
    "none"
]

class EmphasisWord(BaseModel):
    word: str
    effect: EmphasisEffect = "enormous"
    meaningMl: str
    exampleSentenceEn: Optional[str] = ""
    exampleSentenceMl: Optional[str] = ""
    iconName: Optional[str] = ""

class ConceptAnimationStep(BaseModel):
    stepNumber: int
    labelEn: str
    labelMl: str
    descriptionEn: str
    descriptionMl: str
    value: Optional[Any] = None

class ConceptAnimationData(BaseModel):
    type: ConceptAnimationType = "none"
    titleEn: str
    titleMl: str
    steps: List[ConceptAnimationStep] = Field(default_factory=list)
    interactiveData: Optional[Dict[str, Any]] = None

class VocabularyItem(BaseModel):
    id: Optional[str] = None
    word: str
    meaningEn: str
    meaningMl: str
    exampleEn: str
    exampleMl: str
    synonyms: List[str] = Field(default_factory=list)
    suggestedVisual: Optional[str] = ""
    emphasisEffect: Optional[EmphasisEffect] = "none"

class ConceptItem(BaseModel):
    id: str
    titleEn: str
    titleMl: str
    explanationEn: str
    explanationMl: str
    realLifeExampleEn: str
    realLifeExampleMl: str
    suggestedVisual: str
    sourcePage: Optional[str] = ""
    evidenceSnippet: Optional[str] = ""

class ActivityPrompt(BaseModel):
    titleEn: str
    titleMl: str
    instructionEn: str
    instructionMl: str
    interactionType: Literal[
        "tap_reveal", 
        "sort", 
        "identify", 
        "experiment", 
        "fraction_playground", 
        "multiplication_visualizer", 
        "bird_beak_matching", 
        "water_cycle_explorer",
        "visual_explanation",
        "shape_explorer",
        "geoboard",
        "three_d_shapes",
        "tangram",
        "number_pattern",
        "toto_intro",
        "vehicle_matching",
        "abacus",
        "car_race",
        "number_names",
        "number_wheel",
        "roman_numerals",
        "interactive_clock",
        "number_pairs",
        "dwani_door",
        "ways_to_add"
    ] = "tap_reveal"
    items: List[dict] = Field(default_factory=list)
    activityModule: Optional[str] = None

class ActivityItem(BaseModel):
    id: Optional[str] = None
    titleEn: str
    titleMl: str
    activityType: Literal[
        "fraction_playground", 
        "multiplication_visualizer", 
        "bird_beak_matching", 
        "water_cycle_explorer", 
        "quiz", 
        "visual_explanation", 
        "emphasis_word",
        "tap_reveal",
        "shape_explorer",
        "geoboard",
        "three_d_shapes",
        "tangram",
        "number_pattern",
        "toto_intro",
        "vehicle_matching",
        "abacus",
        "car_race",
        "number_names",
        "number_wheel",
        "roman_numerals",
        "interactive_clock",
        "number_pairs",
        "dwani_door",
        "ways_to_add"
    ]
    learningObjectiveEn: str
    learningObjectiveMl: str
    instructionEn: str
    instructionMl: str
    items: List[dict] = Field(default_factory=list)
    activityModule: Optional[str] = None

class Slide(BaseModel):
    id: str
    slideType: Optional[Literal[
        "chapter_intro",
        "opening_question",
        "learning_objectives",
        "concept_intro",
        "definition",
        "visual_explanation",
        "step_process",
        "everyday_example",
        "emphasis_word",
        "interactive_activity",
        "recap",
        "quiz"
    ]] = "concept_intro"
    titleEn: str
    titleMl: str
    contentEn: str
    contentMl: str
    visualType: Literal[
        "diagram", 
        "illustration", 
        "concept_map", 
        "experiment", 
        "interactive_card", 
        "interactive_activity",
        "emphasis_animation"
    ] = "interactive_card"
    visualDescriptionEn: Optional[str] = ""
    visualDescriptionMl: Optional[str] = ""
    keyPointsEn: List[str] = Field(default_factory=list)
    keyPointsMl: List[str] = Field(default_factory=list)
    audioNarrationEn: Optional[str] = ""
    audioNarrationMl: Optional[str] = ""
    teacherNotesEn: Optional[str] = ""
    teacherNotesMl: Optional[str] = ""
    sourcePageRef: Optional[str] = ""
    evidenceSnippet: Optional[str] = ""
    emphasisWord: Optional[EmphasisWord] = None
    conceptAnimation: Optional[ConceptAnimationData] = None
    activity: Optional[ActivityPrompt] = None
    interactiveModule: Optional[str] = None

class QuizQuestion(BaseModel):
    id: str
    type: Literal["multiple_choice", "true_false", "fill_in_blank", "image_identify"] = "multiple_choice"
    questionEn: str
    questionMl: str
    optionsEn: List[str]
    optionsMl: List[str]
    correctIndex: int
    explanationEn: str
    explanationMl: str
    sourcePageRef: Optional[str] = ""

class Lesson(BaseModel):
    id: str
    chapterId: Optional[str] = None
    titleEn: str
    titleMl: str
    subject: SubjectType = "Environmental Studies"
    grade: GradeType = "Class 4"
    chapter: str
    languagePreference: Optional[str] = "malayalam"
    descriptionEn: str
    descriptionMl: str
    learningObjectivesEn: List[str] = Field(default_factory=list)
    learningObjectivesMl: List[str] = Field(default_factory=list)
    concepts: List[ConceptItem] = Field(default_factory=list)
    vocabulary: List[VocabularyItem] = Field(default_factory=list)
    durationMinutes: int = 25
    slides: List[Slide] = Field(default_factory=list)
    activities: List[ActivityItem] = Field(default_factory=list)
    quiz: List[QuizQuestion] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    sourceFileHash: Optional[str] = ""
    sourceFileName: Optional[str] = ""
    sourceTextSnippet: Optional[str] = ""
    sourceAccuracyConfidence: Literal["high", "medium", "insufficient_source"] = "high"
    sourceWarnings: List[str] = Field(default_factory=list)
    version: int = 1
    approvalStatus: Literal["draft", "approved"] = "draft"
    generatedBy: Literal["gemini", "manual_scert", "template"] = "gemini"
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    isCustom: Optional[bool] = False

class PageAudit(BaseModel):
    pageNumber: int
    wordCount: int
    charCount: int
    hasSelectableText: bool
    hasImages: bool = False
    imageCount: int = 0
    extractionMethod: Literal["digital_text", "ocr", "image_only", "unprocessable"] = "digital_text"
    ocrApplied: bool = False
    requiresVisualProcessing: bool = False
    isUnreadable: bool = False
    unreadableReason: Optional[str] = None
    headings: List[str] = Field(default_factory=list)
    snippet: str = ""
    text: Optional[str] = ""

class DetectedChapter(BaseModel):
    chapterIndex: int
    title: str
    titleMl: Optional[str] = ""
    startPage: int
    endPage: int
    pageCount: int
    snippet: str = ""
    estimatedWordCount: int = 0

class DocumentAudit(BaseModel):
    filename: str
    totalPages: int
    processedPages: int
    # Mutually exclusive partition satisfying totalPages == pagesWithDigitalText + pagesOcrProcessed + pagesImageOnly + pagesUnprocessable
    pagesWithDigitalText: int = 0
    pagesOcrProcessed: int = 0
    pagesImageOnly: int = 0
    pagesUnprocessable: int = 0
    pagesWithText: int = 0
    pagesWithLittleOrNoText: int = 0
    pagesRequiringVisualProcessing: int = 0
    imageOnlyPageNumbers: List[int] = Field(default_factory=list)
    unprocessedPageNumbers: List[int] = Field(default_factory=list)
    emptyOrScannedPageNumbers: List[int] = Field(default_factory=list)
    totalWordCount: int = 0
    totalImageCount: int = 0
    hasSelectableText: bool = False
    malayalamCharCount: int = 0
    malayalamDetected: bool = False
    firstSnippet: str = ""
    lastSnippet: str = ""
    detectedChapters: List[DetectedChapter] = Field(default_factory=list)

class DiagnosticLog(BaseModel):
    modelName: str
    pagesAnalyzed: List[int] = Field(default_factory=list)
    totalCharactersAnalyzed: int = 0
    chunksProcessed: int = 0
    conceptsIdentified: int = 0
    conceptsRetained: int = 0
    slidesGenerated: int = 0
    evidenceGrounded: bool = True
    warnings: List[str] = Field(default_factory=list)

class ExtractPdfResponse(BaseModel):
    success: bool
    pageCount: int
    extractedText: str
    languageDetected: str
    previewSnippet: str
    sourceFileHash: Optional[str] = ""
    fileName: Optional[str] = ""
    engine: Optional[str] = "PyMuPDF"
    ocrAvailable: Optional[bool] = False
    documentAudit: Optional[DocumentAudit] = None
    pages: List[PageAudit] = Field(default_factory=list)
    detectedChapters: List[DetectedChapter] = Field(default_factory=list)
    warning: Optional[str] = None
    error: Optional[str] = None

class ExtractImageResponse(BaseModel):
    success: bool
    extractedText: str
    languageDetected: str
    previewSnippet: str
    sourceFileHash: Optional[str] = ""
    fileName: Optional[str] = ""
    ocrAvailable: bool
    metadata: Dict[str, Any] = Field(default_factory=dict)
    warning: Optional[str] = None
    error: Optional[str] = None

class GenerateLessonRequest(BaseModel):
    rawText: str = ""
    subject: SubjectType
    grade: GradeType = "Class 4"
    chapterTitle: str
    sourceFileHash: Optional[str] = ""
    sourceFileName: Optional[str] = ""
    languagePreference: Literal["malayalam", "bilingual", "english"] = "malayalam"
    startPage: Optional[int] = None
    endPage: Optional[int] = None
    selectedChapterTitle: Optional[str] = None
    forceRegenerate: Optional[bool] = False

class GenerateLessonResponse(BaseModel):
    success: bool
    lesson: Optional[Lesson] = None
    aiAvailable: bool
    modelUsed: Optional[str] = None
    fromCache: bool = False
    warnings: List[str] = Field(default_factory=list)
    diagnosticLog: Optional[DiagnosticLog] = None
    error: Optional[str] = None

class RegenerateSectionRequest(BaseModel):
    section: Literal["concepts", "vocabulary", "activities", "quiz", "single_slide"]
    rawText: str
    subject: SubjectType
    grade: GradeType = "Class 4"
    chapterTitle: str
    slideIndex: Optional[int] = None
    currentSlideContent: Optional[Dict[str, Any]] = None

class RegenerateSectionResponse(BaseModel):
    success: bool
    section: str
    data: Any
    aiAvailable: bool
    error: Optional[str] = None

class LessonApprovalRequest(BaseModel):
    lesson: Lesson
    approvalStatus: Literal["draft", "approved"] = "approved"

class LessonApprovalResponse(BaseModel):
    success: bool
    lessonId: str
    version: int
    approvalStatus: str
    message: str
