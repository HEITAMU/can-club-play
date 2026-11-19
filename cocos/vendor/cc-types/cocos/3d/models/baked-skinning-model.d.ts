import type { AnimationClip } from '../../animation/animation-clip';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { Attribute, DescriptorSet } from '../../gfx';
import { Node } from '../../scene-graph';
import { IMacroPatch } from '../../render-scene/core/pass';
import { IJointTextureHandle } from '../skeletal-animation/skeletal-animation-utils';
import { MorphModel } from './morph-model';
import { SubModel } from '../../render-scene/scene';
/**
 * @en
 * The skinning model that is using GPU baked animation.
 * @zh
 * GPU 预烘焙动画的蒙皮模型。
 */
export declare class BakedSkinningModel extends MorphModel {
    /**
     * @en The animation clip that have been uploaded
     * @zh 已被上传的动画片段
     */
    uploadedAnim: AnimationClip | null | undefined;
    private _jointsMedium;
    private _skeleton;
    private _mesh;
    private _dataPoolManager;
    private _instAnimInfoIdx;
    constructor();
    destroy(): void;
    bindSkeleton(skeleton?: Skeleton | null, skinningRoot?: Node | null, mesh?: Mesh | null): void;
    updateTransform(stamp: number): void;
    updateUBOs(stamp: number): boolean;
    getMacroPatches(subModelIndex: number): IMacroPatch[] | null;
    /**
     * @en Pre-simulate and store the frames data of the given animation clip to a joint texture and upload it to GPU.
     * Normally, it's automatically managed by [[SkeletalAnimationState]].
     * But user can also use Joint Texture Layout Settings in the editor to manually organize the joint textures.
     * @zh 预计算并存储一个指定动画片段的完整帧数据到一张骨骼贴图上，并将其上传到 GPU。
     * 一般情况下 [[SkeletalAnimationState]] 会自动管理所有骨骼贴图，但用户也可以使用编辑器的骨骼贴图布局设置面板来手动管理所有骨骼贴图。
     * @param anim @en The animation clip to be uploaded to the joint texture. @zh 需要上传到骨骼贴图上的动画片段。
     * @returns void
     */
    uploadAnimation(anim: AnimationClip | null): void;
    protected _applyJointTexture(texture?: IJointTextureHandle | null): void;
    protected _updateLocalDescriptors(submodelIdx: number, descriptorSet: DescriptorSet): void;
    protected _updateInstancedAttributes(attributes: Attribute[], subModel: SubModel): void;
    private updateInstancedJointTextureInfo;
}
