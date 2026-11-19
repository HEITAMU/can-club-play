import { Quat, Vec3 } from '../../core';
import { IAnimInfo, JointAnimationInfo } from './skeletal-animation-utils';
import { Node } from '../../scene-graph/node';
import type { AnimationClip } from '../../animation/animation-clip';
import { AnimationState } from '../../animation/animation-state';
import { SkeletalAnimation, Socket } from './skeletal-animation';
interface ITransform {
    pos: Vec3;
    rot: Quat;
    scale: Vec3;
}
interface ISocketData {
    target: Node;
    frames: ITransform[];
}
/**
 * @en The animation state for skeletal animations.
 * @zh 骨骼动画的动画状态控制对象。
 */
export declare class SkeletalAnimationState extends AnimationState {
    protected _frames: number;
    protected _bakedDuration: number;
    protected _animInfo: IAnimInfo | null;
    protected _sockets: ISocketData[];
    protected _animInfoMgr: JointAnimationInfo;
    protected _parent: SkeletalAnimation | null;
    protected _curvesInited: boolean;
    constructor(clip: AnimationClip, name?: string);
    initialize(root: Node): void;
    protected onPlay(): void;
    /**
     * @internal This method only friends to `SkeletalAnimation`.
     */
    setUseBaked(useBaked: boolean): void;
    /**
     * @en Rebuild animation curves and register the socket transforms per frame to the sockets. It will replace the internal sockets list.
     * @zh 为所有指定挂点更新动画曲线运算结果，并存储所有挂点的逐帧变换矩阵。这个方法会用传入的挂点更新取代内部挂点列表。
     * @param sockets @en The sockets need update @zh 需要重建的挂点列表
     * @returns void
     */
    rebuildSocketCurves(sockets: Socket[]): void;
    private _sampleCurvesBaked;
}
export {};
