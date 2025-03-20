import {
  CheckSquare, // Single choice
  ToggleLeft, // Point based
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
  Code, ThumbsUp, // Likert scale
  FileText, // Open-ended
  Braces, // Code snippet
  PenTool,
  HandIcon
} from "lucide-react";

export const questionTypes = {
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
  "text-field": {
    value: "text-field",
    label: "Text Field",
    icon: AlignLeft,
    isHidden: true
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
  "drag-and-drop": {
    value: "drag-and-drop",
    label: "Drag and Drop",
    icon: HandIcon,
    isHidden: true
  },
  "likert-scale": {
    value: "likert-scale",
    label: "Likert Scale",
    icon: ThumbsUp,
    isHidden: true
  },
  "open-ended": {
    value: "open-ended",
    label: "Open Ended",
    icon: FileText,
    isHidden: true
  },
  "code-snippet": {
    value: "code-snippet",
    label: "Code Snippet",
    icon: Braces,
    isHidden: true
  },
  "math-formula": {
    value: "math-formula",
    label: "Math Formula",
    icon: SquarePi,
    isHidden: true
  },
  "drawing": {
    value: "drawing",
    label: "Drawing",
    icon: PenTool,
    isHidden: true
  },
  "code-editor": {
    value: "code-editor",
    label: "Code Editor",
    icon: Code,
    isHidden: true
  }
};