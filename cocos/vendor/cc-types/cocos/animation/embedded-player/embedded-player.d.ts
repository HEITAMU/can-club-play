import { EditorExtendable } from '../../core';
import type { Node } from '../../scene-graph';
export declare class EmbeddedPlayer extends EditorExtendable {
    /**
     * @en
     * Begin time, in seconds.
     * @zh
     * 开始时间，以秒为单位。
     */
    begin: number;
    /**
      * @en
      * End time, in seconds.
      * @zh
      * 结束时间，以秒为单位。
      */
    end: number;
    /**
      * @en
      * Whether the speed of this embedded player should be reconciled with the host animation clip.
      * @zh
      * 子区域的播放速度是否应和宿主动画剪辑保持一致。
      */
    reconciledSpeed: boolean;
    /**
     * @en
     * Player of the embedded player.
     * @zh
     * 子区域的播放器。
     */
    playable: EmbeddedPlayable | null;
}
export declare abstract class EmbeddedPlayable {
    /**
     * @en
     * Instantiates this sub region.
     * @zh
     * 实例化此子区域。
     * @param root The root node of animation context.
     * @internal
     */
    abstract instantiate(root: Node): EmbeddedPlayableState | null;
}
export declare abstract class EmbeddedPlayableState {
    constructor(randomAccess: boolean);
    /**
     * @zh
     * 是否可以随意调整此播放器到任何时间。
     * @en
     * Indicates if this player can be adjusted to any time.
     */
    get randomAccess(): boolean;
    /**
     * @zh
     * 销毁此播放器。
     * @zh
     * Destroys this player state.
     */
    abstract destroy(): void;
    /**
     * @zh
     * 该方法在此播放器开始播放时触发。
     * @en
     * This method is called when this player gets to play.
     */
    abstract play(): void;
    /**
     * @zh
     * 该方法在此播放器暂停播放时触发。
     * @en
     * This method is called when this player pauses.
     */
    abstract pause(): void;
    /**
     * @zh
     * 该方法在此播放器结束播放时触发，或在宿主动画剪辑本身停止播放时触发。
     * @en
     * This method is called when this player ends its playback, and is called when the host animation clip is stopped.
     */
    abstract stop(): void;
    /**
     * @zh
     * 如果 [[`EmbeddedPlayer.reconciledSpeed`]] 为 `true`，则在宿主的播放速度改变时触发。
     * @en
     * If [[`EmbeddedPlayer.reconciledSpeed`]] is `true`, is called when the host changes its speed.
     * @param speed The speed.
     */
    abstract setSpeed(speed: number): void;
    setTime(_time: number): void;
    private _randomAccess;
}
