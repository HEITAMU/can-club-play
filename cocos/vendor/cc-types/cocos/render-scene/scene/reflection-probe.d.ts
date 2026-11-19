import { Camera } from './camera';
import { Node } from '../../scene-graph/node';
import { Color, Vec2, Vec3, geometry } from '../../core';
import { Framebuffer } from '../../gfx';
import { TextureCube } from '../../asset/assets/texture-cube';
import { RenderTexture } from '../../asset/assets/render-texture';
export declare enum ProbeClearFlag {
    SKYBOX = 14,
    SOLID_COLOR = 7
}
export declare enum ProbeType {
    CUBE = 0,
    PLANAR = 1
}
export declare class ReflectionProbe {
    bakedCubeTextures: RenderTexture[];
    realtimePlanarTexture: RenderTexture | null;
    protected _resolution: number;
    protected _clearFlag: number;
    protected _backgroundColor: Color;
    protected _visibility: number;
    protected _probeType: ProbeType;
    protected _cubemap: TextureCube | null;
    protected readonly _size: Vec3;
    /**
     * @en Render cubemap's camera
     * @zh 渲染cubemap的相机
     */
    private _camera;
    /**
     * @en Unique id of probe.
     * @zh probe的唯一id
     */
    private _probeId;
    private _needRefresh;
    private _needRender;
    private _node;
    private _cameraNode;
    /**
     * @en The AABB bounding box and probe only render the objects inside the bounding box.
     * @zh AABB包围盒，probe只渲染包围盒内的物体
     */
    private _boundingBox;
    /**
     * @en The position of the camera in world space.
     * @zh 世界空间相机的位置
     */
    private _cameraWorldPos;
    /**
     * @en The rotation of the camera in world space.
     * @zh 世界空间相机的旋转
     */
    private _cameraWorldRotation;
    /**
     * @en The forward direction vertor of the camera in world space.
     * @zh 世界空间相机朝前的方向向量
     */
    private _forward;
    /**
     * @en The up direction vertor of the camera in world space.
     * @zh 世界空间相机朝上的方向向量
     */
    private _up;
    /**
     * @en Reflection probe cube pattern preview sphere
     * @zh 反射探针cube模式的预览小球
     */
    protected _previewSphere: Node | null;
    protected _previewPlane: Node | null;
    /**
     * @en Set probe type,cube or planar.
     * @zh 设置探针类型，cube或者planar
     */
    set probeType(value: ProbeType);
    get probeType(): ProbeType;
    get resolution(): number;
    /**
     * @en set render texture size
     * @zh 设置渲染纹理大小
     */
    set resolution(value: number);
    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    set clearFlag(value: number);
    get clearFlag(): number;
    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    set backgroundColor(val: Color);
    get backgroundColor(): Color;
    /**
     * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
     * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    get visibility(): number;
    set visibility(val: number);
    /**
     * @en Gets or sets the size of the box, in local space.
     * @zh 获取或设置盒的大小。
     */
    set size(value: Vec3);
    get size(): Vec3;
    set cubemap(val: TextureCube | null);
    get cubemap(): TextureCube | null;
    /**
     * @en The node of the probe.
     * @zh probe绑定的节点
     */
    get node(): Node;
    get camera(): Camera;
    /**
     * @en Refresh the objects that use this probe.
     * @zh 刷新使用该probe的物体
     */
    set needRefresh(value: boolean);
    get needRefresh(): boolean;
    set needRender(value: boolean);
    get needRender(): boolean;
    get boundingBox(): geometry.AABB | null;
    set cameraNode(node: Node);
    get cameraNode(): Node;
    /**
     * @en Reflection probe cube mode preview sphere
     * @zh 反射探针cube模式的预览小球
     * @engineInternal
     */
    set previewSphere(val: Node | null);
    get previewSphere(): Node | null;
    /**
     * @en Reflection probe planar mode preview plane
     * @zh 反射探针Planar模式的预览平面
     */
    set previewPlane(val: Node);
    get previewPlane(): Node;
    constructor(id: number);
    initialize(node: Node, cameraNode: Node): void;
    initBakedTextures(): void;
    captureCubemap(): void;
    /**
     * @en Render real-time planar reflection textures
     * @zh 渲染实时平面反射贴图
     * @param sourceCamera render planar reflection for this camera
     */
    renderPlanarReflection(sourceCamera: Camera): void;
    switchProbeType(type: ProbeType, sourceCamera: Camera | null): void;
    getProbeId(): number;
    updateProbeId(id: any): void;
    renderArea(): Vec2;
    isFinishedRendering(): boolean;
    validate(): boolean;
    destroy(): void;
    enable(): void;
    disable(): void;
    updateCameraDir(faceIdx: number): void;
    updateBoundingBox(): void;
    hasFrameBuffer(framebuffer: Framebuffer): boolean;
    isRGBE(): boolean;
    private _syncCameraParams;
    private _createCamera;
    private _resetCameraParams;
    private _createTargetTexture;
    private _transformReflectionCamera;
    private _reflect;
}
