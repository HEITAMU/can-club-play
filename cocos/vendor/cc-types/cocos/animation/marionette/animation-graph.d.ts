import { EditorExtendable } from '../../core';
import type { Condition } from './state-machine/condition';
import { OwnedBy, ownerSymbol } from './ownership';
import { VariableDescription, VariableType, VariableTypeValueTypeMap } from './variable';
import { MotionState } from './state-machine/motion-state';
import { State, InteractiveState } from './state-machine/state';
import { AnimationMask } from './animation-mask';
import { onAfterDeserializedTag } from '../../serialization/deserialize-symbols';
import { AnimationGraphLike } from './animation-graph-like';
import { PoseGraph } from './pose-graph/pose-graph';
import { AnimationGraphEventBinding } from './event/event-binding';
export { State };
declare class Transition extends EditorExtendable implements OwnedBy<StateMachine>, Transition {
    [ownerSymbol]: StateMachine | undefined;
    /**
     * The transition source.
     */
    from: State;
    /**
     * The transition target.
     */
    to: State;
    /**
     * The transition condition.
     */
    conditions: Condition[];
    constructor(from: State, to: State, conditions?: Condition[]);
    copyTo(that: Transition): void;
    [ownerSymbol]: StateMachine | undefined;
}
type TransitionView = Omit<Transition, 'from' | 'to'> & {
    readonly from: Transition['from'];
    readonly to: Transition['to'];
};
export type { TransitionView as Transition };
export type TransitionInternal = Transition;
declare class DurationalTransition extends Transition {
    /**
     * @en The start time of (final) destination motion state when this transition starts.
     * Its unit is seconds if `relativeDestinationStart` is `false`,
     * Otherwise, its unit is the duration of destination motion state.
     * @zh 此过渡开始时，（最终）目标动作状态的起始时间。
     * 如果 `relativeDestinationStart`为 `false`，其单位是秒，否则其单位是目标动作状态的周期。
     */
    destinationStart: number;
    /**
     * @en Determines the unit of destination start time. See `destinationStart`.
     * @zh 决定了目标起始时间的单位。见 `destinationStart`。
     */
    relativeDestinationStart: boolean;
    /**
     * @zh 过渡开始事件绑定，此处绑定的事件会在过渡开始时触发。
     * @en Transition start event binding. The event bound here will be triggered on the transition starts.
     */
    startEventBinding: AnimationGraphEventBinding;
    /**
     * @zh 过渡结束事件绑定，此处绑定的事件会在过渡结束时触发。
     * @en Transition end event binding. The event bound here will be triggered on the transition ends.
     */
    endEventBinding: AnimationGraphEventBinding;
    copyTo(that: DurationalTransition): void;
    [ownerSymbol]: StateMachine | undefined;
}
declare class AnimationTransition extends DurationalTransition {
    /**
     * The transition duration.
     * The unit of the duration is the real duration of transition source
     * if `relativeDuration` is `true` or seconds otherwise.
     */
    duration: number;
    /**
     * Determines the unit of transition duration. See `duration`.
     */
    relativeDuration: boolean;
    exitConditionEnabled: boolean;
    get exitCondition(): number;
    set exitCondition(value: number);
    copyTo(that: AnimationTransition): void;
    private _exitCondition;
}
type AnimationTransitionView = Omit<AnimationTransition, 'from' | 'to'> & {
    readonly from: AnimationTransition['from'];
    readonly to: AnimationTransition['to'];
};
export type { AnimationTransitionView as AnimationTransition };
export declare function isAnimationTransition(transition: TransitionView): transition is AnimationTransitionView;
export declare class EmptyState extends State {
    __brand: 'EmptyState';
}
export declare class EmptyStateTransition extends DurationalTransition {
    /**
     * The transition duration, in seconds.
     */
    duration: number;
    copyTo(that: EmptyStateTransition): void;
}
declare class ProceduralPoseState extends State {
    graph: PoseGraph;
    /**
     * @zh 状态进入事件绑定，此处绑定的事件会在状态机向该状态过渡时触发。
     * @en State entered event binding. The event bound here will be triggered
     * when the state machine starts to transition into this state.
     */
    transitionInEventBinding: AnimationGraphEventBinding;
    /**
     * @zh 状态离开事件绑定，此处绑定的事件会在状态机从该状态离开时触发。
     * @en State left event binding. The event bound here will be triggered
     * when the state machine starts to transition out from this state.
     */
    transitionOutEventBinding: AnimationGraphEventBinding;
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
    copyTo(that: MotionState): ProceduralPoseState;
}
type ProceduralPoseState_ = ProceduralPoseState;
declare const ProceduralPoseState_: typeof ProceduralPoseState;
export { ProceduralPoseState_ as ProceduralPoseState, };
declare class ProceduralPoseTransition extends DurationalTransition {
    /**
     * The transition duration, in seconds.
     */
    duration: number;
    copyTo(that: ProceduralPoseTransition): void;
}
type ProceduralPoseTransition_ = ProceduralPoseTransition;
declare const ProceduralPoseTransition_: typeof ProceduralPoseTransition;
export { ProceduralPoseTransition_ as ProceduralPoseTransition, };
export declare class StateMachine extends EditorExtendable {
    private _states;
    private _transitions;
    private _entryState;
    private _exitState;
    private _anyState;
    /**
     * @internal
     */
    _allowEmptyStates: boolean;
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
    constructor(allowEmptyStates?: boolean);
    [onAfterDeserializedTag](): void;
    get allowEmptyStates(): boolean;
    /**
     * The entry state.
     */
    get entryState(): State;
    /**
     * The exit state.
     */
    get exitState(): State;
    /**
     * The any state.
     */
    get anyState(): State;
    /**
     * Gets an iterator to all states within this graph.
     * @returns The iterator.
     */
    states(): Iterable<State>;
    /**
     * Gets an iterator to all transitions within this graph.
     * @returns The iterator.
     */
    transitions(): Iterable<Transition>;
    /**
     * Gets the transitions between specified states.
     * @param from Transition source.
     * @param to Transition target.
     * @returns Iterator to the transitions
     */
    getTransitionsBetween(from: State, to: State): Iterable<Transition>;
    /**
     * @en
     * Gets all transitions outgoing from specified state.
     * @zh
     * 获取从指定状态引出的所有过渡。
     * @param from @en The state. @zh 指定状态。
     * @returns @en Iterable to result transitions, in priority order. @zh 到结果过渡的迭代器，按优先级顺序。
     */
    getOutgoings(from: State): Iterable<Transition>;
    /**
     * Gets all incoming transitions of specified state.
     * @param to The state.
     * @returns Result transitions.
     */
    getIncomings(to: State): Iterable<Transition>;
    /**
     * Adds a motion state into this state machine.
     * @returns The newly created motion.
     */
    addMotion(): MotionState;
    /**
     * Adds a sub state machine into this state machine.
     * @returns The newly created state machine.
     */
    addSubStateMachine(): SubStateMachine;
    /**
     * Adds an empty state into this state machine.
     * @returns The newly created empty state.
     */
    addEmpty(): EmptyState;
    /**
     * @zh 向此状态机中添加一项姿势状态。
     * @en Adds an pose state into this state machine.
     * @returns @zh 新创建的姿势状态。 @en The newly created pose state.
     */
    addProceduralPoseState(): ProceduralPoseState;
    /**
     * Removes specified state from this state machine.
     * @param state The state to remove.
     */
    remove(state: State): void;
    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     */
    connect(from: MotionState, to: State, conditions?: Condition[]): AnimationTransitionView;
    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     */
    connect(from: EmptyState, to: State, conditions?: Condition[]): EmptyStateTransition;
    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     */
    connect(from: ProceduralPoseState, to: State, conditions?: Condition[]): ProceduralPoseTransition;
    /**
     * Connect two states.
     * @param from Source state.
     * @param to Target state.
     * @param condition The transition condition.
     * @throws `InvalidTransitionError` if:
     * - the target state is entry or any, or
     * - the source state is exit.
     */
    connect(from: State, to: State, conditions?: Condition[]): TransitionView;
    disconnect(from: State, to: State): void;
    removeTransition(removal: Transition): void;
    eraseOutgoings(from: State): void;
    eraseIncomings(to: State): void;
    eraseTransitionsIncludes(state: State): void;
    /**
     * @en
     * Adjusts the priority of a transition.
     *
     * To demonstrate, one can imagine a transition array sorted by their priority.
     * - If `diff` is zero, nothing's gonna happen.
     * - Negative `diff` raises the priority:
     *   `diff` number of transitions originally having higher priority than `adjusting`
     *   will then have lower priority than `adjusting`.
     * - Positive `diff` reduce the priority:
     *   `|diff|` number of transitions originally having lower priority than `adjusting`
     *   will then have higher priority than `adjusting`.
     *
     * If the number of transitions indicated by `diff`
     * is more than the actual one, the actual number would be taken.
     * @zh
     * 调整过渡的优先级。
     *
     * 为了说明，可以想象一个由优先级排序的过渡数组。
     * - 如果 `diff` 是 0，无事发生。
     * - 负的 `diff` 会提升该过渡的优先级：原本优先于 `adjusting` 的 `diff` 条过渡的优先级会设置为低于 `adjusting`。
     * - 正的 `diff` 会降低该过渡的优先级：原本优先级低于 `adjusting` 的 `|diff|` 条过渡会设置为优先于 `adjusting`。
     *
     * 如果 `diff` 指示的过渡数量比实际多，则会使用实际数量。
     *
     * @param adjusting @en The transition to adjust the priority. @zh 需要调整优先级的过渡。
     * @param diff @en Indicates how to adjust the priority. @zh 指示如何调整优先级。
     */
    adjustTransitionPriority(adjusting: Transition, diff: number): void;
    copyTo(that: StateMachine): void;
    clone(): StateMachine;
    private _addState;
}
export declare class SubStateMachine extends InteractiveState {
    constructor(allowEmptyStates?: boolean);
    get stateMachine(): StateMachine;
    copyTo(that: SubStateMachine): void;
    private _stateMachine;
}
declare class PoseGraphStash extends EditorExtendable {
    graph: PoseGraph;
}
export { PoseGraphStash };
export declare class Layer implements OwnedBy<AnimationGraph> {
    [ownerSymbol]: AnimationGraph | undefined;
    private _stateMachine;
    name: string;
    weight: number;
    mask: AnimationMask | null;
    additive: boolean;
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
    stashes(): Iterable<Readonly<[string, PoseGraphStash]>>;
    getStash(id: string): PoseGraphStash | undefined;
    addStash(id: string): PoseGraphStash;
    removeStash(id: string): void;
    renameStash(id: string, newId: string): void;
    /**
     * @marked_as_engine_private
     */
    constructor();
    get stateMachine(): StateMachine;
    private _stashes;
}
export declare enum LayerBlending {
    override = 0,
    additive = 1
}
/**
 * @en
 * An opacity type which denotes what the animation graph seems like outside the engine.
 * @zh
 * 一个非透明的类型，它是动画图在引擎外部的表示。
 */
export interface AnimationGraphRunTime {
    /**
     * @internal
     */
    readonly __brand: 'AnimationGraph';
}
export declare class AnimationGraph extends AnimationGraphLike implements AnimationGraphRunTime {
    readonly __brand: 'AnimationGraph';
    private _layers;
    private _variables;
    constructor();
    onLoaded(): void;
    get layers(): readonly Layer[];
    get variables(): Iterable<[string, VariableDescription]>;
    /**
     * Adds a layer.
     * @returns The new layer.
     */
    addLayer(): Layer;
    /**
     * Removes a layer.
     * @param index Index to the layer to remove.
     */
    removeLayer(index: number): void;
    /**
     * Adjusts the layer's order.
     * @param index
     * @param newIndex
     */
    moveLayer(index: number, newIndex: number): void;
    /**
     * Adds a variable into this graph.
     * @param name The variable's name.
     * @param type The variable's type.
     * @param initialValue Initial value.
     */
    addVariable<TVariableType extends VariableType>(name: string, type: TVariableType, initialValue?: VariableTypeValueTypeMap[TVariableType]): VariableDescription;
    removeVariable(name: string): void;
    getVariable(name: string): VariableDescription | undefined;
    /**
     * @zh 重命名一个变量。注意，所有对该变量的引用都不会修改。
     * 如果变量的原始名称不存在或者新的名称已存在，此方法不会做任何事。
     * 变量在图中的顺序会保持不变。
     * @en Renames an variable. Note, this won't changes any reference to the variable.
     * If the original name of the variable doesn't exists or
     * the new name has already existed, this method won't do anything.
     * The variable's order in the graph is also retained.
     * @param name @zh 要重命名的变量的名字。 @en The name of the variable to be renamed.
     * @param newName @zh 新的名字。 @en New name.
     */
    renameVariable(name: string, newName: string): void;
}
