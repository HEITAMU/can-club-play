import { Asset } from '../assets/asset';
import { Node, Scene } from '../../scene-graph';
export declare class ReleaseManager {
    private _persistNodeDeps;
    private _toDelete;
    private _eventListener;
    private _dontDestroyAssets;
    addIgnoredAsset(asset: Asset): void;
    init(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _addPersistNodeRef(node: Node): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _removePersistNodeRef(node: Node): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _autoRelease(oldScene: Scene, newScene: Scene, persistNodes: Record<string, Node>): void;
    tryRelease(asset: Asset, force?: boolean): void;
    private _freeAssets;
    private _free;
}
export declare const releaseManager: ReleaseManager;
