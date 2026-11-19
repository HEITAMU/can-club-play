import { BindableBoolean } from '../../parametric';
import { createEval } from '../../create-eval';
import { Condition, ConditionEval, ConditionBindingContext } from './condition-base';
declare enum UnaryOperator {
    TRUTHY = 0,
    FALSY = 1
}
export declare class UnaryCondition implements Condition {
    static readonly Operator: typeof UnaryOperator;
    operator: UnaryOperator;
    operand: BindableBoolean;
    clone(): UnaryCondition;
    [createEval](context: ConditionBindingContext): UnaryConditionEval;
}
export declare namespace UnaryCondition {
    type Operator = UnaryOperator;
}
declare class UnaryConditionEval implements ConditionEval {
    private _operator;
    private _operand;
    private _result;
    constructor(operator: UnaryOperator, operand: boolean);
    reset(value: boolean): void;
    setOperand(value: boolean): void;
    /**
     * Evaluates this condition.
     */
    eval(): boolean;
    private _eval;
}
export {};
