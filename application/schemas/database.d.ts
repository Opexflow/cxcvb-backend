interface VideoType {
  videoTypeId: number;
  name: string;
}

interface Video {
  videoId: number;
  stringId: string;
  videoTypeId: number;
  title: string;
  host: string;
  source: string;
  thumbnail: string;
}
