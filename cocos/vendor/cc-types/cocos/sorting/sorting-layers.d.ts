interface SortingItem {
    id: number;
    name: string;
    value: number;
}
/**
 * @zh 排序层管理器，用于在 sorting 组件中帮助用户进行对象分组并进行层级排序。
 * 在sorting组件中，layer 的排序优先级高于 sortingOrder。
 * @en Sorting layers manager, Used in the sorting component to help the user group objects and perform layer sorting.
 * In the sorting component, layer has higher sorting priority than sortingOrder.
 * */
export declare class SortingLayers {
    private static nameMap;
    private static indexMap;
    /**
     * @en All sortinglayers in an Enum
     * @zh 以 Enum 形式存在的所有排序层列表
     */
    static Enum: {
        default: number;
    };
    /**
     * @zh 计算排序优先级
     * @en Calculate sorting priority
     */
    static getSortingPriority(layer?: number, order?: number): number;
    static getDefaultPriority(): number;
    /**
     * @zh 获取 Layer 顺序索引
     * @en Get Layer index by id
     */
    static getLayerIndex(layer?: number): number;
    /**
     * @zh 通过 Layer 名字获取 Layer 顺序索引值
     * @en Get Layer index by name
     */
    static getLayerIndexByName(name: string): number;
    /**
     * @zh 获取 Layer 名字
     * @en Get Layer name by id
     */
    static getLayerName(layer?: number): string;
    /**
     * @zh 通过 Layer 名字获取 Layer id 值
     * @en Get Layer id by name
     */
    static getLayerByName(name: string): number;
    /**
     * @zh 检查 Layer id 有效性
     * @en Check Layer id validity
     */
    static isLayerValid(id: number): boolean;
    /**
     * @zh 获取内置 Sorting Layer 数组
     * @en Get Builtin Layer array
     */
    static getBuiltinLayers(): ReadonlyArray<SortingItem>;
    /**
     * @engineInternal
     */
    static init(): void;
    /**
     * @engineInternal
     */
    static setLayer(layer: number, layerName: string, layerIndex: number): void;
    /**
     * @engineInternal
     */
    private static resetState;
}
export {};
