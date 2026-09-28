/**
 * Utilitaires pour l'extraction et l'intégration Google Drive et YouTube
 * Adapté de l'architecture React éprouvée (Quiz-supabase/React-Aps)
 */

// Extrait l'ID de fichier Google Drive depuis divers formats d'URL
export function extractDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();

  // Motif 1: /d/{FILE_ID}
  const matchD = str.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) return matchD[1];

  // Motif 2: ?id={FILE_ID} ou &id={FILE_ID}
  const matchId = str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];

  // Motif 3: ID brut
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
    return str;
  }

  return null;
}

// Génère les URLs d'images de couverture / vignettes directes depuis Google Drive
export function getDriveImageUrls(driveUrlOrId: string | null | undefined): string[] {
  if (!driveUrlOrId) return [];

  const fileId = extractDriveFileId(driveUrlOrId);
  if (!fileId) {
    return typeof driveUrlOrId === "string" && driveUrlOrId.startsWith("http")
      ? [driveUrlOrId]
      : [];
  }

  return [
    `https://lh3.googleusercontent.com/d/${fileId}=w600`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?id=${fileId}`,
  ];
}

// Extrait l'ID YouTube d'une URL, balise iframe ou chaîne
export function extractYouTubeId(urlOrId: string | null | undefined): string {
  if (!urlOrId) return "";
  const str = String(urlOrId).trim();

  // Déjà un ID à 11 caractères
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;

  // Iframe src
  const iframeMatch = str.match(/src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1] : str;

  // Formats d'URL YouTube usuels
  const match = target.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : "";
}

// Génère la vignette YouTube officielle HD
export function getYoutubeThumbnail(url: string | null | undefined): string | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  return null;
}

// Génère les URLs des vignettes YouTube ordonnées par qualité (avec repli automatique sur hqdefault)
export function getYoutubeThumbnailCandidates(url: string | null | undefined): string[] {
  const ytId = extractYouTubeId(url);
  if (!ytId) return [];
  return [
    `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
  ];
}

// Génère l'URL d'aperçu iframe universelle (PDF Drive ou YouTube)
export function getEmbedUrl(url: string | null | undefined): string {
  if (!url) return "about:blank";
  const str = String(url).trim();

  // Si c'est une vidéo YouTube
  const ytId = extractYouTubeId(str);
  if (ytId) {
    return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1`;
  }

  // Si c'est un PDF Google Drive
  const driveId = extractDriveFileId(str);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }

  return str;
}

// Génère le lien de téléchargement direct depuis Google Drive
export function getDownloadUrl(url: string | null | undefined): string {
  if (!url) return "";
  const driveId = extractDriveFileId(url);
  return driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : url;
}
