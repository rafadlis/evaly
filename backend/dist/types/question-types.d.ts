declare const QUESTION_TYPES: readonly ["multiple-choice", "yes-or-no", "point-based", "text-field", "file-upload", "fill-the-blank", "audio-response", "video-response", "dropdown", "matching-pairs", "slider-scale", "ranking", "hotspot", "drag-and-drop", "matrix", "likert-scale", "open-ended", "code-snippet", "math-formula", "drawing"];
type QuestionType = (typeof QUESTION_TYPES)[number];

export { QUESTION_TYPES, type QuestionType };
