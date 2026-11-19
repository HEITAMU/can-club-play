import { GFXObject, ShaderInfo, ShaderStage, UniformBlock, UniformSampler, Attribute } from './define';
/**
 * @en GFX shader.
 * @zh GFX 着色器。
 */
export declare abstract class Shader extends GFXObject {
    get name(): string;
    get attributes(): Attribute[];
    get blocks(): UniformBlock[];
    get samplers(): UniformSampler[];
    get stages(): ShaderStage[];
    /** @mangle */
    protected _name: string;
    /** @mangle */
    protected _stages: ShaderStage[];
    /** @mangle */
    protected _attributes: Attribute[];
    /** @mangle */
    protected _blocks: UniformBlock[];
    /** @mangle */
    protected _samplers: UniformSampler[];
    constructor();
    abstract initialize(info: Readonly<ShaderInfo>): void;
    abstract destroy(): void;
}
