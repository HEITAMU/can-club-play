import { Pose } from './pose';
export declare class PoseHeapAllocator {
    constructor(transformCount: number, metaValueCount: number);
    get allocatedCount(): number;
    allocatePose(): Pose;
    destroyPose(pose: Pose): void;
    private _transformCount;
    private _metaValueCount;
    private _pages;
    private _allocatedCount;
    /**
     * Index of the page that:
     * - All former pages are busy.
     * - This page and the following pages're possible having free location to allocate.
     */
    private _foremostPossibleFreePage;
    private _allocatePoseInNewPage;
}
