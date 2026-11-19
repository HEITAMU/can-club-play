import { createEval } from '../../create-eval';
import { Condition, ConditionEval, ConditionBindingContext } from './condition-base';
export declare class TriggerCondition implements Condition {
    trigger: string;
    clone(): TriggerCondition;
    [createEval](context: ConditionBindingContext): ConditionEval;
}
