import { Type } from '../../gfx';
import { Camera } from '../../render-scene/scene/camera';
export declare function isUICamera(camera: Camera): boolean;
export declare function replacer(key: unknown, value: unknown): unknown;
export declare function reviver(key: unknown, value: any): any;
export declare function stringify(data: unknown, space?: string | number | undefined): string;
export declare function parse(text: string): any;
export declare function getUBOTypeCount(type: Type): number;
export declare class ObjectPool<T, U extends any[]> {
    private pool;
    private createFunction;
    constructor(createFunction: (...args: U) => T);
    acquire(...args: U): T;
    release(obj: T): void;
    create(...args: U): T;
}
