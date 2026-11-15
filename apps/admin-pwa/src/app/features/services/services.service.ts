import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { API } from "@core/http/api.config";
import { ServiceEventSummary } from "@core/models/service-event.model";
import { PagedResult } from "@gracepoint/shared";

@Injectable({
    providedIn: "root"
})
export class ServicesService {
    private readonly _http = inject(HttpClient);

    getServiceSummary(page = 1, pageSize = 30): Observable<PagedResult<ServiceEventSummary>> {
        const emptyPaged: PagedResult<ServiceEventSummary> = {
            items: [],
            page: 1,
            pageSize,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        };

        return this._http.get<any>(API.serviceEvents, {
            params: { page: page.toString(), pageSize: pageSize.toString() },
        }).pipe(
            map((res) => {
                if (!res) return emptyPaged;
                const data = res.data !== undefined ? res.data : res;
                if (data && Array.isArray(data.items)) {
                    return data as PagedResult<ServiceEventSummary>;
                }
                if (Array.isArray(data)) {
                    return {
                        items: data as ServiceEventSummary[],
                        page: 1,
                        pageSize: data.length,
                        totalCount: data.length,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    };
                }
                return emptyPaged;
            })
        );
    }
}