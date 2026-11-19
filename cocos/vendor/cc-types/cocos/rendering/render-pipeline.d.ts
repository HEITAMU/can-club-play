import { Asset } from '../asset/assets/asset';
import { Buffer, ClearFlags, CommandBuffer, DescriptorSet, Device, Format, Framebuffer, InputAssembler, Rect, RenderPass, Sampler, Swapchain, Texture, Viewport, DescriptorSetLayout } from '../gfx';
import { MacroRecord } from '../render-scene/core/pass-utils';
import { RenderWindow } from '../render-scene/core/render-window';
import { Camera } from '../render-scene/scene/camera';
import { Model } from '../render-scene/scene/model';
import { GlobalDSManager } from './global-descriptor-set-manager';
import { GeometryRenderer } from './geometry-renderer';
import { PipelineSceneData } from './pipeline-scene-data';
import { PipelineUBO } from './pipeline-ubo';
import { RenderFlow } from './render-flow';
import { IPipelineEvent, PipelineEventCallback, PipelineEventProcessor, PipelineEventType } from './pipeline-event';
import { PipelineInputAssemblerData } from './render-types';
import { PipelineRuntime } from './custom/pipeline';
/**
 * @en Render pipeline information descriptor
 * @zh 渲染管线描述信息。
 */
export interface IRenderPipelineInfo {
    flows: RenderFlow[];
    tag?: number;
}
export declare const MAX_BLOOM_FILTER_PASS_NUM = 6;
export declare class BloomRenderData {
    renderPass: RenderPass;
    sampler: Sampler;
    prefiterTex: Texture;
    downsampleTexs: Texture[];
    upsampleTexs: Texture[];
    combineTex: Texture;
    prefilterFramebuffer: Framebuffer;
    downsampleFramebuffers: Framebuffer[];
    upsampleFramebuffers: Framebuffer[];
    combineFramebuffer: Framebuffer;
}
export declare class PipelineRenderData {
    outputFrameBuffer: Framebuffer;
    outputRenderTargets: Texture[];
    outputDepth: Texture;
    sampler: Sampler;
    bloom: BloomRenderData | null;
}
/**
 * @en Render pipeline describes how we handle the rendering process for all render objects in the related render scene root.
 * It contains some general pipeline configurations, necessary rendering resources and some [[RenderFlow]]s.
 * The rendering process function [[render]] is invoked by [[Root]] for all [[Camera]]s.
 * @zh 渲染管线对象决定了引擎对相关渲染场景下的所有渲染对象实施的完整渲染流程。
 * 这个类主要包含一些通用的管线配置，必要的渲染资源和一些 [[RenderFlow]]。
 * 渲染流程函数 [[render]] 会由 [[Root]] 发起调用并对所有 [[Camera]] 执行预设的渲染流程。
 */
export declare abstract class RenderPipeline extends Asset implements IPipelineEvent, PipelineRuntime {
    /**
     * @en The tag of pipeline.
     * @zh 管线的标签。
     * @readonly
     */
    get tag(): number;
    /**
     * @en The flows of pipeline.
     * @zh 管线的渲染流程列表。
     * @readonly
     */
    get flows(): RenderFlow[];
    /**
     * @en Tag
     * @zh 标签
     * @readonly
     */
    protected _tag: number;
    /**
     * @en Flows
     * @zh 渲染流程列表
     * @readonly
     */
    protected _flows: RenderFlow[];
    protected _quadIB: Buffer | null;
    protected _quadVBOnscreen: Buffer | null;
    protected _quadVBOffscreen: Buffer | null;
    protected _quadIAOnscreen: InputAssembler | null;
    protected _quadIAOffscreen: InputAssembler | null;
    protected _eventProcessor: PipelineEventProcessor;
    constructor(name?: string);
    /**
     * @zh
     * 四边形输入汇集器。
     */
    get quadIAOnscreen(): InputAssembler;
    get quadIAOffscreen(): InputAssembler;
    getPipelineRenderData(): PipelineRenderData;
    /**
     * @en
     * Constant macro string, static throughout the whole runtime.
     * Used to pass device-specific parameters to shader.
     * @zh 常量宏定义字符串，运行时全程不会改变，用于给 shader 传一些只和平台相关的参数。
     * @readonly
     */
    get constantMacros(): string;
    /**
     * @en
     * The current global-scoped shader macros.
     * Used to control effects like IBL, fog, etc.
     * @zh 当前的全局宏定义，用于控制如 IBL、雾效等模块。
     * @readonly
     */
    get macros(): MacroRecord;
    get device(): Device;
    get globalDSManager(): GlobalDSManager;
    get descriptorSetLayout(): DescriptorSetLayout;
    get descriptorSet(): DescriptorSet;
    get commandBuffers(): CommandBuffer[];
    get pipelineUBO(): PipelineUBO;
    get pipelineSceneData(): PipelineSceneData;
    set profiler(value: Model | null);
    get profiler(): Model | null;
    /**
     * @deprecated since v3.6, please use camera.geometryRenderer instead.
     */
    get geometryRenderer(): GeometryRenderer | null;
    set clusterEnabled(value: boolean);
    get clusterEnabled(): boolean;
    set bloomEnabled(value: boolean);
    get bloomEnabled(): boolean;
    protected _device: Device;
    protected _globalDSManager: GlobalDSManager;
    protected _descriptorSet: DescriptorSet;
    protected _commandBuffers: CommandBuffer[];
    protected _pipelineUBO: PipelineUBO;
    protected _macros: MacroRecord;
    protected _constantMacros: string;
    protected _profiler: Model | null;
    protected _geometryRenderer: GeometryRenderer | null;
    protected _pipelineSceneData: PipelineSceneData;
    protected _pipelineRenderData: PipelineRenderData | null;
    protected _renderPasses: Map<number, RenderPass>;
    protected _width: number;
    protected _height: number;
    protected _lastUsedRenderArea: Rect;
    protected _clusterEnabled: boolean;
    protected _bloomEnabled: boolean;
    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render pipeline information
     */
    initialize(info: IRenderPipelineInfo): boolean;
    createRenderPass(clearFlags: ClearFlags, colorFmt: Format, depthFmt: Format): RenderPass;
    getRenderPass(clearFlags: ClearFlags, fbo: Framebuffer): RenderPass;
    newFramebufferByRatio(dyingFramebuffer: Framebuffer): Framebuffer;
    /**
     * @en generate renderArea by camera
     * @zh 生成renderArea
     * @param camera the camera
     * @returns
     */
    generateRenderArea(camera: Camera, out: Rect): void;
    generateViewport(camera: Camera, out?: Viewport): Viewport;
    generateScissor(camera: Camera, out?: Rect): Rect;
    get shadingScale(): number;
    set shadingScale(val: number);
    getMacroString(name: string): string;
    getMacroInt(name: string): number;
    getMacroBool(name: string): boolean;
    setMacroString(name: string, value: string): void;
    setMacroInt(name: string, value: number): void;
    setMacroBool(name: string, value: boolean): void;
    /**
     * @en Activate the render pipeline after loaded, it mainly activate the flows
     * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
     * TODO: remove swapchain dependency at this stage
     * after deferred pipeline can handle multiple swapchains
     */
    activate(swapchain: Swapchain): boolean;
    protected _ensureEnoughSize(cameras: Camera[]): void;
    /**
     * @en Render function, it basically run the render process of all flows in sequence for the given view.
     * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染流程。
     * @param view Render view。
     */
    render(cameras: Camera[]): void;
    /**
     * @zh
     * 销毁四边形输入汇集器。
     */
    protected _destroyQuadInputAssembler(): void;
    protected _destroyBloomData(): void;
    private _genQuadVertexData;
    /**
     * @zh
     * 创建四边形输入汇集器。
     */
    protected _createQuadInputAssembler(): PipelineInputAssemblerData;
    updateQuadVertexData(renderArea: Rect, window: RenderWindow): void;
    /**
     * @en Internal destroy function
     * @zh 内部销毁函数。
     */
    destroy(): boolean;
    onGlobalPipelineStateChanged(): void;
    protected _generateConstantMacros(): void;
    protected updateGeometryRenderer(cameras: Camera[]): void;
    generateBloomRenderData(): void;
    /**
     * @en
     * Register an callback of the pipeline event type on the RenderPipeline.
     * @zh
     * 在渲染管线中注册管线事件类型的回调。
     */
    on<TFunction extends PipelineEventCallback>(type: PipelineEventType, callback: TFunction, target?: any, once?: boolean): typeof callback;
    /**
     * @en
     * Register an callback of the pipeline event type on the RenderPipeline,
     * the callback will remove itself after the first time it is triggered.
     * @zh
     * 在渲染管线中注册管线事件类型的回调, 回调后会在第一时间删除自身。
     */
    once<TFunction extends PipelineEventCallback>(type: PipelineEventType, callback: TFunction, target?: any): typeof callback;
    /**
     * @en
     * Removes the listeners previously registered with the same type, callback, target and or useCapture,
     * if only type is passed as parameter, all listeners registered with that type will be removed.
     * @zh
     * 删除之前用同类型、回调、目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     */
    off<TFunction extends PipelineEventCallback>(type: PipelineEventType, callback?: TFunction, target?: any): void;
    /**
     * @zh 派发一个指定事件，并传递需要的参数
     * @en Trigger an event directly with the event name and necessary arguments.
     * @param type - event type
     * @param args - Arguments when the event triggered
     */
    emit(type: PipelineEventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    /**
     * @en Removes all callbacks previously registered with the same target (passed as parameter).
     * This is not for removing all listeners in the current event target,
     * and this is not for removing all listeners the target parameter have registered.
     * It's only for removing all listeners (callback and target couple) registered on the current event target by the target parameter.
     * @zh 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
     * 这个函数无法删除当前 EventTarget 的所有事件监听器，也无法删除 target 参数所注册的所有事件监听器。
     * 这个函数只能删除 target 参数在当前 EventTarget 上注册的所有事件监听器。
     * @param typeOrTarget - The target to be searched for all related listeners
     */
    targetOff(typeOrTarget: any): void;
    /**
     * @zh 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
     * @en Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
     * @param typeOrTarget - The event type or target with which the listeners will be removed
     */
    removeAll(typeOrTarget: any): void;
    /**
     * @zh 检查指定事件是否已注册回调。
     * @en Checks whether there is correspond event listener registered on the given event.
     * @param type - Event type.
     * @param callback - Callback function when event triggered.
     * @param target - Callback callee.
     */
    hasEventListener(type: PipelineEventType, callback?: PipelineEventCallback, target?: any): boolean;
}
