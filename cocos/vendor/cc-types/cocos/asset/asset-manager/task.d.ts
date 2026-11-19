export interface ITaskOption {
    onComplete?: ((err: Error | null | undefined, data: any) => void) | null;
    onProgress?: ((...args: any[]) => void) | null;
    onError?: ((...args: any[]) => void) | null;
    input: any;
    progress?: any;
    options?: Record<string, any> | null;
}
/**
 * @en
 * Tasks are the smallest unit of data running in the pipeline, You can create a task and pass in the input information,
 * and then get the output of that task after it has been executed in the pipeline to use.
 *
 * @zh
 * 任务是在管线中运行的最小数据单位，你可以创建一个任务并传入输入信息，在经过管线执行后获取该任务的输出来使用。
 *
 */
export default class Task {
    /**
     * @engineInternal
     * @mangle
     */
    static MAX_DEAD_NUM: number;
    /**
     * @en
     * Create a new task from pool.
     *
     * @zh
     * 从对象池中创建 task。
     *
     * @param options @en Some optional parameters. @zh 一些可选参数。
     * @param options.onComplete
     * @en Callback when the task complete, if the pipeline is synchronous, onComplete is unnecessary.
     * @zh 任务完成后的回调，如果流水线是同步的，onComplete 是不必要的。
     * @param options.onProgress
     * @en Continuously callback when the task is running, if the pipeline is synchronous, onProgress is unnecessary.
     * @zh 在任务运行时持续回调，如果管道是同步的，onProgress 是不必要的。
     * @param options.onError
     * @en Callback when something goes wrong, if the pipeline is synchronous, onError is unnecessary.
     * @zh 出错时的回调，如果流水线是同步的，onError 是不必要的。
     * @param options.input @en Something will be handled with pipeline. @zh 需要被此管道处理的任务数据。
     * @param options.progress @en Progress information. @zh 进度信息。
     * @param options.options @en Custom parameters. @zh 自定义参数。
     * @returns @en return a newly created task. @zh 返回一个新创建的任务。
     *
     */
    static create(options: ITaskOption): Task;
    private static _taskId;
    private static _deadPool;
    /**
     * @en
     * The id of task.
     *
     * @zh
     * 任务 id。
     *
     */
    id: number;
    /**
     * @en
     * The callback when task is completed.
     *
     * @zh
     * 完成回调。
     *
     */
    onComplete: ((err: Error | null | undefined, data: any) => void) | null;
    /**
     * @en
     * The callback of progression.
     *
     * @zh
     * 进度回调。
     *
     */
    onProgress: ((...args: any[]) => void) | null;
    /**
     * @en
     * The callback when something goes wrong.
     *
     * @zh
     * 错误回调。
     *
     */
    onError: ((...args: any[]) => void) | null;
    /**
     * @en
     * The source data of task.
     *
     * @zh
     * 任务的源数据。
     *
     */
    source: any;
    /**
     * @en
     * The output of task.
     *
     * @zh
     * 任务的输出。
     */
    output: any;
    /**
     * @en
     * The input of task.
     *
     * @zh
     * 任务的输入。
     *
     */
    input: any;
    /**
     * @en
     * The progression of task.
     *
     * @zh
     * 任务的进度。
     *
     */
    progress: any;
    /**
     * @en
     * Custom options.
     *
     * @zh
     * 自定义参数。
     *
     */
    options: Record<string, any> | null;
    /**
     * @deprecated Typo. Since v3.7, please use [[Task.isFinished]] instead.
     */
    get isFinish(): boolean;
    /**
     * @deprecated Typo. Since v3.7, please use [[Task.isFinished]] instead.
     */
    set isFinish(val: boolean);
    /**
     * @en
     * Whether or not this task is completed.
     *
     * @zh
     * 此任务是否已经完成。
     *
     */
    isFinished: boolean;
    /**
     * @en
     * Create a new Task.
     *
     * @zh
     * 创建一个任务。
     *
     * @param options @en Some optional parameters. @zh 一些可选参数。
     * @param options.onComplete
     * @en Callback when the task complete, if the pipeline is synchronous, onComplete is unnecessary.
     * @zh 任务完成后的回调，如果流水线是同步的，onComplete 是不必要的。
     * @param options.onProgress
     * @en Continuously callback when the task is running, if the pipeline is synchronous, onProgress is unnecessary.
     * @zh 在任务运行时持续回调，如果管道是同步的，onProgress 是不必要的。
     * @param options.onError
     * @en Callback when something goes wrong, if the pipeline is synchronous, onError is unnecessary.
     * @zh 出错时的回调，如果流水线是同步的，onError 是不必要的。
     * @param options.input @en Something will be handled with pipeline. @zh 需要被此管道处理的任务数据。
     * @param options.progress @en Progress information. @zh 进度信息。
     * @param options.options @en Custom parameters. @zh 自定义参数。
     * @returns @en return a newly created task. @zh 返回一个新创建的任务。
     */
    constructor(options?: ITaskOption);
    /**
     * @en
     * Set parameters of this task.
     *
     * @zh
     * 设置任务的参数。
     *
     * @param options @en Some optional parameters. @zh 一些可选参数。
     * @param options.onComplete
     * @en Callback when the task complete, if the pipeline is synchronous, onComplete is unnecessary.
     * @zh 任务完成后的回调，如果流水线是同步的，onComplete 是不必要的。
     * @param options.onProgress
     * @en Continuously callback when the task is running, if the pipeline is synchronous, onProgress is unnecessary.
     * @zh 在任务运行时持续回调，如果管道是同步的，onProgress 是不必要的。
     * @param options.onError
     * @en Callback when something goes wrong, if the pipeline is synchronous, onError is unnecessary.
     * @zh 出错时的回调，如果流水线是同步的，onError 是不必要的。
     * @param options.input @en Something will be handled with pipeline. @zh 需要被此管道处理的任务数据。
     * @param options.progress @en Progress information. @zh 进度信息。
     * @param options.options @en Custom parameters. @zh 自定义参数。
     * @returns @en return a newly created task. @zh 返回一个新创建的任务。
     *
     * @example
     * const task = new Task();
     * task.set({input: ['test'], onComplete: (err, result) => console.log(err), onProgress: (finish, total) => console.log(finish / total)});
     *
     */
    set(options?: ITaskOption): void;
    /**
     * @en
     * Dispatch event with any parameter.
     *
     * @zh
     * 分发事件，可以传递任意参数。
     *
     * @param event @en The event name. @zh 事件名称。
     * @param param1 @en The parameter 1. @zh 参数 1。
     * @param param2 @en The parameter 2. @zh 参数 2。
     * @param param3 @en The parameter 3. @zh 参数 3。
     * @param param4 @en The parameter 4. @zh 参数 4。
     *
     * @example
     * const task = Task.create();
     * task.onComplete = (msg) => console.log(msg);
     * task.dispatch('complete', 'hello world');
     *
     */
    dispatch(event: string, param1?: any, param2?: any, param3?: any, param4?: any): void;
    /**
     * @en
     * Recycle this task to be reused.
     *
     * @zh
     * 回收 task 用于复用。
     *
     */
    recycle(): void;
}
