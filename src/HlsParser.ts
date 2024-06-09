import {M3u8ElemError} from "./errors.js";

interface MasterPlaylist {
  resolutions: Resolution[];
}

interface Resolution {
  resolution: number;
  name: string;
}

interface MediaPlaylist {
  segmentPaths: string[];
}

interface M3u8Element {
  header: string;
  value: string | undefined;
}

export class HlsParser {

  isMedia(m3u8: string): boolean {
    return m3u8.includes("#EXTINF");
  }

  parseMasterPlaylist(m3u8: string): MasterPlaylist {
    const elems = this.parseElems(m3u8)
      .filter(it => it.header.startsWith("#EXT-X-STREAM-INF"))

    const resolutions: Resolution[] = elems.map(elem => {
      const match = elem.header.match(/RESOLUTION=\d*x(\d*)/)
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

    return {resolutions};
  }

  parseMediaPlaylist(m3u8: string) {
    const elems = this.parseElems(m3u8)
      .filter(it => it.header.startsWith("#EXTINF"))

    const segmentPaths = elems.map(elem => {
      const path = elem.value;
      if (path === undefined)
        throw new M3u8ElemError(`${elem}`);
      return path;
    });

    return {segmentPaths};
  }

  private parseElems(m3u8: string): M3u8Element[] {
    if (m3u8.length === 0)
      throw new Error("empty m3u8");

    const rawElems: string[] = [];
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