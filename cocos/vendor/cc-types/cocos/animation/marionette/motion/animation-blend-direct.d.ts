import { createEval } from '../create-eval';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { BindableNumber } from '../parametric';
import { AnimationGraphBindingContext } from '../animation-graph-context';
declare class AnimationBlendDirectItem extends AnimationBlendItem {
    weight: BindableNumber;
    clone(): AnimationBlendDirectItem;
    protected _copyTo(that: AnimationBlendDirectItem): AnimationBlendDirectItem;
}
export declare class AnimationBlendDirect extends AnimationBlend {
    static Item: typeof AnimationBlendDirectItem;
    private _items;
    get items(): AnimationBlendDirectItem[];
    set items(value: AnimationBlendDirectItem[]);
    clone(): AnimationBlendDirect;
    [createEval](context: AnimationGraphBindingContext, ignoreEmbeddedPlayers: boolean): AnimationBlendDirectEval;
}
export declare namespace AnimationBlendDirect {
    type Item = AnimationBlendDirectItem;
}
declare class AnimationBlendDirectEval extends AnimationBlendEval {
    constructor(...args: ConstructorParameters<typeof AnimationBlendEval>);
    protected eval(weights: number[], inputs: readonly number[]): void;
}
export {};
