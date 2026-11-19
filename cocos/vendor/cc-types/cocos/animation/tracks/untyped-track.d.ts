import { RealCurve } from '../../core';
import { createEvalSymbol } from '../define';
import { IValueProxyFactory } from '../value-proxy';
import { ColorTrackEval } from './color-track';
import { SizeTrackEval } from './size-track';
import { Channel, Track, TrackEval, TrackPath } from './track';
import { Vec2TrackEval, Vec3TrackEval, Vec4TrackEval } from './vector-track';
declare class UntypedTrackChannel extends Channel<RealCurve> {
    property: string;
    constructor();
}
export declare class UntypedTrack extends Track {
    private _channels;
    channels(): UntypedTrackChannel[];
    [createEvalSymbol](): TrackEval<unknown>;
    /**
     * @internal
     */
    createLegacyEval(hintValue?: unknown): Vec2TrackEval | Vec3TrackEval | Vec4TrackEval | ColorTrackEval | SizeTrackEval;
    addChannel(property: string): UntypedTrackChannel;
    upgrade(refine: UntypedTrackRefine): Track | null;
}
export type UntypedTrackRefine = (path: Readonly<TrackPath>, proxy: IValueProxyFactory | undefined) => 'vec2' | 'vec3' | 'vec4' | 'color' | 'size';
export {};
