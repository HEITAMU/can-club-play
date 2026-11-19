/// <reference types="./@types/globals" />
export interface LayerItem {
    name: string;
    bit: number;
}
/**
 * @zh 节点层管理器，层数据是以掩码数据方式存储在 [[Node.layer]] 中，用于射线检测、物理碰撞和用户自定义脚本逻辑。
 * 每个节点可属于一个或多个层，可通过 “包含式” 或 “排除式” 两种检测器进行层检测。
 * @en Node's layer manager, it's stored as bit mask data in [[Node.layer]].
 * Layer information is widely used in raycast, physics and user logic.
 * Every node can be assigned to multiple layers with different bit masks, you can setup layer with inclusive or exclusive operation.
 */
export declare class Layers {
    private constructor();
    /**
     * @en All layers in an Enum
     * @zh 以 Enum 形式存在的所有层列表
     */
    static Enum: {
        NONE: number;
        IGNORE_RAYCAST: number;
        GIZMOS: number;
        EDITOR: number;
        UI_3D: number;
        SCENE_GIZMO: number;
        UI_2D: number;
        PROFILER: number;
        DEFAULT: number;
        ALL: number;
    };
    /**
     * @en All layers in [[BitMask]] type
     * @zh 包含所有层的 [[BitMask]]
     */
    static BitMask: {
        NONE: number;
        IGNORE_RAYCAST: number;
        GIZMOS: number;
        EDITOR: number;
        UI_3D: number;
        SCENE_GIZMO: number;
        UI_2D: number;
        PROFILER: number;
        DEFAULT: number;
        ALL: number;
    };
    /**
     * @internal
     */
    static init(): void;
    /**
     * @en
     * Make a layer mask accepting nothing but the listed layers
     * @zh
     * 创建一个包含式层检测器，只接受列表中的层
     * @param includes All accepted layers
     * @return A filter which can detect all accepted layers
     */
    static makeMaskInclude(includes: number[]): number;
    /**
     * @en
     * Make a layer mask accepting everything but the listed layers
     * @zh
     * 创建一个排除式层检测器，只拒绝列表中的层
     * @param excludes All excluded layers
     * @return A filter which can detect for excluded layers
     */
    static makeMaskExclude(excludes: number[]): number;
    /**
     * @zh 添加一个新层，用户可编辑 0 - 19 位为用户自定义层
     * @en Add a new layer, user can use layers from bit position 0 to 19, other bits are reserved.
     * @param name Layer's name
     * @param bitNum Layer's bit position
     */
    static addLayer(name: string, bitNum: number): void;
    /**
     * @en Remove a layer, user can remove layers from bit position 0 to 19, other bits are reserved.
     * @zh 移除一个层，用户可编辑 0 - 19 位为用户自定义层
     * @param bitNum Layer's bit position
     */
    static deleteLayer(bitNum: number): void;
    /**
     * @en Given a layer name, returns the layer index as defined by either a Builtin or a User Layer in the Tags and Layers manager.
     * @zh 给定层名称，返回由标记和层管理器中的内置层或用户层定义的层索引。
     * @param name layer's name
     */
    static nameToLayer(name: string): number;
    /**
     * @en Given a layer number, returns the name of the layer as defined in either a Builtin or a User Layer in the Tags and Layers manager.
     * @zh 给定层数，返回在标记和层管理器中的内置层或用户层中定义的层名称。
     * @param bitNum layer's value
     */
    static layerToName(bitNum: number): string;
}
export declare namespace Layers {
    type Enum = EnumAlias<typeof Layers.Enum>;
    type BitMask = EnumAlias<typeof Layers.BitMask>;
}
