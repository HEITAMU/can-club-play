import { Light } from './light-component';
/**
 * @en The ranged directional light component, Multiple ranged directional light sources are allowed in a scene.
 * @zh 范围平行光光源组件，一个场景允许存在多个范围平行光光源。
 */
export declare class RangedDirectionalLight extends Light {
    private _illuminanceHDR;
    private _illuminanceLDR;
    /**
     * @en The light source intensity.
     * @zh 光源强度。
     */
    get illuminance(): number;
    set illuminance(val: number);
    constructor();
    protected _createLight(): void;
}
