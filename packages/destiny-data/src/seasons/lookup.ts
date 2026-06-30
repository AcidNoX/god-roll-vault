import { getBungieAssetUrl } from "../manifest/lookup.js";

export type SeasonDefinition = {
  iconPath?: string;
};

const runtimeSeasons: Record<string, SeasonDefinition> = {};

export function registerSeasonDefinition(seasonHash: number, definition: SeasonDefinition): void {
  runtimeSeasons[String(seasonHash)] = definition;
}

export function getSeasonDefinition(seasonHash: number): SeasonDefinition | undefined {
  return runtimeSeasons[String(seasonHash)];
}

export function getSeasonIconUrl(seasonHash: number | undefined): string | undefined {
  if (!seasonHash) {
    return undefined;
  }

  return getBungieAssetUrl(getSeasonDefinition(seasonHash)?.iconPath);
}
