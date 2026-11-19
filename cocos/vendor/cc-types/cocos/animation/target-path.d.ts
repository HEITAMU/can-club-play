/// <reference types="./@types/globals" />
import { Node } from '../scene-graph/node';
import type { Component } from '../scene-graph';
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export type PropertyPath = string | number;
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export interface ICustomTargetPath {
    /**
     * @en
     * Gets next target from current target.
     * If errors are encountered, `null` should be returned.
     * @zh
     * 从当前目标中获取下一个目标。
     * 若错误发生，应返回 `null`。
     * @param target
     */
    get(target: any): any;
}
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export type TargetPath = PropertyPath | ICustomTargetPath;
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export declare function isPropertyPath(path: TargetPath): path is PropertyPath;
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export declare function isCustomPath<T extends ICustomTargetPath>(path: TargetPath, constructor: Constructor<T>): path is T;
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export declare class HierarchyPath implements ICustomTargetPath {
    path: string;
    constructor(path?: string);
    get(target: Node): Node | null;
}
/**
 * @deprecated Since V3.3, use [[TrackPath]] instead.
 */
export declare class ComponentPath implements ICustomTargetPath {
    component: string;
    constructor(component?: string);
    get(target: Node): Component | null;
}
