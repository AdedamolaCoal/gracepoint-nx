import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API } from "@core/http/api-config";
import { ClockInRequest, ClockInResult } from "@core/models/attendance.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AttendanceService {
    private readonly _http = inject(HttpClient)

    clockIn(payload: ClockInRequest): Observable<ClockInResult> {
        return this._http.post<ClockInResult>(API.clockIn, payload)
    }
}