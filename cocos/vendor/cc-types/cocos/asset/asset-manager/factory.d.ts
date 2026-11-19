import { Asset } from '../assets/asset';
import Bundle from './bundle';
export type CreateHandler = (id: string, data: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: Asset | Bundle | null) => void)) => void;
export declare class Factory {
    private _creating;
    private _producers;
    constructor();
    register(type: string | Record<string, CreateHandler>, handler?: CreateHandler): void;
    create(id: string, data: any, type: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: Asset | Bundle | null) => void)): void;
}
declare const _default: Factory;
export default _default;
