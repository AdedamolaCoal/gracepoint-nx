import { WorkerSession } from '@core/models/worker.model';
import { AuthApiData, AuthApiResult } from '@gracepoint/shared';

export interface WorkerAuthData extends AuthApiData, WorkerSession {}

export type WorkerAuthResult = AuthApiResult<WorkerAuthData>;
