import { Vec2 } from '../../core';
/**
 * @en The touch point class
 * @zh 封装了触点相关的信息。
 */
export declare class Touch {
    private _point;
    private _prevPoint;
    private _lastModified;
    private _id;
    private _startPoint;
    private _startPointCaptured;
    get lastModified(): number;
    /**
     * @param x - x position of the touch point
     * @param y - y position of the touch point
     * @param id - The id of the touch point
     */
    constructor(x: number, y: number, id?: number);
    /**
     * @en Returns the current touch location in OpenGL coordinates.、
     * @zh 获取当前触点位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getLocation(out?: Vec2): Vec2;
    /**
     * @en Returns X axis location value.
     * @zh 获取当前触点 X 轴位置。
     */
    getLocationX(): number;
    /**
     * @en Returns Y axis location value.
     * @zh 获取当前触点 Y 轴位置。
     */
    getLocationY(): number;
    /**
     * @en Returns the current touch location in UI coordinates.、
     * @zh 获取当前触点在 UI 坐标系中的位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getUILocation(out?: Vec2): Vec2;
    /**
     * @en Returns X axis location value in UI coordinates.
     * @zh 获取当前触点在 UI 坐标系中 X 轴位置。
     */
    getUILocationX(): number;
    /**
     * @en Returns Y axis location value in UI coordinates.
     * @zh 获取当前触点在 UI 坐标系中 Y 轴位置。
     */
    getUILocationY(): number;
    /**
     * @en Returns the previous touch location.
     * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getPreviousLocation(out?: Vec2): Vec2;
    /**
     * @en Returns the previous touch location in UI coordinates.
     * @zh 获取触点在上一次事件时在 UI 坐标系中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getUIPreviousLocation(out?: Vec2): Vec2;
    /**
     * @en Returns the start touch location.
     * @zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getStartLocation(out?: Vec2): Vec2;
    /**
     * @en Returns the start touch location in UI coordinates.
     * @zh 获取触点落下时在 UI 坐标系中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getUIStartLocation(out?: Vec2): Vec2;
    /**
     * @en Returns the delta distance from the previous touche to the current one.
     * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getDelta(out?: Vec2): Vec2;
    /**
     * @en Returns the delta distance from the previous touche to the current one in UI coordinates.
     * @zh 获取触点距离上一次事件移动在 UI 坐标系中的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getUIDelta(out?: Vec2): Vec2;
    /**
     * @en Returns the current touch location in screen coordinates.
     * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getLocationInView(out?: Vec2): Vec2;
    /**
     * @en Returns the previous touch location in screen coordinates.
     * @zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getPreviousLocationInView(out?: Vec2): Vec2;
    /**
     * @en Returns the start touch location in screen coordinates.
     * @zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    getStartLocationInView(out?: Vec2): Vec2;
    /**
     * @en Returns the id of the touch point.
     * @zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
     */
    getID(): number;
    /**
     * @en Resets touch point information.
     * @zh 重置触点相关的信息。
     * @param id - The id of the touch point
     * @param x - x position of the touch point
     * @param y - y position of the touch point
     */
    setTouchInfo(id?: number, x?: number, y?: number): void;
    /**
     * @en Sets touch point location.
     * @zh 设置触点位置。
     * @param point - The location
     */
    setPoint(point: Vec2): void;
    /**
     * @en Sets touch point location.
     * @zh 设置触点位置。
     * @param x - x position
     * @param y - y position
     */
    setPoint(x: number, y: number): void;
    /**
     * @en Sets the location previously registered for the current touch.
     * @zh 设置触点在前一次触发时收集的位置。
     * @param point - The location
     */
    setPrevPoint(point: Vec2): void;
    /**
     * @en Sets the location previously registered for the current touch.
     * @zh 设置触点在前一次触发时收集的位置。
     * @param x - x position
     * @param y - y position
     */
    setPrevPoint(x: number, y: number): void;
    /**
     * @zh Touch 对象的原始数据不应该被修改。如果你需要这么做，最好克隆一个新的对象。
     * @en The original Touch object shouldn't be modified. If you need to, it's better to clone a new one.
     */
    clone(): Touch;
}
