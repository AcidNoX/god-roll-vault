import {
  type AuthTokens,
  buildAuthorizeUrl,
  exchangeCodeForTokens,
  generatePkce,
  type TokenStore,
} from "@god-roll-vault/api";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getAuthConfig } from "./config.js";
import { LocalStorageTokenStore } from "./local-storage-token-store.js";
import { clearOAuthSession, readOAuthSession, storeOAuthSession } from "./oauth-session.js";

type AuthContextValue = {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeLogin: (code: string, state: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const defaultTokenStore = new LocalStorageTokenStore();

function createOAuthState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

type AuthProviderProps = {
  children: ReactNode;
  tokenStore?: TokenStore;
};

export function AuthProvider({ children, tokenStore = defaultTokenStore }: AuthProviderProps) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTokens() {
      const stored = await tokenStore.get();
      if (!cancelled) {
        setTokens(stored);
        setIsLoading(false);
      }
    }

    void loadTokens();

    return () => {
      cancelled = true;
    };
  }, [tokenStore]);

  const login = useCallback(async () => {
    const config = getAuthConfig();
    const { codeVerifier, codeChallenge } = await generatePkce();
    const state = createOAuthState();

    storeOAuthSession(codeVerifier, state);

    const authorizeUrl = buildAuthorizeUrl({
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      state,
      codeChallenge,
    });

    window.location.assign(authorizeUrl);
  }, []);

  const logout = useCallback(async () => {
    await tokenStore.clear();
    clearOAuthSession();
    setTokens(null);
  }, [tokenStore]);

  const completeLogin = useCallback(
    async (code: string, state: string) => {
      const session = readOAuthSession();
      if (!session || session.state !== state) {
        clearOAuthSession();
        throw new Error("Invalid OAuth state");
      }

      const config = getAuthConfig();
      const nextTokens = await exchangeCodeForTokens({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        code,
        codeVerifier: session.codeVerifier,
        redirectUri: config.redirectUri,
      });

      clearOAuthSession();
      await tokenStore.set(nextTokens);
      setTokens(nextTokens);
    },
    [tokenStore],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      tokens,
      isAuthenticated: tokens !== null,
      isLoading,
      login,
      logout,
      completeLogin,
    }),
    [tokens, isLoading, login, logout, completeLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
