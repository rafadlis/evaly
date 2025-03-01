import {
    CheckSquare, // Single choice
    ToggleLeft, // Yes or No
    BarChart2, // Point based
    AlignLeft, // Text field
    Upload, // File upload
    TextCursor, // Fill the blank
    Mic, // Audio response
    Video, // Video response
    ChevronsDown, // Dropdown
    ListOrdered, // Ranking
    Sliders, // Slider scale
    Calendar, // Date picker
    Clock, // Time picker
    Image, // Image choice
    Combine, // Matching pairs
    Grid, // Matrix
    MousePointer, // Hotspot
    SquarePi, // Formula input
    Code, // Code editor
    CircleSlash
} from "lucide-react";

export type QuestionType = 
  | "single-choice"
  | "multiple-choice"
  | "yes-or-no"
  | "point-based"
  | "text-field"
  | "file-upload"
  | "fill-the-blank"
  | "audio-response"
  | "video-response"
  | "dropdown"
  | "ranking"
  | "slider-scale"
  | "date-picker"
  | "time-picker"
  | "image-choice"
  | "matching-pairs"
  | "matrix"
  | "hotspot"
  | "formula-input"
  | "code-editor";

export const questionTypes = {
  "single-choice": {
    value: "single-choice",
    label: "Single Choice",
    icon: CircleSlash,
    isHidden: false
  },
  "multiple-choice": {
    value: "multiple-choice",
    label: "Multiple Choice",
    icon: CheckSquare,
    isHidden: false
  },
  "yes-or-no": {
    value: "yes-or-no",
    label: "Yes or No",
    icon: ToggleLeft,
    isHidden: false
  },
  "point-based": {
    value: "point-based",
    label: "Point Based",
    icon: BarChart2,
    isHidden: false
  },
  "text-field": {
    value: "text-field",
    label: "Text Field",
    icon: AlignLeft,
    isHidden: false
  },
  "file-upload": {
    value: "file-upload",
    label: "File Upload",
    icon: Upload,
    isHidden: true
  },
  "fill-the-blank": {
    value: "fill-the-blank",
    label: "Fill the Blank",
    icon: TextCursor,
    isHidden: true
  },
  "audio-response": {
    value: "audio-response",
    label: "Audio Response",
    icon: Mic,
    isHidden: true
  },
  "video-response": {
    value: "video-response",
    label: "Video Response",
    icon: Video,
    isHidden: true
  },
  "dropdown": {
    value: "dropdown",
    label: "Dropdown",
    icon: ChevronsDown,
    isHidden: true
  },
  "ranking": {
    value: "ranking",
    label: "Ranking",
    icon: ListOrdered,
    isHidden: true
  },
  "slider-scale": {
    value: "slider-scale",
    label: "Slider Scale",
    icon: Sliders,
    isHidden: true
  },
  "date-picker": {
    value: "date-picker",
    label: "Date Picker",
    icon: Calendar,
    isHidden: true
  },
  "time-picker": {
    value: "time-picker",
    label: "Time Picker",
    icon: Clock,
    isHidden: true
  },
  "image-choice": {
    value: "image-choice",
    label: "Image Choice",
    icon: Image,
    isHidden: true
  },
  "matching-pairs": {
    value: "matching-pairs",
    label: "Matching Pairs",
    icon: Combine,
    isHidden: true
  },
  "matrix": {
    value: "matrix",
    label: "Matrix",
    icon: Grid,
    isHidden: true
  },
  "hotspot": {
    value: "hotspot",
    label: "Hotspot",
    icon: MousePointer,
    isHidden: true
  },
  "formula-input": {
    value: "formula-input",
    label: "Formula Input",
    icon: SquarePi,
    isHidden: true
  },
  "code-editor": {
    value: "code-editor",
    label: "Code Editor",
    icon: Code,
    isHidden: true
  }
};