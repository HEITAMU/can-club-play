import { Component } from '../../scene-graph/component';
/**
 * @en The entry node for 2D object data collection, all 2D rendering objects need to be rendered under the RenderRoot node.
 * @zh 2D 对象数据收集的入口节点，所有的 2D渲染对象需在 RenderRoot 节点下才可以被渲染。
 */
export declare class RenderRoot2D extends Component {
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
}
