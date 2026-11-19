/// <reference types="./@types/globals" />
import type { Component } from '../../scene-graph/component';
import { ObjectCurve, QuatCurve, RealCurve } from '../../core';
import { createEvalSymbol } from '../define';
import type { AnimationMask } from '../marionette/animation-mask';
import { PoseOutput } from '../pose-output';
import { HierarchyPath } from '../target-path';
import { IValueProxyFactory } from '../value-proxy';
import { Range } from './utils';
export declare const normalizedFollowTag: unique symbol;
declare const parseTrsPathTag: unique symbol;
export declare const trackBindingTag: unique symbol;
export interface RuntimeBinding<T = unknown> {
    setValue(value: T): void;
    getValue?(): T;
}
export type Binder = (binding: TrackBinding) => undefined | RuntimeBinding;
export type TrsTrackPath = [HierarchyPath, 'position' | 'rotation' | 'scale' | 'eulerAngles'];
/**
 * @en Describes how to find the animation target.
 * @zh 描述怎样寻址动画目标。
 */
declare class TrackPath {
    /**
     * @en The length of the path.
     * @zh 此路径的段数。
     */
    get length(): number;
    /**
     * @en Appends a property path.
     * @zh 附加一段属性路径。
     * @param name The property's name.
     * @returns `this`
     */
    toProperty(name: string): TrackPath;
    /**
     * @en Appends an array element path.
     * @zh 附加一段数组元素路径。
     * @param index The element's index.
     * @returns `this`
     */
    toElement(index: number): TrackPath;
    /**
     * @en Appends a hierarchy path.
     * @zh 附加一段层级路径。
     * @param nodePath Path to the children.
     * @returns `this`
     */
    toHierarchy(nodePath: string): TrackPath;
    /**
     * @en Appends a component path.
     * @zh 附加一段组件路径。
     * @param constructor @en The constructor of the component. @zh 组件的构造函数。
     * @returns `this`
     */
    toComponent<T extends Component>(constructor: Constructor<T> | string): TrackPath;
    /**
     * @internal Reserved for backward compatibility. DO NOT USE IT IN YOUR CODE.
     */
    toCustomized(resolver: CustomizedTrackPathResolver): TrackPath;
    /**
     * @en Appends paths to this path.
     * @zh 附加指定路径到此路径后。
     * @param trackPaths Paths to append.
     * @returns `this`.
     */
    append(...trackPaths: TrackPath[]): TrackPath;
    /**
     * @zh 判断指定路径段是否是属性路径。
     * @en Decides if the specific path segment is property path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    isPropertyAt(index: number): boolean;
    /**
     * @zh 将指定路径段视为属性路径，获取其描述的属性。
     * @en Treats the path segment as a property path. Obtains the property it describes.
     * @param index Index to the segment。
     * @returns The property.
     */
    parsePropertyAt(index: number): string;
    /**
     * @zh 判断指定路径段是否是数组元素路径。
     * @en Decides if the specific path segment is an array element path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    isElementAt(index: number): boolean;
    /**
     * @zh 将指定路径段视为数组元素路径，获取其描述的数组元素。
     * @en Treats the path segment as an array element path. Obtains the element index it describes.
     * @param index Index to the segment。
     * @returns The element index.
     */
    parseElementAt(index: number): number;
    /**
     * @zh 判断指定路径段是否是层级路径。
     * @en Decides if the specific path segment is a hierarchy path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    isHierarchyAt(index: number): boolean;
    /**
     * @zh 将指定路径段视为层级路径，获取其描述的层级路径。
     * @en Treats the path segment as a hierarchy path. Obtains the hierarchy path it describes.
     * @param index Index to the segment。
     * @returns The hierarchy path.
     */
    parseHierarchyAt(index: number): string;
    /**
     * @zh 判断指定路径段是否是组件路径。
     * @en Decides if the specific path segment is a component path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    isComponentAt(index: number): boolean;
    /**
     * @zh 将指定路径段视为组件路径，获取其描述的组件路径。
     * @en Treats the path segment as a hierarchy path. Obtains the component path it describes.
     * @param index Index to the segment。
     * @returns The component path.
     */
    parseComponentAt(index: number): string;
    /**
     * @en Slices a interval of the path.
     * @zh 分割指定区段上的路径。
     * @param beginIndex Begin index to the segment. Default to 0.
     * @param endIndex End index to the segment. Default to the last segment.
     * @returns The new path.
     */
    slice(beginIndex?: number, endIndex?: number): TrackPath;
    /**
     * @internal
     */
    trace(object: unknown, beginIndex?: number, endIndex?: number): unknown;
    /**
     * @internal
     */
    [parseTrsPathTag](): {
        node: string;
        property: 'position' | 'scale' | 'rotation' | 'eulerAngles';
    } | null;
    /**
     * @internal
     */
    [normalizedFollowTag](root: unknown, beginIndex: number, endIndex: number): unknown;
    private _paths;
}
/**
 * Composite of track path and value proxy.
 * Not exposed to external. If there is any reason it should be exposed,
 * please redesign the public interfaces.
 */
export declare class TrackBinding {
    path: Readonly<TrackPath>;
    proxy: IValueProxyFactory | undefined;
    private static _animationFunctions;
    parseTrsPath(): {
        node: string;
        property: 'position' | 'scale' | 'rotation' | 'eulerAngles';
    } | null;
    createRuntimeBinding(target: unknown, poseOutput: PoseOutput | undefined, isConstant: boolean): RuntimeBinding<unknown> | {
        target: any;
        setValue: any;
        getValue: any;
    } | null;
    isMaskedOff(mask: AnimationMask): boolean;
}
export declare function isTrsPropertyName(name: string | number): name is 'position' | 'rotation' | 'scale' | 'eulerAngles';
interface CustomizedTrackPathResolver {
    get(target: unknown): unknown;
}
export { TrackPath };
/**
 * @en
 * A track describes how to trace the target and how to animate it.
 * It's the basic unit of animation clip.
 * @zh
 * 轨道描述了动画目标的路径和动画的方式。它是动画剪辑的基础单元。
 */
export declare abstract class Track {
    /**
     * @en Track path.
     * @zh 轨道路径。
     */
    get path(): Readonly<TrackPath>;
    set path(value: Readonly<TrackPath>);
    /**
     * @en Value proxy for the target.
     * @zh 目标的值代理。
     */
    get proxy(): IValueProxyFactory | undefined;
    set proxy(value: IValueProxyFactory | undefined);
    /**
     * @internal
     */
    get [trackBindingTag](): TrackBinding;
    /**
     * @en Channels on this track.
     * @zh 此轨道上的通道。
     * @returns Iterator to the channels.
     */
    channels(): Iterable<Channel>;
    /**
     * @en Time range of this track.
     * @zh 此轨道的时间范围。
     * @returns The time range.
     */
    range(): Range;
    /**
     * @internal
     */
    abstract [createEvalSymbol](): TrackEval<any>;
    private _binding;
}
export interface TrackEval<TValue> {
    /**
     * A flag indicating if the track requires a default value to be passed to `this.evaluate`.
     */
    readonly requiresDefault: boolean;
    /**
     * Evaluates the track.
     * @param time The time.
     * @param defaultValue A default value.
     * This param will be passed if `this.requiresDefault === true` and
     * the caller is able to provide such a default value.
     */
    evaluate(time: number, defaultValue?: TValue extends unknown ? unknown : Readonly<TValue>): TValue;
}
export type Curve = RealCurve | QuatCurve | ObjectCurve<unknown>;
/**
 * @en
 * Channel contains a curve.
 * @zh
 * 通道包含了一条曲线。
 */
export declare class Channel<T = Curve> {
    constructor(curve: T);
    /**
     * @internal Not used for now.
     */
    name: string;
    /**
     * @en The curve within the channel.
     * @zh 通道中的曲线。
     */
    get curve(): T;
    private _curve;
}
export type RealChannel = Channel<RealCurve>;
export type QuatChannel = Channel<QuatCurve>;
/**
 * @en 表示一个包含了单条通道的轨道。
 * @zh Describes a track which contains only single channel.
 */
export declare abstract class SingleChannelTrack<TCurve extends Curve> extends Track {
    constructor();
    /**
     * @en The channel within the track.
     * @zh 轨道包含的通道。
     */
    get channel(): Channel<TCurve>;
    channels(): Iterable<Channel<TCurve>>;
    /**
     * @internal
     */
    protected createCurve(): TCurve;
    /**
     * @internal
     */
    [createEvalSymbol](): TrackEval<unknown>;
    private _channel;
}
