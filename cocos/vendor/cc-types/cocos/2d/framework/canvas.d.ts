import { Camera } from '../../misc/camera-component';
import { RenderRoot2D } from './render-root-2d';
/**
 * @en
 * The root node of UI.
 * Provide an aligned window for all child nodes, also provides ease of setting screen adaptation policy interfaces from the editor.
 * Line-of-sight range is -999 to 1000.
 *
 * @zh
 * 作为 UI 根节点，为所有子节点提供对齐视窗，另外提供屏幕适配策略接口，方便从编辑器设置。
 * 注：由于本节点的尺寸会跟随屏幕拉伸，所以 anchorPoint 只支持 (0.5, 0.5)，否则适配不同屏幕时坐标会有偏差。
 * UI 的视距范围是 -999 ～ 1000.
 */
export declare class Canvas extends RenderRoot2D {
    /**
     * @en
     * The render mode of Canvas.
     * When you choose the mode of INTERSPERSE, You can specify the rendering order of the Canvas with the camera in the scene.
     * When you choose the mode of OVERLAY, the builtin camera of Canvas will render after all scene cameras are rendered.
     * NOTE: The cameras in the scene (including the Canvas built-in camera) must have a ClearFlag selection of SOLID_COLOR,
     * otherwise a splash screen may appear on the mobile device.
     *
     * @zh
     * Canvas 渲染模式。
     * intersperse 下可以指定 Canvas 与场景中的相机的渲染顺序，overlay 下 Canvas 会在所有场景相机渲染完成后渲染。
     * 注意：场景里的相机（包括 Canvas 内置的相机）必须有一个的 ClearFlag 选择 SOLID_COLOR，否则在移动端可能会出现闪屏。
     *
     * @deprecated since v3.0, please use [[Camera.priority]] to control overlapping between cameras.
     */
    get renderMode(): number;
    set renderMode(val: number);
    /**
     * @en The camera component that will be aligned with this canvas
     * @zh 将与此 canvas 对齐的相机组件
     */
    get cameraComponent(): Camera | null;
    set cameraComponent(value: Camera | null);
    /**
     * @en Align canvas with screen
     * @zh 是否使用屏幕对齐画布
     */
    get alignCanvasWithScreen(): boolean;
    set alignCanvasWithScreen(value: boolean);
    protected _cameraComponent: Camera | null;
    protected _alignCanvasWithScreen: boolean;
    protected _thisOnCameraResized: () => void;
    protected fitDesignResolution_EDITOR: (() => void) | undefined;
    private _pos;
    private _renderMode;
    constructor();
    __preload(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    protected _onResizeCamera(): void;
    private _getViewPriority;
}
