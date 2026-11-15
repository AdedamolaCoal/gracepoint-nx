import { Injectable, computed, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RegisterService } from "./register.service";

@Injectable({
  providedIn: "root",
})
export class RegisterStore {
  private readonly _service = inject(RegisterService);

  readonly units = computed(() => this.resource.value() ?? []);

  private readonly resource = rxResource({
    stream: () => this._service.getUnits(),
  });
}
