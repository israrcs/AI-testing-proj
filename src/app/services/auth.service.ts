import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    title: string;
    avatar: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  title?: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private tokenKey = 'orbit-auth-token';
  private userKey = 'orbit-auth-user';
  private backendAvailable = false;

  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());

  public token$ = this.tokenSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
    this.checkBackendAvailability();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.tokenSubject.next(token);
      this.userSubject.next(user);
    }
  }

  private checkBackendAvailability(): void {
    this.http.get(`${this.API_URL.replace('/auth', '')}/health`, { 
      timeout: 2000 
    }).subscribe({
      next: () => {
        this.backendAvailable = true;
      },
      error: () => {
        this.backendAvailable = false;
      }
    });
  }

  isBackendAvailable(): boolean {
    return this.backendAvailable;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setToken(response.token);
          this.setUser(response.user);
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        }
      })
    );
  }

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, data).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setToken(response.token);
          this.setUser(response.user);
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }

  getStoredUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  updateProfile(data: ProfileUpdateRequest): Observable<{ success: boolean; user: any }> {
    return this.http.put<{ success: boolean; user: any }>(`${this.API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.setUser(response.user);
          this.userSubject.next(response.user);
        }
      })
    );
  }

  getCurrentUserProfile(): Observable<{ success: boolean; user: any }> {
    return this.http.get<{ success: boolean; user: any }>(`${this.API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }
}
