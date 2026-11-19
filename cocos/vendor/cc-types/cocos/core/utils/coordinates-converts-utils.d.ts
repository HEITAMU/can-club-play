import { Camera } from '../../misc/camera-component';
import { Vec3 } from '../math';
import { Node } from '../../scene-graph';
/**
 * @en
 * Conversion of non-UI nodes to UI Node (Local) Space coordinate system.
 * @zh
 * 非 UI 节点转换到 UI 节点(局部) 空间坐标系。
 * @deprecated since Cocos Creator 3D v1.2, please use [[Camera.convertToUINode]]
 * @param mainCamera @en The main camera @zh 主相机
 * @param wpos @en The world space location. @zh 世界空间位置。
 * @param uiNode @en The UI node. @zh UI 节点。
 * @param out @en The output local position in UI @zh 返回 UI 节点局部坐标。
 */
export declare function WorldNode3DToLocalNodeUI(mainCamera: Camera, wpos: Vec3, uiNode: Node, out?: Vec3): Vec3;
/**
 * @en
 * Conversion of non-UI nodes to UI Node (World) Space coordinate system.
 * @zh
 * 非 UI 节点转换到 UI 节点(世界)空间坐标系。
 * @deprecated since Cocos Creator 3D v1.2, please use [[Camera.convertToUINode]]
 * @param mainCamera @en The main camera @zh 主相机
 * @param wpos @en The world space location. @zh 世界空间位置。
 * @param out @en The output world position in UI @zh 返回 UI 空间世界坐标。
 */
export declare function WorldNode3DToWorldNodeUI(mainCamera: Camera, wpos: Vec3, out?: Vec3): Vec3;
/**
 * @en It will be removed in v1.2. Please use [[Camera.convertToUINode]]。
 * @zh 将在 v1.2 移除，请使用 Camera 的 `convertToUINode`。
 * @deprecated since Cocos Creator 3D v1.2
 */
declare const convertUtils: {
    WorldNode3DToLocalNodeUI: typeof WorldNode3DToLocalNodeUI;
    WorldNode3DToWorldNodeUI: typeof WorldNode3DToWorldNodeUI;
};
export { convertUtils };
