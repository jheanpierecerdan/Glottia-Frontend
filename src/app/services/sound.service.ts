import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class SoundService {
  readonly enabled = signal(localStorage.getItem('glottia_sound') !== 'off');
  toggle(): void {
    this.enabled.update((value) => !value);
    localStorage.setItem('glottia_sound', this.enabled() ? 'on' : 'off');
  }
  click(): void {
    this.tone(880, 0.08, 0.12, 'triangle');
  }
  success(): void {
    this.tone(523, 0.1, 0.18, 'sine');
    setTimeout(() => this.tone(659, 0.1, 0.18, 'sine'), 90);
    setTimeout(() => this.tone(784, 0.18, 0.2, 'sine'), 180);
  }
  welcome(): void {
    const melody = [392, 523, 659, 784, 1047];
    melody.forEach((frequency, index) => {
      setTimeout(() => this.tone(frequency, 0.28, 0.22, 'sine'), index * 110);
    });
  }
  hover(): void {
    this.tone(660, 0.04, 0.06, 'sine');
  }
  private tone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled() || typeof AudioContext === 'undefined') return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.addEventListener('ended', () => context.close());
  }
}