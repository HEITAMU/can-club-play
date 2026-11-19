import { Fog } from '../render-scene/scene/fog';
import { Ambient } from '../render-scene/scene/ambient';
import { Skybox } from '../render-scene/scene/skybox';
import { Shadows } from '../render-scene/scene/shadows';
import { Octree } from '../render-scene/scene/octree';
import { IRenderObject } from './define';
import { Device, Framebuffer, InputAssembler, Buffer, Shader } from '../gfx';
import { Light } from '../render-scene/scene/light';
import { Material } from '../asset/assets';
import { Pass } from '../render-scene/core/pass';
import { CSMLayers } from './shadow/csm-layers';
import { Skin } from '../render-scene/scene/skin';
import { Model } from '../render-scene/scene/model';
import { PostSettings } from '../render-scene/scene/post-settings';
import type { MeshRenderer } from '../3d/framework/mesh-renderer';
import type { LightProbes } from '../gi/light-probe';
export declare class PipelineSceneData {
    /**
      * @en Is open HDR.
      * @zh 是否开启 HDR。
      * @readonly
      */
    get isHDR(): boolean;
    set isHDR(val: boolean);
    get shadingScale(): number;
    set shadingScale(val: number);
    get csmSupported(): boolean;
    set csmSupported(val: boolean);
    /**
     * @engineInternal
     * @en Get the Separable-SSS skin standard model.
     * @zh 获取全局的4s标准模型
     * @returns The model id
     */
    get standardSkinModel(): Model | null;
    set standardSkinModel(val: Model | null);
    /**
     * @engineInternal
     * @en Set the Separable-SSS skin standard model component.
     * @zh 设置一个全局的4s标准模型组件
     * @returns The model id
     */
    get standardSkinMeshRenderer(): MeshRenderer | null;
    set standardSkinMeshRenderer(val: MeshRenderer | null);
    get skinMaterialModel(): Model;
    set skinMaterialModel(val: Model);
    fog: Fog;
    ambient: Ambient;
    skybox: Skybox;
    shadows: Shadows;
    csmLayers: CSMLayers;
    octree: Octree;
    skin: Skin;
    postSettings: PostSettings;
    lightProbes: LightProbes;
    /**
      * @en The list for valid punctual Lights, only available after the scene culling of the current frame.
      * @zh 场景中精确的有效光源，仅在当前帧的场景剔除完成后有效。
      */
    validPunctualLights: Light[];
    /**
      * @en The list for render objects, only available after the scene culling of the current frame.
      * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
      */
    renderObjects: IRenderObject[];
    shadowFrameBufferMap: Map<Light, Framebuffer>;
    protected _device: Device;
    protected _geometryRendererMaterials: Material[];
    protected _geometryRendererPasses: Pass[];
    protected _geometryRendererShaders: Shader[];
    protected _occlusionQueryVertexBuffer: Buffer | null;
    protected _occlusionQueryIndicesBuffer: Buffer | null;
    protected _occlusionQueryInputAssembler: InputAssembler | null;
    protected _occlusionQueryMaterial: Material | null;
    protected _occlusionQueryShader: Shader | null;
    protected _isHDR: boolean;
    protected _shadingScale: number;
    protected _csmSupported: boolean;
    private _standardSkinMeshRenderer;
    private _standardSkinModel;
    private _skinMaterialModel;
    constructor();
    activate(device: Device): boolean;
    initGeometryRendererMaterials(): void;
    get geometryRendererPasses(): Pass[];
    get geometryRendererShaders(): Shader[];
    initOcclusionQuery(): void;
    getOcclusionQueryPass(): Pass | null;
    updatePipelineSceneData(): void;
    destroy(): void;
    private _createOcclusionQueryIA;
}
