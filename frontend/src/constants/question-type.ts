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
    group: "Choice",
    isHidden: false
  },
  "yes-or-no": {
    value: "yes-or-no",
    label: "Yes or No",
    icon: ToggleLeft,
    group: "Choice",
    isHidden: false
  },
  "text-field": {
    value: "text-field",
    label: "Text Field",
    icon: AlignLeft,
    group: "Input",
    isHidden: true
  },
  "file-upload": {
    value: "file-upload",
    label: "File Upload",
    icon: Upload,
    group: "Input",
    isHidden: true
  },
  "fill-the-blank": {
    value: "fill-the-blank",
    label: "Fill the Blank",
    icon: TextCursor,
    group: "Input",
    isHidden: true
  },
  "audio-response": {
    value: "audio-response",
    label: "Audio Response",
    icon: Mic,
    group: "Input",
    isHidden: true
  },
  "video-response": {
    value: "video-response",
    label: "Video Response",
    icon: Video,
    group: "Input",
    isHidden: true
  },
  "dropdown": {
    value: "dropdown",
    label: "Dropdown",
    icon: ChevronsDown,
    group: "Choice",
    isHidden: true
  },
  "ranking": {
    value: "ranking",
    label: "Ranking",
    icon: ListOrdered,
    group: "Scale & Structure",
    isHidden: true
  },
  "slider-scale": {
    value: "slider-scale",
    label: "Slider Scale",
    icon: Sliders,
    group: "Scale & Structure",
    isHidden: true
  },
  "date-picker": {
    value: "date-picker",
    label: "Date Picker",
    icon: Calendar,
    group: "Scale & Structure",
    isHidden: true
  },
  "time-picker": {
    value: "time-picker",
    label: "Time Picker",
    icon: Clock,
    group: "Scale & Structure",
    isHidden: true
  },
  "image-choice": {
    value: "image-choice",
    label: "Image Choice",
    icon: Image,
    group: "Choice",
    isHidden: true
  },
  "matching-pairs": {
    value: "matching-pairs",
    label: "Matching Pairs",
    icon: Combine,
    group: "Scale & Structure",
    isHidden: true
  },
  "matrix": {
    value: "matrix",
    label: "Matrix",
    icon: Grid,
    group: "Scale & Structure",
    isHidden: true
  },
  "hotspot": {
    value: "hotspot",
    label: "Hotspot",
    icon: MousePointer,
    group: "Advanced",
    isHidden: true
  },
  "formula-input": {
    value: "formula-input",
    label: "Formula Input",
    icon: SquarePi,
    group: "Advanced",
    isHidden: true
  },
  "drag-and-drop": {
    value: "drag-and-drop",
    label: "Drag and Drop",
    icon: HandIcon,
    group: "Advanced",
    isHidden: true
  },
  "likert-scale": {
    value: "likert-scale",
    label: "Likert Scale",
    icon: ThumbsUp,
    group: "Scale & Structure",
    isHidden: true
  },
  "open-ended": {
    value: "open-ended",
    label: "Open Ended",
    icon: FileText,
    group: "Input",
    isHidden: true
  },
  "code-snippet": {
    value: "code-snippet",
    label: "Code Snippet",
    icon: Braces,
    group: "Advanced",
    isHidden: true
  },
  "math-formula": {
    value: "math-formula",
    label: "Math Formula",
    icon: SquarePi,
    group: "Advanced",
    isHidden: true
  },
  "drawing": {
    value: "drawing",
    label: "Drawing",
    icon: PenTool,
    group: "Advanced",
    isHidden: true
  },
  "code-editor": {
    value: "code-editor",
    label: "Code Editor",
    icon: Code,
    group: "Advanced",
    isHidden: true
  }
};