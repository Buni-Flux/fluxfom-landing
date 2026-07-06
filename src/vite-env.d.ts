/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VISUAL_CAPTURE_URL?: string;
  readonly VITE_VISUAL_CAPTURE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
