import { Attribute } from '../../gfx';
/**
 * @en Vertex format with vector 3 position attribute
 * @zh 包含三维位置属性的顶点格式
 */
export declare const vfmt: Attribute[];
/**
 * @en Vertex format with the following layout.
 * 1. Vector 3 position attribute (Float32)
 * 2. Vector 4 color attribute (Float32)
 * @zh 包含以下数据的顶点格式
 * 1. 三维位置属性（Float32）
 * 2. RGBA 颜色属性（Float32）
 */
export declare const vfmtPosColor: Attribute[];
/**
 * @en Vertex format with the following layout
 * 1. Vector 3 position attribute (Float32)
 * 2. Vector 2 uv attribute (Float32)
 * 3. Vector 4 color attribute (Float32)
 * @zh 包含以下数据的顶点格式
 * 1. 三维位置属性（Float32）
 * 2. 二维贴图 UV 属性（Float32）
 * 3. RGBA 颜色属性（Float32）
 */
export declare const vfmtPosUvColor: Attribute[];
/**
 * @en Vertex format with the following layout
 * 1. Vector 3 position attribute (Float32)
 * 2. Vector 2 uv attribute (Float32)
 * 3. Byte 4 color attribute (Byte)
 * @zh 包含以下数据的顶点格式
 * 1. 三维位置属性（Float32）
 * 2. 二维贴图 UV 属性（Float32）
 * 3. RGBA 颜色属性（Byte）
 */
export declare const vfmtPosUvColor4B: Attribute[];
/**
 * @en Vertex format with the following layout
 * 1. Vector 3 position attribute (Float32)
 * 2. Vector 2 uv attribute (Float32)
 * 3. First vector 4 color attribute (Float32)
 * 4. Second vector 4 color attribute (Float32)
 * @zh 包含以下数据的顶点格式
 * 1. 三维位置属性（Float32）
 * 2. 二维贴图 UV 属性（Float32）
 * 3. 第一套 RGBA 颜色属性（Float32）
 * 4. 第二套 RGBA 颜色属性（Float32）
 */
export declare const vfmtPosUvTwoColor: Attribute[];
/**
 * @en Vertex format with the following layout
 * 1. Vector 3 position attribute (Float32)
 * 2. Vector 2 uv attribute (Float32)
 * 3. First byte 4 color attribute (Byte)
 * 4. Second byte 4 color attribute (Byte)
 * @zh 包含以下数据的顶点格式
 * 1. 三维位置属性（Float32）
 * 2. 二维贴图 UV 属性（Float32）
 * 3. 第一套 RGBA 颜色属性（Byte）
 * 4. 第二套 RGBA 颜色属性（Byte）
 */
export declare const vfmtPosUvTwoColor4B: Attribute[];
/**
 * @en Get total components count for all attributes per vertex.
 * @zh 获取每个顶点上所有属性的分量数总和
 * @param attrs All attributes of the vertex format
 * @returns Total components count
 */
export declare function getComponentPerVertex(attrs: Attribute[]): number;
/**
 * @en Get total stride for all attributes per vertex.
 * @zh 获取每个顶点上所有属性的总步进
 * @param attrs All attributes of the vertex format
 * @returns Total stride
 */
export declare function getAttributeStride(attrs: Attribute[]): number;
