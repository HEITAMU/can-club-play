import { SkinInfo } from '../../scene-graph';
/**
 * @en Global skin in the render scene.
 * The initial data is setup in [[SceneGlobals.skip]].
 * @zh 渲染场景中的全局皮肤后处理设置。
 * 初始值是由 [[SceneGlobals.skin]] 设置的。
 */
export declare class Skin {
    /**
     * @en Enable skip.
     * @zh 是否开启皮肤后效。
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    set blurRadius(val: number);
    get blurRadius(): number;
    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    set sssIntensity(val: number);
    get sssIntensity(): number;
    protected _enabled: boolean;
    protected _blurRadius: number;
    protected _sssIntensity: number;
    initialize(skinInfo: SkinInfo): void;
}
