import { PoseGraphCreateNodeFactory, PoseGraphNodeAppearanceOptions } from '../foundation/authoring/node-authoring';
export type { PoseGraphCreateNodeContext, PoseGraphCreateNodeEntry, PoseGraphCreateNodeFactory, PoseGraphNodeEditorMetadata, PoseGraphNodeAppearanceOptions, } from '../foundation/authoring/node-authoring';
export declare const poseGraphNodeCategory: (category: string) => ClassDecorator;
export declare const poseGraphCreateNodeFactory: (factory: PoseGraphCreateNodeFactory<any>) => ClassDecorator;
export declare const poseGraphNodeHide: (hide?: boolean) => ClassDecorator;
export declare const poseGraphNodeAppearance: (appearance: Readonly<PoseGraphNodeAppearanceOptions>) => ClassDecorator;
