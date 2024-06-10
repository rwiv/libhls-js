import fs from "fs-extra";
import path from "path";
import {getDirPath, getFilename} from "utils-js/path";
import {Retry} from "utils-js/retry";
import {readdir} from "utils-js/file";
import {HttpError} from "../common/errors.js";
import {HttpRequestHeaders} from "../common/types.js";

export class HlsDownloadManager {

  async downloadSegment(
    url: string,
    headers: HttpRequestHeaders,
    num: number,
    outDirPath: string,
  ) {
    const res = await this.requestSegment(url, headers);
    if (res.status >= 400) {
      throw new HttpError(res.status);
    }

    const filePath = path.resolve(outDirPath, `${num + 1}.ts`);
    const reader = res.body?.getReader();
    if (reader === undefined) {
      throw Error("reader is null");
    }
    let read = await reader.read();
    while (!read.done) {
      if (read.value !== undefined) {
        await fs.appendFile(filePath, read.value);
      }
      read = await reader.read();
    }
  }

  @Retry(3)
  async requestSegment(url: string, headers: HttpRequestHeaders) {
    return fetch(url, { method: 'GET', headers });
  }

  async concatTsFiles(outDirPath: string, ext: string = "ts") {
    let files = await readdir(outDirPath);
    files.sort((a, b) => {
      const aa = parseInt(getDirPath(a.filename, "."));
      const bb = parseInt(getDirPath(b.filename, "."));
      if (isNaN(aa) || isNaN(bb)) {
        throw Error("parsed data is NaN");
      }
      return aa - bb;
    });
    const filename = getFilename(outDirPath) + "." + ext;
    const filePath = path.resolve(outDirPath, "..", filename);
    for (const file of files) {
      const buffer = await fs.readFile(file.absPath);
      await fs.appendFile(filePath, buffer);
    }
  }
}