/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_OPEN_METEO_FORECAST_URL: string;
  readonly VITE_OPEN_METEO_GEOCODING_URL: string;
  readonly VITE_DEFAULT_LOCATION_NAME: string;
  readonly VITE_DEFAULT_LATITUDE: string;
  readonly VITE_DEFAULT_LONGITUDE: string;
  readonly VITE_REFRESH_MINUTES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
