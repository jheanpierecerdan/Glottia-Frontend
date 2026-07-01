import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackService } from './services/feedback';
import { SoundService } from './services/sound.service';
import { ThemeService } from './services/theme.service';

@Component({ selector: 'app-root', imports: [RouterOutlet, MatIconModule], templateUrl: './app.html', styleUrl: './app.scss' })
export class App {
  constructor(private readonly sounds: SoundService, readonly theme: ThemeService, readonly feedback: FeedbackService) {}
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a')) this.sounds.click();
  }
}
