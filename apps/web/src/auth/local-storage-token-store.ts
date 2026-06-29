import type { AuthTokens, TokenStore } from "@god-roll-vault/api";

const STORAGE_KEY = "god-roll-vault:auth-tokens";

export class LocalStorageTokenStore implements TokenStore {
  async get(): Promise<AuthTokens | null> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthTokens;
    } catch {
      return null;
    }
  }

  async set(tokens: AuthTokens): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}
