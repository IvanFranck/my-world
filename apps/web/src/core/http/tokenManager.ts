import { TOKEN_MANAGER_KEY } from "@/src/app/lib/constants";
import { jwtDecode, JwtPayload } from "jwt-decode";

export class TokenManager {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_MANAGER_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_MANAGER_KEY, token);
  }

  private static decodeToken(token: string): JwtPayload | null {
    const result = jwtDecode(token);
    if (typeof result === "object" && result !== null && "exp" in result) {
      return result;
    }
    return null;
  }

  /**
   * Check if the token is expired
   * @param token - The token to check
   * @param bufferTime - The buffer time in seconds
   * @returns True if the token is expired, false otherwise
   */
  public static isTokenExpired(token: string, bufferTime: number = 0): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp < Date.now() / 1000 - bufferTime;
  }

  static removeToken(): void {
    localStorage.removeItem(TOKEN_MANAGER_KEY);
  }
}
