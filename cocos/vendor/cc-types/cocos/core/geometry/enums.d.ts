/**
 * 几何工具模块
 * @module geometry
 */
/**
 * @en
 * The enum type of basic geometry.
 * @zh
 * 形状的类型值。
 */
export declare enum ShapeType {
    SHAPE_RAY = 1,
    SHAPE_LINE = 2,
    SHAPE_SPHERE = 4,
    SHAPE_AABB = 8,
    SHAPE_OBB = 16,
    SHAPE_PLANE = 32,
    SHAPE_TRIANGLE = 64,
    SHAPE_FRUSTUM = 128,
    SHAPE_FRUSTUM_ACCURATE = 256,
    SHAPE_CAPSULE = 512,
    SHAPE_SPLINE = 1024
}
export default ShapeType;
