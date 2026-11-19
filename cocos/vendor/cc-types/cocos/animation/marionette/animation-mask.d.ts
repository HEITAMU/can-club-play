import type { Node } from '../../scene-graph/node';
import { Asset } from '../../asset/assets/asset';
interface JointMaskInfo {
    readonly path: string;
    enabled: boolean;
}
export declare class AnimationMask extends Asset {
    private _jointMasks;
    get joints(): Iterable<JointMaskInfo>;
    set joints(value: Iterable<JointMaskInfo>);
    /**
     * @zh 添加一个关节遮罩项。
     * 已存在的相同路径的关节遮罩项会被替换为新的。
     * @en Add a joint mask item.
     * Already existing joint mask with same path item will be replaced.
     * @param path @zh 关节的路径。 @en The joint's path.
     * @param enabled @zh 是否启用该关节。 @en Whether to enable the joint.
     */
    addJoint(path: string, enabled: boolean): void;
    removeJoint(removal: string): void;
    clear(): void;
    filterDisabledNodes(root: Node): Set<Node>;
    isExcluded(path: string): boolean;
}
type JointMaskInfo_ = JointMaskInfo;
export declare namespace AnimationMask {
    type JointMaskInfo = JointMaskInfo_;
}
export {};
