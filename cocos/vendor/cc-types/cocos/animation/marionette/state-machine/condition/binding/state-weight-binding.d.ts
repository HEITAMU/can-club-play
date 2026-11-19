import { ConditionBindingContext } from '../condition-base';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
/**
 * @zh 一种过渡条件绑定，该绑定用于获取过渡的源头状态当前的权重值。该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current weight value of transition source state.
 * This type of binding yields float value.
 */
export declare class TCStateWeightBinding extends TCBinding<TCBindingValueType.FLOAT> {
    getValueType(): TCBindingValueType.FLOAT;
    bind(_context: ConditionBindingContext): TCBindingEvaluation<number> | undefined;
}
