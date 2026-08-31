import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy env.example to .env and fill it in.`,
    );
  }
  return value;
}

export const env = {
  get spotifyClientId() {
    return required("SPOTIFY_CLIENT_ID");
  },
  spotifyRedirectUri:
    process.env.SPOTIFY_REDIRECT_URI ?? "http://127.0.0.1:8888/callback",
  get anthropicApiKey() {
    return required("ANTHROPIC_API_KEY");
  },
  classifyModel: process.env.CLASSIFY_MODEL ?? "claude-sonnet-5",
  playlistPrefix: process.env.PLAYLIST_PREFIX ?? "Vibe: ",
};
