import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
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
  protected readonly initialForm: AuthFormData = { fullName: '', email: '', password: '' };

  protected readonly testAccount = {
    email: 'test@orbit.studio',
    password: 'orbit123',
    name: 'Test User',
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

  ngOnInit(): void {
    this.loadSession();
  }

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

  protected submitAuth(): void {
    const fullName = this.formData.fullName.trim();
    const email = this.formData.email.trim();
    const password = this.formData.password.trim();

    if (!this.isValidForm({ fullName, email, password })) {
      return;
    }

    if (this.authMode === 'signin') {
      const isTestAccount =
        email.toLowerCase() === this.testAccount.email &&
        password === this.testAccount.password;

      if (!isTestAccount) {
        this.authError = 'Invalid credentials. Use the test account below to sign in.';
        return;
      }

      this.session = this.createSession(this.testAccount.name, this.testAccount.email, this.testAccount.role, this.testAccount.joinedAt, 'TU');
      this.saveSession();
      this.closeAuth();
      queueMicrotask(() => this.goToDashboard());
      return;
    }

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
    queueMicrotask(() => this.goToDashboard());
  }

  protected logout(): void {
    this.session = null;
    this.userMenuOpen = false;
    localStorage.removeItem(this.sessionKey);
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
    const rawSession = localStorage.getItem(this.sessionKey);

    if (!rawSession) {
      return;
    }

    try {
      this.session = JSON.parse(rawSession) as UserSession;
    } catch {
      localStorage.removeItem(this.sessionKey);
    }
  }

  private saveSession(): void {
    if (!this.session) {
      return;
    }

    localStorage.setItem(this.sessionKey, JSON.stringify(this.session));
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