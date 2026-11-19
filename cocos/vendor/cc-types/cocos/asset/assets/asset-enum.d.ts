/**
 * @en
 * The texture pixel format, default value is RGBA8888,<br>
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,<br>
 * other formats are supported by compressed file types or raw data.
 * @zh
 * 纹理像素格式，默认值为RGBA8888，<br>
 * 你应该注意到普通图像文件（png，jpg）加载的纹理只能支持RGBA8888格式，<br>
 * 压缩文件类型或原始数据支持其他格式。
 */
export declare enum PixelFormat {
    /**
     * @en
     * 16-bit pixel format containing red, green and blue channels
     * @zh
     * 包含 RGB 通道的 16 位纹理。
     */
    RGB565 = 47,
    /**
     * @en
     * 16-bit pixel format containing red, green, blue channels with 5 bits per channel and one bit alpha channel: RGB5A1
     * @zh
     * 包含 RGB（分别占 5 bits）和 1 bit 的 alpha 通道的 16 位纹理：RGB5A1。
     */
    RGB5A1 = 49,
    /**
     * @en
     * 16-bit pixel format containing red, green, blue and alpha channels: RGBA4444
     * @zh
     * 包含 RGBA 通道的 16 位纹理：RGBA4444。
     */
    RGBA4444 = 50,
    /**
     * @en
     * 24-bit pixel format containing red, green and blue channels: RGB888
     * @zh
     * 包含 RGB 通道的 24 位纹理：RGB888。
     */
    RGB888 = 24,
    /**
     * @en
     * 32-bit float pixel format containing red, green and blue channels: RGBA32F
     * @zh
     * 包含 RGB 通道的 32 位浮点数像素格式：RGBA32F。
     */
    RGB32F = 32,
    /**
     * @en
     * 32-bit pixel format containing red, green, blue and alpha channels: RGBA8888
     * @zh
     * 包含 RGBA 四通道的 32 位整形像素格式：RGBA8888。
     */
    RGBA8888 = 35,
    /**
     * @en
     * 32-bit pixel format containing blue, green, red, and alpha channels: BGRA8888
     * @zh
     * 包含 BGRA 四通道的 32 位整形像素格式：BGRA8888。
     */
    BGRA8888 = 36,
    /**
     * @en
     * 32-bit float pixel format containing red, green, blue and alpha channels: RGBA32F
     * @zh
     * 32位浮点数像素格式：RGBA32F。
     */
    RGBA32F = 44,
    /**
     * @en
     * 8-bit pixel format used as masks
     * @zh
     * 用作蒙版的8位纹理。
     */
    A8 = 1,
    /**
     * @en
     * 8-bit intensity pixel format
     * @zh
     * 8位强度纹理。
     */
    I8 = 2,
    /**
     * @en
     * 16-bit pixel format used as masks
     * @zh
     * 用作蒙版的16位纹理。
     */
    AI8 = 3,
    /**
     * @en A pixel format containing red, green, and blue channels that is PVR 2bpp compressed.
     * @zh 包含 RGB 通道的 PVR 2BPP 压缩纹理格式
     */
    RGB_PVRTC_2BPPV1 = 83,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is PVR 2bpp compressed.
     * @zh 包含 RGBA 通道的 PVR 2BPP 压缩纹理格式
     */
    RGBA_PVRTC_2BPPV1 = 84,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is PVR 2bpp compressed.
     * RGB_A_PVRTC_2BPPV1 texture is a 2x height RGB_PVRTC_2BPPV1 format texture.
     * It separate the origin alpha channel to the bottom half atlas, the origin rgb channel to the top half atlas.
     * @zh 包含 RGBA 通道的 PVR 2BPP 压缩纹理格式
     * 这种压缩纹理格式贴图的高度是普通 RGB_PVRTC_2BPPV1 贴图高度的两倍，使用上半部分作为原始 RGB 通道数据，下半部分用来存储透明通道数据。
     */
    RGB_A_PVRTC_2BPPV1 = 1024,
    /**
     * @en A pixel format containing red, green, and blue channels that is PVR 4bpp compressed.
     * @zh 包含 RGB 通道的 PVR 4BPP 压缩纹理格式
     */
    RGB_PVRTC_4BPPV1 = 85,
    /**
     * @en A pixel format containing red, green, blue and alpha channels that is PVR 4bpp compressed.
     * @zh 包含 RGBA 通道的 PVR 4BPP 压缩纹理格式
     */
    RGBA_PVRTC_4BPPV1 = 86,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is PVR 4bpp compressed.
     * RGB_A_PVRTC_4BPPV1 texture is a 2x height RGB_PVRTC_4BPPV1 format texture.
     * It separate the origin alpha channel to the bottom half atlas, the origin rgb channel to the top half atlas.
     * @zh 包含 RGBA 通道的 PVR 4BPP 压缩纹理格式
    * 这种压缩纹理格式贴图的高度是普通 RGB_PVRTC_4BPPV1 贴图高度的两倍，使用上半部分作为原始 RGB 通道数据，下半部分用来存储透明通道数据。
     */
    RGB_A_PVRTC_4BPPV1 = 1025,
    /**
     * @en A pixel format containing red, green, and blue channels that is ETC1 compressed.
     * @zh 包含 RGB 通道的 ETC1 压缩纹理格式
     */
    RGB_ETC1 = 72,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ETC1 compressed.
     * @zh 包含 RGBA 通道的 ETC1 压缩纹理格式
     */
    RGBA_ETC1 = 1026,
    /**
     * @en A pixel format containing red, green, and blue channels that is ETC2 compressed.
     * @zh 包含 RGB 通道的 ETC2 压缩纹理格式
     */
    RGB_ETC2 = 73,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ETC2 compressed.
     * @zh 包含 RGBA 通道的 ETC2 压缩纹理格式
     */
    RGBA_ETC2 = 77,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 4x4 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 4x4
     */
    RGBA_ASTC_4x4 = 89,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 5x4 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 5x4
     */
    RGBA_ASTC_5x4 = 90,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 5x5 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 5x5
     */
    RGBA_ASTC_5x5 = 91,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 6x5 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 6x5
     */
    RGBA_ASTC_6x5 = 92,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 6x6 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 6x6
     */
    RGBA_ASTC_6x6 = 93,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 8x5 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 8x5
     */
    RGBA_ASTC_8x5 = 94,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 8x6 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 8x6
     */
    RGBA_ASTC_8x6 = 95,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 8x8 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 8x8
     */
    RGBA_ASTC_8x8 = 96,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 10x5 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 10x5
     */
    RGBA_ASTC_10x5 = 97,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 10x6 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 10x6
     */
    RGBA_ASTC_10x6 = 98,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 10x8 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 10x8
     */
    RGBA_ASTC_10x8 = 99,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 10x10 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 10x10
     */
    RGBA_ASTC_10x10 = 100,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 12x10 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 12x10
     */
    RGBA_ASTC_12x10 = 101,
    /**
     * @en A pixel format containing red, green, blue, and alpha channels that is ASTC compressed with 12x12 block size.
     * @zh 包含 RGBA 通道的 ASTC 压缩纹理格式，压缩分块大小为 12x12
     */
    RGBA_ASTC_12x12 = 102
}
/**
 * @en
 * The texture wrap mode.
 * @zh
 * 纹理环绕方式。
 */
export declare enum WrapMode {
    /**
     * @en
     * Specifies that the repeat warp mode will be used.
     * @zh
     * 指定环绕模式：重复纹理图像。
     */
    REPEAT = 0,
    /**
     * @en
     * Specifies that the clamp to edge warp mode will be used.
     * @zh
     * 指定环绕模式：纹理边缘拉伸效果。
     */
    CLAMP_TO_EDGE = 2,
    /**
     * @en
     * Specifies that the mirrored repeat warp mode will be used.
     * @zh
     * 指定环绕模式：以镜像模式重复纹理图像。
     */
    MIRRORED_REPEAT = 1,
    /**
     * @en
     * Specifies that the  clamp to border wrap mode will be used.
     * @zh
     * 指定环绕模式：超出纹理坐标部分以用户指定颜色填充。
     */
    CLAMP_TO_BORDER = 3
}
/**
 * @en
 * The texture filter mode
 * @zh
 * 纹理过滤模式。
 */
export declare enum TextureFilter {
    NONE = 0,
    /**
     * @en
     * Specifies linear filtering.
     * @zh
     * 线性过滤模式。
     */
    LINEAR = 2,
    /**
     * @en
     * Specifies nearest filtering.
     * @zh
     * 临近过滤模式。
     */
    NEAREST = 1
}
export { TextureFilter as Filter };
