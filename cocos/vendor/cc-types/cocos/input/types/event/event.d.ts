import { SystemEventTypeUnion } from '../event-enum';
/**
 * @en
 * Base class of all kinds of events.
 *
 * @zh
 * 所有事件对象的基类，包含事件相关基本信息。
 */
export declare class Event {
    /**
     * @en
     * Code for event without type.
     *
     * @zh
     * 没有类型的事件。
     */
    static NO_TYPE: string;
    /**
     * @en
     * The type code of Touch event.
     *
     * @zh
     * 触摸事件类型。
     *
     * @deprecated since v3.3, please use SystemEvent.EventType.TOUCH_START, SystemEvent.EventType.TOUCH_MOVE, SystemEvent.EventType.TOUCH_END and SystemEvent.EventType.TOUCH_CANCEL instead
     */
    static TOUCH: string;
    /**
     * @en
     * The type code of Mouse event.
     *
     * @zh
     * 鼠标事件类型。
     *
     * @deprecated since v3.3, please use SystemEvent.EventType.MOUSE_DOWN, SystemEvent.EventType.MOUSE_MOVE, SystemEvent.EventType.MOUSE_UP, SystemEvent.EventType.MOUSE_WHEEL, Node.EventType.MOUSE_ENTER and Node.EventType.MOUSE_LEAVE instead
     */
    static MOUSE: string;
    /**
     * @en
     * The type code of Keyboard event.
     *
     * @zh
     * 键盘事件类型。
     *
     * @deprecated since v3.3, please use SystemEvent.EventType.KEY_DOWN and SystemEvent.EventType.KEY_UP instead
     */
    static KEYBOARD: string;
    /**
     * @en
     * The type code of Acceleration event.
     *
     * @zh
     * 加速器事件类型。
     *
     * @deprecated since v3.3, please use SystemEvent.EventType.DEVICEMOTION instead
     */
    static ACCELERATION: string;
    /**
     * @en
     * Events not currently dispatched are in this phase.
     *
     * @zh
     * 尚未派发事件阶段。
     */
    static NONE: number;
    /**
     * @en
     * The capturing phase comprises the journey from the root to the last node before the event target's node
     * [markdown](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
     *
     * @zh
     * 捕获阶段，包括事件目标节点之前从根节点到最后一个节点的过程。
     */
    static CAPTURING_PHASE: number;
    /**
     * @en
     * The target phase comprises only the event target node
     * [markdown] (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
     *
     * @zh
     * 目标阶段仅包括事件目标节点。
     */
    static AT_TARGET: number;
    /**
     * @en
     * The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
     * [markdown] (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
     *
     * @zh
     * 冒泡阶段， 包括回程遇到到层次根节点的任何后续节点。
     */
    static BUBBLING_PHASE: number;
    /**
     * @en
     * The name of the event
     *
     * @zh
     * 事件类型。
     */
    type: SystemEventTypeUnion;
    /**
     * @en
     * Indicate whether the event bubbles up through the hierarchy or not.
     *
     * @zh
     * 表示该事件是否进行冒泡。
     */
    bubbles: boolean;
    /**
     * @en
     * A reference to the target to which the event was originally dispatched.
     *
     * @zh
     * 最初事件触发的目标。
     */
    target: any;
    /**
     * @en
     * A reference to the currently registered target for the event.
     *
     * @zh
     * 当前目标。
     */
    currentTarget: any;
    /**
     * @en
     * Indicates which phase of the event flow is currently being evaluated.
     * Returns an integer value represented by 4 constants:
     *  - Event.NONE = 0
     *  - Event.CAPTURING_PHASE = 1
     *  - Event.AT_TARGET = 2
     *  - Event.BUBBLING_PHASE = 3
     * The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
     * [markdown](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
     *
     * @zh
     * 事件阶段。
     */
    eventPhase: number;
    /**
     * @en
     * Stops propagation for current event.
     *
     * @zh
     * 停止传递当前事件。
     */
    propagationStopped: boolean;
    /**
     * @en
     * Stops propagation for current event immediately,
     * the event won't even be dispatched to the listeners attached in the current target.
     *
     * @zh
     * 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。
     */
    propagationImmediateStopped: boolean;
    /**
     * @param type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
     * @param bubbles - A boolean indicating whether the event bubbles up through the tree or not
     */
    constructor(type: SystemEventTypeUnion, bubbles?: boolean);
    /**
     * @en
     * Reset the event for being stored in the object pool.
     *
     * @zh
     * 重置事件对象以便在对象池中存储。
     */
    unuse(): void;
    /**
     * @en
     * Reinitialize the event for being used again after retrieved from the object pool.
     * @zh
     * 重新初始化让对象池中取出的事件可再次使用。
     * @param type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
     * @param bubbles - A boolean indicating whether the event bubbles up through the tree or not
     */
    reuse(type: SystemEventTypeUnion, bubbles?: boolean): void;
    /**
     * @en
     * Checks whether the event has been stopped.
     *
     * @zh
     * 检查该事件是否已经停止传递。
     */
    isStopped(): boolean;
    /**
     * @en
     * Gets current target of the event                                                            <br/>
     * note: It only be available when the event listener is associated with node.                <br/>
     * It returns 0 when the listener is associated with fixed priority.
     * @zh
     * 获取当前目标节点
     * @returns - The target with which the event associates.
     */
    getCurrentTarget(): any;
    /**
     * @en
     * Gets the event type.
     * @zh
     * 获取事件类型。
     */
    getType(): string;
}
