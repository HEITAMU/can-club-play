/**
 * @en
 * Rigid body type.
 * @zh
 * 刚体类型。
 */
export declare enum ERigidBodyType {
    /**
     * @en
     * Dynamic type.
     * @zh
     * 动态刚体。
     */
    DYNAMIC = 1,
    /**
     * @en
     * Static type.
     * @zh
     * 静态刚体。
     */
    STATIC = 2,
    /**
     * @en
     * Kinematic type.
     * @zh
     * 运动学刚体。
     */
    KINEMATIC = 4
}
/**
 * @en
 * Axis Direction.
 * @zh
 * 轴方向。
 */
export declare enum EAxisDirection {
    /**
     * @en
     * X axis.
     * @zh
     * X 轴。
     */
    X_AXIS = 0,
    /**
     * @en
     * Y axis.
     * @zh
     * Y 轴。
     */
    Y_AXIS = 1,
    /**
     * @en
     * Z axis.
     * @zh
     * Z 轴。
     */
    Z_AXIS = 2
}
/**
 * @en
 * Degree of freedom.
 * @zh
 * 自由度。
 */
export declare enum ED6Axis {
    /**
     * @en
     * X axis.
     * @zh
     * X 轴。
     */
    X = 0,
    /**
     * @en
     * Y axis.
     * @zh
     * Y 轴。
     */
    Y = 1,
    /**
     * @en
     * Z axis.
     * @zh
     * Z 轴。
     */
    Z = 2,
    /**
     * @en
     * Swing 1, directs toward the local Y axis.
     * @zh
     * 摆动 1，其方向朝向 Y 轴。
     */
    SWING1 = 3,
    /**
     * @en
     * Swing 2, directs toward the local Z axis.
     * @zh
     * 摆动 2，其方向朝向 Z 轴。
     */
    SWING2 = 4,
    /**
     * @en
     * Twist, directs toward the local X axis.
     * @zh
     * 扭转，其方向朝向 X 轴。
     */
    TWIST = 5
}
/**
 * @en
 * Simplex Type.
 * @zh
 * 单形体类型。
 */
export declare enum ESimplexType {
    /**
     * @en
     * Point.
     * @zh
     * 点。
     */
    VERTEX = 1,
    /**
     * @en
     * Line.
     * @zh
     * 线。
     */
    LINE = 2,
    /**
     * @en
     * Triangle.
     * @zh
     * 三角形。
     */
    TRIANGLE = 3,
    /**
     * @en
     * Tetrahedron.
     * @zh
     * 四面体。
     */
    TETRAHEDRON = 4
}
/**
 * @en
 * Collider Type.
 * @zh
 * 碰撞体类型。
 */
export declare enum EColliderType {
    /**
     * @en
     * Box collider.
     * @zh
     * 盒子碰撞体。
     */
    BOX = 0,
    /**
     * @en
     * Sphere collider.
     * @zh
     * 球碰撞体。
     */
    SPHERE = 1,
    /**
     * @en
     * Capsule collider.
     * @zh
     * 胶囊碰撞体。
     */
    CAPSULE = 2,
    /**
     * @en
     * Cylinder collider.
     * @zh
     * 圆柱碰撞体。
     */
    CYLINDER = 3,
    /**
     * @en
     * Cone collider.
     * @zh
     * 圆锥碰撞体。
     */
    CONE = 4,
    /**
     * @en
     * Mesh collider.
     * @zh
     * 网格碰撞体。
     */
    MESH = 5,
    /**
     * @en
     * Plane collider.
     * @zh
     * 平面碰撞体。
     */
    PLANE = 6,
    /**
     * @en
     * Simplex collider.
     * @zh
     * 单形体碰撞体。
     */
    SIMPLEX = 7,
    /**
     * @en
     * Terrain collider.
     * @zh
     * 地形碰撞体。
     */
    TERRAIN = 8
}
/**
 * @en
 * Constraint Type.
 * @zh
 * 约束类型。
 */
export declare enum EConstraintType {
    /**
     * @en
     * Point to point constraint.
     * @zh
     * 点对点约束。
     */
    POINT_TO_POINT = 0,
    /**
     * @en
     * Hinge constraint.
     * @zh
     * 铰链约束。
     */
    HINGE = 1,
    /**
     * @en
     * Fixed constraint.
     * @zh
     * 固定约束。
     */
    FIXED = 2,
    /**
     * @en
     * Configurable constraint.
     * @zh
     * 可配置约束。
     */
    CONFIGURABLE = 3
}
/**
 * @en
 * Constraint Mode for degrees of freedom.
 * @zh
 * 自由度约束模式。
 */
export declare enum EConstraintMode {
    /**
     * @en
     * Free mode, the specified degrees of freedom are free to move.
     * @zh
     * 自由模式，指定的自由度可以自由移动。
     */
    FREE = 0,
    /**
     * @en
     * Limited mode, the specified degrees of freedom are limited.
     * @zh
     * 限制模式，指定的自由度受到限制。
     */
    LIMITED = 1,
    /**
     * @en
     * Locked mode, the specified degrees of freedom are locked.
     * @zh
     * 锁定模式，指定的自由度被锁定。
     */
    LOCKED = 2
}
/**
 * @en
 * Driver Type.
 * @zh
 * 驱动类型。
 */
export declare enum EDriverMode {
    /**
     * @en
     * Disabled.
     * @zh
     * 禁用。
     */
    DISABLED = 0,
    /**
     * @en
     * Servo motor, which targets the specified rotation angle.
     * @zh
     * 伺服电机，旋转到特定角度。
     */
    SERVO = 1,
    /**
     * @en
     * Induction motor, which targets the specified velocity.
     * @zh
     * 感应电机，旋转到特定速度。
     */
    INDUCTION = 2
}
/**
 * @en
 * Character Controller Type.
 * @zh
 * 角色控制器类型。
 */
export declare enum ECharacterControllerType {
    /**
     * @en
     * Box Character Controller.
     * @zh
     * 盒体角色控制器。
     */
    BOX = 0,
    /**
     * @en
     * Capsule Character Controller.
     * @zh
     * 胶囊体角色控制器。
     */
    CAPSULE = 1
}
/**
 * @en
 * Physics Group.
 * @zh
 * 物理分组。
 */
export declare enum PhysicsGroup {
    /**
     * @en
     * Default group.
     * @zh
     * 默认分组。
     */
    DEFAULT = 1
}
export declare enum EPhysicsDrawFlags {
    /**
     * @en
     * Draw nothing.
     * @zh
     * 不绘制。
    */
    NONE = 0,
    /**
     * @en
     * Draw wireframe
     * @zh
     * 绘制线框。
    */
    WIRE_FRAME = 1,
    /**
     * @en
     * Draw Constraint.
     * @zh
     * 绘制约束
    */
    CONSTRAINT = 2,
    /**
     * @en
     * Draw AABB.
     * @zh
     * 绘制包围盒。
    */
    AABB = 4
}
