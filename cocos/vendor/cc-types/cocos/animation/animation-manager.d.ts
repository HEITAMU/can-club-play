import { System } from '../core';
import { Node } from '../scene-graph';
import { LegacyBlendStateBuffer } from '../3d/skeletal-animation/skeletal-animation-blending';
import { AnimationState } from './animation-state';
import type { CrossFade } from './cross-fade';
import { Socket } from '../3d/skeletal-animation/skeletal-animation';
export declare class AnimationManager extends System {
    get blendState(): LegacyBlendStateBuffer;
    static ID: string;
    private _anims;
    private _crossFades;
    private _delayEvents;
    private _blendStateBuffer;
    private _sockets;
    /**
     * @en Get the array of all the animation state.
     * @zh 获取所有动画状态的数组。
     */
    get animationStates(): ReadonlyArray<AnimationState>;
    addCrossFade(crossFade: CrossFade): void;
    removeCrossFade(crossFade: CrossFade): void;
    update(dt: number): void;
    destruct(): void;
    addAnimation(anim: AnimationState): void;
    removeAnimation(anim: AnimationState): void;
    pushDelayEvent(fn: (...args: any[]) => void, thisArg: any, args: any[]): void;
    addSockets(root: Node, sockets: Socket[]): void;
    removeSockets(root: Node, sockets: Socket[]): void;
}
