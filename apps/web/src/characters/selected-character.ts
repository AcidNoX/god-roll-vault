export const SELECTED_CHARACTER_STORAGE_KEY = "god-roll-vault:selected-character";

export type SelectedCharacter = {
  membershipType: number;
  membershipId: string;
  characterId: string;
};

function isSelectedCharacter(value: unknown): value is SelectedCharacter {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SelectedCharacter>;

  return (
    typeof candidate.membershipType === "number" &&
    typeof candidate.membershipId === "string" &&
    typeof candidate.characterId === "string"
  );
}

export function readSelectedCharacter(): SelectedCharacter | null {
  const raw = localStorage.getItem(SELECTED_CHARACTER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isSelectedCharacter(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSelectedCharacter(selection: SelectedCharacter): void {
  localStorage.setItem(SELECTED_CHARACTER_STORAGE_KEY, JSON.stringify(selection));
}
