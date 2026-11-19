import { Asset } from '../assets/asset';
import { Material } from '../assets';
export declare class BuiltinResMgr {
    protected _resources: Record<string, Asset>;
    protected _materialsToBeCompiled: Material[];
    constructor();
    init(): void;
    addAsset(key: string, asset: Asset): void;
    get<T extends Asset>(uuid: string): T;
    /**
     * @internal
     */
    loadBuiltinAssets(): Promise<void>;
    compileBuiltinMaterial(): void;
}
declare const builtinResMgr: BuiltinResMgr;
export { builtinResMgr };
