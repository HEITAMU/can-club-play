import { ILifecycle } from './i-lifecycle';
import { IGroupMask } from './i-group-mask';
import { IVec3Like } from '../../core';
import { CharacterController } from '../framework/components/character-controllers/character-controller';
export interface IBaseCharacterController extends ILifecycle, IGroupMask {
    initialize(v: CharacterController): boolean;
    updateEventListener: () => void;
    onGround(): boolean;
    getPosition(out: IVec3Like): void;
    setPosition(value: IVec3Like): void;
    setStepOffset(value: number): void;
    setSlopeLimit(value: number): void;
    setContactOffset(value: number): void;
    setDetectCollisions(value: boolean): void;
    setOverlapRecovery(value: boolean): void;
    move(movement: IVec3Like, minDist: number, elapsedTime: number): void;
    syncPhysicsToScene(): void;
}
export interface ICapsuleCharacterController extends IBaseCharacterController {
    setRadius(value: number): void;
    setHeight(value: number): void;
}
export interface IBoxCharacterController extends IBaseCharacterController {
    setHalfHeight(value: number): void;
    setHalfSideExtent(value: number): void;
    setHalfForwardExtent(value: number): void;
}
