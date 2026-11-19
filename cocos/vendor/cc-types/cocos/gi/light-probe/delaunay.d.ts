import { Mat3, Vec3 } from '../../core';
export declare class Vertex {
    position: Vec3;
    normal: Vec3;
    coefficients: Vec3[];
    constructor(pos: Vec3);
}
export declare class CircumSphere {
    center: Vec3;
    radiusSquared: number;
    init(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3): void;
}
/**
 * inner tetrahedron or outer cell structure
 */
export declare class Tetrahedron {
    invalid: boolean;
    vertex0: number;
    vertex1: number;
    vertex2: number;
    vertex3: number;
    neighbours: number[];
    matrix: Mat3;
    offset: Vec3;
    sphere: CircumSphere;
    constructor(delaunay: Delaunay, v0: number, v1: number, v2: number, v3?: number);
    isInCircumSphere(point: Vec3): boolean;
    contain(vertexIndex: number): boolean;
    isInnerTetrahedron(): boolean;
    isOuterCell(): boolean;
}
export declare class Delaunay {
    _probes: Vertex[];
    private _tetrahedrons;
    private _triangles;
    private _edges;
    constructor(probes: Vertex[]);
    build(): Tetrahedron[];
    private reset;
    /**
     * Bowyer-Watson algorithm
     */
    private tetrahedralize;
    private initTetrahedron;
    private addTriangle;
    private addEdge;
    private addProbe;
    private reorder;
    private computeAdjacency;
    private computeMatrices;
    private computeTetrahedronMatrix;
    private computeOuterCellMatrix;
}
