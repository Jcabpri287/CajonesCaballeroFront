import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private readonly storageKey = 'isLoggedIn';
  private readonly passwordKey = 'storedPassword';
  private readonly mailKey = 'storedMail';
  private readonly idKey = 'storedId';
  private readonly nameKey = 'storedName';
  private readonly adminKey = 'storedAdmin';

  constructor() {}

  login(isLoggedIn: boolean, password: string, mail: string,username: string, userId: string | undefined, admin: boolean): void {
    if (userId) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('adminCookie', admin?"true":"false");
    }

    if (isLoggedIn) {
      sessionStorage.setItem(this.storageKey, isLoggedIn.toString());
      sessionStorage.setItem(this.passwordKey, password);
      sessionStorage.setItem(this.mailKey, mail);
    } else {
      sessionStorage.setItem(this.storageKey, 'true');
      sessionStorage.removeItem(this.passwordKey);
      sessionStorage.removeItem(this.mailKey);
    }
  }

  getStoredPassword(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(this.passwordKey);
    } else {
      return null;
    }
  }

  getStoredMail(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(this.mailKey);
    } else {
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem('adminCookie');

  }

  isAuthenticated(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(this.storageKey) === 'true';
    } else {
      return false;
    }
  }

  isAuthenticatedPromise(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (typeof sessionStorage !== 'undefined') {
          resolve(sessionStorage.getItem(this.storageKey) === 'true');
      } else {
          resolve(false);
      }
  });
  }
}
