import { Component, input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-code-branded',
  templateUrl: './qr-code-branded.component.html',
  styleUrls: ['./qr-code-branded.component.scss'],
  imports: [QRCodeComponent],
  standalone: true,
})
export class QrCodeBrandedComponent {
  data = input.required<string>();
  size = input<number>(280);
}
