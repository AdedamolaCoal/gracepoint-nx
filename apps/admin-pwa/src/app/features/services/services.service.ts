import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "@core/http/api.config";
import { ServiceEventSummary } from "@core/models/service-event.model";

@Injectable({
    providedIn: "root"
})
export class ServicesService {
    private readonly _http = inject(HttpClient);

    getServiceSummary(): Observable<ServiceEventSummary[]> {
        return this._http.get<ServiceEventSummary[]>(API.serviceEvents);
    }
}