import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API } from "@core/http/api.config";
import { Unit } from "@core/models/units.model";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WorkersService {
  private readonly _http = inject(HttpClient);

  getWorkerSummary(): Observable<WorkerSummary[]> {
    return this._http.get<WorkerSummary[]>(API.workers);
  }

  getUnits(): Observable<Unit[]> {
    return this._http.get<Unit[]>(API.units);
  }
}
