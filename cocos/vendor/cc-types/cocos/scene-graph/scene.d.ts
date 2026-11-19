import { RenderScene } from '../render-scene/core/render-scene';
import { Node } from './node';
import { Component } from './component';
import { SceneGlobals } from './scene-globals';
/**
 * @en
 * Scene is a subclass of [[Node]], composed by nodes, representing the root of a runnable environment in the game.
 * It's managed by [[Director]] and user can switch from a scene to another using [[Director.loadScene]]
 * @zh
 * Scene 是 [[Node]] 的子类，由节点所构成，代表着游戏中可运行的某一个整体环境。
 * 它由 [[Director]] 管理，用户可以使用 [[Director.loadScene]] 来切换场景
 */
export declare class Scene extends Node {
    /**
     * @en The renderer scene, normally user don't need to use it
     * @zh 渲染层场景，一般情况下用户不需要关心它
     */
    get renderScene(): RenderScene | null;
    get globals(): SceneGlobals;
    /**
     * @en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
     * @zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
     */
    autoReleaseAssets: boolean;
    /**
     * @en Per-scene level rendering info
     * @zh 场景级别的渲染信息
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _globals: SceneGlobals;
    dependAssets: null;
    protected _renderScene: RenderScene | null;
    protected _inited: boolean;
    protected _prefabSyncedInLiveReload: boolean;
    protected _updateScene(): void;
    constructor(name: string);
    /**
     * @en Destroy the current scene and all its nodes, this action won't destroy related assets
     * @zh 销毁当前场景中的所有节点，这个操作不会销毁资源
     */
    destroy(): boolean;
    /**
     * @en Only for compatibility purpose, user should not add any component to the scene
     * @zh 仅为兼容性保留，用户不应该在场景上直接添加任何组件
     */
    addComponent(...args: any[]): Component;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onHierarchyChanged(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onPostActivated(active: boolean): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onBatchCreated(dontSyncChildPrefab: boolean): void;
    /**
     * @en
     * Refer to [[Node.updateWorldTransform]]
     * @zh
     * 参考 [[Node.updateWorldTransform]]
     */
    updateWorldTransform(): void;
    protected _instantiate(cloned?: Node | null, isSyncedNode?: boolean): Node;
    /**
     * @engineInternal
     * @mangle
     */
    _load(): void;
    /**
     * @engineInternal
     * @mangle
     */
    _activate(active?: boolean): void;
}
