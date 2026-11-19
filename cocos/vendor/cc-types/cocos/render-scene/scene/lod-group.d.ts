import { Model } from './model';
import { Vec3 } from '../../core';
import { RenderScene } from '..';
import { Device } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera } from './camera';
/**
 * @engineInternal
 * @mangle
 */
export declare class LODData {
    screenUsagePercentage: number;
    private _models;
    get models(): readonly Model[];
    addModel(model: Model): void;
    eraseModel(model: Model): void;
    clearModels(): void;
}
/**
 * @engineInternal
 * @mangle
 */
export declare class LODGroup {
    scene?: RenderScene;
    node: Node;
    protected _device: Device;
    enabled: boolean;
    private _localBoundaryCenter;
    /**
     * @en Object Size in local space, may be auto-calculated value from object bounding box or value from user input.
    */
    protected _objectSize: number;
    /**
     *@en The array of LODs
     */
    protected _lodDataArray: LODData[];
    /**
     * For editor only, users maybe operate several LOD's object
     */
    protected _lockedLODLevelVec: number[];
    private _isLockLevelChanged;
    constructor();
    set localBoundaryCenter(val: Readonly<Vec3>);
    get localBoundaryCenter(): Readonly<Vec3>;
    get lodCount(): number;
    set objectSize(val: number);
    get objectSize(): number;
    get lodDataArray(): readonly LODData[];
    attachToScene(scene: RenderScene): void;
    detachFromScene(): void;
    lockLODLevels(lockLev: number[]): void;
    isLockLevelChanged(): boolean;
    resetLockChangeFlag(): void;
    getLockedLODLevels(): readonly number[];
    clearLODs(): void;
    insertLOD(index: number, lod: LODData): void;
    updateLOD(index: number, lod: LODData): void;
    eraseLOD(index: number): void;
    /**
     *
     * @param camera current perspective camera
     * @returns visible LOD index in lodGroup
     */
    getVisibleLODLevel(camera: Camera): number;
    /**
     *
     * @param camera current perspective camera
     * @returns height of current lod group relative to camera position in screen space, aka. relativeHeight
     */
    getScreenUsagePercentage(camera: Camera): number;
    private distanceToScreenUsagePercentage;
    private getWorldSpaceSize;
}
