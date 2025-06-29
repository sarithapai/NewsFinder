export function savePreferencesToCookie(preferences: object) {
  document.cookie = `newsPreferences=${encodeURIComponent(
    JSON.stringify(preferences)
  )}; path=/; max-age=31536000`; // 1 year
}
