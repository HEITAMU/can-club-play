import { IAssembler } from '../../../renderer/base';
import { Graphics } from '../../../components/graphics';
/**
 * graphics 组装器
 * 可通过 `UI.graphicsAssembler` 获取该组装器。
 */
export declare class GraphicsAssembler implements IAssembler {
    updateRenderData(graphics: Graphics): void;
    private getRenderData;
    stroke(graphics: Graphics): void;
    fill(graphics: Graphics): void;
    end(graphics: Graphics): void;
    private _expandStroke;
    private _expandFill;
    private _calculateJoins;
    private _flattenPaths;
    private _chooseBevel;
    private _buttCapStart;
    private _buttCapEnd;
    private _roundCapStart;
    private _roundCapEnd;
    private _roundJoin;
    private _bevelJoin;
    private _vSet;
}
export declare const graphicsAssembler: GraphicsAssembler;
