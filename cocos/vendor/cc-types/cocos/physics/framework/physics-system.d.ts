import { Vec3, System, geometry, IQuatLike, IVec3Like } from '../../core';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsMaterial } from './assets/physics-material';
import { PhysicsRayResult, PhysicsLineStripCastResult } from './physics-ray-result';
import { IPhysicsConfig, ICollisionMatrix } from './physics-config';
import { PhysicsGroup } from './physics-enum';
import { IWorldInitData } from './physics-selector';
/**
 * @en
 * Physics system.
 * @zh
 * 物理系统。
 */
export declare class PhysicsSystem extends System implements IWorldInitData {
    static get PHYSICS_NONE(): boolean;
    static get PHYSICS_BUILTIN(): boolean;
    static get PHYSICS_CANNON(): boolean;
    static get PHYSICS_BULLET(): boolean;
    static get PHYSICS_PHYSX(): boolean;
    /**
     * @en
     * Gets the ID of the system.
     * @zh
     * 获取此系统的ID。
     */
    static readonly ID = "PHYSICS";
    /**
     * @en
     * Gets the predefined physics groups.
     * @zh
     * 获取预定义的物理分组。
     */
    static get PhysicsGroup(): typeof PhysicsGroup;
    /**
     * @en
     * Gets the physical system instance.
     * @zh
     * 获取物理系统实例。
     */
    static get instance(): PhysicsSystem;
    /**
     * @en
     * Gets or sets whether the physical system is enabled, which can be used to pause or continue running the physical system.
     * @zh
     * 获取或设置是否启用物理系统，可以用于暂停或继续运行物理系统。
     */
    get enable(): boolean;
    set enable(value: boolean);
    /**
     * @zh
     * Gets or sets whether the physical system allows automatic sleep, which defaults to true.
     * @zh
     * 获取或设置物理系统是否允许自动休眠，默认为 true。
     */
    get allowSleep(): boolean;
    set allowSleep(v: boolean);
    /**
     * @en
     * Gets or sets the maximum number of simulated substeps per frame.
     * @zh
     * 获取或设置每帧模拟的最大子步数。
     */
    get maxSubSteps(): number;
    set maxSubSteps(value: number);
    /**
     * @en
     * Gets or sets the fixed delta time consumed by each simulation step in seconds.
     * @zh
     * 获取或设置每步模拟消耗的固定时间（以 s 为单位）。
     */
    get fixedTimeStep(): number;
    set fixedTimeStep(value: number);
    /**
     * @en
     * Gets or sets the value of gravity in the physical world, which defaults to (0, -10, 0).
     * @zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)。
     */
    get gravity(): Vec3;
    set gravity(gravity: Vec3);
    /**
     * @en
     * Gets or sets the default speed threshold for going to sleep.
     * @zh
     * 获取或设置进入休眠的默认速度临界值。
     */
    get sleepThreshold(): number;
    set sleepThreshold(v: number);
    /**
     * @en
     * Turn on or off the automatic simulation.
     * @zh
     * 获取或设置是否自动模拟。
     */
    get autoSimulation(): boolean;
    set autoSimulation(value: boolean);
    /**
     * @en
     * Gets the global default physical material.
     * @zh
     * 获取全局的默认物理材质。
     */
    get defaultMaterial(): PhysicsMaterial;
    /**
     * @en
     * Set the default physics material.
     * @zh
     * 设置默认物理材质。
     */
    setDefaultPhysicsMaterial(material: PhysicsMaterial): void;
    private initDefaultMaterial;
    /**
     * @en
     * Gets the wrappered object of the physical world through which you can access the actual underlying object.
     * @zh
     * 获取物理世界的封装对象，通过它你可以访问到实际的底层对象。
     */
    get physicsWorld(): IPhysicsWorld;
    /**
     * @en
     * Gets the raycastClosest test result.
     * @zh
     * 获取 raycastClosest 的检测结果。
     */
    readonly raycastClosestResult: PhysicsRayResult;
    /**
    * @en
    * Gets the raycast test results.
    * @zh
    * 获取 raycast 的检测结果。
    */
    readonly raycastResults: PhysicsRayResult[];
    /**
     * @en
     * Gets the lineStripCastClosest test result.
     * @zh
     * 获取 lineStripCastClosest 的检测结果。
     */
    lineStripCastClosestResult: PhysicsLineStripCastResult;
    /**
    * @en
    * Gets the lineStripCast test results.
    * @zh
    * 获取 lineStripCast 的检测结果。
    */
    lineStripCastResults: PhysicsLineStripCastResult[];
    /**
     * @en
     * Gets the sweepCastClosest test result.
     * @zh
     * 获取 sweepCastClosest 的检测结果。
     */
    readonly sweepCastClosestResult: PhysicsRayResult;
    /**
        * @en
        * Gets the sweepCast test results.
        * @zh
        * 获取 sweepCast 的检测结果。
        */
    readonly sweepCastResults: PhysicsRayResult[];
    /**
    * @en
    * Gets the collision matrix that used for initialization only.
    * @zh
    * 获取碰撞矩阵，它仅用于初始化。
    */
    readonly collisionMatrix: ICollisionMatrix;
    /**
     * @en
     * The minimum size of the collision body.
     * @zh
     * 碰撞体的最小尺寸。
     */
    minVolumeSize: number;
    readonly useNodeChains: boolean;
    private _enable;
    private _allowSleep;
    private _maxSubSteps;
    private _subStepCount;
    private _fixedTimeStep;
    private _autoSimulation;
    private _accumulator;
    private _sleepThreshold;
    private readonly _gravity;
    private _material;
    private static readonly _instance;
    private readonly raycastOptions;
    private readonly raycastResultPool;
    private readonly sweepResultPool;
    private constructor();
    postUpdate(deltaTime: number): void;
    /**
     * @en
     * Reset the physics configuration.
     * @zh
     * 重置物理配置。
     */
    resetConfiguration(config?: IPhysicsConfig): void;
    /**
     * @en
     * Reset the accumulator of time to given value.
     * @zh
     * 重置时间累积总量为给定值。
     */
    resetAccumulator(time?: number): void;
    /**
     * @en
     * Perform simulation steps for the physics world.
     * @zh
     * 执行物理世界的模拟步进。
     * @param fixedTimeStep
     */
    step(fixedTimeStep: number, deltaTime?: number, maxSubSteps?: number): void;
    /**
     * @en
     * Sync the scene world transform changes to the physics world.
     * @zh
     * 同步场景世界的变化信息到物理世界中。
     */
    syncSceneToPhysics(): void;
    /**
     * @en
     * Emit trigger and collision events.
     * @zh
     * 触发`trigger`和`collision`事件。
     */
    emitEvents(): void;
    /**
     * @en
     * Get or set debug draw flags. Default is EPhysicsDrawFlags.NONE.
     * Refer to EPhysicsDrawFlags.
     * Note: Since physics debug draw uses Geometry-Renderer to do drawing,
     * make sure Geometry-Renderer is not cropped in Project Setting.
     * @zh
     * 获取或设置调试绘制标志。默认为 EPhysicsDrawFlags.NONE。
     * 参考 EPhysicsDrawFlags。
     * 注意：因为物理调试绘制使用几何渲染器来绘制，请确保项目设置中几何渲染器没有被裁剪掉。
     */
    get debugDrawFlags(): number;
    set debugDrawFlags(v: number);
    /**
     * @en
     * Get or set constraint debug draw size. Default is 0.3.
     * @zh
     * 获取或设置约束的调试绘制尺寸。默认为 0.3。
     */
    get debugDrawConstraintSize(): number;
    set debugDrawConstraintSize(v: number);
    /**
     * @en
     * Collision detect all collider, and record all the detected results, through PhysicsSystem.Instance.RaycastResults access to the results.
     * @zh
     * 检测所有的碰撞盒，并记录所有被检测到的结果，通过 PhysicsSystem.instance.raycastResults 访问结果。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                    @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    raycast(worldRay: geometry.Ray, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Collision detect all collider, and record and ray test results with the shortest distance
     * by PhysicsSystem.Instance.RaycastClosestResult access to the results.
     * @zh
     * 检测所有的碰撞盒，并记录与射线距离最短的检测结果，通过 PhysicsSystem.instance.raycastClosestResult 访问结果。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                    @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    raycastClosest(worldRay: geometry.Ray, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
    * @en
    * Collision detect all collider and record all the detected results, using
    * PhysicsSystem.Instance.lineStripCastResults to access the results.
    * @zh
    * 逐线段检测所有的碰撞盒，并记录所有检测结果。通过 PhysicsSystem.instance.lineStripCastResults 访问结果。
    * @param samplePointsWorldSpace @zh 世界空间下的采样点/直线段 @en sample points/line segments in world space
    * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
    * @param maxDistance @zh 沿着直线段的最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
    *                    @en Maximum detection distance along the line segments, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
    * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
    * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
    */
    lineStripCast(samplePointsWorldSpace: Array<Vec3>, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Collision detect all collider, and record the ray test results with the shortest distance.
     * Using PhysicsSystem.Instance.lineStripCastClosestResult to access the result.
     * @zh
     * 逐线段检测所有的碰撞盒，并记录沿这些线段距离最短的检测结果，通过 PhysicsSystem.instance.lineStripCastClosestResult 访问结果。
     * @param samplePointsWorldSpace @zh 世界空间下的采样点/直线段 @en sample points/line segments in world space
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 沿着直线段的最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                    @en Maximum detection distance along the line segments, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    lineStripCastClosest(samplePointsWorldSpace: Array<Vec3>, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Cast a box along a ray and record information on what was hit.
     * Access the results through PhysicsSystem.Instance.sweepCastResults.
     * @zh
     * 将盒体沿着射线发射，记录所有被检测到的结果，通过 PhysicsSystem.instance.sweepCastResults 访问结果。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param halfExtent @zh 盒体的一半尺寸 @en Half extent of the box
     * @param orientation @zh 盒体的方向 @en Orientation of the box
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                    @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    sweepBox(worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Cast a box along a ray and record information on the closest hit.
     * Access the results through PhysicsSystem.Instance.sweepCastClosestResult.
     * @zh
     * 将盒体沿着射线发射，记录距离最近的碰撞结果，通过 PhysicsSystem.instance.sweepCastClosestResult 访问结果。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param halfExtent @zh 盒体的一半尺寸 @en Half extent of the box
     * @param orientation @zh 盒体的方向 @en Orientation of the box
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                   @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    sweepBoxClosest(worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Cast a sphere along a ray and record information on what was hit.
     * Access the results through PhysicsSystem.Instance.sweepCastResults.
     * @zh
     * 将球体沿着射线发射，记录所有被检测到的结果，通过 PhysicsSystem.instance.sweepCastResults 访问结果。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param radius @zh 球体的半径 @en Radius of the sphere
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                  @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    sweepSphere(worldRay: geometry.Ray, radius: number, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Cast a sphere along a ray and record information on the closest hit.
     * Access the result through PhysicsSystem.Instance.sweepCastClosestResult.
     * @zh
     * 将球体沿着射线发射，记录距离最近的碰撞结果，通过 PhysicsSystem.instance.sweepCastClosestResult 访问结果。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param radius @zh 球体的半径 @en Radius of the sphere
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                 @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    sweepSphereClosest(worldRay: geometry.Ray, radius: number, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Cast a capsule along a ray and record information on what was hit.
     * Access the results through PhysicsSystem.Instance.sweepCastResults.
     * Capsule's default axis is along the world space Y axis.
     * @zh
     * 将胶囊体沿着射线发射，记录所有被检测到的结果，通过 PhysicsSystem.instance.sweepCastResults 访问结果。
     * 胶囊体的默认朝向是世界空间下的 Y 轴。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param radius @zh 胶囊体的半径 @en Radius of the capsule
     * @param height @zh 胶囊体末端两个半球圆心的距离 @en Distance between the two half-sphere centers of the capsule
     * @param orientation @zh 胶囊体的朝向 @en Orientation of the capsule
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *                @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    sweepCapsule(worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    /**
     * @en
     * Cast a capsule along a ray and record information on the closest hit.
     * Access the result through PhysicsSystem.Instance.sweepCastClosestResult.
     * Capsule's default axis is along the world space Y axis.
     * @zh
     * 将胶囊体沿着射线发射，记录距离最近的碰撞结果，通过 PhysicsSystem.instance.sweepCastClosestResult 访问结果。
     * 胶囊体的默认朝向是世界空间下的 Y 轴。
     * @param worldRay @zh 世界空间下的一条射线 @en A ray in world space
     * @param radius @zh 胶囊体的半径 @en Radius of the capsule
     * @param height @zh 胶囊体末端两个半球圆心的距离 @en Distance between the two half-sphere centers of the capsule
     * @param orientation @zh 胶囊体的朝向 @en Orientation of the capsule
     * @param mask @zh 掩码，默认为 0xffffffff @en Mask, default value is 0xffffffff
     * @param maxDistance @zh 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     *               @en Maximum detection distance, default value is 10000000, do not pass Infinity or Number.MAX_VALUE for now
     * @param queryTrigger @zh 是否检测触发器 @en Whether to detect triggers
     * @return {boolean} @zh 表示是否有检测到碰撞 @en Indicates whether a collision has been detected
     */
    sweepCapsuleClosest(worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike, mask?: number, maxDistance?: number, queryTrigger?: boolean): boolean;
    private _updateMaterial;
    /**
     * @en
     * Construct and register the system singleton.
     * If the module is pre-loaded, it will be executed automatically.
     * @zh
     * 构造并注册系统单例。
     * 预先加载模块的情况下，会自动执行。
     */
    static constructAndRegister(): void;
    static constructAndRegisterManually(): Promise<void>;
    private static doConstructAndRegister;
}
