import { createEval } from '../create-eval';
import { BindableNumber } from '../parametric';
import { AnimationBlend, AnimationBlendItem } from './animation-blend';
import { AnimationGraphBindingContext } from '../animation-graph-context';
declare class AnimationBlend1DItem extends AnimationBlendItem {
    threshold: number;
    clone(): AnimationBlend1DItem;
    protected _copyTo(that: AnimationBlend1DItem): AnimationBlend1DItem;
}
export declare class AnimationBlend1D extends AnimationBlend {
    static Item: typeof AnimationBlend1DItem;
    private _items;
    param: BindableNumber;
    get items(): Iterable<AnimationBlend1DItem>;
    set items(value: Iterable<AnimationBlend1DItem>);
    clone(): AnimationBlend1D;
    [createEval](context: AnimationGraphBindingContext, ignoreEmbeddedPlayers: boolean): any;
}
export declare namespace AnimationBlend1D {
    type Item = AnimationBlend1DItem;
}
export {};
