import type { PointerEvent } from "react";
import { useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadSettings } from "./lib/settings";
import { WeatherWidget } from "./components/WeatherWidget";
import type { AppSettings } from "./types/weather";

const noDragSelector = "button,input,select,textarea,a,[role='button'],[contenteditable='true'],[data-no-drag]";

function shouldStartDrag(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return !target.closest(noDragSelector);
}

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    if (!shouldStartDrag(event.target)) {
      return;
    }

    getCurrentWindow().startDragging().catch((error) => {
      console.error("Could not start dragging SkyPin", error);
    });
  }

  return (
    <div className="app-drag-root" onPointerDown={handlePointerDown}>
      <WeatherWidget settings={settings} onSettingsChange={setSettings} />
    </div>
  );
}
