import { Asset } from '../assets/asset';
import Bundle from './bundle';
import Cache from './cache';
import { Pipeline } from './pipeline';
import WeakCache from './weak-cache';
export declare const assets: WeakCache<Asset> | Cache<Asset>;
export declare const files: Cache<any>;
export declare const parsed: Cache<any>;
export declare const bundles: Cache<Bundle>;
export declare const pipeline: Pipeline;
export declare const fetchPipeline: Pipeline;
export declare const transformPipeline: Pipeline;
export declare const references: Cache<any[]> | null;
export declare const assetsOverrideMap: Map<string, string>;
export declare enum RequestType {
    UUID = "uuid",
    PATH = "path",
    DIR = "dir",
    URL = "url",
    SCENE = "scene"
}
export interface IRequest extends Record<string, any> {
    uuid?: string;
    url?: string;
    path?: string;
    dir?: string;
    scene?: string;
}
export declare const presets: Record<string, Record<string, any>>;
/**
 * @en
 * The builtin bundles
 *
 * @zh
 * 内置 bundle
 *
 */
export declare enum BuiltinBundleName {
    /**
     * @en
     * The builtin bundle of default asset
     *
     * @zh
     * 内置 bundle, 对应默认资源
     */
    INTERNAL = "internal",
    /**
     * @en
     * The builtin bundle corresponds to 'assets/resources'.
     *
     * @zh
     * 内置 bundle, 对应 'assets/resources' 目录
     *
     */
    RESOURCES = "resources",
    /**
     * @en
     * The builtin bundle
     *
     * @zh
     * 内置 bundle
     *
     */
    MAIN = "main",
    /**
     * @en
     * The builtin bundle, exists when Start Scene asset bundle is checked on the project building panel
     *
     * @zh
     * 内置 bundle, 如果构建面板开启了首场景分包，则会有 START_SCENE bundle
     *
     */
    START_SCENE = "start-scene"
}
