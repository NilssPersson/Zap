/**
 * Configuration interface defining all application-wide settings
 */
interface ConfigData {
  /** Base URL for the application (e.g., "/" or "/app") */
  BASE_URL: string;
  /** Path pattern for loading i18n translation files */
  LOAD_PATH_i18: string;
  /** Base name for the router (useful for subdirectory deployments) */
  ROUTER_BASE_NAME: string;
  /** Full URI of the application (e.g., "http://localhost:5173") */
  URI: string;
  /** Current environment ("dev" or "prod") */
  ENVIRONMENT: string;
  /** Whether the app is running in production mode */
  IS_PRODUCTION: boolean;
  /** Port number for the development server */
  PORT: number;
  /** Firebase configuration settings */
  FIREBASE: {
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    APP_ID: string;
    DATABASE_URL: string;
    MEASUREMENT_ID: string;
  };
  /** Kinde authentication settings */
  KINDE: {
    CLIENT_ID: string;
    DOMAIN: string;
    REDIRECT_URI: string;
    LOGOUT_URI: string;
  }
}

/**
 * Normalizes environment strings to either "prod" or "dev"
 * Accepts variations like "PROD", "PRODUCTION", "prod", "production", "DEV", "DEVELOPMENT", etc.
 */
const normalizeEnvironment = (env: string | undefined): "prod" | "dev" => {
  if (!env) return "dev";
  
  const normalized = env.toLowerCase();
  if (normalized.startsWith("prod")) return "prod";
  if (normalized.startsWith("dev")) return "dev";
  return "dev"; // Default to dev for any other value
};

/**
 * Gets the appropriate URI based on environment and configuration
 */
const getURI = (env: string | undefined, configuredURI: string | undefined): string => {
  const environment = normalizeEnvironment(env);
  
  if (environment === "dev") {
    return "http://localhost:5173";
  }
  
  return configuredURI || "https://www.zap-quiz.com/";
};

// Get base URI first to avoid circular dependency
const baseURI = getURI(import.meta.env.VITE_ENVIRONMENT, import.meta.env.VITE_URI);

/**
 * Application configuration object
 * All values can be overridden using environment variables prefixed with VITE_
 */
const config: ConfigData = {
  // Core application settings
  BASE_URL: import.meta.env.VITE_BASE_URL || "/",
  LOAD_PATH_i18: import.meta.env.VITE_LOAD_PATH_i18 || "/locales/{{lng}}/{{ns}}.json",
  ROUTER_BASE_NAME: import.meta.env.VITE_ROUTER_BASE_NAME || "",
  URI: baseURI,
  
  // Environment settings
  ENVIRONMENT: normalizeEnvironment(import.meta.env.VITE_ENVIRONMENT),
  IS_PRODUCTION: normalizeEnvironment(import.meta.env.VITE_ENVIRONMENT) === "prod",
  PORT: parseInt(import.meta.env.VITE_PORT || "5173"),
  
  // Firebase configuration
  FIREBASE: {
    API_KEY: import.meta.env.VITE_FIREBASE_APIKEY || "",
    AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTHDOMAIN || "",
    PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECTID || "",
    STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGEBUCKET || "",
    MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID || "",
    APP_ID: import.meta.env.VITE_FIREBASE_APPID || "",
    DATABASE_URL: import.meta.env.VITE_FIREBASE_DATABASEURL || "",
    MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENTID || "",
  },

  // Kinde authentication configuration
  KINDE: {
    CLIENT_ID: import.meta.env.VITE_KINDE_CLIENT_ID || "7b50afa95aec4cba88bad0abb4b94dfa",
    DOMAIN: import.meta.env.VITE_KINDE_DOMAIN || "https://gameshack.kinde.com",
    REDIRECT_URI: import.meta.env.VITE_KINDE_REDIRECT_URI || baseURI,
    LOGOUT_URI: import.meta.env.VITE_KINDE_LOGOUT_URI || baseURI,
  }
};

export default config;
