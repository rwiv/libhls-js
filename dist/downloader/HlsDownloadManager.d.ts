import { HttpRequestHeaders } from "../common/types.js";
export declare class HlsDownloadManager {
    downloadSegment(url: string, headers: HttpRequestHeaders, num: number, outDirPath: string): Promise<void>;
    requestSegment(url: string, headers: HttpRequestHeaders): Promise<Response>;
    concatTsFiles(outDirPath: string, ext?: string): Promise<void>;
}
