import { Prefab } from './prefab';
import { Component } from '../component';
import { Node } from '../node';
export declare class TargetInfo {
    constructor();
    localID: string[];
}
export declare class TargetOverrideInfo {
    constructor();
    source: Component | Node | null;
    sourceInfo: TargetInfo | null;
    propertyPath: string[];
    target: Node | null;
    targetInfo: TargetInfo | null;
}
export declare class CompPrefabInfo {
    constructor();
    fileId: string;
}
export declare class PropertyOverrideInfo {
    constructor();
    targetInfo: TargetInfo | null;
    propertyPath: string[];
    value: any;
    isTarget(localID: string[], propPath: string[]): boolean | undefined;
}
export declare class MountedChildrenInfo {
    constructor();
    targetInfo: TargetInfo | null;
    nodes: Node[];
    isTarget(localID: string[]): boolean | undefined;
}
export declare class MountedComponentsInfo {
    constructor();
    targetInfo: TargetInfo | null;
    components: Component[];
    isTarget(localID: string[]): boolean | undefined;
}
/**
 * Prefab实例类
 * @internal
 */
export declare class PrefabInstance {
    constructor();
    fileId: string;
    prefabRootNode?: Node;
    mountedChildren: MountedChildrenInfo[];
    mountedComponents: MountedComponentsInfo[];
    propertyOverrides: PropertyOverrideInfo[];
    removedComponents: TargetInfo[];
    targetMap: TargetMap;
    /**
     * make sure prefab instance expand only once
     * @internal
     */
    expanded: boolean;
    findPropertyOverride(localID: string[], propPath: string[]): Prefab._utils.PropertyOverrideInfo | null | undefined;
    removePropertyOverride(localID: string[], propPath: string[]): void;
}
export interface TargetMap {
    [k: string]: TargetMap | Node | Component;
}
export declare class PrefabInfo {
    constructor();
    root?: Node;
    asset?: Prefab;
    fileId: string;
    instance?: PrefabInstance;
    targetOverrides?: TargetOverrideInfo[];
    nestedPrefabInstanceRoots?: Node[];
}
