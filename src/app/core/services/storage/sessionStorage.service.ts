import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { SESSION_STORAGE } from '@ng-toolkit/universal';
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  get(key): object {
    return !!sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : null;
  }
  set(key: string, value: object): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
  clean(): void {
    sessionStorage.clear();
  }
}
