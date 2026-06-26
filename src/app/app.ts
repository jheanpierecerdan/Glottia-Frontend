import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SoundService } from './services/sound.service';
import { ThemeService } from './services/theme.service';

@Component({ selector: 'app-root', imports: [RouterOutlet], templateUrl: './app.html', styleUrl: './app.scss' })
export class App {
  constructor(private readonly sounds: SoundService, readonly theme: ThemeService) {}
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a')) this.sounds.click();
  }
}
