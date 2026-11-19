import { Component } from '../scene-graph/component';
/**
 * @en
 * This component will block all input events (mouse and touch) within the size of the node,
 * preventing the input from penetrating into the underlying node, typically for the background of the top UI.<br>
 * This component does not have any API interface and can be added directly to the scene to take effect.
 * @zh
 * 该组件将拦截所属节点尺寸内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。<br>
 * 该组件没有任何 API 接口，直接添加到场景即可生效。
 */
export declare class BlockInputEvents extends Component {
    onEnable(): void;
    onDisable(): void;
}
