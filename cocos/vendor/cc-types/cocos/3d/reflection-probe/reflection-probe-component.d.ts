import { Color, Vec3 } from '../../core';
import { TextureCube } from '../../asset/assets';
import { scene } from '../../render-scene';
import { Component } from '../../scene-graph/component';
import { Camera } from '../../misc/camera-component';
import { Node } from '../../scene-graph';
import { ProbeType } from '../../render-scene/scene/reflection-probe';
export declare enum ProbeResolution {
    /**
     * @zh 分辨率 256 * 256。
     * @en renderTexture resolution 256 * 256.
     * @readonly
     */
    Low_256x256 = 256,
    /**
      * @zh 分辨率 512 * 512。
      * @en renderTexture resolution 512 * 512.
      * @readonly
      */
    Medium_512x512 = 512,
    /**
      * @zh 分辨率 768 * 768
      * @en renderTexture resolution 768 * 768.
      * @readonly
      */
    High_768x768 = 768
}
export declare class ReflectionProbe extends Component {
    protected static readonly DEFAULT_CUBE_SIZE: Readonly<Vec3>;
    protected static readonly DEFAULT_PLANER_SIZE: Readonly<Vec3>;
    protected readonly _lastSize: Vec3;
    protected _resolution: number;
    protected _clearFlag: scene.ProbeClearFlag;
    protected _backgroundColor: Color;
    protected _visibility: number;
    protected _probeType: scene.ProbeType;
    protected _cubemap: TextureCube | null;
    protected readonly _size: Vec3;
    protected _sourceCamera: Camera | null;
    private _probeId;
    private _fastBake;
    protected _probe: scene.ReflectionProbe | null;
    protected _previewSphere: Node | null;
    protected _previewPlane: Node | null;
    private _sourceCameraPos;
    private _position;
    /**
     * @en
     * Gets or sets the size of the box
     * @zh
     * 获取或设置包围盒的大小。
     */
    set size(value: Vec3);
    get size(): Vec3;
    /**
     * @en Environment reflection or plane reflection.
     * @zh 设置探针类型，环境反射或者平面反射
     */
    set probeType(value: ProbeType);
    get probeType(): ProbeType;
    /**
     * @en set render texture size
     * @zh 设置渲染纹理大小
     */
    set resolution(value: number);
    get resolution(): number;
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
     * @en The camera to render planar reflections, specified by the user
     * @zh 需要渲染平面反射的相机，由用户指定
     */
    set sourceCamera(camera: Camera);
    get sourceCamera(): Camera;
    /**
     * @en fast bake no convolution.
     * @zh 快速烘焙不会进行卷积。
     */
    get fastBake(): boolean;
    set fastBake(val: boolean);
    set cubemap(val: TextureCube | null);
    get cubemap(): TextureCube | null;
    get probe(): scene.ReflectionProbe;
    /**
     * @en Reflection probe cube mode preview sphere
     * @zh 反射探针cube模式的预览小球
     */
    set previewSphere(val: Node | null);
    get previewSphere(): Node | null;
    /**
     * @en Reflection probe planar mode preview plane
     * @zh 反射探针Planar模式的预览平面
     */
    set previewPlane(val: Node);
    get previewPlane(): Node;
    onLoad(): void;
    private _handleResize$;
    onEnable(): void;
    onDisable(): void;
    start(): void;
    onDestroy(): void;
    update(dt: number): void;
    /**
     * @en Clear the baked cubemap.
     * @zh 清除烘焙的cubemap
     */
    clearBakedCubemap(): void;
    private _createProbe;
}
