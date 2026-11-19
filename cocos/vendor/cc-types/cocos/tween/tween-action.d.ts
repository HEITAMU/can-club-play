import { ActionInterval } from './actions/action-interval';
import { ITweenOption } from './export-api';
export interface IInternalTweenOption<T extends object> extends ITweenOption<T> {
    /**
     * @en
     * Whether to use relative value calculation method during easing process
     * @zh
     * 缓动过程中是否采用相对值计算的方法
     */
    relative?: boolean;
}
export declare class TweenAction<T extends object> extends ActionInterval {
    private _opts;
    private _props;
    private _originProps;
    private _reversed;
    constructor(duration: number, props: any, opts?: IInternalTweenOption<T>);
    get relative(): boolean;
    clone(): TweenAction<T>;
    reverse(): TweenAction<T>;
    startWithTarget<U>(target: U | null): void;
    stop(): void;
    update(t: number): void;
    progress(start: number, end: number, current: number, t: number): number;
    isUnknownDuration(): boolean;
}
