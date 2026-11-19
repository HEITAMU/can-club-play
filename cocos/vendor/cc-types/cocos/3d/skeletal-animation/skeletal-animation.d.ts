import { SkinnedMeshRenderer } from '../skinned-mesh-renderer';
import { Node } from '../../scene-graph/node';
import { AnimationClip } from '../../animation/animation-clip';
import { Animation } from '../../animation/animation-component';
import { SkeletalAnimationState } from './skeletal-animation-state';
import type { AnimationState } from '../../animation/animation-state';
/**
 * @en The socket to synchronize transform from skeletal joint to target node.
 * @zh 骨骼动画的挂点，用于将骨骼树的挂点节点变化矩阵同步到目标节点上
 */
export declare class Socket {
    /**
     * @en Path of the target joint.
     * @zh 此挂点的目标骨骼路径。
     */
    path: string;
    /**
     * @en Transform output node.
     * @zh 此挂点的变换信息输出节点。
     */
    target: Node | null;
    constructor(path?: string, target?: Node | null);
}
/**
 * @en
 * Skeletal animation component, offers the following features on top of [[Animation]]:
 * * Choice between baked animation and real-time calculation, to leverage efficiency and expressiveness.
 * * Joint socket system: Create any socket node directly under the animation component root node,
 *   find your target joint and register both to the socket list, so that the socket node would be in-sync with the joint.
 * @zh
 * 骨骼动画组件，在普通动画组件基础上额外提供以下功能：
 * * 可选预烘焙动画模式或实时计算模式，用以权衡运行时效率与效果；
 * * 提供骨骼挂点功能：通过在动画根节点下创建挂点节点，并在骨骼动画组件上配置 socket 列表，挂点节点的 Transform 就能与骨骼保持同步。
 */
export declare class SkeletalAnimation extends Animation {
    static Socket: typeof Socket;
    /**
     * @en
     * The joint sockets this animation component maintains.<br>
     * Sockets have to be registered here before attaching custom nodes to animated joints.
     * @zh
     * 当前动画组件维护的挂点数组。要挂载自定义节点到受动画驱动的骨骼上，必须先在此注册挂点。
     */
    get sockets(): Socket[];
    set sockets(val: Socket[]);
    /**
     * @en
     * Whether to bake animations. Default to true,<br>
     * which substantially increases performance while making all animations completely fixed.<br>
     * Dynamically changing this property will take effect when playing the next animation clip.
     * Note, in editor(not in preview) mode, this option takes no effect: animation is always non-baked.
     * @zh
     * 是否使用预烘焙动画，默认启用，可以大幅提高运行效时率，但所有动画效果会被彻底固定，不支持任何形式的编辑和混合。<br>
     * 运行时动态修改此选项会在播放下一条动画片段时生效。
     * 注意，在编辑器（非预览）模式下，此选项不起作用：动画总是非预烘焙的。
     */
    get useBakedAnimation(): boolean;
    set useBakedAnimation(value: boolean);
    protected _useBakedAnimation: boolean;
    protected _sockets: Socket[];
    onLoad(): void;
    onDestroy(): void;
    onEnable(): void;
    onDisable(): void;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    /**
     * @en Query all socket paths
     * @zh 获取所有挂点的骨骼路径
     * @returns @en All socket paths @zh 所有挂点的骨骼路径
     */
    querySockets(): string[];
    /**
     * @en Rebuild animations to synchronize immediately all sockets to their target node.
     * @zh 重建动画并立即同步所有挂点的转换矩阵到它们的目标节点上。
     */
    rebuildSocketAnimations(): void;
    /**
     * @en Create or get the target node from a socket.
     * If a socket haven't been created for the corresponding path, this function will register a new socket.
     * @zh 创建或获取一个挂点的同步目标节点。
     * 如果对应路径还没有创建挂点，这个函数会创建一个新的挂点。
     * @param path @en Path of the target joint. @zh 此挂点的骨骼路径。
     * @returns @en The target node of the socket. @zh 挂点的目标节点
     */
    createSocket(path: string): Node | null;
    /**
     * @internal This method only friends to skinned mesh renderer.
     */
    notifySkinnedMeshAdded(skinnedMeshRenderer: SkinnedMeshRenderer): void;
    /**
     * @internal This method only friends to skinned mesh renderer.
     */
    notifySkinnedMeshRemoved(skinnedMeshRenderer: SkinnedMeshRenderer): void;
    /**
     * Get all users.
     * @internal This method only friends to the skeleton animation state.
     */
    getUsers(): Set<SkinnedMeshRenderer>;
    protected _createState(clip: AnimationClip, name?: string): SkeletalAnimationState;
    protected _doCreateState(clip: AnimationClip, name: string): SkeletalAnimationState;
    protected doPlayOrCrossFade(state: AnimationState, duration: number): void;
    private _users;
    private _currentBakedState;
    private _removeAllUsers;
    private get _useBakedEffectively();
    private _applyBakeFlagChange;
    private _setSkeletonTransformEnabled;
}
