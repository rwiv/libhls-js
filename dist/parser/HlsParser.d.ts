interface MasterPlaylist {
    resolutions: Resolution[];
}
interface Resolution {
    resolution: number;
    name: string;
}
export declare class HlsParser {
    isMedia(m3u8: string): boolean;
    parseMasterPlaylist(m3u8: string): MasterPlaylist;
    parseMediaPlaylist(m3u8: string): {
        segmentPaths: string[];
    };
    private parseElems;
}
export {};
