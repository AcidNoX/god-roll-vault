import type { AuthTokens } from "./types.js";

export interface TokenStore {
  get(): Promise<AuthTokens | null>;
  set(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryTokenStore implements TokenStore {
  private tokens: AuthTokens | null = null;

  async get(): Promise<AuthTokens | null> {
    return this.tokens;
  }

  async set(tokens: AuthTokens): Promise<void> {
    this.tokens = tokens;
  }

  async clear(): Promise<void> {
    this.tokens = null;
  }
}
