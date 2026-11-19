import { js } from '../core';
import type { Component } from './component';
declare function stableRemoveInactive(iterator: any, flagToClear: any): void;
export type InvokeFunc = (...args: unknown[]) => void;
export declare class LifeCycleInvoker {
    static stableRemoveInactive: typeof stableRemoveInactive;
    /**
     * @engineInternal `_zero` is a protected property, we provide this public property for engine internal usage.
     */
    get zero(): js.array.MutableForwardIterator<any>;
    /**
     * @engineInternal `_neg` is a protected property, we provide this public property for engine internal usage.
     */
    get neg(): js.array.MutableForwardIterator<any>;
    /**
     * @engineInternal `_pos` is a protected property, we provide this public property for engine internal usage.
     */
    get pos(): js.array.MutableForwardIterator<any>;
    protected _zero: js.array.MutableForwardIterator<any>;
    protected _neg: js.array.MutableForwardIterator<any>;
    protected _pos: js.array.MutableForwardIterator<any>;
    protected _invoke: InvokeFunc;
    constructor(invokeFunc: InvokeFunc);
}
export declare class OneOffInvoker extends LifeCycleInvoker {
    add(comp: Component): void;
    remove(comp: Component): void;
    cancelInactive(flagToClear: number): void;
    invoke(): void;
}
declare class ReusableInvoker extends LifeCycleInvoker {
    constructor(invokeFunc: InvokeFunc);
    add(comp: Component): void;
    remove(comp: Component): void;
    invoke(dt: number): void;
}
export declare function createInvokeImplJit(code: string, useDt?: any, ensureFlag?: any): (iterator: any, dt: any) => void;
export declare function createInvokeImpl(singleInvoke: any, fastPath: any, ensureFlag?: any): (iterator: any, dt: any) => void;
export declare const invokeOnEnable: (iterator: any) => void;
/**
 * @en The Manager for Component's life-cycle methods.
 * It collaborates with [[NodeActivator]] to schedule and invoke life cycle methods for components
 * @zh 组件生命周期函数的调度器。
 * 它和 [[NodeActivator]] 一起调度并执行组件的生命周期函数。
 */
export declare class ComponentScheduler {
    /**
     * @en The invoker of `start` callback
     * @zh `start` 回调的调度器
     */
    startInvoker: OneOffInvoker;
    /**
     * @en The invoker of `update` callback
     * @zh `update` 回调的调度器
     */
    updateInvoker: ReusableInvoker;
    /**
     * @en The invoker of `lateUpdate` callback
     * @zh `lateUpdate` 回调的调度器
     */
    lateUpdateInvoker: ReusableInvoker;
    private _deferredComps;
    private _updating;
    constructor();
    /**
     * @en Cancel all future callbacks, including `start`, `update` and `lateUpdate`
     * @zh 取消所有未来的函数调度，包括 `start`，`update` 和 `lateUpdate`
     */
    unscheduleAll(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onEnabled(comp: Component): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onDisabled(comp: Component): void;
    /**
     * @en Enable a component
     * @zh 启用一个组件
     * @param comp The component to be enabled
     * @param invoker The invoker which is responsible to schedule the `onEnable` call
     */
    enableComp(comp: Component, invoker?: OneOffInvoker): void;
    /**
     * @en Disable a component
     * @zh 禁用一个组件
     * @param comp The component to be disabled
     */
    disableComp(comp: Component): void;
    /**
     * @en Process start phase for registered components
     * @zh 为当前注册的组件执行 start 阶段任务
     */
    startPhase(): void;
    /**
     * @en Process update phase for registered components
     * @zh 为当前注册的组件执行 update 阶段任务
     * @param dt @en Time passed after the last frame in seconds @zh 距离上一帧的时间，以秒计算
     */
    updatePhase(dt: number): void;
    /**
     * @en Process late update phase for registered components
     * @zh 为当前注册的组件执行 late update 阶段任务
     * @param dt @en Time passed after the last frame in seconds @zh 距离上一帧的时间，以秒计算
     */
    lateUpdatePhase(dt: number): void;
    private _startForNewComps;
    private _scheduleImmediate;
    private _deferredSchedule;
}
export {};
