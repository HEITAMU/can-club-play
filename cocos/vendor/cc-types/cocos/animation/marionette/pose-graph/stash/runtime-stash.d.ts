import { Pose } from '../../../core/pose';
import { PoseGraphStash } from '../../animation-graph';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../../animation-graph-context';
interface RuntimeStash {
    reenter(): void;
    requestUpdate(context: AnimationGraphUpdateContext): void;
    evaluate(context: AnimationGraphEvaluationContext): Pose | null;
}
declare class RuntimeStashRecord implements RuntimeStash {
    private _allocator;
    constructor(_allocator: PoseStashAllocator);
    set(stash: PoseGraphStash, context: AnimationGraphBindingContext): void;
    settle(context: AnimationGraphSettleContext): void;
    reset(): void;
    reenter(): void;
    requestUpdate(context: AnimationGraphUpdateContext): void;
    evaluate(context: AnimationGraphEvaluationContext): Pose | null;
    private _state;
    private _instantiatedPoseGraph;
    private _maxRequestedUpdateTime;
    private _evaluationCache;
    private _updateContextGenerator;
}
interface RuntimeStashView {
    bindStash(id: string): RuntimeStash | undefined;
}
export interface PoseStashAllocator {
    allocatePose(): Pose;
    destroyPose(pose: Pose): void;
}
export declare class RuntimeStashManager implements RuntimeStashView {
    constructor(allocator: PoseStashAllocator);
    bindStash(id: string): RuntimeStash;
    getStash(id: string): RuntimeStashRecord | undefined;
    addStash(id: string): void;
    setStash(id: string, stash: PoseGraphStash, context: AnimationGraphBindingContext): void;
    reset(): void;
    settle(context: AnimationGraphSettleContext): void;
    private _allocator;
    private _stashEvaluations;
}
export type { RuntimeStash, RuntimeStashView };
