import { HlsDownloader, HttpRequestHeaders } from "../common/types.js";
export interface FixedHlsDownloaderArgs {
    urls: string[];
    headers: HttpRequestHeaders;
    baseDirPath: string;
    outName: string;
    ext?: string;
    parallel?: number;
}
export declare class FixedHlsDownloader implements HlsDownloader {
    private readonly args;
    private readonly manager;
    constructor(args: FixedHlsDownloaderArgs);
    download(): Promise<void>;
}
