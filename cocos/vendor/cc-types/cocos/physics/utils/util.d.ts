import { Vec3, IVec3Like } from '../../core';
import { CharacterController, CharacterTriggerEventType, Collider, CollisionEventType, IContactEquation, TriggerEventType } from '../framework';
export { cylinder } from '../../primitive';
export declare function setWrap<Wrapper>(object: any, wrapper: Wrapper): void;
export declare function getWrap<Wrapper>(object: any): Wrapper;
export declare function maxComponent(v: IVec3Like): number;
export declare const VEC3_0: Vec3;
export declare const TriggerEventObject: {
    type: TriggerEventType;
    selfCollider: Collider | null;
    otherCollider: Collider | null;
    impl: any;
};
export declare const CharacterTriggerEventObject: {
    type: CharacterTriggerEventType;
    collider: Collider | null;
    characterController: CharacterController | null;
    impl: any;
};
export declare const CollisionEventObject: {
    type: CollisionEventType;
    selfCollider: Collider;
    otherCollider: Collider;
    contacts: IContactEquation[];
    impl: any;
};
export declare function shrinkPositions(buffer: Float32Array | number[]): number[];
export declare function absolute(v: Vec3): Vec3;
