import { VectorGraphColorMap } from './effect';
import { DefaultVisitor } from './graph';
import { LayoutGraphData } from './layout-graph';
import { BasicPipeline } from './pipeline';
import { RenderGraph, RasterView, ComputeView, ResourceGraph } from './render-graph';
declare class ResourceUseContext {
    readonly rasters: Map<number, RasterView>;
    computes: Map<number, [ComputeView[]]>;
}
declare class CompilerContext {
    set(pipeline: BasicPipeline, resGraph: ResourceGraph, renderGraph: RenderGraph, layoutGraph: LayoutGraphData): void;
    resourceGraph: ResourceGraph;
    pipeline: any;
    renderGraph: RenderGraph;
    layoutGraph: LayoutGraphData;
    resourceContext: Map<string, ResourceUseContext>;
}
export declare class Compiler {
    private _resourceGraph;
    private _pipeline;
    private _layoutGraph;
    private _visitor;
    constructor(pipeline: BasicPipeline, renderGraph: RenderGraph, resGraph: ResourceGraph, layoutGraph: LayoutGraphData);
    compile(rg: RenderGraph): void;
}
export declare class ResourceManagerVisitor extends DefaultVisitor {
    private _colorMap;
    private _resourceGraph;
    private _resVisitor;
    constructor(context: CompilerContext);
    get colorMap(): VectorGraphColorMap;
    discoverVertex(u: number, gv: ResourceGraph): void;
}
export {};
