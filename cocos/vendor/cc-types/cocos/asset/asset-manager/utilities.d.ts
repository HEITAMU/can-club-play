/// <reference types="./@types/globals" />
import { Asset } from '../assets/asset';
import Config from './config';
import RequestItem from './request-item';
import Task from './task';
export declare function setDefaultProgressCallback(onProgress: (finished: number, total: number, item: RequestItem) => void): void;
export declare function clear(task: Task, clearRef: boolean): void;
export declare function urlAppendTimestamp(url: string, append: boolean): string;
export type RetryFunction = (times: number, done: ((err: Error | null, data?: any) => void)) => void;
export declare function retry(process: RetryFunction, times: number, wait: number, onComplete: ((err: Error | null, data?: any) => void), index?: number): void;
export declare function getDepends(uuid: string, data: Asset | Record<string, any>, exclude: Record<string, any>, depends: any[], config: Config): void;
export declare function cache(id: string, asset: Asset, cacheAsset?: boolean): void;
export declare function setProperties(uuid: string, asset: Asset, assetsMap: Record<string, any>): boolean;
export declare function gatherAsset(task: Task): void;
type ForEachFunction<T> = (item: T, done: ((err?: Error | null) => void)) => void;
export declare function forEach<T = any>(array: T[], process: ForEachFunction<T>, onComplete: (errs: Error[]) => void): void;
interface IParameters<T> {
    options: Record<string, any>;
    onProgress: ((finished: number, total: number, item: RequestItem) => void) | null;
    onComplete: T | null;
}
interface ILoadResArgs<T> {
    type: Constructor<Asset> | null;
    onProgress: ((finished: number, total: number, item: RequestItem) => void) | null;
    onComplete: T | null;
}
export declare function parseParameters<T extends (...args: any[]) => void>(options: Record<string, any> | ((finished: number, total: number, item: RequestItem) => void) | T | null | undefined, onProgress: ((finished: number, total: number, item: RequestItem) => void) | T | null | undefined, onComplete: T | null | undefined): IParameters<T>;
export declare function parseLoadResArgs<T extends (...args: any[]) => void>(type: Constructor<Asset> | ((finished: number, total: number, item: RequestItem) => void) | T | null | undefined, onProgress: ((finished: number, total: number, item: RequestItem) => void) | T | null | undefined, onComplete: T | null | undefined): ILoadResArgs<T>;
export declare function checkCircleReference(owner: string, uuid: string, map: Record<string, any>, checked?: Record<string, boolean>): boolean;
export declare function asyncify(cb: ((p1?: any, p2?: any) => void) | null): (p1?: any, p2?: any) => void;
export {};
