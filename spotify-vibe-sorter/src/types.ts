export interface Category {
  name: string;
  description: string;
}

export interface TrackRecord {
  id: string;
  name: string;
  artistIds: string[];
  artistNames: string[];
  album: string;
  releaseDate: string;
  popularity: number;
  addedAt: string;
  url: string;
}

export interface ArtistRecord {
  id: string;
  name: string;
  genres: string[];
}

export type Confidence = "high" | "medium" | "low";

export interface Classification {
  category: string; // one of the category names, or "unsorted"
  confidence: Confidence;
  reason: string;
  classifiedAt: string;
}

export interface SpotifyToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}
