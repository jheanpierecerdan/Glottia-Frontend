import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.initialMode());

  constructor() {
    this.apply(this.mode());
  }

  toggle(): void {
    const next: ThemeMode = this.mode() === 'light' ? 'dark' : 'light';
    this.mode.set(next);
    localStorage.setItem('glottia_theme', next);
    this.apply(next);
  }

  private initialMode(): ThemeMode {
    const saved = localStorage.getItem('glottia_theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(mode: ThemeMode): void {
    document.documentElement.dataset['theme'] = mode;
    document.documentElement.style.colorScheme = mode;
  }
}
