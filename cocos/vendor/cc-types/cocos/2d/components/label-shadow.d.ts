import { Component } from '../../scene-graph/component';
import { Color, Vec2 } from '../../core';
/**
 * @en Shadow effect for Label component, only for system fonts or TTF fonts.
 * @zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体。
 *
 * @deprecated since v3.8.2, please use [[Label.enableShadow]] instead.
 */
export declare class LabelShadow extends Component {
    /**
     * @en
     * Shadow color.
     *
     * @zh
     * 阴影的颜色。
     *
     * @deprecated since v3.8.2, please use [[Label.shadowColor]] instead.
     */
    get color(): Readonly<Color>;
    set color(value: Readonly<Color>);
    /**
     * @en
     * Offset between font and shadow.
     *
     * @zh
     * 字体与阴影的偏移。
     *
     * @deprecated since v3.8.2, please use [[Label.shadowOffset]] instead.
     */
    get offset(): Vec2;
    set offset(value: Vec2);
    /**
     * @en
     * A non-negative float specifying the level of shadow blur.
     *
     * @zh
     * 阴影的模糊程度。
     *
     * @deprecated since v3.8.2, please use [[Label.shadowBlur]] instead.
     */
    get blur(): number;
    set blur(value: number);
    /**
     * @deprecated since v3.8.2, please use [[Label.enableShadow]] instead.
     */
    onEnable(): void;
    /**
     * @deprecated since v3.8.2, please use [[Label.enableShadow]] instead.
     */
    onDisable(): void;
}
