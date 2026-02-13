
import { AdminUser } from '../types';
import { db } from './dbService';

const AUTH_SESSION_KEY = 'ibaanah_auth_user';

class AuthService {
  private hardcodedPasswords: Record<string, string> = {
    'superadmin': 'password',
    'desk_male': 'password',
    'desk_female': 'password',
  };

  async login(username: string, pass: string): Promise<AdminUser | null> {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    const expectedPassword = this.hardcodedPasswords[username];
    if (!expectedPassword || expectedPassword !== pass) {
      return null;
    }

    const user = db.getAdmins().find(u => u.username === username);
    if (user && user.active) {
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(AUTH_SESSION_KEY);
  }

  getCurrentUser(): AdminUser | null {
    const userJson = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error("Failed to parse user from session storage", e);
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();