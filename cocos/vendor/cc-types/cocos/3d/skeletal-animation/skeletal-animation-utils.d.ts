import type { AnimationClip } from '../../animation/animation-clip';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { geometry, Mat4 } from '../../core';
import { Format, Device, Buffer } from '../../gfx';
import { Node } from '../../scene-graph';
import { ITextureBufferHandle } from '../../render-scene/core/texture-buffer-pool';
import { jointTextureSamplerInfo } from '../misc/joint-texture-sampler-info';
export declare const uploadJointData: typeof uploadJointDataLBS;
export declare const MINIMUM_JOINT_TEXTURE_SIZE: number;
export declare function selectJointsMediumFormat(device: Device): Format;
declare function uploadJointDataLBS(out: Float32Array, base: number, mat: Readonly<Mat4>, firstBone: boolean): void;
export { jointTextureSamplerInfo };
interface IInternalJointAnimInfo {
    downstream?: Mat4;
    curveData?: Mat4[];
    bindposeIdx: number;
    bindposeCorrection?: Mat4;
}
export interface IJointTextureHandle {
    pixelOffset: number;
    refCount: number;
    clipHash: number;
    skeletonHash: number;
    readyToBeDeleted: boolean;
    handle: ITextureBufferHandle;
    bounds: Map<number, geometry.AABB[]>;
    animInfos?: IInternalJointAnimInfo[];
}
export interface IChunkContent {
    skeleton: number;
    clips: number[];
}
export interface ICustomJointTextureLayout {
    textureLength: number;
    contents: IChunkContent[];
}
/**
 * The pool for joint textures.
 * @internal
 */
export declare class JointTexturePool {
    private _device;
    private _pool;
    private _textureBuffers;
    private _formatSize;
    private _pixelsPerJoint;
    private _customPool;
    private _chunkIdxMap;
    get pixelsPerJoint(): number;
    constructor(device: Device);
    clear(): void;
    registerCustomTextureLayouts(layouts: ICustomJointTextureLayout[]): void;
    /**
     * @en
     * Get joint texture for the default pose.
     * @zh
     * 获取默认姿势的骨骼贴图。
     */
    getDefaultPoseTexture(skeleton: Skeleton, mesh: Mesh, skinningRoot: Node): IJointTextureHandle | null;
    /**
     * @en
     * Get joint texture for the specified animation clip.
     * @zh
     * 获取指定动画片段的骨骼贴图。
     */
    getSequencePoseTexture(skeleton: Skeleton, clip: AnimationClip, mesh: Mesh, skinningRoot: Node): IJointTextureHandle | null;
    releaseHandle(handle: IJointTextureHandle): void;
    releaseSkeleton(skeleton: Skeleton): void;
    releaseAnimationClip(clip: AnimationClip): void;
    private _createAnimInfos;
}
export interface IAnimInfo {
    buffer: Buffer;
    data: Float32Array;
    dirty: boolean;
    dirtyForJSB: Uint8Array;
    currentClip: AnimationClip | null;
}
export declare class JointAnimationInfo {
    private _pool;
    private _device;
    constructor(device: Device);
    getData(nodeID?: string): IAnimInfo;
    destroy(nodeID: string): void;
    switchClip(info: IAnimInfo, clip: AnimationClip | null): IAnimInfo;
    clear(): void;
}
