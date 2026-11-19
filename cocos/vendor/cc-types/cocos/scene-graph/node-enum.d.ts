/**
 * @en Node's coordinate space
 * @zh 节点的坐标空间
 */
export declare enum NodeSpace {
    LOCAL = 0,
    WORLD = 1
}
/**
 * @en Bit masks for node's transformation
 * @zh 节点的空间变换位标记
 */
export declare enum TransformBit {
    /**
     * @en No change
     * @zh 无改变
     */
    NONE = 0,
    /**
     * @en Translation changed
     * @zh 节点位置改变
     */
    POSITION = 1,
    /**
     * @en Rotation changed
     * @zh 节点旋转
     */
    ROTATION = 2,
    /**
     * @en Scale changed
     * @zh 节点缩放
     */
    SCALE = 4,
    /**
     * @en Skew changed
     * @zh 节点斜切
     */
    SKEW = 8,
    /**
     * @en Rotation or scale changed
     * @zh 节点旋转及缩放
     */
    RS = 6,
    /**
     * @en Rotation, scale or skew changed
     */
    RSS = 14,
    /**
     * @en Translation, rotation or scale changed
     * @zh 节点平移，旋转及缩放
     */
    TRS = 7,
    /**
     * @en Invert mask of [[TRS]]
     * @zh [[TRS]] 的反向掩码
     */
    TRS_MASK = -8
}
/**
 * @en Node's mobility
 * @zh 节点的移动性
 */
export declare const MobilityMode: {
    /**
     * @en Static node
     * @zh 静态节点
     */
    Static: number;
    /**
     * @en Stationary node
     * @zh 固定节点
     */
    Stationary: number;
    /**
     * @en Movable node
     * @zh 可移动节点
     */
    Movable: number;
};
