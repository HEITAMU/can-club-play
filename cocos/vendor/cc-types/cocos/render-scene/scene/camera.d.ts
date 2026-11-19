import { SurfaceTransform, Device, ClearFlags } from '../../gfx';
import { Mat4, Rect, Vec3, IVec4Like, geometry, Vec4 } from '../../core';
import { Node } from '../../scene-graph';
import { RenderScene } from '../core/render-scene';
import { RenderWindow } from '../core/render-window';
import { GeometryRenderer } from '../../rendering/geometry-renderer';
import { PostProcess } from '../../rendering/post-process/components/post-process';
import type { Frustum } from '../../core/geometry';
/**
 * @en The enumeration type for the fixed axis of the camera.
 * The field of view along the corresponding axis would be fixed regardless of screen aspect changes.
 * @zh 相机视角的锁定轴向枚举，在对应轴上不会跟随屏幕长宽比例变化。
 */
export declare enum CameraFOVAxis {
    /**
     * @en Vertically fixed camera
     * @zh 在垂直轴向上锁定的相机
     */
    VERTICAL = 0,
    /**
     * @en Horizontally fixed camera
     * @zh 在水平轴向上锁定的相机
     */
    HORIZONTAL = 1
}
/**
 * @en The projection type enumeration of the camera.
 * @zh 相机的投影类型枚举。
 */
export declare enum CameraProjection {
    /**
     * @en Orthogonal projection type
     * @zh 正交投影类型
     */
    ORTHO = 0,
    /**
     * @en Perspective projection type
     * @zh 透视投影类型
     */
    PERSPECTIVE = 1
}
/**
 * @en The aperture enumeration of the camera, represent in f-number.
 * The smaller the value is, the bigger the aperture is, and more light it can capture, but less depth it supports.
 * @zh 相机的快门枚举，使用 f 值来表示。f 值越小，光圈就越大，进光量也越大，景深越浅。
 */
export declare enum CameraAperture {
    /**
     * f/1.8
     */
    F1_8 = 0,
    /**
     * f/2.0
     */
    F2_0 = 1,
    /**
     * f/2.2
     */
    F2_2 = 2,
    /**
     * f/2.5
     */
    F2_5 = 3,
    /**
     * f/2.8
     */
    F2_8 = 4,
    /**
     * f/3.2
     */
    F3_2 = 5,
    /**
     * f/3.5
     */
    F3_5 = 6,
    /**
     * f/4.0
     */
    F4_0 = 7,
    /**
     * f/4.5
     */
    F4_5 = 8,
    /**
     * f/5.0
     */
    F5_0 = 9,
    /**
     * f/5.6
     */
    F5_6 = 10,
    /**
     * f/6.3
     */
    F6_3 = 11,
    /**
     * f/7.1
     */
    F7_1 = 12,
    /**
     * f/8
     */
    F8_0 = 13,
    /**
     * f/9
     */
    F9_0 = 14,
    /**
     * f/10
     */
    F10_0 = 15,
    /**
     * f/11
     */
    F11_0 = 16,
    /**
     * f/13
     */
    F13_0 = 17,
    /**
     * f/14
     */
    F14_0 = 18,
    /**
     * f/16
     */
    F16_0 = 19,
    /**
     * f/18
     */
    F18_0 = 20,
    /**
     * f/20
     */
    F20_0 = 21,
    /**
     * f/22
     */
    F22_0 = 22
}
/**
 * @en The ISO enumeration of the camera, lower ISO means the camera is less sensitive to light.
 * @zh 相机感光度枚举，越低的 ISO 数值表示相机对光更加不敏感。
 */
export declare enum CameraISO {
    ISO100 = 0,
    ISO200 = 1,
    ISO400 = 2,
    ISO800 = 3
}
/**
 * @en Camera shutter enumeration, the value represents the speed of the shutter.
 * @zh 相机快门枚举，枚举值表示快门速度。
 */
export declare enum CameraShutter {
    /**
     * 1 second
     */
    D1 = 0,
    /**
     * 1/2 second
     */
    D2 = 1,
    /**
     * 1/4 second
     */
    D4 = 2,
    /**
     * 1/8 second
     */
    D8 = 3,
    /**
     * 1/15 second
     */
    D15 = 4,
    /**
     * 1/30 second
     */
    D30 = 5,
    /**
     * 1/60 second
     */
    D60 = 6,
    /**
     * 1/125 second
     */
    D125 = 7,
    /**
     * 1/250 second
     */
    D250 = 8,
    /**
     * 1/500 second
     */
    D500 = 9,
    /**
     * 1/1000 second
     */
    D1000 = 10,
    /**
     * 1/2000 second
     */
    D2000 = 11,
    /**
     * 1/4000 second
     */
    D4000 = 12
}
/**
 * @en The type of the camera, mainly for marking different camera usage in XR, it determines the camera's viewport and parameters.
 * @zh 相机类型，主要服务于标记 XR 中的不同相机用途，影响渲染的视口和对应的参数。
 */
export declare enum CameraType {
    /**
     * @en Default camera type
     * @zh 默认相机类型
     */
    DEFAULT = -1,
    /**
     * @en If a camera is set to be left eye, it will be used to render the left eye screen,
     * otherwise, the left eye screen will be rendered using adjusted parameters based on XR main camera.
     * @zh 如果设置了左眼相机，则在绘制左眼屏幕时使用，否则，就根据 XR 主相机的参数来计算左眼参数。
     */
    LEFT_EYE = 0,
    /**
     * @en If a camera is set to be right eye, it will be used to render the right eye screen,
     * otherwise, the right eye screen will be rendered using adjusted parameters based on XR main camera.
     * @zh 如果设置了右眼相机，则在绘制右眼屏幕时使用，否则，就根据 XR 主相机的参数来计算左眼参数。
     */
    RIGHT_EYE = 1,
    /**
     * @en The main camera, it could be used to calculate the parameters for both left eye and the right eye cameras.
     * It could be converted from the default 3d camera.
     * @zh XR 主相机，可以通过默认相机转换，也可以手动创建新的 XR 相机，可以计算出左右两个相机的相对参数。
     */
    MAIN = 2
}
/**
 * @en The spatial tracking signal type used by the camera in XR.
 * @zh 相机使用的 XR 空间定位追踪信号类型。
 */
export declare enum TrackingType {
    /**
     * @en Camera without signal tracking in XR device.
     * @zh 无追踪相机，不对 XR 设备的信号进行追踪。
     */
    NO_TRACKING = 0,
    /**
     * @en Camera tracking position and rotation signals from XR device.
     * @zh 相机追踪 XR 设备移动位置和旋转角度信号。
     */
    POSITION_AND_ROTATION = 1,
    /**
     * @en Camera only tracking position signals from XR device.
     * @zh 相机只追踪 XR 设备位置信号。
     */
    POSITION = 2,
    /**
     * @en Camera only tracking rotation signals from XR device.
     * @zh 相机只追踪 XR 设备旋转角度信号。
     */
    ROTATION = 3
}
/**
 * @en The usage of the camera, it's an engine internal marker enumeration.
 * @zh 相机的用途枚举，这是引擎内部使用的标记枚举。
 */
export declare enum CameraUsage {
    /**
     * @en Camera used in editor
     * @zh 编辑器下使用的相机
     */
    EDITOR = 0,
    /**
     * @en Camera used in editor's game view.
     * @zh 编辑器 GameView 视图下使用的相机。
     */
    GAME_VIEW = 1,
    /**
     * @en Camera used in editor's scene view.
     * @zh 编辑器场景编辑器视图下使用的相机。
     */
    SCENE_VIEW = 2,
    /**
     * @en Camera used in editor's camera preview window.
     * @zh 编辑器预览小窗视图下使用的相机。
     */
    PREVIEW = 3,
    /**
     * @en Camera used in game, normally user created cameras are all GAME type.
     * @zh 游戏视图下使用的相机，一般情况下用户创建的相机都是 GAME 类型。
     */
    GAME = 100
}
/**
 * @en The camera creation information struct
 * @zh 用来创建相机的结构体
 */
export interface ICameraInfo {
    /**
     * @en The name of the camera.
     * @zh 相机命名。
     */
    name: string;
    /**
     * @en The node which the camera is attached to.
     * @zh 相机挂载的节点。
     */
    node: Node;
    /**
     * @en The projection type of the camera.
     * @zh 相机的投影类型。
     */
    projection: CameraProjection;
    /**
     * @en The id of the target display, if absent, it will be rendered on the default one.
     * @zh 相机的目标屏幕，如果缺省，将会使用默认屏幕。
     */
    targetDisplay?: number;
    /**
     * @en The target render window of the camera, is absent, the camera won't be rendered.
     * @zh 相机的目标渲染窗口，如果缺省，该相机不会执行渲染流程。
     */
    window?: RenderWindow | null;
    /**
     * @en Render priority of the camera. Cameras with higher depth are rendered after cameras with lower depth.
     * @zh 相机的渲染优先级，值越小越优先渲染。
     */
    priority: number;
    /**
     * @internal
     */
    pipeline?: string;
    /**
     * @en The type of the camera, mainly for marking different camera usage in XR, it determines the camera's viewport and parameters.
     * @zh 相机类型，主要服务于标记 XR 中的不同相机用途，影响渲染的视口和对应的参数。
     */
    cameraType?: CameraType;
    /**
     * @en The spatial tracking signal type used by the camera in XR.
     * @zh 相机使用的 XR 空间定位追踪信号类型。
     */
    trackingType?: TrackingType;
    /**
     * @internal
     */
    usage?: CameraUsage;
}
export declare enum SkyBoxFlagValue {
    VALUE = 8
}
export declare const SKYBOX_FLAG: SkyBoxFlagValue;
/**
 * @en The render camera representation in the render scene, it's managed by [[Camera]]
 * @zh 渲染场景中的相机对象，由项目层的 [[Camera]] 管理。
 */
export declare class Camera {
    /**
     * @en This exposure value corresponding to default standard camera exposure parameters.
     * @zh 默认相机的曝光值。
     */
    static get standardExposureValue(): number;
    /**
     * @en The luminance unit scale used by area lights.
     * @zh 默认局部光源使用的亮度单位缩放。
     */
    static get standardLightMeterScale(): number;
    /**
     * @en The name of the camera
     * @zh 相机的名称
     */
    get name(): string | null;
    /**
     * @en The render scene to which the camera is attached
     * @zh 相机所挂载的场景
     */
    get scene(): RenderScene | null;
    /**
     * @en The node of the camera which determines its transform in world space.
     * @zh 相机绑定的节点，决定了它在世界空间的变换矩阵
     */
    set node(val: Node);
    get node(): Node;
    /**
     * @en The unique ID of system window which the camera will render to.
     * @zh 相机关联的渲染窗口ID
     */
    get systemWindowId(): number;
    /**
     * @en The render window of the camera
     * @zh 相机关联的渲染窗口
     */
    set window(val: RenderWindow);
    get window(): RenderWindow;
    /**
     * @en Whether the camera is enabled, a disabled camera won't be processed in the render pipeline.
     * @zh 相机是否启用，未启用的相机不会被渲染
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en Visibility mask of the camera, declaring a set of node layers that will be visible to this camera.
     * @zh 相机的可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    set visibility(vis: number);
    get visibility(): number;
    /**
     * @en Render priority of the camera. Cameras with higher depth are rendered after cameras with lower depth.
     * @zh 相机的渲染优先级，值越小越优先渲染。
     */
    get priority(): number;
    set priority(val: number);
    /**
     * @en The width of the camera's view size
     * @zh 相机的视图宽度
     */
    get width(): number;
    /**
     * @en The height of the camera's view size
     * @zh 相机的视图高度
     */
    get height(): number;
    /**
     * @en The world position of the camera
     * @zh 相机的世界坐标
     */
    set position(val: Vec3);
    get position(): Vec3;
    /**
     * @en The forward vector of the camera's look direction
     * @zh 指向相机观察方向的向量
     */
    set forward(val: Vec3);
    get forward(): Vec3;
    /**
     * @en Camera aperture, controls the exposure parameter.
     * @zh 相机光圈，影响相机的曝光参数。
     */
    set aperture(val: CameraAperture);
    get aperture(): CameraAperture;
    /**
     * @en Camera aperture value.
     * @zh 相机光圈值。
     */
    get apertureValue(): number;
    /**
     * @en Camera shutter, controls the exposure parameter.
     * @zh 相机快门，影响相机的曝光参数。
     */
    set shutter(val: CameraShutter);
    get shutter(): CameraShutter;
    /**
     * @en Camera shutter value.
     * @zh 相机快门值。
     */
    get shutterValue(): number;
    /**
     * @en Camera ISO, controls the exposure parameter.
     * @zh 相机感光度，影响相机的曝光参数。
     */
    set iso(val: CameraISO);
    get iso(): CameraISO;
    /**
     * @en Camera ISO value.
     * @zh 相机感光度值。
     */
    get isoValue(): number;
    /**
     * @en The calculated exposure of the camera
     * @zh 相机的曝光参数
     */
    get exposure(): number;
    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    get clearFlag(): ClearFlags;
    set clearFlag(flag: ClearFlags);
    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    set clearColor(val: IVec4Like);
    get clearColor(): IVec4Like;
    /**
     * @en Clearing depth of the camera.
     * @zh 相机的深度缓冲默认值。
     */
    get clearDepth(): number;
    set clearDepth(depth: number);
    /**
     * @en Clearing stencil of the camera.
     * @zh 相机的模板缓冲默认值。
     */
    get clearStencil(): number;
    set clearStencil(stencil: number);
    /**
     * @en The projection type of the camera.
     * @zh 相机的投影类型。
     */
    set projectionType(val: CameraProjection);
    get projectionType(): CameraProjection;
    /**
     * @en The aspect ratio of the camera
     * @zh 相机视图的长宽比
     */
    get aspect(): number;
    /**
     * @en The viewport height of the orthogonal type camera.
     * @zh 正交相机的视角高度。
     */
    set orthoHeight(val: number);
    get orthoHeight(): number;
    /**
     * @en The axis on which the FOV would be fixed regardless of screen aspect changes.
     * @zh 指定视角的固定轴向，在此轴上不会跟随屏幕长宽比例变化。
     */
    set fovAxis(axis: CameraFOVAxis);
    get fovAxis(): CameraFOVAxis;
    /**
     * @en Field of view of the camera.
     * @zh 相机的视角大小。
     */
    set fov(fov: number);
    get fov(): number;
    /**
     * @en Near clipping distance of the camera, should be as large as possible within acceptable range.
     * @zh 相机的近裁剪距离，应在可接受范围内尽量取最大。
     */
    set nearClip(nearClip: number);
    get nearClip(): number;
    /**
     * @en Far clipping distance of the camera, should be as small as possible within acceptable range.
     * @zh 相机的远裁剪距离，应在可接受范围内尽量取最小。
     */
    set farClip(farClip: number);
    get farClip(): number;
    /**
     * @en The viewport rect of the camera, pre-rotated (i.e. always in identity/portrait mode) if possible.
     * @zh 相机的视口矩形，如果设备允许的话，这个视口会永远保持竖屏状态，由渲染流程保障旋转的正确。
     */
    get viewport(): Rect;
    set viewport(val: Rect);
    /**
     * @en The view frustum of the camera
     * @zh 相机的视锥体
     */
    set frustum(val: Frustum);
    get frustum(): Frustum;
    /**
     * @en The view matrix of the camera
     * @zh 相机的视图矩阵
     */
    get matView(): Mat4;
    /**
     * @en The projection matrix of the camera
     * @zh 相机的投影矩阵
     */
    get matProj(): Mat4;
    /**
     * @en The inverse of the projection matrix of the camera
     * @zh 相机的逆投影矩阵
     */
    get matProjInv(): Mat4;
    /**
     * @en The view projection matrix of the camera
     * @zh 相机的视图投影矩阵
     */
    get matViewProj(): Mat4;
    /**
     * @en The inverse of the view projection matrix of the camera
     * @zh 相机的逆视图投影矩阵
     */
    get matViewProjInv(): Mat4;
    /** @engineInternal */
    get cameraId(): number;
    /**
     * @en Whether the camera is fixed size or matching the window size.
     * @zh 相机是固定尺寸还是跟随屏幕尺寸
     */
    isWindowSize: boolean;
    /**
     * @en Scale of the internal buffer size,
     * set to 1 to keep the same with the canvas size.
     * @zh 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同。
     */
    screenScale: number;
    postProcess: PostProcess | null;
    usePostProcess: boolean;
    pipeline: string;
    pipelineSettings: object | null;
    private _device;
    private _scene;
    private _node;
    private _name;
    private _enabled;
    private _proj;
    private _aspect;
    private _orthoHeight;
    private _fovAxis;
    private _fov;
    private _nearClip;
    private _farClip;
    private _clearColor;
    private _viewport;
    private _orientedViewport;
    private _curTransform;
    private _isProjDirty;
    private _matView;
    private _matProj;
    private _matProjInv;
    private _matViewProj;
    private _matViewProjInv;
    private _frustum;
    private _forward;
    private _position;
    private _priority;
    private _aperture;
    private _apertureValue;
    private _shutter;
    private _shutterValue;
    private _iso;
    private _isoValue;
    private _window;
    private _width;
    private _height;
    private _clearFlag;
    private _clearDepth;
    private _visibility;
    private _exposure;
    private _clearStencil;
    private _geometryRenderer;
    private _windowId;
    private _cameraType;
    private _trackingType;
    private _usage;
    private _cameraId;
    constructor(device: Device);
    private _updateAspect;
    /**
     * @en Initialize the camera, normally you shouldn't invoke this function, it's managed automatically.
     * @zh 初始化相机，开发者通常不应该使用这个方法，初始化流程是自动管理的。
     */
    initialize(info: ICameraInfo): void;
    /**
     * @en Destroy the camera, you shouldn't invoke this function, it's managed by the render scene.
     * @zh 销毁相机，开发者不应该使用这个方法，销毁流程是由 RenderScene 管理的。
     */
    destroy(): void;
    /**
     * @en Attach the camera to the given render scene so that it will be rendered in it.
     * @zh 将相机添加到相关的渲染场景中，以便可以被渲染器渲染。
     * @param scene @en The render scene @zh 渲染场景
     */
    attachToScene(scene: RenderScene): void;
    /**
     * @en Detach the camera from previously attached render scene. It will no longer be rendered.
     * @zh 将相机从之前设置的渲染场景移除，之后将不会再被渲染。
     */
    detachFromScene(): void;
    /**
     * @en Resize the view size of the camera.
     * @zh 重置相机视图尺寸
     * @param width The width of the view size
     * @param height The height of the view size
     */
    resize(width: number, height: number): void;
    /**
     * @en Set a fixed size for the camera view.
     * @zh 设置固定相机视图尺寸
     * @param width The width of the view size
     * @param height The height of the view size
     */
    setFixedSize(width: number, height: number): void;
    /**
     * Editor specific gizmo camera logic
     * @internal
     */
    syncCameraEditor(camera: Camera): void;
    /**
     * @en Update the camera's builtin matrixes
     * @zh 更新相机的视图、投影等矩阵
     * @param forceUpdate If force update, then dirty flag will be ignored
     */
    update(forceUpdate?: boolean): void;
    get surfaceTransform(): SurfaceTransform;
    /**
     * @en Set the viewport in oriented space (equal to the actual screen rotation)
     * @zh 在目标朝向空间（实际屏幕朝向）内设置相机视口
     */
    setViewportInOrientedSpace(val: Rect): void;
    /**
     * @en create geometry renderer for this camera
     * @zh 创建这个摄像机的几何体渲染器
     */
    initGeometryRenderer(): void;
    /**
     * @en get geometry renderer of this camera
     * @zh 获取这个摄像机的几何体渲染器
     * @returns @en return the geometry renderer @zh 返回几何体渲染器
     */
    get geometryRenderer(): GeometryRenderer | null;
    get cameraType(): CameraType;
    set cameraType(type: CameraType);
    get trackingType(): TrackingType;
    set trackingType(type: TrackingType);
    get cameraUsage(): CameraUsage;
    set cameraUsage(usage: CameraUsage);
    /**
     * @en Change the target render window to another one
     * @zh 修改相机的目标渲染窗口
     * @param window The target render window, could be null
     */
    changeTargetWindow(window?: RenderWindow | null): void;
    /**
     * @en Detach camera from the render window
     * @zh 将 camera 从渲染窗口移除
     */
    detachCamera(): void;
    /**
     * @en Transform a screen position (in oriented space) to a world space ray
     * @zh 将一个屏幕空间（在实际朝向下）点转换到世界空间的射线
     * @param out the resulting ray
     * @param x the screen x of the position
     * @param y the screen y of the position
     * @returns the resulting ray
     */
    screenPointToRay(out: geometry.Ray, x: number, y: number): geometry.Ray;
    /**
     * @en Transform a screen position (in oriented space) to world space
     * @zh 将一个屏幕空间（在实际朝向下）位置转换到世界空间
     * @param out the resulting vector
     * @param screenPos the screen position to be transformed
     * @returns the resulting vector
     */
    screenToWorld(out: Vec3, screenPos: Vec3): Vec3;
    /**
     * @en Transform a world space position to screen space rendered by the camera
     * @zh 将一个世界空间位置转换到相机渲染后的屏幕空间
     * @param out the resulting vector
     * @param worldPos the world position to be transformed
     * @returns the resulting vector
     */
    worldToScreen(out: Vec3, worldPos: Vec3 | Readonly<Vec3>): Vec3;
    /**
     * @en Transform a world space matrix to screen space rendered by the camera
     * @zh 将一个世界空间矩阵转换到相机渲染后的屏幕空间
     * @param out the resulting matrix
     * @param worldMatrix the world space matrix to be transformed
     * @param width framebuffer width
     * @param height framebuffer height
     * @returns the resulting matrix
     */
    worldMatrixToScreen(out: Mat4, worldMatrix: Mat4, width: number, height: number): Mat4;
    /**
     * @en Calculate and set oblique view frustum projection matrix.
     * @zh 计算并设置斜视锥体投影矩阵
     * @param clipPlane clip plane in camera space
     */
    calculateObliqueMat(viewSpacePlane: Vec4): void;
    getClipSpaceMinz(): number;
    /**
     * @en Set exposure with actual value.
     * @zh 设置相机的曝光值
     * @param ev100
     */
    protected setExposure(ev100: any): void;
    private updateExposure;
    private setDefaultUsage;
}
