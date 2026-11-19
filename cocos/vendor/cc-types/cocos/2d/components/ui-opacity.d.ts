import { Component } from '../../scene-graph/component';
/**
 * @en
 * Set the UI transparency component.
 * This component can be used to influence subsequent render nodes.
 * Nodes that already have a rendering component can modify the alpha channel of color directly.
 *
 * @zh
 * UI 透明度设置组件。可以通过该组件设置透明度来影响后续的渲染节点。已经带有渲染组件的节点可以直接修改 color 的 alpha 通道。
 */
export declare class UIOpacity extends Component {
    constructor();
    /**
     * @en
     * The transparency value of the impact.
     *
     * @zh
     * 透明度。
     */
    get opacity(): number;
    set opacity(value: number);
    protected _opacity: number;
    onEnable(): void;
    onDisable(): void;
    private _syncLocalOpacity;
}
