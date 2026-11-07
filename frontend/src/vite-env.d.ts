/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, e.g. http://localhost:8001 (written by scripts/bootstrap.sh) */
  readonly VITE_API_BASE_URL?: string
  /** "1" serves data from src/api/fixtures.ts instead of the network */
  readonly VITE_USE_FIXTURES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
