declare class Empty {
}
/**
 * @en
 * EventTarget is an object to which an event is dispatched when something has occurred.
 * [[Node]]s are the most common event targets, but other objects can be event targets too.
 * If a class cannot extend from EventTarget, it can consider using [[Eventify]].
 *
 * @zh
 * 事件目标是具有注册监听器、派发事件能力的类，[[Node]] 是最常见的事件目标，
 * 但是其他类也可以继承自事件目标以获得管理监听器和派发事件的能力。
 * 如果无法继承自 EventTarget，也可以使用 [[Eventify]]
 */
export declare const EventTarget: new (...args: any[]) => Empty & import("./eventify").IEventified;
export type EventTarget = InstanceType<typeof EventTarget>;
export {};
