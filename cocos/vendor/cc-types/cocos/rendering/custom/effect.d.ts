import { GraphColor, MutableVertexPropertyMap } from './graph';
export declare class VectorGraphColorMap implements MutableVertexPropertyMap<GraphColor> {
    constructor(sz: number);
    get(u: number): GraphColor;
    put(u: number, value: GraphColor): void;
    readonly colors: Array<GraphColor>;
}
