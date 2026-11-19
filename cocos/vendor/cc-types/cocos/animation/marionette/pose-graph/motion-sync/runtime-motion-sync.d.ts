import { MotionSyncInfo } from './motion-sync-info';
export declare class RuntimeMotionSyncManager {
    register(syncInfo: MotionSyncInfo): RuntimeMotionSyncRecord;
    sync(): void;
    private _groups;
}
export interface RuntimeMotionSyncRecord {
    notifyRenter(normalizedTime: number): void;
    notifyUpdate(deltaTime: number, weight: number): void;
    getSyncedEnterTime(): number;
}
