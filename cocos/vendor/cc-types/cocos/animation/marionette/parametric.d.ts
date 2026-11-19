import { AnimationGraphBindingContext } from './animation-graph-context';
import type { VarInstance } from './graph-eval';
import { VariableType } from './variable';
export { VariableType };
export interface Bindable<TValue> {
    value: TValue;
    variable: string;
    clone(): Bindable<TValue>;
}
export declare class BindableNumber implements Bindable<number> {
    variable: string;
    value: number;
    constructor(value?: number);
    clone(): Bindable<number>;
}
export declare class BindableBoolean implements Bindable<boolean> {
    variable: string;
    value: boolean;
    constructor(value?: boolean);
    clone(): Bindable<boolean>;
}
export type BindCallback<TValue, TThis, TArgs extends any[]> = (this: TThis, value: TValue, ...args: TArgs) => void;
export type VariableTypeValidator = () => void;
export type BindContext = AnimationGraphBindingContext;
export declare function bindOr<TValue, TThis, TArgs extends any[]>(context: BindContext, bindable: Bindable<TValue>, type: VariableType, callback: BindCallback<TValue, TThis, TArgs>, thisArg: TThis, ...args: TArgs): TValue;
export declare function bindNumericOr<TValue, TThis, TArgs extends any[]>(context: BindContext, bindable: Bindable<TValue>, type: VariableType, callback: BindCallback<TValue, TThis, TArgs>, thisArg: TThis, ...args: TArgs): number | TValue;
export declare function validateVariableExistence(varInstance: VarInstance | undefined, name: string): varInstance is VarInstance;
export declare function validateVariableType(type: VariableType, expected: VariableType, name: string): void;
export declare function validateVariableTypeNumeric(type: VariableType, name: string): void;
export declare function validateVariableTypeTriggerLike(type: VariableType, name: string): void;
