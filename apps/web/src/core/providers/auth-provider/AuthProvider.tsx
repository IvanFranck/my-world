"use client";

import { useAuthStore } from "@/src/store/auth/useAuthStore";
import { createContext, useEffect, useRef } from "react";
import { TokenManager } from "../../http/tokenManager";
import { authService } from "@/src/services/auth/authService";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout, setAuthReady, user, isAuthenticated } =
    useAuthStore();
  const initCalled = useRef(false);

  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (initCalled.current) return;
    initCalled.current = true;

    let cancelled = false;

    const initializeAuth = async () => {
      const token = TokenManager.getToken();

      // Token in localStorage and store has user
      if (token && isAuthenticated && user) {
        if (!TokenManager.isTokenExpired(token, 1000 * 60 * 2)) {
          setAuthReady(true);
          return;
        }

        // token expired - try refresh, fallback to logout
        try {
          await authService.refreshToken();
        } catch {
          if (cancelled) return;
          TokenManager.removeToken();
          logout();
        }

        if (!cancelled) setAuthReady(true);
        return;
      }

      // No token and not authenticated - user is simply not logged in
      if (!isAuthenticated || !user) {
        setAuthReady(true);
        // router.push(`/${locale}/login`);
        return;
      }

      // store says authenticated but no token (local storage cleared externally)
      // ty to refresh, otherwise log out
      try {
        await authService.refreshToken();
        if (cancelled) return;
        setAuthReady(true);
      } catch {
        if (cancelled) return;
        logout();
        setAuthReady(true);
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [setUser, logout, setAuthReady]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
