/**
 * @en
 * save a color buffer to a PPM file
 * @zh
 * 保存一个颜色缓冲到 PPM 文件中
 * @param buffer color buffer
 * @param w width
 * @param h height
 */
export declare function toPPM(buffer: Uint8Array, w: number, h: number): string;
