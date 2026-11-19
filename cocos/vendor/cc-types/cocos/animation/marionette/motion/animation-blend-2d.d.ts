import { Vec2 } from '../../../core';
import { createEval } from '../create-eval';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { BindableNumber } from '../parametric';
import { AnimationGraphBindingContext } from '../animation-graph-context';
declare enum Algorithm {
    SIMPLE_DIRECTIONAL = 0,
    FREEFORM_CARTESIAN = 1,
    FREEFORM_DIRECTIONAL = 2
}
declare class AnimationBlend2DItem extends AnimationBlendItem {
    threshold: Vec2;
    clone(): AnimationBlend2DItem;
    protected _copyTo(that: AnimationBlend2DItem): AnimationBlend2DItem;
}
export declare class AnimationBlend2D extends AnimationBlend {
    static Algorithm: typeof Algorithm;
    static Item: typeof AnimationBlend2DItem;
    get algorithm(): Algorithm;
    set algorithm(value: Algorithm);
    private _items;
    paramX: BindableNumber;
    paramY: BindableNumber;
    get items(): Iterable<AnimationBlend2DItem>;
    set items(items: Iterable<AnimationBlend2DItem>);
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
    clone(): AnimationBlend2D;
    [createEval](context: AnimationGraphBindingContext, ignoreEmbeddedPlayers: boolean): AnimationBlendEval;
    private _algorithm;
    private _polarSpaceGBI;
    private _tryReconstructPolarSpaceInterpolator;
}
export declare namespace AnimationBlend2D {
    type Algorithm = typeof Algorithm;
    type Item = AnimationBlend2DItem;
}
export {};
