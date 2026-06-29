const VERIFIER_KEY = "god-roll-vault:oauth:code-verifier";
const STATE_KEY = "god-roll-vault:oauth:state";

export function storeOAuthSession(codeVerifier: string, state: string): void {
  sessionStorage.setItem(VERIFIER_KEY, codeVerifier);
  sessionStorage.setItem(STATE_KEY, state);
}

export function readOAuthSession(): { codeVerifier: string; state: string } | null {
  const codeVerifier = sessionStorage.getItem(VERIFIER_KEY);
  const state = sessionStorage.getItem(STATE_KEY);

  if (!codeVerifier || !state) {
    return null;
  }

  return { codeVerifier, state };
}

export function clearOAuthSession(): void {
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
}
