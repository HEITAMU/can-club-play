import { Color } from '../../core';
import { RenderData } from '../renderer/render-data';
import { IBatcher } from '../renderer/i-batcher';
import { Node } from '../../scene-graph/node';
export declare function fillMeshVertices3D(node: Node, renderer: IBatcher, renderData: RenderData | null, color: Color): void;
export declare function updateOpacity(renderData: RenderData, opacity: number): void;
