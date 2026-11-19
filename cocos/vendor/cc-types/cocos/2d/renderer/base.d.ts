/**
 * ui 相关模块
 * @module ui
 */
import type { UIRenderer } from '../framework/ui-renderer';
import type { IBatcher } from './i-batcher';
import type { BaseRenderData } from './render-data';
/**
 * @internal
 */
export interface IAssembler {
    createData?(comp: UIRenderer): BaseRenderData;
    fillBuffers?(comp: UIRenderer, renderer: IBatcher): void;
    updateUVs?(comp: UIRenderer, ...args: any[]): void;
    updateColor?(comp: UIRenderer): void;
    updateRenderData?(comp: UIRenderer): void;
    update?(comp: UIRenderer, dt: number): void;
    resetAssemblerData?(data: any): void;
    removeData?(data: BaseRenderData): void;
}
/**
 * @internal
 */
export interface IAssemblerManager {
    getAssembler(component: UIRenderer): IAssembler;
}
