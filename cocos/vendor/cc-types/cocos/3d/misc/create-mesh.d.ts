import { Mesh } from '../assets/mesh';
import { IGeometry, IDynamicGeometry, ICreateMeshOptions, ICreateDynamicMeshOptions } from '../../primitive/define';
/**
 * @deprecated
 */
export declare function createMesh(geometry: IGeometry, out?: Mesh, options?: ICreateMeshOptions): Mesh;
/**
 * @en mesh utility class, use to create mesh.
 * @zh 网格工具类，用于创建网格。
 */
export declare class MeshUtils {
    /**
     * @en create a static mesh.
     * @zh 创建一个静态网格。
     * @param geometry @en geometry data use for creating @zh 用于创建的几何数据
     * @param out @en output static mesh @zh 输出的静态网格
     * @param options @en options of creating @zh 创建选项
     * @return @en The created static mesh, which is same as out @zh 新创建的静态网格，同 out 参数
     */
    static createMesh(geometry: IGeometry, out?: Mesh, options?: ICreateMeshOptions): Mesh;
    /**
     * @en create a dynamic mesh.
     * @zh 创建一个动态网格。
     * @param primitiveIndex @en sub mesh index @zh 子网格索引
     * @param geometry @en geometry data use for creating @zh 用于创建的几何数据
     * @param out @en output dynamic mesh @zh 输出的动态网格
     * @param options @en options of creating @zh 创建选项
     * @return @en The created dynamic mesh, which is same as out @zh 新创建的动态网格，同 out 参数
     */
    static createDynamicMesh(primitiveIndex: number, geometry: IDynamicGeometry, out?: Mesh, options?: ICreateDynamicMeshOptions): Mesh;
    /**
     * @en decode a mesh.
     *
     * @engineInternal
     */
    static decodeMesh(mesh: Mesh.ICreateInfo): Mesh.ICreateInfo;
    /**
     * @en inflate a mesh.
     *
     * @engineInternal
     */
    static inflateMesh(mesh: Mesh.ICreateInfo): Mesh.ICreateInfo;
}
export declare namespace createMesh {
    /**
     * @deprecated
     */
    interface IOptions {
        /**
         * @en calculate mesh's aabb or not
         * @zh 是否计算模型的包围盒。
         */
        calculateBounds?: boolean;
    }
}
