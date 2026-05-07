import { getStorageData, saveStorageData } from "@/services/storage/AsyncStorage";

const PACKAGE_CACHE_KEY = "packages:list-cache";
const PACKAGE_CACHE_TTL_MS = 5 * 60 * 1000;

export async function readPackageCache() {
  const cached = await getStorageData(PACKAGE_CACHE_KEY);

  if (!cached || !Array.isArray(cached?.items)) {
    return null;
  }

  return cached;
}

export async function writePackageCache(items) {
  const payload = {
    items: Array.isArray(items) ? items : [],
    timestamp: Date.now(),
  };

  await saveStorageData(PACKAGE_CACHE_KEY, payload);
  return payload;
}

export function isPackageCacheFresh(timestamp) {
  if (!timestamp) {
    return false;
  }

  return Date.now() - Number(timestamp) < PACKAGE_CACHE_TTL_MS;
}

export function getPackageCacheAgeLabel(timestamp) {
  if (!timestamp) {
    return null;
  }

  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - Number(timestamp)) / 60000)
  );

  if (diffMinutes < 1) {
    return "Updated just now";
  }

  if (diffMinutes === 1) {
    return "Updated 1 minute ago";
  }

  return `Updated ${diffMinutes} minutes ago`;
}
