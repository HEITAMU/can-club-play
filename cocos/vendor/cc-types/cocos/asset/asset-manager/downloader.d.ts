import downloadDomImage from './download-dom-image';
import downloadFile from './download-file';
import downloadScript from './download-script';
import type { AssetManager } from './asset-manager';
export type DownloadHandler = (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void;
/**
 * @en
 * Manages all download process, it is a singleton.
 * You can access it via [[AssetManager.downloader]], It can download various types of files.
 *
 * @zh
 * 管理所有下载过程，downloader 是个单例，你能通过 [[AssetManager.downloader]] 访问它，它能下载各种类型的文件。
 *
 */
export declare class Downloader {
    /**
     * @en Global singleton for [[Downloader]]. You can access it via [[AssetManager.downloader]].
     * @zh [[Downloader]] 的全局单例. 你可以通过 [[AssetManager.downloader]] 访问.
     */
    static get instance(): Downloader;
    /**
     * @en
     * The maximum number of concurrent when downloading.
     *
     * @zh
     * 下载时的最大并发数。
     */
    maxConcurrency: number;
    /**
     * @en
     * The maximum number of request can be launched per frame when downloading.
     *
     * @zh
     * 下载时每帧可以启动的最大请求数。
     *
     */
    maxRequestsPerFrame: number;
    /**
     * @en
     * The address of remote server.
     *
     * @zh
     * 远程服务器地址。
     *
     */
    get remoteServerAddress(): string;
    /**
     * @en
     * The max number of retries when fail.
     *
     * @zh
     * 失败重试次数。
     *
     */
    maxRetryCount: number;
    /**
     * Whether to automatically add a timestamp after the url.
     * This function is mainly used to prevent the browser from using cache in editor mode.
     * You don't need to change it at runtime.
     * @internal
     */
    appendTimeStamp: boolean;
    /**
     * @engineInternal
     */
    limited: boolean;
    /**
     * @en
     * Wait for while before another retry, unit: ms.
     *
     * @zh
     * 重试的间隔时间，单位为毫秒。
     *
     */
    retryInterval: number;
    /**
     * @en Version information of all bundles.
     * @zh 所有包的版本信息。
     */
    bundleVers: Record<string, string>;
    /**
     * @en The names of remote bundles.
     * @zh 远程包名列表。
     */
    remoteBundles: ReadonlyArray<string>;
    /**
     * @deprecated Since v3.7, this is an engine internal interface. You can easily implement the functionality of this API using HTMLImageElement.
     */
    downloadDomImage: typeof downloadDomImage;
    /**
     * @deprecated Since v3.7, this is an engine internal interface. You can easily implement the functionality of this API using HTMLAudioElement.
     */
    downloadDomAudio: DownloadHandler | null;
    /**
     * @deprecated Since v3.7, this is an engine internal interface. You can easily implement the functionality of this API using XMLHttpRequest.
     */
    downloadFile: typeof downloadFile;
    /**
     * @deprecated Since v3.7, this is an engine internal interface. You can easily implement the functionality of this API using XMLHttpRequest.
     */
    downloadScript: typeof downloadScript;
    /**
     * @engineInternal
     */
    _downloadArrayBuffer: (url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: any) => void) => void;
    /**
     * @engineInternal
     */
    _downloadJson: (url: string, options: Record<string, any>, onComplete: (err: Error | null, data?: Record<string, any> | null | undefined) => void) => void;
    private _downloaders;
    private _downloading;
    private _queue;
    private _queueDirty;
    private _totalNum;
    private _totalNumThisPeriod;
    private _lastDate;
    private _checkNextPeriod;
    private _remoteServerAddress;
    private _maxInterval;
    private static _instance;
    /**
     * @engineInternal
     */
    init(remoteServerAddress?: string, bundleVers?: Record<string, string>, remoteBundles?: string[]): void;
    /**
     * @engineInternal
     */
    get handlers(): Record<string, DownloadHandler>;
    /**
     * @en
     * Register custom handler if you want to change default behavior or extend downloader to download other format file.
     *
     * @zh
     * 当你想修改默认行为或者拓展 downloader 来下载其他格式文件时可以注册自定义的 handler。
     *
     * @param type
     * @en Extension name likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}.
     * @zh 扩展名，或者形如 {'.jpg': jpgHandler, '.png': pngHandler} 的映射表。
     * @param handler @en Customized handling for this extension. @zh 针对此扩展名的自定义的处理方法。
     * @param handler.url @en The url to be downloaded. @zh 待下载的 url.
     * @param handler.options @en Some optional parameters will be transferred to handler. @zh 传递到处理方法的可选参数。
     * @param handler.onComplete
     * @en Callback when finishing downloading. You need to call this method manually and pass in the execution result after the custom handler
     * is executed.
     * @zh 完成下载后的回调。你需要在自定义处理方法执行完后手动调用此方法，并将执行结果传入。
     *
     * @example
     * downloader.register('.tga', (url, options, onComplete) => onComplete(null, null));
     * downloader.register({'.tga': (url, options, onComplete) => onComplete(null, null),
     *                      '.ext': (url, options, onComplete) => onComplete(null, null)});
     *
     */
    register(type: string, handler: (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void): void;
    register(map: Record<string, (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void>): void;
    /**
     * @en
     * Use corresponding handler to download file under limitation.
     *
     * @zh
     * 在限制下使用对应的 handler 来下载文件。
     *
     * @param id @en The unique id of this download. @zh 本次下载的唯一 id.
     * @param url @en The url should be downloaded. @zh 待下载的 url。
     * @param type @en The type indicates that which handler should be used to download, such as '.jpg'. @zh 要使用的处理方法的类型，例如 '.jpg'。
     * @param options @en Some optional parameters will be transferred to the corresponding handler. @zh 传递到处理方法的一些可选参数。
     * @param options.onFileProgress @en Progressive callback will be transferred to handler. @zh 传递到处理方法的进度回调。
     * @param options.maxRetryCount @en How many times should retry when download failed. @zh 下载失败后的重试数量。
     * @param options.maxConcurrency @en The maximum number of concurrent when downloading. @zh 下载的最大并行数。
     * @param options.maxRequestsPerFrame @en The maximum number of request can be launched per frame when downloading. @zh 每帧能发起的最大请求数量，在下载时。
     * @param options.priority @en The priority of this url, default is 0, the greater number is higher priority. @zh 下载的优先级，值越大优先级越高。
     * @param onComplete @en Callback when finishing downloading. @zh 完成下载后的回调。
     * @param onComplete.err @en The occurred error, null indicates success. @zh 下载过程中出现的错误，如果为 null 则表明下载成功。
     * @param onComplete.content @en The downloaded file. @zh 下载下来的文件内容。
     *
     * @example
     * download('http://example.com/test.tga', '.tga', { onFileProgress: (loaded, total) => console.log(loaded/total) },
     *      onComplete: (err) => console.log(err));
     */
    download(id: string, url: string, type: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)): void;
    /**
     * @en Load sub package with name.
     * @zh 通过子包名加载子包。
     * @param name @en Sub package name. @zh 子包名称。
     * @param completeCallback @en Callback invoked when sub package loaded. @zh 子包加载完成后的回调。
     * @param completeCallback.error @en Error information. Will be null if loaded successfully. @zh 错误信息。如果加载成功则为 null。
     *
     * @deprecated loader.downloader.loadSubpackage is deprecated, please use AssetManager.loadBundle instead.
     */
    loadSubpackage(name: string, completeCallback?: ((err?: Error | null) => void)): void;
    private constructor();
    private _updateTime;
    private _handleQueue;
    private _handleQueueInNextFrame;
}
declare const _default: AssetManager.Downloader;
export default _default;
