import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
import { ConditionBindingContext } from '../condition-base';
/**
 * @zh 一种过渡条件绑定，该绑定用于获取指定辅助曲线的当前值。该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current value of specified auxiliary curve.
 * This type of binding yields float value.
 */
export declare class TCAuxiliaryCurveBinding extends TCBinding<TCBindingValueType.FLOAT> {
    /**
     * @zh
     * 辅助曲线的名称。
     * @en
     * The auxiliary curve's name.
     */
    curveName: string;
    getValueType(): TCBindingValueType.FLOAT;
    bind(context: ConditionBindingContext): TCBindingEvaluation<number> | undefined;
}
