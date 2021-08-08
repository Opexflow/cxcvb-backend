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
  thumbnail: string;
  updatedAt: string;
  remoteUpdatedAt?: string;
}
