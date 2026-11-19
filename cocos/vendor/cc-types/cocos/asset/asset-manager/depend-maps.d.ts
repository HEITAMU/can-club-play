import type { Asset } from '../assets/asset';
import type { IDependProp } from './deserialize';
export declare const dependMap: WeakMap<Asset, IDependProp[]>;
export declare const nativeDependMap: WeakSet<Asset>;
export declare const onLoadedInvokedMap: WeakSet<Asset>;
