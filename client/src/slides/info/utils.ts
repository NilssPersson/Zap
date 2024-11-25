export const validateYoutubeUrl = (url: string) => {
  if (!url) return false;

  // Regex to match various YouTube URL formats
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})([&\w=?-]*)?$/;

  return youtubeRegex.test(url);
}

export const extractYoutubeId = (url: string) => {
  if (!url) return "";

  try {
    const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
    if (urlObj.hostname.includes('youtube.com')) {
      const params = new URLSearchParams(urlObj.search);
      return params.get('v'); // Extract video ID from "v" parameter
    }
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1); // Extract video ID from the pathname
    }
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.includes('/embed/')) {
      return urlObj.pathname.split('/embed/')[1]; // Extract video ID from the embed URL
    }
  } catch (error) {
    console.error('Failed to extract YouTube video ID', error);
    return "";
  }

  return ""
}

export const getYoutubeEmbedUrl = (url: string) => {
  const videoId = extractYoutubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export const getYoutubeThumbnailUrl = (url: string) => {
  const videoId = extractYoutubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : "";
}