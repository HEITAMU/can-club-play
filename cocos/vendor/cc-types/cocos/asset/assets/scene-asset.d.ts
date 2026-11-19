import { Scene } from '../../scene-graph/scene';
import { Asset } from './asset';
/**
 * @en Class for scene loading.
 * @zh 场景资源类。
 *
 */
export declare class SceneAsset extends Asset {
    /**
     * @en The scene node
     * @zh 场景节点。
     */
    scene: Scene | null;
    constructor(name?: string);
    initDefault(uuid?: string): void;
    validate(): boolean;
}
