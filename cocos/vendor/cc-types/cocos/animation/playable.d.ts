export declare class Playable {
    /**
     * @en Whether if this `Playable` is in playing.
     * @zh 该 `Playable` 是否正在播放状态。
     * @default false
     */
    get isPlaying(): boolean;
    /**
     * @en Whether if this `Playable` has been paused. This can be true even if in edit mode(isPlaying == false).
     * @zh 该 `Playable` 是否已被暂停。
     * @default false
     */
    get isPaused(): boolean;
    /**
     * @en Whether if this `Playable` has been paused or stopped.
     * @zh 该 `Playable` 是否已被暂停或停止。
     */
    get isMotionless(): boolean;
    private _isPlaying;
    private _isPaused;
    private _stepOnce;
    /**
     * @en Play this animation.
     * @zh 播放动画。
     */
    play(): void;
    /**
     * @en Stop this animation.
     * @zh 停止动画播放。
     */
    stop(): void;
    /**
     * @en Pause this animation.
     * @zh 暂停动画。
     */
    pause(): void;
    /**
     * @en Resume this animation.
     * @zh 重新播放动画。
     */
    resume(): void;
    /**
     * @en Perform a single frame step.
     * @zh 执行一帧动画。
     */
    step(): void;
    update(deltaTime: number): void;
    protected onPlay(): void;
    protected onPause(): void;
    protected onResume(): void;
    protected onStop(): void;
    protected onError(message: string): void;
}
