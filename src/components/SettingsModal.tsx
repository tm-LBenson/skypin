import { useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { searchLocations } from "../lib/openMeteo";
import { checkForUpdates, currentAppVersion } from "../lib/updateChecker";
import type { AppSettings, LocationSearchResult, SavedLocation } from "../types/weather";

type Props = {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
};

export function SettingsModal({ settings, onSave, onClose }: Props) {
  const [draftSettings, setDraftSettings] = useState(settings);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [hasUpdate, setHasUpdate] = useState(false);
  const [applyUrl, setApplyUrl] = useState("");

  async function handleSearch() {
    if (!searchText.trim()) return;

    const results = await searchLocations(searchText);
    setSearchResults(results);
  }

  async function handleCheckForUpdates() {
    setIsCheckingUpdates(true);
    setUpdateMessage("");
    setHasUpdate(false);
    setApplyUrl("");

    try {
      const result = await checkForUpdates();
      setUpdateMessage(result.message);
      setHasUpdate(result.hasUpdate);
      setApplyUrl(result.applyUrl);
    } catch {
      setUpdateMessage("Could not check for updates right now.");
    } finally {
      setIsCheckingUpdates(false);
    }
  }

  async function handleApplyUpdate() {
    if (!applyUrl) return;

    await openUrl(applyUrl);
  }

  function addLocation(result: LocationSearchResult) {
    const location: SavedLocation = {
      id: crypto.randomUUID(),
      name: [result.name, result.admin1].filter(Boolean).join(", "),
      latitude: result.latitude,
      longitude: result.longitude
    };

    setDraftSettings({
      ...draftSettings,
      activeLocationId: location.id,
      locations: [...draftSettings.locations, location]
    });
  }

  function removeLocation(locationId: string) {
    const locations = draftSettings.locations.filter((location) => location.id !== locationId);
    const activeLocationId = draftSettings.activeLocationId === locationId ? locations[0]?.id || "" : draftSettings.activeLocationId;

    setDraftSettings({
      ...draftSettings,
      activeLocationId,
      locations
    });
  }

  function saveChanges() {
    onSave(draftSettings);
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal settings-modal">
        <div className="modal-header">
          <strong>Settings</strong>
          <button onClick={onClose}>x</button>
        </div>

        <label>
          Active location
          <select
            value={draftSettings.activeLocationId}
            onChange={(event) => setDraftSettings({ ...draftSettings, activeLocationId: event.target.value })}
          >
            {draftSettings.locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </label>

        <label>
          Refresh
          <select
            value={draftSettings.refreshMinutes}
            onChange={(event) => setDraftSettings({ ...draftSettings, refreshMinutes: Number(event.target.value) })}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </label>

        <label>
          Units
          <select
            value={draftSettings.temperatureUnit}
            onChange={(event) => setDraftSettings({ ...draftSettings, temperatureUnit: event.target.value as "fahrenheit" | "celsius" })}
          >
            <option value="fahrenheit">Fahrenheit</option>
            <option value="celsius">Celsius</option>
          </select>
        </label>

        <div className="settings-section">
          <strong>Updates</strong>
          <p className="settings-help-text">Installed version: {currentAppVersion}</p>

          <div className="settings-button-row">
            <button className="secondary-button" onClick={handleCheckForUpdates} disabled={isCheckingUpdates}>
              {isCheckingUpdates ? "Checking..." : "Check for updates"}
            </button>

            {hasUpdate && (
              <button className="primary-button" onClick={handleApplyUpdate}>
                Apply update
              </button>
            )}
          </div>

          {updateMessage && <p className="settings-status">{updateMessage}</p>}
        </div>

        <div className="location-search">
          <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search city or ZIP" />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="search-results">
          {searchResults.map((result) => (
            <button key={result.id} onClick={() => addLocation(result)}>
              {[result.name, result.admin1, result.country].filter(Boolean).join(", ")}
            </button>
          ))}
        </div>

        <div className="saved-locations">
          {draftSettings.locations.map((location) => (
            <div key={location.id} className="saved-location">
              <span>{location.name}</span>
              {draftSettings.locations.length > 1 && <button onClick={() => removeLocation(location.id)}>Remove</button>}
            </div>
          ))}
        </div>

        <button className="primary-button" onClick={saveChanges}>Save</button>
      </div>
    </div>
  );
}
