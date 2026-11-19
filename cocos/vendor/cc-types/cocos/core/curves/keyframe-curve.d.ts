import type { CurveBase } from './curve-base';
type KeyFrame<TKeyframeValue> = [number, TKeyframeValue];
/**
 * @en
 * Keyframe curve.
 * @zh
 * 关键帧曲线。
 */
export declare class KeyframeCurve<TKeyframeValue> implements CurveBase, Iterable<KeyFrame<TKeyframeValue>> {
    /**
     * @en
     * Gets the count of keyframes.
     * @zh
     * 获取关键帧数量。
     */
    get keyFramesCount(): number;
    /**
     * @en
     * Gets the minimal keyframe time on this curve.
     * @zh
     * 获取此曲线上最小的关键帧时间。
     */
    get rangeMin(): number;
    /**
     * @en
     * Gets the maximum keyframe time on this curve.
     * @zh
     * 获取此曲线上最大的关键帧时间。
     */
    get rangeMax(): number;
    /**
     * @en
     * Returns an iterator to keyframe pairs.
     * @zh
     * 返回关键帧对的迭代器。
     */
    [Symbol.iterator](): {
        next: () => IteratorResult<KeyFrame<TKeyframeValue>>;
    };
    /**
     * @en
     * Returns an iterator to keyframe pairs.
     * @zh
     * 返回关键帧对的迭代器。
     */
    keyframes(): Iterable<KeyFrame<TKeyframeValue>>;
    /**
     * @en
     * Returns an iterator to keyframe times.
     * @zh
     * 返回关键帧时间的迭代器。
     */
    times(): Iterable<number>;
    /**
     * @en
     * Returns an iterator to keyframe values.
     * @zh
     * 返回关键帧值的迭代器。
     */
    values(): Iterable<TKeyframeValue>;
    /**
     * @en
     * Gets the time of specified keyframe.
     * @zh
     * 获取指定关键帧上的时间。
     * @param index Index to the keyframe.
     * @returns The keyframe 's time.
     */
    getKeyframeTime(index: number): number;
    /**
     * @en
     * Gets the value of specified keyframe.
     * @zh
     * 获取指定关键帧上的值。
     * @param index Index to the keyframe.
     * @returns The keyframe 's value.
     */
    getKeyframeValue(index: number): TKeyframeValue;
    /**
     * @en
     * Adds a keyframe into this curve.
     * @zh
     * 添加一个关键帧到此曲线中。
     * @param time Time of the keyframe.
     * @param keyframeValue Value of the keyframe.
     * @returns The index to the new keyframe.
     */
    addKeyFrame(time: number, keyframeValue: TKeyframeValue): number;
    /**
     * @en
     * Removes a keyframe from this curve.
     * @zh
     * 移除此曲线的一个关键帧。
     * @param index Index to the keyframe.
     */
    removeKeyframe(index: number): void;
    /**
     * @en
     * Searches for the keyframe at specified time.
     * @zh
     * 搜索指定时间上的关键帧。
     * @param time Time to search.
     * @returns Index to the keyframe or negative number if not found.
     */
    indexOfKeyframe(time: number): number;
    /**
     * @en
     * Updates the time of a keyframe.
     * @zh
     * 更新关键帧的时间。
     * @param index Index to the keyframe.
     * @param time New time.
     */
    updateTime(index: number, time: number): void;
    /**
     * @en
     * Assigns all keyframes.
     * @zh
     * 赋值所有关键帧。
     * @param keyframes An iterable to keyframes. The keyframes should be sorted by their time.
     */
    assignSorted(keyframes: Iterable<[number, TKeyframeValue]>): void;
    /**
     * @en
     * Assigns all keyframes.
     * @zh
     * 赋值所有关键帧。
     * @param times Times array. Should be sorted.
     * @param values Values array. Corresponding to each time in `times`.
     */
    assignSorted(times: readonly number[], values: TKeyframeValue[]): void;
    /**
     * @en
     * Removes all key frames.
     * @zh
     * 移除所有关键帧。
     */
    clear(): void;
    protected searchKeyframe(time: number): number;
    protected setKeyframes(times: number[], values: TKeyframeValue[]): void;
    private _insertNewKeyframe;
    /**
     * Times are always sorted and 1-1 correspond to values.
     * @dontmangle
     * NOTE: _times is a serializable property set by `CCClass.fastDefine`,
     * so it should not be mangled while `mangleProtected` is true in `<<ProjectRoot>>/engine-mangle-config.json`.
     */
    protected _times: number[];
    /**
     * @dontmangle
     * NOTE: _values is a serializable property set by `CCClass.fastDefine`,
     * so it should not be mangled while `mangleProtected` is true in `<<ProjectRoot>>/engine-mangle-config.json`.
     */
    protected _values: TKeyframeValue[];
}
export {};
