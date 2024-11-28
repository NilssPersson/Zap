interface ConfigData {
    BASE_URL: string;
    LOAD_PATH_i18?: string;
    ROUTER_BASE_NAME?: string;
  }
  
  const config: ConfigData = {
    BASE_URL: "/",
    LOAD_PATH_i18: "/locales/{{lng}}/{{ns}}.json",
  };
  
  export const viteMode = import.meta.env.VITE_ENVIRONMENT;
  if (viteMode === "dev") {
    config.LOAD_PATH_i18 = "/locales/{{lng}}/{{ns}}.json";
    config.ROUTER_BASE_NAME = "";
  } else {
    config.LOAD_PATH_i18 = "/game-shack-iota.vercel.app/locales/{{lng}}/{{ns}}.json";
    config.ROUTER_BASE_NAME = "/game-shack-iota.vercel.app/index.html";
  }
  
  export default config;