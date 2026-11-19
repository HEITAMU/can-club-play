import { Vec3, Quat } from '../../core';
import { Node } from '../../scene-graph';
import { RuntimeBinding } from '../../animation/tracks/track';
export declare abstract class BlendStateBuffer<TNodeBlendState extends NodeBlendState<PropertyBlendState<Vec3>, PropertyBlendState<Quat>> = NodeBlendState<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>> {
    protected _nodeBlendStates: Map<Node, TNodeBlendState>;
    createWriter<P extends BlendingPropertyName>(node: Node, property: P, host: BlendStateWriterHost, constants: boolean): BlendStateWriter<P>;
    destroyWriter<P extends BlendingPropertyName>(writer: BlendStateWriter<P>): void;
    ref<P extends BlendingPropertyName>(node: Node, property: P): PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P];
    deRef(node: Node, property: BlendingPropertyName): void;
    apply(): void;
    protected abstract createNodeBlendState(): TNodeBlendState;
}
export interface BlendStateWriterHost {
    readonly weight: number;
}
export type BlendingPropertyName = 'position' | 'scale' | 'rotation' | 'eulerAngles';
interface PropertyBlendStateTypeMap<TVec3PropertyBlendState, TQuatPropertyBlendState> {
    'rotation': TQuatPropertyBlendState;
    'position': TVec3PropertyBlendState;
    'scale': TVec3PropertyBlendState;
    'eulerAngles': TVec3PropertyBlendState;
}
declare class BlendStateWriterInternal<P extends BlendingPropertyName> implements RuntimeBinding {
    protected _node: Node;
    protected _property: P;
    protected _propertyBlendState: PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P];
    protected _host: BlendStateWriterHost;
    protected _constants: boolean;
    constructor(_node: Node, _property: P, _propertyBlendState: PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P], _host: BlendStateWriterHost, _constants: boolean);
    get node(): Node;
    get property(): P;
    getValue(): Node[P];
    setValue(value: PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P]['result']): void;
}
export type BlendStateWriter<P extends BlendingPropertyName> = Omit<BlendStateWriterInternal<P>, 'node' | 'property'>;
interface PropertyBlendState<TValue> {
    /**
     * How many writer reference this property.
     */
    refCount: number;
    readonly result: Readonly<TValue>;
    blend(value: Readonly<TValue>, weight: number): void;
}
declare class LegacyVec3PropertyBlendState implements PropertyBlendState<Vec3> {
    refCount: number;
    accumulatedWeight: number;
    result: Vec3;
    blend(value: Readonly<Vec3>, weight: number): void;
    reset(): void;
}
declare class LegacyQuatPropertyBlendState implements PropertyBlendState<Quat> {
    refCount: number;
    accumulatedWeight: number;
    result: Quat;
    blend(value: Readonly<Quat>, weight: number): void;
    reset(): void;
}
declare abstract class NodeBlendState<TVec3PropertyBlendState extends PropertyBlendState<Vec3>, TQuatPropertyBlendState extends PropertyBlendState<Quat>> {
    get empty(): boolean;
    refProperty<P extends BlendingPropertyName>(node: Node, property: BlendingPropertyName): NodeBlendState<TVec3PropertyBlendState, TQuatPropertyBlendState>['_properties'][P];
    deRefProperty(property: BlendingPropertyName): void;
    apply(node: Node): void;
    protected _transformApplyFlags: number;
    protected _properties: {
        position?: TVec3PropertyBlendState;
        rotation?: TQuatPropertyBlendState;
        eulerAngles?: TVec3PropertyBlendState;
        scale?: TVec3PropertyBlendState;
    };
    protected abstract _createVec3BlendState(currentValue: Readonly<Vec3>): TVec3PropertyBlendState;
    protected abstract _createQuatBlendState(currentValue: Readonly<Quat>): TQuatPropertyBlendState;
}
declare class LegacyNodeBlendState extends NodeBlendState<LegacyVec3PropertyBlendState, LegacyQuatPropertyBlendState> {
    apply(node: Node): void;
    protected _createVec3BlendState(_currentValue: Readonly<Vec3>): LegacyVec3PropertyBlendState;
    protected _createQuatBlendState(_currentValue: Readonly<Quat>): LegacyQuatPropertyBlendState;
}
export declare class LegacyBlendStateBuffer extends BlendStateBuffer<LegacyNodeBlendState> {
    protected createNodeBlendState(): LegacyNodeBlendState;
}
export {};
