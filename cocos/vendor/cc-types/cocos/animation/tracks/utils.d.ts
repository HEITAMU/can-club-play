import type { Curve } from './track';
export declare function maskIfEmpty<T extends Curve>(curve: T): T | undefined;
export interface Range {
    min: number;
    max: number;
}
