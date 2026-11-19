import { ComparisonFunc, StencilOp, DepthStencilState } from '../../gfx';
import { Material } from '../../asset/assets';
import { UIRenderer } from '../framework/ui-renderer';
import { UIMeshRenderer } from '../components/ui-mesh-renderer';
/**
 * @en Stencil stage types enum.
 * @zh 模板状态类型枚举。
 * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export declare enum Stage {
    DISABLED = 0,
    CLEAR = 1,
    ENTER_LEVEL = 2,
    ENABLED = 3,
    EXIT_LEVEL = 4,
    CLEAR_INVERTED = 5,
    ENTER_LEVEL_INVERTED = 6
}
/**
 * @en Native stencil buffer format enum.
 * @zh 原生模板缓冲格式枚举。
 * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export declare enum StencilSharedBufferView {
    stencilTest = 0,
    func = 1,
    stencilMask = 2,
    writeMask = 3,
    failOp = 4,
    zFailOp = 5,
    passOp = 6,
    ref = 7,
    count = 8
}
/**
 * @en Stencil state manager.
 * @zh 模板状态管理器。
 * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export declare class StencilManager {
    static sharedManager: StencilManager | null;
    private _maskStack;
    private _stencilPattern;
    private _stage;
    /**
     * @en Stencil stage.
     * @zh 模板缓冲阶段。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get stage(): Stage;
    set stage(val: Stage);
    /**
     * @en Stencil pattern.
     * @zh 模板缓冲样式。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get pattern(): {
        stencilTest: boolean;
        func: ComparisonFunc;
        stencilMask: number;
        writeMask: number;
        failOp: StencilOp;
        zFailOp: StencilOp;
        passOp: StencilOp;
        ref: number;
    };
    /**
     * @en Add mask nesting.
     * @zh 添加mask嵌套。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    pushMask(mask: number): void;
    /**
     * @en clear stencil stage.
     * @zh 清空模板状态。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    clear(comp: UIRenderer | UIMeshRenderer): Stage;
    /**
     * @en Open stencil stage to enabled.
     * @zh 开启模板状态。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    enableMask(): void;
    /**
     * @en exit stencil.
     * @zh 退出模板状态。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    exitMask(): void;
    /**
     * @en Get write mask count.
     * @zh 获取写入模板缓冲的位数。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    getWriteMask(): number;
    /**
     * @en Get write mask count when exit.
     * @zh 获取退出时模板缓冲的位数。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    getExitWriteMask(): number;
    private getStencilRef;
    /**
     * @en Get mask nesting count.
     * @zh 获取mask嵌套数量。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    getMaskStackSize(): number;
    /**
     * @en Reset stencil stage.
     * @zh 重置模板状态。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    reset(): void;
    destroy(): void;
    private stencilStateMap;
    private stencilStateMapWithDepth;
    /**
     * @en Get stencil stage.
     * @zh 获取模板状态。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    getStencilStage(stage: Stage, mat?: Material): DepthStencilState;
    /**
     * @en Get stencil hash.
     * @zh 获取模板状态的哈希值。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    getStencilHash(stage: Stage): number;
    private setStateFromStage;
}
