import { Pose } from './pose';
export declare class PoseStackAllocator {
    constructor(transformCount: number, auxiliaryCurveCount: number);
    destroy(): void;
    get allocatedCount(): number;
    push(): Pose;
    pop(): void;
    get top(): Pose;
    private _poses;
    private readonly _transformCount;
    private readonly _auxiliaryCurveCount;
    private _allocatedCount;
    private _memoryAllocator;
    private _allocateNewPose;
}
