import { AnimationGraph } from './animation-graph';
import type { Node } from '../../scene-graph/node';
import { Value } from './variable';
import { VariableType } from './parametric';
import type { AnimationController } from './animation-controller';
import { ClipStatus, MotionStateStatus, TransitionStatus } from './state-machine/state-machine-eval';
import { ReadonlyClipOverrideMap } from './clip-overriding';
export declare class AnimationGraphEval {
    private _currentTransitionCache;
    constructor(graph: AnimationGraph, root: Node, controller: AnimationController, clipOverrides: ReadonlyClipOverrideMap | null);
    destroy(): void;
    _destroyAfterException_debugging(): void;
    get layerCount(): number;
    update(deltaTime: number): void;
    getVariables(): Iterable<Readonly<[string, Readonly<{
        type: VariableType;
    }>]>>;
    getCurrentStateStatus(layer: number): Readonly<MotionStateStatus> | null;
    getCurrentClipStatuses(layer: number): Iterable<Readonly<ClipStatus>>;
    getCurrentTransition(layer: number): Readonly<TransitionStatus> | null;
    getNextStateStatus(layer: number): Readonly<MotionStateStatus> | null;
    getNextClipStatuses(layer: number): Iterable<Readonly<ClipStatus>>;
    getValue(name: string): Value | undefined;
    setValue(name: string, value: Value): void;
    getLayerWeight(layerIndex: number): number;
    setLayerWeight(layerIndex: number, weight: number): void;
    overrideClips(overrides: ReadonlyClipOverrideMap): void;
    getAuxiliaryCurveValue(curveName: string): number;
    private _rootPoseNode;
    private _varInstances;
    private _hasAutoTrigger;
    private _auxiliaryCurveRegistry;
    private _poseLayoutMaintainer;
    private _bindingContext;
    private _settleContext;
    /**
     * Preserved here for clip overriding.
     */
    private _root;
    private _evaluationContext;
    private _poseStashAllocator;
    private _rootUpdateContextGenerator;
    private _initializeContexts;
    private _updateAfterPossiblePoseLayoutChange;
    private _createOrUpdateTransformFilters;
}
export type { VarInstance } from './variable';
