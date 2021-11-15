interface VideoType {
  videoTypeId: number;
  name: string;
}

interface Video {
  videoId: number;
  stringId: string;
  videoTypeId: number;
  title: string;
  description?: string;
  host: string;
  source: string;
  thumbnail?: string;
  score: number;
  updatedAt: string;
  remoteUpdatedAt?: string;
}

interface VideoTranslation {
  videoTranslationId: number;
  videoId: number;
  locale: string;
  title: string;
  description?: string;
}
