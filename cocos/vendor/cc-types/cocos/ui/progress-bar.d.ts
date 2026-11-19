import { Component } from '../scene-graph/component';
import { Sprite } from '../2d/components/sprite';
/**
 * @en
 * Enum for ProgressBar mode.
 *
 * @zh
 * 进度条模式。
 */
declare enum Mode {
    /**
     * @en
     * The mode of horizontal.
     *
     * @zh
     * 水平方向模式。
     */
    HORIZONTAL = 0,
    /**
     * @en
     * The mode of vertical.
     *
     * @zh
     *  垂直方向模式。
     */
    VERTICAL = 1,
    /**
     * @en
     * The mode of fill.
     *
     * @zh
     * 填充模式。
     */
    FILLED = 2
}
/**
 * @en
 * Visual indicator of progress in some operation.
 * Displays a bar to the user representing how far the operation has progressed.
 *
 * @zh
 * 进度条组件，可用于显示加载资源时的进度。
 *
 * @example
 * ```ts
 * // update progressBar
 * update(dt) {
 *     var progress = progressBar.progress;
 *     if (progress > 0) {
 *         progress += dt;
 *     }
 *     else {
 *         progress = 1;
 *     }
 *     progressBar.progress = progress;
 * }
 * ```
 */
export declare class ProgressBar extends Component {
    constructor();
    /**
     * @en
     * The targeted Sprite which will be changed progressively.
     *
     * @zh
     * 用来显示进度条比例的 Sprite 对象。
     */
    get barSprite(): Sprite | null;
    set barSprite(value: Sprite | null);
    /**
     * @en
     * The progress mode, there are two modes supported now: horizontal and vertical.
     *
     * @zh
     * 进度条的模式。
     */
    get mode(): Mode;
    set mode(value: Mode);
    /**
     * @en
     * The total width or height of the bar sprite.
     *
     * @zh
     * 进度条实际的总长度。
     */
    get totalLength(): number;
    set totalLength(value: number);
    /**
     * @en
     * The current progress of the bar sprite. The valid value is between 0-1.
     *
     * @zh
     * 当前进度值，该数值的区间是 0-1 之间。
     */
    get progress(): number;
    set progress(value: number);
    /**
     * @en
     * Whether reverse the progress direction of the bar sprite.
     *
     * @zh
     * 进度条是否进行反方向变化。
     */
    get reverse(): boolean;
    set reverse(value: boolean);
    static Mode: typeof Mode;
    protected _barSprite: Sprite | null;
    protected _mode: Mode;
    protected _totalLength: number;
    protected _progress: number;
    protected _reverse: boolean;
    protected onLoad(): void;
    protected _initBarSprite(): void;
    protected _updateBarStatus(): void;
}
export {};
