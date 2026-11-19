/// <reference types="./@types/globals" />
import { Component } from '../scene-graph/component';
/**
 * @en
 * A temp fallback to contain the original component which can not be loaded.
 * @zh
 * 包含无法加载的原始组件的临时回退。
 */
export declare class MissingScript extends Component {
    static safeFindClass(id: string): Constructor<unknown> | undefined;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _$erialized: null;
    constructor();
    onLoad(): void;
}
