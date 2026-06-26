import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class SoundService {
  readonly enabled = signal(localStorage.getItem('glottia_sound') !== 'off');
  toggle(): void {
    this.enabled.update((value) => !value);
    localStorage.setItem('glottia_sound', this.enabled() ? 'on' : 'off');
  }
  click(): void { this.tone(520, 0.035, 0.025); }
  success(): void { this.tone(660, 0.07, 0.04); setTimeout(() => this.tone(880, 0.09, 0.035), 70); }
  welcome(): void {
    [392, 523, 659, 784].forEach((frequency, index) => {
      setTimeout(() => this.tone(frequency, 0.22, 0.045), index * 95);
    });
  }
  private tone(frequency: number, duration: number, volume: number): void {
    if (!this.enabled() || typeof AudioContext === 'undefined') return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + duration);
    oscillator.addEventListener('ended', () => context.close());
  }
}
