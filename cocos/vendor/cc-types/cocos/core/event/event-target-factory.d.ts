import { EventTarget } from './event-target';
/**
 *
 * @engineInternal
 */
export declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
/**
 * @en Interface for all classes that self implement the EventTarget protocol, they are normally not sub class of EventTarget
 * @zh 所有自己实现 EventTarget 功能的类都实现了这个 Interface，他们可能无法直接继承自 EventTarget
 */
export type IEventTarget = EventTarget;
