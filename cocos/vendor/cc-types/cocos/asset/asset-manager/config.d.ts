/// <reference types="./@types/globals" />
import { Asset } from '../assets';
import Cache from './cache';
export interface IConfigOption {
    importBase: string;
    nativeBase: string;
    base: string;
    name: string;
    deps: string[];
    uuids: string[];
    paths: Record<string, any[]>;
    scenes: Record<string, string>;
    packs: Record<string, string[]>;
    versions: {
        import: string[];
        native: string[];
    };
    redirect: string[];
    debug: boolean;
    types: string[];
    extensionMap: Record<string, string[]>;
}
/**
 * @en Th asset's meta information. Used to obtain information about the asset.
 * @zh 资源的元信息。用于获取资源的相关信息。
 */
export interface IAssetInfo {
    /**
     * @en The uuid of asset.
     * @zh 资源的 uuid.
     */
    uuid: string;
    /**
     * @en Information about the file where the asset is located. A asset can be in multiple merged files.
     * @zh 资源所在文件的相关信息。一个资源可在多个合并文件中。
     */
    packs?: IPackInfo[];
    /**
     * @en The redirect bundle of this asset. When multiple bundles with different priorities reference to the same asset,
     * the asset will be stored in the bundle with the higher priority first, while the other bundles will store a record
     * and the `redirect` property of that record will point to the bundle that actually stores the resource.
     * @zh 资源所重定向的 bundle。当多个 bundle 引用同一份资源，且优先级不一样时，资源会优先存储在优先级高的 bundle 中，
     * 其他 bundle 则会存储一条记录，并且该记录的 redirect 属性将指向真实存储此资源的 bundle。
     */
    redirect?: string;
    /**
     * @en The version of the asset.
     * @zh 资源的版本号。
     */
    ver?: string;
    /**
     * @en The version of the native dependency of the asset.
     * @zh 资源的原生依赖的版本号。
     */
    nativeVer?: string;
    /**
     * @en The extension of the asset, or 'json' if it is null.
     * This property is used to mark assets with special extensions like 'CCON'.
     * @zh 资源的原生依赖的版本号。
     */
    extension?: string;
}
/**
 * @en Information about the merged files.
 * @zh 合并文件的信息。
 */
export interface IPackInfo {
    /**
     * @en The unique id of this merged file.
     * @zh 此合并文件的唯一 id.
     */
    uuid: string;
    /**
     * @en The uuid of all the assets contained in this file.
     * @zh 此文件中包含的所有资源的 uuid。
     */
    packedUuids: string[];
    /**
     * @en The extension of this merged file on the file system, default is 'json'.
     * @zh 此合并文件在文件系统上的扩展名，默认为 'json'.
     */
    ext: string;
}
/**
 * @en Addressable asset information, you can look up the path of the asset in the project and the type of the asset.
 * @zh 可寻址资源的信息，你可以查询到该资源在项目中的路径与资源的类型。
 */
export interface IAddressableInfo extends IAssetInfo {
    /**
     * @en The relative path of this asset in the project relative to the bundle folder.
     * @zh 此资源在项目中相对于 bundle 文件夹的相对路径。
     */
    path: string;
    /**
     * @en The type of the asset.
     * @zh 此资源的类型。
     */
    ctor: Constructor<Asset>;
}
/**
 * @en Information about the scene asset.
 * @zh 场景资源的相关信息。
 */
export interface ISceneInfo extends IAssetInfo {
    /**
     * @en The path of the scene asset in the project relative to the bundle folder.
     * @zh 场景资源在项目中相对 bundle 文件夹的路径。
     */
    url: string;
}
export default class Config {
    name: string;
    base: string;
    importBase: string;
    nativeBase: string;
    deps: string[] | null;
    assetInfos: Cache<IAssetInfo>;
    scenes: Cache<ISceneInfo>;
    paths: Cache<IAddressableInfo[]>;
    init(options: IConfigOption): void;
    getInfoWithPath(path: string, type?: Constructor<Asset> | null): IAddressableInfo | null;
    getDirWithPath(path: string, type?: Constructor<Asset> | null, out?: IAddressableInfo[]): IAddressableInfo[];
    getAssetInfo(uuid: string): IAssetInfo | null;
    getSceneInfo(name: string): ISceneInfo | null;
    destroy(): void;
    private _initUuid;
    private _initPath;
    private _initScene;
    private _initPackage;
    private _initVersion;
    private _initRedirect;
}
