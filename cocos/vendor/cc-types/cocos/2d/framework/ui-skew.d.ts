import { Component } from '../../scene-graph/component';
import { IVec2Like, Vec2 } from '../../core';
export declare class UISkew extends Component {
    private _skew;
    private _rotational;
    private _skewEnabled;
    constructor();
    /**
     * @engineInternal
     * @mangle
     */
    isSkewEnabled(): boolean;
    get rotational(): boolean;
    set rotational(value: boolean);
    protected __preload(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onDestroy(): void;
    private _syncNative;
    /**
     * @en Gets the skew on x axis. Unit is degree.
     * @zh 获取 X 轴斜切角度。
     */
    get x(): number;
    /**
     * @en Sets the skew on x axis. Unit is degree.
     * @zh 设置 X 轴斜切角度。
     */
    set x(v: number);
    /**
     * @en Gets the skew on y axis. Unit is degree.
     * @zh 获取 Y 轴斜切角度。
     */
    get y(): number;
    /**
     * @en Sets the skew on y axis. Unit is degree.
     * @zh 设置 Y 轴斜切角度。
     */
    set y(v: number);
    /**
     * @en Gets the skew value of the node. Unit is degree.
     * @zh 获取节点斜切角度。
     */
    get skew(): Readonly<Vec2>;
    /**
     * @en Sets the skew value of the node. Unit is degree.
     * @zh 设置节点斜切角度。
     */
    set skew(value: Readonly<Vec2>);
    /**
     * @en Sets the skew value of the node by Vec2.
     * @zh 设置节点斜切角度。
     * @param @en value The skew value in Vec2. @zh 斜切角度值。
     */
    setSkew(value: Readonly<IVec2Like>): void;
    /**
     * @en Sets the skew value of the node by x and y.
     * @zh 设置节点斜切角度。
     * @param x @en The skew on x axis. @zh X 轴斜切角度。
     * @param y @en The skew on y axis. @zh Y 轴斜切角度。
     */
    setSkew(x: number, y: number): void;
    /**
     * @en Copies and returns the skew value of the node.
     * @zh 拷贝节点斜切角度值并返回。
     * @returns @en The skew value of the node. @zh 节点斜切角度。
     */
    getSkew(out?: Vec2): Vec2;
    private _updateNodeTransformFlags;
}
