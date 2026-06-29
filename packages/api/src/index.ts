export const BUNGIE_API_BASE_URL = "https://www.bungie.net/Platform";

export type BungieClientConfig = {
  apiKey: string;
};

export class BungieClient {
  constructor(private readonly config: BungieClientConfig) {}

  getApiKey(): string {
    return this.config.apiKey;
  }
}
