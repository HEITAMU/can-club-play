import { Component } from '../scene-graph/component';
/**
 * @en
 * This component is used to adjust the layout of current node to respect the safe area of a notched mobile device such as the iPhone X.
 * It is typically used for the top node of the UI interaction area. For specific usage,
 * refer to the official [test-cases-3d/assets/cases/ui/20.safe-area/safe-area.scene](https://github.com/cocos-creator/test-cases-3d).
 *
 * The concept of safe area is to give you a fixed inner rectangle in which you can safely display content that will be drawn on screen.
 * You are strongly discouraged from providing controls outside of this area. But your screen background could embellish edges.
 *
 * This component internally uses the API `sys.getSafeAreaRect();` to obtain the safe area of the current iOS or Android device,
 * and implements the adaptation by using the Widget component and set anchor.
 *
 * @zh
 * 该组件会将所在节点的布局适配到 iPhone X 等异形屏手机的安全区域内，通常用于 UI 交互区域的顶层节点，
 * 具体用法可参考官方范例 [test-cases-3d/assets/cases/ui/20.safe-area/safe-area.scene](https://github.com/cocos-creator/test-cases-3d)。
 *
 * 该组件内部通过 API `sys.getSafeAreaRect();` 获取到当前 iOS 或 Android 设备的安全区域，并通过 Widget 组件实现适配。
 *
 */
export declare class SafeArea extends Component {
    get symmetric(): boolean;
    set symmetric(value: boolean);
    private _symmetric;
    constructor();
    onEnable(): void;
    onDisable(): void;
    /**
     * @en Adapt to safe area.
     * @zh 立即适配安全区域。
     * @method updateArea
     * @example
     * let safeArea = this.node.addComponent(cc.SafeArea);
     * safeArea.updateArea();
     */
    updateArea(): void;
}
