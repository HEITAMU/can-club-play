import { Asset } from './asset';
/**
 * @en The script asset base class
 * @zh 脚本资源基类。
 */
export declare class Script extends Asset {
    constructor(name?: string);
}
/**
 * @en JavaScript asset.
 * @zh JavaScript 脚本资源。
 */
export declare class JavaScript extends Script {
    constructor(name?: string);
}
/**
 * @en TypeScript asset
 * @zh TypeScript 脚本资源。
 */
export declare class TypeScript extends Script {
    constructor(name?: string);
}
