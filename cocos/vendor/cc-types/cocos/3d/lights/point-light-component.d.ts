import { Light } from './light-component';
/**
 * @en The point light component, multiple point lights can be added to one scene.
 * @zh 点光源组件，场景中可以添加多个点光源。
 */
export declare class PointLight extends Light {
    private _luminanceHDR;
    private _luminanceLDR;
    private _term;
    private _range;
    /**
     * @en Luminous flux of the light.
     * @zh 光通量。
     */
    get luminousFlux(): number;
    set luminousFlux(val: number);
    /**
     * @en Luminance of the light.
     * @zh 光亮度。
     */
    get luminance(): number;
    set luminance(val: number);
    /**
     * @en The photometric term currently being used.
     * @zh 当前使用的光度学计量单位。
     */
    get term(): number;
    set term(val: number);
    /**
     * @en Range of the light.
     * @zh 光源范围。
     */
    get range(): number;
    set range(val: number);
    constructor();
    protected _createLight(): void;
}
