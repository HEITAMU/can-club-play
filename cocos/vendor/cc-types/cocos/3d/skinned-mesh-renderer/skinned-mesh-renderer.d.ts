import type { AnimationClip } from '../../animation/animation-clip';
import { Material } from '../../asset/assets';
import { Skeleton } from '../assets/skeleton';
import { Node } from '../../scene-graph/node';
import { MeshRenderer } from '../framework/mesh-renderer';
import type { SkeletalAnimation } from '../skeletal-animation';
import { SkinningModel } from '../models/skinning-model';
import { BakedSkinningModel } from '../models/baked-skinning-model';
/**
 * @en The skinned mesh renderer component.
 * @zh 蒙皮网格渲染器组件。
 */
export declare class SkinnedMeshRenderer extends MeshRenderer {
    protected _skeleton: Skeleton | null;
    protected _skinningRoot: Node | null;
    protected _clip: AnimationClip | null;
    /**
     * @en The skeleton asset.
     * @zh 骨骼资源。
     */
    get skeleton(): Skeleton | null;
    set skeleton(val: Skeleton | null);
    /**
     * @en The skinning root. (The node where the controlling Animation is located)
     * @zh 骨骼根节点的引用，对应控制此模型的动画组件所在节点。
     */
    get skinningRoot(): Node | null;
    set skinningRoot(value: Node | null);
    get model(): SkinningModel | BakedSkinningModel | null;
    /**
     * Set associated animation.
     * @internal This method only friends to skeletal animation component.
     */
    associatedAnimation: SkeletalAnimation | null;
    constructor();
    onLoad(): void;
    onDestroy(): void;
    uploadAnimation(clip: AnimationClip | null): void;
    /**
     * Set if bake mode should be used.
     * @internal This method only friends to skeletal animation component.
     */
    setUseBakedAnimation(val?: boolean, force?: boolean): void;
    setSharedMaterial(material: Material | null, index: number): void;
    protected _updateModelParams(): void;
    private _tryBindAnimation;
    private _update;
}
