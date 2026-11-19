import { UIMeshRenderer } from '../components';
import { UIRenderer } from './ui-renderer';
/** @mangle */
export declare class UIRendererManager {
    private _allRenderers;
    private _dirtyRenderers;
    private _dirtyVersion;
    addRenderer(uiRenderer: UIRenderer | UIMeshRenderer): void;
    removeRenderer(uiRenderer: UIRenderer | UIMeshRenderer): void;
    markDirtyRenderer(uiRenderer: UIRenderer | UIMeshRenderer): void;
    updateAllDirtyRenderers(): void;
}
export declare const uiRendererManager: UIRendererManager;
