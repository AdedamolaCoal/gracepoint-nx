import { Component, OnInit, computed, input } from '@angular/core';
import { AttendanceStatus } from '../../models/attendance.model';
import { IonBadge } from "@ionic/angular/standalone";


@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.css'],
  standalone: true,
  imports: [IonBadge],
})
export class StatusPillComponent {
  status = input.required<AttendanceStatus>();

  private readonly colorMap: Record<AttendanceStatus, string> = {
    Present: 'success',
    Late: 'warning',
    Absent: 'danger',
    FlaggedForReview: 'medium',
  };

  private readonly labelMap: Record<AttendanceStatus, string> = {
    Present: 'Present',
    Late: 'Late',
    Absent: 'Absent',
    FlaggedForReview: 'Flagged',
  };

  color = computed(() => this.colorMap[this.status()]);
  label = computed(() => this.labelMap[this.status()]);
}
