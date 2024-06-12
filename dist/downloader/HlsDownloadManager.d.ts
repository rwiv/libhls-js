import { HttpRequestHeaders } from "../common/types.js";
export declare class HlsDownloadManager {
    requestSegment(url: string, headers: HttpRequestHeaders): Promise<Response>;
    writeTempFile(res: Response, num: number, outDirPath: string): Promise<void>;
    concatTsFiles(outDirPath: string, ext?: string): Promise<void>;
}
