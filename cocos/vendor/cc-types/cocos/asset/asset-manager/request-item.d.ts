import Config, { IAssetInfo } from './config';
/**
 * @en
 * A collection of information about a request.
 *
 * @zh
 * 请求的相关信息集合。
 *
 */
export default class RequestItem {
    /**
     * @en
     * The id of request, combined from uuid and isNative.
     *
     * @zh
     * 请求的 id, 由 uuid 和 isNative 组合而成。
     */
    get id(): string;
    /**
     * @engineInternal
     * @mangle
     */
    static MAX_DEAD_NUM: number;
    /**
     * @en
     * Create a new request item from pool.
     *
     * @zh
     * 从对象池中创建 requestItem。
     *
     * @returns @en return a newly created RequestItem. @zh 返回一个刚创建的 `RequestItem`。
     *
     */
    static create(): RequestItem;
    private static _deadPool;
    /**
     * @en
     * The uuid of request.
     *
     * @zh
     * 所请求资源的 uuid。
     *
     */
    uuid: string;
    /**
     * @engineInternal only used for L10N asset replacement.
     */
    overrideUuid: string;
    /**
     * @en
     * The final url of request.
     *
     * @zh
     * 请求的最终 url。
     *
     */
    url: string;
    /**
     * @en
     * The extension name of asset.
     *
     * @zh
     * 资源的扩展名。
     *
     */
    ext: string;
    /**
     * @en
     * The content of asset.
     *
     * @zh
     * 资源的内容。
     *
     */
    content: any;
    /**
     * @en
     * The file of asset.
     *
     * @zh
     * 资源的文件。
     *
     */
    file: any;
    /**
     * @en
     * The information of asset.
     *
     * @zh
     * 资源的相关信息。
     *
     */
    info: IAssetInfo | null;
    /**
     * @engineInternal
     */
    config: Config | null;
    /**
     * @en
     * Whether or not it is native asset.
     *
     * @zh
     * 资源是否是原生资源。
     *
     */
    isNative: boolean;
    /**
     * @en
     * Custom options.
     *
     * @zh
     * 自定义参数。
     *
     */
    options: Record<string, any>;
    private _id;
    /**
     * @en
     * Recycle this to be reused.
     *
     * @zh
     * 回收 requestItem 用于复用。
     *
     */
    recycle(): void;
}
