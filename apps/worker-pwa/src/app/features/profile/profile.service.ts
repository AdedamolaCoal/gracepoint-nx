import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API } from "@core/http/api-config";
import { WorkerProfile } from "@core/models/worker-profile.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ProfileService {
    private readonly _http = inject(HttpClient);

    getWorkerProfile(): Observable<WorkerProfile> {
        return this._http.get<WorkerProfile>(API.workerMe);
    }

    changePin(currentPin: string, newPin: string): Observable<{message: string}> {
        return this._http.post<{message: string}>(API.changePin, {
            currentPin,
            newPin,
        });
    }
}