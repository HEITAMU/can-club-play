import { Component } from '../scene-graph/component';
import { EventHandler } from '../scene-graph/component-event-handler';
import { Node } from '../scene-graph/node';
import { Camera } from '../misc/camera-component';
import { Vec3 } from '../core/math';
/**
 * @en The component that converts 3D node coordinates to UI node coordinates.
 * It mainly provides the converted world coordinates after mapping and the perspective ratio of the simulated perspective camera.
 * @zh 3D 节点坐标转换到 UI 节点坐标组件
 * 主要提供映射后的转换世界坐标以及模拟透视相机远近比。
 */
export declare class UICoordinateTracker extends Component {
    /**
     * @en
     * Target node.
     *
     * @zh
     * 目标对象。
     */
    get target(): Node | null;
    set target(value: Node | null);
    /**
     * @en
     * The 3D camera representing the original coordinate system.
     *
     * @zh
     * 照射相机。
     */
    get camera(): Camera | null;
    set camera(value: Camera | null);
    /**
     * @en
     * Whether to scale the converted 2d node's size according to the distance between the camera and the 3d node.
     *
     * @zh
     * 是否是缩放映射。
     */
    get useScale(): boolean;
    set useScale(value: boolean);
    /**
     * @en
     * The distance from the camera for displaying the 2d node in normal size.
     *
     * @zh
     * 距相机多少距离为正常显示计算大小。
     */
    get distance(): number;
    set distance(value: number);
    /**
     * @en
     * Event callback after coordinates synchronization.
     * The first parameter of the callback is the mapped local coordinate in UI camera.
     * The second parameter is the distance scale of the 3d node from the 3d camera viewport.
     *
     * @zh
     * 映射数据事件。回调的第一个参数是映射后的本地坐标，第二个是距相机距离比。
     */
    syncEvents: EventHandler[];
    protected _target: Node | null;
    protected _camera: Camera | null;
    protected _useScale: boolean;
    protected _distance: number;
    protected _transformPos: Vec3;
    protected _viewPos: Vec3;
    protected _canMove: boolean;
    protected _lastWPos: Vec3;
    protected _lastCameraPos: Vec3;
    constructor();
    onEnable(): void;
    update(): void;
    protected _checkCanMove(): void;
}
