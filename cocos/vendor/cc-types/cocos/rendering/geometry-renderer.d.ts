import { Color, Mat4, Vec3, geometry } from '../core';
import { CommandBuffer, Device, RenderPass } from '../gfx';
import { PipelineSceneData } from './pipeline-scene-data';
export interface IGeometryInfo {
    maxLines: number;
    maxDashedLines: number;
    maxTriangles: number;
}
export declare class GeometryRenderer {
    private _device;
    private _buffers;
    constructor();
    activate(device: Device, info?: IGeometryInfo): void;
    render(renderPass: RenderPass, cmdBuff: CommandBuffer, sceneData: PipelineSceneData): void;
    destroy(): void;
    empty(): boolean;
    update(): void;
    reset(): void;
    addDashedLine(v0: Vec3, v1: Vec3, color: Color, depthTest?: boolean): void;
    addLine(v0: Vec3, v1: Vec3, color: Color, depthTest?: boolean): void;
    addTriangle(v0: Vec3, v1: Vec3, v2: Vec3, color: Color, wireframe?: boolean, depthTest?: boolean, unlit?: boolean): void;
    addQuad(v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3, color: Color, wireframe?: boolean, depthTest?: boolean, unlit?: boolean): void;
    addBoundingBox(aabb: geometry.AABB, color: Color, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Mat4): void;
    addCross(position: Vec3, size: number, color: Color, depthTest?: boolean): void;
    addFrustum(frustum: geometry.Frustum, color: Color, depthTest?: boolean): void;
    addCapsule(center: Vec3, radius: number, height: number, color: Color, segmentsU?: number, hemiSegmentsV?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addCylinder(center: Vec3, radius: number, height: number, color: Color, segments?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addCone(center: Vec3, radius: number, height: number, color: Color, segments?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addCircle(center: Vec3, radius: number, color: Color, segments?: number, depthTest?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addArc(center: Vec3, radius: number, color: Color, startAngle: number, endAngle: number, segments?: number, depthTest?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addPolygon(center: Vec3, radius: number, color: Color, segments?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addDisc(center: Vec3, radius: number, color: Color, segments?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addSector(center: Vec3, radius: number, color: Color, startAngle: number, endAngle: number, segments?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addSphere(center: Vec3, radius: number, color: Color, segmentsU?: number, segmentsV?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addTorus(center: Vec3, bigRadius: number, radius: number, color: Color, segmentsU?: number, segmentsV?: number, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addOctahedron(center: Vec3, radius: number, color: Color, wireframe?: boolean, depthTest?: boolean, unlit?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addBezier(v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3, color: Color, segments?: number, depthTest?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addSpline(spline: geometry.Spline, color: Color, index?: number, knotSize?: number, segments?: number, depthTest?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addMesh(center: Vec3, vertices: Array<Vec3>, color: Color, depthTest?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
    addIndexedMesh(center: Vec3, vertices: Array<Vec3>, indices: Array<number>, color: Color, depthTest?: boolean, useTransform?: boolean, transform?: Readonly<Mat4>): void;
}
