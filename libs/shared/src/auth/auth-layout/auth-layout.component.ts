import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthLayoutStore } from '../auth-layout.store';

@Component({
  selector: 'lib-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IonContent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  readonly store = inject(AuthLayoutStore);
  private timerId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.store.nextScripture();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
