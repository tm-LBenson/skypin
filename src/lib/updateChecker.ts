export type UpdateCheckResult = {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  applyUrl: string;
  message: string;
};

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type GitHubReleaseResponse = {
  tag_name: string;
  html_url: string;
  assets: ReleaseAsset[];
};

export const currentAppVersion = import.meta.env.VITE_APP_VERSION || "0.1.0";

function removeLeadingV(version: string) {
  const trimmedVersion = version.trim();

  if (trimmedVersion[0]?.toLowerCase() === "v") {
    return trimmedVersion.slice(1);
  }

  return trimmedVersion;
}

function getVersionParts(version: string) {
  return removeLeadingV(version)
    .split("-")[0]
    .split(".")
    .map((part) => Number(part) || 0);
}

function isNewerVersion(latestVersion: string, currentVersion: string) {
  const latestParts = getVersionParts(latestVersion);
  const currentParts = getVersionParts(currentVersion);
  const partCount = Math.max(latestParts.length, currentParts.length);

  for (let index = 0; index < partCount; index += 1) {
    const latestPart = latestParts[index] || 0;
    const currentPart = currentParts[index] || 0;

    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }

  return false;
}

function getApplyUrl(release: GitHubReleaseResponse) {
  const assets = release.assets.filter((asset) => {
    const name = asset.name.toLowerCase();
    return !name.endsWith(".sig") && !name.endsWith(".zip");
  });

  const windowsInstaller = assets.find((asset) => {
    const name = asset.name.toLowerCase();
    return name.endsWith(".msi") || name.includes("setup.exe") || name.endsWith(".exe");
  });

  const macInstaller = assets.find((asset) => {
    const name = asset.name.toLowerCase();
    return name.endsWith(".dmg");
  });

  const linuxInstaller = assets.find((asset) => {
    const name = asset.name.toLowerCase();
    return name.endsWith(".appimage") || name.endsWith(".deb") || name.endsWith(".rpm");
  });

  return windowsInstaller?.browser_download_url
    || macInstaller?.browser_download_url
    || linuxInstaller?.browser_download_url
    || release.html_url;
}

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const response = await fetch("https://api.github.com/repos/tm-LBenson/skypin/releases/latest", {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (response.status === 404) {
    return {
      currentVersion: currentAppVersion,
      latestVersion: "",
      hasUpdate: false,
      applyUrl: "",
      message: "No updates are available yet."
    };
  }

  if (!response.ok) {
    throw new Error("Update check failed");
  }

  const release = await response.json() as GitHubReleaseResponse;
  const latestVersion = release.tag_name;
  const hasUpdate = isNewerVersion(latestVersion, currentAppVersion);

  return {
    currentVersion: currentAppVersion,
    latestVersion,
    hasUpdate,
    applyUrl: getApplyUrl(release),
    message: hasUpdate
      ? `Update ready: ${latestVersion}.`
      : "SkyPin is up to date."
  };
}
