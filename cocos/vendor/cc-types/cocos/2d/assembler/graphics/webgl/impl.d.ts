import { Color, Vec2 } from '../../../../core';
import { Graphics } from '../../../components/graphics';
import { MeshRenderData } from '../../../renderer/render-data';
import { LineCap, LineJoin, PointFlags } from '../types';
export declare class Point extends Vec2 {
    dx: number;
    dy: number;
    dmx: number;
    dmy: number;
    flags: number;
    len: number;
    constructor(x: number, y: number);
    reset(): void;
}
export declare class Path {
    closed: boolean;
    bevel: number;
    complex: boolean;
    points: Point[];
    reset(): void;
}
/** @mangle */
export declare class Impl {
    dataOffset: number;
    updatePathOffset: boolean;
    pathLength: number;
    pathOffset: number;
    paths: Path[];
    tessTol: number;
    distTol: number;
    fillColor: Color;
    lineCap: LineCap;
    strokeColor: Color;
    lineJoin: LineJoin;
    lineWidth: number;
    pointsOffset: number;
    private _commandX;
    private _commandY;
    private _points;
    private _renderDataList;
    private _curPath;
    private _comp;
    constructor(comp: Graphics);
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
    quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
    arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean): void;
    ellipse(cx: number, cy: number, rx: number, ry: number): void;
    circle(cx: number, cy: number, r: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
    clear(): void;
    close(): void;
    requestRenderData(): MeshRenderData;
    getRenderDataList(): MeshRenderData[];
    addPoint(x: number, y: number, flags: PointFlags): void;
    private _addPath;
}
