import type { Node } from './node';
/**
 * @en
 * The EventHandler class sets the event callback in the scene.
 * This class allows the user to set the callback target node, target component name, component method name, and call the target method through the `emit` method.
 * @zh
 * “EventHandler” 类用来设置场景中的事件回调，该类允许用户设置回调目标节点，目标组件名，组件方法名，并可通过 emit 方法调用目标函数。
 *
 * @example
 * ```ts
 * // Let's say we have a MainMenu component on newTarget
 * // file: MainMenu.ts
 * @ccclass('MainMenu')
 * export class MainMenu extends Component {
 *     // sender: the node MainMenu.ts belongs to
 *     // eventType: CustomEventData
 *     onClick (sender, eventType) {
 *         cc.log('click');
 *     }
 * }
 *
 * import { Component } from 'cc';
 * const eventHandler = new Component.EventHandler();
 * eventHandler.target = newTarget;
 * eventHandler.component = "MainMenu";
 * eventHandler.handler = "OnClick";
 * eventHandler.customEventData = "my data";
 * ```
 */
export declare class EventHandler {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _componentName(): any;
    set _componentName(value: any);
    /**
     * @en
     * Dispatching component events.
     * @zh
     * 组件事件派发。
     *
     * @param events - The event list to be emitted
     * @param args - The callback arguments
     */
    static emitEvents(events: EventHandler[], ...args: any[]): void;
    /**
     * @en
     * The node that contains target component
     * @zh
     * 事件响应组件和函数所在节点
     */
    target: Node | null;
    /**
     * @en
     * The name of the component(script) that contains target callback, such as the name 'MainMenu' of the script in the example
     * @zh
     * 事件响应函数所在组件名（脚本名）, 比如例子中的脚本名 'MainMenu'
     */
    component: string;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _componentId: string;
    /**
     * @en
     * Event handler, such as the callback function name 'onClick' in the example
     * @zh
     * 响应事件函数名，比如例子中的 'onClick' 方法名
     */
    handler: string;
    /**
     * @en
     * Custom Event Data
     * @zh
     * 自定义事件数据
     */
    customEventData: string;
    /**
     * @en Trigger the target callback with given arguments
     * @zh 触发目标组件上的指定 handler 函数，可以选择传递参数。
     * @param params - The arguments for invoking the callback
     * @example
     * ```ts
     * import { Component } from 'cc';
     * const eventHandler = new Component.EventHandler();
     * eventHandler.target = newTarget;
     * eventHandler.component = "MainMenu";
     * eventHandler.handler = "OnClick"
     * eventHandler.emit(["param1", "param2", ....]);
     * ```
     */
    emit(params: any[]): void;
    private _compName2Id;
    private _compId2Name;
    private _genCompIdIfNeeded;
}
