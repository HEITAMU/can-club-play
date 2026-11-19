/// <reference types="./@types/globals" />
import { RenderTexture } from '../asset/assets/render-texture';
import { Component } from '../scene-graph';
import { Color, Rect, Vec3, geometry } from '../core';
import { scene } from '../render-scene';
import { CameraProjection, CameraFOVAxis, CameraAperture, CameraISO, CameraShutter, CameraType, TrackingType } from '../render-scene/scene/camera';
import { Node } from '../scene-graph/node';
import { ClearFlagBit } from '../gfx';
import { PostProcess } from '../rendering/post-process/components/post-process';
import type { Ray } from '../core/geometry';
declare const ProjectionType: typeof scene.CameraProjection;
declare const FOVAxis: typeof scene.CameraFOVAxis;
declare const Aperture: typeof scene.CameraAperture;
declare const Shutter: typeof scene.CameraShutter;
declare const ISO: typeof scene.CameraISO;
/**
 * @en Clear screen flag enumeration of the camera.
 * @zh 相机的清屏标记枚举。
 */
export declare const ClearFlag: {
    /**
     * @en Clear the screen with [[SceneGlobals.skybox]], will clear the depth and stencil buffer at the same time.
     * @zh 使用指定天空盒 [[SceneGlobals.skybox]] 清屏，会同时清理深度和蒙版缓冲。
     */
    SKYBOX: number;
    /**
     * @en Clear the screen with the given [[Camera.clearColor]], will clear the depth and stencil buffer at the same time.
     * @zh 使用指定的相机清屏颜色 [[Camera.clearColor]] 来清屏，会同时清理将深度和蒙版缓冲。
     */
    SOLID_COLOR: ClearFlagBit;
    /**
     * @en Only clear the depth and stencil buffer while keeping the color buffer intact. Often used in UI camera.
     * @zh 只清理深度和蒙版缓冲，同时保留颜色缓冲不变。常用于 UI 相机。
     */
    DEPTH_ONLY: ClearFlagBit;
    /**
     * @en Don't clear anything and continue rendering.
     * @zh 不清理任何内容就开始渲染，适合多 Camera 叠加渲染。
     */
    DONT_CLEAR: ClearFlagBit;
};
/**
 * @internal
 */
export declare namespace Camera {
    type ProjectionType = EnumAlias<typeof ProjectionType>;
    type FOVAxis = EnumAlias<typeof FOVAxis>;
    type ClearFlag = EnumAlias<typeof ClearFlag>;
    type Aperture = EnumAlias<typeof Aperture>;
    type Shutter = EnumAlias<typeof Shutter>;
    type ISO = EnumAlias<typeof ISO>;
}
export declare enum CameraEvent {
    TARGET_TEXTURE_CHANGE = "tex-change"
}
/**
 * @en The Camera Component.
 * @zh 相机组件。
 */
export declare class Camera extends Component {
    /**
     * @en The projection type enumeration of the camera.
     * @zh 相机的投影类型枚举。
     */
    static ProjectionType: typeof scene.CameraProjection;
    /**
     * @en The axis type of the fov
     * @zh FOV 的轴向枚举
     */
    static FOVAxis: typeof scene.CameraFOVAxis;
    /**
     * @en The clear flag enumeration of the camera.
     * @zh 相机的清除标志位枚举。
     */
    static ClearFlag: {
        /**
         * @en Clear the screen with [[SceneGlobals.skybox]], will clear the depth and stencil buffer at the same time.
         * @zh 使用指定天空盒 [[SceneGlobals.skybox]] 清屏，会同时清理深度和蒙版缓冲。
         */
        SKYBOX: number;
        /**
         * @en Clear the screen with the given [[Camera.clearColor]], will clear the depth and stencil buffer at the same time.
         * @zh 使用指定的相机清屏颜色 [[Camera.clearColor]] 来清屏，会同时清理将深度和蒙版缓冲。
         */
        SOLID_COLOR: ClearFlagBit;
        /**
         * @en Only clear the depth and stencil buffer while keeping the color buffer intact. Often used in UI camera.
         * @zh 只清理深度和蒙版缓冲，同时保留颜色缓冲不变。常用于 UI 相机。
         */
        DEPTH_ONLY: ClearFlagBit;
        /**
         * @en Don't clear anything and continue rendering.
         * @zh 不清理任何内容就开始渲染，适合多 Camera 叠加渲染。
         */
        DONT_CLEAR: ClearFlagBit;
    };
    /**
     * @en The aperture value's enumeration of the camera.
     * @zh 相机的光圈值枚举。
     */
    static Aperture: typeof scene.CameraAperture;
    /**
     * @en The shutter value's enumeration of the camera.
     * @zh 相机的快门值枚举。
     */
    static Shutter: typeof scene.CameraShutter;
    /**
     * @en The ISO value's enumeration of the camera.
     * @zh 相机的感光度值枚举。
     */
    static ISO: typeof scene.CameraISO;
    /**
     * @en The event for target texture changing.
     * @zh 目标贴图修改的事件。
     */
    static TARGET_TEXTURE_CHANGE: CameraEvent;
    protected _projection: scene.CameraProjection;
    protected _priority: number;
    protected _fov: number;
    protected _fovAxis: scene.CameraFOVAxis;
    protected _orthoHeight: number;
    protected _near: number;
    protected _far: number;
    protected _color: Color;
    protected _depth: number;
    protected _stencil: number;
    protected _clearFlags: ClearFlagBit;
    protected _rect: Rect;
    protected _aperture: scene.CameraAperture;
    protected _shutter: scene.CameraShutter;
    protected _iso: scene.CameraISO;
    protected _screenScale: number;
    protected _visibility: number;
    protected _targetTexture: RenderTexture | null;
    protected _postProcess: PostProcess | null;
    protected _usePostProcess: boolean;
    protected _camera: scene.Camera | null;
    protected _inEditorMode: boolean;
    protected _flows: string[] | undefined;
    protected _cameraType: CameraType;
    protected _trackingType: TrackingType;
    constructor();
    /**
     * @en The render camera representation.
     * @zh 渲染场景中的相机对象。
     */
    get camera(): scene.Camera;
    /**
     * @en Render priority of the camera. Cameras with higher depth are rendered after cameras with lower depth.
     * @zh 相机的渲染优先级，值越小越优先渲染。
     */
    get priority(): number;
    set priority(val: number);
    /**
     * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
     * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    get visibility(): number;
    set visibility(val: number);
    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    get clearFlags(): ClearFlagBit;
    set clearFlags(val: ClearFlagBit);
    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    get clearColor(): Readonly<Color>;
    set clearColor(val: Readonly<Color>);
    /**
     * @en Clearing depth of the camera.
     * @zh 相机的深度缓冲默认值。
     */
    get clearDepth(): number;
    set clearDepth(val: number);
    /**
     * @en Clearing stencil of the camera.
     * @zh 相机的模板缓冲默认值。
     */
    get clearStencil(): number;
    set clearStencil(val: number);
    /**
     * @en Projection type of the camera.
     * @zh 相机的投影类型。
     */
    get projection(): CameraProjection;
    set projection(val: CameraProjection);
    /**
     * @en The axis on which the FOV would be fixed regardless of screen aspect changes.
     * @zh 指定视角的固定轴向，在此轴上不会跟随屏幕长宽比例变化。
     */
    get fovAxis(): CameraFOVAxis;
    set fovAxis(val: CameraFOVAxis);
    /**
     * @en Field of view of the camera.
     * @zh 相机的视角大小。
     */
    get fov(): number;
    set fov(val: number);
    /**
     * @en Viewport height in orthographic mode.
     * @zh 正交模式下的相机视角高度。
     */
    get orthoHeight(): number;
    set orthoHeight(val: number);
    /**
     * @en Near clipping distance of the camera, should be as large as possible within acceptable range.
     * @zh 相机的近裁剪距离，应在可接受范围内尽量取最大。
     */
    get near(): number;
    set near(val: number);
    /**
     * @en Far clipping distance of the camera, should be as small as possible within acceptable range.
     * @zh 相机的远裁剪距离，应在可接受范围内尽量取最小。
     */
    get far(): number;
    set far(val: number);
    /**
     * @en Camera aperture, controls the exposure parameter.
     * @zh 相机光圈，影响相机的曝光参数。
     */
    get aperture(): CameraAperture;
    set aperture(val: CameraAperture);
    /**
     * @en Camera shutter, controls the exposure parameter.
     * @zh 相机快门，影响相机的曝光参数。
     */
    get shutter(): CameraShutter;
    set shutter(val: CameraShutter);
    /**
     * @en Camera ISO, controls the exposure parameter.
     * @zh 相机感光度，影响相机的曝光参数。
     */
    get iso(): CameraISO;
    set iso(val: CameraISO);
    /**
     * @en Screen viewport of the camera wrt. the sceen size.
     * @zh 此相机最终渲染到屏幕上的视口位置和大小。
     */
    get rect(): Rect;
    set rect(val: Rect);
    /**
     * @en Output render texture of the camera. Default to null, which outputs directly to screen.
     * @zh 指定此相机的渲染输出目标贴图，默认为空，直接渲染到屏幕。
     */
    get targetTexture(): RenderTexture | null;
    set targetTexture(value: RenderTexture | null);
    get usePostProcess(): boolean;
    set usePostProcess(v: boolean);
    get postProcess(): PostProcess | null;
    set postProcess(v: PostProcess | null);
    /**
     * @en Scale of the internal buffer size,
     * set to 1 to keep the same with the canvas size.
     * @zh 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同。
     */
    get screenScale(): number;
    set screenScale(val: number);
    /**
     * @internal
     */
    get inEditorMode(): boolean;
    set inEditorMode(value: boolean);
    /**
     * @internal
     */
    get cameraType(): CameraType;
    set cameraType(val: CameraType);
    /**
     * @internal
     */
    get trackingType(): TrackingType;
    set trackingType(val: TrackingType);
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en Convert a screen space (left-bottom origin) point to a ray.
     * @zh 将一个屏幕空间（左下角为原点）坐标转换为射线。
     * @param x The x axis position on screen.
     * @param y The y axis position on screen.
     * @param out The output ray object.
     * @returns Return the output ray object.
     */
    screenPointToRay(x: number, y: number, out?: geometry.Ray): Ray;
    /**
     * @en Convert a world position to a screen space (left-bottom origin) position.
     * @zh 将一个世界空间坐标转换为屏幕空间（左下角为原点）坐标。
     * @param worldPos The position in world space coordinates
     * @param out The output position in screen space coordinates.
     * @returns Return the output position object.
     */
    worldToScreen(worldPos: Vec3 | Readonly<Vec3>, out?: Vec3): Vec3;
    /**
     * @en Convert a screen space (left-bottom origin) position to a world space position.
     * @zh 将一个屏幕空间（左下角为原点）转换为世界空间坐标。
     * @param screenPos The position in screen space coordinates
     * @param out The output position in world space coordinates
     * @returns Return the output position object.
     */
    screenToWorld(screenPos: Vec3, out?: Vec3): Vec3;
    /**
     * @en Convert a 3D world position to the local coordinates system of the given UI node.
     * The converted position will be related to the given UI node under local space.
     * @zh 将一个 3D 空间世界坐标转换到指定的 UI 本地节点坐标系下。转换后的位置是指定 UI 节点坐标系下的局部偏移。
     * @param wpos @en The world position to convert @zh 需要转换的世界坐标
     * @param uiNode @en The UI node coordinates in which the world position will be convert to @zh 用于同步位置的 UI 节点
     * @param out @en Return the corresponding position of the given world position in the UI node's local coordinates @zh 返回传入的世界坐标在 UI 节点本地坐标系下的局部坐标
     *
     * @example
     * ```ts
     * this.convertToUINode(target.worldPosition, uiNode.parent, out);
     * uiNode.position = out;
     * ```
     */
    convertToUINode(wpos: Vec3 | Readonly<Vec3>, uiNode: Node, out?: Vec3): Vec3;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _createCamera(): void;
    protected _attachToScene(): void;
    protected _detachFromScene(): void;
    protected _checkTargetTextureEvent(old: RenderTexture | null): void;
    protected _updateTargetTexture(): void;
}
export {};
