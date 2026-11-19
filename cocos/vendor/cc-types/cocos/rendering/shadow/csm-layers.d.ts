import { DirectionalLight } from '../../render-scene/scene/directional-light';
import { Camera } from '../../render-scene/scene/camera';
import { Mat4, Vec4 } from '../../core/math';
import { Frustum, AABB } from '../../core/geometry';
import { IRenderObject } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { CachedArray } from '../../core/memop/cached-array';
export declare class ShadowLayerVolume {
    protected _shadowObjects: IRenderObject[];
    protected _shadowCameraFar: number;
    protected _level: number;
    protected _matShadowView: Mat4;
    protected _matShadowProj: Mat4;
    protected _matShadowViewProj: Mat4;
    protected _validFrustum: Frustum;
    protected _splitFrustum: Frustum;
    protected _lightViewFrustum: Frustum;
    protected _castLightViewBoundingBox: AABB;
    constructor(level: number);
    get level(): number;
    get shadowObjects(): IRenderObject[];
    get shadowCameraFar(): number;
    set shadowCameraFar(val: number);
    get matShadowView(): Mat4;
    set matShadowView(val: Mat4);
    get matShadowProj(): Mat4;
    set matShadowProj(val: Mat4);
    get matShadowViewProj(): Mat4;
    set matShadowViewProj(val: Mat4);
    get validFrustum(): Readonly<Frustum>;
    get splitFrustum(): Readonly<Frustum>;
    get lightViewFrustum(): Readonly<Frustum>;
    get castLightViewBoundingBox(): Readonly<AABB>;
    copyToValidFrustum(validFrustum: Readonly<Frustum>): void;
    calculateValidFrustumOrtho(width: number, height: number, near: number, far: number, transform: Mat4): void;
    calculateSplitFrustum(camera: Camera, m: Mat4, start: number, end: number): void;
    destroy(): void;
    createMatrix(dirLight: DirectionalLight, shadowMapWidth: number, onlyForCulling: boolean): void;
}
export declare class CSMShadowLayer extends ShadowLayerVolume {
    protected _splitCameraNear: number;
    protected _splitCameraFar: number;
    protected _csmAtlas: Vec4;
    constructor(level: number);
    get splitCameraNear(): number;
    set splitCameraNear(val: number);
    get splitCameraFar(): number;
    set splitCameraFar(val: number);
    get csmAtlas(): Vec4;
    set csmAtlas(val: Vec4);
    destroy(): void;
    private _calculateAtlas;
}
/**
 * @en Shadow CSM layer manager
 * @zh CSM阴影图层管理
 */
export declare class CSMLayers {
    protected _castShadowObjects: IRenderObject[];
    protected _layerObjects: CachedArray<IRenderObject>;
    protected _layers: CSMShadowLayer[];
    protected _levelCount: number;
    protected _specialLayer: ShadowLayerVolume;
    protected _shadowDistance: number;
    get castShadowObjects(): IRenderObject[];
    get layerObjects(): CachedArray<IRenderObject>;
    get layers(): CSMShadowLayer[];
    get specialLayer(): ShadowLayerVolume;
    constructor();
    update(sceneData: PipelineSceneData, camera: Camera): void;
    destroy(): void;
    private _updateFixedArea;
    private _splitFrustumLevels;
    private _calculateCSM;
    private _getCameraWorldMatrix;
}
