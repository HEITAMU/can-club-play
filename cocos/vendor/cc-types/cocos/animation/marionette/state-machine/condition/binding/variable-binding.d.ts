import { ConditionBindingContext } from '../condition-base';
import { TCBinding, TCBindingEvaluation, TCBindingValueType } from './binding';
/**
 * @zh 一种过渡条件绑定，该绑定用于获取动画图变量的当前值。该类绑定产生的值类型对应于变量的值类型。
 *
 * @en A kind of transition condition binding,
 * which is used to obtain the current value of a animation graph variable.
 * This type of binding yields the type corresponding to the variable's type.
 */
export declare class TCVariableBinding<TValueType extends TCBindingValueType> extends TCBinding<TValueType> {
    type: TValueType;
    /**
     * @zh
     * 动画图变量的名称。
     * @en
     * The animation graph variable's name.
     */
    variableName: string;
    getValueType(): TValueType;
    bind(context: ConditionBindingContext): TCBindingEvaluation<TValueType> | undefined;
}
