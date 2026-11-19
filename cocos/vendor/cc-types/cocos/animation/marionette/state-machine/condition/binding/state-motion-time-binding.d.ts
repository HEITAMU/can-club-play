import { ConditionBindingContext } from '../condition-base';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
/**
 * @zh 一种过渡条件绑定，该绑定用于获取过渡的源头状态所包含的动作已流逝的标准化时间。
 * 如果源头中不包含动作，则返回 0。
 * 该类绑定产生浮点值。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the elapsed normalized time of motions within transition source state.
 * If there's no motion in source state, 0 is returned.
 * This type of binding yields float value.
 */
export declare class TCStateMotionTimeBinding extends TCBinding<TCBindingValueType.FLOAT> {
    getValueType(): TCBindingValueType.FLOAT;
    bind(_context: ConditionBindingContext): TCBindingEvaluation<number> | undefined;
}
