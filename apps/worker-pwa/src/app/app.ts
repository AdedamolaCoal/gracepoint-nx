import { Component, inject, signal, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from '@core/theme/theme.service';
import { FcmService } from '@core/services/fcm.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly theme = inject(ThemeService);
  private readonly fcmService = inject(FcmService);
  protected readonly title = signal('gracepoint');

  ngOnInit(): void {
    this.fcmService.initPushNotifications();
  }
}
