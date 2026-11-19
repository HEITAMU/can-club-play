import type { ITweenCustomProperty } from './tween';
import { Vec3 } from '../core/math';
export declare function bezier(...knots: ReadonlyArray<Vec3>): ITweenCustomProperty<Vec3>;
export declare function catmullRom(...knots: ReadonlyArray<Vec3>): ITweenCustomProperty<Vec3>;
