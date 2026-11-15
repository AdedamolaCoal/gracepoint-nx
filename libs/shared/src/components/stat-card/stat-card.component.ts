import { Component, input } from '@angular/core';
import { IonCard, IonCardContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent],
})
export class StatCardComponent {
  value = input.required<number>();
  label = input.required<string>();
  color = input<string>('primary');
}
