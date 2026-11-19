import { FiniteTimeAction } from './action';
import type { TweenUpdateUntilCallback } from '../tween';
export declare class ActionUnknownDuration<T extends object, Args extends any[]> extends FiniteTimeAction {
    private _finished;
    private _cb;
    private _args;
    constructor(cb: TweenUpdateUntilCallback<T, Args>, args: Args);
    clone(): ActionUnknownDuration<T, Args>;
    reverse(): ActionUnknownDuration<T, Args>;
    step(dt: number): void;
    update(t: number): void;
    isDone(): boolean;
    isUnknownDuration(): boolean;
    toString(): string;
}
