import { Motion, MotionEval, MotionPort } from './motion';
import { ClipStatus } from '../state-machine/state-machine-eval';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from '../animation-graph-context';
import { Pose } from '../../core/pose';
export declare class AnimationBlendItem {
    motion: Motion | null;
    clone(): AnimationBlendItem;
    protected _copyTo(that: AnimationBlendItem): AnimationBlendItem;
}
export declare abstract class AnimationBlend extends Motion {
    name: string;
    copyTo(that: AnimationBlend): void;
}
export declare abstract class AnimationBlendEval implements MotionEval {
    runtimeId?: number;
    private _childEvaluators;
    private _weights;
    private _inputs;
    constructor(context: AnimationGraphBindingContext, ignoreEmbeddedPlayers: boolean, base: AnimationBlend, children: AnimationBlendItem[], inputs: number[]);
    createPort(): MotionPort;
    get childCount(): number;
    getChildWeight(childIndex: number): number;
    getChildMotionEval(childIndex: number): MotionEval | null;
    get duration(): number;
    getClipStatuses(baseWeight: number): Iterator<ClipStatus, any, undefined>;
    __evaluatePort(port: AnimationBlendPort, progress: number, context: AnimationGraphEvaluationContext): Pose;
    overrideClips(context: AnimationGraphBindingContext): void;
    setInput(value: number, index: number): void;
    protected doEval(): void;
    protected abstract eval(_weights: number[], _inputs: readonly number[]): void;
}
declare class AnimationBlendPort implements MotionPort {
    constructor(host: AnimationBlendEval, childPorts: readonly (MotionPort | null)[]);
    childPorts: readonly (MotionPort | null)[];
    evaluate(progress: number, context: AnimationGraphEvaluationContext): Pose;
    reenter(): void;
    private _host;
}
export declare function validateBlendParam(val: unknown, name: string): asserts val is number;
export {};
