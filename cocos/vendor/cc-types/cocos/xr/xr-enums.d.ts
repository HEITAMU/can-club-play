/**
 * @en XR Eye Enum.
 * @zh XR视窗枚举。
 */
export declare enum XREye {
    /**
     * @en None.
     * @zh 无。
     */
    NONE = -1,
    /**
     * @en Left eye.
     * @zh 左眼。
     */
    LEFT = 0,
    /**
     * @en Right eye.
     * @zh 右眼。
     */
    RIGHT = 1
}
/**
 * @en XR Config Key Enum.
 * @zh XR配置键值枚举。
 */
export declare enum XRConfigKey {
    /**
     * @en Session running.
     * @zh 会话运行中。
     */
    SESSION_RUNNING = 2,
    /**
     * @en View count.
     * @zh 视窗数量。
     */
    VIEW_COUNT = 6,
    /**
     * @en Swapchain width.
     * @zh 交换链宽度。
     */
    SWAPCHAIN_WIDTH = 7,
    /**
     * @en Swapchain height.
     * @zh 交换链高度。
     */
    SWAPCHAIN_HEIGHT = 8,
    /**
     * @en Device IPD.
     * @zh 设备瞳距。
     */
    DEVICE_IPD = 37,
    /**
     * @en Split AR Glasses.
     * @zh 分体式AR眼镜。
     */
    SPLIT_AR_GLASSES = 42
}
/**
 * @en XR Pose Type Enum.
 * @zh XR姿态类型枚举。
 */
export declare enum XRPoseType {
    /**
     * @en The pose for left eye.
     * @zh 左眼姿态。
     */
    VIEW_LEFT = 0,
    /**
     * @en The pose for left controller.
     * @zh 左手柄姿态。
     */
    HAND_LEFT = 1,
    /**
     * @en The pose for left controller's aim.
     * @zh 左手柄瞄准方向姿态。
     */
    AIM_LEFT = 2,
    /**
     * @en The pose for right eye.
     * @zh 右眼姿态。
     */
    VIEW_RIGHT = 3,
    /**
     * @en The pose for right controller.
     * @zh 右手柄姿态。
     */
    HAND_RIGHT = 4,
    /**
     * @en The pose for right controller's aim.
     * @zh 右手柄瞄准方向姿态。
     */
    AIM_RIGHT = 5,
    /**
     * @en The pose for head.
     * @zh 头部姿态。
     */
    HEAD_MIDDLE = 6
}
