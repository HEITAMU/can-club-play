/// <reference types="./@types/globals" />
import { CallbacksInvoker } from '../core/event/callbacks-invoker';
import { Event, EventMouse, EventTouch } from '../input/types';
import type { Node } from './node';
import { Component } from './component';
import { NodeEventType } from './node-event';
import { SystemEventTypeUnion } from '../input/types/event-enum';
export interface IMask {
    index: number;
    comp: Component;
}
export declare enum DispatcherEventType {
    ADD_POINTER_EVENT_PROCESSOR = 0,
    REMOVE_POINTER_EVENT_PROCESSOR = 1,
    MARK_LIST_DIRTY = 2
}
/**
 * @en The event processor for Node
 * @zh 节点事件类。
 */
export declare class NodeEventProcessor {
    /**
     * @internal
     */
    static _maskComp: Constructor<Component> | null;
    /**
     * @internal
     */
    static callbacksInvoker: CallbacksInvoker<DispatcherEventType>;
    /**
     * Whether the node event is enabled
     */
    get isEnabled(): boolean;
    /**
     * The list of claimed touch ids
     */
    claimedTouchIdList: number[];
    /**
     * The masks in the parent chain of the node
     */
    maskList: IMask[] | null;
    /**
     * To cache camera priority.
     */
    cachedCameraPriority: number;
    /**
     * To record whether the mouse move in at the previous mouse event.
     */
    previousMouseIn: boolean;
    /**
     * The owner of node event processor.
     */
    get node(): Node;
    /**
     * Target in bubbling phase.
     */
    bubblingTarget: CallbacksInvoker<SystemEventTypeUnion> | null;
    /**
     * Target in capturing phase.
     */
    capturingTarget: CallbacksInvoker<SystemEventTypeUnion> | null;
    /**
     * Whether the node has registered the mouse event callback
     */
    shouldHandleEventMouse: boolean;
    /**
     * Whether the node has registered the touch event callback
     */
    shouldHandleEventTouch: boolean;
    private _dispatchingTouch;
    private _isEnabled;
    private _node;
    private _isMouseLeaveWindow;
    constructor(node: Node);
    /**
     * Set enable state of the node event processor
     * @param value Enable state
     * @param recursive Recursively set the state or not
     * @returns void
     */
    setEnabled(value: boolean, recursive?: boolean): void;
    reattach(): void;
    destroy(): void;
    on(type: NodeEventType, callback: AnyFunction, target?: unknown, useCapture?: boolean): AnyFunction;
    once(type: NodeEventType, callback: AnyFunction, target?: unknown, useCapture?: boolean): AnyFunction;
    off(type: NodeEventType, callback?: AnyFunction, target?: unknown, useCapture?: boolean): void;
    targetOff(target: unknown): void;
    emit(type: SystemEventTypeUnion, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    dispatchEvent(event: Event): void;
    hasEventListener(type: SystemEventTypeUnion, callback?: AnyFunction, target?: unknown): boolean;
    /**
     * @zh
     * 获得所提供的事件类型在目标捕获阶段监听的所有目标。
     * 捕获阶段包括从根节点到目标节点的过程。
     * 结果保存在数组参数中，并且必须从子节点排序到父节点。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param array - 接收目标的数组。
     */
    getCapturingTargets(type: string, targets: Node[]): void;
    /**
     * @zh
     * 获得所提供的事件类型在目标冒泡阶段监听的所有目标。
     * 冒泡阶段目标节点到根节点的过程。
     * 结果保存在数组参数中，并且必须从子节点排序到父节点。
     *
     * @param type - 一个监听事件类型的字符串。
     * @param array - 接收目标的数组。
     */
    getBubblingTargets(type: string, targets: Node[]): void;
    onUpdatingSiblingIndex(): void;
    private _searchComponentsInParent;
    private _attachMask;
    private _isTouchEvent;
    private _isMouseEvent;
    private _hasTouchListeners;
    private _hasMouseListeners;
    private _hasPointerListeners;
    private _tryEmittingAddEvent;
    /**
     * Fix when reigster 'once' event callback, `this.off` method isn't be invoked after event is emitted.
     * We need to inject some nodeEventProcessor's logic into the `callbacksInvoker.off` method.
     * @returns {CallbacksInvoker<SystemEventTypeUnion>} decorated callbacks invoker
     */
    private _newCallbacksInvoker;
    /**
     * @engineInternal
     * @mangle
     */
    _handleEventMouse(eventMouse: EventMouse): boolean;
    private _handleMouseDown;
    private _handleMouseMove;
    private _handleMouseUp;
    private _handleMouseWheel;
    private _handleMouseLeave;
    private _handleMouseEnter;
    /**
     * @engineInternal
     * @mangle
     */
    _handleEventTouch(eventTouch: EventTouch): boolean | void;
    private _handleTouchStart;
    private _handleTouchMove;
    private _handleTouchEnd;
    private _handleTouchCancel;
}
