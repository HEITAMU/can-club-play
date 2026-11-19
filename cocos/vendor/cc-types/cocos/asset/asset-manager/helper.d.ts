export { default as decodeUuid } from '../../core/utils/decode-uuid';
/**
 * @en
 * Extracts uuid from url.
 *
 * @zh
 * 从 url 中提取 uuid。
 *
 * @param url @en The url to be converted. @zh 待转换的 url。
 * @returns @en The uuid extracted from url. @zh url 转换为的 uuid。
 *
 * @example
 * var url = 'res/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
 * var uuid = getUuidFromURL(url); // fc991dd7-0033-4b80-9d41-c8a86a702e59
 */
export declare function getUuidFromURL(url: string): string;
/**
 * @en
 * Transforms uuid to url.
 *
 * @zh
 * 转换 uuid 为 url。
 *
 * @param uuid @en The uuid of asset. @zh 资源的 uuid。
 * @param options @en Some optional parameters. @zh 一些可选参数。
 * @param options.isNative @en Indicates whether the path you want is a native resource path. @zh 需要转换的路径是否是原生资源路径。
 * @param options.nativeExt @en Extension of the native resource path, it is required when isNative is true. @zh 原生资源路径的扩展名，如果 `isNative` 为 true，则需要。
 * @returns @en The url converted from uuid. @zh 从 uuid 转换而来的 url.
 *
 * @example
 * // json path, 'assets/main/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
 * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: false});
 *
 * // png path, 'assets/main/native/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.png';
 * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: true, nativeExt: '.png'});
 *
 */
export declare function getUrlWithUuid(uuid: string, options?: {
    [k: string]: any;
    isNative: boolean;
    nativeExt?: string;
} | null): string;
/**
 * @en
 * Checks if the type of asset is scene.
 *
 * @zh
 * 检查资源类型是否是场景。
 *
 * @param asset @en The asset to be checked. @zh 待检查的资源。
 * @returns @en Whether or not the asset is a SceneAsset. @zh 此资源是否是场景资源。
 *
 */
export declare function isScene(asset: any): boolean;
/**
 * @en
 * Normalizes url, strip './' and '/'.
 *
 * @zh
 * 标准化 url ，去除 './' 和 '/'。
 *
 * @param url @en The url to be normalized. @zh 待标准化的 url。
 * @returns @en The normalized url. @zh 标准化后的 url。
 */
export declare function normalize(url: string): string;
export declare function transform(input: string | string[] | Record<string, any> | Array<Record<string, any>>, options?: Record<string, any> | null): string | string[];
