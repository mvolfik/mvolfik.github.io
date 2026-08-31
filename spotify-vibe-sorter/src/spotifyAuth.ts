import { createServer } from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { env } from "./env.js";
import { readJson, writeJson } from "./store.js";
import type { SpotifyToken } from "./types.js";

const SCOPES = [
  "user-library-read",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");

const TOKEN_FILE = "spotify_token.json";

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function pkcePair(): { verifier: string; challenge: string } {
  const verifier = base64url(randomBytes(64));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

async function authorizeInteractively(): Promise<SpotifyToken> {
  const { verifier, challenge } = pkcePair();
  const state = base64url(randomBytes(16));
  const redirectUrl = new URL(env.spotifyRedirectUri);

  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: env.spotifyClientId,
    response_type: "code",
    redirect_uri: env.spotifyRedirectUri,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SCOPES,
    state,
  }).toString();

  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
      if (url.pathname !== redirectUrl.pathname) {
        res.writeHead(404).end();
        return;
      }
      const returnedState = url.searchParams.get("state");
      const error = url.searchParams.get("error");
      const returnedCode = url.searchParams.get("code");
      res.writeHead(200, { "Content-Type": "text/html" });
      if (error || !returnedCode || returnedState !== state) {
        res.end(
          `<h1>Authorization failed</h1><p>${error ?? "state mismatch"}</p>`,
        );
        server.close();
        reject(
          new Error(
            `Spotify authorization failed: ${error ?? "state mismatch"}`,
          ),
        );
        return;
      }
      res.end(
        "<h1>Authorized</h1><p>You can close this tab and return to the terminal.</p>",
      );
      server.close();
      resolve(returnedCode);
    });
    server.listen(Number(redirectUrl.port) || 80, redirectUrl.hostname, () => {
      console.log(
        "Open this URL in your browser to authorize Spotify access:\n",
      );
      console.log(authorizeUrl.toString());
      console.log("\nWaiting for authorization...");
    });
  });

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.spotifyRedirectUri,
      client_id: env.spotifyClientId,
      code_verifier: verifier,
    }),
  });
  if (!tokenResponse.ok) {
    throw new Error(
      `Failed to exchange authorization code: ${await tokenResponse.text()}`,
    );
  }
  const body = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  const token: SpotifyToken = {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    expiresAt: Date.now() + body.expires_in * 1000,
  };
  writeJson(TOKEN_FILE, token);
  return token;
}

async function refresh(token: SpotifyToken): Promise<SpotifyToken> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
      client_id: env.spotifyClientId,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to refresh Spotify token: ${await response.text()}`,
    );
  }
  const body = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  const updated: SpotifyToken = {
    accessToken: body.access_token,
    refreshToken: body.refresh_token ?? token.refreshToken,
    expiresAt: Date.now() + body.expires_in * 1000,
  };
  writeJson(TOKEN_FILE, updated);
  return updated;
}

export async function ensureAccessToken(): Promise<string> {
  const existing = readJson<SpotifyToken | null>(TOKEN_FILE, null);
  if (existing) {
    if (existing.expiresAt - Date.now() > 60_000) {
      return existing.accessToken;
    }
    const refreshed = await refresh(existing);
    return refreshed.accessToken;
  }
  const token = await authorizeInteractively();
  return token.accessToken;
}
