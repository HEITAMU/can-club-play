import type { AnimationClip } from '../../animation/animation-clip';
import { BAKE_SKELETON_CURVE_SYMBOL } from '../../animation/internal-symbols';
type BakeData = ReturnType<AnimationClip[typeof BAKE_SKELETON_CURVE_SYMBOL]>;
/**
 * @en
 * The data conversion tool for skeleton animation
 * @zh
 * 骨骼动画数据转换中心。
 * @internal
 */
export declare class SkelAnimDataHub {
    static getOrExtract(clip: AnimationClip): BakeData;
    static destroy(clip: AnimationClip): void;
    private static pool;
}
export {};
