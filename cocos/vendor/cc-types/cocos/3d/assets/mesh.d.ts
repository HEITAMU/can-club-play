/// <reference types="./@types/globals" />
import { Asset } from '../../asset/assets/asset';
import { IDynamicGeometry } from '../../primitive/define';
import { Skeleton } from './skeleton';
import { geometry, Mat4, Vec3 } from '../../core';
import { RenderingSubMesh } from '../../asset/assets';
import { Attribute, AttributeName, PrimitiveMode, FormatInfo } from '../../gfx';
import { Morph } from './morph';
import { MorphRendering } from './morph-rendering';
export declare namespace Mesh {
    interface IBufferView {
        offset: number;
        length: number;
        count: number;
        stride: number;
    }
    /**
     * @en Vertex bundle, it describes a set of interleaved vertex attributes and their values.
     * @zh 顶点块。顶点块描述了一组**交错排列**（interleaved）的顶点属性并存储了顶点属性的实际数据。<br>
     * 交错排列是指在实际数据的缓冲区中，每个顶点的所有属性总是依次排列，并总是出现在下一个顶点的所有属性之前。
     */
    interface IVertexBundle {
        /**
         * @en The actual value for all vertex attributes.
         * You must use DataView to access the data.
         * Because there is no guarantee that the starting offsets of all properties are byte aligned as required by TypedArray.
         * @zh 所有顶点属性的实际数据块。
         * 你必须使用 DataView 来读取数据。
         * 因为不能保证所有属性的起始偏移都按 TypedArray 要求的字节对齐。
         */
        view: IBufferView;
        /**
         * @en All attributes included in the bundle
         * @zh 包含的所有顶点属性。
         */
        attributes: Attribute[];
    }
    interface IMeshCluster {
        clusterView: IBufferView;
        triangleView: IBufferView;
        vertexView: IBufferView;
        coneView?: IBufferView;
    }
    /**
     * @en Sub mesh contains a list of primitives with the same type (Point, Line or Triangle)
     * @zh 子网格。子网格由一系列相同类型的图元组成（例如点、线、面等）。
     */
    interface ISubMesh {
        /**
         * @en The vertex bundle references used by the sub mesh.
         * @zh 此子网格引用的顶点块，索引至网格的顶点块数组。
         */
        vertexBundelIndices: number[];
        /**
         * @en The primitive mode of the sub mesh
         * @zh 此子网格的图元类型。
         */
        primitiveMode: PrimitiveMode;
        /**
         * @en The index data of the sub mesh
         * @zh 此子网格使用的索引数据。
         */
        indexView?: IBufferView;
        /**
         * @en The joint map index in [[IStruct.jointMaps]]. Could be absent
         * @zh 此子网格使用的关节索引映射表在 [[IStruct.jointMaps]] 中的索引。
         * 如未定义或指向的映射表不存在，则默认 VB 内所有关节索引数据直接对应骨骼资源数据。
         */
        jointMapIndex?: number;
        /**
         * @en The cluster data of the sub mesh
         */
        cluster?: IMeshCluster;
    }
    /**
     * @en dynamic info used to create dyanmic mesh
     * @zh 动态信息，用于创建动态网格
     */
    interface IDynamicInfo {
        /**
         * @en max submesh count
         * @zh 最大子模型个数。
         */
        maxSubMeshes: number;
        /**
          * @en max submesh vertex count
          * @zh 子模型最大顶点个数。
          */
        maxSubMeshVertices: number;
        /**
          * @en max submesh index count
          * @zh 子模型最大索引个数。
          */
        maxSubMeshIndices: number;
    }
    /**
     * @en dynamic struct
     * @zh 动态结构体
     */
    interface IDynamicStruct {
        /**
          * @en dynamic mesh info
          * @zh 动态模型信息。
          */
        info: IDynamicInfo;
        /**
          * @en dynamic submesh bounds
          * @zh 动态子模型包围盒。
          */
        bounds: geometry.AABB[];
    }
    /**
     * @en The structure of the mesh
     * @zh 描述了网格的结构。
     */
    interface IStruct {
        /**
         * @en All vertex bundles of the mesh
         * @zh 此网格所有的顶点块。
         */
        vertexBundles: IVertexBundle[];
        /**
         * @en All sub meshes
         * @zh 此网格的所有子网格。
         */
        primitives: ISubMesh[];
        /**
         * @en The minimum position of all vertices in the mesh
         * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
         */
        minPosition?: Vec3;
        /**
         * @en The maximum position of all vertices in the mesh
         * @zh （各分量都）大于等于此网格任何顶点位置的最小位置。
         */
        maxPosition?: Vec3;
        /**
         * @en The joint index map list.
         * @zh 此网格使用的关节索引映射关系列表，数组长度应为子模型中实际使用到的所有关节，
         * 每个元素都对应一个原骨骼资源里的索引，按子模型 VB 内的实际索引排列。
         */
        jointMaps?: number[][];
        /**
         * @en The morph information of the mesh
         * @zh 网格的形变数据
         */
        morph?: Morph;
        /**
         * @en The specific data of the dynamic mesh
         * @zh 动态网格特有数据
         */
        dynamic?: IDynamicStruct;
        /**
         * @en Whether the mesh data is quantized to reduce memory usage
         * @zh 此网格数据是否经过量化以减少内存占用。
         */
        quantized?: boolean;
        /**
         * @en Whether the mesh data is encoded to reduce memory usage
         * @zh
         */
        encoded?: boolean;
        /**
         * @en Whether the mesh data is compressed to reduce memory usage
         * @zh 此网格数据是否经过压缩以减少内存占用。
         */
        compressed?: boolean;
        /**
         * @en Whether the mesh contains cluster data
         * @zh 此网格是否包含 cluster 数据。
         */
        cluster?: boolean;
    }
    /**
     * @en The create info of the mesh
     * @zh 网格创建信息
     */
    interface ICreateInfo {
        /**
         * @en Mesh structure
         * @zh 网格结构。
         */
        struct: Mesh.IStruct;
        /**
         * @en Mesh binary data
         * @zh 网格二进制数据。
         */
        data: Uint8Array;
    }
}
/**
 * @en A representation of a mesh asset
 * A mesh can contain multiple sub-mesh resources. The mesh mainly provides data such as vertices and indices for model instances.
 * @zh 代表一个网格资源
 * 一个网格可包含多个子网格资源，网格主要为模型实例提供顶点，索引等数据
 */
export declare class Mesh extends Asset {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeAsset(): ArrayBuffer;
    set _nativeAsset(value: ArrayBuffer);
    /**
     * @en The sub meshes count of the mesh.
     * @zh 此网格的子网格数量。
     * @deprecated Please use [[renderingSubMeshes.length]] instead
     */
    get subMeshCount(): number;
    /**
     * @en The minimum position of all vertices in the mesh
     * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
     * @deprecated Please use [[struct.minPosition]] instead
     */
    get minPosition(): Readonly<Vec3> | undefined;
    /**
     * @en The maximum position of all vertices in the mesh
     * @zh （各分量都）大于等于此网格任何顶点位置的最大位置。
     * @deprecated Please use [[struct.maxPosition]] instead
     */
    get maxPosition(): Readonly<Vec3> | undefined;
    /**
     * @en The struct of the mesh
     * @zh 此网格的结构。
     */
    get struct(): Mesh.IStruct;
    /**
     * @en The actual data of the mesh
     * @zh 此网格的数据。
     */
    get data(): Uint8Array;
    /**
     * @en The hash of the mesh
     * @zh 此网格的哈希值。
     */
    get hash(): number;
    /**
     * @en The index of the joint buffer of all sub meshes in the joint map buffers
     * @zh 所有子网格的关节索引集合
     */
    get jointBufferIndices(): number[];
    /**
     * @en The sub meshes for rendering. Mesh could be split into different sub meshes for rendering.
     * @zh 此网格创建的渲染网格。
     */
    get renderingSubMeshes(): RenderingSubMesh[];
    /**
     * @en morph rendering data
     * @zh 变形渲染数据
     */
    morphRendering: MorphRendering | null;
    private _struct;
    private _hash;
    private _data;
    private _initialized;
    private _allowDataAccess;
    private _isMeshDataUploaded;
    private _renderingSubMeshes;
    private _boneSpaceBounds;
    private _jointBufferIndices;
    constructor(name?: string);
    /**
     * @en complete loading callback
     * @zh 加载完成回调
     */
    onLoaded(): void;
    /**
     * @en mesh init
     * @zh 网格初始化函数
     */
    initialize(): void;
    /**
     * @en update dynamic sub mesh geometry
     * @zh 更新动态子网格的几何数据
     * @param primitiveIndex @en sub mesh index @zh 子网格索引
     * @param dynamicGeometry @en sub mesh geometry data @zh 子网格几何数据
     */
    updateSubMesh(primitiveIndex: number, dynamicGeometry: IDynamicGeometry): void;
    /**
     * @en Destroy the mesh and release all related GPU resources
     * @zh 销毁此网格，并释放它占有的所有 GPU 资源。
     */
    destroy(): boolean;
    /**
     * @en Release all related GPU resources
     * @zh 释放此网格占有的所有 GPU 资源。
     */
    destroyRenderingMesh(): void;
    /**
     * @en Reset the struct and data of the mesh
     * @zh 重置此网格的结构和数据。
     * @param struct @en The new struct @zh 新结构
     * @param data @en The new data @zh 新数据
     * @deprecated Will be removed in v3.0.0, please use [[reset]] instead
     */
    assign(struct: Mesh.IStruct, data: Uint8Array): void;
    /**
     * @en Reset the mesh with mesh creation information
     * @zh 重置此网格。
     * @param info @en Mesh creation information including struct and data @zh 网格创建信息，包含结构及数据
     */
    reset(info: Mesh.ICreateInfo): void;
    /**
     * @en Get [[geometry.AABB]] bounds in the skeleton's bone space
     * @zh 获取骨骼变换空间内下的 [[geometry.AABB]] 包围盒
     * @param skeleton @en skeleton data @zh 骨骼信息
     * @param skeleton @en skeleton data @zh 骨骼信息
     */
    getBoneSpaceBounds(skeleton: Skeleton): (geometry.AABB | null)[];
    /**
     * @en Merge the given mesh into the current mesh
     * @zh 合并指定的网格到此网格中。
     * @param mesh @en The mesh to be merged @zh 要合并的网格
     * @param worldMatrix @en The world matrix of the given mesh @zh 给定网格的模型变换矩阵
     * @param validate @en Whether to validate the mesh @zh 是否验证网格顶点布局
     * @returns @en whether the merging was successful or not @zh 返回合并成功与否
     */
    merge(mesh: Mesh, worldMatrix?: Mat4, validate?: boolean): boolean;
    /**
     * @en Validation for whether the given mesh can be merged into the current mesh.
     * To pass the validation, it must satisfy either of these two requirements:
     * - When the current mesh have no data
     * - When the two mesh have the same vertex bundle count, the same sub meshes count, and the same sub mesh layout.
     *
     * Same mesh layout means:
     * - They have the same primitive type and reference to the same amount vertex bundle with the same indices.
     * - And they all have or don't have index view
     * @zh 验证指定网格是否可以合并至当前网格。
     *
     * 当满足以下条件之一时，指定网格可以合并至当前网格：
     *  - 当前网格无数据而待合并网格有数据；
     *  - 它们的顶点块数目相同且对应顶点块的布局一致，并且它们的子网格数目相同且对应子网格的布局一致。
     *
     * 两个顶点块布局一致当且仅当：
     *  - 它们具有相同数量的顶点属性且对应的顶点属性具有相同的属性格式。
     *
     * 两个子网格布局一致，当且仅当：
     *  - 它们具有相同的图元类型并且引用相同数量、相同索引的顶点块；并且，
     *  - 要么都需要索引绘制，要么都不需要索引绘制。
     * @param mesh @en The other mesh to be validated @zh 待验证的网格
     */
    validateMergingMesh(mesh: Mesh): boolean;
    /**
     * @en Read the requested attribute of the given sub mesh
     * @zh 读取子网格的指定属性。
     * @param primitiveIndex @en Sub mesh index @zh 子网格索引
     * @param attributeName @en Attribute name @zh 属性名称
     * @returns @en Return null if not found or can't read, otherwise, will create a large enough typed array to contain all data of the attribute,
     * the array type will match the data type of the attribute. @zh 读取失败返回 null， 否则返回对应的类型数组
     */
    readAttribute(primitiveIndex: number, attributeName: AttributeName): TypedArray | null;
    /**
     * @en Read the requested attribute of the given sub mesh and fill into the given buffer.
     * @zh 读取子网格的指定属性到目标缓冲区中。
     * @param primitiveIndex @en Sub mesh index @zh 子网格索引
     * @param attributeName @en Attribute name @zh 属性名称
     * @param buffer @en The target array buffer @zh 目标缓冲区
     * @param stride @en attribute stride @zh 属性跨距
     * @param offset @en The offset of the first attribute in the target buffer @zh 第一个属性在目标缓冲区的偏移
     * @returns @en false if failed to access attribute, true otherwise @zh 是否成功拷贝
     */
    copyAttribute(primitiveIndex: number, attributeName: AttributeName, buffer: ArrayBuffer, stride: number, offset: number): boolean;
    /**
     * @en Read the indices data of the given sub mesh
     * @zh 读取子网格的索引数据。
     * @param primitiveIndex @en Sub mesh index @zh 子网格索引
     * @returns @en Return null if not found or can't read, otherwise, will create a large enough typed array to contain all indices data,
     * the array type will use the corresponding stride size. @zh 读取失败返回 null，否则返回索引数据
     */
    readIndices(primitiveIndex: number): Uint8Array | Uint16Array | Uint32Array | null;
    /**
     * @en Read the indices data of the given sub mesh and fill into the given array
     * @zh 读取子网格的索引数据到目标数组中。
     * @param primitiveIndex @en Sub mesh index @zh 子网格索引
     * @param outputArray @en The target output array @zh 目标索引数组
     * @returns @en Return false if failed to access the indices data, return true otherwise. @zh 拷贝失败返回 false， 否则返回 true
     */
    copyIndices(primitiveIndex: number, outputArray: number[] | ArrayBufferView): boolean;
    /**
     * @en Read the format by attributeName of submesh
     * @zh 根据属性名读取子网格的属性信息。
     * @param primitiveIndex @en Sub mesh index @zh 子网格索引
     * @param attributeName @en Attribute name @zh 属性名称
     * @returns @en Return null if failed to read format, return the format otherwise. @zh 读取失败返回 null， 否则返回 format
     */
    readAttributeFormat(primitiveIndex: number, attributeName: AttributeName): FormatInfo | null;
    private _accessAttribute;
    private _createVertexBuffers;
    /**
     * @en default init
     * @zh 默认初始化
     * @param uuid @en asset uuid @zh 资源 uuid
     */
    initDefault(uuid?: string): void;
    /**
     * @en Set whether the data of this mesh could be accessed (read or wrote), it could be used only for static mesh
     * @zh 设置此网格的数据是否可被存取，此接口只针对静态网格资源生效
     * @param allowDataAccess @en Indicate whether the data of this mesh could be accessed (read or wrote) @zh 是否允许存取网格数据
     */
    set allowDataAccess(allowDataAccess: boolean);
    /**
     * @en Get whether the data of this mesh could be read or wrote
     * @zh 获取此网格的数据是否可被存取
     * @return @en whether the data of this mesh could be accessed (read or wrote) @zh 此网格的数据是否可被存取
     */
    get allowDataAccess(): boolean;
    private releaseData;
}
export declare function decodeMesh(mesh: Mesh.ICreateInfo): Mesh.ICreateInfo;
export declare function inflateMesh(mesh: Mesh.ICreateInfo): Mesh.ICreateInfo;
export declare function dequantizeMesh(mesh: Mesh.ICreateInfo): Mesh.ICreateInfo;
