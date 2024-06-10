interface MasterPlaylist {
    resolutions: Resolution[];
}
interface Resolution {
    resolution: number;
    name: string;
}
interface MediaPlaylist {
    segmentPaths: string[];
    initSectionPath: string | undefined;
    ext: string;
}
interface MediaPaths {
    segmentPaths: string[];
    ext: string;
}
export declare class HlsParser {
    isMedia(m3u8: string): boolean;
    parseMasterPlaylist(m3u8: string): MasterPlaylist;
    parseMediaPlaylist(m3u8: string, baseUrlParam?: string): MediaPaths;
    parseMediaPlaylistRaw(m3u8: string): MediaPlaylist;
    private parseElems;
}
export {};
