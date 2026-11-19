/// <reference types="./@types/globals" />
import { Asset } from '../assets/asset';
export interface IDependProp {
    uuid: string;
    owner: any;
    prop: string;
    type?: Constructor<Asset>;
}
export default function deserializeAsset(json: Record<string, any>, options: Record<string, any> & {
    __uuid__?: string;
}): Asset;
