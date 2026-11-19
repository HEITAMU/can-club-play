import { Asset } from '../../asset/assets/asset';
/**
 * @zh `AnimationGraph` 和 `AnimationGraphVariant` 的内部共同基类，
 * 仅用于特殊目的，不应另作它用，也不应导出为公开接口。
 * @en The common base class of `AnimationGraph` and `AnimationGraphVariant`
 * which exists for special purpose and should not be used otherwise and should not be exported.
 *
 * @internal This class serves as the editor switch of
 * animation graph asset and animation graph variant asset,
 * especially as the `graph` property on animation controller component.
 */
export declare abstract class AnimationGraphLike extends Asset {
}
