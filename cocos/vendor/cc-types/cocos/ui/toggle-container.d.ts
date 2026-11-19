import { Component, EventHandler as ComponentEventHandler } from '../scene-graph';
import { Toggle } from './toggle';
/**
 * @en
 * ToggleContainer is not a visible UI component but a way to modify the behavior of a set of Toggles. <br/>
 * Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
 * Note: All the first layer child node containing the toggle component will auto be added to the container.
 *
 * @zh
 * ToggleGroup 不是一个可见的 UI 组件，它可以用来修改一组 Toggle  组件的行为。当一组 Toggle 属于同一个 ToggleGroup 的时候，<br/>
 * 任何时候只能有一个 Toggle 处于选中状态。
 */
export declare class ToggleContainer extends Component {
    protected _allowSwitchOff: boolean;
    /**
     * @en
     * If this setting is true, a toggle could be switched off and on when pressed.
     * If it is false, it will make sure there is always only one toggle could be switched on
     * and the already switched on toggle can't be switched off.
     *
     * @zh
     * 如果这个设置为 true，那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。
     */
    get allowSwitchOff(): boolean;
    set allowSwitchOff(value: boolean);
    /**
     * @en
     * If Toggle is clicked, it will trigger event's handler.
     *
     * @zh
     * Toggle 按钮的点击事件列表。
     */
    checkEvents: ComponentEventHandler[];
    constructor();
    /**
     * @en
     * Read only property, return the toggle items array reference managed by ToggleContainer.
     *
     * @zh
     * 只读属性，返回 toggleContainer 管理的 toggle 数组引用。
     */
    get toggleItems(): Toggle[];
    onEnable(): void;
    onDisable(): void;
    activeToggles(): Toggle[];
    anyTogglesChecked(): boolean;
    /**
     * @en
     * Refresh the state of the managed toggles.
     *
     * @zh
     * 刷新管理的 toggle 状态。
     *
     * @param toggle @en The toggle to be updated. @zh 需要被更新的切换键。
     * @param emitEvent @en Whether events are needed to be emitted. @zh 是否需要触发事件。
     */
    notifyToggleCheck(toggle: Toggle, emitEvent?: boolean): void;
    /**
     * @en Ensure toggles state valid.
     * @zh 确保 toggles 状态有效。
     */
    ensureValidState(): void;
}
