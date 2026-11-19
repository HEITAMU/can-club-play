import { Motion } from '../../motion/motion';
import { EnterNodeInfo } from '../foundation/authoring/enter-node-info';
import { PoseGraphCreateNodeFactory } from '../decorator/node';
import { PoseNode } from '../pose-node';
export {};
export declare function getEnterInfo(this: {
    motion: Motion | null;
}): EnterNodeInfo | undefined;
type CreateNodeArg = {
    type: 'clip-motion';
} | {
    type: 'animation-blend-1d' | 'animation-blend-2d';
};
export declare function makeCreateNodeFactory(create_: (motion: Motion | null) => PoseNode): PoseGraphCreateNodeFactory<CreateNodeArg>;
export declare function getTileBase(titleI18nKey: string, motion: Motion | null): [string, Record<string, string>] | undefined;
