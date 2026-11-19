import { VariableType, createInstanceTag, VarInstanceBase, Value } from './basic';
export type PlainVariableType = VariableType.FLOAT | VariableType.INTEGER | VariableType.BOOLEAN;
export declare class PlainVariable {
    private _type;
    private _value;
    constructor(type?: PlainVariableType);
    get type(): PlainVariableType;
    get value(): Value;
    set value(value: Value);
    [createInstanceTag](): VarInstancePrimitive;
}
export declare class VarInstancePrimitive extends VarInstanceBase {
    constructor(type: VariableType, value: Value);
    protected getValue(): Value;
    protected setValue(value: Value): void;
    private _value;
}
