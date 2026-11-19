import RequestItem from './request-item';
export type Unpacker = (packUuid: string[], data: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void;
/**
 * @en
 * Handle the packed asset, include unpacking, loading, cache and so on. It is a singleton. All member can be accessed with `assetManager.packManager`
 *
 * @zh
 * 处理打包资源，包括拆包，加载，缓存等等，这是一个单例, 所有成员能通过 `assetManager.packManager` 访问
 *
 */
export declare class PackManager {
    private _loading;
    private _unpackers;
    /**
     * @en
     * Unpack the json, revert to what it was before packing
     *
     * @zh
     * 拆解 json 包，恢复为打包之前的内容
     *
     * @param pack - The pack
     * @param json - The content of pack
     * @param options - Some optional parameters
     * @param onComplete - Callback when finish unpacking
     * @param onComplete.err - The occurred error, null indicates success
     * @param onComplete.content - The unpacked assets
     *
     * @example
     * downloader.downloadFile('pack.json', { xhrResponseType: 'json'}, null, (err, file) => {
     *      packManager.unpackJson(['a', 'b'], file, null, (err, data) => console.log(err));
     * });
     *
     */
    unpackJson(pack: string[], json: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: Record<string, any> | null) => void)): void;
    unpackBin(pack: string[], buffer: ArrayBuffer, options: Record<string, any>, onComplete: ((err: Error | null, data?: Record<string, any> | null) => void)): void;
    init(): void;
    /**
     * @en
     * Register custom handler if you want to change default behavior or extend packManager to unpack other format pack
     *
     * @zh
     * 当你想修改默认行为或者拓展 packManager 来拆分其他格式的包时可以注册自定义的 handler
     *
     * @param type - Extension likes '.bin' or map likes {'.bin': binHandler, '.ab': abHandler}
     * @param handler - handler
     * @param handler.packUuid - The uuid of pack
     * @param handler.data - The content of pack
     * @param handler.options - Some optional parameters
     * @param handler.onComplete - Callback when finishing unpacking
     *
     * @example
     * packManager.register('.bin', (packUuid, file, options, onComplete) => onComplete(null, null));
     * packManager.register({
     *  '.bin': (packUuid, file, options, onComplete) => onComplete(null, null),
     *  '.ab': (packUuid, file, options, onComplete) => onComplete(null, null),
     * });
     */
    register(type: string, handler: Unpacker): void;
    register(map: Record<string, Unpacker>): void;
    /**
     * @en
     * Use corresponding handler to unpack package
     *
     * @zh
     * 用对应的 handler 来进行解包
     *
     * @method unpack
     * @param pack - The uuid of packed assets
     * @param data - The packed data
     * @param type - The type indicates that which handler should be used to download, such as '.jpg'
     * @param options - Some optional parameter
     * @param onComplete - callback when finishing unpacking
     * @param onComplete.err -  The occurred error, null indicates success
     * @param onComplete.data - Original assets
     *
     * @example
     * downloader.downloadFile('pack.json', {xhrResponseType: 'json'}, null, (err, file) => {
     *      packManager.unpack(['2fawq123d', '1zsweq23f'], file, '.json', null, (err, data) => console.log(err));
     * });
     *
     */
    unpack(pack: string[], data: any, type: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)): void;
    /**
     * @en
     * Download request item, If item is not in any package, download as usual. Otherwise, download the corresponding package and unpack it.
     * And then retrieve the corresponding content form it.
     *
     * @zh
     * 下载请求对象，如果请求对象不在任何包内，则正常下载，否则下载对应的 package 并进行拆解，并取回包内对应的内容
     *
     * @param item - Some item you want to download
     * @param options - Some optional parameters
     * @param onComplete - Callback when finished
     * @param onComplete.err - The occurred error, null indicates success
     * @param onComplete.data - The unpacked data retrieved from package
     *
     * @example
     * var requestItem = AssetManager.RequestItem.create();
     * requestItem.uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
     * requestItem.info = config.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
     * packManager.load(requestItem, null, (err, data) => console.log(err));
     *
     */
    load(item: RequestItem, options: Record<string, any> | null, onComplete: ((err: Error | null, data?: any) => void)): void;
}
declare const _default: PackManager;
export default _default;
