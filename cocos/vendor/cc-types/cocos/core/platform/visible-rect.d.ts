import { Rect } from '../math';
/**
 * @zh `visibleRect` is a singleton object which defines the actual visible rect of the current view.
 * @en `visibleRect` 是一个定义当前视图的实际可见矩形的单例对象。
 * @engineInternal
 */
export declare const visibleRect: {
    /**
     * @zh 与游戏场景有关的屏幕左上方坐标。
     * @en Top left coordinate of the screen related to the game scene.
     */
    topLeft: any;
    /**
     * @zh 与游戏场景有关的屏幕右上方坐标。
     * @en Top right coordinate of the screen related to the game scene.
     */
    topRight: any;
    /**
     * @zh 与游戏场景有关的屏幕上方中心坐标。
     * @en Top center coordinate of the screen related to the game scene.
     */
    top: any;
    /**
     * @zh 与游戏场景有关的屏幕左下坐标。
     * @en Bottom left coordinate of the screen related to the game scene.
     */
    bottomLeft: any;
    /**
     * @zh 与游戏场景有关的屏幕右下坐标。
     * @en Bottom right coordinate of the screen related to the game scene.
     */
    bottomRight: any;
    /**
     * @zh 与游戏场景有关的屏幕下方中心坐标。
     * @en Bottom center coordinate of the screen related to the game scene.
     */
    bottom: any;
    /**
     * @zh 与游戏场景有关的屏幕中心坐标。
     * @en Center coordinate of the screen related to the game scene.
     */
    center: any;
    /**
     * @zh 与游戏场景有关的屏幕左边中心坐标。
     * @en Left center coordinate of the screen related to the game scene.
     */
    left: any;
    /**
     * @zh 与游戏场景有关的屏幕右边中心坐标。
     * @en Right center coordinate of the screen related to the game scene.
     */
    right: any;
    /**
     * @zh 屏幕宽度。
     * @en Width of the screen.
     */
    width: number;
    /**
     * @zh 屏幕高度。
     * @en Height of the screen.
     */
    height: number;
    /**
     * @zh 初始化函数。
     * @en Initialization function.
     * @param visibleRect_ @zh 当前视图的实际可见区域。@en The actual visible area of the current view.
     * @NOTE: @zh 必须是有效的区域。例如区域大小不能为负数。@en It must be a valid region. For example, the region size cannot be negative.
     */
    init(visibleRect_: Rect): void;
};
