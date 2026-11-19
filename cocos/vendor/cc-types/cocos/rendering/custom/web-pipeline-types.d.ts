import { Mat4, RecyclePool, Color as CoreColor, Quat, Vec4, Vec2 } from '../../core';
import { Color, CommandBuffer, DescriptorSet, Buffer, Device, RenderPass, Sampler, Texture, Shader, InputAssembler } from '../../gfx';
import { Pass, RenderScene } from '../../render-scene';
import { Camera, DirectionalLight, Light, Model, PointLight, RangedDirectionalLight, SphereLight, SpotLight, SubModel } from '../../render-scene/scene';
import { InstancedBuffer } from '../instanced-buffer';
import { LayoutGraphData } from './layout-graph';
import { RenderData } from './render-graph';
import { SceneFlags, UpdateFrequency } from './types';
import { Setter } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
export declare function setTextureUBOView(setter: WebSetter, cfg: Readonly<PipelineSceneData>, layout?: string): void;
export declare function setCameraUBOValues(setter: WebSetter, camera: Readonly<Camera> | null, cfg: Readonly<PipelineSceneData>, scene: RenderScene | null, layoutName?: string): void;
export declare class DrawInstance {
    subModel: SubModel | null;
    priority: number;
    hash: number;
    depth: number;
    shaderID: number;
    passIndex: number;
    constructor(subModel?: SubModel | null, priority?: number, hash?: number, depth?: number, shaderID?: number, passIndex?: number);
    update(subModel?: SubModel | null, priority?: number, hash?: number, depth?: number, shaderID?: number, passIndex?: number): void;
}
export declare const instancePool: RecyclePool<DrawInstance>;
export declare class ProbeHelperQueue {
    probeMap: Array<SubModel>;
    defaultId: number;
    clear(): void;
    applyMacro(): void;
    removeMacro(): void;
    addToProbeQueue(model: Model, probeLayoutId: number): void;
}
export declare function setShadowUBOLightView(setter: WebSetter, camera: Camera | null, light: Light, csmLevel: number, layout?: string): void;
export declare function setShadowUBOView(setter: WebSetter, camera: Camera | null, layout?: string): void;
export declare class WebSetter implements Setter {
    constructor(data: RenderData, lg: LayoutGraphData);
    get name(): string;
    set name(name: string);
    setMat4(name: string, mat: Mat4, idx?: number): void;
    static setMat4(lg: LayoutGraphData, data: RenderData, name: string, mat: Mat4, idx?: number): void;
    setQuaternion(name: string, quat: Quat, idx?: number): void;
    static setQuaternion(lg: LayoutGraphData, data: RenderData, name: string, quat: Quat, idx?: number): void;
    setColor(name: string, color: Color, idx?: number): void;
    static setColor(lg: LayoutGraphData, data: RenderData, name: string, color: Color, idx?: number): void;
    setMathColor(name: string, color: CoreColor, idx?: number): void;
    static setMathColor(lg: LayoutGraphData, data: RenderData, name: string, color: CoreColor, idx?: number): void;
    static getConstantInfo(lg: LayoutGraphData, data: RenderData, name: string): {
        constantID: number;
        dataArr: Array<number>;
    };
    setVec4(name: string, vec: Vec4, idx?: number): void;
    static setVec4(lg: LayoutGraphData, data: RenderData, name: string, vec: Vec4, idx?: number): void;
    setVec2(name: string, vec: Vec2, idx?: number): void;
    static setVec2(lg: LayoutGraphData, data: RenderData, name: string, vec: Vec2, idx?: number): void;
    setFloat(name: string, v: number, idx?: number): void;
    static setFloat(lg: LayoutGraphData, data: RenderData, name: string, v: number, idx?: number): void;
    setArrayBuffer(name: string, arrayBuffer: ArrayBuffer): void;
    static setArrayBuffer(lg: LayoutGraphData, data: RenderData, name: string, arrayBuffer: ArrayBuffer): void;
    setBuffer(name: string, buffer: Buffer): void;
    static setBuffer(lg: LayoutGraphData, data: RenderData, name: string, buffer: Buffer): void;
    setTexture(name: string, texture: Texture): void;
    static setTexture(lg: LayoutGraphData, data: RenderData, name: string, texture: Texture): void;
    setReadWriteBuffer(name: string, buffer: Buffer): void;
    static setReadWriteBuffer(lg: LayoutGraphData, data: RenderData, name: string, buffer: Buffer): void;
    setReadWriteTexture(name: string, texture: Texture): void;
    static setReadWriteTexture(lg: LayoutGraphData, data: RenderData, name: string, texture: Texture): void;
    setSampler(name: string, sampler: Sampler): void;
    static setSampler(lg: LayoutGraphData, data: RenderData, name: string, sampler: Sampler): void;
    getParentLayout(): string;
    getCurrentLayout(): string;
    setBuiltinCameraConstants(camera: Camera): void;
    setBuiltinDirectionalLightFrustumConstants(camera: Camera, light: DirectionalLight, csmLevel?: number): void;
    setBuiltinSpotLightFrustumConstants(light: SpotLight): void;
    setBuiltinDirectionalLightConstants(light: DirectionalLight, camera: Camera): void;
    setBuiltinSphereLightConstants(light: SphereLight, camera: Camera): void;
    setBuiltinSpotLightConstants(light: SpotLight, camera: Camera): void;
    setBuiltinPointLightConstants(light: PointLight, camera: Camera): void;
    setBuiltinRangedDirectionalLightConstants(light: RangedDirectionalLight, camera: Camera): void;
    hasSampler(name: string): boolean;
    hasTexture(name: string): boolean;
    setCustomBehavior(name: string): void;
    protected _data: RenderData;
    protected _lg: LayoutGraphData;
    protected _vertID: number;
    protected _currBlock: any;
    protected _currStage: string;
    protected _currFrequency: UpdateFrequency;
    protected _currCount: any;
    protected _currConstant: number[];
}
export declare class RenderDrawQueue {
    instances: Array<DrawInstance>;
    empty(): boolean;
    clear(): void;
    add(model: Model, depth: number, subModelIdx: number, passIdx: number): void;
    /**
     * @en Comparison sorting function. Opaque objects are sorted by priority -> depth front to back -> shader ID.
     * @zh 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> Shader ID 顺序排序。
     */
    sortOpaqueOrCutout(): void;
    /**
     * @en Comparison sorting function. Transparent objects are sorted by priority -> depth back to front -> shader ID.
     * @zh 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> Shader ID 顺序排序。
     */
    sortTransparent(): void;
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuffer: CommandBuffer, ds?: DescriptorSet | null, offset?: number, dynamicOffsets?: number[] | null): void;
}
export declare class RenderInstancingQueue {
    passInstances: Map<Pass, number>;
    instanceBuffers: Array<InstancedBuffer>;
    empty(): boolean;
    add(pass: Pass, subModel: SubModel, passID: number): void;
    clear(): void;
    sort(): void;
    uploadBuffers(cmdBuffer: CommandBuffer): void;
    recordCommandBuffer(renderPass: RenderPass, cmdBuffer: CommandBuffer, ds?: DescriptorSet | null, offset?: number, dynamicOffsets?: number[] | null): void;
}
export declare class RenderQueueQuery {
    frustumCulledResultID: number;
    lightBoundsCulledResultID: number;
    renderQueueTarget: number;
    constructor(frustumCulledResultID?: number, lightBoundsCulledResultID?: number, renderQueueTargetIn?: number);
    update(culledSourceIn?: number, lightBoundsCulledResultID?: number, renderQueueTargetIn?: number): void;
}
export declare function recordCommand(cmdBuffer: CommandBuffer, _renderPass: RenderPass, pass: Pass, localDesc: DescriptorSet, shader: Shader | null, ia: InputAssembler | null): void;
export declare class RenderQueue {
    probeQueue: ProbeHelperQueue;
    opaqueQueue: RenderDrawQueue;
    transparentQueue: RenderDrawQueue;
    opaqueInstancingQueue: RenderInstancingQueue;
    transparentInstancingQueue: RenderInstancingQueue;
    camera: Camera | null;
    sceneFlags: SceneFlags;
    lightByteOffset: number;
    sort(): void;
    update(): void;
    empty(): boolean;
    recordCommands(cmdBuffer: CommandBuffer, renderPass: RenderPass, sceneFlags: SceneFlags): void;
}
