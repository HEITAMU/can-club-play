import * as VertexFormat from './vertex-format';
import { Batcher2D } from './batcher-2d';
import { DrawBatch2D } from './draw-batch';
import { MeshRenderData } from './render-data';
import { Attribute } from '../../gfx/base/define';
export { VertexFormat as UIVertexFormat };
export { Batcher2D as UI };
export { UIDrawBatch };
/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 * @internal
 */
declare class UIDrawBatch extends DrawBatch2D {
}
export declare class QuadRenderData extends MeshRenderData {
    constructor(vertexFormat: Attribute[]);
}
