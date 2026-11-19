/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/
export declare const enum directional {
    undirected = 0,
    directed = 1,
    bidirectional = 2
}
export declare const enum parallel {
    disallow = 0,
    allow = 1
}
export declare const enum traversal {
    none = 0,
    incidence = 1,
    bidirectional = 2,
    adjacency = 4,
    vertex_list = 8,
    edge_list = 16
}
export interface Vertex {
    nullVertex(): Vertex | null;
}
export type vertex_descriptor = number | Vertex;
export interface Edge {
    getProperty(): unknown;
    source: vertex_descriptor;
    target: vertex_descriptor;
}
export declare class ED {
    constructor(source: vertex_descriptor, target: vertex_descriptor);
    equals(rhs: ED): boolean;
    source: vertex_descriptor;
    target: vertex_descriptor;
}
export declare class EPD {
    constructor(source: vertex_descriptor, target: vertex_descriptor, edge: Edge);
    equals(rhs: EPD): boolean;
    source: vertex_descriptor;
    target: vertex_descriptor;
    readonly edge: Edge;
}
export type edge_descriptor = ED | EPD;
export declare class OutE {
    constructor(target: vertex_descriptor);
    equals(rhs: OutE): boolean;
    target: vertex_descriptor;
}
export declare class OutEP {
    constructor(target: vertex_descriptor, edge: Edge);
    equals(rhs: OutEP): boolean;
    getProperty(): unknown;
    target: vertex_descriptor;
    readonly edge: Edge;
}
export declare class OutEI implements IterableIterator<ED> {
    constructor(iterator: IterableIterator<OutE>, source: vertex_descriptor);
    [Symbol.iterator](): OutEI;
    next(): IteratorResult<ED>;
    readonly iterator: IterableIterator<OutE>;
    readonly source: vertex_descriptor;
}
export declare class OutEPI implements IterableIterator<EPD> {
    constructor(iterator: IterableIterator<OutEP>, source: vertex_descriptor);
    [Symbol.iterator](): OutEPI;
    next(): IteratorResult<EPD>;
    readonly iterator: IterableIterator<OutEP>;
    readonly source: vertex_descriptor;
}
export type out_edge_iterator = OutEI | OutEPI;
export declare class InEI implements IterableIterator<ED> {
    constructor(iterator: IterableIterator<OutE>, source: vertex_descriptor);
    [Symbol.iterator](): InEI;
    next(): IteratorResult<ED>;
    readonly iterator: IterableIterator<OutE>;
    readonly source: vertex_descriptor;
}
export declare class InEPI implements IterableIterator<EPD> {
    constructor(iterator: IterableIterator<OutEP>, source: vertex_descriptor);
    [Symbol.iterator](): InEPI;
    next(): IteratorResult<EPD>;
    readonly iterator: IterableIterator<OutEP>;
    readonly source: vertex_descriptor;
}
export type in_edge_iterator = InEI | InEPI;
export interface Graph {
    readonly N: number | null;
}
export interface IncidenceGraph extends Graph {
    edge(u: vertex_descriptor, v: vertex_descriptor): boolean;
    source(e: edge_descriptor): vertex_descriptor;
    target(e: edge_descriptor): vertex_descriptor;
    /** Return out edge iterator of the vertex */
    oe(v: vertex_descriptor): out_edge_iterator;
    /** Return out degree of the vertex */
    od(v: vertex_descriptor): number;
}
export interface BidirectionalGraph extends IncidenceGraph {
    /** Return in edge iterator of the vertex */
    ie(v: vertex_descriptor): in_edge_iterator;
    /** Return in degree of the vertex */
    id(v: vertex_descriptor): number;
    /** Return degree of the vertex */
    d(v: vertex_descriptor): number;
}
export declare class AdjI implements IterableIterator<vertex_descriptor> {
    constructor(graph: IncidenceGraph, iterator: OutEI);
    [Symbol.iterator](): AdjI;
    next(): IteratorResult<vertex_descriptor>;
    readonly graph: IncidenceGraph;
    readonly iterator: OutEI;
}
export declare class AdjPI implements IterableIterator<vertex_descriptor> {
    constructor(graph: IncidenceGraph, iterator: OutEPI);
    [Symbol.iterator](): AdjPI;
    next(): IteratorResult<vertex_descriptor>;
    readonly graph: IncidenceGraph;
    readonly iterator: OutEPI;
}
export type adjacency_iterator = AdjI | AdjPI;
export interface AdjacencyGraph extends Graph {
    /** Return adjacenct vertex iterator */
    adj(v: vertex_descriptor): adjacency_iterator;
}
export interface VertexListGraph extends Graph {
    /** Return vertex iterator */
    v(): IterableIterator<vertex_descriptor>;
    /** Return number of vertices */
    nv(): number;
}
export interface EdgeListGraph extends Graph {
    /** Return number of edges */
    ne(): number;
    source(e: edge_descriptor): vertex_descriptor;
    target(e: edge_descriptor): vertex_descriptor;
}
export interface MutableGraph extends Graph {
    addVertex(...args: any[]): vertex_descriptor;
    addEdge(u: vertex_descriptor, v: vertex_descriptor, p?: unknown): edge_descriptor | null;
}
export interface PropertyMap {
    get(x: vertex_descriptor | edge_descriptor): unknown;
}
export interface MutableVertexPropertyMap<T> extends PropertyMap {
    put(x: vertex_descriptor, value: T): void;
}
export interface PropertyGraph extends Graph {
}
export interface NamedGraph extends Graph {
    vertexName(v: vertex_descriptor): string;
}
export interface ComponentGraph extends Graph {
}
export interface PolymorphicGraph extends Graph {
    /** Checks if a vertex currently holds a given type */
    h(id: number, v: vertex_descriptor): boolean;
    /** Returns the zero-based index of the alternative held by the vertex */
    w(v: vertex_descriptor): number;
    object(v: vertex_descriptor): unknown;
    value(id: number, v: vertex_descriptor): unknown;
    visitVertex(visitor: unknown, v: vertex_descriptor): void;
}
export type reference_descriptor = ED | EPD;
export type child_iterator = OutEI | OutEPI;
export type parent_iterator = InEI | InEPI;
export interface ReferenceGraph extends Graph {
    reference(u: vertex_descriptor, v: vertex_descriptor): boolean;
    parent(e: reference_descriptor): vertex_descriptor;
    child(e: reference_descriptor): vertex_descriptor;
    children(v: vertex_descriptor): child_iterator;
    numChildren(v: vertex_descriptor): number;
    getParent(v: vertex_descriptor): vertex_descriptor | null;
}
export interface MutableReferenceGraph extends ReferenceGraph {
    addReference(u: vertex_descriptor, v: vertex_descriptor, p?: unknown): reference_descriptor | null;
}
export interface ParentGraph extends ReferenceGraph, NamedGraph {
    locateChild(v: vertex_descriptor | null, name: string): vertex_descriptor | null;
}
export interface AddressableGraph extends ParentGraph {
    locate(absPath: string): vertex_descriptor | null;
    locateRelative(path: string, start?: vertex_descriptor | null): vertex_descriptor | null;
    path(v: vertex_descriptor): string;
}
export interface UuidGraph<Key> extends Graph {
    contains(key: Key): boolean;
    vertex(key: Key): vertex_descriptor;
    find(key: Key): vertex_descriptor | null;
}
export declare function reindexEdgeList(el: (OutE | OutEP)[], u: number): void;
export declare function removeAllEdgesFromList(edges: Set<Edge>, el: OutEP[], v: vertex_descriptor): void;
export declare function getPath(g: ReferenceGraph & NamedGraph, v: vertex_descriptor | null): string;
export declare function findRelative(g: ParentGraph, v: vertex_descriptor | null, path: string): vertex_descriptor | null;
export interface TerminatorFunc {
    terminate(v: vertex_descriptor, g: IncidenceGraph): boolean;
}
export interface GraphVisitor {
    initializeVertex(v: vertex_descriptor, g: IncidenceGraph): void;
    startVertex(v: vertex_descriptor, g: IncidenceGraph): void;
    discoverVertex(v: vertex_descriptor, g: IncidenceGraph): void;
    examineEdge(e: edge_descriptor, g: IncidenceGraph): void;
    treeEdge(e: edge_descriptor, g: IncidenceGraph): void;
    backEdge(e: edge_descriptor, g: IncidenceGraph): void;
    forwardOrCrossEdge(e: edge_descriptor, g: IncidenceGraph): void;
    finishEdge(e: edge_descriptor, g: IncidenceGraph): void;
    finishVertex(v: vertex_descriptor, g: IncidenceGraph): void;
}
export declare enum GraphColor {
    WHITE = 0,
    GRAY = 1,
    GREEN = 2,
    RED = 3,
    BLACK = 4
}
export declare function depthFirstSearch(g: IncidenceGraph & VertexListGraph, visitor: GraphVisitor, color: MutableVertexPropertyMap<GraphColor>, startVertex?: vertex_descriptor | null): void;
export declare function depthFirstVisit(g: IncidenceGraph, u: vertex_descriptor, visitor: GraphVisitor, color: MutableVertexPropertyMap<GraphColor>, func?: TerminatorFunc): void;
export declare class DefaultVisitor implements GraphVisitor {
    initializeVertex(v: vertex_descriptor, g: IncidenceGraph): void;
    startVertex(v: vertex_descriptor, g: IncidenceGraph): void;
    discoverVertex(v: vertex_descriptor, g: IncidenceGraph): void;
    examineEdge(e: edge_descriptor, g: IncidenceGraph): void;
    treeEdge(e: edge_descriptor, g: IncidenceGraph): void;
    backEdge(e: edge_descriptor, g: IncidenceGraph): void;
    forwardOrCrossEdge(e: edge_descriptor, g: IncidenceGraph): void;
    finishEdge(e: edge_descriptor, g: IncidenceGraph): void;
    finishVertex(v: vertex_descriptor, g: IncidenceGraph): void;
}
export declare class ReferenceGraphView<BaseGraph extends ReferenceGraph & VertexListGraph> implements IncidenceGraph, VertexListGraph {
    constructor(g: BaseGraph);
    readonly N: number | null;
    edge(u: vertex_descriptor, v: vertex_descriptor): boolean;
    source(e: edge_descriptor): vertex_descriptor;
    target(e: edge_descriptor): vertex_descriptor;
    oe(v: vertex_descriptor): out_edge_iterator;
    od(v: vertex_descriptor): number;
    v(): IterableIterator<vertex_descriptor>;
    nv(): number;
    g: BaseGraph;
}
