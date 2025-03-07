declare const MEDIA_TYPES: readonly ["audio", "video", "file", "image"];
type MediaType = typeof MEDIA_TYPES[number];

export { MEDIA_TYPES, type MediaType };
