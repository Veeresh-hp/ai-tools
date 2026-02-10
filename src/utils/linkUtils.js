/**
 * Appends a referral parameter to a URL.
 * @param {string} url - The URL to modify.
 * @returns {string} - The URL with the referral parameter appended.
 */
export const addRefToUrl = (url) => {
  if (!url) return url;
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('ref', 'myalltools.vercel.app');
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails (e.g. relative URLs or invalid strings), return as is
    console.warn('Invalid URL provided to addRefToUrl:', url);
    return url;
  }
};

/**
 * Extracts the YouTube video ID from a URL.
 * @param {string} url - The YouTube URL.
 * @returns {string|null} - The video ID or null if not found.
 */
export const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};
