import { IVec3Like } from '../../core';
export interface ICollisionMatrix {
    [x: string]: number;
}
export interface ICollisionGroup {
    index: number;
    name: string;
}
export interface IPhysicsConfig {
    gravity?: IVec3Like;
    allowSleep?: boolean;
    fixedTimeStep?: number;
    maxSubSteps?: number;
    sleepThreshold?: number;
    collisionMatrix?: ICollisionMatrix;
    collisionGroups?: ICollisionGroup[];
    autoSimulation?: boolean;
    useNodeChains?: boolean;
    physicsEngine?: 'builtin' | 'cannon.js' | 'bullet' | 'physx' | string;
}
