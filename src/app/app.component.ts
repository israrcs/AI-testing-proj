import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

interface Product {
  name: string;
  code: string;
  description: string;
  color: string;
  accent: string;
}

interface UserSession {
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  initials: string;
}

interface DashboardActivity {
  label: string;
  detail: string;
  time: string;
  tone: 'lime' | 'teal' | 'coral';
}

interface DashboardProject {
  name: string;
  progress: number;
  status: string;
}

interface AuthFormData {
  fullName: string;
  email: string;
  password: string;
}

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  protected readonly products: Product[] = [
    { name: 'Luma Core', code: '01 / LUMA', description: 'A responsive intelligence layer for teams building beyond the screen.', color: '#d6f36b', accent: '#a0bd37' },
    { name: 'Vector Field', code: '02 / VECTOR', description: 'Spatial tools that turn complex systems into clear, shared decisions.', color: '#7ee6d2', accent: '#319b8a' },
    { name: 'Signal House', code: '03 / SIGNAL', description: 'A living interface for the moments when your brand needs to move.', color: '#ff9f78', accent: '#d45d39' }
  ];

  protected readonly sessionKey = 'orbit-studio-session';
  protected isAuthLoading = false;
  protected readonly initialForm: AuthFormData = { fullName: '', email: '', password: '' };

  protected readonly testAccount = {
    email: 'demo@orbit.studio',
    password: 'demo@123456',
    name: 'Demo User',
    role: 'Studio member',
    joinedAt: '2025-03-14T09:30:00.000Z'
  };

  protected readonly dashboardActivities: DashboardActivity[] = [
    { label: 'Project sync', detail: 'Luma Core workspace synced across 4 devices', time: '2m ago', tone: 'lime' },
    { label: 'New comment', detail: 'Alex commented on Vector Field wireframes', time: '1h ago', tone: 'teal' },
    { label: 'Deployment', detail: 'Signal House v2.4 deployed to production', time: '3h ago', tone: 'coral' },
    { label: 'Invite accepted', detail: 'Maya joined the Orbit Studio workspace', time: 'Yesterday', tone: 'lime' }
  ];

  protected readonly dashboardProjects: DashboardProject[] = [
    { name: 'Luma Core', progress: 82, status: 'On track' },
    { name: 'Vector Field', progress: 64, status: 'In review' },
    { name: 'Signal House', progress: 45, status: 'In progress' }
  ];

  protected activeProduct = this.products[0];
  protected pointerX = 0;
  protected pointerY = 0;
  protected menuOpen = false;
  protected userMenuOpen = false;
  protected authOpen = false;
  protected authMode: AuthMode = 'signin';
  protected formData = { ...this.initialForm };
  protected session: UserSession | null = null;
  protected authError = '';
  protected settingsForm = {
    name: '',
    email: '',
    role: '',
    location: 'Amsterdam, NL',
    timezone: 'GMT+1'
  };

  ngOnInit(): void {
    this.loadSession();
    this.syncSettingsFormFromSession();
  }

  constructor(private authService: AuthService) {}

  protected selectProduct(product: Product): void {
    this.activeProduct = product;
  }

  protected setPointer(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    const bounds = target.getBoundingClientRect();
    this.pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    this.pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  }

  protected closeMenu(): void {
    this.menuOpen = false;
  }

  protected openAuth(mode: AuthMode): void {
    this.authMode = mode;
    this.authOpen = true;
    this.authError = '';
    this.resetForm();
  }

  protected closeAuth(): void {
    this.authOpen = false;
    this.authError = '';
    this.formData = { ...this.initialForm };
  }

  protected switchAuthMode(mode: AuthMode): void {
    this.authMode = mode;
    this.authError = '';
    this.formData = { ...this.initialForm };
  }

  protected useTestAccount(): void {
    this.formData = {
      fullName: this.testAccount.name,
      email: this.testAccount.email,
      password: this.testAccount.password
    };
    this.authError = '';
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  protected goToDashboard(): void {
    this.userMenuOpen = false;
    this.closeMenu();

    const dashboardNode = document.getElementById('dashboard');
    if (dashboardNode) {
      dashboardNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const url = new URL(window.location.href);
    url.hash = 'dashboard';
    window.history.pushState({}, '', url);
  }

  protected goToAccountSettings(): void {
    this.userMenuOpen = false;
    this.closeMenu();

    const settingsNode = document.getElementById('account-settings');
    if (settingsNode) {
      settingsNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const url = new URL(window.location.href);
    url.hash = 'account-settings';
    window.history.pushState({}, '', url);
  }

  protected submitAuth(): void {
    const fullName = this.formData.fullName.trim();
    const email = this.formData.email.trim();
    const password = this.formData.password.trim();

    if (!this.isValidForm({ fullName, email, password })) {
      return;
    }

    this.isAuthLoading = true;
    this.authError = '';

    // Check if backend is available
    if (!this.authService.isBackendAvailable()) {
      // Fallback to mock authentication if backend is not available
      this.handleMockAuth(fullName, email, password);
      return;
    }

    if (this.authMode === 'signin') {
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.session = {
              name: response.user.fullName,
              email: response.user.email,
              role: response.user.title || 'Team Member',
              joinedAt: new Date().toISOString(),
              initials: response.user.avatar || response.user.fullName.charAt(0)
            };
            this.saveSession();
            this.closeAuth();
            this.isAuthLoading = false;
            queueMicrotask(() => this.goToDashboard());
          }
        },
        error: (error) => {
          this.authError = error.error?.message || 'Login failed. Please check your credentials.';
          this.isAuthLoading = false;
        }
      });
      return;
    }

    // Sign up
    this.authService.signup({ email, password, fullName }).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.session = {
            name: response.user.fullName,
            email: response.user.email,
            role: response.user.title || 'Team Member',
            joinedAt: new Date().toISOString(),
            initials: response.user.avatar || response.user.fullName.charAt(0)
          };
          this.saveSession();
          this.closeAuth();
          this.isAuthLoading = false;
          queueMicrotask(() => this.goToDashboard());
        }
      },
      error: (error) => {
        this.authError = error.error?.message || 'Sign up failed. Please try again.';
        this.isAuthLoading = false;
      }
    });
  }

  private handleMockAuth(fullName: string, email: string, password: string): void {
    // Fallback to mock authentication when backend is unavailable
    if (this.authMode === 'signin') {
      const isTestAccount =
        email.toLowerCase() === this.testAccount.email &&
        password === this.testAccount.password;

      if (!isTestAccount) {
        this.authError = 'Backend offline. Use test account: demo@orbit.studio / demo@123456';
        this.isAuthLoading = false;
        return;
      }

      this.session = this.createSession(
        this.testAccount.name,
        this.testAccount.email,
        this.testAccount.role,
        this.testAccount.joinedAt,
        'DU'
      );
      this.saveSession();
      this.closeAuth();
      this.isAuthLoading = false;
      queueMicrotask(() => this.goToDashboard());
      return;
    }

    // Mock sign-up
    const displayName = this.formatDisplayName(fullName);
    this.session = this.createSession(
      displayName || 'Orbit Member',
      email,
      'Product lead',
      new Date().toISOString(),
      this.getInitials(displayName)
    );

    this.saveSession();
    this.closeAuth();
    this.isAuthLoading = false;
    queueMicrotask(() => this.goToDashboard());
  }

  protected logout(): void {
    this.session = null;
    this.userMenuOpen = false;
    this.settingsForm = {
      name: '',
      email: '',
      role: '',
      location: 'Amsterdam, NL',
      timezone: 'GMT+1'
    };
    this.authService.logout();
    localStorage.removeItem(this.sessionKey);
  }

  protected saveProfile(): void {
    if (!this.session) {
      return;
    }

    this.session.name = this.settingsForm.name.trim() || this.session.name;
    this.session.email = this.settingsForm.email.trim() || this.session.email;
    this.session.role = this.settingsForm.role.trim() || this.session.role;
    this.saveSession();
  }

  protected resetSettingsForm(): void {
    this.syncSettingsFormFromSession();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (window.innerWidth > 768) {
      this.menuOpen = false;
      this.userMenuOpen = false;
    }
  }

  private resetForm(): void {
    this.formData = { ...this.initialForm };
    this.authError = '';
  }

  private loadSession(): void {
    // First try to load from localStorage (for backward compatibility)
    const rawSession = localStorage.getItem(this.sessionKey);

    if (rawSession) {
      try {
        this.session = JSON.parse(rawSession) as UserSession;
        this.syncSettingsFormFromSession();
        return;
      } catch {
        localStorage.removeItem(this.sessionKey);
      }
    }

    // Then check if there's a valid token from the auth service
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.session = {
          name: user.fullName,
          email: user.email,
          role: user.title || 'Team Member',
          joinedAt: new Date().toISOString(),
          initials: user.avatar || user.fullName.charAt(0)
        };
        this.saveSession();
      }
    }
  }

  private saveSession(): void {
    if (!this.session) {
      return;
    }

    localStorage.setItem(this.sessionKey, JSON.stringify(this.session));
  }

  private syncSettingsFormFromSession(): void {
    if (!this.session) {
      return;
    }

    this.settingsForm = {
      name: this.session.name,
      email: this.session.email,
      role: this.session.role,
      location: 'Amsterdam, NL',
      timezone: 'GMT+1'
    };
  }

  private isValidForm(form: AuthFormData): boolean {
    return !!form.email && !!form.password && (this.authMode !== 'signup' || !!form.fullName.trim());
  }

  private createSession(name: string, email: string, role: string, joinedAt: string, initials: string): UserSession {
    return { name, email, role, joinedAt, initials };
  }

  private formatDisplayName(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private getInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'OS';
  }
}