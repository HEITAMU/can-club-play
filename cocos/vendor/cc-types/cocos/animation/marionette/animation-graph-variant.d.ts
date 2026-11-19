import { AnimationClip } from '../animation-clip';
import { AnimationGraph } from './animation-graph';
import { AnimationGraphLike } from './animation-graph-like';
import type { ReadonlyClipOverrideMap } from './clip-overriding';
/**
 * @en
 * An opacity type which denotes what the animation graph variant seems like outside the engine.
 * @zh
 * 一个非透明的类型，它是动画图变体在引擎外部的表示。
 */
export interface AnimationGraphVariantRunTime {
    /**
     * @internal
     */
    readonly __brand: 'AnimationGraphVariant';
}
declare class ClipOverrideEntry {
    original: AnimationClip;
    substitution: AnimationClip;
}
export declare class AnimationGraphVariant extends AnimationGraphLike implements AnimationGraphVariantRunTime {
    __brand: 'AnimationGraphVariant';
    get original(): AnimationGraph | null;
    set original(value: AnimationGraph | null);
    get clipOverrides(): ClipOverrideMap;
    private _graph;
    private _clipOverrides;
}
declare class ClipOverrideMap implements ReadonlyClipOverrideMap {
    get size(): number;
    [Symbol.iterator](): IterableIterator<ClipOverrideEntry>;
    has(original: AnimationClip): boolean;
    get(original: AnimationClip): AnimationClip | undefined;
    set(original: AnimationClip, substitution: AnimationClip): void;
    delete(original: AnimationClip): void;
    clear(): void;
    private _entries;
}
export {};
