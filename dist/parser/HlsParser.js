import { M3u8ElemError } from "../common/errors.js";
import { getExt } from "utils-js/path";
import { mergeIntersectedStrings } from "utils-js/string";
export class HlsParser {
    isMedia(m3u8) {
        return m3u8.includes("#EXTINF");
    }
    parseMasterPlaylist(m3u8) {
        const elems = this.parseElems(m3u8)
            .filter(it => it.header.startsWith("#EXT-X-STREAM-INF"));
        const resolutions = elems.map(elem => {
            const match = elem.header.match(/RESOLUTION=\d*x(\d*)/);
            if (match === null || match.length < 2)
                throw new M3u8ElemError(`${elem}`);
            const resolution = parseInt(match[1]);
            if (isNaN(resolution))
                throw new M3u8ElemError(`${elem}`);
            const name = elem.value;
            if (name === undefined)
                throw new M3u8ElemError(`${elem}`);
            return { resolution, name };
        });
        return { resolutions };
    }
    parseMediaPlaylist(m3u8, baseUrlParam = "") {
        let baseUrl = baseUrlParam;
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, baseUrl.length - 1);
        }
        const { segmentPaths: segPaths, initSectionPath, ext } = this.parseMediaPlaylistRaw(m3u8);
        const originPaths = [];
        if (initSectionPath !== undefined)
            originPaths.push(initSectionPath);
        for (const path of segPaths)
            originPaths.push(path);
        const segmentPaths = originPaths.map(path => {
            if (path.match(/https?:/) !== null) {
                return path;
            }
            else {
                let newPath = path;
                if (!newPath.startsWith("/")) {
                    newPath = "/" + newPath;
                }
                return mergeIntersectedStrings(baseUrl, newPath);
            }
        });
        return { segmentPaths, ext };
    }
    parseMediaPlaylistRaw(m3u8) {
        const elems = this.parseElems(m3u8);
        const segElems = elems.filter(it => it.header.startsWith("#EXTINF"));
        const segmentPaths = segElems.map(elem => {
            const path = elem.value;
            if (path === undefined)
                throw new M3u8ElemError(`${elem}`);
            return path;
        });
        let initSectionPath = undefined;
        const initElem = elems.find(elem => elem.header.startsWith("#EXT-X-MAP"));
        if (initElem !== undefined) {
            const match = initElem.header.match(/URI="(.*)"/i);
            if (match !== null && match.length > 1) {
                initSectionPath = match[1];
            }
        }
        let ext = "ts";
        if (initSectionPath !== undefined) {
            ext = getExt(initSectionPath);
        }
        else if (segmentPaths.length > 0) {
            ext = getExt(segmentPaths[0]);
        }
        return { segmentPaths, initSectionPath, ext };
    }
    parseElems(m3u8) {
        if (m3u8.length === 0)
            throw new Error("empty m3u8");
        const rawElems = [];
        if (m3u8[0] !== "#")
            throw new Error("invalid m3u8");
        let curIdx = -1;
        for (const ch of m3u8) {
            if (ch === "#") {
                rawElems.push("");
                curIdx++;
            }
            rawElems[curIdx] += ch;
        }
        return rawElems.map(raw => {
            const chunks = raw
                .split(/\r?\n/)
                .filter(it => it !== "");
            if (chunks.length !== 1 && chunks.length !== 2)
                throw Error("invalid m3u8 element");
            return { header: chunks[0], value: chunks[1] };
        });
    }
}
