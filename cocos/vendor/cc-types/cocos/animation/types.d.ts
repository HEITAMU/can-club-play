/**
 * 动画使用的循环模式。
 */
export declare enum WrapMode {
    /**
     * 向 Animation Component 或者 AnimationClip 查找 wrapMode
     */
    Default = 0,
    /**
     * 动画只播放一遍
     */
    Normal = 1,
    /**
     * 从最后一帧或结束位置开始反向播放，到第一帧或开始位置停止
     */
    Reverse = 36,
    /**
     * 循环播放
     */
    Loop = 2,
    /**
     * 反向循环播放
     */
    LoopReverse = 38,
    /**
     * 从第一帧播放到最后一帧，然后反向播放回第一帧，到第一帧后再正向播放，如此循环
     */
    PingPong = 22,
    /**
     * 从最后一帧开始反向播放，其他同 PingPong
     */
    PingPongReverse = 54
}
/**
 * For internal
 */
export declare class WrappedInfo {
    ratio: number;
    time: number;
    direction: number;
    stopped: boolean;
    iterations: number;
    frameIndex: number;
    constructor(info?: WrappedInfo);
    set(info: WrappedInfo): void;
}
export interface ILerpable {
    /**
     * 在当前曲线值与目标曲线值之间插值。
     * @param to 目标曲线值。
     * @param t 插值比率。
     * @param dt 当前曲线值与目标曲线值的时间间隔，单位为秒。
     * @returns 插值结果。
     */
    lerp(to: any, t: number, dt: number): any;
    /**
     * 当直接使用曲线值作为采样结果时的结果值，它应该等同于插值比率为 0 时的插值结果。
     * @returns 插值比率为 0 时的插值结果。
     */
    getNoLerp?(): any;
}
export declare function isLerpable(object: any): object is ILerpable;
