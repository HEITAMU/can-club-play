import { IExposedAttributes } from '../utils/attribute-defines';
import { PropertyStash } from '../class-stash';
import { LegacyPropertyDecorator } from './utils';
/**
 * @en Makes a CCClass that inherits from component execute in edit mode.<br/>
 * By default, all components are only executed in play mode,<br/>
 * which means they will not have their callback functions executed while the Editor is in edit mode.<br/>
 * @zh 允许继承自 Component 的 CCClass 在编辑器里执行。<br/>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, executeInEditMode} = _decorator;
 *
 *  @ccclass
 *  @executeInEditMode
 * class NewScript extends Component {
 *     // ...
 * }
 * ```
 */
export declare const executeInEditMode: ClassDecorator & ((yes?: boolean) => ClassDecorator);
/**
 * @en Add the current component to the specific menu path in `Add Component` selector of the inspector panel
 * @zh 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 * @param path - The path is the menu represented like a pathname. For example, the menu could be "Rendering/CameraCtrl".
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, menu} = _decorator;
 *
 * @ccclass
 * @menu("Rendering/CameraCtrl")
 * class NewScript extends Component {
 *     // ...
 * }
 * ```
 */
export declare const menu: (path: string) => ClassDecorator;
/**
 * @en When [[_decorator.executeInEditMode]] is set,
 * This decorator will make the editor run in high FPS mode when a node with the component is focused
 * @zh 当指定了 [[_decorator.executeInEditMode]] 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, playOnFocus, executeInEditMode} = _decorator;
 *
 * @ccclass
 * @executeInEditMode
 * @playOnFocus
 * class CameraCtrl extends Component {
 *     // ...
 * }
 * ```
 */
export declare const playOnFocus: ClassDecorator & ((yes?: boolean) => ClassDecorator);
/**
 * @en Use a customized inspector page in the **inspector**
 * @zh 自定义当前组件在 **属性检查器** 中渲染时所用的 UI 页面描述。
 * @param url The URL of the page definition in js
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, inspector} = _decorator;
 *
 * @ccclass
 * @inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends Component {
 *     // ...
 * }
 * ```
 */
export declare const inspector: (url: string) => ClassDecorator;
/**
 * @en Define the icon of the component.
 * @zh 自定义当前组件在编辑器中显示的图标 url。
 * @param url
 * @private
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, icon} = _decorator;
 *
 *  @ccclass
 *  @icon("xxxx.png")
 * class NewScript extends Component {
 *     // ...
 * }
 * ```
 */
export declare const icon: (url: string) => ClassDecorator;
/**
 * @en Define the help documentation URL,
 * if given, the component section in the **Inspector** will have a help documentation icon refers to the web page given.
 * @zh 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 * @param url The URL of the help documentation
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, help} = _decorator;
 *
 * @ccclass
 * @help("app://docs/html/components/spine.html")
 * class NewScript extends Component {
 *     // ...
 * }
 * ```
 */
export declare const help: (url: string) => ClassDecorator;
/**
 * @en
 * Enables the editor interoperability of the property.
 * @zh
 * 允许该属性与编辑器交互。
 * @engineInternal
 */
export declare const editable: LegacyPropertyDecorator;
/**
 * @en
 * Sets the condition to show the property.
 * @zh
 * 设置在编辑器展示该属性的条件。
 * @param condition 展示条件，当返回 `true` 时展示；否则不展示。
 * @engineInternal
 */
export declare const visible: (condition: boolean | (() => boolean)) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the property to be read-only in the editor.
 * @zh
 * 设置该属性在编辑器中仅是可读的。
 */
export declare const readOnly: LegacyPropertyDecorator;
/**
 * @en
 * Sets the display name of the property in the editor.
 * @zh
 * 设置该属性在编辑器中的显示名称。
 * @param text 显示名称。
 * @engineInternal
 */
export declare const displayName: (text: string) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the tooltip content of the property in editor.
 * @zh
 * 设置该属性在编辑器中的工具提示内容。
 * @param text 工具提示。
 * @engineInternal
 */
export declare const tooltip: (text: string) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the group where this property is organized into, on property inspector.
 * @zh
 * 设置在属性检查器上该属性所属的分类标签。
 * @param options 分组的配置。
 */
export declare const group: (options: NonNullable<IExposedAttributes['group']>) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the allowed range of the property in the editor.
 * @zh
 * 设置该属性在编辑器中允许设置的范围。
 * @param values 范围。
 * @engineInternal
 */
export declare const range: (values: [number, number, number] | [number, number]) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the allowed min value of the property in the editor.
 * @zh
 * 设置该属性在编辑器中允许的最小值。
 * @param value 最小值。
 */
export declare const rangeMin: (value: number | (() => number)) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the allowed max value of the property in the editor.
 * @zh
 * 设置该属性在编辑器中允许的最大值。
 * @param value 最大值。
 */
export declare const rangeMax: (value: number | (() => number)) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the step of the property in the editor.
 * @zh
 * 设置该属性在编辑器中的步进值。
 * @param value 步进值。
 * @engineInternal
 */
export declare const rangeStep: (value: number) => LegacyPropertyDecorator;
/**
 * @en
 * Enable a slider to be given to coordinate the property in the editor.
 * @zh
 * 允许在编辑器中提供滑动条来调节值
 * @engineInternal
 */
export declare const slide: LegacyPropertyDecorator;
/**
 * @en
 * Sets the display order of the property in the editor.
 * @zh
 * 设置该属性在编辑器中的显示顺序。
 * @param order 显示顺序。
 * @engineInternal
 */
export declare const displayOrder: (order: number) => LegacyPropertyDecorator;
/**
 * @en
 * Sets the unit of the property in the editor.
 * @zh
 * 设置该属性在编辑器中的计量单位。
 * @param name 计量单位的名称。
 */
export declare const unit: (name: string) => LegacyPropertyDecorator;
/**
 * @en
 * Sets to convert the value into radian before feeding it to the property in the editor.
 * @zh
 * 设置在编辑器中赋值该属性前将值先转换为弧度制。
 */
export declare const radian: LegacyPropertyDecorator;
/**
 * @en
 * Enable multi-line display of the property in editor.
 * @zh
 * 允许在编辑器中对该属性进行多行显示。
 */
export declare const multiline: LegacyPropertyDecorator;
/**
 * @en
 * Sets the property so that it does not interop with the animation parts in the editor.
 * @zh
 * 设置该属性不参与编辑器中动画相关的交互。
 * @engineInternal
 */
export declare const disallowAnimation: LegacyPropertyDecorator;
/**
 *
 * @engineInternal
 */
export declare const radioGroup: (val: NonNullable<PropertyStash['radioGroup']>) => LegacyPropertyDecorator;
