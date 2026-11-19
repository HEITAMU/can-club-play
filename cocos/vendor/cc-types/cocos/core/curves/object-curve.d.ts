import { KeyframeCurve } from './keyframe-curve';
export type ObjectCurveKeyframe<T> = T;
export declare class ObjectCurve<T> extends KeyframeCurve<ObjectCurveKeyframe<T>> {
    evaluate(time: number): T;
}
