export type BezierControlPoints = [number, number, number, number];
export declare function bezier(C1: number, C2: number, C3: number, C4: number, t: number): number;
export declare function bezierByTime(controlPoints: BezierControlPoints, x: number): number;
