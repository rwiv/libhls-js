import { HlsDownloader, HttpRequestHeaders } from "../common/types.js";
export type RequestStatus = "PROGRESS" | "COMPLETE";
export interface ContinuousHlsDownloaderArgs {
    baseUrl: string;
    headers: HttpRequestHeaders;
    baseDirPath: string;
    outName: string;
    getUrl: (num: number, baseUrl: string) => string;
    initNum?: number;
    parallel?: number;
}
export declare class ContinuousHlsDownloader implements HlsDownloader {
    private readonly args;
    private readonly manager;
    constructor(args: ContinuousHlsDownloaderArgs);
    download(): Promise<void>;
    private downloadSegmentWrapper;
}
