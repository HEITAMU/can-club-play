import { UIRenderer } from '../2d/framework/ui-renderer';
import { UIMeshRenderer } from '../2d';
import type { Node } from './node';
import type { UITransform } from '../2d/framework';
import type { UISkew } from '../2d/framework/ui-skew';
/**
 * @en Node's UI properties abstraction
 * @zh 节点上 UI 相关的属性抽象类
 */
export declare class NodeUIProperties {
    /**
     * @en The UI transform component
     * @zh UI 变换组件
     */
    get uiTransformComp(): UITransform | null;
    set uiTransformComp(value: UITransform | null);
    /**
     * @en The base UI component
     * @zh UI 基类组件
     */
    get uiComp(): UIMeshRenderer | UIRenderer | null;
    set uiComp(comp: UIMeshRenderer | UIRenderer | null);
    private _uiComp;
    /**
     * @en The opacity of the UI node for final rendering
     * @zh 最终显示的 UI 透明度，受父节点透明度影响
     */
    private _opacity;
    /**
     * NOTE: engineInternal tag cannot only mark opacity setter as internal.
     * @engineInternal
     * @mangle
     */
    setOpacity(v: number): void;
    get opacity(): number;
    /**
     * @en The opacity of the UI node itself
     * @zh 本节点的 UI 透明度
     */
    private _localOpacity;
    get localOpacity(): number;
    set localOpacity(val: number);
    colorDirty: boolean;
    protected _uiTransformComp: UITransform | null;
    /**
     * @engineInternal
     * @mangle
     */
    _uiSkewComp: UISkew | null;
    private _node;
    constructor(node: Node);
    /**
     * @deprecated since v3.4
     */
    applyOpacity(effectOpacity: number): void;
    /**
     * @en Make the opacity state of node tree is dirty, not effect anymore
     * @zh 为结点树的透明度状态设置脏标签，不再有效果
     * @deprecated since v3.4
     */
    static markOpacityTree(node: any, isDirty?: boolean): void;
}
