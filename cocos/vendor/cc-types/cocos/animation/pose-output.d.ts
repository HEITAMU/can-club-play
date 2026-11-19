import { BlendStateBuffer, BlendingPropertyName, BlendStateWriter } from '../3d/skeletal-animation/skeletal-animation-blending';
import type { Node } from '../scene-graph';
export type Pose = BlendStateBuffer;
export declare class PoseOutput {
    weight: number;
    constructor(pose: Pose);
    destroy(): void;
    createPoseWriter(node: Node, property: BlendingPropertyName, constants: boolean): BlendStateWriter<BlendingPropertyName>;
    private _pose;
    private _blendStateWriters;
}
