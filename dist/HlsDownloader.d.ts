export type Headers = {
    [p: string]: string;
};
export declare class HlsDownloader {
    downloadAsync(urls: string[], headers: Headers, baseDirPath: string, outName: string, parallel?: number): Promise<void>;
    downloadChunk(url: string, headers: Headers, num: number, outDirPath: string): Promise<void>;
    private requestChunk;
    concatTsFiles(outDirPath: string): Promise<void>;
}
