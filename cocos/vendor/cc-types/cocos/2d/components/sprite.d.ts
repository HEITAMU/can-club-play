import { SpriteAtlas } from '../assets/sprite-atlas';
import { SpriteFrame } from '../assets/sprite-frame';
import { Vec2 } from '../../core';
import { IBatcher } from '../renderer/i-batcher';
import { UIRenderer } from '../framework/ui-renderer';
import { Material } from '../../asset/assets';
/**
 * @en
 * Enum for sprite type.
 *
 * @zh
 * Sprite 类型。
 */
export declare enum SpriteType {
    /**
     * @en
     * The simple type.
     *
     * @zh
     * 普通类型。
     */
    SIMPLE = 0,
    /**
     * @en
     * The sliced type.
     *
     * @zh
     * 切片（九宫格）类型。
     */
    SLICED = 1,
    /**
     * @en
     * The tiled type.
     *
     * @zh  平铺类型
     */
    TILED = 2,
    /**
     * @en
     * The filled type.
     *
     * @zh
     * 填充类型。
     */
    FILLED = 3
}
/**
 * @en
 * Enum for fill type.
 *
 * @zh
 * 填充类型。
 */
declare enum FillType {
    /**
     * @en
     * The horizontal fill.
     *
     * @zh
     * 水平方向填充。
     */
    HORIZONTAL = 0,
    /**
     * @en
     * The vertical fill.
     *
     * @zh
     * 垂直方向填充。
     */
    VERTICAL = 1,
    /**
     * @en
     * The radial fill.
     *
     * @zh  径向填充
     */
    RADIAL = 2
}
/**
 * @en
 * Sprite Size can track trimmed size, raw size or none.
 *
 * @zh
 * 精灵尺寸调整模式。
 */
declare enum SizeMode {
    /**
     * @en
     * Use the customized node size.
     *
     * @zh
     * 使用节点预设的尺寸。
     */
    CUSTOM = 0,
    /**
     * @en
     * Match the trimmed size of the sprite frame automatically.
     *
     * @zh
     * 自动适配为精灵裁剪后的尺寸。
     */
    TRIMMED = 1,
    /**
     * @en
     * Match the raw size of the sprite frame automatically.
     *
     * @zh
     * 自动适配为精灵原图尺寸。
     */
    RAW = 2
}
export declare enum SpriteEventType {
    SPRITE_FRAME_CHANGED = "spriteframe-changed"
}
/**
 * @en
 * Renders a sprite in the scene.
 *
 * @zh
 * 渲染精灵组件。
 */
export declare class Sprite extends UIRenderer {
    constructor();
    /**
     * @en
     * The sprite atlas where the sprite is.
     *
     * @zh
     * 精灵的图集。
     */
    get spriteAtlas(): SpriteAtlas | null;
    set spriteAtlas(value: SpriteAtlas | null);
    /**
     * @en
     * The sprite frame of the sprite.
     *
     * @zh
     * 精灵的精灵帧。
     */
    get spriteFrame(): SpriteFrame | null;
    set spriteFrame(value: SpriteFrame | null);
    /**
     * @en
     * The sprite render type.
     *
     * @zh
     * 精灵渲染类型。
     *
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * sprite.type = Sprite.Type.SIMPLE;
     * ```
     */
    get type(): SpriteType;
    set type(value: SpriteType);
    /**
     * @en
     * The fill type, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 精灵填充类型，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * sprite.fillType = Sprite.FillType.HORIZONTAL;
     * ```
     */
    get fillType(): FillType;
    set fillType(value: FillType);
    /**
     * @en
     * The fill Center, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 填充中心点，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * import { Vec2 } from 'cc';
     * sprite.fillCenter = new Vec2(0, 0);
     * ```
     */
    get fillCenter(): Vec2;
    set fillCenter(value: Vec2);
    /**
     * @en
     * The fill Start, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 填充起始点，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * // -1 To 1 between the numbers
     * sprite.fillStart = 0.5;
     * ```
     */
    get fillStart(): number;
    set fillStart(value: number);
    /**
     * @en
     * The fill Range, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 填充范围，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * // -1 To 1 between the numbers
     * sprite.fillRange = 1;
     * ```
     */
    get fillRange(): number;
    set fillRange(value: number);
    /**
     * @en
     * specify the frame is trimmed or not.
     *
     * @zh
     * 是否使用裁剪模式。
     *
     * @example
     * ```ts
     * sprite.trim = true;
     * ```
     */
    get trim(): boolean;
    set trim(value: boolean);
    /**
     * @en Grayscale mode.
     * @zh 是否以灰度模式渲染。
     */
    get grayscale(): boolean;
    set grayscale(value: boolean);
    /**
     * @en
     * Specify the size tracing mode.
     *
     * @zh
     * 精灵尺寸调整模式。
     *
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * sprite.sizeMode = Sprite.SizeMode.CUSTOM;
     * ```
     */
    get sizeMode(): SizeMode;
    set sizeMode(value: SizeMode);
    /**
     * @en Enum for fill type.
     * @zh 填充类型。
     */
    static FillType: typeof FillType;
    /**
     * @en Enum for sprite type.
     * @zh Sprite 类型。
     */
    static Type: typeof SpriteType;
    /**
     * @en Sprite's size mode, including trimmed size, raw size, and none.
     * @zh 精灵尺寸调整模式。
     */
    static SizeMode: typeof SizeMode;
    /**
     * @en Event types for sprite.
     * @zh sprite 的事件类型。
     */
    static EventType: typeof SpriteEventType;
    protected _spriteFrame: SpriteFrame | null;
    protected _type: SpriteType;
    protected _fillType: FillType;
    protected _sizeMode: SizeMode;
    protected _fillCenter: Vec2;
    protected _fillStart: number;
    protected _fillRange: number;
    protected _isTrimmedMode: boolean;
    protected _useGrayscale: boolean;
    protected _atlas: SpriteAtlas | null;
    __preload(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en
     * Quickly switch to other sprite frame in the sprite atlas.
     * If there is no atlas, the switch fails.
     *
     * @zh
     * 选取使用精灵图集中的其他精灵。
     * @param name @en Name of the spriteFrame to switch. @zh 要切换的 spriteFrame 名字。
     */
    changeSpriteFrameFromAtlas(name: string): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    changeMaterialForDefine(): void;
    protected _updateBuiltinMaterial(): Material;
    protected _render(render: IBatcher): void;
    protected _canRender(): boolean;
    protected _flushAssembler(): void;
    private _applySpriteSize;
    private _resized;
    private _activateMaterial;
    private _updateUVs;
    private _applySpriteFrame;
}
export {};
