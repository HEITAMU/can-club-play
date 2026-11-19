import { Impl } from './webgl/impl';
export declare function arc(ctx: Impl, cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean): void;
export declare function ellipse(ctx: Impl, cx: number, cy: number, rx: number, ry: number): void;
export declare function roundRect(ctx: Impl, x: number, y: number, w: number, h: number, r: number): void;
export declare function tesselateBezier(ctx: Impl, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, level: number, type: number): void;
