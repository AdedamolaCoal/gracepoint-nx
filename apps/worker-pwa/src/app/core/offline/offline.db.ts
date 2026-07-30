import Dexie, { Table } from "dexie";
import { ClockInRequest } from "@core/models/attendance.model";

export interface PendingClockIn extends ClockInRequest {
    id?: number;
    createdAt: string;
    attempts: number;
    lastError?: string;
}

export class OfflineDatabase extends Dexie {
    pendingClockIn!: Table<PendingClockIn, number>;
    
    constructor() {
        super('gracepoint-worker-db');
        this.version(1).stores({
            pendingClockIn: '++id, qrToken'
        })
    }
    
}