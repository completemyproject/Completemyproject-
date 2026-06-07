/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_EMAIL_API_URL?: string;
  readonly VITE_EMAIL_API_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_TEMPLATE_USER?: string;
  readonly VITE_EMAILJS_TEMPLATE_ADMIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
