import { Node } from '../../scene-graph';
import { Pose, TransformFilter } from '../core/pose';
import { TransformArray } from '../core/transform-array';
import { TransformHandle, AuxiliaryCurveHandle } from '../core/animation-handle';
import { Transform } from '../core/transform';
import { VarInstance } from './variable';
import { AnimationMask } from './animation-mask';
import { AnimationController } from './animation-controller';
import { TransformSpace } from './pose-graph/pose-nodes/transform-space';
import { PoseStashAllocator, RuntimeStashView } from './pose-graph/stash/runtime-stash';
import { RuntimeMotionSyncManager } from './pose-graph/motion-sync/runtime-motion-sync';
import { ReadonlyClipOverrideMap } from './clip-overriding';
export type VarRegistry = Record<string, VarInstance>;
export type TriggerResetter = (triggerName: string) => void;
export interface EvaluationTimeAuxiliaryCurveView {
    get(curveName: string): number;
}
/**
 * The binding context of an animation graph.
 */
export declare class AnimationGraphBindingContext {
    private _controller;
    constructor(origin: Node, poseLayoutMaintainer: AnimationGraphPoseLayoutMaintainer, varRegistry: VarRegistry, _controller: AnimationController);
    /**
     * The origin node.
     *
     * The origin node is the origin from where the animation target start to resolve.
     * It's now definitely the node hosting the running animation controller component.
     */
    get origin(): Node;
    /**
     * The animation controller component currently running the animation graph.
     */
    get controller(): AnimationController;
    /**
     * A free function to reset specified trigger.
     * @internal This function should only be accessed by the builtin state machine.
     */
    get triggerResetter(): TriggerResetter;
    get clipOverrides(): ReadonlyClipOverrideMap | undefined;
    /**
     * Returns if current context expects to have an additive pose.
     */
    get additive(): boolean;
    bindTransform(bone: string): TransformHandle | null;
    bindTransformByName(bone: string): TransformHandle | null;
    getBoneChildren(bone: string): string[];
    getParentBoneNameByName(bone: string): string | null | undefined;
    bindAuxiliaryCurve(name: string): AuxiliaryCurveHandle;
    getEvaluationTimeAuxiliaryCurveView(): EvaluationTimeAuxiliaryCurveView;
    getVar(id: string): VarInstance | undefined;
    /**
     * Pushes the `additive` flag. A later `_popAdditiveFlag` is required to pop the change.
     * @internal
     */
    _pushAdditiveFlag(additive: boolean): void;
    /**
     * Undo last `_pushAdditiveFlag`.
     * @internal
     */
    _popAdditiveFlag(): void;
    /** @internal */
    _integrityCheck(): boolean;
    get stashView(): RuntimeStashView;
    get motionSyncManager(): RuntimeMotionSyncManager;
    /**
     * @internal
     */
    _setLayerWideContextProperties(stashView: RuntimeStashView, motionSyncManager: RuntimeMotionSyncManager): void;
    /**
     * @internal
     */
    _unsetLayerWideContextProperties(): void;
    /**
     * @internal
     */
    _setClipOverrides(clipOverrides: ReadonlyClipOverrideMap | undefined): void;
    private _origin;
    private _layoutMaintainer;
    private _varRegistry;
    /** At least has one. */
    private _additiveFlagStack;
    private _triggerResetter;
    private _isLayerWideContextPropertiesSet;
    private _stashView;
    private _motionSyncManager;
    private _clipOverrides;
    private _resetTrigger;
}
export declare class AuxiliaryCurveRegistry {
    names(): IterableIterator<string>;
    has(name: string): boolean;
    get(name: string): number;
    set(name: string, value: number): void;
    private _namedCurves;
}
export declare enum LayoutChangeFlag {
    /**
     * If this flag is set, means the transform count and order has been changed.
     */
    TRANSFORM_COUNT = 1,
    /**
     * If this flag is set, means the transform count is not change but the order has been changed.
     */
    TRANSFORM_ORDER = 2,
    /**
     * If this flag is set, means the auxiliary curve count has been changed.
     */
    AUXILIARY_CURVE_COUNT = 4
}
export declare class AnimationGraphPoseLayoutMaintainer {
    /**
     * @param origin This node and all nodes under this node can be bound.
     */
    constructor(origin: Node, auxiliaryCurveRegistry: AuxiliaryCurveRegistry);
    get transformCount(): number;
    get auxiliaryCurveCount(): number;
    get auxiliaryCurveRegistry(): {
        get(name: string): number;
    };
    getOrCreateTransformBinding(node: Node): TransformHandleInternal | null;
    private _getOrCreateTransformBinding;
    getOrCreateAuxiliaryCurveBinding(name: string): AuxiliaryCurveHandleInternal;
    createEvaluationContext(): AnimationGraphEvaluationContext;
    resetPoseStashAllocator(allocator: DeferredPoseStashAllocator): void;
    createTransformFilter(mask: Readonly<AnimationMask>): TransformFilter;
    fetchDefaultTransforms(transforms: TransformArray): void;
    apply(pose: Pose): void;
    /**
     * @engineInternal
     */
    _destroyTransformHandle(index: number): void;
    /**
     * @engineInternal
     */
    _destroyAuxiliaryCurveHandle(index: number): void;
    startBind(): void;
    endBind(): number;
    private _origin;
    private _auxiliaryCurveRegistry;
    private _auxiliaryCurveRecords;
    private _transformRecords;
    private _parentTable;
    private _bindStarted;
    private _transformCountBeforeBind;
    private _auxiliaryCurveCountBeforeBind;
}
export declare const defaultTransformsTag: unique symbol;
/**
 * The settle context for animation graph building blocks(state machine/pose node/motion...etc).
 */
export declare class AnimationGraphSettleContext {
    private _layoutMaintainer;
    constructor(_layoutMaintainer: AnimationGraphPoseLayoutMaintainer);
    /**
     * Gets the number of transforms in pose.
     */
    get transformCount(): number;
    /**
     * Creates a transform filter expressing specified animation mask effect.
     * @param mask Animation mask.
     * @returns Result transform filter.
     */
    createTransformFilter(mask: Readonly<AnimationMask>): TransformFilter;
}
declare class AnimationGraphEvaluationContext {
    constructor(transformCount: number, metaValueCount: number, parentTable: readonly number[], componentNode: Node);
    destroy(): void;
    /**
     * @engineInternal
     */
    readonly [defaultTransformsTag]: TransformArray;
    get allocatedPoseCount(): number;
    get parentTable(): readonly number[];
    pushDefaultedPose(): Pose;
    pushDefaultedPoseInComponentSpace(): Pose;
    pushZeroDeltaPose(): Pose;
    pushDuplicatedPose(src: Pose): Pose;
    popPose(): void;
    /**
     * @internal
     */
    get _stackSize_debugging(): number;
    /**
     * @internal
     */
    _isStackTopPose_debugging(pose: Pose): boolean;
    /** @internal */
    _poseTransformsSpaceLocalToComponent(pose: Pose): void;
    /** @internal */
    _poseTransformsSpaceComponentToLocal(pose: Pose): void;
    _convertPoseSpaceTransformToTargetSpace(transform: Transform, outTransformSpace: TransformSpace, pose: Pose, poseTransformIndex: number): Transform;
    _convertTransformToPoseTransformSpace(transform: Transform, transformSpace: TransformSpace, pose: Pose, poseTransformIndex: number): Transform;
    private _poseAllocator;
    private _parentTable;
    private _componentNode;
    private _cacheComponentToWorldTransform;
    private _getComponentToWorldTransform;
    private _getLocalToComponentTransform;
    private _getLocalToWorldTransform;
}
export type { AnimationGraphEvaluationContext };
export interface PoseLayout {
    transformCount: number;
    auxiliaryCurveCount: number;
}
declare class TransformHandleInternal implements TransformHandle {
    __brand: TransformHandle['__brand'];
    constructor(host: AnimationGraphPoseLayoutMaintainer, index: number);
    index: number;
    destroy(): void;
    private _host;
}
declare class AuxiliaryCurveHandleInternal implements AuxiliaryCurveHandle {
    constructor(host: AnimationGraphPoseLayoutMaintainer, index: number);
    __brand: AuxiliaryCurveHandle['__brand'];
    index: number;
    destroy(): void;
    private _host;
}
/**
 * The update context for animation graph building blocks(state machine/pose node/motion...etc).
 */
export interface AnimationGraphUpdateContext {
    /**
     * Delta time to update.
     */
    readonly deltaTime: number;
    /**
     * Indicative weight of the updating target.
     *
     * The updating target shall not, for example, weight the result pose by this weight.
     */
    readonly indicativeWeight: number;
}
/**
 * Utility class to generate animation graph context.
 *
 * The result of each method of this class is kept available until next call on any of these methods.
 */
export declare class AnimationGraphUpdateContextGenerator {
    /**
     * Generates a context which has specified attributes.
     * @param deltaTime The result context's `.deltaTime`.
     * @param indicativeWeight The result context's `.indicativeWeight`.
     * @returns The result context.
     */
    generate(deltaTime: number, indicativeWeight: number): AnimationGraphUpdateContext;
    /**
     * Forks specified `base` context so that the result context is same with the base
     * except that the result indicative weight is taken from base and multiplied by `subWeight`.
     * @param base The base context.
     * @param subWeight The sub weight.
     * @returns The result context.
     */
    forkSubWeight(base: AnimationGraphUpdateContext, subWeight: number): void;
    private readonly _context;
}
export declare class DeferredPoseStashAllocator implements PoseStashAllocator {
    get allocatedPoseCount(): number;
    /** @internal */
    _reset(transformCount: number, auxiliaryCurveCount: number): void;
    allocatePose(): Pose;
    destroyPose(pose: Pose): void;
    private _allocator;
}
