import { AnimationClip } from '../../animation-clip';
import { createEval } from '../create-eval';
import type { ClipStatus } from '../state-machine/state-machine-eval';
import { Motion, MotionEval, MotionPort } from './motion';
import { Pose } from '../../core/pose';
import { AnimationGraphEvaluationContext, AnimationGraphBindingContext } from '../animation-graph-context';
export declare class ClipMotion extends Motion {
    clip: AnimationClip | null;
    [createEval](context: AnimationGraphBindingContext, ignoreEmbeddedPlayers: boolean): ClipMotionEval | null;
    clone(): ClipMotion;
}
declare const evaluatePortTag: unique symbol;
declare class ClipMotionEval implements MotionEval {
    /**
     * @internal
     */
    __DEBUG__ID__?: string;
    runtimeId?: number;
    constructor(context: AnimationGraphBindingContext, clip: AnimationClip, ignoreEmbeddedPlayers: boolean);
    get duration(): number;
    createPort(): MotionPort;
    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;
    [evaluatePortTag](progress: number, context: AnimationGraphEvaluationContext): Pose;
    overrideClips(context: AnimationGraphBindingContext): void;
    reenter(): void;
    /**
     * Preserved here for clip overriding.
     */
    private _originalClip;
    /**
     * Actual clip used. Will be equal to `this._originalClip` if not being override.
     */
    private _clip;
    private _clipEval;
    private _clipEmbeddedPlayerEval;
    private _frameEventEval;
    private _wrapInfo;
    private _duration;
    private _ignoreEmbeddedPlayers;
    private _setClip;
}
export {};
