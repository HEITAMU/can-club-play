/// <reference types="./@types/globals" />
import { TCBinding, TCBindingValueType } from './binding';
/**
 * @zh
 * 描述某个（过渡条件）绑定类的类型信息。
 * @en
 * Describes the type info of a (transition condition)binding class.
 */
export interface TCBindingTypeInfo {
    /**
     * @zh
     * 该绑定类型的创建菜单信息。
     * @en
     * The creation menu info of this binding class.
     */
    menu?: string;
    /**
     * @zh
     * 该绑定类能提供的所有值类型。
     * @en
     * All value types that this binding can provides.
     */
    provisions?: readonly TCBindingValueType[];
    /**
     * @zh
     * 如果有定义，表示该类型的绑定支持的过渡源状态的类型。
     * @en
     * If defined, represents the type(s) of the transition source state supported by this type of binding.
     */
    transitionSourceFilter?: TCBindingTransitionSourceFilter;
}
export declare const provide: (...valueTypes: readonly TCBindingValueType[]) => ClassDecorator;
export declare enum TCBindingTransitionSourceFilter {
    /** Motion states. */
    MOTION = 1,
    /** Pose states. */
    POSE = 2,
    /** Empty states. */
    EMPTY = 4,
    /** All states having weight concept. */
    WEIGHTED = 7
}
export declare const support: (transitionSourceFilter: TCBindingTransitionSourceFilter) => ClassDecorator;
/**
 * @zh 获取指定（过渡条件）绑定类的类型信息。
 * @zh Gets the type info of specified (transition condition)binding class.
 * @param constructor @zh 该绑定类的构造函数。@en The binding class's constructor.
 * @returns @zh 类型信息。@en Type info.
 */
export declare function getTCBindingTypeInfo(constructor: Constructor<TCBinding<number>>): Readonly<TCBindingTypeInfo> | undefined;
