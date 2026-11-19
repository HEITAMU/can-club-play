import { Component } from '../../scene-graph/component';
import { Color } from '../../core';
/**
 * @en
 * Outline effect used to change the display, only for system fonts or TTF fonts.
 *
 * @zh
 * 描边效果组件,用于字体描边,只能用于系统字体。
 *
 * @deprecated since v3.8.2, please use [[Label.enableOutline]] instead.
 */
export declare class LabelOutline extends Component {
    /**
     * @en
     * Outline color.
     *
     * @zh
     * 改变描边的颜色。
     *
     * @deprecated since v3.8.2, please use [[Label.outlineColor]] instead.
     */
    get color(): Readonly<Color>;
    set color(value: Readonly<Color>);
    /**
     * @en
     * Change the outline width.
     *
     * @zh
     * 改变描边的宽度。
     *
     * @deprecated since v3.8.2, please use [[Label.outlineWidth]] instead.
     */
    get width(): number;
    set width(value: number);
    /**
     * @deprecated since v3.8.2, please use [[Label.enableOutline]] instead.
     */
    onEnable(): void;
    /**
     * @deprecated since v3.8.2, please use [[Label.enableOutline]] instead.
     */
    onDisable(): void;
}
