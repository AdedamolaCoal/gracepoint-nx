import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  qrCodeOutline,
  timeOutline,
  personOutline,
} from 'ionicons/icons';
import { OfflineBannerComponent } from '@gracepoint/shared';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.css'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterLink, OfflineBannerComponent],
})
export class TabsPage {
  constructor() {
    addIcons({ homeOutline, qrCodeOutline, timeOutline, personOutline });
  }
}
