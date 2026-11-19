import type { AnimationClip } from '../../animation/animation-clip';
import type { Skeleton } from '../assets';
import { Device } from '../../gfx';
import { JointAnimationInfo, JointTexturePool } from './skeletal-animation-utils';
export declare class DataPoolManager {
    jointTexturePool: JointTexturePool;
    jointAnimationInfo: JointAnimationInfo;
    constructor(device: Device);
    releaseSkeleton(skeleton: Skeleton): void;
    releaseAnimationClip(clip: AnimationClip): void;
    clear(): void;
}
