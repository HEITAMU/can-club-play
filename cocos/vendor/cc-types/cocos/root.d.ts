import { DebugView } from './rendering/debug-view';
import { Camera, Light, Model } from './render-scene/scene';
import type { DataPoolManager } from './3d/skeletal-animation/data-pool-manager';
import { IRenderSceneInfo, RenderScene } from './render-scene/core/render-scene';
import { RenderWindow, IRenderWindowInfo } from './render-scene/core/render-window';
import { Device } from './gfx';
import { BasicPipeline, PipelineRuntime } from './rendering/custom/pipeline';
import { Batcher2D } from './2d/renderer/batcher-2d';
import { IPipelineEvent } from './rendering/pipeline-event';
/**
 * @en Initialization information for the Root
 * @zh Root 初始化描述信息
 */
export interface IRootInfo {
    enableHDR?: boolean;
}
/**
 * @en Creation information for the Root
 * @zh 场景创建描述信息
 */
export interface ISceneInfo {
    name: string;
}
/**
 * @en The root manager of the renderer which manages all device resources and the render pipeline.
 * @zh 基础渲染器管理类，管理所有设备相关的资源创建以及渲染管线。
 */
export declare class Root {
    /**
     * @en The GFX device
     * @zh GFX 设备
     */
    get device(): Device;
    /**
     * @en The main window
     * @zh 主窗口
     */
    get mainWindow(): RenderWindow | null;
    /**
     * @en The current active window
     * @zh 当前激活的窗口
     */
    set curWindow(window: RenderWindow | null);
    get curWindow(): RenderWindow | null;
    /**
     * @e The temporary window for data transmission
     * @zh 临时窗口（用于数据传输）
     * @internal
     */
    set tempWindow(window: RenderWindow | null);
    get tempWindow(): RenderWindow | null;
    /**
     * @en The windows list
     * @zh 窗口列表
     */
    get windows(): RenderWindow[];
    /**
     * @zh
     * 启用自定义渲染管线
     */
    get usesCustomPipeline(): boolean;
    /**
     * @en The render pipeline
     * @zh 渲染管线
     */
    get pipeline(): PipelineRuntime;
    /**
     * @en The custom render pipeline
     * @zh 自定义渲染管线
     */
    get customPipeline(): BasicPipeline;
    /**
     * @en The pipeline events
     * @zh 渲染管线事件
     */
    get pipelineEvent(): IPipelineEvent;
    /**
     * @en The draw batch manager for 2D UI, for engine internal usage, user do not need to use this.
     * @zh 2D UI 渲染合批管理器，引擎内部使用，用户无需使用此接口
     */
    get batcher2D(): Batcher2D;
    /**
     * @en Render scenes list
     * @zh 渲染场景列表
     */
    get scenes(): RenderScene[];
    /**
     * @en The debug view manager for rendering
     * @zh 渲染调试管理器
     */
    get debugView(): DebugView;
    /**
     * @en The time cumulated in seconds since the game began running.
     * @zh 累计时间（秒）。
     */
    get cumulativeTime(): number;
    /**
     * @en The current frame time in seconds.
     * @zh 帧时间（秒）。
     */
    get frameTime(): number;
    /**
     * @en The frame count during the last second
     * @zh 一秒内的累计帧数
     */
    get frameCount(): number;
    /**
     * @en The recent frame rate for the last second
     * @zh 当前每秒帧率
     */
    get fps(): number;
    /**
     * @en The wanted frame rate set by user
     * @zh 每秒设定帧率
     */
    set fixedFPS(fps: number);
    get fixedFPS(): number;
    /**
     * @internal
     */
    get dataPoolManager(): DataPoolManager;
    /**
     * @en Whether the built-in deferred pipeline is used.
     * @zh 是否启用内置延迟渲染管线
     */
    get useDeferredPipeline(): boolean;
    get cameraList(): Camera[];
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _createSceneFun: (root: Root) => RenderScene;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _createWindowFun: (root: Root) => RenderWindow;
    private _device;
    private _windows;
    private _mainWindow;
    private _curWindow;
    private _tempWindow;
    private _usesCustomPipeline;
    private _pipeline;
    private _pipelineEvent;
    private _classicPipeline;
    private _customPipeline;
    private _batcher;
    private _dataPoolMgr;
    private _scenes;
    private _modelPools;
    private _cameraPool;
    private _lightPools;
    private _debugView;
    private _fpsTime;
    private _frameCount;
    private _fps;
    private _fixedFPS;
    private _useDeferredPipeline;
    private _cumulativeTime;
    private _frameTime;
    private _naitveObj;
    private _cameraList;
    /**
     * @en The constructor of the root, user shouldn't create the root instance, it's managed by the [[Director]].
     * @zh 构造函数，用户不应该自己创建任何 Root 对象，它是由 [[Director]] 管理的。
     * @param device GFX device
     */
    constructor(device: Device);
    /**
     * @en The initialization function, user shouldn't initialize the root, it's managed by the [[Director]].
     * @zh 初始化函数，用户不应该自己初始化 Root，它是由 [[Director]] 管理的。
     * @param info Root initialization information
     */
    initialize(info: IRootInfo): void;
    /**
     * @en Destroy the root, user shouldn't invoke this function, it will cause undefined behavior.
     * @zh 销毁 Root，用户不应该调用此方法，会造成未知行为。
     */
    destroy(): void;
    /**
     * @en Resize the on-screen render windows.
     * @zh 重置在屏窗口的大小。
     * @param width The new width of the window.
     * @param height The new height of the window.
     * @param windowId The system window ID, optional for now.
     */
    resize(width: number, height: number, windowId?: number): void;
    /**
     * @en Setup the render pipeline
     * @zh 设置渲染管线
     * @param rppl The render pipeline
     * @returns The setup is successful or not
     */
    setRenderPipeline(useCustomPipeline?: boolean): boolean;
    /**
     * @en Notify the pipeline and all scenes that the global pipeline state have been updated so that they can update their render data and states.
     * @zh 通知渲染管线和所有场景全局管线状态已更新，需要更新自身状态。
     */
    onGlobalPipelineStateChanged(): void;
    /**
     * @en Active the render window as the [[curWindow]]
     * @zh 激活指定窗口为当前窗口 [[curWindow]]
     * @param window The render window to be activated
     */
    activeWindow(window: RenderWindow): void;
    /**
     * @en Reset the time cumulated
     * @zh 重置累计时间
     */
    resetCumulativeTime(): void;
    /**
     * @en The entry function of the render process for every frame.
     * @zh 用于每帧执行渲染流程的入口函数
     * @param deltaTime @en The delta time since last update. @zh 距离上一帧间隔时间
     */
    frameMove(deltaTime: number): void;
    /**
     * @en Create a render window
     * @zh 创建一个新的窗口
     * @param info @en The window creation information @zh 窗口描述信息
     */
    createWindow(info: IRenderWindowInfo): RenderWindow | null;
    /**
     * @en Destroy a render window
     * @zh 销毁指定的窗口
     * @param window The render window to be destroyed
     */
    destroyWindow(window: RenderWindow): void;
    /**
     * @en Destroy all render windows
     * @zh 销毁全部窗口
     */
    destroyWindows(): void;
    /**
     * @en Create a render scene
     * @zh 创建渲染场景
     * @param info @en The creation information for render scene @zh 渲染场景描述信息
     */
    createScene(info: IRenderSceneInfo): RenderScene;
    /**
     * @en Destroy the given render scene
     * @zh 销毁指定的渲染场景
     * @param scene @en The render scene to be destroyed. @zh 要销毁的渲染场景
     */
    destroyScene(scene: RenderScene): void;
    /**
     * @en Destroy all render scenes.
     * @zh 销毁全部场景。
     */
    destroyScenes(): void;
    /**
     * @en Create a model
     * @zh 创建模型
     * @param ModelCtor @en The class of the model @zh 模型的类
     * @returns The model created
     */
    createModel<T extends Model>(ModelCtor: typeof Model): T;
    /**
     * @en Destroy the given model
     * @zh 销毁指定的模型
     * @param m @en The model to be destroyed @zh 要销毁的模型
     */
    destroyModel(m: Model): void;
    /**
     * @en Create a camera
     * @zh 创建一个相机
     * @returns The camera created.
     */
    createCamera(): Camera;
    /**
     * @en Create a light source
     * @zh 创建光源
     * @param LightCtor @en The class of the light @zh 光源的类
     * @returns The light created
     */
    createLight<T extends Light>(LightCtor: new () => T): T;
    /**
     * @en Destroy the given light
     * @zh 销毁指定的光源
     * @param l @en The light to be destroyed @zh 要销毁的光源
     */
    destroyLight(l: Light): void;
    /**
     * @en recycle the given light to light object pool
     * @zh 回收指定的光源到对象池
     * @param l @en The light to be recycled @zh 要回收的光源
     */
    recycleLight(l: Light): void;
    private _doWebXRFrameMove;
    private _frameMoveBegin;
    private _frameMoveProcess;
    private _frameMoveEnd;
    private _resizeMaxJointForDS;
}
