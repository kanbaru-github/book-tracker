/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_BOOKS_USER_ID: number;
  readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
