import { Condition, ConditionEval, ConditionBindingContext, ConditionEvaluationContext } from './condition-base';
import { createEval } from '../../create-eval';
import type { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding/binding';
import './binding/runtime';
/**
 * @zh 二元条件操作符。
 * @en Operator used in binary condition.
 */
declare enum BinaryOperator {
    EQUAL_TO = 0,
    NOT_EQUAL_TO = 1,
    LESS_THAN = 2,
    LESS_THAN_OR_EQUAL_TO = 3,
    GREATER_THAN = 4,
    GREATER_THAN_OR_EQUAL_TO = 5
}
type LhsBinding = TCBinding<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER>;
type lhsBindingEvaluation = TCBindingEvaluation<TCBindingValueType.FLOAT | TCBindingValueType.INTEGER>;
/**
 * @zh 描述一个二元条件，它有两个数值类型的操作数。
 * @en Describes a binary condition, there are two operands with numeric type.
 */
export declare class BinaryCondition implements Condition {
    static readonly Operator: typeof BinaryOperator;
    /**
     * @zh
     * 运算符。
     * @en
     * Operator.
     */
    operator: BinaryOperator;
    /**
     * @zh
     * 左操作数的值。
     * @en
     * Left operand value.
     */
    lhs: number;
    /**
     * @zh
     * 左操作数上的绑定。
     * @en
     * Left operand binding.
     */
    lhsBinding: LhsBinding;
    /**
     * @zh
     * 右操作数的值。
     * @en
     * Right operand value.
     */
    rhs: number;
    clone(): BinaryCondition;
    [createEval](context: ConditionBindingContext): BinaryConditionEval;
}
export declare namespace BinaryCondition {
    type Operator = BinaryOperator;
}
declare class BinaryConditionEval implements ConditionEval {
    private _operator;
    private _lhsBindingEvaluation;
    constructor(_operator: BinaryOperator, lhsValue: number, rhsValue: number, _lhsBindingEvaluation: lhsBindingEvaluation | undefined);
    /**
     * Evaluates this condition.
     */
    eval(context: ConditionEvaluationContext): boolean;
    private _lhsValue;
    private _rhsValue;
}
export {};
