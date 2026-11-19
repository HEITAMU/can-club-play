import { Vec3 } from '../../../core';
import { BasicVariableDescription, VariableType, createInstanceTag, VarInstanceBase, Value } from './basic';
export declare class Vec3Variable implements BasicVariableDescription<VariableType.VEC3_experimental> {
    get type(): VariableType.VEC3_experimental;
    get value(): Readonly<Vec3>;
    set value(value: Readonly<Vec3>);
    [createInstanceTag](): VarInstanceVec3;
    private _value;
}
declare class VarInstanceVec3 extends VarInstanceBase {
    constructor(value: Readonly<Vec3>);
    protected getValue(): Value;
    protected setValue(value: Value): void;
    private readonly _value;
}
export {};
