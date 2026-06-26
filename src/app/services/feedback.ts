import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  readonly message = signal('');
  private timeout?: ReturnType<typeof setTimeout>;

  show(message: string): void {
    this.message.set(message);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => this.clear(), 3500);
  }

  clear(): void {
    this.message.set('');
  }
}
