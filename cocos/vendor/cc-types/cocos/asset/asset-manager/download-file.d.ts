export type FileProgressCallback = (loaded: number, total: number) => void;
export default function downloadFile(url: string, options: Record<string, any>, onProgress: FileProgressCallback | null | undefined, onComplete: ((err: Error | null, data?: any) => void)): XMLHttpRequest;
