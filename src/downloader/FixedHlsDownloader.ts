import {HlsDownloadManager} from "./HlsDownloadManager.js";
import {subListsWithIdx} from "utils-js/list";
import {logger} from "utils-js/logger";
import path from "path";
import {exists} from "utils-js/file";
import fs from "fs-extra";
import {HlsDownloader, HttpRequestHeaders} from "../common/types.js";

export interface FixedHlsDownloaderArgs {
  urls: string[]
  headers: HttpRequestHeaders,
  baseDirPath: string,
  outName: string,
  ext?: string,
  parallel?: number,
}

export class FixedHlsDownloader implements HlsDownloader {

  private readonly manager = new HlsDownloadManager();

  constructor(private readonly args: FixedHlsDownloaderArgs) {}

  async download() {
    let {urls, headers, baseDirPath, outName, ext, parallel} = this.args;
    ext = ext || "ts";
    parallel = parallel || 10;

    const subs = subListsWithIdx(urls, parallel);
    for (const sub of subs) {
      logger.info(`${sub[0].idx}-${sub[0].idx + parallel}`);
      const tempDirPath = path.resolve(baseDirPath, outName);
      if (!await exists(tempDirPath)) {
        await fs.ensureDir(tempDirPath);
      }

      const promises = sub.map(elem => {
        return this.manager.downloadSegment(elem.value, headers, elem.idx, tempDirPath);
      });
      await Promise.all(promises);

      await this.manager.concatTsFiles(tempDirPath, ext);
      await fs.remove(tempDirPath);
    }
  }
}