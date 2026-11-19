import { StateMachine, State, ProceduralPoseState } from '../animation-graph';
import { MotionPort } from '../motion';
import { ConditionEval } from './condition';
import { MotionState } from './motion-state';
import { AnimationClip } from '../../animation-clip';
import type { AnimationController } from '../animation-controller';
import { InteractiveState } from './state';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphUpdateContext, AnimationGraphSettleContext } from '../animation-graph-context';
import { Pose } from '../../core/pose';
import { AnimationGraphEventBinding } from '../event/event-binding';
/**
 * The max transitions can be matched in single frame.
 *
 * @internal Only exported for test usage.
 */
export declare const MAX_TRANSITIONS_PER_FRAME = 16;
/**
 * @en
 * Runtime status of a transition.
 * @zh
 * 过渡的运行状态。
 */
export interface TransitionStatus {
    /**
     * @en
     * The duration of the transition.
     * @zh
     * 过渡的周期。
     */
    duration: number;
    /**
     * @en
     * The progress of the transition.
     * @zh
     * 过渡的进度。
     */
    time: number;
}
/**
 * @en
 * Runtime clip status of a motion state.
 * @zh
 * 动作状态中包含的剪辑的运行状态。
 */
export interface ClipStatus {
    /**
     * @en
     * The clip object.
     * @zh
     * 剪辑对象。
     */
    clip: AnimationClip;
    /**
     * @en
     * The clip's weight.
     * @zh
     * 剪辑的权重。
     */
    weight: number;
}
/**
 * @en
 * Runtime status of a motion state.
 * @zh
 * 动作状态的运行状态。
 */
export interface MotionStateStatus {
    /**
     * For testing.
     * TODO: remove it.
     * @internal
     */
    __DEBUG_ID__?: string;
    /**
     * @en
     * The normalized time of the state.
     * It would be the fraction part of `elapsed-time / duration` if elapsed time is non-negative,
     * and would be 1 plus the fraction part of `(elapsed-time / duration)` otherwise.
     * This is **NOT** the clip's progress if the state is not a clip motion or its wrap mode isn't loop.
     * @zh
     * 状态的规范化时间。
     * 如果流逝的时间是非负的，它就是 `流逝时间 / 周期` 的小数部分；否则，它是 `(流逝时间 / 周期)` 的小数部分加 1。
     * 它并不一定代表剪辑的进度，因为该状态可能并不是一个剪辑动作，或者它的循环模式并非循环。
     */
    progress: number;
}
declare class TopLevelStateMachineEvaluation {
    name: string;
    passthroughWeight: number;
    constructor(stateMachine: StateMachine, name: string, context: AnimationGraphBindingContext);
    /**
     * Indicates if this layer's top level graph reached its exit.
     */
    get exited(): boolean;
    settle(context: AnimationGraphSettleContext): void;
    reenter(): void;
    update(context: AnimationGraphUpdateContext): void;
    evaluate(context: AnimationGraphEvaluationContext): Pose;
    getCurrentStateStatus(): Readonly<MotionStateStatus> | null;
    getCurrentClipStatuses(): Iterable<Readonly<ClipStatus>>;
    getCurrentTransition(transitionStatus: TransitionStatus): boolean;
    getNextStateStatus(): Readonly<MotionStateStatus> | null;
    getNextClipStatuses(): Iterable<Readonly<ClipStatus>>;
    overrideClips(context: AnimationGraphBindingContext): void;
    private _controller;
    /**
     * Preserved here for clip overriding.
     */
    private _motionStates;
    /**
     * Preserved here for settle stage.
     */
    private readonly _proceduralPoseStates;
    private _topLevelEntry;
    private _topLevelExit;
    private _currentNode;
    private _pendingTransitionPath;
    private _activatedTransitions;
    private _activatedTransitionPool;
    private _triggerReset;
    private _updateContextGenerator;
    private _conditionEvaluationContext;
    private _additive;
    private _addStateMachine;
    /**
     * Loop match transitions util no match,
     * or util `MAX_TRANSITIONS_PER_FRAME` is reached(in case of circular transition formed or too long transition path).
     */
    private _loopMatchTransitions;
    private _resetStateTickFlagsAndWeights;
    private _commitStateUpdates;
    private _commitStateUpdate;
    private _sample;
    private _pushNullishPose;
    /**
     * Searches for a transition which should be performed.
     * @param sourceState The transition source state.
     * @returns
     */
    private _matchNextTransition;
    /**
     * @param realNode Is used:
     * - to determinate the starting state machine from where the any states are matched;
     * - so we can solve transitions' relative durations.
     */
    private _matchAnyScoped;
    /**
     * Searches for a transition which should be performed
     * if specified node updates for no more than `deltaTime` and less than `result.requires`.
     * We solve the relative durations of transitions based on duration of `realNode`.
     *
     * @returns The transition matched, or null if there's no matched transition.
     */
    private _matchTransition;
    private _activateTransition;
    /**
     * Update transitions, also update states within(includes the case of no transition).
     * @param deltaTime Time piece.
     * @returns
     */
    private _updateActivatedTransitions;
    /**
     * Drops the transitions from `0` to `lastTransitionIndex` in `this._activatedTransitions`.
     * @note This methods may modifies the length of `this._activatedTransitions`.
     */
    private _dropActivatedTransitions;
    private _resetTriggersOnTransition;
    private _resetTrigger;
    private _callEnterMethods;
    private _callExitMethods;
    private _emit;
}
export { TopLevelStateMachineEvaluation };
declare enum NodeKind {
    entry = 0,
    exit = 1,
    any = 2,
    animation = 3,
    empty = 4,
    procedural = 5
}
export declare class StateEval {
    /**
     * @internal
     */
    __DEBUG_ID__?: string;
    stateMachine: StateMachineInfo;
    constructor(node: {
        name: string;
    });
    readonly name: string;
    outgoingTransitions: TransitionEval[];
    /**
     * The absolute weight of this state.
     */
    get absoluteWeight(): number;
    /**
     * The count which counts how many places referencing this state:
     * - If the state is activated as current state, the count increased.
     * - If the state is activated as a transition destination, the count increased.
     */
    get activeReferenceCount(): number;
    setPrefix_debug(prefix: string): void;
    addTransition(transition: TransitionEval): void;
    /**
     * Increases an active reference.
     */
    increaseActiveReference(): void;
    /**
     * Decrease an active reference.
     */
    decreaseActiveReference(): void;
    resetTickFlagsAndWeight(): void;
    increaseAbsoluteWeight(weight: number): void;
    testTickFlag(flag: StateTickFlag): boolean;
    setTickFlag(flag: StateTickFlag): void;
    private _activeReferenceCount;
    private _tickFlags;
    private _absoluteWeight;
    private _checkActivated;
}
declare class EventifiedStateEval extends StateEval {
    constructor(state: MotionState | ProceduralPoseState);
    transitionInEventBinding: AnimationGraphEventBinding | undefined;
    transitionOutEventBinding: AnimationGraphEventBinding | undefined;
}
declare enum StateTickFlag {
    /**
     * The state has been updated in this tick?
     */
    UPDATED = 1,
    /**
     * The state has been evaluated in this tick?
     */
    EVALUATED = 2
}
declare class InstantiatedComponents {
    constructor(node: InteractiveState);
    callMotionStateEnterMethods(controller: AnimationController, status: Readonly<MotionStateStatus>): void;
    callMotionStateUpdateMethods(controller: AnimationController, status: Readonly<MotionStateStatus>): void;
    callMotionStateExitMethods(controller: AnimationController, status: Readonly<MotionStateStatus>): void;
    callStateMachineEnterMethods(controller: AnimationController): void;
    callStateMachineExitMethods(controller: AnimationController): void;
    private _components;
    private _callMotionStateCallbackIfNonDefault;
    private _callStateMachineCallbackIfNonDefault;
}
interface StateMachineInfo {
    parent: StateMachineInfo | null;
    entry: SpecialStateEval;
    exit: SpecialStateEval;
    any: SpecialStateEval;
    components: InstantiatedComponents | null;
}
/**
 * Track the evaluation of a virtual motion state-machine.
 */
declare class VMSMEval {
    constructor(state: MotionState, context: AnimationGraphBindingContext);
    components: InstantiatedComponents;
    get duration(): number;
    get speed(): number;
    get entry(): VMSMInternalState;
    get stateMachine(): StateMachineInfo;
    set stateMachine(value: StateMachineInfo);
    setPrefix_debug(prefix: string): void;
    addTransition(transition: Readonly<TransitionEval>): void;
    getClipStatuses(baseWeight: number): Iterable<Readonly<ClipStatus>>;
    overrideClips(context: AnimationGraphBindingContext): void;
    private _source;
    private _baseSpeed;
    private _speed;
    private _publicState;
    private _privateState;
    private _stateMachine;
    private _debugId;
    private _setSpeedMultiplier;
}
declare class VMSMInternalState extends EventifiedStateEval {
    readonly kind = NodeKind.animation;
    constructor(container: VMSMEval, containerState: MotionState, port: MotionPort | undefined);
    get duration(): number;
    get components(): InstantiatedComponents;
    get normalizedTime(): number;
    get time(): number;
    reenter(initialTimeNormalized: number): void;
    getStatus(): MotionStateStatus;
    getClipStatuses(baseWeight: number): Iterable<Readonly<ClipStatus>>;
    update(deltaTime: number, controller: AnimationController): void;
    evaluate(context: AnimationGraphEvaluationContext): Pose | null;
    private _container;
    private _progress;
    private _port;
    private readonly _statusCache;
}
export declare class SpecialStateEval extends StateEval {
    constructor(node: State, kind: SpecialStateEval['kind'], name: string);
    readonly kind: NodeKind.entry | NodeKind.exit | NodeKind.any;
}
export declare class EmptyStateEval extends StateEval {
    readonly kind = NodeKind.empty;
    constructor(node: State);
}
declare class ProceduralPoseStateEval extends EventifiedStateEval {
    readonly kind = NodeKind.procedural;
    elapsedTime: number;
    readonly statusCache: MotionStateStatus;
    constructor(state: ProceduralPoseState, context: AnimationGraphBindingContext);
    settle(context: AnimationGraphSettleContext): void;
    reenter(): void;
    update(context: AnimationGraphUpdateContext): void;
    evaluate(context: AnimationGraphEvaluationContext): Pose | null;
    getStatus(): MotionStateStatus;
    countMotionTime(): number;
    private _instantiatedPoseGraph;
    private readonly _statusCache;
    private _elapsedTime;
}
export type NodeEval = VMSMInternalState | SpecialStateEval | EmptyStateEval | ProceduralPoseStateEval;
interface TransitionEval {
    to: NodeEval;
    duration: number;
    normalizedDuration: boolean;
    conditions: ConditionEval[];
    exitConditionEnabled: boolean;
    exitCondition: number;
    destinationStart: number;
    relativeDestinationStart: boolean;
    /**
     * Bound triggers, once this transition satisfied. All triggers would be reset.
     */
    triggers: string[] | undefined;
    /**
     * Whether the transition is activated, if it has already been activated, it can not be activated(matched) again.
     */
    activated: boolean;
    startEventBinding: AnimationGraphEventBinding | undefined;
    endEventBinding: AnimationGraphEventBinding | undefined;
}
