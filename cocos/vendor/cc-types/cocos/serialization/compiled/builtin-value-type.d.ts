import { ValueType } from '../../core';
import type { IRuntimeFileData } from '../deserialize';
export type ValueTypeData = [
    typeIndex: number,
    ...values: number[]
];
export declare function serializeBuiltinValueType(obj: ValueType): ValueTypeData | null;
export declare function deserializeBuiltinValueType(data: IRuntimeFileData, owner: any, key: string, value: ValueTypeData): void;
export declare function deserializeBuiltinValueTypeInto(data: IRuntimeFileData, owner: any, key: string, value: ValueTypeData): void;
export {};
