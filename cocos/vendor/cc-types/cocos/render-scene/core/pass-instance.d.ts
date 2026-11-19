import { EffectAsset } from '../../asset/assets/effect-asset';
import { MaterialInstance } from './material-instance';
import { Pass, PassOverrides } from './pass';
import { MacroRecord } from './pass-utils';
/**
 * @en A pass instance defines an variant version of the [[renderer.Pass]]
 * @zh 表示 [[renderer.Pass]] 的一种特殊实例
 */
export declare class PassInstance extends Pass {
    /**
     * @en The parent pass
     * @zh 相关联的原始 Pass
     */
    get parent(): Pass;
    private _parent;
    private _owner;
    private _dontNotify;
    constructor(parent: Pass, owner: MaterialInstance);
    /**
     * @en Override pipeline states with the given pass override info.
     * This won't affect the original pass
     * @zh 重载当前 Pass 的管线状态。这不会影响原始 Pass
     * @param original The original pass info
     * @param value The override pipeline state info
     */
    overridePipelineStates(original: EffectAsset.IPassInfo, overrides: PassOverrides): void;
    tryCompile(defineOverrides?: MacroRecord): boolean;
    /**
     * @en Prepare to change states of the pass and do not notify the material to rebuild the pipeline state object
     * @zh 开始静默修改 Pass 相关状态，不会通知材质去重新构建管线状态对象。
     */
    beginChangeStatesSilently(): void;
    /**
     * @en End the silent states changing process, all state changes will be notified.
     * @zh 结束静默状态修改，所有修改将会开始通知材质。
     */
    endChangeStatesSilently(): void;
    protected _syncBatchingScheme(): void;
    protected _onStateChange(): void;
}
