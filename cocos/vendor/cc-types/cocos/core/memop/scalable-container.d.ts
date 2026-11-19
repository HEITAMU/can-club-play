export declare abstract class ScalableContainer {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _poolHandle: number;
    constructor();
    abstract tryShrink(): void;
    destroy(): void;
}
/**
 * @en ScalableContainerManager is a sequence container that stores ScalableContainers.
 * It will shrink all managed ScalableContainer in a fixed interval.
 */
declare class ScalableContainerManager {
    private _pools;
    private _lastShrinkPassed;
    /**
     * @en Shrink interval in seconds.
     */
    shrinkTimeSpan: number;
    constructor();
    /**
     * @en Add a ScalableContainer. Will add the same ScalableContainer instance once.
     * @param pool @en The ScalableContainer to add.
     */
    addContainer(pool: ScalableContainer): void;
    /**
     * @en Remove a ScalableContainer.
     * @param pool @en The ScalableContainer to remove.
     */
    removeContainer(pool: ScalableContainer): void;
    /**
     * @en Try to shrink all managed ScalableContainers.
     */
    tryShrink(): void;
    /**
     * @en An update function invoked every frame.
     * @param dt @en Delta time of frame interval in secondes.
     */
    update(dt: number): void;
}
/**
 * @en A global ScalableContainerManager instance.
 */
export declare const scalableContainerManager: ScalableContainerManager;
export {};
