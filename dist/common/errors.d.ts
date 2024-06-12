export declare class M3u8ElemError extends Error {
    constructor(value?: string, cause?: unknown | undefined);
}
export declare class HttpError extends Error {
    readonly response: Response;
    constructor(response: Response, message?: string, cause?: unknown | undefined);
}
