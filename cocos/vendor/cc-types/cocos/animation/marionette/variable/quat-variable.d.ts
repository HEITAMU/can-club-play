import { BasicVariableDescription, VariableType, createInstanceTag, VarInstanceBase, Value } from './basic';
import { Quat } from '../../../core';
export declare class QuatVariable implements BasicVariableDescription<VariableType.QUAT_experimental> {
    get type(): VariableType.QUAT_experimental;
    get value(): Readonly<Quat>;
    set value(value: Readonly<Quat>);
    [createInstanceTag](): VarInstanceQuat;
    private _value;
}
declare class VarInstanceQuat extends VarInstanceBase {
    constructor(value: Readonly<Quat>);
    protected getValue(): Value;
    protected setValue(value: Value): void;
    private readonly _value;
}
export {};
