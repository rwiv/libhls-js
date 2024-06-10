import {HlsDownloadManager} from "./HlsDownloadManager.js";
import path from "path";
import {exists} from "utils-js/file";
import fs from "fs-extra";
import {HttpError, MultipleError} from "../common/errors.js";
import {HlsDownloader, HttpRequestHeaders} from "../common/types.js";
import {logger} from "utils-js/logger";
import {removeQueryString} from "utils-js/url";
import {getExt} from "utils-js/path";

export type RequestStatus = "PROGRESS" | "COMPLETE";

export interface ContinuousHlsDownloaderArgs {
  baseUrl: string,
  headers: HttpRequestHeaders,
  baseDirPath: string,
  outName: string,
  getUrl: (num: number, baseUrl: string) => string,
  initNum?: number,
  parallel?: number,
}

export class ContinuousHlsDownloader implements HlsDownloader {

  private readonly manager = new HlsDownloadManager();

  constructor(private readonly args: ContinuousHlsDownloaderArgs) {}

  async download() {
    let {baseUrl, headers, baseDirPath, outName, getUrl, initNum, parallel} = this.args;
    initNum = initNum || 0;
    parallel = parallel || 10;

    let ext = getExt(removeQueryString(baseUrl));
    if (ext === "") {
      ext = "ts";
    }

    let num = initNum;
    let msCnt = 0;
    while (true) {
      const outDirPath = path.resolve(baseDirPath, outName);
      if (!await exists(outDirPath)) {
        await fs.ensureDir(outDirPath);
      }

      const promises: Promise<RequestStatus>[] = [];
      for (let i = 0; i < parallel; i++) {
        const url = getUrl(num, baseUrl);
        const promise = this.downloadSegmentWrapper(url, headers, num, outDirPath);
        promises.push(promise);
        num++;

        msCnt++;
        if (msCnt === parallel) {
          logger.info(`${num-parallel}-${num}`);
          msCnt = 0;
        }
      }
      const result = await Promise.allSettled(promises);

      await this.manager.concatTsFiles(outDirPath, ext);
      await fs.remove(outDirPath);

      const errors = result
        .filter(it => it.status === "rejected")
        .map(it => (it as any).reason);

      if (errors.length > 0) {
        throw new MultipleError("download requests errors", errors);
      }

      const completes = result.filter(it => {
        return ((it as any).value as RequestStatus) === "COMPLETE";
      });
      if (completes.length > 0) {
        break;
      }
    }
  }

  private async downloadSegmentWrapper(
    url: string,
    headers: HttpRequestHeaders,
    num: number,
    outDirPath: string,
  ): Promise<RequestStatus> {
    try {
      await this.manager.downloadSegment(url, headers, num, outDirPath);
      return "PROGRESS";
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status > 400) {
          return "COMPLETE";
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }
  }
}