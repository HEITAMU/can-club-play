/// <reference types="./@types/pal/screen-adapter" />
import { ConfigOrientation } from 'pal/screen-adapter';
import { IAssetManagerOptions } from '../asset/asset-manager/asset-manager';
import { EventTarget, AsyncDelegate, DebugMode, Settings } from '../core';
import { Node } from '../scene-graph';
import { ICustomJointTextureLayout } from '../3d/skeletal-animation/skeletal-animation-utils';
import { IPhysicsConfig } from '../physics/framework/physics-config';
/**
 * @zh
 * 游戏配置。
 * @en
 * Game configuration.
 */
export interface IGameConfig {
    /**
     * @zh
     * 引擎配置文件路径
     * @en
     * The path of settings.json
     */
    settingsPath?: string;
    /**
     * @zh
     * 引擎内 Effect 配置文件路径
     * @en
     * The path of effectSettings.json
     */
    effectSettingsPath?: string;
    /**
     * @zh
     * 设置 debug 模式，在浏览器中这个选项会被忽略。
     * @en
     * Set debug mode, only valid in non-browser environment.
     */
    debugMode?: DebugMode;
    /**
     * @zh
     * 覆盖 settings 模块中的配置项, 用于控制引擎的启动和初始化，你可以在 game.init 中传入参数，也可以在 [game.onPostBaseInitDelegate] 事件回调中覆盖。
     * 需要注意的是你需要在 application.js 模板中指定此选项和监听此事件。
     * @en
     * Overrides the settings module's some configuration, which is used to control the startup and initialization of the engine.
     * You can pass in parameters in game.init or override them in the [game.onPostBaseInitDelegate] event callback.
     * Note: you need to specify this option in the application.js template or add a delegate callback.
     */
    overrideSettings: Partial<{
        [k in Settings.Category[keyof Settings.Category]]: Record<string, any>;
    }>;
    /**
     * @zh
     * 当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。
     * @en
     * Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.PROFILING: { "showFPS": true }}``` to set this.
     */
    showFPS?: boolean;
    /**
     * @zh
     * 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。
     * @en
     * Set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.SCREEN: { "frameRate": 60 }}``` to set this.
     */
    frameRate?: number;
    /**
     * @zh
     * 渲染模式。
     * 设置渲染器类型，仅适用于 web 端：
     * - 0 - 通过引擎自动选择。
     * - 1 - 强制使用 canvas 渲染。
     * - 2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。
     * - 3 - 使用空渲染器，可以用于测试和服务器端环境，目前暂时用于 Cocos 内部测试使用
     * - 4 - 强制使用 WebGPU 渲染，但是在部分浏览器中这个选项会被忽略
     * @en
     * Sets the renderer type, only useful on web:
     * - 0 - Automatically chosen by engine.
     * - 1 - Forced to use canvas renderer.
     * - 2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers.
     * - 3 - Use Headless Renderer, which is useful in test or server env, only for internal use by cocos team for now
     * - 4 - Force WebGPU rendering, but this option will be ignored in some browsers.
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.RENDERING: { "renderMode": 0 }}``` to set this.
     */
    renderMode?: 0 | 1 | 2 | 3 | 4;
    /**
     * @en
     * Render pipeline resources
     * @zh
     * Render pipeline 资源
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.RENDERING: { "renderPipeline": '' }}``` to set this.
     */
    renderPipeline?: string;
    /**
     * @en
     * Asset Manager initialization options
     * @zh
     * 资源管理器初始化设置
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.ASSETS: {}}``` to set this.
     */
    assetOptions?: IAssetManagerOptions;
    /**
     * @en
     * GPU instancing options
     * @zh
     * GPU instancing 选项
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.ANIMATION: { customJointTextureLayouts: [] }}``` to set this.
     */
    customJointTextureLayouts?: ICustomJointTextureLayout[];
    /**
     * @en
     * Physics system config
     * @zh
     * 物理系统设置
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.PHYSICS: {}}``` to set this.
     */
    physics?: IPhysicsConfig;
    /**
     * @en
     * The orientation from the builder configuration.
     * Available value can be 'auto', 'landscape', 'portrait'.
     * @zh
     * 屏幕旋转方向，可选 “自动”，“横屏”，“竖屏”
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.SCREEN: { 'orientation': 'auto' }}``` to set this.
     */
    orientation?: ConfigOrientation;
    /**
     * @en
     * Determine whether the game frame exact fits the screen.
     * Now it only works on Web platform.
     * @zh
     * 是否让游戏外框对齐到屏幕上，目前只在 web 平台生效
     * @deprecated Since v3.6, Please use ```overrideSettings: { SettingsCategory.SCREEN: { 'exactFitScreen': true }}``` to set this.
     */
    exactFitScreen?: boolean;
}
/**
 * @en An object to boot the game.
 * @zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 */
export declare class Game extends EventTarget {
    /**
     * @en Event triggered when game hide to background.<br>
     * Please note that this event is not 100% guaranteed to be fired on Web platform,<br>
     * on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
     * @zh 游戏进入后台时触发的事件。<br>
     * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。<br>
     * 在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。
     * @example
     * ```ts
     * import { game } from 'cc';
     * game.on(Game.EVENT_HIDE, function () {
     *
     * });
     * ```
     */
    static readonly EVENT_HIDE = "game_on_hide";
    /**
     * @en Event triggered when game back to foreground<br>
     * Please note that this event is not 100% guaranteed to be fired on Web platform,<br>
     * on native platforms, it corresponds to enter foreground event.
     * @zh 游戏进入前台运行时触发的事件。<br>
     * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。<br>
     * 在原生平台，它对应的是应用被切换到前台事件。
     */
    static readonly EVENT_SHOW: string;
    /**
     * @en Event triggered when system in low memory status.<br>
     * This event is only triggered on native iOS/Android platform.
     * @zh 程序在内存不足时触发的事件。<br>
     * 该事件只会在 iOS/Android 平台触发。
     */
    static readonly EVENT_LOW_MEMORY: string;
    /**
     * @en Event triggered after game inited, at this point all engine objects and game scripts are loaded
     * @zh 游戏启动后的触发事件，此时加载所有的引擎对象和游戏脚本。
     */
    static readonly EVENT_GAME_INITED = "game_inited";
    /**
     * @en Event triggered after engine inited, at this point you will be able to use all engine classes.<br>
     * It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0.
     * Since Cocos Creator v3.0, EVENT_RENDERER_INITED is a new event, look up define for details.
     * @zh 在引擎初始化之后触发的事件，此时您能够使用引擎所有的类。<br>
     * 它在 Cocos Creator v1.x 版本中名字为 EVENT_RENDERER_INITED，在 v2.0 更名为 EVENT_ENGINE_INITED
     * 并在 Cocos Creator v3.0 中将 EVENT_RENDERER_INITED 用作为渲染器初始化的事件。
     */
    static readonly EVENT_ENGINE_INITED = "engine_inited";
    /**
     * @en Event triggered after renderer inited, at this point you will be able to use all gfx renderer feature.<br>
     * @zh 在渲染器初始化之后触发的事件，此事件在 EVENT_ENGINE_INITED 之前触发，此时开始可使用 gfx 渲染框架。
     */
    static readonly EVENT_RENDERER_INITED: string;
    /**
     * @en Event triggered pre base module initialization, at this point you can not use pal/logging/sys/settings API.
     * @zh 基础模块初始化之前的事件，在这个事件点你无法使用 pal/logging/sys/settings 的相关接口。
     */
    static readonly EVENT_PRE_BASE_INIT = "pre_base_init";
    /**
     * @en Event triggered post base module initialization, at this point you can use pal/logging/sys/settings API safely.
     * @zh 基础模块初始化之后的事件，在这个事件点你可以安全使用 pal/logging/sys/settings 的相关接口。
     */
    static readonly EVENT_POST_BASE_INIT = "post_base_init";
    /**
     * @en Event triggered pre infrastructure initialization, at this point you can not use assetManager/gfx/screen/builtinResMgr/macro/Layer API.
     * @zh 基础设施初始化之前的事件，在这个事件点你无法使用 assetManager/gfx/screen/builtinResMgr/macro/Layer 的相关接口。
     */
    static readonly EVENT_PRE_INFRASTRUCTURE_INIT = "pre_infrastructure_init";
    /**
     * @en Event triggered post infrastructure initialization, at this point you can use assetManager/gfx/screen/builtinResMgr/macro/Layer API safely.
     * @zh 基础设施初始化之后的事件，在这个事件点你可以安全使用 assetManager/gfx/screen/builtinResMgr/macro/Layer 的相关接口。
     */
    static readonly EVENT_POST_INFRASTRUCTURE_INIT = "post_infrastructure_init";
    /**
     * @en Event triggered pre subsystem initialization, at this point you can not use physics/animation/rendering/tween/etc API.
     * @zh 子系统初始化之前的事件，在这个事件点你无法使用 physics/animation/rendering/tween/etc 的相关接口。
     */
    static readonly EVENT_PRE_SUBSYSTEM_INIT = "pre_subsystem_init";
    /**
     * @en Event triggered post subsystem initialization, at this point you can use physics/animation/rendering/tween/etc API safely.
     * @zh 子系统初始化之后的事件，在这个事件点你可以安全使用 physics/animation/rendering/tween/etc 的相关接口。
     */
    static readonly EVENT_POST_SUBSYSTEM_INIT = "post_subsystem_init";
    /**
     * @en Event triggered pre project data initialization,
     * at this point you can not access project data using [resources.load]/[director.loadScene] API.
     * @zh 项目数据初始化之前的事件，在这个事件点你无法使用访问项目数据的相关接口，例如 [resources.load]/[director.loadScene] 等 API。
     */
    static readonly EVENT_PRE_PROJECT_INIT = "pre_project_init";
    /**
     * @en Event triggered post project data initialization,
     * at this point you can access project data using [resources.load]/[director.loadScene] API safely.
     * @zh 项目数据初始化之后的事件，在这个事件点你可以安全使用访问项目数据的相关接口，例如 [resources.load]/[director.loadScene] 等 API。
     */
    static readonly EVENT_POST_PROJECT_INIT = "post_project_init";
    /**
     * @en Event triggered when game restart
     * @zh 调用restart后，触发事件
     */
    static readonly EVENT_RESTART = "game_on_restart";
    /**
     * @en Triggered when the game is paused.<br>
     * @zh 游戏暂停时触发该事件。<br>
     * @example
     * ```ts
     * import { game } from 'cc';
     * game.on(Game.EVENT_PAUSE, function () {
     *     //pause audio or video
     * });
     * ```
     */
    static readonly EVENT_PAUSE = "game_on_pause";
    /**
     * @en Triggered when the game is resumed.<br>
     * @zh 游戏恢复时触发该事件。<br>
     */
    static readonly EVENT_RESUME = "game_on_resume";
    /**
     * @en Triggered when the game will be closed. <br>
     * @zh 游戏将要关闭时触发的事件。<br>
     */
    static readonly EVENT_CLOSE = "game_on_close";
    /**
     * @en Web Canvas 2d API as renderer backend.
     * @zh 使用 Web Canvas 2d API 作为渲染器后端。
     */
    static readonly RENDER_TYPE_CANVAS = 0;
    /**
     * @en WebGL API as renderer backend.
     * @zh 使用 WebGL API 作为渲染器后端。
     */
    static readonly RENDER_TYPE_WEBGL = 1;
    /**
     * @en OpenGL API as renderer backend.
     * @zh 使用 OpenGL API 作为渲染器后端。
     */
    static readonly RENDER_TYPE_OPENGL = 2;
    /**
     * @en Headless Renderer, usually used in test or server env
     * @zh 空渲染器，通常用于测试环境或服务器端模式
     */
    static readonly RENDER_TYPE_HEADLESS = 3;
    /**
     * @en If delta time since last frame is more than this threshold in seconds,
     * the game timer will consider user is debugging and adjust the delta time to [[frameTime]].
     * @zh 如果距离上一帧的帧间隔超过了这个阈值（单位是 s），那么就会被认为正在调试，帧间隔会被自动调节为 [[frameTime]].
     */
    static DEBUG_DT_THRESHOLD: number;
    /**
     * @en The outer frame of the game canvas; parent of game container.
     * @zh 游戏画布的外框，container 的父容器。
     *
     * @deprecated since 3.4.0, frame is a concept on web standard, please manager screens via the `screen` module.
     */
    frame: HTMLDivElement | null;
    /**
     * @en The container of game canvas.
     * @zh 游戏画布的容器。
     *
     * @deprecated since 3.4.0, container is a concept on web standard, please manager screens via the `screen` module.
     */
    container: HTMLDivElement | null;
    /**
     * @en The canvas of the game.
     * @zh 游戏的画布。
     */
    canvas: HTMLCanvasElement | null;
    /**
     * @en The renderer backend of the game.
     * @zh 游戏的渲染器类型。
     */
    renderType: number;
    eventTargetOn: <TFunction extends (...args: any[]) => void>(type: string | number, callback: TFunction, thisArg?: any, once?: boolean | undefined) => TFunction;
    eventTargetOnce: <TFunction extends (...args: any[]) => void>(type: string | number, callback: TFunction, thisArg?: any) => TFunction;
    /**
     * @en
     * The current game configuration,
     * please be noticed any modification directly on this object after the game initialization won't take effect.
     * @zh
     * 当前的游戏配置
     * 注意：请不要直接修改这个对象，它不会有任何效果。
     */
    config: IGameConfig;
    /**
     * @en Callback when the scripts of engine have been load.
     * @zh 当引擎完成启动后的回调函数。
     * @method onStart
     */
    onStart: Game.OnStart | null;
    constructor();
    /**
     * @en Indicates whether the engine and the renderer has been initialized
     * @zh 引擎和渲染器是否以完成初始化
     */
    get inited(): boolean;
    /**
     * @en Expected frame rate of the game.
     * @zh 游戏的设定帧率。
     */
    get frameRate(): string | number;
    set frameRate(frameRate: number | string);
    /**
     * @en The delta time since last frame, unit: s.
     * @zh 获取上一帧的增量时间，以秒为单位。
     */
    get deltaTime(): number;
    /**
     * @en The total passed time since game start, unit: ms
     * @zh 获取从游戏开始到现在总共经过的时间，以毫秒为单位
     */
    get totalTime(): number;
    /**
     * @en The start time of the current frame in milliseconds.
     * @zh 获取当前帧开始的时间（以 ms 为单位）。
     */
    get frameStartTime(): number;
    /**
     * @en The expected delta time of each frame in milliseconds
     * @zh 期望帧率对应的每帧时间（以 ms 为单位）
     */
    frameTime: number;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _isCloning: boolean;
    private _inited;
    private _engineInited;
    private _rendererInitialized;
    private _paused;
    private _pausedByEngine;
    private _frameRate;
    private _pacer;
    private _initTime;
    private _startTime;
    private _deltaTime;
    private _useFixedDeltaTime;
    private _shouldLoadLaunchScene;
    /**
     * @en The event delegate pre base module initialization. At this point you can not use pal/logging/sys/settings API.
     * @zh 基础模块初始化之前的事件代理。在这个事件点你无法使用 pal/logging/sys/settings 的相关接口。
     */
    readonly onPreBaseInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate post base module initialization. At this point you can use pal/logging/sys/settings API safely.
     * @zh 基础模块初始化之后的事件代理。在这个事件点你可以安全使用 pal/logging/sys/settings 的相关接口。
     */
    readonly onPostBaseInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate pre infrastructure module initialization.
     * At this point you can not use assetManager/gfx/screen/builtinResMgr/macro/Layer API.
     * @zh 基础设施模块初始化之前的事件代理。在这个事件点你无法使用 assetManager/gfx/screen/builtinResMgr/macro/Layer 的相关接口。
     */
    readonly onPreInfrastructureInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate post infrastructure module initialization.
     * At this point you can use assetManager/gfx/screen/builtinResMgr/macro/Layer API safely.
     *
     * @zh 基础设施模块初始化之后的事件代理。在这个事件点你可以安全使用 assetManager/gfx/screen/builtinResMgr/macro/Layer 的相关接口。
     */
    readonly onPostInfrastructureInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate pre sub system module initialization. At this point you can not use physics/animation/rendering/tween/etc API.
     * @zh 子系统模块初始化之前的事件代理。在这个事件点你无法使用 physics/animation/rendering/tween/etc 的相关接口。
     */
    readonly onPreSubsystemInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate post sub system module initialization. At this point you can use physics/animation/rendering/tween/etc API safely.
     * @zh 子系统模块初始化之后的事件代理。在这个事件点你可以安全使用 physics/animation/rendering/tween/etc 的相关接口。
     */
    readonly onPostSubsystemInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate pre project data initialization.
     * At this point you can not access project data using [resources.load]/[director.loadScene] API.
     * @zh 项目数据初始化之前的事件代理。在这个事件点你无法使用访问项目数据的相关接口，例如 [resources.load]/[director.loadScene] 等 API。
     */
    readonly onPreProjectInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en The event delegate post project data initialization.
     * at this point you can access project data using [resources.load]/[director.loadScene] API safely.
     * @zh 项目数据初始化之后的事件代理。
     * 在这个事件点你可以安全使用访问项目数据的相关接口，例如 [resources.load]/[director.loadScene] 等 API。
     */
    readonly onPostProjectInitDelegate: AsyncDelegate<() => (Promise<void> | void)>;
    /**
     * @en Set frame rate of game.
     * @zh 设置游戏帧率。
     * @deprecated since v3.3.0 please use [[game.frameRate]]
     */
    setFrameRate(frameRate: number | string): void;
    /**
     * @en Get frame rate set for the game, it doesn't represent the real frame rate.
     * @zh 获取设置的游戏帧率（不等同于实际帧率）。
     * @return frame rate
     * @deprecated since v3.3.0 please use [[game.frameRate]]
     */
    getFrameRate(): number;
    /**
     * @en Run the game frame by frame with a fixed delta time correspond to frame rate.
     * @zh 以固定帧间隔执行一帧游戏循环，帧间隔与设定的帧率匹配。
     */
    step(): void;
    /**
     * @en Called by the engine to pause the game.
     * @zh 提供给引擎调用暂停游戏接口。
     */
    private pauseByEngine;
    /**
     * @en Resume paused game by engine call.
     * @zh 提供给引擎调用恢复暂停游戏接口。
     */
    private resumeByEngine;
    /**
     * @en Pause the game main loop. This will pause:
     * - game logic execution
     * - rendering process
     * - input event dispatching (excluding Web and Minigame platforms)
     *
     * This is different with `director.pause()` which only pause the game logic execution.
     *
     * @zh 暂停游戏主循环。包含：
     * - 游戏逻辑
     * - 渲染
     * - 输入事件派发（Web 和小游戏平台除外）
     *
     * 这点和只暂停游戏逻辑的 `director.pause()` 不同。
     */
    pause(): void;
    /**
     * @en Resume the game from pause. This will resume:<br>
     * game logic execution, rendering process, event manager, background music and all audio effects.<br>
     * @zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
     */
    resume(): void;
    /**
     * @en Check whether the game is paused.
     * @zh 判断游戏是否暂停。
     */
    isPaused(): boolean;
    /**
     * @en Restart game.
     * @zh 重新开始游戏
     */
    restart(): Promise<void>;
    /**
     * @en End game, it will close the game window
     * @zh 退出游戏
     */
    end(): void;
    /**
     * @en
     * Register an callback of a specific event type on the game object.<br>
     * This type of event should be triggered via `emit`.<br>
     * @zh
     * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。<br>
     *
     * @param type - A string representing the event type to listen for.
     * @param callback - The callback that will be invoked when the event is dispatched.<br>
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param target - The target (this object) to invoke the callback, can be null
     * @param once - After the first invocation, whether the callback should be unregistered.
     * @return - Just returns the incoming callback so you can save the anonymous function easier.
     */
    on(type: string, callback: () => void, target?: any, once?: boolean): any;
    /**
     * @en
     * Register an callback of a specific event type on the game object,<br>
     * the callback will remove itself after the first time it is triggered.<br>
     * @zh
     * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @param type - A string representing the event type to listen for.
     * @param callback - The callback that will be invoked when the event is dispatched.<br>
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param target - The target (this object) to invoke the callback, can be null
     */
    once(type: string, callback: () => void, target?: any): any;
    private canRegisterEvent;
    /**
     * @en Init game with configuration object. Initialization process like below:
     * -PreBaseInitEvent
     * -BaseModuleInitialization(logging, sys, settings)
     * -PostBaseInitEvent
     * -PreInfrastructureInitEvent
     * -InfrastructureModuleInitialization(assetManager, builtinResMgr, gfxDevice, screen, Layer, macro)
     * -PostInfrastructureInitEvent
     * -PreSubsystemInitEvent
     * -SubsystemModuleInitialization(animation, physics, tween, ui, middleware, etc)
     * -PostSubsystemInitEvent
     * -EngineInitedEvent
     * -PreProjectDataInitEvent
     * -ProjectDataInitialization(GamePlayScripts, resources, etc)
     * -PostProjectDataInitEvent
     * -GameInitedEvent
     *
     * @zh 使用指定的配置初始化引擎。初始化流程如下：
     * -PreBaseInitEvent
     * -BaseModuleInitialization(logging, sys, settings)
     * -PostBaseInitEvent
     * -PreInfrastructureInitEvent
     * -InfrastructureModuleInitialization(assetManager, builtinResMgr, gfxDevice, screen, Layer, macro)
     * -PostInfrastructureInitEvent
     * -PreSubsystemInitEvent
     * -SubsystemModuleInitialization(animation, physics, tween, ui, middleware, etc)
     * -PostSubsystemInitEvent
     * -EngineInitedEvent
     * -PreProjectDataInitEvent
     * -ProjectDataInitialization(GamePlayScripts, resources, etc)
     * -PostProjectDataInitEvent
     * -GameInitedEvent
     * @param config - Pass configuration object
     */
    init(config: IGameConfig): Promise<void>;
    private _initXR;
    private _compatibleWithOldParams;
    private _loadPreloadAssets;
    /**
     * @internal only for browser preview
     */
    private _loadCCEScripts;
    /**
     * @internal only for game-view
     */
    _loadProjectBundles(): Promise<void[]>;
    /**
     * @en Run game with configuration object and onStart function.
     * @zh 运行游戏，并且指定引擎配置和 onStart 的回调。
     * @param onStart - function to be executed after game initialized
     */
    run(onStart?: Game.OnStart): void;
    /**
     * @engineInternal
     */
    _calculateDT(useFixedDeltaTime: boolean): number;
    private _updateCallback;
    private initPacer;
    private _initEvents;
    private _onHide;
    private _onShow;
    private _onClose;
    /**
     * @en
     * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br>
     * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
     * @zh
     * 声明常驻根节点，该节点不会在场景切换中被销毁。<br>
     * 目标节点必须位于为层级的根节点，否则无效。
     * @param node - The node to be made persistent
     * @deprecated Since v3.6.0, please use director.addPersistRootNode instead.
     */
    addPersistRootNode(node: Node): void;
    /**
     * @en Remove a persistent root node.
     * @zh 取消常驻根节点。
     * @param node - The node to be removed from persistent node list
     * @deprecated Since v3.6.0, please use director.removePersistRootNode instead.
     */
    removePersistRootNode(node: Node): void;
    /**
     * @en Check whether the node is a persistent root node.
     * @zh 检查节点是否是常驻根节点。
     * @param node - The node to be checked.
     * @deprecated Since v3.6.0, please use director.isPersistRootNode instead.
     */
    isPersistRootNode(node: Node): boolean;
    private _setupRenderPipeline;
    private _setRenderPipeline;
    private _safeEmit;
}
export declare namespace Game {
    type OnStart = () => void;
}
/**
 * @en
 * This is a Game instance.
 * @zh
 * 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。
 */
export declare const game: Game;
