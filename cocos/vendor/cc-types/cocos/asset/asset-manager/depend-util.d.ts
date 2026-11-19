import Cache from './cache';
export interface IDependencies {
    nativeDep?: Record<string, any>;
    deps: string[];
    parsedFromExistAsset?: boolean;
    persistDeps?: string[];
}
/**
 * @en
 * Manages asset's dependency list, it is a singleton. You can access it via [[AssetManager.dependUtil]].
 *
 * @zh
 * 管理资源的依赖列表，这是一个单例, 你能通过 [[AssetManager.dependUtil]] 访问它。
 *
 */
export declare class DependUtil {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _depends: Cache<IDependencies>;
    private static _instance;
    /**
     * @en Global singleton for [[DependUtil]]. You can access it via [[AssetManager.dependUtil]].
     * @zh [[DependUtil]] 的全局单例. 你可以通过 [[AssetManager.dependUtil]] 访问.
     */
    static get instance(): DependUtil;
    private constructor();
    /**
     * @engineInternal
     */
    init(): void;
    /**
     * @en
     * Gets asset's native dependency. For example, ImageAsset's native dependency is image.
     * Note: You will need to have loaded this resource to query this information.
     *
     * @zh
     * 获取资源的原生依赖，例如 ImageAsset 的原生依赖是图片。
     * 注意：你需要加载过该资源，才能查询此信息。
     *
     * @param uuid @en asset's uuid. @zh 资源的 uuid。
     * @returns @en The native dependency information of this asset. @zh 资源的原生依赖的信息。
     *
     * @example
     * var dep = dependUtil.getNativeDep('fcmR3XADNLgJ1ByKhqcC5Z');
     * @deprecated Since v3.7, this is an engine internal interface.
     * If you want to know the native dependency of the asset, use [[Asset.nativeUrl]] instead.
     */
    getNativeDep(uuid: string): Record<string, any> | null;
    /**
     * @en
     * Gets asset's direct referencing dependency list. For example, Material's dependencies are Texture, effect asset etc.
     * Note: You will need to have loaded this resource to query this information.
     *
     * @zh
     * 获取资源直接引用的依赖列表，例如，材质的直接依赖资源是 Texture, Effect 等。
     * 注意：你需要加载过该资源，才能查询此信息。
     *
     * @param uuid @en asset's uuid. @zh 资源的 uuid。
     * @returns @en The direct referencing dependency asset list. @zh 直接引用的依赖资源列表。
     *
     * @example
     * var deps = dependUtil.getDeps('fcmR3XADNLgJ1ByKhqcC5Z');
     *
     */
    getDeps(uuid: string): string[];
    /**
     * @en
     * Gets dependency list of the loaded asset, include indirect reference.
     * Note: You will need to have loaded this resource to query this information.
     *
     * @zh
     * 获取某个已经加载好的资源的所有依赖资源列表，包括间接引用的资源，并保存在数组中返回。
     * 注意：你需要加载过该资源，才能查询此信息。
     *
     * @param uuid @en asset's uuid. @zh 资源的 uuid。
     * @returns
     * @en The all dependency list including direct reference and indirect reference.
     * @zh 所有依赖列表，包括直接引用的与间接引用的。
     *
     * @example
     * var deps = dependUtil.getDepsRecursively('fcmR3XADNLgJ1ByKhqcC5Z');
     *
     */
    getDepsRecursively(uuid: string): string[];
    /**
     * @engineInternal
     */
    remove(uuid: string): void;
    /**
     * @en
     * Extracts dependency list from serialized data or asset and then store in cache.
     *
     * @zh
     * 从序列化数据或资源中提取出依赖列表，并且存储在缓存中。
     *
     * @param uuid - The uuid of serialized data or asset
     * @param json - Serialized data or asset
     * @returns dependency list, include non-native and native dependency
     *
     * @example
     * downloader.downloadFile('test.json', { xhrResponseType: 'json'}, null, (err, file) => {
     *     var dependencies = parse('fcmR3XADNLgJ1ByKhqcC5Z', file);
     * });
     *
     * @engineInternal
     */
    parse(uuid: string, json: any): IDependencies;
    private _parseDepsFromAsset;
    private _parseDepsFromJson;
    private _descend;
}
declare const _default: DependUtil;
export default _default;
