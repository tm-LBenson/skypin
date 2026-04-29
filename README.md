# SkyPin

SkyPin is a small always-on-top desktop weather widget built with Tauri, React, TypeScript, and Open-Meteo.

It shows current temperature, daily high and low, rain chance, hourly forecast, weekly forecast, and saved locations.

## Setup

Install these first:

- Git
- Node.js LTS
- Rust
- Tauri prerequisites for your OS

Then clone and install:

```bash
git clone https://github.com/tm-LBenson/skypin.git
cd skypin

npm install
cp .env.example .env
```

Start the app in development mode:

```bash
npm run tauri dev
```

## Environment file

Create `.env` from `.env.example`.

Example:

```env
VITE_APP_NAME=SkyPin
VITE_OPEN_METEO_FORECAST_URL=https://api.open-meteo.com/v1/forecast
VITE_OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1/search
VITE_DEFAULT_LOCATION_NAME=Altoona, PA
VITE_DEFAULT_LATITUDE=40.5187
VITE_DEFAULT_LONGITUDE=-78.3947
VITE_REFRESH_MINUTES=15
```

SkyPin uses Open-Meteo, so there is no API key needed.

## Run the app

```bash
npm run tauri dev
```

## Build the app

```bash
npm run build
npm run tauri build
```

## Compiled Assets

The direct compiled Windows app is here:

```txt
src-tauri/target/release/skypin.exe
```

The installer output is under:

```txt
src-tauri/target/release/bundle/
```
