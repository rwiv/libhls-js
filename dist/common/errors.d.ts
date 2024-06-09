export declare class M3u8ElemError extends Error {
    constructor(value?: string, cause?: unknown | undefined);
}
export declare class HttpError extends Error {
    readonly status: number;
    constructor(status: number, message?: string, cause?: unknown | undefined);
}
export declare class MultipleError extends Error {
    readonly errors: any[];
    constructor(message: string, errors: any[], cause?: unknown | undefined);
}
